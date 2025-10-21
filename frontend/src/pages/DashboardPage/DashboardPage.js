// frontend/src/pages/DashboardPage/DashboardPage.js
// --- FULL REPLACEABLE CODE ---

import React from 'react';
import { useSelector } from 'react-redux';
import './DashboardPage.css';

import AdminDashboard from '../../components/Dashboards/AdminDashboard';
import StudentDashboard from '../../components/Dashboards/StudentDashboard';
import TeacherDashboard from '../../components/Dashboards/TeacherDashboard';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const renderDashboard = () => {
    // console.log("DashboardPage: Rendering dashboard for user:", user); // Optional log

    if (!user) {
        // console.log("--> No user found, rendering loading state.");
        return <div>Loading user data...</div>; // Show loading if user isn't available yet
    }

    switch (user.role) {
      case 'admin':
        // console.log("--> Rendering AdminDashboard");
        return <AdminDashboard />;
      case 'student':
        // CRITICAL: Check for profileId specifically for student
        if (!user.profileId) {
            console.error("--> Student user is missing profileId!", user);
            return <div style={{color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '8px'}}>
                      Error: Your student profile isn't linked correctly. Please re-register or contact an administrator.
                   </div>;
        }
        // console.log(`--> Rendering StudentDashboard with studentId: ${user.profileId}`);
        return <StudentDashboard studentId={user.profileId} />;
      case 'teacher':
        // console.log("--> Rendering TeacherDashboard");
        return <TeacherDashboard />;
      default:
         console.error("--> Invalid user role:", user.role);
        return <div>Invalid user role detected.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        {user?.username ? `Welcome, ${user.username}` : 'Dashboard'}
      </h1>
      {/* Render the appropriate dashboard */}
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;