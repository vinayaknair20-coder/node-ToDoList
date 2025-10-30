import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  console.log('ProtectedRoute - User:', user); // DEBUG

  if (!user) {
    console.log('No user, redirecting to login'); // DEBUG
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated, rendering dashboard'); // DEBUG
  return children;
};

export default ProtectedRoute;
