// frontend/src/components/MainAppLayout.js
// --- FULL REPLACEABLE CODE ---

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import './MainAppLayout.css'; 

// 1. Accept theme props from App.js
const MainAppLayout = ({ theme, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* 2. Pass props down to Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
      <div className="app-container">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main 
          className={`main-content ${isSidebarOpen ? '' : 'sidebar-closed'}`}
        >
          <Outlet /> 
        </main>
      </div>
    </>
  );
};

export default MainAppLayout;