import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { useHistory } from 'react-router-dom';

const Register = () => {
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
            history.push('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, history, dispatch]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const userData = {
            username,
            password,
        };

        dispatch(register(userData));
    };

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    return (
        <section className="register">
            <h1>Register</h1>
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

export default Register;
