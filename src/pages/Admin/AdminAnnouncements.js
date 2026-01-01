import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.getAnnouncements();
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.createAnnouncement(formData);
      setMessage('Announcement created successfully!');
      fetchAnnouncements();
      setTimeout(() => {
        setShowModal(false);
        setMessage('');
        setFormData({ title: '', description: '' });
      }, 1500);
    } catch (error) {
      setMessage('Failed to create announcement');
    }
  };

  return (
    <Layout title="Announcement Management">
      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>All Announcements</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create Announcement
          </button>
        </div>

        {announcements.map((announcement) => (
          <div key={announcement._id} style={{ 
            background: '#f9f9f9', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '15px',
            borderLeft: '4px solid #667eea'
          }}>
            <h3 style={{ marginBottom: '10px' }}>{announcement.title}</h3>
            <p style={{ color: '#666', marginBottom: '10px' }}>{announcement.description}</p>
            <div style={{ fontSize: '14px', color: '#999' }}>
              <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
              <span style={{ marginLeft: '20px' }}>
                Read by: {announcement.readBy?.length || 0} users
              </span>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No announcements yet</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create Announcement</h3>
            
            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                />
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminAnnouncements;
