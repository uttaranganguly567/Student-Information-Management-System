// frontend/src/pages/EditCoursePage/EditCoursePage.js
// --- FULL REPLACEABLE CODE ---

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../AddStudentPage/AddStudentPage.css';

const EditCoursePage = () => {
  const [teachers, setTeachers] = useState([]); // State for teachers
  const [formData, setFormData] = useState({
    course_name: '',
    course_id: '',
    year: '',
    credit: '',
    teacher: '', // Field for teacher ID
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch teachers AND the specific course data
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (err) {
         setError(prev => prev ? `${prev}, Error loading teachers: ${err.message}` : `Error loading teachers: ${err.message}`);
      }
    };

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch course data');
        const data = await response.json();
        setFormData({
          course_name: data.course_name || '',
          course_id: data.course_id || '',
          year: data.year || '',
          credit: data.credit || '',
          teacher: data.teacher?._id || '', // Set teacher ID, handle if null/undefined
        });
      } catch (err) {
        setError(prev => prev ? `${prev}, ${err.message}` : err.message);
      } finally {
        setLoading(false); // Stop loading after course fetch
      }
    };

    setLoading(true); // Ensure loading is true at the start
    setError(null); // Clear previous errors
    fetchTeachers();
    fetchCourse();
  }, [id]);

  const { course_name, course_id, year, credit, teacher } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = { ...formData };
      if (!body.teacher) {
          body.teacher = null; // Send null if no teacher is selected
       }

      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update course');
      }
      setLoading(false);
      navigate('/courses');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  if (loading) return <div className="add-student-container">Loading course data...</div>;

  return (
    <div className="add-student-container">
      <h1 className="add-student-title">Edit Course</h1>
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
            <option value="">-- Select Teacher --</option>
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
          {loading ? 'Updating...' : 'Update Course'}
        </button>
      </form>
    </div>
  );
};

export default EditCoursePage;