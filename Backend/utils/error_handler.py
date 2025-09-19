import logging
import structlog
import sys
from typing import Dict, Any, Optional
from flask import jsonify, request
from functools import wraps
import traceback

def setup_logging(log_level: str = "INFO"):
    """Setup structured logging."""
    
    # Configure standard logging
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        stream=sys.stdout
    )
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

class APIError(Exception):
    """Custom API error class."""
    
    def __init__(self, message: str, status_code: int = 400, payload: Optional[Dict] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.payload = payload or {}

class ErrorHandler:
    """Error handling utilities."""
    
    @staticmethod
    def format_error_response(error: Exception, request_id: str = None) -> Dict[str, Any]:
        """Format error response."""
        if isinstance(error, APIError):
            return {
                'success': False,
                'error': {
                    'message': error.message,
                    'type': 'APIError',
                    'status_code': error.status_code,
                    'payload': error.payload
                },
                'request_id': request_id,
                'data': None
            }
        else:
            return {
                'success': False,
                'error': {
                    'message': str(error),
                    'type': type(error).__name__,
                    'status_code': 500
                },
                'request_id': request_id,
                'data': None
            }
    
    @staticmethod
    def format_success_response(data: Any, message: str = "Success", request_id: str = None) -> Dict[str, Any]:
        """Format success response."""
        return {
            'success': True,
            'message': message,
            'data': data,
            'request_id': request_id,
            'error': None
        }

def handle_errors(f):
    """Decorator for handling API errors."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logger = structlog.get_logger()
        request_id = getattr(request, 'request_id', None)
        
        try:
            result = f(*args, **kwargs)
            return result
        except APIError as e:
            logger.error(
                "API error occurred",
                error_message=e.message,
                status_code=e.status_code,
                payload=e.payload,
                request_id=request_id,
                endpoint=request.endpoint,
                method=request.method
            )
            response = ErrorHandler.format_error_response(e, request_id)
            return jsonify(response), e.status_code
        except Exception as e:
            logger.error(
                "Unexpected error occurred",
                error_message=str(e),
                error_type=type(e).__name__,
                traceback=traceback.format_exc(),
                request_id=request_id,
                endpoint=request.endpoint,
                method=request.method
            )
            response = ErrorHandler.format_error_response(e, request_id)
            return jsonify(response), 500
    
    return decorated_function

def validate_request_data(required_fields: list, optional_fields: list = None):
    """Decorator to validate request data."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                raise APIError("Request must be JSON", 400)
            
            data = request.get_json() or {}
            
            # Check required fields
            missing_fields = []
            for field in required_fields:
                if field not in data or data[field] is None or data[field] == '':
                    missing_fields.append(field)
            
            if missing_fields:
                raise APIError(
                    f"Missing required fields: {', '.join(missing_fields)}", 
                    400,
                    {'missing_fields': missing_fields}
                )
            
            # Add validated data to kwargs
            kwargs['validated_data'] = data
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def validate_file_upload(required: bool = True, max_size: int = 10485760):
    """Decorator to validate file uploads."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'file' not in request.files:
                if required:
                    raise APIError("No file provided", 400)
                else:
                    kwargs['file'] = None
                    return f(*args, **kwargs)
            
            file = request.files['file']
            
            if file.filename == '':
                if required:
                    raise APIError("No file selected", 400)
                else:
                    kwargs['file'] = None
                    return f(*args, **kwargs)
            
            # Check file size
            file.seek(0, 2)  # Seek to end
            file_size = file.tell()
            file.seek(0)  # Reset
            
            if file_size > max_size:
                raise APIError(
                    f"File size ({file_size} bytes) exceeds maximum allowed ({max_size} bytes)",
                    413,
                    {'file_size': file_size, 'max_size': max_size}
                )
            
            if file_size == 0:
                raise APIError("File is empty", 400)
            
            kwargs['file'] = file
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def log_request_response(f):
    """Decorator to log request and response details."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logger = structlog.get_logger()
        request_id = getattr(request, 'request_id', None)
        
        # Log request
        logger.info(
            "API request received",
            endpoint=request.endpoint,
            method=request.method,
            request_id=request_id,
            user_agent=request.headers.get('User-Agent'),
            content_length=request.content_length
        )
        
        # Execute function
        result = f(*args, **kwargs)
        
        # Log response
        if isinstance(result, tuple):
            response_data, status_code = result
        else:
            response_data = result
            status_code = 200
        
        logger.info(
            "API response sent",
            endpoint=request.endpoint,
            method=request.method,
            request_id=request_id,
            status_code=status_code
        )
        
        return result
    
    return decorated_function