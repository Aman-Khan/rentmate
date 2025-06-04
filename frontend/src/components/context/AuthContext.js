// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api/index.js'; // Our Axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                api.defaults.headers.common['x-auth-token'] = token;
                try {
                    const res = await api.get('/api/auth');
                    setUser(res.data);
                } catch (err) {
                    console.error('Error loading user:', err);
                    setToken(null);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post('/api/login', { email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return true;
        } catch (err) {
            console.error('Login error:', err.response ? err.response.data : err.message);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/api/register', { name, email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return true;
        } catch (err) {
            console.error('Registration error:', err.response ? err.response.data : err.message);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['x-auth-token'];
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, register, logout, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
