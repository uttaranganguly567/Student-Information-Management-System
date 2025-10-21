// frontend/src/pages/TeacherListPage/TeacherListPage.js
// --- CREATE THIS NEW FILE ---

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './TeacherListPage.css'; // We'll create this

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth); // For role check

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/teachers', { credentials: 'include' });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Not authorized.');
        throw new Error('Failed to fetch teachers');
      }
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher? This will also delete their login account.')) {
      try {
        const response = await fetch(`/api/teachers/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          let errorMsg = 'Failed to delete teacher';
          try { const data = await response.json(); errorMsg = data.msg || errorMsg; } catch(e) {}
          throw new Error(errorMsg);
        }
        fetchTeachers(); // Refresh list
      } catch (err) {
        setError(err.message);
      }
    }
  }, [fetchTeachers]);

  if (loading) return <div className="teacher-list-container">Loading teachers...</div>;
  if (error) return <div className="teacher-list-container">Error: {error}</div>;

  return (
    <div className="teacher-list-container">
      <div className="teacher-list-header">
        <h1 className="teacher-list-title">Teacher List</h1>
        {user && user.role === 'admin' && (
          <Link to="/teacher/add" className="btn-add-teacher">
            + Add New Teacher
          </Link>
        )}
      </div>

      <table className="teacher-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            {user && user.role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacher.name}</td>
                <td>{teacher.department || 'N/A'}</td>
                {user && user.role === 'admin' && (
                  <td className="teacher-actions">
                    <Link to={`/teacher/edit/${teacher._id}`} className="btn-edit-teacher">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(teacher._id)} className="btn-delete-teacher">
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={user && user.role === 'admin' ? 3 : 2}>No teachers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherListPage;