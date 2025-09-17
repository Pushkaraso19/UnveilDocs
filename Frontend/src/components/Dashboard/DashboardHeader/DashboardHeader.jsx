import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import './DashboardHeader.css';

const DashboardHeader = ({ onSearch, userProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <Link to="/" className="dashboard-header-logo-link">
          <svg className="dashboard-header-logo" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2H8.66667V8.66667H15.3333V15.3333H22V22H2V2Z" fill="currentColor"></path>
          </svg>
        </Link>
        <h1 className="dashboard-header-title">
          <Link to="/" className="dashboard-header-title-link">
            UnveilDocs Insights
          </Link>
        </h1>
      </div>
      <div className="dashboard-header-right">
        <ThemeToggle className="compact nav-style" />
        <form onSubmit={handleSearchSubmit} className="dashboard-search-form">
          <div className={`dashboard-search-container ${isSearchFocused ? 'focused' : ''}`}>
            <div className="dashboard-search-icon">
              <span className="material-symbols-outlined dashboard-search-icon-symbol">search</span>
            </div>
            <input 
              className="dashboard-search-input" 
              placeholder="Search documents..." 
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </form>
        <div className="dashboard-user-menu">
          <div className="dashboard-user-avatar" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsglxoULzsJm8EBbd-NuhA3qiiLOu8afYpX-kPImFnIL_Iw9PvMdy9vvu-Mpc1tIM3A8SzdsK1QU28iEsJVAovZO6JJ9BbX839P0THBGzl7Al-YNXGRclLeinaBefUdoIaLtoJJZPCkIUj2pGVUqAI-cau8JWhQS8AA-REB1nRXjT7SAb_DkOgX3aCeMA0c39AXl2dGi1r6aENXkPaXpcwyWBWwWMNkS4l30wVzk7RYnYTk14Q6Cr6bcVXYidzDHYaqpi9wFEJBRE")'}}></div>
          <div className="dashboard-user-dropdown">
            <div className="dashboard-user-dropdown-content">
              <div className="dashboard-user-info">
                <p className="dashboard-user-name">{userProfile?.name || "User Name"}</p>
                <p className="dashboard-user-email">{userProfile?.email || "user@example.com"}</p>
              </div>
              <a href="#" className="dashboard-user-menu-item">Profile</a>
              <a href="#" className="dashboard-user-menu-item">Settings</a>
              <a href="#" className="dashboard-user-menu-item">Sign out</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;