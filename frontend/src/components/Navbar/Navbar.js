// frontend/src/components/Navbar/Navbar.js
// --- FULL REPLACEABLE CODE ---

import React from 'react'; // Removed useState, useEffect
import './Navbar.css';
import { FaMoon, FaSun, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';

// 1. Accept theme props
const Navbar = ({ theme, toggleTheme, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // 2. All local theme logic is GONE

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button onClick={toggleSidebar} className="sidebar-toggle-button">
          <FaBars />
        </button>
        
        <Link to="/dashboard" className="navbar-title-link">
          <div className="navbar-title">Campus Core</div>
        </Link>
      </div>
      
      <div className="navbar-right">
        {user && (
          <span className="navbar-greeting">
            Hi, {user.username} ({user.role})
          </span>
        )}
        {/* 3. Button now uses props */}
        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <button onClick={onLogout} className="theme-toggle-button logout-button">
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;