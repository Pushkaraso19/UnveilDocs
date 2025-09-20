import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Configuration class for the application."""
    
    # Google Cloud Configuration
    GOOGLE_CLOUD_PROJECT_ID = os.getenv('GOOGLE_CLOUD_PROJECT_ID')
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    # Vertex AI Configuration
    VERTEX_AI_LOCATION = os.getenv('VERTEX_AI_LOCATION', 'us-central1')
    VERTEX_AI_MODEL = os.getenv('VERTEX_AI_MODEL', 'gemini-1.5-pro')
    
    # Gemini API Configuration
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    
    # Document AI Configuration
    DOCUMENT_AI_PROCESSOR_ID = os.getenv('DOCUMENT_AI_PROCESSOR_ID')
    DOCUMENT_AI_LOCATION = os.getenv('DOCUMENT_AI_LOCATION', 'us')
    
    # Application Configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 10485760))  # 10MB
    ALLOWED_EXTENSIONS = set(os.getenv('ALLOWED_EXTENSIONS', 'pdf,doc,docx,txt').split(','))
    
    # Demo Mode Configuration (to avoid AI API costs during development)
    DEMO_MODE = os.getenv('DEMO_MODE', 'True').lower() == 'true'
    
    # Logging Configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    @classmethod
    def validate(cls):
        """Validate required configuration."""
        # In demo mode, we don't need real API keys
        if cls.DEMO_MODE:
            # Set demo values if not provided
            if not cls.GOOGLE_CLOUD_PROJECT_ID:
                cls.GOOGLE_CLOUD_PROJECT_ID = 'demo-project'
            if not cls.GOOGLE_API_KEY:
                cls.GOOGLE_API_KEY = 'demo-key'
            return True
        
        # In production mode, validate required variables
        required_vars = [
            'GOOGLE_CLOUD_PROJECT_ID',
            'GOOGLE_API_KEY'
        ]
        
        missing_vars = []
        for var in required_vars:
            if not getattr(cls, var):
                missing_vars.append(var)
        
        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
        
        return True