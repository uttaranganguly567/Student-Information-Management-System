// frontend/src/pages/CourseAssignmentsPage/CourseAssignmentsPage.js
// --- FULL REPLACEABLE CODE (Removed Placeholder Comments) ---

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './CourseAssignmentsPage.css'; // Ensure CSS is imported
import { FaPlus, FaEye } from 'react-icons/fa';

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return null;
  try { const date = new Date(dateString); if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (error) { return null; }
};

const CourseAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();
  const { user } = useSelector(state => state.auth);

  // Fetch course details and assignments
  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // Fetch Course Details
      const courseRes = await fetch(`/api/courses/${courseId}`, { credentials: 'include' });
      if (courseRes.ok) { setCourseInfo(await courseRes.json()); }
      else { console.warn(`Failed course details fetch (${courseRes.status})`); }

      // Fetch Assignments
      const assignmentsUrl = `/api/assignments/course/${courseId}`;
      const assignmentsRes = await fetch(assignmentsUrl, { credentials: 'include' });
      if (!assignmentsRes.ok) {
         let errorMsg = `Failed fetch (${assignmentsRes.status})`;
         try{ const data = await assignmentsRes.json(); errorMsg = data.msg || errorMsg; } catch(e){}
         if (assignmentsRes.status === 401 || assignmentsRes.status === 403) errorMsg = 'Not authorized.';
         throw new Error(errorMsg);
      }
      const assignmentsData = await assignmentsRes.json();
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);

    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Placeholder for delete handler
  // const handleDeleteAssignment = async (assignmentId) => { };

  if (loading) return <div className="assignments-container">Loading assignments...</div>;
  if (error) return <div className="assignments-container">Error: {error}</div>;

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <h1 className="assignments-title">
          Assignments for {courseInfo ? `${courseInfo.course_name} (${courseInfo.course_id})` : 'Course'}
        </h1>
        {user?.role === 'teacher' && (
             <Link to="/teacher/assignment/create" className="btn-create-new-assignment">
                <FaPlus style={{ marginRight: '0.5rem' }}/> Create New
             </Link>
        )}
      </div>

      {assignments.length > 0 ? (
        <ul className="assignments-list">
          {assignments.map(assignment => (
            <li key={assignment._id} className="assignment-item">
              <div className="assignment-item-header">
                 <h2 className="assignment-title">{assignment.title}</h2>
                 <span className="assignment-due-date">
                    Due: {formatDate(assignment.dueDate) || 'Not set'}
                 </span>
              </div>
              {assignment.description && (
                <p className="assignment-description">{assignment.description}</p>
              )}
              <div className="assignment-meta">
                 <span>Posted: {formatDate(assignment.createdAt)} by {assignment.teacher?.name || 'Teacher'}</span>

                 {/* Link for Teachers to View Submissions */}
                 {user?.role === 'teacher' && (
                     <Link
                        to={`/assignments/${assignment._id}/submissions`}
                        className="btn-view-submissions"
                     >
                        <FaEye style={{ marginRight: '0.5rem' }}/> View Submissions
                     </Link>
                 )}
                 {/* REMOVED PLACEHOLDER COMMENTS FROM HERE */}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments posted for this course yet.</p>
      )}
    </div>
  );
};

export default CourseAssignmentsPage;