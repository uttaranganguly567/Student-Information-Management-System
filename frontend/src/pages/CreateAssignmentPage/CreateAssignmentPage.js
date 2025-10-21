// frontend/src/pages/CreateAssignmentPage/CreateAssignmentPage.js
// --- CREATE THIS NEW FILE ---

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Reuse existing form styles
import '../AddStudentPage/AddStudentPage.css';

const CreateAssignmentPage = () => {
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
  });
  const [assignedCourses, setAssignedCourses] = useState([]); // Teacher's courses for dropdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get logged-in user

  // Fetch teacher's assigned courses for the dropdown
  useEffect(() => {
    const fetchTeacherCourses = async () => {
      if (user && user.role === 'teacher' && user.profileId) {
        try {
          const response = await fetch('/api/teachers/myprofile', { credentials: 'include' });
          if (!response.ok) throw new Error('Failed to fetch assigned courses');
          const data = await response.json();
          setAssignedCourses(data.assigned_courses || []);
          // Set default course if available
          if (data.assigned_courses && data.assigned_courses.length > 0) {
            setFormData(prev => ({ ...prev, courseId: data.assigned_courses[0]._id }));
          }
        } catch (err) {
          setError(`Error fetching courses: ${err.message}`);
        }
      }
    };
    fetchTeacherCourses();
  }, [user]); // Re-fetch if user changes

  const { courseId, title, description, dueDate } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) {
        setError('Please select a course.');
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send login cookie
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create assignment');
      }
      setLoading(false);
      navigate('/dashboard'); // Go back to dashboard after creation
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="add-student-container"> {/* Reusing class */}
      <h1 className="add-student-title">Create New Assignment</h1>
      <form className="add-student-form" onSubmit={onSubmit} style={{ gridTemplateColumns: '1fr' }}> {/* 1-column form */}
        <div className="form-group">
          <label htmlFor="courseId">Course</label>
          <select name="courseId" value={courseId} onChange={onChange} required>
            {assignedCourses.length === 0 && <option value="" disabled>Loading courses...</option>}
            {assignedCourses.length > 0 && assignedCourses.map(course => (
              <option key={course._id} value={course._id}>
                {course.course_name} ({course.course_id})
              </option>
            ))}
             {assignedCourses.length === 0 && !loading && <option value="" disabled>No courses assigned</option>}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="title">Assignment Title</label>
          <input type="text" name="title" value={title} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            rows="4"
            style={{ fontFamily: 'inherit', fontSize: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date (Optional)</label>
          <input type="date" name="dueDate" value={dueDate} onChange={onChange} />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn-submit" disabled={loading || assignedCourses.length === 0}>
          {loading ? 'Creating...' : 'Create Assignment'}
        </button>
         {assignedCourses.length === 0 && !loading && <p style={{color: 'var(--text-color-light)', textAlign: 'center', marginTop: '1rem'}}>You must be assigned to a course to create an assignment.</p>}
      </form>
    </div>
  );
};

export default CreateAssignmentPage;