import React, { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const AdminAlerts = () => {
  const [formData, setFormData] = useState({
    message: '',
    type: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await api.createAlert(formData);
      
      setSuccess(`Alert broadcasted successfully to ${response.data.count} users!`);
      setFormData({ message: '', type: 'general' });
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Broadcast Alert">
      <div className="content-card">
        <h2>Send Alert to All Users</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This alert will be sent to all approved users in the community
        </p>

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            {success}
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Alert Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="general">General</option>
              <option value="booking">Booking</option>
              <option value="announcement">Announcement</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              rows="5"
              placeholder="Enter alert message for all users..."
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Broadcasting...' : 'Broadcast Alert to All Users'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
          <h3 style={{ marginTop: 0 }}>Alert Type Guidelines:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>General:</strong> Community updates, reminders</li>
            <li><strong>Booking:</strong> Amenity availability, booking updates</li>
            <li><strong>Announcement:</strong> Important community announcements</li>
            <li><strong>Maintenance:</strong> Scheduled maintenance, service updates</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAlerts;
