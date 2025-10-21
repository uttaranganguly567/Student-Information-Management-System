// frontend/src/pages/EditFeePage/EditFeePage.js
// --- CREATE THIS NEW FILE ---

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../AddStudentPage/AddStudentPage.css'; 

const EditFeePage = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student: '',
    amount: '',
    due_date: '',
    is_paid: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { id } = useParams(); // Get fee ID from URL

  // 1. Fetch all students AND the specific fee record
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    const fetchFee = async () => {
      try {
        const response = await fetch(`/api/fees/${id}`);
        if (!response.ok) throw new Error('Failed to fetch fee data');
        const data = await response.json();
        setFormData({
          student: data.student._id, // Set the student ID
          amount: data.amount,
          due_date: new Date(data.due_date).toISOString().split('T')[0], // Format date for input
          is_paid: data.is_paid,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
    fetchFee();
  }, [id]);

  const { student, amount, due_date, is_paid } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  const onCheckboxChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.checked });

  // 2. Handle PUT request
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/fees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update fee');
      }
      setLoading(false);
      navigate('/fees');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  if (loading) return <div className="add-student-container">Loading...</div>;

  return (
    <div className="add-student-container">
      <h1 className="add-student-title">Edit Fee Record</h1>
      <form className="add-student-form" onSubmit={onSubmit}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="student">Student</label>
          <select name="student" value={student} onChange={onChange} required>
            {students.length > 0 ? (
              students.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.roll})
                </option>
              ))
            ) : (
              <option value="" disabled>Loading students...</option>
            )}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input type="number" name="amount" value={amount} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <input type="date" name="due_date" value={due_date} onChange={onChange} required />
        </div>
        <div className="form-group-checkbox" style={{ gridColumn: '1 / -1' }}>
          <input type="checkbox" id="is_paid" name="is_paid" checked={is_paid} onChange={onCheckboxChange} />
          <label htmlFor="is_paid">Mark as Paid</label>
        </div>
        
        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Fee Record'}
        </button>
      </form>
    </div>
  );
};

export default EditFeePage;