import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToastContext } from '../hooks/useToastContext';
import { authAPI } from '../utils/api';
import LoginSpinner from '../components/common/LoginSpinner';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToastContext();
  const navigate = useNavigate();

  useEffect(() => {
    window.history.replaceState(null, null, '/login');
    return () => {
      window.removeEventListener('popstate', () => {});
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setMessage('Please fill all fields');
      showToast('Please fill all fields', 'error');
      return;
    }

    if (!isLogin && !formData.name) {
      setMessage('Name is required for signup');
      showToast('Name is required for signup', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = isLogin 
        ? await authAPI.login({ email: formData.email, password: formData.password })
        : await authAPI.signup(formData);

      const { token, name, userId } = response.data;
      login({ userId, name }, token);
      
      showToast(
        isLogin 
          ? `Welcome back, ${name}!` 
          : `Welcome ${name}! Account created successfully!`,
        'success',
        3500
      );
      
      setMessage(`Welcome ${name}!`);
      window.history.replaceState(null, null, '/dashboard');
      
      setTimeout(() => navigate('/dashboard', { replace: true }), 500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Authentication failed';
      setMessage(errorMsg);
      showToast(errorMsg, 'error');
      setLoading(false);
    }
  };

  return (
    <>
      <LoginSpinner visible={loading} />
      
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">
            <i className="fas fa-clipboard-list"></i> TaskMaster
          </h1>
          <p className="login-subtitle">Your Personal Task Manager</p>

          {message && (
            <div className={`alert ${message.includes('failed') || message.includes('required') ? 'alert-error' : 'alert-success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Loading...
                </>
              ) : (
                <>
                  <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                  {isLogin ? 'Login' : 'Sign Up'}
                </>
              )}
            </button>
          </form>

          <div className="login-toggle">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', email: '', password: '' });
                  setMessage('');
                  setShowPassword(false);
                }}
                className="toggle-btn"
                disabled={loading}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
