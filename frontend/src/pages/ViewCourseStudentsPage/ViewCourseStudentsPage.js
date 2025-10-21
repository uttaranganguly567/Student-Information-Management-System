// frontend/src/pages/ViewCourseStudentsPage/ViewCourseStudentsPage.js
// --- CREATE THIS NEW FILE ---

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
// Re-use the student list styles
import '../StudentListPage/StudentListPage.css';

const ViewCourseStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [courseInfo, setCourseInfo] = useState(null); // To store course name/ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: courseId } = useParams(); // Get course ID from URL

  // Fetch course details and enrolled students
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course details first (to get name) - Optional but good for UI
      const courseRes = await fetch(`/api/courses/${courseId}`, { credentials: 'include' });
       if (!courseRes.ok) {
           if (courseRes.status === 401 || courseRes.status === 403) throw new Error('Not authorized to view course details.');
           throw new Error('Failed to fetch course details');
       }
       const courseData = await courseRes.json();
       setCourseInfo(courseData); // Store course info

      // Fetch enrolled students
      const studentsRes = await fetch(`/api/courses/${courseId}/students`, {
        credentials: 'include',
      });
      if (!studentsRes.ok) {
        if (studentsRes.status === 401 || studentsRes.status === 403) throw new Error('Not authorized to view enrolled students for this course.');
        throw new Error('Failed to fetch enrolled students');
      }
      const studentsData = await studentsRes.json();
      setStudents(studentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]); // Dependency is the courseId from URL

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="student-list-container">Loading enrolled students...</div>;
  if (error) return <div className="student-list-container">Error: {error}</div>;

  return (
    <div className="student-list-container">
       {/* Use student-list styles for consistency */}
      <div className="student-list-header">
        <h1 className="student-list-title">
          Enrolled Students in {courseInfo ? `${courseInfo.course_name} (${courseInfo.course_id})` : 'Course'}
        </h1>
        {/* Maybe add a back button */}
        <Link to="/dashboard" style={{ /* Add styles if needed */ }}>Back to Dashboard</Link>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Department</th>
            <th>Year</th>
            {/* Add more relevant student details if needed */}
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.roll}</td>
                <td>{student.department || 'N/A'}</td>
                <td>{student.year || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No students enrolled in this course yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCourseStudentsPage;