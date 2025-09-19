import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  // Show icon based on theme
  let icon, label;
  if (theme === 'dark') {
    icon = <span className="material-symbols-outlined">light_mode</span>;
    label = 'Switch to light mode';
  } else {
    icon = <span className="material-symbols-outlined">dark_mode</span>;
    label = 'Switch to dark mode';
  }
  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      aria-label={label}
      title={label}
    >
  <div className="theme-toggle-inner theme-toggle-fade">
        <div className="theme-toggle-icon">
          {icon}
        </div>
        <div className="theme-toggle-bg" />
      </div>
    </button>
  );
};

export default ThemeToggle;