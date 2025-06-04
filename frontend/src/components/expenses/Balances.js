import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api'; // Path to api/index.js from Balances.js
import { useAuth } from '../../auth/AuthContext'; // Path to AuthContext.js from Balances.js
import LoadingSpinner from '../common/LoadingSpinner'; // Path to LoadingSpinner.js from Balances.js
import { useNavigate } from 'react-router-dom';

function Balances() {
    const { user } = useAuth();
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchBalances = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/expenses/balances');
            setBalances(res.data);
        } catch (err) {
            console.error('Error fetching balances:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Failed to fetch balances.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user && user.household) {
            fetchBalances();
        } else if (user !== null && !user.household) {
            setLoading(false); // User logged in but no household
        }
    }, [user, fetchBalances]);

    if (!user) { // User not loaded yet (should be handled by PrivateRoute, but defensive check)
        return <LoadingSpinner />;
    }

    if (!user.household) {
        return (
            <div className="container text-center mt-5 p-4 bg-light rounded shadow-sm">
                <p className="lead mb-4">You need to be part of a household to view expense balances.</p>
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

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-7">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Household Balances</h2>

                            {balances.length === 0 ? (
                                <p className="text-center text-muted">No expenses recorded yet to calculate balances.</p>
                            ) : (
                                <div className="list-group"> {/* Bootstrap list group for balances */}
                                    {balances.map((balance, index) => (
                                        <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="fw-semibold fs-5">{balance.name}</span>
                                            <span className={`fs-5 fw-bold ${balance.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {balance.amount >= 0 ? 'Owes' : 'Is Owed'} Rs {Math.abs(balance.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="text-center mt-4">
                                <button
                                    onClick={() => navigate('/expenses')}
                                    className="btn btn-primary"
                                >
                                    Back to Expenses
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Balances;
