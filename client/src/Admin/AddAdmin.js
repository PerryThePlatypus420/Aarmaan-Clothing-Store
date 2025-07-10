import React, { useState } from 'react';
import {
    MDBContainer,
    MDBBtn,
    MDBInput,
    MDBCheckbox
} from 'mdb-react-ui-kit';

const API_URL = process.env.REACT_APP_API_URL;

function AddAdmin({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        isAdmin: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!termsAccepted) {
            setError('You must accept the terms and conditions.');
            return;
        }

        try {
            // Get the auth token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            const response = await fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include auth token
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
            setSuccess('Admin account created successfully!');
            
            // Reset form
            setFormData({ 
                name: '', 
                username: '', 
                email: '', 
                password: '',
                isAdmin: true 
            });
            setTermsAccepted(false);

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
            <h4 className="text-center mb-3">Add New Admin User</h4>
            
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}

            <form onSubmit={handleSubmit}>
                <MDBInput wrapperClass='mb-3' label='Admin Name' id='name' type='text' value={formData.name} onChange={handleChange} required />
                <MDBInput wrapperClass='mb-3' label='Admin Username' id='username' type='text' value={formData.username} onChange={handleChange} required />
                <MDBInput wrapperClass='mb-3' label='Admin Email' id='email' type='email' value={formData.email} onChange={handleChange} required />
                <MDBInput wrapperClass='mb-3' label='Password' id='password' type='password' value={formData.password} onChange={handleChange} required />
                
                <div className='d-flex justify-content-center mb-3'>
                    <MDBCheckbox name='terms' id='terms' checked={termsAccepted} onChange={handleTermsChange} label='I confirm this user should have admin privileges' />
                </div>
                
                <div className="d-flex justify-content-between">
                    <MDBBtn color="secondary" onClick={onClose}>Cancel</MDBBtn>
                    <MDBBtn color="dark" type="submit" disabled={!termsAccepted}>Create Admin Account</MDBBtn>
                </div>
            </form>
        </MDBContainer>
    );
}

export default AddAdmin;
