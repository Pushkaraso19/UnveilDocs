import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

function Header() {
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const accountDropdownRef = useRef(null);

    const toggleAccountDropdown = () => {
        setShowAccountDropdown(!showAccountDropdown);
    };
    return (
        <>
            {/* Header */}
            <header className="homepage-header">
                <div className="homepage-logo-container">
                    <img src="/Logo.png" alt="Unveil Docs Logo" className="homepage-logo-icon" />
                    <h2 className="homepage-logo-text">UnveilDocs</h2>
                </div>
                <div className="homepage-nav-container">
                    <div className="homepage-nav-actions">
                        <ThemeToggle className="compact" />
                        {/*
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
                        */}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;