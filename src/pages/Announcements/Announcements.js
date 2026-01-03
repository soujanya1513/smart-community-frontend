import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const { user } = useContext(AuthContext);

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

  const isRead = (announcement) => {
    return announcement.readBy && announcement.readBy.includes(user?.id);
  };

  return (
    <Layout title="Announcements">
      <div className="content-card">
        <h2>Community Announcements</h2>

        {announcements.map((announcement) => {
          const hasRead = isRead(announcement);
          return (
            <div key={announcement._id} style={{ 
              background: hasRead ? '#f0f8f0' : '#f9f9f9', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '15px',
              borderLeft: `4px solid ${hasRead ? '#28a745' : '#667eea'}`,
              opacity: hasRead ? 0.85 : 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ marginBottom: '10px', marginRight: '10px' }}>
                  {announcement.title}
                  {hasRead && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#28a745' }}>✓ Read</span>}
                </h3>
              </div>
              <p style={{ color: '#666', marginBottom: '10px' }}>{announcement.description}</p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '14px',
                color: '#999'
              }}>
                <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                {!hasRead && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => markAsRead(announcement._id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {announcements.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No announcements</p>
        )}
      </div>
    </Layout>
  );
};

export default Announcements;
