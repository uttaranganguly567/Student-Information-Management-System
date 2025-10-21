// frontend/src/pages/EditStudentPage/EditStudentPage.js
// --- FULL REPLACEABLE CODE ---

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../AddStudentPage/AddStudentPage.css'; // Re-use styles

const EditStudentPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    year: '',
    department: '',
    age: '',
    mobile: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading true

  const navigate = useNavigate();
  const { id } = useParams(); // Get student ID from URL

  // Fetch the student's current data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true); // Ensure loading is true at start
        setError(null); // Clear previous errors

        // --- THIS IS THE FIX ---
        const response = await fetch(`/api/students/${id}`, {
          credentials: 'include', // Send the login cookie
        });
        // --------------------

        if (!response.ok) {
           if (response.status === 401) throw new Error('Not authorized.');
           if (response.status === 404) throw new Error('Student not found.');
          throw new Error('Failed to fetch student data');
        }
        const data = await response.json();
        // Set the form data with the student's details
        setFormData({
          name: data.name || '',
          roll: data.roll || '',
          year: data.year || '',
          department: data.department || '',
          age: data.age || '',
          mobile: data.mobile || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]); // Re-run if ID changes

  const { name, roll, year, department, age, mobile } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle the PUT request on submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Also include credentials on PUT
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
         if (response.status === 401) throw new Error('Not authorized.');
        throw new Error(data.msg || 'Failed to update student');
      }

      setLoading(false);
      // If successful, go back to the profile page
      navigate(`/student/${id}`);

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  // Show loading state first
  if (loading) {
    return <div className="add-student-container">Loading student data...</div>;
  }
  // Show error if fetching failed
  if (error) {
     return (
        <div className="add-student-container">
            <h1 className="add-student-title">Edit Student Profile</h1>
            <div className="form-error">{error}</div>
            {/* Optionally add a back button */}
             <button onClick={() => navigate(-1)} style={{marginTop: '1rem'}}>Go Back</button>
        </div>
     );
  }

  // Render the form if loading is done and no error
  return (
    <div className="add-student-container">
      <h1 className="add-student-title">Edit Student Profile</h1>
      <form className="add-student-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="roll">Roll Number</label>
          <input type="text" name="roll" value={roll} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input type="text" name="department" value={department} onChange={onChange} /> {/* Not required? */}
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input type="number" name="year" value={year} onChange={onChange} /> {/* Not required? */}
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input type="number" name="age" value={age} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input type="text" name="mobile" value={mobile} onChange={onChange} />
        </div>

        {/* Display submit error if it occurs */}
        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Student'}
        </button>
      </form>
    </div>
  );
};

export default EditStudentPage;