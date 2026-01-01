import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const AdminPolls = () => {
  const [polls, setPolls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '']
  });
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validOptions = formData.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setMessage('At least 2 options required');
      return;
    }

    try {
      await api.createPoll({
        question: formData.question,
        options: validOptions
      });
      setMessage('Poll created successfully!');
      fetchPolls();
      setTimeout(() => {
        setShowModal(false);
        setMessage('');
        setFormData({ question: '', options: ['', ''] });
      }, 1500);
    } catch (error) {
      setMessage('Failed to create poll');
    }
  };

  const handleClosePoll = async (id) => {
    if (window.confirm('Are you sure you want to close this poll?')) {
      try {
        await api.closePoll(id);
        fetchPolls();
      } catch (error) {
        alert('Failed to close poll');
      }
    }
  };

  return (
    <Layout title="Poll Management">
      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>All Polls</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create Poll
          </button>
        </div>

        {polls.map((poll) => (
          <div key={poll._id} style={{ 
            background: '#f9f9f9', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '15px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3>{poll.question}</h3>
                <span className={`badge badge-${poll.status}`} style={{ marginTop: '10px' }}>
                  {poll.status}
                </span>
                <div style={{ marginTop: '15px' }}>
                  {poll.options.map((option, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <strong>{option.text}:</strong> {option.votes} votes
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {poll.status === 'active' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleClosePoll(poll._id)}
                  >
                    Close Poll
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Poll</h3>
            
            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Question</label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {formData.options.map((option, index) => (
                <div className="form-group" key={index}>
                  <label>Option {index + 1}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                </div>
              ))}
              
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addOption}
                style={{ marginBottom: '15px' }}
              >
                Add Option
              </button>
              
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Create Poll
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

export default AdminPolls;
