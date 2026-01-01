import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalPayments: 0,
    totalAmount: 0,
    totalComplaints: 0,
    openComplaints: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, bookingsRes, paymentsRes, complaintsRes] = await Promise.all([
        api.getAllUsers(),
        api.getAllBookings(),
        api.getAllPayments(),
        api.getAllComplaints()
      ]);

      const users = usersRes.data;
      const bookings = bookingsRes.data;
      const payments = paymentsRes.data;
      const complaints = complaintsRes.data;

      setStats({
        totalUsers: users.length,
        pendingUsers: users.filter(u => !u.approved).length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        totalPayments: payments.length,
        totalAmount: payments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0),
        totalComplaints: complaints.length,
        openComplaints: complaints.filter(c => c.status !== 'closed').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <Layout title={`Admin Dashboard - Welcome ${user?.fullName}`}>
      <div className="content-card" style={{ marginBottom: '20px' }}>
        <h2>System Overview</h2>
        <div className="grid grid-2">
          <div className="stat-card" style={{ background: '#e3f2fd' }}>
            <h3>Total Users</h3>
            <div className="value" style={{ color: '#1976d2' }}>{stats.totalUsers}</div>
            <small>{stats.pendingUsers} pending approval</small>
          </div>
          <div className="stat-card" style={{ background: '#f3e5f5' }}>
            <h3>Total Bookings</h3>
            <div className="value" style={{ color: '#7b1fa2' }}>{stats.totalBookings}</div>
            <small>{stats.pendingBookings} pending</small>
          </div>
          <div className="stat-card" style={{ background: '#e8f5e9' }}>
            <h3>Payments Collected</h3>
            <div className="value" style={{ color: '#388e3c' }}>₹{stats.totalAmount}</div>
            <small>{stats.totalPayments} transactions</small>
          </div>
          <div className="stat-card" style={{ background: '#fff3e0' }}>
            <h3>Complaints</h3>
            <div className="value" style={{ color: '#f57c00' }}>{stats.totalComplaints}</div>
            <small>{stats.openComplaints} open</small>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2>Quick Actions</h2>
        <div className="grid grid-3">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/admin/users'}
            style={{ padding: '20px' }}
          >
            Manage Users
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/admin/bookings'}
            style={{ padding: '20px' }}
          >
            Approve Bookings
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/admin/complaints'}
            style={{ padding: '20px' }}
          >
            Handle Complaints
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/admin/announcements'}
            style={{ padding: '20px' }}
          >
            Create Announcement
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/admin/polls'}
            style={{ padding: '20px' }}
          >
            Create Poll
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/admin/payments'}
            style={{ padding: '20px' }}
          >
            View Payments
          </button>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: '20px' }}>
        <h2>Recent Activity</h2>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <p>Monitor all community activities from the respective management pages</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
