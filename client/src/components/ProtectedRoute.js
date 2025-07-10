import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../userContext';

// This component checks if the user is authenticated and is an admin before allowing access to protected routes
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    
    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }
    
    // Check if user is an admin
    if (!user.isAdmin) {
        // Redirect to home if not an admin
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
