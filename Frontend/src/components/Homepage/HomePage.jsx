import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './HomePage.css';

const HomePage = () => {
    const [question, setQuestion] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const fileInputRef = useRef(null);
    const accountDropdownRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setShowAccountDropdown(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            console.log('Question submitted:', question);
            setQuestion('');
        }
    };

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

    const handleAskExample = () => {
        setQuestion("What's covered in my policy?");
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const toggleAccountDropdown = () => {
        setShowAccountDropdown(!showAccountDropdown);
    };

    // Calculate gradient position based on mouse position
    const gradientStyle = {
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(56, 224, 123, 0.15) 0%, 
                rgba(6, 182, 212, 0.1) 30%, 
                rgba(99, 102, 241, 0.05) 60%, 
                transparent 100%)`
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
                {/* Header */}
                <header className="homepage-header">
                    <div className="homepage-logo-container">
                        <div className="homepage-logo-container-enhanced">
                            <svg className="homepage-logo-icon" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="homepage-logo-text">UnveilDocs</h2>
                    </div>
                    <div className="homepage-nav-container">
                        <div className="homepage-nav-actions">
                            <ThemeToggle className="compact" />
                            <div className="homepage-account-container" ref={accountDropdownRef}>
                                <button
                                    className="homepage-account-btn"
                                    onClick={toggleAccountDropdown}
                                    aria-expanded={showAccountDropdown}
                                    aria-label="Account menu"
                                >
                                    <span className="material-symbols-outlined">account_circle</span>
                                </button>

                                {showAccountDropdown && (
                                    <div className="homepage-account-dropdown glassmorphism-card">
                                        <div className="homepage-account-dropdown-item">
                                            <span className="material-symbols-outlined">manage_accounts</span>
                                            <span>My Account</span>
                                        </div>
                                        <div className="homepage-account-dropdown-item">
                                            <span className="material-symbols-outlined">support_agent</span>
                                            <span>Contact Us</span>
                                        </div>

                                        <div className="homepage-account-dropdown-item">
                                            <span className="material-symbols-outlined">logout</span>
                                            <span>Logout</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

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
                            {/* Feature card 1 - Upload Documents */}
                            <div className="homepage-feature-card glassmorphism-card" onClick={triggerFileInput}>
                                <div className="homepage-feature-card-bg"></div>
                                <div className="homepage-feature-icon">
                                    <span className="material-symbols-outlined homepage-feature-icon-symbol">upload_file</span>
                                </div>
                                <h3 className="homepage-feature-title">Upload Documents</h3>
                                <p className="homepage-feature-description">Easily upload your legal documents in PDF or DOCX format for AI-powered analysis.</p>

                                <button className="homepage-feature-button">
                                    <span>Select files</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept=".pdf,.docx"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                    />
                                </button>
                            </div>

                            {/* Feature card 2 - Ask Questions */}
                            <div className="homepage-feature-card glassmorphism-card">
                                <div className="homepage-feature-card-bg homepage-feature-card-bg-cyan"></div>
                                <div className="homepage-feature-icon homepage-feature-icon-cyan">
                                    <span className="material-symbols-outlined homepage-feature-icon-symbol homepage-feature-icon-symbol-cyan">psychology</span>
                                </div>
                                <h3 className="homepage-feature-title">Ask Questions</h3>
                                <p className="homepage-feature-description">Use natural language to ask questions about your documents and get instant insights.</p>

                                <button
                                    onClick={handleAskExample}
                                    className="homepage-feature-button homepage-feature-button-cyan"
                                >
                                    Try an example
                                </button>
                            </div>

                            {/* Feature card 3 - Get Instant Answers */}
                            <div className="homepage-feature-card glassmorphism-card">
                                <div className="homepage-feature-card-bg homepage-feature-card-bg-indigo"></div>
                                <div className="homepage-feature-icon homepage-feature-icon-indigo">
                                    <span className="material-symbols-outlined homepage-feature-icon-symbol homepage-feature-icon-symbol-indigo">auto_awesome</span>
                                </div>
                                <h3 className="homepage-feature-title">Get Instant Answers</h3>
                                <p className="homepage-feature-description">Receive quick and accurate responses with detailed analysis and explanations.</p>

                                <div className="homepage-feature-timing">
                                    <span className="material-symbols-outlined homepage-feature-timing-icon">schedule</span>
                                    <span>Typically responds in seconds</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    
{/* Dynamic Footer */}
                    <div
                        className={`homepage-upload-only glassmorphism-enhanced ${isUploading ? 'uploading' : ''}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleFileUpload({ target: { files: e.dataTransfer.files } });
                        }}
                    >
                        <label className={`homepage-file-upload-btn ${isUploading ? 'uploading' : ''}`}>
                            {!isUploading && (
                                <span className="material-symbols-outlined homepage-file-upload-icon">upload_file</span>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                accept=".pdf,.docx"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                            />
                        </label>

                        <div className="homepage-upload-details">
                            {isUploading && (
                                <span className="homepage-upload-text">Uploading...</span>
                            )}

                            {!isUploading && uploadedFiles.length === 0 && (
                                <span className="homepage-upload-text">
                                    Drag & drop or click to upload PDF/DOCX
                                </span>
                            )}

                            {!isUploading && uploadedFiles.length > 0 && (
                                <div className="homepage-upload-list">
                                    <div className="homepage-upload-header">
                                        <span className="homepage-upload-count">
                                            {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                                        </span>
                                        <button
                                            onClick={() => setUploadedFiles([])}
                                            className="homepage-upload-clear"
                                        >
                                            Clear all
                                        </button>
                                    </div>

                                    <div className="homepage-upload-files">
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="homepage-upload-file">
                                                <span className="material-symbols-outlined homepage-upload-file-icon">
                                                    {file.type.includes("pdf") ? "picture_as_pdf" : "description"}
                                                </span>
                                                <span className="homepage-upload-file-name">{file.name}</span>
                                                <span className="homepage-upload-file-size">
                                                    {Math.round(file.size / 1024)} KB
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                
            </div>
        </div>
    );
};

export default HomePage;