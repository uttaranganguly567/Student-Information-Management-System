import React, { useState } from 'react';
import './DashboardPage.css';
//import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="dashboard">
            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <h2 id='dash-text'>Dashboard</h2>
                <button className="menu-button" onClick={toggleSidebar}>
                    ☰
                </button>
                <li className='dash-lists'>📚<button className='but side-buttons'>Courses</button> </li>
                <li className='dash-lists'>📊<button className='but side-buttons'>Grades</button> </li>
                <li className='dash-lists'>📅<button className='but side-buttons'>Attendance</button></li>
                <li className='dash-lists'>👤<button className='but side-buttons'>Profile</button> </li>
            </aside>
            <main className="main-content">
                <header className="header">
                    <h1>Welcome, Student</h1>
                    <p>Your academic overview at a glance.</p>
                </header>
                
                <section className="cards">
                    <div className="card">
                        <h3>Courses</h3>
                        <p>Explore and manage enrolled courses.</p>
                    </div>
                    <div className="card">
                        <h3>Grades</h3>
                        <p>Track your grades and performance.</p>
                    </div>
                    <div className="card">
                        <h3>Attendance</h3>
                        <p>Review your attendance history.</p>
                    </div>
                </section>

                <section className="extra-sections">
                    <div className="card announcements">
                        <h3>Announcements</h3>
                        <ul>
                            <li>🗓️ Exam schedule released for Fall 2024</li>
                            <li>📚 New course materials added for Data Science</li>
                            <li>🏆 Mid-semester grades are now available</li>
                        </ul>
                    </div>
                    <div className="card progress-tracker">
                        <h3>Progress Tracker</h3>
                        <p>Complete Courses: 3/5</p>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                    <div className="card quick-actions">
                        <h3>Quick Actions</h3>
                        <button className='but'>Enroll in a Course</button>
                        <button className='but'>View Grades</button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
