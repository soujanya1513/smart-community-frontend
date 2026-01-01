import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    bookings: 0,
    payments: 0,
    complaints: 0,
    points: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, paymentsRes, complaintsRes, gamificationRes, announcementsRes, alertsRes] = await Promise.all([
        api.getUserBookings(),
        api.getUserPayments(),
        api.getUserComplaints(),
        api.getUserGamification(),
        api.getAnnouncements(),
        api.getUserAlerts()
      ]);

      setStats({
        bookings: bookingsRes.data.length,
        payments: paymentsRes.data.length,
        complaints: complaintsRes.data.length,
        points: gamificationRes.data.points
      });

      setRecentBookings(bookingsRes.data.slice(0, 5));
      setAnnouncements(announcementsRes.data.slice(0, 3));
      setAlerts(alertsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <Layout title={`Welcome, ${user?.fullName}`}>
      <div className="grid grid-2">
        <div className="stat-card">
          <h3>My Bookings</h3>
          <div className="value">{stats.bookings}</div>
        </div>
        <div className="stat-card">
          <h3>Payments Made</h3>
          <div className="value">{stats.payments}</div>
        </div>
        <div className="stat-card">
          <h3>Active Complaints</h3>
          <div className="value">{stats.complaints}</div>
        </div>
        <div className="stat-card">
          <h3>Points Earned</h3>
          <div className="value">{stats.points}</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '20px' }}>
        <div className="content-card">
          <h2>Recent Bookings</h2>
          {recentBookings.length > 0 ? (
            <div>
              {recentBookings.map((booking) => (
                <div key={booking._id} style={{ 
                  padding: '10px', 
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <strong>{booking.amenityName}</strong><br />
                    <small>{new Date(booking.date).toLocaleDateString()} - {booking.timeSlot}</small>
                  </div>
                  <span className={`badge badge-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No bookings yet</p>
          )}
        </div>

        <div className="content-card">
          <h2>Latest Announcements</h2>
          {announcements.length > 0 ? (
            <div>
              {announcements.map((announcement) => (
                <div key={announcement._id} style={{ 
                  padding: '10px', 
                  borderBottom: '1px solid #eee'
                }}>
                  <strong>{announcement.title}</strong><br />
                  <small style={{ color: '#666' }}>{announcement.description.substring(0, 80)}...</small>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No announcements</p>
          )}
        </div>
      </div>

      <div className="content-card" style={{ marginTop: '20px' }}>
        <h2>Recent Alerts</h2>
        {alerts.length > 0 ? (
          <div>
            {alerts.map((alert) => (
              <div key={alert._id} style={{ 
                padding: '12px', 
                background: alert.readStatus ? '#f9f9f9' : '#e3f2fd',
                borderRadius: '6px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{alert.message}</span>
                  <small style={{ color: '#999' }}>
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No alerts</p>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
