// src/pages/StudentProfilePage.js
import React from 'react';
import './StudentProfilePage.css';
import { Link } from 'react-router-dom';

const StudentProfilePage = () => {
    return (
        <div className="page-container">
            <h2 className="page-title">Student Profile</h2>
            <div className="profile-container">
                <div className="profile-info">
                    <h3>John Doe</h3>
                    <p><strong>Roll Number:</strong> 12345</p>
                    <p><strong>Year:</strong> 3</p>
                    <p><strong>Department:</strong> Computer Science</p>
                    <p><strong>Age:</strong> 20</p>
                    <p><strong>Contact:</strong> 9876543210</p>
                </div>
                <div className="profile-actions">
                    <button className="action-btn">Edit Profile</button>
                    <button className="action-btn">View Grades</button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfilePage;
