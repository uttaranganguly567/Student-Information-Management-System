// frontend/src/pages/LoginPage/LoginPage.js
// --- FULL REPLACEABLE CODE ---

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import { FaMoon, FaSun } from 'react-icons/fa'; // 1. Import icons

// 2. Accept theme props
const LoginPage = ({ theme, toggleTheme }) => { 
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { username, password };
    dispatch(login(userData));
  };

  return (
    <div className="auth-container">
      {/* 3. Add the theme toggle button */}
      <button type="button" onClick={toggleTheme} className="auth-theme-toggle">
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      <form className="auth-form" onSubmit={onSubmit}>
        <h1 className="auth-title">Welcome Back</h1>
        <div className="auth-form-group">
          {/* ... (rest of the form) ... */}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="auth-form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;