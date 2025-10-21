// frontend/src/pages/StudentListPage/StudentListPage.js
// --- FULL REPLACEABLE CODE (Fixes Infinite Loop) ---

import React, { useState, useEffect, useCallback } from 'react'; // Import hooks
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './StudentListPage.css'; // Ensure CSS exists
import { FaUserPlus, FaEye, FaTrash } from 'react-icons/fa'; // Import icons

const StudentListPage = () => {
  // State variables for student list, loading status, and errors
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading true
  const [error, setError] = useState(null);
  
  // Get the entire user object from Redux
  const { user } = useSelector((state) => state.auth);
  // --- STABILITY FIX: Extract the primitive value we need ---
  // The user.role string is stable and won't change reference unless the value itself changes
  const userRole = user ? user.role : null;
  // --------------------------------------------------------

  // useEffect Hook: Handles fetching logic
  useEffect(() => {
    console.log("StudentListPage: useEffect triggered. Role:", userRole);
    let isMounted = true; // Cleanup flag to prevent state updates on unmounted component

    // Define the async fetch function *inside* the effect
    const runFetch = async () => {
      setError(null); // Clear previous errors

      try {
        console.log("--> [StudentList] Running fetch logic...");
        const fetchUrl = '/api/students';
        console.log("--> [StudentList] Fetching from:", fetchUrl);

        // Perform the fetch request, including credentials (cookies)
        const response = await fetch(fetchUrl, {
          credentials: 'include', // *** ENSURE THIS IS PRESENT ***
        });
        console.log("--> [StudentList] Fetch status:", response.status);

        if (!response.ok) {
          let errorMsg = `HTTP Error: ${response.status}`;
          if (response.status === 401 || response.status === 403) { errorMsg = 'Not authorized.'; }
          else { try{ const data = await response.json(); errorMsg = data.msg || errorMsg; } catch(e){} }
          throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log("--> [StudentList] Students received count:", data.length);

        if (isMounted) { // Only update state if still mounted
             setStudents(Array.isArray(data) ? data : []);
        }

      } catch (err) {
        console.error("--> [StudentList] Error during runFetch:", err);
        if (isMounted) { // Only update state if still mounted
             setError(err.message);
             setStudents([]); // Clear data on error
        }
      } finally {
        if (isMounted) { // Only update state if still mounted
            console.log("--> [StudentList] runFetch finally block reached. Setting loading false.");
            setLoading(false); // Ensure loading stops
        } else {
             console.log("--> [StudentList] runFetch finished but component unmounted.");
        }
      }
    }; // End of runFetch definition

    // --- Trigger Logic ---
    // Only run fetch if the userRole is loaded AND is an admin
    if (userRole === 'admin') {
         setLoading(true); // Set loading before starting async operation
         console.log("--> [StudentList] User role is admin, calling runFetch.");
         runFetch();
    } else if (userRole) {
         // User role is loaded, but not an admin
         console.log("--> [StudentList] User role is not admin. Setting error.");
         setError("Not authorized to view this page.");
         setLoading(false);
    } else {
         // User role not loaded yet (user object is still null)
         console.log("--> [StudentList] Waiting for user data...");
         setLoading(true); // Keep loading
         setError(null);
    }

    // Cleanup function: Runs when the component unmounts
    return () => {
        console.log("StudentListPage: useEffect cleanup running.");
        isMounted = false; // Set flag on unmount
     };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]); // --- STABILITY FIX: Depend ONLY on the userRole string ---

  // handleDelete function: Deletes a student (Admin only)
   const handleDelete = useCallback(async (id, studentName) => {
        console.log(`Attempting to delete student ${id} (${studentName})`);
        if (window.confirm(`Delete ${studentName}? This also deletes their login & fees.`)) {
            try {
                const response = await fetch(`/api/students/${id}`, {
                   method: 'DELETE',
                   credentials: 'include'
                });
                if (!response.ok) {
                   let errorMsg = 'Failed to delete student';
                   try { const data = await response.json(); errorMsg = data.msg || errorMsg; } catch(e){}
                   throw new Error(errorMsg);
                }
                console.log(`Student ${id} deleted successfully.`);
                // Filter student out of state locally instead of re-fetching
                setStudents(prevStudents => prevStudents.filter(s => s._id !== id));
            } catch (err) {
                console.error(`Error deleting student ${id}:`, err);
                setError(err.message);
            }
        } else {
             console.log(`Deletion cancelled for student ${id}`);
        }
   }, []); // This function can be memoized with an empty array


  // --- Render Logic ---
  // console.log("StudentListPage: Rendering. Loading:", loading, "Error:", error);
  if (loading) return <div className="student-list-container">Loading students...</div>;
  if (error) return <div className="student-list-container">Error: {error}</div>;

  // Render content
  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h1 className="student-list-title">Student List</h1>
        {user && user.role === 'admin' && (
          <Link to="/student/add" className="btn-add-student">
             <FaUserPlus style={{ marginRight: '0.5rem' }} /> Add New Student
          </Link>
        )}
      </div>

      <table className="student-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Year</th>
                <th>Actions</th>
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
                <td className="student-actions">
                  <Link to={`/student/${student._id}`} className="btn-action-view">
                     <FaEye style={{ marginRight: '0.3rem' }}/> View
                  </Link>
                  <button onClick={() => handleDelete(student._id, student.name)} className="btn-action-delete" title="Delete Student">
                     <FaTrash style={{ marginRight: '0.3rem' }}/> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
             <tr> <td colSpan="5">No students found in the system.</td> </tr>
           )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentListPage;