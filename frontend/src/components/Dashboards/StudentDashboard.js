// frontend/src/components/Dashboards/StudentDashboard.js
// --- FULL REPLACEABLE CODE (Simplified Render) ---

import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FaBook, FaFileInvoiceDollar, FaRegCreditCard } from 'react-icons/fa';
import { formatIndianCurrency } from '../../utils/formatting';

const StudentDashboard = ({ studentId }) => {
  const [stats, setStats] = useState(null); // Start as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("StudentDashboard: useEffect triggered. studentId:", studentId);
    if (!studentId) {
      setError('Student profile ID not found.');
      setLoading(false);
      return;
    }
    const fetchStats = async () => {
        setLoading(true); setError(null);
        try {
            const response = await fetch(`/api/dashboard/stats/student/${studentId}`, { credentials: 'include' });
            // console.log("--> Fetch response status:", response.status);
            if (!response.ok) {
               let errorMsg = `HTTP error! status: ${response.status}`;
               try { const errorData = await response.json(); errorMsg = errorData.msg || errorMsg; } catch(e) {}
               throw new Error(errorMsg);
            }
            const data = await response.json();
            // console.log("--> Fetched stats data:", data);
            if (data && typeof data.totalDue === 'number' && typeof data.totalPaid === 'number' && typeof data.enrolledCoursesCount === 'number') {
                 setStats(data);
            } else {
                 console.error("--> Received unexpected data format:", data);
                 throw new Error("Received unexpected data format from server.");
            }
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };
    fetchStats();
  }, [studentId]);

  // --- Render Logic ---
  if (loading) return <div>Loading your dashboard data...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  // *** CRITICAL CHECK ***
  // Check if stats is valid right before rendering cards
  if (!stats || typeof stats.totalDue !== 'number' || typeof stats.totalPaid !== 'number' || typeof stats.enrolledCoursesCount !== 'number') {
      console.error("StudentDashboard: Rendering aborted - stats object is invalid or incomplete:", stats);
      return <div>Could not load dashboard stats correctly. Data might be missing.</div>;
  }
  // If we reach here, stats object is valid
  console.log("StudentDashboard: Proceeding to render cards with valid stats:", stats);

  return (
    <div className="dashboard-stats-grid">
      {/* Ensure keys are present before formatting */}
      <StatCard
        icon={<FaFileInvoiceDollar size={30} />}
        title="My Fees Due"
        value={formatIndianCurrency(stats.totalDue)}
        color="orange"
      />
      <StatCard
        icon={<FaRegCreditCard size={30} />}
        title="My Fees Paid"
        value={formatIndianCurrency(stats.totalPaid)}
        color="green"
      />
      <StatCard
        icon={<FaBook size={30} />}
        title="Enrolled Courses"
        value={stats.enrolledCoursesCount}
        color="blue"
      />
    </div>
  );
};

// Reusable StatCard component (ensure definition is correct)
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


export default StudentDashboard;