import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // Optional, for custom styling

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="home-link">Go to Homepage</Link>
        </div>
    );
};

export default NotFoundPage;
