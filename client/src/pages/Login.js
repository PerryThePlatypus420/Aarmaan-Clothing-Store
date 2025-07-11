import React, { useState, useContext, useEffect } from 'react';
import {
    MDBContainer,
    MDBBtn,
    MDBInput
} from 'mdb-react-ui-kit';
import { UserContext } from '../userContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
    const { user, login } = useContext(UserContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    
    // If user is already logged in and is an admin, redirect to admin panel
    useEffect(() => {
        if (user && user.isAdmin) {
            navigate('/secret-admin-portal');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const result = await response.json();
                if (result.error) {
                    throw new Error(result.error);
                }
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const { token, user } = result;

            // Check if user is admin
            if (!user.isAdmin) {
                throw new Error('Access denied. Admin privileges required.');
            }

            localStorage.setItem('token', token);
            login(user); // Pass the user data to UserContext

            setSuccess('Admin login successful');
            setFormData({ 
                email: '', 
                password: ''
            }); 
            
            // Navigate to admin panel
            navigate('/secret-admin-portal');

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
            <h2 className="text-center mb-4">Admin Panel Access</h2>
            
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}

            <form onSubmit={handleSubmit}>
                <MDBInput wrapperClass='mb-4' label='Admin Email' id='email' type='email' value={formData.email} onChange={handleChange} required />
                <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password' value={formData.password} onChange={handleChange} required />
                <MDBBtn className="btn btn-dark mb-4 w-100" type="submit">Admin Sign In</MDBBtn>
                <p className="text-center"><small>This login is for administrative access only.</small></p>
            </form>
        </MDBContainer>
    );
}

export default Login;
