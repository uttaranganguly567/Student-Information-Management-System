// frontend/src/pages/AddCoursePage/AddCoursePage.js
// --- FULL REPLACEABLE CODE ---

import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import '../AddStudentPage/AddStudentPage.css';

const AddCoursePage = () => {
  const [teachers, setTeachers] = useState([]); // State for teachers list
  const [formData, setFormData] = useState({
    course_name: '',
    course_id: '',
    year: '',
    credit: '',
    teacher: '', // Field for teacher ID
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch teachers for the dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch teachers');
        const data = await response.json();
        setTeachers(data);
        // Set default teacher if list is not empty
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, teacher: data[0]._id }));
        }
      } catch (err) {
        setError(`Error loading teachers: ${err.message}`);
      }
    };
    fetchTeachers();
  }, []);

  const { course_name, course_id, year, credit, teacher } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = { ...formData };
      // Ensure teacher field is null if no teacher selected or list is empty
      if (!body.teacher) {
           delete body.teacher; // Or set body.teacher = null based on backend requirement
       }

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Needed if POST route is protected
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to add course');
      }
      setLoading(false);
      navigate('/courses');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="add-student-container">
      <h1 className="add-student-title">Add New Course</h1>
      <form className="add-student-form" onSubmit={onSubmit}>
        {/* Course Name */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="course_name">Course Name</label>
          <input type="text" name="course_name" value={course_name} onChange={onChange} required />
        </div>
        {/* Course ID */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="course_id">Course ID (e.g., CS101)</label>
          <input type="text" name="course_id" value={course_id} onChange={onChange} required />
        </div>
        {/* Year */}
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input type="number" name="year" value={year} onChange={onChange} required />
        </div>
        {/* Credits */}
        <div className="form-group">
          <label htmlFor="credit">Credits</label>
          <input type="number" name="credit" value={credit} onChange={onChange} required />
        </div>
        {/* --- TEACHER DROPDOWN --- */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="teacher">Assign Teacher</label>
          <select name="teacher" value={teacher} onChange={onChange}>
            <option value="">-- Select Teacher --</option> {/* Option for no teacher */}
            {teachers.length > 0 ? (
              teachers.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name} {t.department ? `(${t.department})` : ''}
                </option>
              ))
            ) : (
              <option value="" disabled>Loading teachers...</option>
            )}
          </select>
        </div>
        {/* ------------------------ */}

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCoursePage;