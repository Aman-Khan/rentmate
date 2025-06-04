import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api'; // Path to api/index.js from ChoreList.js
import { useAuth } from '../../auth/AuthContext'; // Path to AuthContext.js from ChoreList.js
import LoadingSpinner from '../common/LoadingSpinner'; // Path to LoadingSpinner.js from ChoreList.js
import { Link, useNavigate } from 'react-router-dom';

function ChoreList() {
    const { user } = useAuth();
    const [chores, setChores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Pending', 'Completed'
    const navigate = useNavigate();

    const fetchChores = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/chores/myhousehold');
            setChores(res.data);
        } catch (err) {
            console.error('Error fetching chores:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Failed to fetch chores.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user && user.household) {
            fetchChores();
        } else if (user !== null && !user.household) {
            setLoading(false); // User logged in but no household
        }
    }, [user, fetchChores]);

    const handleMarkComplete = async (choreId) => {
        // In a production app, consider using a custom modal for confirmation
        // instead of window.confirm for better UI consistency.
        if (!window.confirm('Are you sure you want to mark this chore as complete?')) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.put(`/api/chores/${choreId}/complete`);
            fetchChores(); // Re-fetch chores to update the list
        } catch (err) {
            console.error('Error marking chore complete:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Failed to mark chore complete.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) { // User not loaded yet (should be handled by PrivateRoute, but defensive check)
        return <LoadingSpinner />;
    }

    if (!user.household) {
        return (
            <div className="container text-center mt-5 p-4 bg-light rounded shadow-sm">
                <p className="lead mb-4">You need to be part of a household to view or manage chores.</p>
                <button
                    onClick={() => navigate('/household')}
                    className="btn btn-primary btn-lg"
                >
                    Go to Household
                </button>
            </div>
        );
    }

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

    const filteredChores = chores.filter(chore => {
        if (statusFilter === 'All') return true;
        return chore.status === statusFilter;
    });

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">My Household Chores</h2>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link
                    to="/chores/add"
                    className="btn btn-success"
                >
                    Add New Chore
                </Link>
                <div className="d-flex align-items-center">
                    <label htmlFor="statusFilter" className="form-label me-2 mb-0">Filter by Status:</label>
                    <select
                        id="statusFilter"
                        className="form-select w-auto" // w-auto to prevent it from taking full width
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {filteredChores.length === 0 ? (
                <p className="text-center text-muted mt-4">No chores found for your household with the current filter.</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"> {/* Bootstrap grid */}
                    {filteredChores.map((chore) => (
                        <div key={chore._id} className="col">
                            <div className="card h-100 shadow-sm"> {/* h-100 for equal height cards */}
                                <div className="card-body">
                                    <h3 className="card-title h5 mb-2">{chore.description}</h3>
                                    <p className="card-text"><strong>Status:</strong> <span className={`fw-semibold ${chore.status === 'Completed' ? 'text-success' : 'text-warning'}`}>{chore.status}</span></p>
                                    <p className="card-text"><strong>Frequency:</strong> {chore.frequency}</p>
                                    <p className="card-text"><strong>Assigned To:</strong> {chore.assignedTo?.name || 'N/A'}</p>
                                    {chore.dueDate && (
                                        <p className="card-text"><strong>Due Date:</strong> {new Date(chore.dueDate).toLocaleDateString()}</p>
                                    )}
                                    {chore.status === 'Completed' && (
                                        <>
                                            <p className="card-text"><strong>Completed By:</strong> {chore.completedBy?.name || 'N/A'}</p>
                                            <p className="card-text"><strong>Completed On:</strong> {new Date(chore.completedDate).toLocaleDateString()}</p>
                                        </>
                                    )}
                                </div>
                                {chore.status === 'Pending' && (
                                    <div className="card-footer text-center">
                                        <button
                                            onClick={() => handleMarkComplete(chore._id)}
                                            className="btn btn-info btn-sm"
                                            disabled={loading}
                                        >
                                            Mark as Complete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ChoreList;
