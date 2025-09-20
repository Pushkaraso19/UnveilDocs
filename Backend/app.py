import asyncio
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
import structlog

# Import utilities
from config import Config
from utils.document_processor import DocumentProcessor
from utils.ai_service import GoogleCloudAI
from utils.error_handler import (
    setup_logging, 
    handle_errors, 
    validate_request_data, 
    validate_file_upload,
    log_request_response,
    ErrorHandler,
    APIError
)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup configuration and logging
try:
    Config.validate()
    setup_logging(Config.LOG_LEVEL)
    logger = structlog.get_logger()
    
    # Show demo mode status
    if Config.DEMO_MODE:
        logger.warning("🚨 DEMO MODE ENABLED - Using mock AI responses (no API costs) 🚨")
        print("=" * 60)
        print("DEMO MODE ENABLED ")
        print("All AI responses will be mock data to avoid API costs")
        print("Set DEMO_MODE=False in config to use real AI services")
        print("=" * 60)
    else:
        logger.info("Production mode - Using real AI services")
    
    logger.info("Application starting up", 
                project_id=Config.GOOGLE_CLOUD_PROJECT_ID,
                demo_mode=Config.DEMO_MODE)
except Exception as e:
    print(f"Configuration error: {str(e)}")
    exit(1)

# Initialize services with enhanced error handling
try:
    document_processor = DocumentProcessor()
    ai_service = GoogleCloudAI()
    
    # Test AI service initialization
    if not Config.DEMO_MODE:
        try:
            model, model_type = ai_service._get_available_model()
            logger.info(f"AI service initialized successfully with {model_type} model")
        except Exception as e:
            logger.error(f"AI service initialization failed: {str(e)}")
            logger.warning("Falling back to demo mode for this session")
            # Temporarily enable demo mode if AI fails
            Config.DEMO_MODE = True
    
except Exception as e:
    logger.error(f"Service initialization failed: {str(e)}")
    exit(1)

@app.before_request
def before_request():
    """Add request ID and log request."""
    request.request_id = str(uuid.uuid4())

@app.route('/health', methods=['GET'])
@handle_errors
@log_request_response
def health_check():
    """Enhanced health check endpoint."""
    ai_status = False
    ai_details = {}
    
    try:
        if Config.DEMO_MODE:
            ai_status = True
            ai_details = {
                'mode': 'demo',
                'model': 'mock',
                'status': 'available'
            }
        else:
            model, model_type = ai_service._get_available_model()
            ai_status = True
            ai_details = {
                'mode': 'production',
                'model': model_type,
                'status': 'available'
            }
    except Exception as e:
        ai_details = {
            'mode': 'failed',
            'model': 'none',
            'status': 'unavailable',
            'error': str(e)
        }
    
    health_status = {
        'status': 'healthy' if ai_status else 'degraded',
        'services': {
            'document_processor': True,
            'ai_service': ai_status,
            'ai_details': ai_details
        },
        'configuration': {
            'demo_mode': Config.DEMO_MODE,
            'project_id': Config.GOOGLE_CLOUD_PROJECT_ID[:10] + '...' if Config.GOOGLE_CLOUD_PROJECT_ID else None,
            'vertex_location': Config.VERTEX_AI_LOCATION,
            'supported_formats': list(DocumentProcessor.SUPPORTED_FORMATS.values())
        }
    }
    
    return jsonify(ErrorHandler.format_success_response(
        health_status,
        "Service health check completed"
    ))

@app.route('/', methods=['GET'])
@handle_errors
@log_request_response
def root():
    """Root endpoint."""
    return jsonify(ErrorHandler.format_success_response(
        {
            'message': 'UnveilDocs Backend API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/health',
                'upload': '/api/upload',
                'analyze': '/api/analyze',
                'ask': '/api/ask',
                'explain': '/api/explain',
                'summarize': '/api/summarize',
                'upload_and_analyze': '/api/upload-and-analyze'
            }
        },
        "Welcome to UnveilDocs Backend API"
    ))

