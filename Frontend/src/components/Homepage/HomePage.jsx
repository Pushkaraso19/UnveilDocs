import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [question, setQuestion] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const fileInputRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
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

    // Calculate gradient position based on mouse position
    const gradientStyle = {
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(20, 184, 166, 0.15) 0%, 
                rgba(6, 182, 212, 0.1) 30%, 
                rgba(99, 102, 241, 0.05) 60%, 
                transparent 100%)`
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-gray-950 overflow-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 -z-20 h-full w-full bg-gray-950">
                {/* Animated gradient dots */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-medium"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse-medium"></div>
                </div>

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Interactive gradient that follows mouse */}
                <div className="absolute inset-0 opacity-30 transition-all duration-1000" style={gradientStyle}></div>

                {/* Moving gradient orbs */}
                <div className="absolute -left-40 -top-40 -z-10 m-auto h-[560px] w-[560px] rounded-full bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 blur-[100px] animate-float-slow"></div>
                <div className="absolute -right-40 -bottom-40 -z-10 m-auto h-[480px] w-[480px] rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[100px] animate-float-medium"></div>
            </div>

            {/* Main content container */}
            <div className="flex flex-col min-h-screen w-full">
                {/* Header */}
                <header className="flex items-center justify-between px-4 md:px-10 py-4 w-full">
                    <div className="flex items-center gap-3 text-white">
                        <div className="glassmorphism-enhanced p-2 rounded-lg">
                            <svg className="size-7 text-teal-300" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-white text-2xl font-bold leading-tight bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent"> PolicyPal </h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-2">
                        <nav className="hidden md:flex items-center gap-2 glassmorphism-enhanced rounded-full p-1">
                            <a className="text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium leading-normal px-4 py-2 rounded-full hover:bg-white/5" href="#">Home</a>
                            <a className="text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium leading-normal px-4 py-2 rounded-full hover:bg-white/5" href="#">About</a>
                            <a className="text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium leading-normal px-4 py-2 rounded-full hover:bg-white/5" href="#">Contact</a>
                        </nav>
                        <Link to="/dashboard">
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-teal-500 text-white text-base font-bold leading-normal tracking-[-0.015em] transition-all duration-300 hover:bg-teal-400 active:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/50">
                                <span className="truncate">Log In</span>
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 flex flex-col justify-center items-center py-4 md:py-8 px-4 w-full">
                    <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-4xl px-4 py-4">
                        <div className="text-center w-full">
                            <h1 className="text-gray-50 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Your AI Legal Assistant
                            </h1>
                            <p className="text-gray-300 text-base md:text-lg font-normal leading-relaxed mt-3 md:mt-4 max-w-3xl mx-auto">
                                Simply upload your insurance policy documents. Ask questions in plain English and get instant, accurate answers. We support PDF and DOCX files.
                            </p>
                        </div>

                        {/* Upload status */}
                        {uploadedFiles.length > 0 && (
                            <div className="glassmorphism-enhanced rounded-xl p-4 w-full max-w-md backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-teal-300 text-sm font-medium">
                                        {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                                    </span>
                                    <button
                                        onClick={() => setUploadedFiles([])}
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Clear all
                                    </button>
                                </div>
                                <div className="mt-2 space-y-2">
                                    {uploadedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between text-xs text-gray-400">
                                            <span className="truncate max-w-[200px]">{file.name}</span>
                                            <span>{Math.round(file.size / 1024)} KB</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full mt-4 md:mt-6">
                            {/* Feature card 1 */}
                            <div className="glassmorphism-enhanced rounded-2xl p-5 flex flex-col items-center text-center hover:border-teal-400/30 transition-all duration-300 relative overflow-hidden group cursor-pointer backdrop-blur-xl" onClick={triggerFileInput}>
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500/5 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                                <div className="flex items-center justify-center size-14 bg-teal-500/10 rounded-full mb-3 border border-teal-500/20 relative z-10 group-hover:bg-teal-500/20 transition-colors duration-300 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-2xl text-teal-300 group-hover:scale-110 transition-transform duration-300"> upload_file </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Upload Documents</h3>
                                <p className="text-gray-300 text-xs relative z-10">Easily upload your policy documents in PDF or DOCX format.</p>

                                <label className="mt-3 px-3 py-1 bg-teal-500/10 text-teal-300 rounded-full text-xs cursor-pointer hover:bg-teal-500/20 transition-colors duration-300 backdrop-blur-sm">
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
                                </label>
                            </div>

                            {/* Feature card 2 */}
                            <div className="glassmorphism-enhanced rounded-2xl p-5 flex flex-col items-center text-center hover:border-cyan-400/30 transition-all duration-300 relative overflow-hidden group backdrop-blur-xl">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                                <div className="flex items-center justify-center size-14 bg-cyan-500/10 rounded-full mb-3 border border-cyan-500/20 relative z-10 group-hover:bg-cyan-500/20 transition-colors duration-300 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-2xl text-cyan-300 group-hover:scale-110 transition-transform duration-300"> aod_tablet </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Ask Questions</h3>
                                <p className="text-gray-300 text-xs relative z-10">Use natural language to ask questions about your policies.</p>

                                <button
                                    onClick={handleAskExample}
                                    className="mt-3 px-3 py-1 bg-cyan-500/10 text-cyan-300 rounded-full text-xs hover:bg-cyan-500/20 transition-colors duration-300 backdrop-blur-sm"
                                >
                                    Try an example
                                </button>
                            </div>

                            {/* Feature card 3 */}
                            <div className="glassmorphism-enhanced rounded-2xl p-5 flex flex-col items-center text-center hover:border-indigo-400/30 transition-all duration-300 relative overflow-hidden group backdrop-blur-xl">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                                <div className="flex items-center justify-center size-14 bg-indigo-500/10 rounded-full mb-3 border border-indigo-500/20 relative z-10 group-hover:bg-indigo-500/20 transition-colors duration-300 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-2xl text-indigo-300 group-hover:scale-110 transition-transform duration-300"> bolt </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Get Instant Answers</h3>
                                <p className="text-gray-300 text-xs relative z-10">Receive quick and accurate responses from our AI.</p>

                                <div className="mt-3 flex items-center text-indigo-300 text-xs">
                                    <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                                    <span>Typically responds in seconds</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer with input */}
                <footer className="sticky bottom-0 z-10 w-full px-4 md:px-10 py-4">
                    <div className="max-w-4xl mx-auto w-full">
                        <form onSubmit={handleSubmit} className={`relative glassmorphism-enhanced rounded-full p-2 w-full transition-all duration-300 ${isInputFocused ? 'ring-2 ring-teal-500/30' : ''} backdrop-blur-xl`}>
                            <div className="flex items-center gap-2 w-full">
                                <label className={`flex items-center justify-center size-9 md:size-10 rounded-full border ${isUploading ? 'bg-teal-500/20 border-teal-500/50' : 'bg-gray-700/50 border-gray-600/80'} text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm`}>
                                    {isUploading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-400"></div>
                                    ) : (
                                        <span className="material-symbols-outlined text-lg md:text-xl">attach_file</span>
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
                                <input
                                    className="w-full h-9 md:h-10 pl-3 pr-14 bg-transparent border-none text-white placeholder-gray-400 text-sm md:text-base focus:outline-none focus:ring-0"
                                    placeholder="Ask a question about your policy..."
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    disabled={uploadedFiles.length === 0}
                                />
                                <button
                                    type="submit"
                                    disabled={!question.trim() || uploadedFiles.length === 0}
                                    className="absolute inset-y-2 right-2 flex items-center justify-center size-9 md:size-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-teal-500/30 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                >
                                    <span className="material-symbols-outlined text-lg md:text-xl"> send </span>
                                </button>
                            </div>
                        </form>

                        {uploadedFiles.length === 0 && (
                            <div className="text-center mt-3 text-gray-400 text-xs md:text-sm">
                                Upload a document to start asking questions
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;