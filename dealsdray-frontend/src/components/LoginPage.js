import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import '../LoginPage.css';

function LoginPage() {
    const [f_userName, setUserName] = useState('');
    const [f_Pwd, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                f_userName,
                f_Pwd
            });

            // Store the JWT token in local storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', f_userName);
            // Redirect to the home page
            navigate('/home');
        } catch (error) {
            // Display only the error message
            if (error.response && error.response.status === 401) {
                setError('Invalid credentials 3');
            } else {
                setError(error.message || 'Server error. Please try again later.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={f_userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={f_Pwd}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
