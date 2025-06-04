import React, { useState, useEffect } from 'react';
import api from '../../api'; // Path to api/index.js from AddChore.js
import { useAuth } from '../../auth/AuthContext'; // Path to AuthContext.js from AddChore.js
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner'; // Import the Bootstrap-ready LoadingSpinner

function AddChore() {
    const { user } = useAuth();
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState('Daily');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    // Set initial assignedTo to the current user if available
    useEffect(() => {
        if (user && user._id) {
            setAssignedTo(user._id);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        if (!assignedTo) {
            setError('Please assign the chore to a member.');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/api/chores', {
                description,
                frequency,
                assignedTo,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined, // Ensure valid date format
            });
            setSuccessMsg('Chore added successfully!');
            setDescription('');
            setFrequency('Daily');
            setDueDate('');
            // Keep assignedTo selected if it was manually picked, or reset to current user
            setAssignedTo(user._id);

            setTimeout(() => navigate('/chores'), 1500); // Redirect after a delay
        } catch (err) {
            console.error('Error adding chore:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Failed to add chore.');
        } finally {
            setLoading(false);
        }
    };

    if (!user || !user.household) {
        return (
            <div className="container text-center mt-5 p-4 bg-light rounded shadow-sm">
                <p className="lead mb-4">You need to be part of a household to add chores.</p>
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
                            <h2 className="card-title text-center mb-4">Add New Chore</h2>
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
                                    <label htmlFor="frequency" className="form-label">
                                        Frequency:
                                    </label>
                                    <select
                                        id="frequency"
                                        className="form-select"
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="One-time">One-time</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="assignedTo" className="form-label">
                                        Assigned To:
                                    </label>
                                    <select
                                        id="assignedTo"
                                        className="form-select"
                                        value={assignedTo}
                                        onChange={(e) => setAssignedTo(e.target.value)}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">Select Member</option>
                                        {householdMembers.map((member) => (
                                            <option key={member._id} value={member._id}>
                                                {member.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="dueDate" className="form-label">
                                        Due Date: (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        id="dueDate"
                                        className="form-control"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? <LoadingSpinner /> : 'Add Chore'}
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

export default AddChore;
