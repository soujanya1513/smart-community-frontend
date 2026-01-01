import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await api.getPolls();
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      await api.votePoll(pollId, optionIndex);
      setMessage('Vote recorded successfully!');
      fetchPolls();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to vote');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <Layout title="Polls">
      <div className="content-card">
        <h2>Community Polls</h2>
        
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        {polls.map((poll) => (
          <div key={poll._id} style={{ 
            background: '#f9f9f9', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h3 style={{ marginBottom: '15px' }}>{poll.question}</h3>
            <span className={`badge badge-${poll.status}`} style={{ marginBottom: '15px' }}>
              {poll.status}
            </span>
            
            <div style={{ marginTop: '15px' }}>
              {poll.options.map((option, index) => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                const percentage = totalVotes > 0 ? (option.votes / totalVotes * 100).toFixed(1) : 0;
                
                return (
                  <div key={index} style={{ marginBottom: '15px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <span>{option.text}</span>
                      <span style={{ fontWeight: 'bold' }}>{option.votes} votes ({percentage}%)</span>
                    </div>
                    <div style={{ 
                      background: '#ddd', 
                      borderRadius: '4px', 
                      height: '10px', 
                      overflow: 'hidden' 
                    }}>
                      <div style={{ 
                        background: '#667eea', 
                        width: `${percentage}%`, 
                        height: '100%',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    
                    {poll.status === 'active' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleVote(poll._id, index)}
                        style={{ marginTop: '5px' }}
                      >
                        Vote
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {polls.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No polls available</p>
        )}
      </div>
    </Layout>
  );
};

export default Polls;
