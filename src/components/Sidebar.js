import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Smart Community</h3>
        <p>{user?.fullName}</p>
        <p style={{ fontSize: '11px', marginTop: '5px' }}>
          {user?.role === 'admin' ? 'Administrator' : user?.role === 'security' ? 'Security Guard' : 'Resident'}
        </p>
      </div>
      
      <div className="sidebar-menu">
        {user?.role === 'admin' ? (
          <>
            <Link to="/admin" className={`sidebar-item ${isActive('/admin')}`}>
              Dashboard
            </Link>
            <Link to="/admin/users" className={`sidebar-item ${isActive('/admin/users')}`}>
              User Management
            </Link>
            <Link to="/admin/bookings" className={`sidebar-item ${isActive('/admin/bookings')}`}>
              Bookings
            </Link>
            <Link to="/admin/polls" className={`sidebar-item ${isActive('/admin/polls')}`}>
              Polls
            </Link>
            <Link to="/admin/announcements" className={`sidebar-item ${isActive('/admin/announcements')}`}>
              Announcements
            </Link>
            <Link to="/admin/complaints" className={`sidebar-item ${isActive('/admin/complaints')}`}>
              Complaints
            </Link>
            <Link to="/admin/payments" className={`sidebar-item ${isActive('/admin/payments')}`}>
              Payments
            </Link>
            <Link to="/admin/alerts" className={`sidebar-item ${isActive('/admin/alerts')}`}>
              🚨 Broadcast Alert
            </Link>
            <Link to="/alerts" className={`sidebar-item ${isActive('/alerts')}`}>
              My Alerts
            </Link>
          </>
        ) : user?.role === 'security' ? (
          <>
            <Link to="/security" className={`sidebar-item ${isActive('/security')}`}>
              Dashboard
            </Link>
            <Link to="/alerts" className={`sidebar-item ${isActive('/alerts')}`}>
              Alerts
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/amenities" className={`sidebar-item ${isActive('/amenities')}`}>
              Amenities
            </Link>
            <Link to="/polls" className={`sidebar-item ${isActive('/polls')}`}>
              Polls
            </Link>
            <Link to="/payments" className={`sidebar-item ${isActive('/payments')}`}>
              Payments
            </Link>
            <Link to="/visitors" className={`sidebar-item ${isActive('/visitors')}`}>
              Visitors
            </Link>
            <Link to="/announcements" className={`sidebar-item ${isActive('/announcements')}`}>
              Announcements
            </Link>
            <Link to="/complaints" className={`sidebar-item ${isActive('/complaints')}`}>
              Complaints
            </Link>
            <Link to="/gamification" className={`sidebar-item ${isActive('/gamification')}`}>
              My Points
            </Link>
            <Link to="/alerts" className={`sidebar-item ${isActive('/alerts')}`}>
              Alerts
            </Link>
          </>
        )}
        
        <Link to="/profile" className={`sidebar-item ${isActive('/profile')}`}>
          Profile
        </Link>
        <div className="sidebar-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
