
# UnveilDocs 📋⚖️

UnveilDocs is a powerful AI-driven platform that transforms complex legal documents into clear, understandable insights. Powered by Google's Gemini AI, it helps users navigate legal jargon, extract key information, and make informed decisions.

## ✨ Features

- **🔍 Document Analysis**: Upload and analyze legal documents (PDF, DOCX, TXT)
- **🤖 AI-Powered Insights**: Comprehensive legal analysis using Google Gemini AI
- **💬 Interactive Q&A**: Ask questions about your documents and get instant answers
- **📊 Risk Assessment**: Identify potential legal risks and concerns
- **📝 Key Clause Extraction**: Automatically extract important clauses and terms
- **💡 Smart Recommendations**: Get actionable recommendations based on document analysis
- **🎨 Modern UI**: Clean, responsive interface with dark/light theme support

## 🛠️ Tech Stack

### Backend
- **Python 3.12+** - Core backend language (Compatible with all dependencies)
- **Flask 3.0.0** - Web framework
- **Google Gemini AI** - AI-powered document analysis
- **Google Cloud AI Platform** - Advanced AI capabilities
- **PyPDF2** - PDF text extraction
- **python-docx** - Word document processing
- **pdfplumber** - Advanced PDF processing
- **spaCy & NLTK** - Natural language processing
- **structlog** - Structured logging

### Frontend
- **React 18** - Modern frontend framework
- **Vite** - Fast build tool and dev server
- **CSS3** - Styling with custom properties
- **Context API** - State management

## 📁 Project Structure

```
UnveilDocs/
├── Backend/
│   ├── app.py              # Flask application
│   ├── config.py           # Configuration management
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   └── utils/
│       ├── ai_service.py      # Google AI integration
│       ├── document_processor.py  # Document processing
│       └── error_handler.py      # Error handling & logging
├── Frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/         # React contexts
│   │   └── services/         # API services
│   ├── package.json          # Node.js dependencies
│   └── vite.config.js       # Vite configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.12+** (Recommended for compatibility with all dependencies)
- **Node.js 18+**
- **Google Cloud Account** with Gemini API access
- **API Key** for Google Generative AI

### 1. Clone the Repository

```bash
git clone https://github.com/Pushkaraso19/UnveilDocs.git
cd UnveilDocs
```

### 2. Backend Setup

```bash
cd Backend
```

#### Install Dependencies
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix/Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment
Create a `.env` file in the Backend directory:

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# Vertex AI Configuration
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-1.5-pro

# Gemini API Configuration
GOOGLE_API_KEY=your_google_api_key_here

# Application Configuration
FLASK_ENV=development
FLASK_DEBUG=True
DEMO_MODE=False
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=pdf,doc,docx,txt
LOG_LEVEL=INFO
```

#### Run Backend Server
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../Frontend
```

#### Install Dependencies
```bash
npm install
```

#### Run Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📖 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### Health Check
```http
GET /health
```
Returns server health status and configuration.

#### Upload Document
```http
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: Document file (PDF, DOCX, TXT)
```

#### Analyze Document
```http
POST /api/analyze
Content-Type: application/json

{
  "document_id": "uuid-from-upload"
}
```

#### Ask Question
```http
POST /api/ask
Content-Type: application/json

{
  "document_id": "uuid-from-upload",
  "question": "Your question about the document"
}
```

#### Upload and Analyze (Combined)
```http
POST /api/upload-and-analyze
Content-Type: multipart/form-data

Body:
- file: Document file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Google Generative AI API key | Required |
| `GOOGLE_CLOUD_PROJECT_ID` | Google Cloud project ID | Required |
| `DEMO_MODE` | Enable demo mode (no API calls) | `False` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `PORT` | Backend server port | `5000` |

### Google Cloud Setup

1. Create a Google Cloud project
2. Enable the Generative AI API
3. Create an API key
4. Set up billing (required for API usage)

## 🧪 Testing

### Backend Testing
```bash
cd Backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd Frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
- Configure production environment variables
- Use a production WSGI server like Gunicorn
- Set up proper logging and monitoring

### Frontend Deployment
```bash
cd Frontend
npm run build
```

Deploy the `dist` folder to your preferred hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful document analysis
- React team for the excellent frontend framework
- Flask team for the lightweight backend framework

## 📞 Support

For support, email support@unveildocs.com or create an issue on GitHub.

---

**Made with ❤️ by the UnveilDocs Team**
Legal documents—such as rental agreements, loan contracts, and terms of service—are often filled with complex, impenetrable jargon. UnveilDocs bridges this gap by using Generative AI to make essential legal information accessible and understandable to everyone, from everyday citizens to small business owners.

## Features
- Paste or upload legal documents in the frontend
- Get AI-generated summaries and explanations
- Ask questions about the document and receive answers
- Simple, modern, and responsive UI
- Private and secure: your documents are processed locally unless connected to a cloud AI provider

## Tech Stack
- **Frontend:** React + Vite (JavaScript)
- **Backend:** Python Flask API
- **AI Integration:** (Pluggable, e.g., Google Cloud Vertex AI, Gemini, or OpenAI API)

## Project Structure
```
UnveilDocs/
├── Backend/
│   ├── app.py
│   └── requirements.txt
├── Frontend/
│   ├── src/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Getting Started

### Backend (Flask)
1. Navigate to the `Backend` folder:
	```bash
	cd Backend
	```
2. (Optional) Create and activate a virtual environment:
	```bash
	python -m venv venv
	# On Windows:
	venv\Scripts\activate
	# On Unix:
	source venv/bin/activate
	```
3. Install dependencies:
	```bash
	pip install flask flask-cors
	```
4. Run the backend:
	```bash
	python app.py
	```

### Frontend (React + Vite)
1. Navigate to the `Frontend` folder:
	```bash
	cd Frontend
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Run the frontend:
	```bash
	npm run dev
	```

## Usage
1. Start both backend and frontend servers.
2. Open UnveilDocs in your browser (usually at [http://localhost:5173](http://localhost:5173)).
3. Paste your legal document, click "Summarize" or ask questions.

