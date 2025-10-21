// frontend/src/pages/MyAssignmentsPage/MyAssignmentsPage.js
// --- FULL REPLACEABLE CODE (Complete Logic & Length) ---

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import '../CourseAssignmentsPage/CourseAssignmentsPage.css'; // Base styles
import './MyAssignmentsPage.css'; // Grouping styles
// import { FaClipboardList, FaExternalLinkAlt } from 'react-icons/fa'; // Icons

// --- HELPER FUNCTION: formatDate ---
const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.warn("formatDate received invalid date string:", dateString);
        return null;
    }
    // Using toLocaleString for combined date and time display for submissions
    // Or just date for due/posted dates
    const optionsDateOnly = { year: 'numeric', month: 'short', day: 'numeric' };
    const optionsDateTime = { ...optionsDateOnly, hour: '2-digit', minute: '2-digit', hour12: true };

    // Check if the string contains time-related characters
    if (dateString.includes('T') || dateString.includes(':')) {
        // Check if time is default midnight (T00:00:00.000Z)
        if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
             return date.toLocaleDateString('en-IN', optionsDateOnly); // It's just a date
        }
        return date.toLocaleString('en-IN', optionsDateTime); // It has specific time
    }
    return date.toLocaleDateString('en-IN', optionsDateOnly); // Default to date only

  } catch (error) {
     console.error("Error formatting date:", dateString, error);
     return null;
  }
};
// ------------------------------------

