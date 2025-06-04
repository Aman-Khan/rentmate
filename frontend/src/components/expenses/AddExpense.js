import React, { useState, useEffect } from 'react';
import api from '../../api'; // Path to api/index.js from AddExpense.js
import { useAuth } from '../../auth/AuthContext'; // Path to AuthContext.js from AddExpense.js
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner'; // Import the Bootstrap-ready LoadingSpinner

function AddExpense() {
    const { user } = useAuth();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [payer, setPayer] = useState('');
    const [participants, setParticipants] = useState([]);
    const [splitType, setSplitType] = useState('equal'); // 'equal' or 'custom'
    const [customShares, setCustomShares] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (user && user._id) {
            setPayer(user._id); // Default payer to current user
            // Set all members as participants by default for equal split
            if (user.household && user.household.members) {
                const memberIds = user.household.members.map(m => m._id);
                setParticipants(memberIds);
                const initialCustomShares = memberIds.reduce((acc, id) => {
                    acc[id] = 0;
                    return acc;
                }, {});
                setCustomShares(initialCustomShares);
            }
        }
    }, [user]);

    const handleParticipantChange = (e) => {
        const { value, checked } = e.target;
        setParticipants(prev =>
            checked ? [...prev, value] : prev.filter(id => id !== value)
        );
    };

    const handleCustomShareChange = (memberId, value) => {
        setCustomShares(prev => ({
            ...prev,
            [memberId]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        if (!user || !user.household) {
            setError('You must be in a household to add expenses.');
            setLoading(false);
            return;
        }

        if (participants.length === 0) {
            setError('Please select at least one participant.');
            setLoading(false);
            return;
        }

        const expenseData = {
            description,
            amount: parseFloat(amount),
            payer,
            participants,
            splitType,
        };

        if (splitType === 'custom') {
            const totalCustomShares = Object.values(customShares).reduce((sum, share) => sum + share, 0);
            if (Math.abs(totalCustomShares - parseFloat(amount)) > 0.01) { // Allow for small floating point discrepancies
                setError('Custom shares do not add up to the total amount.');
                setLoading(false);
                return;
            }
            expenseData.customShares = customShares;
        }

        try {
            await api.post('/api/expenses', expenseData);
            setSuccessMsg('Expense added successfully!');
            setDescription('');
            setAmount('');
            // Reset participants to all household members for the next entry
            if (user.household && user.household.members) {
                setParticipants(user.household.members.map(m => m._id));
                setCustomShares(user.household.members.reduce((acc, member) => {
                    acc[member._id] = 0;
                    return acc;
                }, {}));
            }
            setPayer(user._id);

            setTimeout(() => navigate('/expenses'), 1500);
        } catch (err) {
            console.error('Error adding expense:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Failed to add expense.');
        } finally {
            setLoading(false);
        }
    };

    if (!user || !user.household) {
        return (
            <div className="container text-center mt-5 p-4 bg-light rounded shadow-sm">
                <p className="lead mb-4">You need to be part of a household to add expenses.</p>
                <button
                    onClick={() => navigate('/household')}
                    className="btn btn-primary btn-lg"
                >
                    Go to Household
                </button>
            </div>
        );
    }

    const householdMembers = user.household.members || [];

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Add New Expense</h2>
                            {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                            {successMsg && <div className="alert alert-success text-center" role="alert">{successMsg}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Description:
                                    </label>
                                    <input
                                        type="text"
                                        id="description"
                                        className="form-control"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="amount" className="form-label">
                                        Amount:
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        step="0.01"
                                        className="form-control"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="payer" className="form-label">
                                        Paid By:
                                    </label>
                                    <select
                                        id="payer"
                                        className="form-select"
                                        value={payer}
                                        onChange={(e) => setPayer(e.target.value)}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">Select Payer</option>
                                        {householdMembers.map((member) => (
                                            <option key={member._id} value={member._id}>
                                                {member.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Participants:
                                    </label>
                                    {householdMembers.map((member) => (
                                        <div key={member._id} className="form-check mb-2">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`participant-${member._id}`}
                                                value={member._id}
                                                checked={participants.includes(member._id)}
                                                onChange={handleParticipantChange}
                                                disabled={loading}
                                            />
                                            <label className="form-check-label" htmlFor={`participant-${member._id}`}>
                                                {member.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="splitType" className="form-label">
                                        Split Type:
                                    </label>
                                    <select
                                        id="splitType"
                                        className="form-select"
                                        value={splitType}
                                        onChange={(e) => setSplitType(e.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="equal">Equal Split</option>
                                        <option value="custom">Custom Split</option>
                                    </select>
                                </div>

                                {splitType === 'custom' && (
                                    <div className="mb-3 p-3 border rounded bg-light">
                                        <h4 className="h6 mb-3">Custom Shares:</h4>
                                        {householdMembers
                                            .filter(member => participants.includes(member._id)) // Only show selected participants
                                            .map((member) => (
                                                <div key={member._id} className="row mb-2 align-items-center">
                                                    <label htmlFor={`share-${member._id}`} className="col-6 col-form-label">
                                                        {member.name}:
                                                    </label>
                                                    <div className="col-6">
                                                        <input
                                                            type="number"
                                                            id={`share-${member._id}`}
                                                            step="0.01"
                                                            className="form-control"
                                                            value={customShares[member._id] || ''}
                                                            onChange={(e) => handleCustomShareChange(member._id, e.target.value)}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        <p className="text-muted small mt-3">Total Custom Shares: ${Object.values(customShares).reduce((sum, share) => sum + share, 0).toFixed(2)} / ${parseFloat(amount || 0).toFixed(2)}</p>
                                    </div>
                                )}

                                <div className="d-grid gap-2 mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? <LoadingSpinner /> : 'Add Expense'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddExpense;
