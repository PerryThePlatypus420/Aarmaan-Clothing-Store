import React, { useState } from 'react';
import {
    MDBContainer,
    MDBBtn,
    MDBInput
} from 'mdb-react-ui-kit';

const API_URL = process.env.REACT_APP_API_URL;

function ChangePassword({ onClose }) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        // Validate passwords
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }
        
        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            // Get the auth token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            const response = await fetch(`${API_URL}/api/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include auth token
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                if (result.error) {
                    throw new Error(result.error);
                }
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setSuccess(result.message || 'Password changed successfully');
            
            // Reset form
            setFormData({ 
                currentPassword: '', 
                newPassword: '', 
                confirmPassword: '' 
            });

            // Close modal after a brief delay
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <MDBContainer className="p-3 my-3 d-flex flex-column w-100">
            <h4 className="text-center mb-3">Change Password</h4>
            
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}

            <form onSubmit={handleSubmit}>
                <MDBInput 
                    wrapperClass='mb-3' 
                    label='Current Password' 
                    id='currentPassword' 
                    type='password' 
                    value={formData.currentPassword} 
                    onChange={handleChange} 
                    required 
                />
                <MDBInput 
                    wrapperClass='mb-3' 
                    label='New Password' 
                    id='newPassword' 
                    type='password' 
                    value={formData.newPassword} 
                    onChange={handleChange} 
                    required 
                />
                <MDBInput 
                    wrapperClass='mb-3' 
                    label='Confirm New Password' 
                    id='confirmPassword' 
                    type='password' 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    required 
                />
                
                <div className="d-flex justify-content-between">
                    <MDBBtn color="secondary" onClick={onClose}>Cancel</MDBBtn>
                    <MDBBtn color="dark" type="submit">Update Password</MDBBtn>
                </div>
            </form>
        </MDBContainer>
    );
}

export default ChangePassword;
