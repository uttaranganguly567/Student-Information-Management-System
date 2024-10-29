// src/pages/StudentListPage.js
import React from 'react';
import './StudentListPage.css';
import { Link } from 'react-router-dom';

const StudentListPage = () => {
    const students = [
        { id: 1, name: 'John Doe', roll: '12345', year: 3 },
        { id: 2, name: 'Jane Smith', roll: '67890', year: 2 },
    ];

    return (
        <div className="page-container">
            <h2 className="page-title">Student List</h2>
            <table className="student-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.roll}</td>
                            <td>{student.year}</td>
                            <td>
                                <button className="table-btn">View Profile</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentListPage;
