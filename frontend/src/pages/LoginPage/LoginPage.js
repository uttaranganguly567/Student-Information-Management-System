import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice'; // Assuming redux is set up for auth
import { useHistory } from 'react-router-dom';
import axios from 'axios'; // Axios for HTTP requests

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const { username, password } = formData;

    const dispatch = useDispatch();
    const history = useHistory();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        if (isSuccess || user) {
            history.push('/dashboard');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, history, dispatch]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send login request to backend
            const response = await axios.post('/api/auth/login', { username, password });
            
            // Store the JWT token in localStorage
            localStorage.setItem('token', response.data.token);

            // Redirect user to the dashboard
            history.push('/dashboard');
        } catch (error) {
            console.log(error.response.data.message); // Handle error if login fails
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
