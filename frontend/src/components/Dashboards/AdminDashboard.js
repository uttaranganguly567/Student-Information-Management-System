// frontend/src/components/Dashboards/AdminDashboard.js
// --- FULL REPLACEABLE CODE ---

import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FaUserGraduate, FaBook, FaFileInvoiceDollar } from 'react-icons/fa';
import { formatIndianCurrency } from '../../utils/formatting';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      console.log("AdminDashboard: Fetching stats..."); // Add log
      try {
        setLoading(true);
        setError(null);

        // --- THIS IS THE FIX ---
        const response = await fetch('/api/dashboard/stats/admin', {
          credentials: 'include', // Send the login cookie
        });
        // --------------------

        console.log("AdminDashboard: Fetch response status:", response.status); // Add log

        if (!response.ok) {
          let errorMsg = `HTTP Error: ${response.status}`;
          if (response.status === 401 || response.status === 403) errorMsg = 'Not authorized.';
          try { const data = await response.json(); errorMsg = data.msg || errorMsg; } catch(e){}
          console.error("AdminDashboard: Fetch failed:", errorMsg); // Add log
          throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log("AdminDashboard: Fetched data:", data); // Add log
        // Add check for expected data structure
        if (data && typeof data.totalStudents === 'number' && typeof data.totalCourses === 'number' && typeof data.totalFeesDue === 'number') {
            setStats(data);
        } else {
            console.error("AdminDashboard: Received unexpected data format:", data);
            throw new Error("Unexpected data format received from server.");
        }

      } catch (err) {
        console.error("AdminDashboard: Error during fetch:", err); // Add log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []); // Empty dependency array, run once

  console.log("AdminDashboard: Rendering. Loading:", loading, "Error:", error, "Stats:", stats); // Add log

  if (loading) return <div>Loading admin data...</div>;
  if (error) return <div>Error loading admin dashboard: {error}</div>;
  if (!stats) return <div>Could not load admin stats.</div>; // Handle null state


  return (
    <div className="dashboard-stats-grid">
      <StatCard
        icon={<FaUserGraduate size={30} />}
        title="Total Students"
        value={stats.totalStudents ?? 'N/A'} // Use nullish coalescing
        color="blue"
      />
      <StatCard
        icon={<FaBook size={30} />}
        title="Total Courses"
        value={stats.totalCourses ?? 'N/A'}
        color="green"
      />
      <StatCard
        icon={<FaFileInvoiceDollar size={30} />}
        title="Total Fees Due"
        value={formatIndianCurrency(stats.totalFeesDue ?? 0)} // Format 0 if null/undefined
        color="orange"
      />
    </div>
  );
};

// Reusable StatCard component
const StatCard = ({ icon, title, value, color }) => {
    return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-info">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-value">{(value !== undefined && value !== null) ? value : 'N/A'}</span>
      </div>
    </div>
  );
};


export default AdminDashboard;