import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import LoadingSpinner from './LoadingSpinner';

function PrivateRoute({ children }) {
    const { token, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
