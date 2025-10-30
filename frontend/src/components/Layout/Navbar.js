import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToastContext } from '../../hooks/useToastContext';
import LoginSpinner from '../common/LoginSpinner';
import './Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();
  const { showToast } = useToastContext();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [loggingOut, setLoggingOut] = useState(false);

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
    setLoggingOut(true);

    // Simulate logout process with delay
    setTimeout(() => {
      // Clear browser history
      window.history.replaceState(null, null, '/login');

      // Remove event listeners
      window.removeEventListener('popstate', () => {});

      // Logout
      logout();

      // Show toast notification
      showToast('You have been logged out successfully', 'success');

      // Navigate to login with replace
      navigate('/login', { replace: true });

      setLoggingOut(false);
    }, 800);
  };

  return (
    <>
      <LoginSpinner visible={loggingOut} text="Logging out..." />

      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-title">
            <i className="fas fa-clipboard-list"></i> TaskMaster
          </h1>
          <div className="navbar-actions">
            <button
              onClick={() => setIsDark(!isDark)}
              className="btn-theme"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
              disabled={loggingOut}
            >
              <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button
              onClick={handleLogout}
              className="btn-logout-nav"
              disabled={loggingOut}
              title="Logout from your account"
            >
              <i className={`fas ${loggingOut ? 'fa-spinner fa-spin' : 'fa-sign-out-alt'}`}></i>
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
