import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

function Navbar() {
    const { token, user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Household App</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto"> {/* ms-auto pushes items to the right */}
                        {token ? (
                            <>
                                <li className="nav-item">
                                    <span className="navbar-text me-3">Hello, {user?.name || 'User'}!</span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/household">My Household</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/chores">Chores</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/expenses">Expenses</Link>
                                </li>
                                <li className="nav-item">
                                    <button onClick={logout} className="btn btn-link nav-link">Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
