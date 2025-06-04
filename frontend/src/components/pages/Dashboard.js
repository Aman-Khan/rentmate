import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Dashboard() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="text-center mt-10 p-6 bg-white rounded shadow-md">
            <h1 className="text-4xl font-bold mb-6">Welcome, {user?.name || 'User'}!</h1>

            {user?.household ? (
                <>
                    <p className="text-lg mb-4">You are currently part of the household: <span className="font-semibold">{user.household.name}</span></p>
                    <div className="space-x-4 mt-6">
                        <button
                            onClick={() => navigate('/household')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out"
                        >
                            View My Household
                        </button>
                        <button
                            onClick={() => navigate('/chores')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out"
                        >
                            Manage Chores
                        </button>
                        <button
                            onClick={() => navigate('/expenses')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out"
                        >
                            Manage Expenses
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-lg mb-4">You are not part of any household yet.</p>
                    <div className="space-x-4 mt-6">
                        <button
                            onClick={() => navigate('/household/create')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out"
                        >
                            Create New Household
                        </button>
                        <button
                            onClick={() => navigate('/household/join')}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out"
                        >
                            Join Existing Household
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;
