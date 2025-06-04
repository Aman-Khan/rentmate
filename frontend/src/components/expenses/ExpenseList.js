import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api'; // Path to api/index.js from ExpenseList.js
import { useAuth } from '../../auth/AuthContext'; // Path to AuthContext.js from ExpenseList.js
import LoadingSpinner from '../common/LoadingSpinner'; // Path to LoadingSpinner.js from ExpenseList.js
import { Link, useNavigate } from 'react-router-dom';

function ExpenseList() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/expenses/myhousehold');
            setExpenses(res.data);
        } catch (err) {
            console.error('Error fetching expenses:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Failed to fetch expenses.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user && user.household) {
            fetchExpenses();
        } else if (user !== null && !user.household) {
            setLoading(false); // User logged in but no household
        }
    }, [user, fetchExpenses]);

    if (!user) { // User not loaded yet (should be handled by PrivateRoute, but defensive check)
        return <LoadingSpinner />;
    }

    if (!user.household) {
        return (
            <div className="container text-center mt-5 p-4 bg-light rounded shadow-sm">
                <p className="lead mb-4">You need to be part of a household to view or manage expenses.</p>
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
            <h2 className="text-center mb-4">My Household Expenses</h2>

            <div className="d-flex justify-content-between align-items-center mb-4">
                {/* Updated Add New Expense button with Bootstrap classes */}
                <Link
                    to="/expenses/add"
                    className="btn btn-success"
                >
                    Add New Expense
                </Link>
                {/* Updated View Balances button with Bootstrap classes */}
                <Link
                    to="/expenses/balances"
                    className="btn btn-warning"
                >
                    View Balances
                </Link>
            </div>

            {expenses.length === 0 ? (
                <p className="text-center text-muted mt-4">No expenses found for your household.</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"> {/* Bootstrap grid */}
                    {expenses.map((expense) => (
                        <div key={expense._id} className="col">
                            <div className="card h-100 shadow-sm"> {/* h-100 for equal height cards */}
                                <div className="card-body">
                                    <h3 className="card-title h5 mb-2">{expense.description}</h3>
                                    <p className="card-text"><strong>Amount:</strong> ${expense.amount.toFixed(2)}</p>
                                    <p className="card-text"><strong>Paid By:</strong> {expense.payer?.name || 'N/A'}</p>
                                    <p className="card-text"><strong>Split Type:</strong> {expense.splitType}</p>
                                    <p className="card-text"><strong>Participants:</strong></p>
                                    <ul className="list-unstyled ms-3"> {/* list-unstyled to remove default bullet, ms-3 for indent */}
                                        {expense.participants.map((p) => (
                                            <li key={p._id}>{p.name} {expense.splitType === 'custom' && `($${expense.customShares[p._id]?.toFixed(2) || '0.00'})`}</li>
                                        ))}
                                    </ul>
                                    <p className="card-text text-muted small mt-2">Added on: {new Date(expense.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ExpenseList;
