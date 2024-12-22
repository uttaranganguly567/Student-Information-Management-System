import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { /*login,*/ reset } from '../../features/auth/authSlice'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios for HTTP requests

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard'); 
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch, navigate]); // Include 'navigate' in dependencies

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); 
    } catch (error) {
      console.log(error.response.data.message); 
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <section className="login">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter password"
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;