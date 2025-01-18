import React, { useState } from 'react';

function LoginPage() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (userType) => {
    setSelectedUser(userType);
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
          <button 
            className="user-btn" 
            id="admin-btn" 
            onClick={() => handleUserSelect('admin')}
          >
            Admin Login
          </button>
          <button 
            className="user-btn" 
            id="student-btn" 
            onClick={() => handleUserSelect('student')}
          >
            Student Login
          </button>
          <button 
            className="user-btn" 
            id="teacher-btn" 
            onClick={() => handleUserSelect('teacher')}
          >
            Teacher Login
          </button>
        </div>

        {selectedUser && (
          <form 
            action="login-process.php" 
            method="post" 
            className="login-form" 
            id="loginForm"
          >
            <h2 id="login-title">SIGN IN</h2>
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
        )} 

      </div>
    </div>
  );
}

export default LoginPage;