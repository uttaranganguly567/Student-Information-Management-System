// frontend/src/pages/RegisterPage/RegisterPage.js
// --- FULL REPLACEABLE CODE ---

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';
import { FaMoon, FaSun } from 'react-icons/fa';

const RegisterPage = ({ theme, toggleTheme }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student',
    name: '',   // Used for Student OR Teacher name
    roll: '',   // Used only for Student roll number
  });

  const { username, password, role, name, roll } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) { alert(message); }
    if (isSuccess || user) { navigate('/dashboard'); }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Send all relevant data based on role
    const userData = { username, password, role };
    if (role === 'student') {
      userData.name = name;
      userData.roll = roll;
    } else if (role === 'teacher') {
      userData.name = name; // Send name for teacher
    }
    dispatch(register(userData));
  };

  return (
    <div className="auth-container">
      <button type="button" onClick={toggleTheme} className="auth-theme-toggle">
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      <form className="auth-form" onSubmit={onSubmit}>
        <h1 className="auth-title">Create Account</h1>

        <div className="auth-form-group">
          <label htmlFor="role">Register as:</label>
          <select name="role" value={role} onChange={onChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* --- UPDATED Conditional Fields --- */}
        {/* Show Name field for Student OR Teacher */}
        {(role === 'student' || role === 'teacher') && (
          <div className="auth-form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" name="name" value={name} onChange={onChange} required />
          </div>
        )}

        {/* Show Roll Number field ONLY for Student */}
        {role === 'student' && (
          <div className="auth-form-group">
            <label htmlFor="roll">Roll Number</label>
            <input type="text" name="roll" value={roll} onChange={onChange} required />
          </div>
        )}
        {/* ---------------------------------- */}

        <div className="auth-form-group">
          <label htmlFor="username">Username (for login)</label>
          <input type="text" name="username" value={username} onChange={onChange} required />
        </div>
        <div className="auth-form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;