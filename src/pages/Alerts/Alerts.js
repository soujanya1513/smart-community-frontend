import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getUserAlerts();
      setAlerts(res.data || []);
    } catch (err) {
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.markAlertAsRead(id);
      setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, read: true } : a)));
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <Layout title="Alerts">
      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>My Alerts</h2>
          <button className="btn btn-secondary" onClick={fetchAlerts} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Message</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert._id}>
                  <td>{alert.message}</td>
                  <td>
                    <span className="badge badge-info">{alert.type || 'general'}</span>
                  </td>
                  <td>
                    {alert.read ? (
                      <span className="badge badge-success">Read</span>
                    ) : (
                      <span className="badge badge-warning">Unread</span>
                    )}
                  </td>
                  <td>{new Date(alert.createdAt).toLocaleString()}</td>
                  <td>
                    {!alert.read && (
                      <button className="btn btn-primary" onClick={() => markAsRead(alert._id)}>
                        Mark as read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No alerts yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Alerts;
