import React, { useState, createContext, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(process.env.REACT_APP_API_URL + '/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.user) {
                    setUser(result.user);
                } else {
                    localStorage.removeItem('token');
                }
            })
            .catch(() => localStorage.removeItem('token'));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
