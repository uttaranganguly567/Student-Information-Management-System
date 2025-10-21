// frontend/src/App.js
// --- FULL REPLACEABLE CODE (Includes ALL Imports) ---

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout/Auth Components
import PrivateRoutes from './components/PrivateRoutes';
import MainAppLayout from './components/MainAppLayout/MainAppLayout';
import RoleBasedRoutes from './components/RoleBasedRoutes';

// --- Page Imports ---
import DashboardPage from './pages/DashboardPage/DashboardPage';
import LoginPage from './pages/LoginPage/LoginPage'; // Ensure this line exists
import RegisterPage from './pages/RegisterPage/RegisterPage'; // Ensure this line exists
import CoursePage from './pages/CoursePage/CoursePage';
import FeeStatusPage from './pages/FeeStatusPage/FeeStatusPage';
import StudentListPage from './pages/StudentListPage/StudentListPage';
import StudentProfilePage from './pages/StudentProfilePage/StudentProfilePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'; // Ensure this line exists
import AddStudentPage from './pages/AddStudentPage/AddStudentPage';
import EditStudentPage from './pages/EditStudentPage/EditStudentPage';
import AddCoursePage from './pages/AddCoursePage/AddCoursePage';
import EditCoursePage from './pages/EditCoursePage/EditCoursePage';
import AddFeePage from './pages/AddFeePage/AddFeePage';
import EditFeePage from './pages/EditFeePage/EditFeePage';
import TeacherListPage from './pages/TeacherListPage/TeacherListPage';
import AddTeacherPage from './pages/AddTeacherPage/AddTeacherPage';
import EditTeacherPage from './pages/EditTeacherPage/EditTeacherPage';
import EditMyProfilePage from './pages/EditMyProfilePage/EditMyProfilePage';
import ViewCourseStudentsPage from './pages/ViewCourseStudentsPage/ViewCourseStudentsPage';
import CreateAssignmentPage from './pages/CreateAssignmentPage/CreateAssignmentPage';
import CourseAssignmentsPage from './pages/CourseAssignmentsPage/CourseAssignmentsPage';
import MyAssignmentsPage from './pages/MyAssignmentsPage/MyAssignmentsPage';
import AssignmentSubmissionsPage from './pages/AssignmentSubmissionsPage/AssignmentSubmissionsPage';
// --------------------

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.error("Failed to save theme to localStorage:", error);
    }
  }, [theme]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={<LoginPage theme={theme} toggleTheme={toggleTheme} />} // Uses LoginPage
      />
      <Route
        path="/register"
        element={<RegisterPage theme={theme} toggleTheme={toggleTheme} />} // Uses RegisterPage
      />

      {/* Private Routes */}
      <Route element={<PrivateRoutes />}> {/* Uses PrivateRoutes */}
        <Route element={<MainAppLayout theme={theme} toggleTheme={toggleTheme} />}> {/* Uses MainAppLayout */}
            {/* ... (All nested private routes using imported components) ... */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/" element={<DashboardPage />} />
            <Route path="/student/:id" element={<StudentProfilePage />} />
            <Route path="/student/myprofile/edit" element={<EditMyProfilePage />} />
            <Route path="/courses/:courseId/assignments" element={<CourseAssignmentsPage />} />
            <Route path="/my-assignments" element={<MyAssignmentsPage />} />
            <Route element={<RoleBasedRoutes allowedRoles={['admin', 'student']} />}> <Route path="/fees" element={<FeeStatusPage />} /> </Route>
            <Route element={<RoleBasedRoutes allowedRoles={['teacher']} />}> <Route path="/teacher/course/:id/students" element={<ViewCourseStudentsPage />} /> <Route path="/teacher/assignment/create" element={<CreateAssignmentPage />} /> <Route path="/assignments/:assignmentId/submissions" element={<AssignmentSubmissionsPage />} /> </Route>
            <Route element={<RoleBasedRoutes allowedRoles={['admin']} />}> <Route path="/student/add" element={<AddStudentPage />} /> <Route path="/student/edit/:id" element={<EditStudentPage />} /> <Route path="/students" element={<StudentListPage />} /> <Route path="/course/add" element={<AddCoursePage />} /> <Route path="/course/edit/:id" element={<EditCoursePage />} /> <Route path="/fee/add" element={<AddFeePage />} /> <Route path="/fee/edit/:id" element={<EditFeePage />} /> <Route path="/teachers" element={<TeacherListPage />} /> <Route path="/teacher/add" element={<AddTeacherPage />} /> <Route path="/teacher/edit/:id" element={<EditTeacherPage />} /> </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} /> {/* Uses NotFoundPage */}
    </Routes>
  );
}

export default App;