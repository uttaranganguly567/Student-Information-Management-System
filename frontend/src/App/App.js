import './App.css';
import LoginPage from '../pages/LoginPage/LoginPage.js'
import Dashboard from '../pages/Dashboard/Dashboard.js'
import StudentProfilePage from '../pages/StudentProfilePage/StudentProfilePage.js'
import StudentListPage from '../pages/StudentListPage/StudentListPage.js'
import CourseListPage from '../pages/CourseListPage/CourseListPage.js'
import FeeStatusPage from '../pages/FeeStatusPage/FeeStatusPage.js'
import Navbar from '../components/Navbar/Navbar.js'
import Sidebar from '../components/Sidebar/Sidebar.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Dashboard />
  );
}

export default App;