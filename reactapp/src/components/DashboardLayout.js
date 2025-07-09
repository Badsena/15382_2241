import React from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import './styles.css';

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine the title based on the current path
  let pageTitle = 'Dashboard';
  if (location.pathname === '/create-data') {
    pageTitle = 'Create Data';
  } else if (location.pathname === '/list-data') {
    pageTitle = 'List Data';
  } else if (location.pathname === '/reports') {
    pageTitle = 'Reports';
  } else if (location.pathname === '/data-table') {
    pageTitle = 'Data Table';
  }else if (location.pathname === '/crud') {
    pageTitle = 'Crud Operations';
  }

  return (
    <div className="dashboard-container" style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar" style={{ width: '200px', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <h3>Menu</h3>
        <ul style={{ listStyleType: 'none', padding: 0, flexGrow: 1 }}>
          <li style={{ marginBottom: '10px' }}>
            <NavLink to="/create-data" style={{ textDecoration: 'none', color: '#007bff' }} className={({ isActive }) => isActive ? 'active-link' : ''}>Create Data</NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink to="/list-data" style={{ textDecoration: 'none', color: '#007bff' }} className={({ isActive }) => isActive ? 'active-link' : ''}>List Data</NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink to="/reports" style={{ textDecoration: 'none', color: '#007bff' }} className={({ isActive }) => isActive ? 'active-link' : ''}>Reports</NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink to="/data-table" style={{ textDecoration: 'none', color: '#007bff' }} className={({ isActive }) => isActive ? 'active-link' : ''}>Data Table</NavLink>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <NavLink to="/crud" style={{ textDecoration: 'none', color: '#007bff' }} className={({ isActive }) => isActive ? 'active-link' : ''}>Crud</NavLink>
          </li>
        </ul>
        <button onClick={() => navigate('/')} className="button" style={{ marginTop: 'auto', border: 'none', backgroundColor: '#007bff', color: 'white', padding: '10px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
          Logout
        </button>
      </div>
      <div className="content" style={{ flex: 1, padding: '20px' }}>
        <h2>{pageTitle}</h2>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
