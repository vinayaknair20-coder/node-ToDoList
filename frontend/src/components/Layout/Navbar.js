import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">📝 TaskMaster</h1>
        <button onClick={handleLogout} className="btn-logout-nav">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
