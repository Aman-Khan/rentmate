import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-4 fw-bold mb-4 text-dark">Welcome to Household Manager!</h1>
            <p className="lead mb-5 text-secondary">Organize chores, track expenses, and manage your home life with ease.</p>
            {/* <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                <Link
                    to="/register"
                    className="btn btn-primary btn-lg px-4 me-sm-3"
                >
                    Get Started
                </Link>
                <Link
                    to="/login"
                    className="btn btn-outline-secondary btn-lg px-4"
                >
                    Login
                </Link>
            </div> */}
        </div>
    );
}

export default HomePage;
