// frontend/src/pages/AddStudentPage/AddStudentPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddStudentPage.css'; // We will create this next

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    year: '',
    department: '',
    age: '',
    mobile: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, roll, year, department, age, mobile } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // You may need to add auth headers here later
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to add student');
      }

      setLoading(false);
      // If successful, go back to the student list page
      navigate('/students'); 

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="add-student-container">
      <h1 className="add-student-title">Add New Student</h1>
      <form className="add-student-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roll">Roll Number</label>
          <input
            type="text"
            name="roll"
            value={roll}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            type="text"
            name="department"
            value={department}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            name="year"
            value={year}
            onChange={onChange}
            required
          />
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
          {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default AddStudentPage;