import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.jpg'; 
import '../Layout.css'; 

const Layout = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="layout-container">
      <img src={logo} alt="Logo" className="layout-logo" />
      <div className="layout-nav">
        <div className="layout-nav-links">
          <Link to="/home">Home</Link>
          <Link to="/fetch-data">Employee List</Link>
          <Link to="/insert-data">Create Employee</Link>
        </div>
        <div className="layout-user-info">
          {username && (
            <span className="layout-username">Welcome, {username}</span>
          )}
          <button className="layout-logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Layout;
