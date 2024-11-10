import React, { useState, useContext, useEffect } from 'react';
import {
    MDBContainer,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBBtn,
    MDBInput,
    MDBCheckbox
} from 'mdb-react-ui-kit';
import { UserContext } from '../userContext'; // Import UserContext
import { useNavigate} from 'react-router-dom';

function Login() {
    const { login } = useContext(UserContext); // Access the login function from UserContext
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
        setSuccess('');
    };

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
        if (activeTab === 'register' && !termsAccepted) {
            setError('You must accept the terms and conditions to register.');
            return;
        }
        try {
            const endpoint = activeTab === 'login' ? 'http://localhost:3001/api/users/login' : 'http://localhost:3001/api/users/register';
            const response = await fetch(endpoint, {
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

            localStorage.setItem('token', token);
            login(user); // Pass the user data to UserContext

            setSuccess(activeTab === 'login' ? 'Logged in successfully' : 'Registered successfully');
            setFormData({ name: '', username: '', email: '', password: '' }); // Clear form data

            // Navigate to the homepage only if login was successful
            if (activeTab === 'login') {
                navigate('/'); 
            }

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
            <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabChange('login')} active={activeTab === 'login'}>
                        Login
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleTabChange('register')} active={activeTab === 'register'}>
                        Register
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>

            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}

            <form onSubmit={handleSubmit}>
                {activeTab === 'login' && (
                    <>
                        <MDBInput wrapperClass='mb-4' label='Email address' id='email' type='email' value={formData.email} onChange={handleChange} />
                        <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password' value={formData.password} onChange={handleChange} />
                        <MDBBtn className="btn btn-dark mb-4 w-100" type="submit">Sign in</MDBBtn>
                    </>
                )}

                {activeTab === 'register' && (
                    <>
                        <MDBInput wrapperClass='mb-4' label='Name' id='name' type='text' value={formData.name} onChange={handleChange} />
                        <MDBInput wrapperClass='mb-4' label='Username' id='username' type='text' value={formData.username} onChange={handleChange} />
                        <MDBInput wrapperClass='mb-4' label='Email' id='email' type='email' value={formData.email} onChange={handleChange} />
                        <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password' value={formData.password} onChange={handleChange} />
                        <div className='d-flex justify-content-center mb-4'>
                            <MDBCheckbox name='terms' id='terms' checked={termsAccepted} onChange={handleTermsChange} label='I have read and agree to the terms' />
                        </div>
                        <MDBBtn className="btn btn-dark mb-4 w-100" type="submit" disabled={!termsAccepted}>Sign up</MDBBtn>
                    </>
                )}
            </form>
        </MDBContainer>
    );
}

export default Login;
