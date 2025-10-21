// frontend/src/pages/AddFeePage/AddFeePage.js
// --- CREATE THIS NEW FILE ---

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// We re-use the same form CSS
import '../AddStudentPage/AddStudentPage.css'; 

const AddFeePage = () => {
  const [students, setStudents] = useState([]); // To store student list
  const [formData, setFormData] = useState({
    student: '', // This will be the student's _id
    amount: '',
    due_date: '',
    is_paid: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch all students for the dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data);
        // Set default student in form
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, student: data[0]._id }));
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStudents();
  }, []); // Runs once on load

  const { student, amount, due_date, is_paid } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCheckboxChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.checked });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to add fee record');
      }
      setLoading(false);
      navigate('/fees'); 
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="add-student-container">
      <h1 className="add-student-title">Add New Fee Record</h1>
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
          {loading ? 'Adding...' : 'Add Fee Record'}
        </button>
      </form>
    </div>
  );
};

export default AddFeePage;