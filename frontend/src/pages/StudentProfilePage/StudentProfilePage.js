// frontend/src/pages/StudentProfilePage/StudentProfilePage.js
// --- FULL REPLACEABLE CODE (FIXED) ---

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './StudentProfilePage.css'; // Make sure this CSS file exists and is correct
import { FaIdCard, FaBuilding, FaCalendarAlt, FaPhone, FaBirthdayCake } from 'react-icons/fa';

// --- THIS IS THE HELPER COMPONENT ---
// It needs to be fully defined here or imported if defined elsewhere
const InfoItem = ({ icon, label, value }) => (
  <div className="info-item">
    <div className="info-icon">{icon}</div>
    <div className="info-text">
      <span className="info-label">{label}</span>
      <span className="info-value">{value || 'N/A'}</span> {/* Display N/A if value is missing */}
    </div>
  </div>
);
// ------------------------------------


const StudentProfilePage = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams(); // ID from URL
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Logged-in user

  useEffect(() => {
    const fetchStudent = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch student data using the ID from the URL
            const response = await fetch(`/api/students/${id}`, {credentials:'include'});
            if (!response.ok) {
                if(response.status === 404) {
                    throw new Error('Student not found.');
                }
                throw new Error('Failed to fetch student data');
            }
            const data = await response.json();
            setStudent(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchStudent();
  }, [id]); // Re-run effect if the ID in the URL changes

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student? This will also delete their login account and all fee records.')) {
        try {
            const response = await fetch(`/api/students/${id}`, {
                method: 'DELETE',
                credentials: 'include' // Include credentials if delete route is protected
            });
            if (!response.ok) {
                let errorMsg = 'Failed to delete student';
                try { const data = await response.json(); errorMsg = data.msg || errorMsg;} catch(e){}
                throw new Error(errorMsg);
            }
            alert('Student deleted successfully.');
            navigate('/students'); // Navigate back to the list after deletion
        } catch (err) {
            setError(err.message); // Show error if deletion fails
        }
    }
  };


  if (loading) return <div className="profile-container">Loading profile...</div>;
  // Display error message if fetch failed
  if (error) return <div className="profile-container">Error: {error}</div>;
  // Display message if student data is null after loading (e.g., 404)
  if (!student) return <div className="profile-container">Student not found.</div>;

  // Check if the currently logged-in user is viewing their own profile
  const isOwnProfile = user && user.role === 'student' && user.profileId === id;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-name">{student.name} {isOwnProfile ? "(My Profile)" : ""}</h1>
        <div className="profile-actions">

          {/* Edit My Profile Button (for student viewing own profile) */}
          {isOwnProfile && (
             <Link to={`/student/myprofile/edit`} className="btn-edit">
               Edit My Profile
             </Link>
          )}

          {/* Edit Student Button (for Admin viewing any profile) */}
          {user && user.role === 'admin' && (
            <Link to={`/student/edit/${id}`} className="btn-edit">
              Edit Student (Admin)
            </Link>
          )}

          {/* Delete Button (for Admin viewing any profile) */}
          {user && user.role === 'admin' && (
            <button onClick={handleDelete} className="btn-delete">
              Delete Student
            </button>
          )}
        </div>
      </div>

      <div className="profile-card">
        {/* Profile details grid using the InfoItem component */}
        <div className="profile-details-grid">
          <InfoItem icon={<FaIdCard />} label="Roll Number" value={student.roll} />
          <InfoItem icon={<FaBuilding />} label="Department" value={student.department} />
          <InfoItem icon={<FaCalendarAlt />} label="Year" value={student.year} />
          <InfoItem icon={<FaPhone />} label="Mobile" value={student.mobile} />
          <InfoItem icon={<FaBirthdayCake />} label="Age" value={student.age} />
        </div>
      </div>
    </div>
  );
};


export default StudentProfilePage;