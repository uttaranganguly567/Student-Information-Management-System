import React, { useState } from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [userType, setUserType] = useState(''); // Tracks the selected user type

    const showLoginForm = (type) => {
        setUserType(type); // Update the state based on the user type
    };

    return (
        <div className="login-container">
            <div className="left-panel">
                <h2>Welcome Back!</h2>
                <p>Select your login type and proceed to the system.</p>
                <button className="signup-btn">Sign Up</button>
            </div>

            <div className="right-panel">
                <div className="user-selection">
                    <button className="user-btn" onClick={() => showLoginForm('Admin')}>Admin Login</button>
                    <button className="user-btn" onClick={() => showLoginForm('Student')}>Student Login</button>
                    <button className="user-btn" onClick={() => showLoginForm('Teacher')}>Teacher Login</button>
                </div>
                <form action="login-process.php" method="post" className="login-form" id="loginForm">
                    <h2 id="login-title">{userType ? `${userType} Login` : 'SIGN IN'}</h2>
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <div className="options">
                        <label>
                            <input type="checkbox" /> Keep me logged in
                        </label>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </div>
                    <button type="submit" className="login-btn">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;