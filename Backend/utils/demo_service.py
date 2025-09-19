"""
Demo AI Service Module

This module provides mock responses for development to avoid AI API costs.
"""

class DemoAIService:
    """Demo AI service that returns mock responses instead of making real AI calls."""
    
    @staticmethod
    def process_document(document_content, file_type=None):
        """
        Mock document processing response.
        
        Args:
            document_content: The document content (not used in demo)
            file_type: Type of file (pdf, doc, etc.)
            
        Returns:
            dict: Mock processing result
        """
        return {
            'status': 'success',
            'summary': """This is a demo legal document summary. This document appears to be a comprehensive legal agreement covering various terms and conditions. The main sections include contractual obligations, liability clauses, payment terms, and dispute resolution mechanisms. Key provisions highlight the responsibilities of both parties, termination conditions, and governing law specifications.""",
            'key_points': [
                "Contractual obligations and responsibilities of all parties",
                "Payment terms and billing cycle specifications",
                "Liability limitations and indemnification clauses",
                "Termination conditions and notice requirements",
                "Intellectual property rights and usage permissions",
                "Data protection and confidentiality agreements",
                "Dispute resolution and governing law provisions"
            ],
            'document_type': 'Legal Agreement',
            'confidence': 0.92,
            'page_count': 15,
            'word_count': 4850
        }
    
    @staticmethod
    def answer_question(question, document_context=None):
        """
        Mock question answering response.
        
        Args:
            question: The question being asked
            document_context: Document context (not used in demo)
            
        Returns:
            dict: Mock answer result
        """
        # Simple keyword-based mock responses
        question_lower = question.lower()
        
        if any(word in question_lower for word in ['payment', 'pay', 'cost', 'fee', 'price']):
            answer = "According to this demo document, payment terms are typically net 30 days from invoice date. Late payments may incur additional fees as specified in the payment terms section."
        elif any(word in question_lower for word in ['termination', 'terminate', 'end', 'cancel']):
            answer = "The termination clause in this demo document requires 30 days written notice from either party. Specific termination conditions and procedures are outlined in Section 8 of the agreement."
        elif any(word in question_lower for word in ['liability', 'responsible', 'damages']):
            answer = "The liability provisions in this demo document limit damages to the amount paid under the agreement. Both parties have specific indemnification obligations as detailed in the liability section."
        elif any(word in question_lower for word in ['intellectual', 'property', 'copyright', 'patent']):
            answer = "Intellectual property rights in this demo document remain with the original owner. Limited usage rights are granted as specified in the intellectual property clause."
        else:
            answer = f"Based on this demo document analysis, regarding your question about '{question}', the relevant provisions can be found in the main body of the agreement. This is a mock response for development purposes."
        
        return {
            'status': 'success',
            'answer': answer,
            'confidence': 0.85,
            'relevant_sections': ['Section 1: General Terms', 'Section 3: Specific Provisions'],
            'page_references': [2, 5, 8]
        }
    
    @staticmethod
    def explain_clause(clause_text, context=None):
        """
        Mock clause explanation response.
        
        Args:
            clause_text: The clause to explain
            context: Additional context (not used in demo)
            
        Returns:
            dict: Mock explanation result
        """
        return {
            'status': 'success',
            'explanation': f"This demo explanation covers the selected clause: '{clause_text[:100]}...' This clause typically establishes important legal obligations and rights between the parties. In plain language, this means that both parties agree to specific terms and conditions that govern their relationship. This is a mock explanation for development purposes.",
            'plain_language': "In simple terms, this clause sets out what each party needs to do and what they can expect from the other party.",
            'key_terms': [
                "Legal obligation - What must be done according to the law",
                "Rights and responsibilities - What each party can do and must do",
                "Compliance requirements - Rules that must be followed"
            ],
            'potential_risks': [
                "Non-compliance may result in legal consequences",
                "Unclear terms could lead to disputes",
                "Changes in law might affect interpretation"
            ],
            'recommendations': [
                "Review with legal counsel if unsure",
                "Ensure all parties understand the terms",
                "Document any amendments properly"
            ]
        }
    
    @staticmethod
    def generate_summary(text_content):
        """
        Mock text summarization response.
        
        Args:
            text_content: Text to summarize (not used in demo)
            
        Returns:
            dict: Mock summary result
        """
        return {
            'status': 'success',
            'summary': "This is a demo summary of the provided text. The document contains important legal provisions covering various aspects of a business relationship. Key areas include contractual terms, payment obligations, performance standards, and dispute resolution procedures. The content emphasizes compliance requirements and mutual responsibilities between parties.",
            'key_points': [
                "Primary contractual obligations outlined",
                "Payment and billing procedures specified", 
                "Performance standards and metrics defined",
                "Risk management and liability provisions",
                "Termination and renewal procedures"
            ],
            'word_count': len(text_content.split()) if text_content else 1000,
            'reading_time': "5-7 minutes"
        }
    
    @staticmethod
    def analyze_sentiment(text_content):
        """
        Mock sentiment analysis response.
        
        Args:
            text_content: Text to analyze (not used in demo)
            
        Returns:
            dict: Mock sentiment result
        """
        return {
            'status': 'success',
            'sentiment': 'neutral',
            'confidence': 0.78,
            'tone': 'formal and professional',
            'emotional_indicators': {
                'positive': 0.25,
                'neutral': 0.65,
                'negative': 0.10
            },
            'analysis': "This demo document maintains a neutral, professional tone typical of legal agreements. The language is formal and objective, focusing on factual provisions rather than emotional content."
        }