@app.route('/api/upload', methods=['POST'])
@handle_errors
@log_request_response
@validate_file_upload(required=True, max_size=Config.MAX_FILE_SIZE)
def upload_document(file):
    """
    Upload and process a document.
    
    Returns:
        JSON response with extracted text and metadata
    """
    logger = structlog.get_logger()
    logger.info("Processing document upload", filename=file.filename)
    
    # Process the document
    result = document_processor.process_document(file)
    
    if not result['success']:
        raise APIError(result['error'], 400)
    
    logger.info(
        "Document processed successfully",
        filename=file.filename,
        text_length=len(result['text']),
        file_type=result['metadata'].get('file_type')
    )
    
    return jsonify(ErrorHandler.format_success_response(
        result,
        "Document uploaded and processed successfully"
    ))

@app.route('/api/analyze', methods=['POST'])
@handle_errors
@log_request_response
@validate_request_data(['text'], ['analysis_type'])
def analyze_document(validated_data):
    """
    Analyze a document using Google Cloud AI with enhanced error handling.
    
    Expected JSON payload:
    {
        "text": "document text to analyze",
        "analysis_type": "comprehensive|summary|key_points|risks" (optional, default: comprehensive)
    }
    """
    logger = structlog.get_logger()
    
    text = validated_data['text']
    analysis_type = validated_data.get('analysis_type', 'comprehensive')
    
    # Enhanced validation
    if len(text.strip()) < 50:
        raise APIError("Document text is too short for meaningful analysis (minimum 50 characters)", 400)
    
    if analysis_type not in ['comprehensive', 'summary', 'key_points', 'risks']:
        raise APIError(f"Invalid analysis type: {analysis_type}", 400)
    
    logger.info(
        "Starting document analysis",
        text_length=len(text),
        analysis_type=analysis_type,
        demo_mode=Config.DEMO_MODE
    )
    
    # Run AI analysis with proper error handling
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result = loop.run_until_complete(ai_service.analyze_legal_document(text, analysis_type))
    except Exception as e:
        logger.error(f"Analysis execution failed: {str(e)}")
        raise APIError(f"Analysis failed: {str(e)}", 500)
    finally:
        loop.close()
    
    if not result['success']:
        error_msg = result.get('error', 'Unknown error occurred')
        error_type = result.get('error_type', 'general')
        logger.error(f"Analysis failed: {error_msg}", error_type=error_type)
        
        # Provide specific error codes based on error type
        status_code = 500
        if error_type in ['authentication', 'quota_exceeded']:
            status_code = 503  # Service Unavailable
        elif error_type == 'invalid_input':
            status_code = 400  # Bad Request
        
        raise APIError(f"Analysis failed: {error_msg}", status_code)
    
    logger.info(
        "Document analysis completed successfully",
        analysis_type=analysis_type,
        model_used=result['model_used'],
        processing_time=result.get('processing_time', 0),
        token_usage=result.get('token_usage', {})
    )
    
    return jsonify(ErrorHandler.format_success_response(
        result,
        f"Document analysis ({analysis_type}) completed successfully"
    ))

@app.route('/api/ask', methods=['POST'])
@handle_errors
@log_request_response
@validate_request_data(['text', 'question'])
def ask_question(validated_data):
    """
    Ask a question about a document.
    
    Expected JSON payload:
    {
        "text": "document text",
        "question": "user's question"
    }
    """
    logger = structlog.get_logger()
    
    text = validated_data['text']
    question = validated_data['question']
    
    if len(text.strip()) < 50:
        raise APIError("Document text is too short", 400)
    
    if len(question.strip()) < 5:
        raise APIError("Question is too short", 400)
    
    logger.info(
        "Processing question",
        text_length=len(text),
        question_length=len(question)
    )
    
    # Run AI question answering
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result = loop.run_until_complete(ai_service.ask_question(text, question))
    finally:
        loop.close()
    
    if not result['success']:
        raise APIError(f"Question answering failed: {result['error']}", 500)
    
    logger.info(
        "Question answered successfully",
        model_used=result['model_used']
    )
    
    return jsonify(ErrorHandler.format_success_response(
        result,
        "Question answered successfully"
    ))

