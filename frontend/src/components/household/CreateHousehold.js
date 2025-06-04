import React, { useState } from 'react';
import api from '../../api'; // Path to api/index.js from CreateHousehold.js
import { useAuth } from '../../auth/AuthContext'; // Path to AuthContext.js from CreateHousehold.js
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner'; // Import the Bootstrap-ready LoadingSpinner

function CreateHousehold() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const { updateUserHousehold, loadUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await api.post('/api/households', { name });
            setSuccessMsg(`Household "${res.data.name}" created successfully! Invite Code: ${res.data.inviteCode}`);
            updateUserHousehold(res.data); // Update the user's household in context
            await loadUser(); // Re-fetch user data to ensure it's fully updated
            setTimeout(() => navigate('/household'), 2000); // Redirect after a delay
        } catch (err) {
            console.error('Error creating household:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Failed to create household.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Create New Household</h2>
                            {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                            {successMsg && <div className="alert alert-success text-center" role="alert">{successMsg}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Household Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        {loading ? <LoadingSpinner /> : 'Create Household'}
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

export default CreateHousehold;
