// frontend/src/components/RoleBasedRoutes.js
// --- CREATE THIS NEW FILE ---

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * A component to protect routes based on user roles.
 * @param {Object} props
 * @param {string[]} props.allowedRoles - An array of roles allowed to access this route (e.g., ['admin', 'student']).
 */
const RoleBasedRoutes = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  // Check if the user is logged in AND their role is in the allowedRoles array
  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />; // User is authorized, so render the child route (e.g., <StudentListPage />)
  } else {
    // User is not authorized, so redirect them to the dashboard
    return <Navigate to="/dashboard" replace />;
  }
};

export default RoleBasedRoutes;