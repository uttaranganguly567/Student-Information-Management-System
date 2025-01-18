import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import './App.css'; // This imports the CSS for the App component

// Importing reusable components
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Importing pages
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import CoursePage from './pages/CoursePage/CoursePage';
//import UserProfilePage from './pages/UserProfilePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
//import Dashboard from './pages/DashboardPage/DashboardPage';

function App() {
    return (
        <Router>
            <div className="App">
                <LoginPage />
            </div>
        </Router>
    );
}


export default App;
