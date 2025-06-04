import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';

import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

import MyHouseholdDetails from './components/household/MyHouseholdDetails';
import CreateHousehold from './components/household/CreateHousehold';
import JoinHousehold from './components/household/JoinHousehold';

import ChoreList from './components/chores/ChoreList';
import AddChore from './components/chores/AddChore';

import ExpenseList from './components/expenses/ExpenseList';
import AddExpense from './components/expenses/AddExpense';
import Balances from './components/expenses/Balances';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <div className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} /> {/* Public home page */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        {/* Household Routes */}
                        <Route path="/household" element={<PrivateRoute><MyHouseholdDetails /></PrivateRoute>} />
                        <Route path="/household/create" element={<PrivateRoute><CreateHousehold /></PrivateRoute>} />
                        <Route path="/household/join" element={<PrivateRoute><JoinHousehold /></PrivateRoute>} />

                        {/* Chore Routes */}
                        <Route path="/chores" element={<PrivateRoute><ChoreList /></PrivateRoute>} />
                        <Route path="/chores/add" element={<PrivateRoute><AddChore /></PrivateRoute>} />

                        {/* Expense Routes */}
                        <Route path="/expenses" element={<PrivateRoute><ExpenseList /></PrivateRoute>} />
                        <Route path="/expenses/add" element={<PrivateRoute><AddExpense /></PrivateRoute>} />
                        <Route path="/expenses/balances" element={<PrivateRoute><Balances /></PrivateRoute>} />

                        {/* Redirect authenticated users from "/" to "/dashboard" if needed */}
                        <Route
                            path="/"
                            element={<PrivateRoute><Dashboard /></PrivateRoute>}
                        />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
