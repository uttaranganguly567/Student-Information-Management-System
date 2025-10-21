// frontend/src/pages/AddTeacherPage/AddTeacherPage.js
// --- CREATE THIS NEW FILE ---

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AddStudentPage/AddStudentPage.css'; // Re-use styles

const AddTeacherPage = () => {
  const [formData, setFormData] = useState({ name: '', department: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { name, department } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to add teacher');
      setLoading(false);
      navigate('/teachers'); // Navigate to teacher list page
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="add-student-container">
      <h1 className="add-student-title">Add New Teacher</h1>
      <form className="add-student-form" onSubmit={onSubmit} style={{ gridTemplateColumns: '1fr' }}> {/* Simple 1-column form */}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input type="text" name="department" value={department} onChange={onChange} />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Teacher'}
        </button>
      </form>
    </div>
  );
};

export default AddTeacherPage;