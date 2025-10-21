// frontend/src/pages/EditMyProfilePage/EditMyProfilePage.js
// --- CREATE THIS NEW FILE ---

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../AddStudentPage/AddStudentPage.css'; // Re-use styles

const EditMyProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: '', age: '', mobile: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.profileId) {
        setError("Profile ID not found.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/students/${user.profileId}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setFormData({ name: data.name || '', age: data.age || '', mobile: data.mobile || '' });
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [user]);

  const { name, age, mobile } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/students/myprofile', { // Use the new route
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to update profile');
      setLoading(false);
      navigate(`/student/${user.profileId}`); // Go back to profile page
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  if (loading) return <div className="add-student-container">Loading your profile...</div>;

  return (
    <div className="add-student-container">
      <h1 className="add-student-title">Edit My Profile</h1>
      <form className="add-student-form" onSubmit={onSubmit} style={{ gridTemplateColumns: '1fr' }}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input type="number" name="age" value={age} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input type="text" name="mobile" value={mobile} onChange={onChange} />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default EditMyProfilePage;