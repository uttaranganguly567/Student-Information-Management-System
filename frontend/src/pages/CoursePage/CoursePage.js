// frontend/src/pages/CoursePage/CoursePage.js
// --- FULL REPLACEABLE CODE ---

import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './CoursePage.css';

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState({}); // Track status per course

  const { user } = useSelector((state) => state.auth);

  // Memoize fetchCourses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await fetch('/api/courses', {
        credentials: 'include', // Send cookies
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Not authorized. Please log in.');
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array as it doesn't depend on component state directly

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]); // Run fetchCourses when component mounts

  // Memoize handleDelete
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setEnrollmentStatus(prev => ({ ...prev, [id]: { loading: true } })); // Use status state for loading feedback
      try {
        const response = await fetch(`/api/courses/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to delete course');
        }
        setEnrollmentStatus(prev => ({ ...prev, [id]: { success: 'Deleted!' } }));
        fetchCourses(); // Refresh list
      } catch (err) {
        setError(`Delete failed: ${err.message}`);
        setEnrollmentStatus(prev => ({ ...prev, [id]: { error: 'Delete failed' } }));
      }
    }
  }, [fetchCourses]); // Depend on fetchCourses to refresh

  // --- NEW ENROLLMENT FUNCTION ---
  const handleEnroll = useCallback(async (courseId) => {
    setEnrollmentStatus(prev => ({ ...prev, [courseId]: { loading: true, message: 'Enrolling...' } }));
    setError(null); // Clear previous page-level errors
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        credentials: 'include', // Send login cookie
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Enrollment failed');
      }

      setEnrollmentStatus(prev => ({ ...prev, [courseId]: { success: true, message: 'Enrolled!' } }));
      // Optional: Refresh courses if needed, or just update UI state
      // fetchCourses();

    } catch (err) {
      console.error("Enrollment error:", err);
      setEnrollmentStatus(prev => ({ ...prev, [courseId]: { error: true, message: err.message || 'Error' } }));
    }
  }, []); // Empty dependency array for now
  // -----------------------------

  if (loading) return <div className="course-list-container">Loading courses...</div>;
  if (error) return <div className="course-list-container">Error: {error}</div>;

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h1 className="course-list-title">Course List</h1>
        {user && user.role === 'admin' && (
          <Link to="/course/add" className="btn-add-course">
            + Add New Course
          </Link>
        )}
      </div>

      <table className="course-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course ID</th>
            <th>Credits</th>
            <th>Year</th>
            <th>Teacher</th>
            {/* Show Actions column for Admins OR Students */}
            {(user?.role === 'admin' || user?.role === 'student') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => {
              const status = enrollmentStatus[course._id] || {}; // Get status for this course
              // Check if the logged-in student is already in the enrolled_students array
              const isEnrolled = user?.role === 'student' && course.enrolled_students?.includes(user.profileId);

              return (
              <tr key={course._id}>
                <td>{course.course_name}</td>
                <td>{course.course_id}</td>
                <td>{course.credit}</td>
                <td>{course.year}</td>
                <td>{course.teacher ? course.teacher.name : 'N/A'}</td>

                {/* --- Actions Column Logic --- */}
                {(user?.role === 'admin' || user?.role === 'student') && (
                  <td className="course-actions">
                    {/* Admin Actions */}
                    {user.role === 'admin' && (
                      <>
                        <Link to={`/course/edit/${course._id}`} className="btn-edit-course">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="btn-delete-course"
                          disabled={status.loading} // Disable while deleting
                        >
                          {status.loading ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}

                    {/* Student Actions */}
                    {user.role === 'student' && (
                      <>
                        {isEnrolled || status.success ? (
                           <span className="enrollment-success">✓ Enrolled</span>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course._id)}
                            className={`btn-enroll-course ${status.error ? 'error' : ''}`}
                            disabled={status.loading || status.success}
                          >
                            {status.loading ? 'Enrolling...' : status.error ? `Failed: ${status.message}` : 'Enroll'}
                          </button>
                        )}
                      </>
                    )}
                  </td>
                )}
                {/* --------------------------- */}
              </tr>
            )})
          ) : (
            <tr>
              {/* Adjust colspan based on whether Actions column is visible */}
              <td colSpan={(user?.role === 'admin' || user?.role === 'student') ? 6 : 5}>
                No courses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CoursePage;