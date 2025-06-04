import React, { useState, useEffect } from 'react';
import api from '../../api'; // Path to api/index.js from MyHouseholdDetails.js
import { useAuth } from '../../auth/AuthContext'; // Path to AuthContext.js from MyHouseholdDetails.js
import LoadingSpinner from '../common/LoadingSpinner'; // Path to LoadingSpinner.js from MyHouseholdDetails.js
import { useNavigate } from 'react-router-dom';

function MyHouseholdDetails() {
    const { user, loadUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // This useEffect runs when the component mounts or when 'user' changes.
        // It sets loading to false once the user data from AuthContext is available.
        if (user !== null) {
            setLoading(false);
        }
        // If the user has just logged in or joined/created a household,
        // the AuthContext should ideally update the 'user' object.
        // The 'loadUser' function from AuthContext can be called here
        // if a re-fetch of user data is explicitly needed after certain actions
        // (e.g., creating/joining a household, though AuthContext's login/register
        // functions already update the user state).
    }, [user]); // Depend on 'user' to react to changes in authentication/household status

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    // If user is loaded but not part of a household, offer options to create or join
    if (!user?.household) {
        return (
            <div className="container text-center mt-5 p-4 bg-light rounded shadow-sm">
                <p className="lead mb-4">You need to be part of a household to view or manage household details.</p>
                <button
                    onClick={() => navigate('/household/create')}
                    className="btn btn-success btn-lg me-3"
                >
                    Create New Household
                </button>
                <button
                    onClick={() => navigate('/household/join')}
                    className="btn btn-primary btn-lg"
                >
                    Join Existing Household
                </button>
            </div>
        );
    }

    const { household } = user;
    console.log('userrrr',household)

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">My Household: {household.name}</h2>

                    <div className="mb-3">
                        <p className="card-text"><strong>Owner:</strong> {user.name} ({user.email})</p>
                        <p className="card-text"><strong>Invite Code:</strong> <span className="badge bg-secondary">{household.inviteCode}</span></p>
                    </div>

                    <div className="mb-4">
                        <h3 className="h5 mb-3">Members:</h3>
                        <ul className="list-group list-group-flush">
                            {household.members.map((member) => (
                                <li key={member._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {member.name} ({member.email})
                                    {member._id === user._id && <span className="badge bg-info text-dark ms-2">You</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate('/chores')}
                            className="btn btn-info btn-lg me-3"
                        >
                            View Chores
                        </button>
                        <button
                            onClick={() => navigate('/expenses')}
                            className="btn btn-warning btn-lg"
                        >
                            View Expenses
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyHouseholdDetails;
