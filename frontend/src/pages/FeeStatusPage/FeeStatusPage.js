// frontend/src/pages/FeeStatusPage/FeeStatusPage.js
// --- FULL REPLACEABLE CODE ---

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './FeeStatusPage.css';
import { formatIndianCurrency } from '../../utils/formatting'; // 1. Import the formatter

const formatDate = (dateString) => {
 // ... (formatDate function remains the same)
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};


const FeeStatusPage = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const fetchFees = useCallback(async () => {
    // ... (fetchFees logic remains the same)
     if (!user) { setLoading(false); setError("User data not available..."); return; }
    try { setLoading(true); setError(null);
      const isAdmin = user.role === 'admin';
      const url = isAdmin ? '/api/fees' : '/api/fees/myfees';
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) { if (response.status === 401) { throw new Error('Not authorized...'); } let errorMsg = 'Failed to fetch fee records'; try { const errorData = await response.json(); errorMsg = errorData.msg || errorMsg; } catch(e) {} throw new Error(errorMsg); }
      const data = await response.json(); setFees(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const handleDelete = useCallback(async (id) => {
    // ... (handleDelete logic remains the same)
      if (window.confirm('Are you sure you want to delete this fee record?')) {
      try { const response = await fetch(`/api/fees/${id}`, { method: 'DELETE', credentials: 'include' }); if (!response.ok) { let errorMsg = 'Failed to delete fee record'; try { const errorData = await response.json(); errorMsg = errorData.msg || errorMsg; } catch(e) {} throw new Error(errorMsg); } fetchFees();
      } catch (err) { setError(err.message); } }
  }, [fetchFees]);


  if (loading) return <div className="fee-list-container">Loading fee records...</div>;
  if (error && error !== "User data not available. Please ensure you are logged in.") { return <div className="fee-list-container">Error: {error}</div>; }
  if (!user) { return <div className="fee-list-container">Please log in to view fee status.</div>; }


  return (
    <div className="fee-list-container">
      <div className="fee-list-header">
        <h1 className="fee-list-title">
          {user.role === 'admin' ? 'All Fee Records' : 'My Fee Status'}
        </h1>
        {user && user.role === 'admin' && (
          <Link to="/fee/add" className="btn-add-fee">
            + Add New Fee Record
          </Link>
        )}
      </div>

      <table className="fee-table">
        <thead>
          <tr>
            <th>Student Name</th>
            {user.role === 'admin' && <th>Roll Number</th>}
            <th>Amount Due</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees.length > 0 ? (
            fees.map((fee) => (
              <tr key={fee._id}>
                <td>{fee.student ? fee.student.name : 'N/A'}</td>
                {user.role === 'admin' && <td>{fee.student ? fee.student.roll : 'N/A'}</td>}
                {/* 2. Use the formatter here */}
                <td>{formatIndianCurrency(fee.amount)}</td>
                <td>{formatDate(fee.due_date)}</td>
                <td>
                  <span className={`status-badge ${fee.is_paid ? 'paid' : 'due'}`}>
                    {fee.is_paid ? 'Paid' : 'Due'}
                  </span>
                </td>
                <td className="fee-actions">
                   {/* ... (action buttons remain the same) ... */}
                   {user && user.role === 'student' && !fee.is_paid && (<button className="btn-action-fee edit">Pay Now</button> )}
                   {user && user.role === 'admin' && ( <> <Link to={`/fee/edit/${fee._id}`} className="btn-action-fee edit"> Edit </Link> <button onClick={() => handleDelete(fee._id)} className="btn-action-fee delete"> Delete </button> </> )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={user.role === 'admin' ? 6 : 5}>No fee records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FeeStatusPage;