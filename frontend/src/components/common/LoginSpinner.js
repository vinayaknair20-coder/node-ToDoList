import React from 'react';
import './LoginSpinner.css';

const LoginSpinner = ({ visible = false }) => {
  if (!visible) return null;

  return (
    <div className="login-spinner-overlay">
      <div className="login-spinner-container">
        <div className="login-spinner">
          <i className="fas fa-circle-notch"></i>
        </div>
        <p className="spinner-text">Authenticating...</p>
      </div>
    </div>
  );
};

export default LoginSpinner;
