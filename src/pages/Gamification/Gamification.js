import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const Gamification = () => {
  const [gamification, setGamification] = useState(null);

  useEffect(() => {
    fetchGamification();
  }, []);

  const fetchGamification = async () => {
    try {
      const response = await api.getUserGamification();
      setGamification(response.data);
    } catch (error) {
      console.error('Error fetching gamification:', error);
    }
  };

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'Gold': return '#FFD700';
      case 'Silver': return '#C0C0C0';
      default: return '#CD7F32';
    }
  };

  return (
    <Layout title="My Points & Badges">
      <div className="content-card">
        <h2>Gamification</h2>

        {gamification && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              fontSize: '72px', 
              fontWeight: 'bold', 
              color: '#667eea',
              marginBottom: '20px'
            }}>
              {gamification.points}
            </div>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
              Total Points Earned
            </p>

            <div style={{ 
              display: 'inline-block',
              padding: '20px 40px',
              borderRadius: '50px',
              background: getBadgeColor(gamification.badge),
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {gamification.badge} Badge
            </div>

            <div style={{ 
              marginTop: '40px', 
              padding: '20px', 
              background: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <h3>How to Earn Points:</h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginTop: '15px',
                textAlign: 'left'
              }}>
                <li style={{ marginBottom: '10px' }}>✓ Book amenities: 10 points</li>
                <li style={{ marginBottom: '10px' }}>✓ Vote in polls: 5 points</li>
                <li style={{ marginBottom: '10px' }}>✓ Make payments on time: 15 points</li>
                <li style={{ marginBottom: '10px' }}>✓ Register visitors: 5 points</li>
              </ul>
            </div>
          </div>
        )}

        {!gamification && (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
        )}
      </div>
    </Layout>
  );
};

export default Gamification;
