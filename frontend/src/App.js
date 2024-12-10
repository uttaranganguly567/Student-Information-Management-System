// src/App.js
import React from 'react';
import './App.css';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import CoursePage from './pages/CoursePage/CoursePage';
import FeeStatusPage from './pages/FeeStatusPage/FeeStatusPage';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import StudentListPage from './pages/StudentListPage/StudentListPage';
import StudentProfilePage from './pages/StudentProfilePage/StudentProfilePage';

function App() {
    return (
        <div className="App">
            <NotFoundPage />
        </div>
    );
}

export default App;
