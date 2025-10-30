import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
export const ToastContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      console.log('Loading saved user:', savedUser); // DEBUG
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    console.log('User state changed:', user); // DEBUG
  }, [user]);

  const login = (userData, token) => {
    console.log('Login called with:', userData, token); // DEBUG
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log('User logged in successfully'); // DEBUG
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ToastContext.Provider value={{ toasts, showToast }}>
        {children}
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
};
