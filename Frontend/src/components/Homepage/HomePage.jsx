import React, { useState, useRef, useEffect } from 'react';
import './HomePage.css';
import Header from '../Header/Header';
import Chat from '../Chat/Chat';

const HomePage = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    
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

    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setIsUploading(true);
            setTimeout(() => {
                const newFiles = Array.from(files).map(file => ({
                    name: file.name,
                    type: file.type,
                    size: file.size
                }));
                setUploadedFiles([...uploadedFiles, ...newFiles]);
                setIsUploading(false);
                e.target.value = '';
            }, 1500);
        }
    };

    const handleReupload = () => {
        setUploadedFiles([]);
    };

    const handleStartAnalysis = () => {
        console.log('Proceed with analysis');
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
                isUploading={isUploading}
                triggerUploadOnlyFileInput={triggerUploadOnlyFileInput}
                uploadOnlyFileInputRef={uploadOnlyFileInputRef}
                handleFileUpload={handleFileUpload}
                isGlobalDragActive={isGlobalDragActive}
                setIsGlobalDragActive={setIsGlobalDragActive}
            />
        </div>
    );
};

export default HomePage;