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
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" exact element={Dashboard} />
              <Route path="/student-profile" element={StudentProfilePage} />
              <Route path="/student-list" element={StudentListPage} />
              <Route path="/course-list" element={CourseListPage} />
              <Route path="/fee-status" element={FeeStatusPage} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;