@app.route('/api/explain', methods=['POST'])
@handle_errors
@log_request_response
@validate_request_data(['clause'], ['context'])
def explain_clause(validated_data):
    """
    Explain a specific clause in plain language.
    
    Expected JSON payload:
    {
        "clause": "clause text to explain",
        "context": "additional context" (optional)
    }
    """
    logger = structlog.get_logger()
    
    clause = validated_data['clause']
    context = validated_data.get('context', '')
    
    if len(clause.strip()) < 10:
        raise APIError("Clause text is too short", 400)
    
    logger.info(
        "Explaining clause",
        clause_length=len(clause),
        has_context=bool(context)
    )
    
    # Run AI clause explanation
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result = loop.run_until_complete(ai_service.explain_clause(clause, context))
    finally:
        loop.close()
    
    if not result['success']:
        raise APIError(f"Clause explanation failed: {result['error']}", 500)
    
    logger.info(
        "Clause explained successfully",
        model_used=result['model_used']
    )
    
    return jsonify(ErrorHandler.format_success_response(
        result,
        "Clause explained successfully"
    ))

@app.route('/api/summarize', methods=['POST'])
@handle_errors
@log_request_response
@validate_request_data(['text'])
def summarize_document(validated_data):
    """
    Summarize a document.
    
    Expected JSON payload:
    {
        "text": "document text to summarize"
    }
    """
    logger = structlog.get_logger()
    
    text = validated_data['text']
    
    if len(text.strip()) < 100:
        raise APIError("Document text is too short for summarization", 400)
    
    logger.info("Generating document summary", text_length=len(text))
    
    # Use the analyze endpoint with summary type
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result = loop.run_until_complete(ai_service.analyze_legal_document(text, 'summary'))
    finally:
        loop.close()
    
    if not result['success']:
        raise APIError(f"Summarization failed: {result['error']}", 500)
    
    logger.info(
        "Document summarized successfully",
        model_used=result['model_used']
    )
    
    return jsonify(ErrorHandler.format_success_response(
        result,
        "Document summarized successfully"
    ))

@app.route('/api/upload-and-analyze', methods=['POST'])
@handle_errors
@log_request_response
@validate_file_upload(required=True)
def upload_and_analyze(file):
    """
    Upload a document and immediately analyze it.
    
    Query parameters:
    - analysis_type: Type of analysis (default: comprehensive)
    """
    logger = structlog.get_logger()
    
    analysis_type = request.args.get('analysis_type', 'comprehensive')
    
    logger.info(
        "Processing upload and analyze request",
        filename=file.filename,
        analysis_type=analysis_type
    )
    
    # Step 1: Process the document
    doc_result = document_processor.process_document(file)
    if not doc_result['success']:
        raise APIError(f"Document processing failed: {doc_result['error']}", 400)
    
    # Step 2: Analyze the document
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        analysis_result = loop.run_until_complete(
            ai_service.analyze_legal_document(doc_result['text'], analysis_type)
        )
    finally:
        loop.close()
    
    if not analysis_result['success']:
        raise APIError(f"Document analysis failed: {analysis_result['error']}", 500)
    
    # Combine results
    combined_result = {
        'document': doc_result,
        'analysis': analysis_result
    }
    
    logger.info(
        "Upload and analyze completed successfully",
        filename=file.filename,
        analysis_type=analysis_type,
        model_used=analysis_result['model_used']
    )
    
    return jsonify(ErrorHandler.format_success_response(
        combined_result,
        "Document uploaded and analyzed successfully"
    ))

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify(ErrorHandler.format_error_response(
        APIError("Endpoint not found", 404)
    )), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify(ErrorHandler.format_error_response(
        APIError("Method not allowed", 405)
    )), 405

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large errors."""
    return jsonify(ErrorHandler.format_error_response(
        APIError("File too large", 413)
    )), 413

if __name__ == '__main__':
    logger.info("Starting Flask development server")
    app.run(
        debug=Config.FLASK_DEBUG,
        host='0.0.0.0',
        port=5000
    )