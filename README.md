
# UnveilDocs

UnveilDocs is a Generative AI-powered platform that simplifies complex legal documents into clear, accessible guidance. It empowers users to make informed decisions by demystifying legal jargon and providing easy-to-understand summaries, explanations, and answers to user queries.

---

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction
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

