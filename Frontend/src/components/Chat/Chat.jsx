import React, { useState } from 'react';
import sampleDocument from '../../assets/MASTER SERVICES AGREEMENT.pdf';
import './Chat.css';
import ReuploadConfirmModal from './ReuploadConfirmModal';

const Chat = ({ uploadedFiles, onReupload, onStartAnalysis, onBackFromAnalysis, isUploading, isAnalyzing, showAnalysis, analysisResult, triggerUploadOnlyFileInput, uploadOnlyFileInputRef, handleFileUpload, isGlobalDragActive, setIsGlobalDragActive  }) => {
    const [question, setQuestion] = useState('');
    const [showReuploadModal, setShowReuploadModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            console.log('Question submitted:', question);
            setQuestion('');
        }
    };

    const handleAskExample = async () => {
        // Fetch the actual sample PDF from assets and create a File object
        try {
            const response = await fetch(sampleDocument);
            const blob = await response.blob();
            const exampleFile = new File([blob], 'MASTER SERVICES AGREEMENT.pdf', { type: 'application/pdf' });
            handleFileUpload({ target: { files: [exampleFile] } });
        } catch (err) {
            console.error('Failed to load example PDF:', err);
        }
    };

    const handleReupload = (e) => {
        e.stopPropagation();
        setShowReuploadModal(true);
    };

    const handleReuploadConfirm = () => {
        if (onReupload) {
            onReupload();
        }
    };

    const handleReuploadCancel = () => {
        setShowReuploadModal(false);
    };

    const handleStartAnalysis = () => {
        if (onStartAnalysis) {
            onStartAnalysis();
        }
    };
 
    // If no file is uploaded, show upload section
    if (!uploadedFiles || uploadedFiles.length === 0) {
        return (
            <div className="chat-interface">
                <div className="chat-container">
                    {/* Header with example button for upload section */}
                    <div className="chat-header upload-header">
                        <div className="upload-header-actions">
                            <button 
                                className="chat-action-btn upload-load-example-btn"
                                onClick={handleAskExample}
                            >
                                <span className="material-symbols-outlined">description</span>
                                Load Example
                            </button>
                        </div>
                    </div>
                    <div className="homepage-upload-container">
                        <div
                            className={`homepage-upload-only glassmorphism-enhanced ${isUploading ? 'uploading' : ''}`}
                    onClick={triggerUploadOnlyFileInput}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFileUpload({ target: { files: e.dataTransfer.files } });
                    }}
                    style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}
                    tabIndex={0}
                    role="button"
                    aria-label="Upload documents"
                >
                    {!isUploading && (
                        <div className={`homepage-file-upload-btn`}>
                            <span className="material-symbols-outlined homepage-file-upload-icon">upload_file</span>
                            <input
                                ref={uploadOnlyFileInputRef}
                                type="file"
                                className="hidden"
                                multiple
                                accept=".pdf,.docx"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                            />
                        </div>
                    )}
                    <div className="homepage-upload-details">
                        {isUploading ? (
                            <div>
                                <div className="homepage-upload-text">Processing your document...</div>
                                <div className="homepage-upload-text subtitle">Please wait while we prepare your file</div>
                            </div>
                        ) : (
                            <div>
                                <div className="homepage-upload-text">
                                    Drag & drop or click to upload Legal Document
                                </div>
                                <div className="homepage-upload-text subtitle">
                                    Supports PDF and DOCX files
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Overlay that appears on drag */}
                {isGlobalDragActive && (
                    <div 
                        className="homepage-global-drop-overlay"
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsGlobalDragActive(false);
                            if (e.dataTransfer.files.length > 0) {
                                handleFileUpload({ target: { files: e.dataTransfer.files } });
                            }
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <div className="homepage-global-drop-content">
                            <span className="material-symbols-outlined homepage-global-drop-icon">upload_file</span>
                            <div className="homepage-global-drop-text-container">
                                <div className="homepage-global-drop-text">Drop files here</div>
                                <div className="homepage-global-drop-subtext">PDF or DOCX files</div>
                            </div>
                        </div>
                    </div>
                )}
                    </div>
                </div>
            </div>
        );
    }

    // If file is uploaded, show chatbar
    return (
        <div className="chat-interface">
            {/* Chat interface with reorganized layout */}
            <div className="chat-container">
                {/* Top header with file name on left and examples button on right */}
                <div className="chat-header chat-header-with-file">
                    <div className="chat-file-info">
                        <span className="chat-file-name">{uploadedFiles[0].name}</span>
                    </div>
                    <div className="chat-header-actions">
                        <button 
                            className="chat-action-btn chat-action-examples"
                            onClick={(e) => e.preventDefault()}
                            disabled={true}
                            title="Example questions coming soon - Only analysis available in prototype"
                        >
                            <span className="material-symbols-outlined">quiz</span>
                            Example Questions
                        </button>
                    </div>
                </div>
                {/* Chat input area with disconnected reupload button */}
                <div className="chat-input-area">
                    <button
                        onClick={handleReupload}
                        className="chat-reupload-btn-disconnected"
                        title="Upload new file"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            placeholder="Type your questions here (Chat feature coming soon - Only analysis available)"
                            className="chat-input"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                            disabled={true}
                        />
                        {/* Only show action button when there are files but no analysis results displayed */}
                        {uploadedFiles.length > 0 && !analysisResult && (
                            <button 
                                className={`chat-action-btn chat-action-analysis`}
                                onClick={handleStartAnalysis}
                                disabled={isAnalyzing}
                            >
                                <span className="material-symbols-outlined">
                                    auto_awesome
                                </span>
                                {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                            </button>
                        )}
                        <button
                            onClick={handleSubmit}
                            className="chat-submit-btn chat-submit-btn-disabled"
                            disabled={true}
                            title="Chat feature coming soon - Only analysis available in prototype"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <ReuploadConfirmModal
                isOpen={showReuploadModal}
                onClose={handleReuploadCancel}
                onConfirm={handleReuploadConfirm}
            />
        </div>
    );
};

export default Chat;