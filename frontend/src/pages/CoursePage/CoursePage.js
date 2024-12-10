// src/pages/CourseListPage.js
import React from 'react';
import Navbar from '../../components/Navbar/Navbar.js';
import Sidebar from '../../components/Sidebar/Sidebar.js';
import './CoursePage.css';
import { Link } from 'react-router-dom';

const CoursePage = () => {
    const courses = [
        { id: 1, courseName: 'Math 101', year: '1' },
        { id: 2, courseName: 'Physics 102', year: '2' },
    ];

    return (
        <div className="page-container">
            <Navbar />
            <Sidebar />
            <div className="content">
                <h2>Course List</h2>
                <table className="course-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.courseName}</td>
                                <td>{course.year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CoursePage;