// --- Assignment Item Component (Complete Definition & Enhanced handleSubmit) ---
const AssignmentItem = ({ assignment }) => {
    // Component state and logic
    const [submissionContent, setSubmissionContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState({ error: null, success: null });
    const [submissionData, setSubmissionData] = useState(null); // Store fetched submission
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [fetchStatusError, setFetchStatusError] = useState(null);
    // hasSubmitted is derived from submissionData, but we need setHasSubmitted for handleSubmit
    const [hasSubmitted, setHasSubmitted] = useState(false); // This state will be set by useEffect or handleSubmit

    // Effect to fetch submission status on component mount
    useEffect(() => {
        let isMounted = true;
        const checkSubmissionStatus = async () => {
            // console.log(`AssignmentItem (${assignment?.title}): Checking submission status...`);
            setIsLoadingStatus(true);
            setFetchStatusError(null);
            try {
                const response = await fetch(`/api/assignments/${assignment._id}/mysubmission`, {
                    credentials: 'include',
                });
                // console.log(`--> Status fetch response for ${assignment?.title}:`, response.status);
                if (!isMounted) return;

                if (response.ok) {
                    const data = await response.json();
                    // console.log(`--> Submission data received for ${assignment?.title}:`, data);
                    setSubmissionData(data);
                    setHasSubmitted(true); // Set submitted true
                } else if (response.status === 404) {
                    // console.log(`--> No submission found yet for ${assignment?.title}.`);
                    setSubmissionData(null);
                    setHasSubmitted(false); // Set submitted false
                } else {
                    let errorMsg = `Error checking status (${response.status})`;
                    try { const data_1 = await response.json(); errorMsg = data_1.msg || errorMsg; } catch(e){}
                    console.error("--> Error fetching submission status:", errorMsg);
                    setFetchStatusError(errorMsg);
                    setSubmissionData(null);
                    setHasSubmitted(false); // Set submitted false on error
                }
            } catch (err) {
                console.error("--> Network error fetching submission status:", err);
                 if (isMounted) setFetchStatusError(err.message || "Network error");
                 setSubmissionData(null);
                 setHasSubmitted(false); // Set submitted false on error
            } finally {
                 if (isMounted) setIsLoadingStatus(false);
            }
        };

        if (assignment?._id) {
             checkSubmissionStatus();
        } else {
             setIsLoadingStatus(false); // Don't load if no ID
        }

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [assignment._id]); // Re-run if assignment changes

    // --- Complete handleSubmit Logic ---
    const handleSubmit = async (e) => {
        console.log(`%c handleSubmit START for assignment: ${assignment?.title || 'Unknown'}`, 'color: blue; font-weight: bold;');
        e.preventDefault();

        if (!submissionContent.trim()) {
            console.log("--> Validation Failed: Empty content.");
            setSubmissionStatus({ error: 'Submission cannot be empty.', success: null });
            console.log("<<< handleSubmit END (Validation Fail) >>>");
            return;
        }

        console.log("--> 1. Setting isSubmitting TRUE.");
        setIsSubmitting(true);
        setSubmissionStatus({ error: null, success: null }); // Clear previous status

        const submitUrl = `/api/assignments/${assignment._id}/submit`;
        console.log("--> 2. Preparing fetch to:", submitUrl);

        try {
            console.log("--> 3. Entering TRY block, initiating fetch...");
            const response = await fetch(submitUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Send login cookie
                body: JSON.stringify({ content: submissionContent }),
            });
            console.log("--> 4. Fetch completed. Status:", response.status);

            let data = {};
            console.log("--> 5. Attempting to parse JSON response...");
            try {
                data = await response.json();
                console.log("--> 6. JSON parsed successfully:", data);
            } catch (jsonError) {
                console.error("--> ERROR parsing JSON:", jsonError);
                if (!response.ok) { throw new Error(`HTTP error ${response.status}: ${response.statusText || 'Server error'}`); }
                data = { msg: "Received invalid success response." }; throw new Error(data.msg);
            }

            console.log("--> 7. Checking response.ok status...");
            if (!response.ok) {
                 if (response.status === 400 && data.msg?.includes('already submitted')) {
                    setSubmissionData(data); // Set data even on error if it's 'already submitted'
                    setHasSubmitted(true); // Manually set this
                 }
                 console.error("--> Submit failed on backend:", data.msg || `HTTP Error ${response.status}`);
                 throw new Error(data.msg || `Submission failed.`);
            }

            // --- Success Path ---
            console.log("--> 8. SUCCESS path reached. Setting state.");
            setSubmissionStatus({ success: 'Submitted successfully!', error: null });
            setSubmissionData(data); // Store the newly created submission data
            setHasSubmitted(true); // Explicitly set state

        } catch (err) {
            console.error("--> CATCH block during submission:", err);
            setSubmissionStatus({ error: err.message, success: null });
        } finally {
            console.log("--> 9. FINALLY block reached. Setting isSubmitting FALSE.");
            setIsSubmitting(false); // Ensure button resets
        }
        console.log(`%c <<< handleSubmit END for: ${assignment?.title} >>>`, 'color: blue; font-weight: bold;');
    };
    // -----------------------------------------

    const formattedDueDate = formatDate(assignment.dueDate);
    const formattedCreatedAt = formatDate(assignment.createdAt);
    // const hasSubmitted = !!submissionData; // Base status on fetched/updated data

    if (!assignment) {
         console.error("AssignmentItem received invalid assignment prop");
         return null;
    }

    // --- RENDER LOGIC for AssignmentItem ---
    if (isLoadingStatus) {
        return <li className="assignment-item loading">Checking submission status...</li>;
    }
    if (fetchStatusError) {
        return <li className="assignment-item error">Error loading status: {fetchStatusError}</li>;
    }

    return (
        <li className="assignment-item">
            <div className="assignment-item-header">
                 <h3 className="assignment-title">{assignment.title || 'Untitled Assignment'}</h3>
                 <span className="assignment-due-date">{formattedDueDate ? `Due: ${formattedDueDate}` : 'Due: Not set'}</span>
            </div>
            {assignment.description && ( <p className="assignment-description">{assignment.description}</p> )}

            {/* Display Submission Details OR Form */}
            {hasSubmitted ? (
                 <div className="submission-details">
                     <h4>Your Submission:</h4>
                     <p className="submitted-content">{submissionData.content || "(No content)"}</p>
                     <div className="grade-feedback-section">
                         <div className="grade-feedback-item">
                             <strong>Grade:</strong>
                             <span className={`grade-value ${!submissionData.grade ? 'not-graded' : ''}`}>
                                 {submissionData.grade || 'Not Graded Yet'}
                             </span>
                         </div>
                         {submissionData.feedback && (
                             <div className="grade-feedback-item">
                                 <strong>Feedback:</strong>
                                 <p className="feedback-content">{submissionData.feedback}</p>
                             </div>
                         )}
                     </div>
                     <p className="submitted-time">Submitted on: {formatDate(submissionData.submittedAt) || 'N/A'}</p>
                 </div>
            ) : (
                <form onSubmit={handleSubmit} className="submission-form">
                    <textarea placeholder="Enter submission..." value={submissionContent} onChange={(e) => setSubmissionContent(e.target.value)} rows="3" required className="submission-textarea" />
                    {submissionStatus.error && <p className="submission-error">{submissionStatus.error}</p>}
                    <button type="submit" className="btn-submit-assignment" disabled={isSubmitting || hasSubmitted}>
                        {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                </form>
            )}

            <div className="assignment-meta">
                <span>Posted: {formattedCreatedAt || 'N/A'} by {assignment.teacher?.name || 'Teacher'}</span>
            </div>
        </li>
    );
};
// -------------------------------------------------------------------


const MyAssignmentsPage = () => {
    // State for MyAssignmentsPage
    const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
    const [enrolledCoursesInfo, setEnrolledCoursesInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector(state => state.auth);

    // --- fetchData useCallback (Restored Full Logic) ---
    const fetchData = useCallback(async (currentUser) => {
        // console.log("MyAssignmentsPage: Running fetchData...");
        setError(null);
        let courses = [];
        let groupedAssignments = {};
        try {
            // 1. Fetch Profile
            const profileRes = await fetch(`/api/students/${currentUser.profileId}`, { credentials: 'include' });
            if (!profileRes.ok) throw new Error(`Profile fetch failed (${profileRes.status})`);
            const profileData = await profileRes.json();
            courses = (profileData.enrolled_courses || []).filter(c => c && c._id && c.course_name);
            // console.log("--> Valid Courses Extracted:", courses);
            setEnrolledCoursesInfo(courses); // Set state immediately

            if (courses.length === 0) {
                 // console.log("--> No enrolled courses found.");
                 setAssignmentsByCourse({}); return;
            }

            // 2. Fetch Assignments (Restored Full Logic)
            // console.log("--> Preparing assignment fetches...");
            const assignmentsPromises = courses.map(course => {
                const assignmentUrl = `/api/assignments/course/${course._id}`;
                return fetch(assignmentUrl, { credentials: 'include' })
                    .then(async res => {
                        const status = res.status;
                        if (!res.ok) { let eMsg = `Assign fetch fail ${course._id}(${status})`; try{ const d = await res.json(); eMsg=d.msg||eMsg;}catch(e){} throw new Error(eMsg); }
                        return res.json();
                    })
                    .then(assignments => ({ status: 'fulfilled', courseId: course._id, assignments: Array.isArray(assignments) ? assignments : [] }))
                    .catch(err => ({ status: 'rejected', courseId: course._id, assignments: [], error: err.message }));
            });
            const assignmentResults = await Promise.allSettled(assignmentsPromises);
            // console.log("--> Promise.allSettled completed.");

            // 3. Group Assignments (Restored Full Logic)
            // console.log("--> Grouping results...");
            groupedAssignments = {};
            courses.forEach(courseInfo => {
                const result = assignmentResults.find(r => r.status === 'fulfilled' && r.value?.courseId === courseInfo._id);
                if (result?.value?.assignments?.length > 0) {
                    groupedAssignments[courseInfo._id] = { name: courseInfo.course_name, assignments: result.value.assignments };
                }
            });
            // console.log("--> FINAL grouped assignments object:", groupedAssignments);
            setAssignmentsByCourse(groupedAssignments);

        } catch (err) {
            console.error("MyAssignmentsPage: Error during fetchData execution:", err);
            setError(err.message);
            setAssignmentsByCourse({});
            setEnrolledCoursesInfo([]);
        }
    }, []); // Empty useCallback array

    // useEffect Hook
    useEffect(() => {
        // console.log("MyAssignmentsPage: useEffect triggered...");
        let isMounted = true; // Cleanup flag
        if (user && user.role === 'student' && user.profileId) {
            setLoading(true); setError(null);
            fetchData(user).finally(() => { if (isMounted) setLoading(false); });
        } else if (user) {
             if(isMounted) { setError("Not authorized..."); setLoading(false); }
        } else {
             if(isMounted) { setLoading(true); setError(null); }
        }
        return () => { isMounted = false; }; // Cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // Depend ONLY on user


    // --- Render logic ---
    if (loading) return <div className="assignments-container">Loading your assignments...</div>;
    if (error) return <div className="assignments-container">Error: {error}</div>;

    const courseIdsWithAssignments = Object.keys(assignmentsByCourse);
    // console.log("MyAssignmentsPage: Rendering...");

    return (
        <div className="assignments-container">
             <div className="assignments-header"> <h1 className="assignments-title">My Assignments</h1> </div>
             {/* Message Logic */}
             {enrolledCoursesInfo.length === 0 && !loading && (<p>You are not currently enrolled in any courses.</p>)}
             {enrolledCoursesInfo.length > 0 && courseIdsWithAssignments.length === 0 && !loading && (<p>No assignments found for your enrolled courses at this time.</p>)}

            {/* Mapping Logic */}
            {courseIdsWithAssignments.length > 0 && (
                courseIdsWithAssignments.map(courseId => {
                    const courseData = assignmentsByCourse[courseId];
                    const assignments = courseData?.assignments;
                    if (!courseData || !Array.isArray(assignments)) return null;
                    return (
                        <div key={courseId} className="assignment-course-group">
                            <h2 className="assignment-course-title">{courseData.name || `Course ID: ${courseId}`}</h2>
                            {assignments.length > 0 ? (
                                <ul className="assignments-list">
                                    {assignments.map(assignment => (
                                         assignment && assignment._id ?
                                         <AssignmentItem key={assignment._id} assignment={assignment} />
                                         : null
                                     ))}
                                </ul>
                             ) : ( <p>No assignments posted for {courseData.name || 'this course'} yet.</p> )}
                        </div>
                    );
                })
            )}
        </div>
    );
};


export default MyAssignmentsPage;