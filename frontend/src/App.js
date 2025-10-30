import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, ToastContext } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Toast from './components/common/Toast';
import Spinner from './components/common/Spinner';
import './App.css';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppContent() {
  const location = useLocation();
  console.log('Current route:', location.pathname); // DEBUG

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      const preventBack = () => {
        window.history.pushState(null, null, window.location.href);
      };

      window.history.pushState(null, null, window.location.href);
      window.addEventListener('popstate', preventBack);

      return () => {
        window.removeEventListener('popstate', preventBack);
      };
    }
  }, [location.pathname]);

  return (
    <Suspense fallback={<div className="loading-page"><Spinner size="large" /></div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function ToastContainer() {
  const toastContext = React.useContext(ToastContext);
  if (!toastContext) {
    console.warn('ToastContext not available'); // DEBUG
    return null;
  }

  return (
    <>
      {toastContext.toasts.map(toast => (
        <Toast 
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      ))}
    </>
  );
}

function App() {
  console.log('App rendering...'); // DEBUG
  return (
    <AuthProvider>
      <ToastContainer />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
