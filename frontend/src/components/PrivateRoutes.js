// frontend/src/components/PrivateRoutes.js
// --- FULL REPLACEABLE CODE ---

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  // If user is logged in, show the page.
  // Otherwise, redirect to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;