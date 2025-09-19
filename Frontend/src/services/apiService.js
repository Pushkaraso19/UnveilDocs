// API configuration and service functions for backend communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class APIService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Helper method to handle API responses
    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    }

    // Helper method to create form data for file uploads
    createFormData(file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
        });
        
        return formData;
    }

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }

    // Upload and process document
    async uploadDocument(file) {
        try {
            const formData = this.createFormData(file);
            
            const response = await fetch(`${this.baseURL}/api/upload`, {
                method: 'POST',
                body: formData
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Document upload failed:', error);
            throw error;
        }
    }

    // Upload and immediately analyze document
    async uploadAndAnalyze(file, analysisType = 'comprehensive') {
        try {
            const formData = this.createFormData(file);
            
            const response = await fetch(`${this.baseURL}/api/upload-and-analyze?analysis_type=${analysisType}`, {
                method: 'POST',
                body: formData
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Upload and analyze failed:', error);
            throw error;
        }
    }

    // Analyze document text
    async analyzeDocument(text, analysisType = 'comprehensive') {
        try {
            const response = await fetch(`${this.baseURL}/api/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    analysis_type: analysisType
                })
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Document analysis failed:', error);
            throw error;
        }
    }

    // Ask a question about the document
    async askQuestion(text, question) {
        try {
            const response = await fetch(`${this.baseURL}/api/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    question
                })
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Question asking failed:', error);
            throw error;
        }
    }

    // Explain a clause
    async explainClause(clause, context = '') {
        try {
            const response = await fetch(`${this.baseURL}/api/explain`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clause,
                    context
                })
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Clause explanation failed:', error);
            throw error;
        }
    }

    // Summarize document
    async summarizeDocument(text) {
        try {
            const response = await fetch(`${this.baseURL}/api/summarize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text
                })
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Document summarization failed:', error);
            throw error;
        }
    }
}

// Create and export a singleton instance
const apiService = new APIService();
export default apiService;

// Export the class for testing purposes
export { APIService };