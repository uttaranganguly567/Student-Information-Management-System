// frontend/src/pages/EditTeacherPage/EditTeacherPage.js
// --- CREATE THIS NEW FILE ---

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../AddStudentPage/AddStudentPage.css'; // Re-use styles

const EditTeacherPage = () => {
  const [formData, setFormData] = useState({ name: '', department: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`/api/teachers/${id}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch teacher data');
        const data = await response.json();
        setFormData({ name: data.name || '', department: data.department || '' });
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchTeacher();
  }, [id]);

  const { name, department } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to update teacher');
      setLoading(false);
      navigate('/teachers');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  if (loading) return <div className="add-student-container">Loading teacher data...</div>;

  return (
    <div className="add-student-container">
      <h1 className="add-student-title">Edit Teacher</h1>
      <form className="add-student-form" onSubmit={onSubmit} style={{ gridTemplateColumns: '1fr' }}>
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
          {loading ? 'Updating...' : 'Update Teacher'}
        </button>
      </form>
    </div>
  );
};

export default EditTeacherPage;