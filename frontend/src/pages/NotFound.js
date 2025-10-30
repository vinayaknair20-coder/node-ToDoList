import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-go-home">
          ← Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
