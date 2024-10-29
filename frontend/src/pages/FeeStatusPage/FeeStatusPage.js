// src/pages/FeeStatusPage.js
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.js';
import Sidebar from '../../components/Sidebar/Sidebar.js';
import './FeeStatusPage.css';
import { Link } from 'react-router-dom';

const FeeStatusPage = () => {
    const fees = [
        { id: 1, studentName: 'John Doe', amount: 1000, status: 'Paid' },
        { id: 2, studentName: 'Jane Smith', amount: 800, status: 'Unpaid' },
    ];

    return (
        <div className="page-container">
            <Navbar />
            <Sidebar />
            <div className="content">
                <h2>Fee Status</h2>
                <table className="fee-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fees.map((fee) => (
                            <tr key={fee.id}>
                                <td>{fee.studentName}</td>
                                <td>{fee.amount}</td>
                                <td>{fee.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeeStatusPage;
