import React, { useState } from 'react';

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
    <header className="sticky top-0 z-30 flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-black/50 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <svg className="text-[var(--primary-500)]" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2H8.66667V8.66667H15.3333V15.3333H22V22H2V2Z" fill="currentColor"></path>
        </svg>
        <h1 className="text-lg font-bold tracking-tight">Policy Insights</h1>
      </div>
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <label className={`relative transition-all duration-300 ${isSearchFocused ? 'w-64' : 'w-48'}`}>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-white/50"> search </span>
            </span>
            <input 
              className="form-input w-full min-w-0 resize-none overflow-hidden rounded-full border border-white/20 bg-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/50 backdrop-blur-md focus:border-[var(--primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] transition-all duration-300" 
              placeholder="Search policies..." 
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </label>
        </form>
        <div className="relative group">
          <div className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat cursor-pointer" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsglxoULzsJm8EBbd-NuhA3qiiLOu8afYpX-kPImFnIL_Iw9PvMdy9vvu-Mpc1tIM3A8SzdsK1QU28iEsJVAovZO6JJ9BbX839P0THBGzl7Al-YNXGRclLeinaBefUdoIaLtoJJZPCkIUj2pGVUqAI-cau8JWhQS8AA-REB1nRXjT7SAb_DkOgX3aCeMA0c39AXl2dGi1r6aENXkPaXpcwyWBWwWMNkS4l30wVzk7RYnYTk14Q6Cr6bcVXYidzDHYaqpi9wFEJBRE")'}}></div>
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/90 backdrop-blur-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-white border-b border-white/10">
                <p className="font-medium">{userProfile?.name || "User Name"}</p>
                <p className="text-white/60">{userProfile?.email || "user@example.com"}</p>
              </div>
              <a href="#" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors">Sign out</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;