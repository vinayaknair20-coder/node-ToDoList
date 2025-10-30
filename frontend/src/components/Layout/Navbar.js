import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    // Clear browser history
    window.history.replaceState(null, null, '/login');
    
    // Remove event listeners
    window.removeEventListener('popstate', () => {});
    
    // Logout
    logout();
    
    // Navigate to login with replace
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">📋 TaskMaster</h1>
        <div className="navbar-actions">
          <button
            onClick={() => setIsDark(!isDark)}
            className="btn-theme"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="btn-logout-nav">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
