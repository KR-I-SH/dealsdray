import React from 'react';
import './Layout.css'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import FetchData from './components/FetchData';
import InsertData from './components/InsertData';
import EditData from './components/EditData';

// Dummy authentication check
const isAuthenticated = () => !!localStorage.getItem('token');

// Protected Route Component
const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                <Route path="/fetch-data" element={<ProtectedRoute element={<FetchData />} />} />
                <Route path="/insert-data" element={<ProtectedRoute element={<InsertData />} />} />
                <Route path="/edit/:id" element={<ProtectedRoute element={<EditData />} />} />
            </Routes>
        </Router>
    );
}

export default App;
