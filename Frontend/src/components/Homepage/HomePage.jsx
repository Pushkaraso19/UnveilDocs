import React, { useState, useRef, useEffect } from 'react';
import './HomePage.css';
import Header from '../Header/Header';
import Chat from '../Chat/Chat';
import LegalInsights from '../LegalInsights/LegalInsights';
import apiService from '../../services/apiService';

const HomePage = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [documentText, setDocumentText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [error, setError] = useState(null);
    
    const [isGlobalDragActive, setIsGlobalDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        // Global drag events for file overlay
        let dragCounter = 0;
        
        const handleDragEnter = (e) => {
            e.preventDefault();
            // Check if the dragged item contains files
            if (e.dataTransfer && e.dataTransfer.types && 
                (e.dataTransfer.types.includes('Files') || e.dataTransfer.types.includes('application/x-moz-file'))) {
                dragCounter++;
                setIsGlobalDragActive(true);
            }
        };
        
        const handleDragOver = (e) => {
            e.preventDefault();
        };
        
        const handleDragLeave = (e) => {
            e.preventDefault();
            dragCounter--;
            if (dragCounter <= 0) {
                setIsGlobalDragActive(false);
                dragCounter = 0;
            }
        };
        
        const handleDrop = (e) => {
            e.preventDefault();
            setIsGlobalDragActive(false);
            dragCounter = 0;
        };

        // Handle drag cancel and ensure proper cleanup
        const handleDragEnd = (e) => {
            setIsGlobalDragActive(false);
            dragCounter = 0;
        };

        // Additional cleanup on mouse leave window
        const handleMouseLeave = (e) => {
            if (e.target === document.documentElement) {
                setIsGlobalDragActive(false);
                dragCounter = 0;
            }
        };

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            // Handle any global click events if needed
        };

        // Add event listeners to document and window
        document.addEventListener('dragenter', handleDragEnter);
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('dragleave', handleDragLeave);
        document.addEventListener('drop', handleDrop);
        document.addEventListener('dragend', handleDragEnd);
        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mousemove', handleMouseMove);
        // Remove the problematic event listener for now
        // document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('dragenter', handleDragEnter);
            document.removeEventListener('dragover', handleDragOver);
            document.removeEventListener('dragleave', handleDragLeave);
            document.removeEventListener('drop', handleDrop);
            document.removeEventListener('dragend', handleDragEnd);
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mousemove', handleMouseMove);
            // document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0]; // Take the first file
            setIsUploading(true);
            setError(null);
            
            try {
                // Upload and process document with backend
                const response = await apiService.uploadDocument(file);
                
                if (response.success) {
                    const processedDoc = response.data;
                    
                    // Update state with processed document
                    const newFile = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        originalFile: file,
                        processedText: processedDoc.text,
                        metadata: processedDoc.metadata
                    };
                    
                    setUploadedFiles([newFile]);
                    setDocumentText(processedDoc.text);
                    setIsUploading(false);
                    e.target.value = '';
                    
                    console.log('Document processed successfully:', {
                        filename: file.name,
                        textLength: processedDoc.text.length,
                        metadata: processedDoc.metadata
                    });
                } else {
                    throw new Error('Document processing failed');
                }
            } catch (error) {
                console.error('File upload error:', error);
                setError(`Upload failed: ${error.message}`);
                setIsUploading(false);
                e.target.value = '';
                
                // Show error for a few seconds then hide
                setTimeout(() => setError(null), 5000);
            }
        }
    };

    const handleReupload = () => {
        setUploadedFiles([]);
        setDocumentText('');
        setAnalysisResult(null);
        setShowAnalysis(false);
        setError(null);
    };

    const handleStartAnalysis = async () => {
        if (!documentText) {
            setError('No document text available for analysis');
            return;
        }
        
        setIsAnalyzing(true);
        setError(null);
        
        try {
            console.log('Starting document analysis...');
            
            // Perform comprehensive analysis
            const response = await apiService.analyzeDocument(documentText, 'comprehensive');
            
            if (response.success) {
                setAnalysisResult(response.data);
                setShowAnalysis(true);
                console.log('Analysis completed successfully:', response.data);
            } else {
                throw new Error('Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            setError(`Analysis failed: ${error.message}`);
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleBackFromAnalysis = () => {
        setShowAnalysis(false);
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    

    // Calculate gradient position based on mouse position
    const gradientStyle = {
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(56, 224, 123, 0.15) 0%, 
                rgba(6, 182, 212, 0.1) 30%, 
                rgba(99, 102, 241, 0.05) 60%, 
                transparent 100%)`
    };

    // Ref for the upload-only file input
    const uploadOnlyFileInputRef = useRef(null);

    // Handler to trigger file input for upload-only area
    const triggerUploadOnlyFileInput = () => {
        if (uploadOnlyFileInputRef.current && !isUploading) {
            uploadOnlyFileInputRef.current.click();
        }
    };

    return (
        <div className="homepage-container">
            {/* Show LegalInsights when analysis is complete */}
            {showAnalysis && analysisResult ? (
                <>
                    {/* Enhanced Animated Background */}
                    <div className="homepage-bg">
                        {/* Animated gradient dots */}
                        <div className="homepage-bg-dots">
                            <div className="homepage-bg-gradient-1"></div>
                            <div className="homepage-bg-gradient-2"></div>
                            <div className="homepage-bg-gradient-3"></div>
                            <div className="homepage-bg-gradient-4"></div>
                        </div>

                        {/* Grid pattern */}
                        <div className="homepage-bg-grid"></div>

                        {/* Interactive gradient that follows mouse */}
                        <div className="homepage-bg-mouse-gradient" style={gradientStyle}></div>

                        {/* Moving gradient orbs */}
                        <div className="homepage-bg-floating-orb-1"></div>
                        <div className="homepage-bg-floating-orb-2"></div>
                    </div>

                    {/* Error notification */}
                    {error && (
                        <div className="error-notification">
                            <div className="error-content">
                                <span className="material-symbols-outlined">error</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Main content container with fixed header and scrollable insights */}
                    <div className="homepage-main-container">
                        <Header />
                        
                        {/* Scrollable insights area */}
                        <main className="homepage-main insights-main">
                            <div className="insights-scrollable-container">
                                <LegalInsights 
                                    analysisData={analysisResult}
                                    documentInfo={uploadedFiles[0]}
                                    onBack={handleBackFromAnalysis}
                                    documentText={documentText}
                                />
                            </div>
                        </main>
                    </div>
                    
                    {/* Chat Component - renders when files are uploaded */}
                    <Chat 
                        uploadedFiles={uploadedFiles}
                        onReupload={handleReupload}
                        onStartAnalysis={handleStartAnalysis}
                        onBackFromAnalysis={handleBackFromAnalysis}
                        isUploading={isUploading}
                        isAnalyzing={isAnalyzing}
                        showAnalysis={showAnalysis}
                        analysisResult={analysisResult}
                        triggerUploadOnlyFileInput={triggerUploadOnlyFileInput}
                        uploadOnlyFileInputRef={uploadOnlyFileInputRef}
                        handleFileUpload={handleFileUpload}
                        isGlobalDragActive={isGlobalDragActive}
                        setIsGlobalDragActive={setIsGlobalDragActive}
                    />
                </>
            ) : (
                <>
                    {/* Enhanced Animated Background */}
                    <div className="homepage-bg">
                        {/* Animated gradient dots */}
                        <div className="homepage-bg-dots">
                            <div className="homepage-bg-gradient-1"></div>
                            <div className="homepage-bg-gradient-2"></div>
                            <div className="homepage-bg-gradient-3"></div>
                            <div className="homepage-bg-gradient-4"></div>
                        </div>

                        {/* Grid pattern */}
                        <div className="homepage-bg-grid"></div>

                        {/* Interactive gradient that follows mouse */}
                        <div className="homepage-bg-mouse-gradient" style={gradientStyle}></div>

                        {/* Moving gradient orbs */}
                        <div className="homepage-bg-floating-orb-1"></div>
                        <div className="homepage-bg-floating-orb-2"></div>
                    </div>

                    {/* Error notification */}
                    {error && (
                        <div className="error-notification">
                            <div className="error-content">
                                <span className="material-symbols-outlined">error</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

            {/* Main content container */}
            <div className="homepage-main-container">
                <Header />
                {/* Main content */}
                <main className="homepage-main">
                    <div className="homepage-content">
                        <div className="homepage-text-center">
                            <h1 className="homepage-title">
                                Your AI Legal Assistant
                            </h1>
                            <p className="homepage-subtitle">
                                Simply upload your legal documents. Ask questions in plain English and get instant, accurate answers. We support PDF and DOCX files.
                            </p>
                        </div>

                        <div className="homepage-features-grid">
                            {/* Feature card 1 - Smart Document Summarization */}
                            <div className="homepage-feature-card glassmorphism-card" onClick={triggerFileInput}>
                                <div className="homepage-feature-card-bg"></div>
                                <div className="homepage-feature-icon">
                                    <span className="material-symbols-outlined homepage-feature-icon-symbol">summarize</span>
                                </div>
                                <h3 className="homepage-feature-title">Summarize Legal Documents</h3>
                                <p className="homepage-feature-description">Get concise, AI-generated summaries of lengthy contracts, agreements, and policies in seconds.</p>
                                {/* Action removed for minimalist look */}
                            </div>

                            {/* Feature card 2 - Clause & Risk Detection */}
                            <div className="homepage-feature-card glassmorphism-card">
                                <div className="homepage-feature-card-bg homepage-feature-card-bg-cyan"></div>
                                <div className="homepage-feature-icon homepage-feature-icon-cyan">
                                    <span className="material-symbols-outlined homepage-feature-icon-symbol homepage-feature-icon-symbol-cyan">gavel</span>
                                </div>
                                <h3 className="homepage-feature-title">Detect Key Clauses & Risks</h3>
                                <p className="homepage-feature-description">Automatically highlight important clauses, obligations, and potential risks in your documents.</p>
                                {/* Action removed for minimalist look */}
                            </div>

                            {/* Feature card 3 - Instant Q&A & Insights */}
                            <div className="homepage-feature-card glassmorphism-card">
                                <div className="homepage-feature-card-bg homepage-feature-card-bg-indigo"></div>
                                <div className="homepage-feature-icon homepage-feature-icon-indigo">
                                    <span className="material-symbols-outlined homepage-feature-icon-symbol homepage-feature-icon-symbol-indigo">question_answer</span>
                                </div>
                                <h3 className="homepage-feature-title">Ask Anything, Get Answers</h3>
                                <p className="homepage-feature-description">Type your questions and receive instant, context-aware answers about your legal documents.</p>
                                {/* Action removed for minimalist look */}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Chat Component - renders when files are uploaded */}
            <Chat 
                uploadedFiles={uploadedFiles}
                onReupload={handleReupload}
                onStartAnalysis={handleStartAnalysis}
                onBackFromAnalysis={handleBackFromAnalysis}
                isUploading={isUploading}
                isAnalyzing={isAnalyzing}
                showAnalysis={showAnalysis}
                analysisResult={analysisResult}
                triggerUploadOnlyFileInput={triggerUploadOnlyFileInput}
                uploadOnlyFileInputRef={uploadOnlyFileInputRef}
                handleFileUpload={handleFileUpload}
                isGlobalDragActive={isGlobalDragActive}
                setIsGlobalDragActive={setIsGlobalDragActive}
            />
                </>
            )}
        </div>
    );
};

export default HomePage;