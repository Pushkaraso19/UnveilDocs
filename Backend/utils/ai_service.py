import google.generativeai as genai
import logging
import json
import time
import asyncio
from typing import Dict, List, Optional, Any
from config import Config
from .demo_service import DemoAIService

# Optional Vertex AI imports
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, Part
    from google.cloud import aiplatform
    HAS_VERTEX_AI = True
except ImportError:
    HAS_VERTEX_AI = False
    vertexai = None
    GenerativeModel = None
    Part = None
    aiplatform = None

# Setup logging
logger = logging.getLogger(__name__)

class RetryConfig:
    """Configuration for retry mechanisms."""
    MAX_RETRIES = 3
    BASE_DELAY = 1.0
    MAX_DELAY = 60.0
    EXPONENTIAL_BASE = 2.0
    
class AIServiceError(Exception):
    """Custom exception for AI service errors."""
    def __init__(self, message: str, error_type: str = "general", details: Dict = None):
        super().__init__(message)
        self.error_type = error_type
        self.details = details or {}

class GoogleCloudAI:
    """Enhanced Google Cloud AI integration with comprehensive error handling."""
    
    def __init__(self):
        """Initialize Google Cloud AI services with enhanced error handling."""
        self.gemini_model = None
        self.vertex_model = None
        self.initialization_errors = []
        
        try:
            self._initialize_gemini()
            self._initialize_vertex_ai()
            
            if not self.gemini_model and not self.vertex_model:
                raise AIServiceError(
                    "No AI models available after initialization",
                    "initialization",
                    {"errors": self.initialization_errors}
                )
                
            logger.info("Google Cloud AI initialized successfully")
            
        except Exception as e:
            logger.error(f"Critical error initializing Google Cloud AI: {str(e)}")
            self.initialization_errors.append(str(e))
    
    def _initialize_gemini(self):
        """Initialize Gemini API with error handling."""
        try:
            if not Config.GOOGLE_API_KEY:
                self.initialization_errors.append("GOOGLE_API_KEY not configured")
                return
                
            genai.configure(api_key=Config.GOOGLE_API_KEY)
            
            # Try gemini-1.5-flash first (higher quota), then fallback models
            models_to_try = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
            
            for model_name in models_to_try:
                try:
                    self.gemini_model = genai.GenerativeModel(model_name)
                    # Test the model with a simple request
                    test_response = self.gemini_model.generate_content("Test")
                    logger.info(f"Successfully initialized Gemini model: {model_name}")
                    return
                except Exception as e:
                    logger.warning(f"Failed to initialize {model_name}: {str(e)}")
                    continue
            
            self.initialization_errors.append("All Gemini models failed to initialize")
            
        except Exception as e:
            error_msg = f"Gemini initialization failed: {str(e)}"
            logger.error(error_msg)
            self.initialization_errors.append(error_msg)
    
    def _initialize_vertex_ai(self):
        """Initialize Vertex AI with error handling."""
        if not HAS_VERTEX_AI:
            self.initialization_errors.append("Vertex AI dependencies not installed")
            return
            
        if not Config.GOOGLE_CLOUD_PROJECT_ID or not Config.VERTEX_AI_LOCATION:
            self.initialization_errors.append("Vertex AI configuration incomplete")
            return
            
        try:
            vertexai.init(
                project=Config.GOOGLE_CLOUD_PROJECT_ID,
                location=Config.VERTEX_AI_LOCATION
            )
            self.vertex_model = GenerativeModel(Config.VERTEX_AI_MODEL)
            logger.info("Vertex AI initialized successfully")
            
        except Exception as e:
            error_msg = f"Vertex AI initialization failed: {str(e)}"
            logger.warning(error_msg)
            self.initialization_errors.append(error_msg)
    
    def _get_available_model(self):
        """Get the first available model with fallback logic."""
        if self.gemini_model:
            return self.gemini_model, "gemini"
        elif self.vertex_model:
            return self.vertex_model, "vertex"
        else:
            raise AIServiceError(
                "No AI models available",
                "no_models",
                {"initialization_errors": self.initialization_errors}
            )
    
    async def _execute_with_retry(self, operation, *args, **kwargs):
        """Execute operation with exponential backoff retry."""
        last_exception = None
        
        for attempt in range(RetryConfig.MAX_RETRIES + 1):
            try:
                if asyncio.iscoroutinefunction(operation):
                    return await operation(*args, **kwargs)
                else:
                    return operation(*args, **kwargs)
                    
            except Exception as e:
                last_exception = e
                error_type = self._classify_error(e)
                
                # Don't retry certain types of errors
                if error_type in ['authentication', 'quota_exceeded', 'invalid_input']:
                    logger.error(f"Non-retryable error on attempt {attempt + 1}: {str(e)}")
                    raise AIServiceError(str(e), error_type)
                
                if attempt < RetryConfig.MAX_RETRIES:
                    delay = min(
                        RetryConfig.BASE_DELAY * (RetryConfig.EXPONENTIAL_BASE ** attempt),
                        RetryConfig.MAX_DELAY
                    )
                    logger.warning(f"Attempt {attempt + 1} failed, retrying in {delay}s: {str(e)}")
                    await asyncio.sleep(delay)
                else:
                    logger.error(f"All {RetryConfig.MAX_RETRIES + 1} attempts failed")
        
        raise AIServiceError(
            f"Operation failed after {RetryConfig.MAX_RETRIES + 1} attempts: {str(last_exception)}",
            "max_retries_exceeded",
            {"last_error": str(last_exception), "attempts": RetryConfig.MAX_RETRIES + 1}
        )
    
    def _classify_error(self, error: Exception) -> str:
        """Classify error for retry logic."""
        error_str = str(error).lower()
        
        if any(term in error_str for term in ['api key', 'authentication', 'unauthorized']):
            return 'authentication'
        elif any(term in error_str for term in ['quota', 'rate limit', 'too many requests']):
            return 'quota_exceeded'
        elif any(term in error_str for term in ['invalid', 'bad request', 'malformed']):
            return 'invalid_input'
        elif any(term in error_str for term in ['timeout', 'connection', 'network']):
            return 'network'
        elif any(term in error_str for term in ['internal', 'server error', '500']):
            return 'server_error'
        else:
            return 'unknown'
    
    async def analyze_legal_document(self, document_text: str, analysis_type: str = "comprehensive") -> Dict[str, Any]:
        """
        Analyze legal document using Google Cloud AI with comprehensive error handling.
        
        Args:
            document_text: The document text to analyze
            analysis_type: Type of analysis ("comprehensive", "summary", "key_points", "risks")
            
        Returns:
            Dictionary containing analysis results
        """
        try:
            # Input validation
            if not document_text or len(document_text.strip()) < 10:
                raise AIServiceError(
                    "Document text is too short or empty",
                    "invalid_input",
                    {"text_length": len(document_text) if document_text else 0}
                )
            
            # Check if demo mode is enabled
            if Config.DEMO_MODE:
                logger.info("Demo mode enabled - returning mock response")
                demo_result = DemoAIService.process_document(document_text, analysis_type)
                return {
                    'success': True,
                    'analysis_type': analysis_type,
                    'model_used': 'demo',
                    'result': demo_result,
                    'raw_response': f"Demo response for {analysis_type} analysis",
                    'error': None,
                    'processing_time': 0.1,
                    'token_usage': {'input': 0, 'output': 0}
                }
            
            start_time = time.time()
            
            # Truncate document if too long (to prevent token limit issues)
            max_chars = 100000  # Adjust based on model limits
            if len(document_text) > max_chars:
                logger.warning(f"Document too long ({len(document_text)} chars), truncating to {max_chars}")
                document_text = document_text[:max_chars] + "...[TRUNCATED]"
            
            model, model_type = self._get_available_model()
            
            # Create analysis prompt based on type
            prompt = self._create_analysis_prompt(document_text, analysis_type)
            
            # Generate response with retry logic
            async def generate_content():
                if model_type == "gemini":
                    response = model.generate_content(prompt)
                    return response.text, getattr(response, 'usage_metadata', None)
                else:  # vertex
                    response = model.generate_content(prompt)
                    return response.text, getattr(response, 'usage_metadata', None)
            
            result_text, usage_metadata = await self._execute_with_retry(generate_content)
            processing_time = time.time() - start_time
            
            # Parse the structured response
            parsed_result = self._parse_analysis_response(result_text, analysis_type)
            
            # Extract token usage if available
            token_usage = {}
            if usage_metadata:
                token_usage = {
                    'input': getattr(usage_metadata, 'prompt_token_count', 0),
                    'output': getattr(usage_metadata, 'candidates_token_count', 0),
                    'total': getattr(usage_metadata, 'total_token_count', 0)
                }
            
            return {
                'success': True,
                'analysis_type': analysis_type,
                'model_used': model_type,
                'result': parsed_result,
                'raw_response': result_text,
                'error': None,
                'processing_time': round(processing_time, 2),
                'token_usage': token_usage,
                'document_stats': {
                    'original_length': len(document_text),
                    'was_truncated': len(document_text) > max_chars
                }
            }
            
        except AIServiceError:
            # Re-raise custom errors
            raise
        except Exception as e:
            logger.error(f"Error analyzing document: {str(e)}")
            error_type = self._classify_error(e)
            
            return {
                'success': False,
                'analysis_type': analysis_type,
                'model_used': None,
                'result': {},
                'raw_response': '',
                'error': str(e),
                'error_type': error_type,
                'processing_time': 0,
                'token_usage': {},
                'document_stats': {
                    'original_length': len(document_text) if document_text else 0,
                    'was_truncated': False
                }
            }
    
    def _create_analysis_prompt(self, document_text: str, analysis_type: str) -> str:
        """Create comprehensive analysis prompt based on type."""
        
        base_context = f"""
        You are an expert legal analyst with extensive experience in contract review, legal document analysis, and risk assessment. 
        Please analyze the following legal document thoroughly and provide insights in a structured JSON format.
        
        Document to analyze:
        {document_text}
        
        """
        
        prompts = {
            "comprehensive": base_context + """
            Please provide a comprehensive legal analysis and return it as a valid JSON object with the following structure:
            
            {
                "document_summary": {
                    "document_type": "string - type of legal document",
                    "parties_involved": ["array of party names"],
                    "main_purpose": "string - primary purpose of the document",
                    "jurisdiction": "string - governing law/jurisdiction",
                    "effective_date": "string - when document takes effect",
                    "expiration_date": "string - when document expires",
                    "key_subject_matter": "string - what the document is about"
                },
                "key_provisions": [
                    {
                        "section": "string - provision title",
                        "content": "string - key content",
                        "importance": "high|medium|low",
                        "implications": "string - what this means"
                    }
                ],
                "rights_and_obligations": {
                    "party_1": {
                        "name": "string",
                        "rights": ["array of rights"],
                        "obligations": ["array of obligations"]
                    },
                    "party_2": {
                        "name": "string", 
                        "rights": ["array of rights"],
                        "obligations": ["array of obligations"]
                    }
                },
                "risk_assessment": {
                    "overall_risk_level": "low|medium|high|critical",
                    "financial_risks": [
                        {
                            "risk": "string - description",
                            "severity": "low|medium|high|critical",
                            "mitigation": "string - how to reduce risk"
                        }
                    ],
                    "legal_risks": [
                        {
                            "risk": "string - description", 
                            "severity": "low|medium|high|critical",
                            "mitigation": "string - how to reduce risk"
                        }
                    ],
                    "compliance_risks": [
                        {
                            "risk": "string - description",
                            "severity": "low|medium|high|critical", 
                            "mitigation": "string - how to reduce risk"
                        }
                    ]
                },
                "important_dates": [
                    {
                        "date": "string - date",
                        "description": "string - what happens on this date",
                        "criticality": "low|medium|high|critical"
                    }
                ],
                "financial_terms": {
                    "payment_amounts": ["array of payment amounts"],
                    "payment_schedule": "string - when payments are due",
                    "penalties": ["array of penalty descriptions"],
                    "fees": ["array of fee descriptions"],
                    "currency": "string - currency used"
                },
                "termination_clauses": [
                    {
                        "condition": "string - termination condition",
                        "notice_period": "string - required notice",
                        "consequences": "string - what happens upon termination"
                    }
                ],
                "dispute_resolution": {
                    "method": "string - mediation, arbitration, litigation, etc.",
                    "jurisdiction": "string - where disputes are resolved",
                    "governing_law": "string - which law applies"
                },
                "compliance_requirements": [
                    {
                        "requirement": "string - compliance requirement",
                        "responsible_party": "string - who is responsible",
                        "deadline": "string - when it must be done"
                    }
                ],
                "recommendations": [
                    {
                        "priority": "high|medium|low",
                        "recommendation": "string - what should be done",
                        "reason": "string - why this is recommended"
                    }
                ],
                "confidence_score": "number between 0 and 1",
                "analysis_notes": "string - any additional important observations"
            }
            
            Ensure your response is valid JSON and includes all sections even if some are empty arrays or null values.
            """,
            
            "summary": base_context + """
            Please provide a concise document summary as a valid JSON object:
            
            {
                "document_type": "string - type of document",
                "parties": ["array of main parties"],
                "purpose": "string - main purpose",
                "key_terms": ["array of most important terms"],
                "duration": "string - how long agreement lasts",
                "main_obligations": {
                    "party_1_obligations": ["array"],
                    "party_2_obligations": ["array"]
                },
                "critical_deadlines": ["array of important dates"],
                "financial_summary": "string - overview of financial terms",
                "confidence_score": "number between 0 and 1"
            }
            """,
            
            "key_points": base_context + """
            Please extract key points as a valid JSON object:
            
            {
                "critical_clauses": [
                    {
                        "clause": "string - clause text or reference",
                        "importance": "high|medium|low",
                        "explanation": "string - why this is important"
                    }
                ],
                "action_items": [
                    {
                        "action": "string - what needs to be done",
                        "responsible_party": "string - who does it",
                        "deadline": "string - when it's due",
                        "consequences": "string - what happens if not done"
                    }
                ],
                "deadlines": [
                    {
                        "date": "string",
                        "description": "string",
                        "importance": "high|medium|low"
                    }
                ],
                "financial_obligations": [
                    {
                        "amount": "string",
                        "due_date": "string", 
                        "responsible_party": "string",
                        "consequences_of_default": "string"
                    }
                ],
                "penalties": [
                    {
                        "trigger": "string - what causes penalty",
                        "penalty": "string - what the penalty is",
                        "amount": "string - penalty amount if specified"
                    }
                ],
                "special_conditions": [
                    {
                        "condition": "string",
                        "implication": "string"
                    }
                ]
            }
            """,
            
            "risks": base_context + """
            Please identify and assess risks as a valid JSON object:
            
            {
                "overall_risk_assessment": {
                    "risk_level": "low|medium|high|critical",
                    "summary": "string - brief risk overview",
                    "confidence": "number between 0 and 1"
                },
                "high_risk_items": [
                    {
                        "risk": "string - description of risk",
                        "severity": "high|critical", 
                        "likelihood": "low|medium|high",
                        "impact": "string - potential consequences",
                        "mitigation": "string - how to reduce/eliminate risk"
                    }
                ],
                "financial_risks": [
                    {
                        "risk": "string",
                        "potential_cost": "string",
                        "probability": "low|medium|high",
                        "mitigation": "string"
                    }
                ],
                "legal_risks": [
                    {
                        "risk": "string",
                        "legal_consequence": "string",
                        "severity": "low|medium|high|critical",
                        "mitigation": "string"
                    }
                ],
                "operational_risks": [
                    {
                        "risk": "string",
                        "business_impact": "string",
                        "mitigation": "string"
                    }
                ],
                "compliance_risks": [
                    {
                        "requirement": "string - what must be complied with",
                        "risk_of_non_compliance": "string",
                        "penalties": "string - consequences",
                        "mitigation": "string"
                    }
                ],
                "termination_risks": [
                    {
                        "scenario": "string - termination scenario",
                        "risk": "string - what could go wrong",
                        "mitigation": "string"
                    }
                ],
                "mitigation_strategies": [
                    {
                        "strategy": "string - mitigation approach",
                        "risks_addressed": ["array of risks this helps with"],
                        "implementation_priority": "high|medium|low"
                    }
                ]
            }
            """
        }
        
        return prompts.get(analysis_type, prompts["comprehensive"])
    
    def _parse_analysis_response(self, response_text: str, analysis_type: str) -> Dict[str, Any]:
        """Parse the AI response into a structured format."""
        try:
            # Clean the response text
            cleaned_text = response_text.strip()
            
            # Remove markdown code blocks if present
            if cleaned_text.startswith('```json'):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.startswith('```'):
                cleaned_text = cleaned_text[3:]
            if cleaned_text.endswith('```'):
                cleaned_text = cleaned_text[:-3]
            
            cleaned_text = cleaned_text.strip()
            
            # Try to find JSON within the text
            start_idx = cleaned_text.find('{')
            end_idx = cleaned_text.rfind('}')
            
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                json_text = cleaned_text[start_idx:end_idx + 1]
                try:
                    parsed_json = json.loads(json_text)
                    
                    # Validate the structure based on analysis type
                    validated_result = self._validate_and_enhance_result(parsed_json, analysis_type)
                    return validated_result
                    
                except json.JSONDecodeError as e:
                    logger.warning(f"JSON parsing failed: {str(e)}, attempting fallback parsing")
            
            # Fallback: structure the response manually
            result = {
                'raw_analysis': response_text,
                'structured_sections': self._extract_sections(response_text),
                'parse_method': 'fallback_extraction',
                'confidence_score': 0.7  # Lower confidence for fallback parsing
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error parsing response: {str(e)}")
            # Final fallback: return raw text with minimal structure
            return {
                'raw_analysis': response_text,
                'error': f'Parsing failed: {str(e)}',
                'parse_method': 'raw_text_only',
                'confidence_score': 0.5
            }
    
    def _validate_and_enhance_result(self, parsed_json: Dict[str, Any], analysis_type: str) -> Dict[str, Any]:
        """Validate and enhance the parsed JSON result."""
        try:
            # Add metadata
            parsed_json['_metadata'] = {
                'analysis_type': analysis_type,
                'parsed_successfully': True,
                'timestamp': logger.handlers[0].formatter.formatTime(logger.makeRecord(
                    '', 0, '', 0, '', (), None
                )) if logger.handlers else 'unknown'
            }
            
            # Ensure confidence score exists
            if 'confidence_score' not in parsed_json:
                parsed_json['confidence_score'] = 0.8  # Default confidence
            
            # Validate confidence score range
            if 'confidence_score' in parsed_json:
                confidence = parsed_json['confidence_score']
                if not isinstance(confidence, (int, float)) or confidence < 0 or confidence > 1:
                    parsed_json['confidence_score'] = 0.8
            
            # Type-specific validation and enhancement
            if analysis_type == 'comprehensive':
                self._enhance_comprehensive_analysis(parsed_json)
            elif analysis_type == 'risks':
                self._enhance_risk_analysis(parsed_json)
            elif analysis_type == 'summary':
                self._enhance_summary_analysis(parsed_json)
            elif analysis_type == 'key_points':
                self._enhance_key_points_analysis(parsed_json)
            
            return parsed_json
            
        except Exception as e:
            logger.error(f"Error validating result: {str(e)}")
            # Return original with error metadata
            parsed_json['_validation_error'] = str(e)
            return parsed_json
    
    def _enhance_comprehensive_analysis(self, result: Dict[str, Any]):
        """Enhance comprehensive analysis with additional processing."""
        # Ensure all required sections exist
        required_sections = [
            'document_summary', 'key_provisions', 'rights_and_obligations',
            'risk_assessment', 'important_dates', 'financial_terms',
            'termination_clauses', 'dispute_resolution', 'compliance_requirements',
            'recommendations'
        ]
        
        for section in required_sections:
            if section not in result:
                result[section] = {} if section in ['document_summary', 'rights_and_obligations', 
                                                  'financial_terms', 'dispute_resolution'] else []
        
        # Calculate overall risk level if not present
        if 'risk_assessment' in result and 'overall_risk_level' not in result['risk_assessment']:
            result['risk_assessment']['overall_risk_level'] = self._calculate_overall_risk(result['risk_assessment'])
    
    def _enhance_risk_analysis(self, result: Dict[str, Any]):
        """Enhance risk analysis with additional metrics."""
        if 'overall_risk_assessment' not in result:
            result['overall_risk_assessment'] = {
                'risk_level': 'medium',
                'summary': 'Risk assessment completed',
                'confidence': result.get('confidence_score', 0.8)
            }
        
        # Count risks by severity
        risk_counts = {'low': 0, 'medium': 0, 'high': 0, 'critical': 0}
        
        for risk_category in ['high_risk_items', 'financial_risks', 'legal_risks', 
                             'operational_risks', 'compliance_risks', 'termination_risks']:
            if risk_category in result:
                for risk_item in result[risk_category]:
                    severity = risk_item.get('severity', 'medium').lower()
                    if severity in risk_counts:
                        risk_counts[severity] += 1
        
        result['_risk_statistics'] = risk_counts
    
    def _enhance_summary_analysis(self, result: Dict[str, Any]):
        """Enhance summary analysis."""
        # Ensure basic structure
        if 'document_type' not in result:
            result['document_type'] = 'Unknown Document Type'
        if 'parties' not in result:
            result['parties'] = []
    
    def _enhance_key_points_analysis(self, result: Dict[str, Any]):
        """Enhance key points analysis."""
        # Count items by importance
        importance_counts = {'high': 0, 'medium': 0, 'low': 0}
        
        if 'critical_clauses' in result:
            for clause in result['critical_clauses']:
                importance = clause.get('importance', 'medium').lower()
                if importance in importance_counts:
                    importance_counts[importance] += 1
        
        result['_importance_statistics'] = importance_counts
    
    def _calculate_overall_risk(self, risk_assessment: Dict[str, Any]) -> str:
        """Calculate overall risk level based on individual risks."""
        risk_scores = {'low': 1, 'medium': 2, 'high': 3, 'critical': 4}
        
        total_score = 0
        risk_count = 0
        
        for risk_category in ['financial_risks', 'legal_risks', 'compliance_risks']:
            if risk_category in risk_assessment:
                for risk_item in risk_assessment[risk_category]:
                    severity = risk_item.get('severity', 'medium').lower()
                    if severity in risk_scores:
                        total_score += risk_scores[severity]
                        risk_count += 1
        
        if risk_count == 0:
            return 'medium'
        
        average_score = total_score / risk_count
        
        if average_score <= 1.5:
            return 'low'
        elif average_score <= 2.5:
            return 'medium'
        elif average_score <= 3.5:
            return 'high'
        else:
            return 'critical'
    
    def _extract_sections(self, text: str) -> Dict[str, str]:
        """Extract sections from unstructured text."""
        sections = {}
        current_section = None
        current_content = []
        
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if this line is a section header (contains : or ** markers)
            if '**' in line or line.endswith(':') or line.startswith('##'):
                # Save previous section
                if current_section and current_content:
                    sections[current_section] = '\n'.join(current_content).strip()
                
                # Start new section
                current_section = line.replace('**', '').replace(':', '').replace('##', '').strip()
                current_content = []
            else:
                if current_section:
                    current_content.append(line)
        
        # Save the last section
        if current_section and current_content:
            sections[current_section] = '\n'.join(current_content).strip()
        
        return sections
    
    async def ask_question(self, document_text: str, question: str) -> Dict[str, Any]:
        """
        Ask a specific question about the document.
        
        Args:
            document_text: The document text
            question: User's question
            
        Returns:
            Dictionary containing the answer
        """
        try:
            # Check if demo mode is enabled
            if Config.DEMO_MODE:
                logger.info("Demo mode enabled - returning mock answer")
                demo_result = DemoAIService.answer_question(question, document_text)
                return {
                    'success': True,
                    'question': question,
                    'model_used': 'demo',
                    'result': demo_result,
                    'error': None
                }
            
            model, model_type = self._get_available_model()
            
            prompt = f"""
            You are an expert legal analyst. Based on the following legal document, please answer the user's question accurately and comprehensively.
            
            Document Content:
            {document_text[:8000]}{"..." if len(document_text) > 8000 else ""}
            
            User Question: {question}
            
            Please provide your response in the following JSON format:
            {{
                "direct_answer": "string - clear, direct answer to the question",
                "relevant_quotes": [
                    {{
                        "quote": "string - relevant text from document",
                        "context": "string - why this quote is relevant"
                    }}
                ],
                "detailed_explanation": "string - comprehensive explanation with context",
                "confidence_level": "high|medium|low - how confident you are in this answer",
                "additional_considerations": [
                    "string - other important points to consider"
                ],
                "related_sections": [
                    "string - other parts of document that may be relevant"
                ],
                "actionable_advice": "string - practical next steps or recommendations if applicable",
                "answer_completeness": "complete|partial|insufficient_info - whether document contains enough info to fully answer"
            }}
            
            If the question cannot be answered based on the document content, clearly state this in the direct_answer and explain what information would be needed.
            """
            
            if model_type == "gemini":
                response = model.generate_content(prompt)
                result_text = response.text
            else:  # vertex
                response = model.generate_content(prompt)
                result_text = response.text
            
            # Parse the JSON response
            try:
                parsed_result = self._parse_json_response(result_text)
                return {
                    'success': True,
                    'question': question,
                    'result': parsed_result,
                    'model_used': model_type,
                    'error': None
                }
            except Exception as parse_error:
                # Fallback to raw text if JSON parsing fails
                return {
                    'success': True,
                    'question': question,
                    'result': {
                        'direct_answer': result_text,
                        'confidence_level': 'medium',
                        'answer_completeness': 'complete',
                        'raw_response': result_text
                    },
                    'model_used': model_type,
                    'error': None,
                    'parse_warning': str(parse_error)
                }
            
        except Exception as e:
            logger.error(f"Error answering question: {str(e)}")
            return {
                'success': False,
                'question': question,
                'result': {},
                'model_used': None,
                'error': str(e)
            }
    
    async def explain_clause(self, clause_text: str, context: str = "") -> Dict[str, Any]:
        """
        Explain a specific clause in plain language.
        
        Args:
            clause_text: The clause to explain
            context: Additional context about the document
            
        Returns:
            Dictionary containing the explanation
        """
        try:
            # Check if demo mode is enabled
            if Config.DEMO_MODE:
                logger.info("Demo mode enabled - returning mock explanation")
                demo_result = DemoAIService.explain_clause(clause_text, context)
                return {
                    'success': True,
                    'clause_text': clause_text,
                    'model_used': 'demo',
                    'result': demo_result,
                    'error': None
                }
            
            model, model_type = self._get_available_model()
            
            prompt = f"""
            You are an expert legal analyst specializing in making complex legal language accessible to non-lawyers. 
            Please explain the following legal clause in clear, simple terms.
            
            Clause to Explain:
            {clause_text}
            
            {f"Additional Context: {context}" if context else ""}
            
            Please provide your explanation in the following JSON format:
            {{
                "plain_language_explanation": "string - what this clause means in everyday language",
                "key_points": [
                    "string - the most important aspects, one per item"
                ],
                "practical_implications": {{
                    "for_party_1": "string - how this affects the first party",
                    "for_party_2": "string - how this affects the second party",
                    "general_impact": "string - overall practical effect"
                }},
                "potential_concerns": [
                    {{
                        "concern": "string - what could be problematic",
                        "severity": "low|medium|high",
                        "mitigation": "string - how to address this concern"
                    }}
                ],
                "real_world_examples": [
                    "string - concrete examples of how this clause works in practice"
                ],
                "related_legal_concepts": [
                    "string - other legal concepts this clause relates to"
                ],
                "red_flags": [
                    "string - warning signs or unusual aspects of this clause"
                ],
                "common_variations": "string - how this type of clause typically varies",
                "negotiation_tips": [
                    "string - advice for negotiating this type of clause"
                ],
                "complexity_level": "simple|moderate|complex|very_complex",
                "explanation_confidence": "high|medium|low"
            }}
            
            Use simple vocabulary and avoid legal jargon. When you must use legal terms, explain them clearly.
            """
            
            if model_type == "gemini":
                response = model.generate_content(prompt)
                result_text = response.text
            else:  # vertex
                response = model.generate_content(prompt)
                result_text = response.text
            
            # Parse the JSON response
            try:
                parsed_result = self._parse_json_response(result_text)
                return {
                    'success': True,
                    'clause': clause_text,
                    'result': parsed_result,
                    'model_used': model_type,
                    'error': None
                }
            except Exception as parse_error:
                # Fallback to raw text if JSON parsing fails
                return {
                    'success': True,
                    'clause': clause_text,
                    'result': {
                        'plain_language_explanation': result_text,
                        'complexity_level': 'moderate',
                        'explanation_confidence': 'medium',
                        'raw_response': result_text
                    },
                    'model_used': model_type,
                    'error': None,
                    'parse_warning': str(parse_error)
                }
            
        except Exception as e:
            logger.error(f"Error explaining clause: {str(e)}")
            return {
                'success': False,
                'clause': clause_text,
                'result': {},
                'model_used': None,
                'error': str(e)
            }
    
    def _parse_json_response(self, response_text: str) -> Dict[str, Any]:
        """Parse JSON response with robust error handling."""
        # Clean the response text
        cleaned_text = response_text.strip()
        
        # Remove markdown code blocks if present
        if cleaned_text.startswith('```json'):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.startswith('```'):
            cleaned_text = cleaned_text[3:]
        if cleaned_text.endswith('```'):
            cleaned_text = cleaned_text[:-3]
        
        cleaned_text = cleaned_text.strip()
        
        # Try to find JSON within the text
        start_idx = cleaned_text.find('{')
        end_idx = cleaned_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            json_text = cleaned_text[start_idx:end_idx + 1]
            return json.loads(json_text)
        else:
            raise ValueError("No valid JSON found in response")