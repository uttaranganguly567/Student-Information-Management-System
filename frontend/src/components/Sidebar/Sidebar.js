// frontend/src/components/Sidebar/Sidebar.js
// --- FULL REPLACEABLE CODE ---

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Sidebar.css';
import {
  FaThLarge,
  FaUserCircle,
  FaBookOpen,
  FaDollarSign,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList // 1. Import new icon
} from 'react-icons/fa';

const Sidebar = ({ isSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
      <nav className="sidebar-nav">
        {/* Dashboard */}
        <NavLink to="/dashboard" className={({isActive})=>`nav-link${isActive?" active":""}`}><FaThLarge/><span className="nav-link-text">Dashboard</span></NavLink>

        {/* My Profile (Student) */}
        {user && user.role === 'student' && user.profileId && (<NavLink to={`/student/${user.profileId}`} className={({isActive})=>`nav-link${isActive?" active":""}`}><FaUserCircle/><span className="nav-link-text">My Profile</span></NavLink>)}

        {/* --- My Assignments (Student) --- */}
        {user && user.role === 'student' && (
             <NavLink
               to="/my-assignments" // 2. Add link destination
               className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
             >
               <FaClipboardList /> {/* 3. Add icon */}
               <span className="nav-link-text">My Assignments</span> {/* 4. Add text */}
             </NavLink>
        )}
        {/* ----------------------------- */}

        {/* Courses (All) */}
         <NavLink to="/courses" className={({isActive})=>`nav-link${isActive?" active":""}`}><FaBookOpen/><span className="nav-link-text">Courses</span></NavLink>

        {/* Fee Status (Student/Admin) */}
        {user && (user.role === 'student' || user.role === 'admin') && (<NavLink to="/fees" className={({isActive})=>`nav-link${isActive?" active":""}`}><FaDollarSign/><span className="nav-link-text">Fee Status</span></NavLink>)}

        {/* Student List (Admin) */}
        {user && user.role === 'admin' && (<NavLink to="/students" className={({isActive})=>`nav-link${isActive?" active":""}`}><FaUsers/><span className="nav-link-text">Students</span></NavLink>)}

        {/* Teachers Link (Admin Only) */}
        {user && user.role === 'admin' && (<NavLink to="/teachers" className={({isActive})=>`nav-link${isActive?" active":""}`}><FaChalkboardTeacher /><span className="nav-link-text">Teachers</span></NavLink>)}

      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <span className="footer-title">Created By:</span>
        <span className="footer-name">Uttaran Ganguly</span>
        <span className="footer-name">Md. Farhann Akhter</span>
        <span className="footer-name">Agniva Acherjee</span>
      </div>

    </aside>
  );
};

export default Sidebar;