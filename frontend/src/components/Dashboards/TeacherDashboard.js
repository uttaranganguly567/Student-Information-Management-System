// frontend/src/components/Dashboards/TeacherDashboard.js
// --- FULL REPLACEABLE CODE (Both Links Added) ---

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { FaChalkboardTeacher, FaBook, FaPlus, FaUsers, FaTasks } from 'react-icons/fa'; // Added FaTasks

const TeacherDashboard = () => {
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teacher's profile and assigned courses
  useEffect(() => {
     const fetchProfile = async () => { try { setLoading(true); setError(null); const response = await fetch('/api/teachers/myprofile', { credentials: 'include', }); if (!response.ok) { if (response.status === 401 || response.status === 403) { throw new Error('Not authorized.'); } let errorMsg = 'Failed to fetch teacher profile'; try { const data = await response.json(); errorMsg = data.msg || errorMsg; } catch(e){} throw new Error(errorMsg); } const data = await response.json(); setTeacherProfile(data); } catch (err) { setError(err.message); } finally { setLoading(false); } }; fetchProfile();
  }, []);


  if (loading) return <div>Loading your dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!teacherProfile) return <div>Could not load teacher profile data.</div>;

  const assignedCourses = teacherProfile.assigned_courses || [];

  return (
    <div>
      {/* Stat Cards */}
      <div className="dashboard-stats-grid">
         <StatCard icon={<FaChalkboardTeacher size={30} />} title="Assigned Courses" value={assignedCourses.length} color="blue" />
         <StatCard icon={<FaBook size={30} />} title="Total Students" value={"N/A"} color="green" />
      </div>

      {/* Assigned Courses List */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
           <h2 className="dashboard-section-title">My Assigned Courses</h2>
           <Link to="/teacher/assignment/create" className="btn-create-assignment">
             <FaPlus style={{ marginRight: '0.5rem'}} /> Create Assignment
           </Link>
        </div>

        {assignedCourses.length > 0 ? (
          <ul className="dashboard-list">
            {assignedCourses.map(course => (
              <li key={course._id} className="dashboard-list-item">
                <span className="course-name-dash">{course.course_name} ({course.course_id})</span>
                {/* --- ADD BOTH BUTTONS --- */}
                <div className="course-actions-dash"> {/* Wrapper for buttons */}
                  <Link
                     to={`/courses/${course._id}/assignments`} // Assignments Link
                     className="btn-view-assignments" // Assignments Class
                  >
                    <FaTasks style={{ marginRight: '0.5rem' }} /> Assignments
                  </Link>
                  <Link
                     to={`/teacher/course/${course._id}/students`} // Students Link
                     className="btn-view-students" // Students Class
                  >
                    <FaUsers style={{ marginRight: '0.5rem' }} /> Students
                  </Link>
                </div>
                {/* ----------------------- */}
              </li>
            ))}
          </ul>
        ) : (
          <p>You are not assigned to any courses yet.</p>
        )}
      </div>
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
        <span className="stat-card-value">{value}</span>
      </div>
    </div>
  );
};


export default TeacherDashboard;