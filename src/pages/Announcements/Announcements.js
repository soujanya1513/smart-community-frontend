import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

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

  const markAsRead = async (id) => {
    try {
      await api.markAnnouncementAsRead(id);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <Layout title="Announcements">
      <div className="content-card">
        <h2>Community Announcements</h2>

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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: '14px',
              color: '#999'
            }}>
              <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => markAsRead(announcement._id)}
              >
                Mark as Read
              </button>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No announcements</p>
        )}
      </div>
    </Layout>
  );
};

export default Announcements;
