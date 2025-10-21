// frontend/src/pages/AssignmentSubmissionsPage/AssignmentSubmissionsPage.js
// --- FULL REPLACEABLE CODE (ESLint Fix) ---

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './AssignmentSubmissionsPage.css'; // Ensure CSS exists

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  // Use toLocaleString for combined date and time
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true // Use 12-hour format
  });
};

// --- Submission Row Component ---
const SubmissionRow = ({ submission }) => {
    // Component state
    const [grade, setGrade] = useState(submission.grade || '');
    const [feedback, setFeedback] = useState(submission.feedback || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ error: null, success: null });

    // --- handleGradeSave Logic ---
    const handleGradeSave = async () => {
        // console.log(`%c handleGradeSave START for submission: ${submission._id}`, 'color: green; font-weight: bold;');
        setIsSaving(true);
        setSaveStatus({ error: null, success: null }); // Clear previous status

        const gradeUrl = `/api/assignments/submissions/${submission._id}/grade`;
        // console.log("--> 1. Preparing PUT request to:", gradeUrl);

        try {
            // console.log("--> 2. Entering TRY block, initiating fetch...");
            const response = await fetch(gradeUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Send login cookie
                body: JSON.stringify({ grade: grade.trim(), feedback: feedback.trim() }), // Trim input
            });
            // console.log("--> 3. Fetch completed. Status:", response.status);

            let data = {};
            // console.log("--> 4. Attempting to parse JSON response...");
            try {
                data = await response.json();
                // console.log("--> 5. JSON parsed successfully:", data);
            } catch (jsonError) {
                // console.error("--> ERROR parsing JSON:", jsonError);
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}: ${response.statusText || 'Server error'}`);
                }
                data = { msg: "Received invalid success response." }; throw new Error(data.msg);
            }

            // console.log("--> 6. Checking response.ok status...");
            if (!response.ok) {
                 // console.error("--> Grade save failed on backend:", data.msg || `HTTP Error ${response.status}`);
                 throw new Error(data.msg || `Failed to save grade.`);
            }

            // --- Success Path ---
            // console.log("--> 7. SUCCESS path reached. Setting status.");
            setSaveStatus({ success: 'Saved!', error: null });
            // Update local state from response data to reflect saved values
            setGrade(data.grade || '');
            setFeedback(data.feedback || '');

        } catch (err) {
            // --- Error Path ---
            // console.error("--> CATCH block during grade save:", err);
            setSaveStatus({ error: err.message || 'Save failed', success: null });
        } finally {
            // --- Finally Block ---
            // console.log("--> 8. FINALLY block reached. Setting isSaving FALSE.");
            setIsSaving(false); // *** Ensure button resets ***
        }
        // console.log(`%c handleGradeSave END for submission: ${submission._id}`, 'color: green; font-weight: bold;');
    };
    // ------------------------------------

    // Effect to update local state if the main submission prop changes
    useEffect(() => {
        setGrade(submission.grade || '');
        setFeedback(submission.feedback || '');
    }, [submission]);

    // Render logic for the row
    return (
        <tr key={submission._id}>
            <td>{submission.student?.name || 'Unknown'}</td>
            <td>{submission.student?.roll || 'N/A'}</td>
            <td>{formatDate(submission.submittedAt)}</td>
            <td className="submission-content-cell">{submission.content}</td>
            <td className="grade-input-cell">
                <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g., A" className="grade-input" />
            </td>
            <td className="feedback-input-cell">
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Feedback..." rows="2" className="feedback-input" />
            </td>
            <td className="actions-cell">
                <button onClick={handleGradeSave} className="btn-grade" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Grade'}
                </button>
                {/* Status messages */}
                {saveStatus.success && <span className="save-success">{saveStatus.success}</span>}
                {saveStatus.error && <span className="save-error">{saveStatus.error}</span>}
            </td>
        </tr>
    );
};
// ------------------------------------


const AssignmentSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  // const [assignmentInfo, setAssignmentInfo] = useState(null); // --- REMOVED (Unused) ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { assignmentId } = useParams(); // Get assignment ID from URL

  // Define fetchData using useCallback
  const fetchData = useCallback(async () => {
    // console.log(`AssignmentSubmissionsPage: Starting fetchData for assignmentId: ${assignmentId}`);
    setError(null);
    try {
      // console.log("--> Setting loading TRUE inside try block");

      const fetchUrl = `/api/assignments/${assignmentId}/submissions`;
      // console.log("--> Fetching submissions from:", fetchUrl);
      const response = await fetch(fetchUrl, { credentials: 'include' });
      // console.log("--> Fetch response status:", response.status);

      if (!response.ok) {
        let errorMsg = `Failed to fetch submissions (${response.status})`;
        try {const data = await response.json(); errorMsg = data.msg || errorMsg;} catch(e){}
        // console.error("--> Fetch failed:", errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      // console.log("--> Submissions data received:", data);
      setSubmissions(Array.isArray(data) ? data : []);

      // --- REMOVED (Unused assignmentInfo fetch) ---
      // const assignRes = await fetch(`/api/assignments/${assignmentId}`, { credentials: 'include' });
      // if (assignRes.ok) setAssignmentInfo(await assignRes.json());
      // ---------------------------------------------

    } catch (err) {
      // console.error("--> Error caught during fetchData:", err);
      setError(err.message);
    }
    // finally block moved to useEffect caller
  }, [assignmentId]); // Depend on assignmentId

  // useEffect to trigger fetchData
  useEffect(() => {
     // console.log("AssignmentSubmissionsPage: useEffect triggered.");
     setLoading(true); // Set loading true before starting fetch
     setError(null); // Clear previous errors
     fetchData()
        .finally(() => {
            // console.log("useEffect: fetchData completed. Setting loading false.");
            setLoading(false); // Ensure loading stops after fetch finishes/errors
        });
  }, [fetchData]); // Run when fetchData changes


  // --- Render logic ---
  // console.log("AssignmentSubmissionsPage: Rendering state...");

  if (loading) return <div className="submissions-container">Loading submissions...</div>;
  if (error) return <div className="submissions-container">Error: {error}</div>;

  // Derive courseId AFTER data is loaded
  const courseId = submissions[0]?.course;

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        {/* --- REMOVED (Unused assignmentInfo) --- */}
        <h1 className="submissions-title">Submissions for Assignment</h1>
        {courseId && ( <Link to={`/courses/${courseId}/assignments`} className="btn-back"> ← Back to Assignments </Link> )}
      </div>

      {submissions.length > 0 ? (
        <table className="submissions-table">
            <thead><tr><th>Student Name</th><th>Roll Number</th><th>Submitted At</th><th className="content-header">Content</th><th className="grade-header">Grade</th><th className="feedback-header">Feedback</th><th className="actions-header">Actions</th></tr></thead>
            <tbody>
                {submissions.map(sub => ( <SubmissionRow key={sub._id} submission={sub} /> ))}
            </tbody>
        </table>
      ) : (
        <p>No submissions received for this assignment yet.</p>
      )}
    </div>
  );
};

export default AssignmentSubmissionsPage;