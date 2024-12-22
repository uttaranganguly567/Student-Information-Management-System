import React from 'react';
import './Sidebar.css';
//import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <a href="/profile">Profile</a>
            <a href="/students">Students</a>
            <a href="/courses">Courses</a>
            <a href="/fees">Fees</a>
        </div>
    );
};

export default Sidebar;
