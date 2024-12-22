import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // This imports the CSS for the App component

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

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <div className="content-wrapper">
                    <Sidebar />
                    <div className="main-content">
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/login" element={<LoginPage />} />

                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/courses"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <CoursePage />
                                    </ProtectedRoute>
                                }
                            />
                            {/* <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <UserProfilePage />
                                    </ProtectedRoute>
                                }
                            /> */}

                            {/* Catch-All Route for Not Found Pages */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
