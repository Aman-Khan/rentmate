// src/auth/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api'; // Correct import path if src/api/index.js is your api file

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => { // Named export for AuthProvider
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        if (token) {
            try {
                const res = await api.get('/api/auth');
                setUser(res.data);
            } catch (err) {
                console.error('Error loading user:', err.response ? err.response.data : err.message);
                setToken(null);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (email, password) => {
        try {
            const res = await api.post('/api/login', { email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            console.error('Login error:', err.response ? err.response.data : err.message);
            return { success: false, error: err.response?.data?.msg || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/api/register', { name, email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            console.error('Registration error:', err.response ? err.response.data : err.message);
            return { success: false, error: err.response?.data?.msg || 'Registration failed' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['x-auth-token'];
    };

    const updateUserHousehold = (householdData) => {
        setUser(prevUser => ({
            ...prevUser,
            household: householdData
        }));
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, register, logout, setUser, updateUserHousehold, loadUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => { // Named export for useAuth
    return useContext(AuthContext);
};
