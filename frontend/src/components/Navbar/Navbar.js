// src/components/Navbar.js
import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h2 className="navbar-title">Student Information System</h2>
            <div className="navbar-links">
                <a href="/">Home</a>
                <a href="/profile">Profile</a>
                <a href="/courses">Courses</a>
                <a href="/fees">Fees</a>
            </div>
        </nav>
    );
};

export default Navbar;
