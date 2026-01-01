import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [denialMessage, setDenialMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // null, 'admin', or 'resident'
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDenialMessage('');
    setLoading(true);

    try {
      const response = await api.login(formData);
      login(response.data.token, response.data.user);
      
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else if (response.data.user.role === 'security') {
        navigate('/security');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.denied) {
        setDenialMessage(err.response?.data?.message || 'Your application was denied by the administrator');
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Smart Community Portal</h2>
        
        {!selectedRole ? (
          // Role selection screen
          <>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
              Select your login type
            </p>
            <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setSelectedRole('admin')}
                style={{ padding: '15px' }}
              >
                🔐 Admin Login
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setSelectedRole('resident')}
                style={{ padding: '15px' }}
              >
                🏠 Resident Login
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => setSelectedRole('security')}
                style={{ padding: '15px', backgroundColor: '#ff9800', color: 'white', border: 'none' }}
              >
                👮 Security Login
              </button>
            </div>
          </>
        ) : (
          // Login form
          <>
            <button 
              type="button" 
              onClick={() => { setSelectedRole(null); setError(''); setDenialMessage(''); }}
              style={{ background: 'none', border: 'none', color: '#4CAF50', cursor: 'pointer', marginBottom: '10px' }}
            >
              ← Back
            </button>
            
            <h3>
              {selectedRole === 'admin' ? 'Admin Login' : 
               selectedRole === 'security' ? 'Security Login' : 
               'Resident Login'}
            </h3>
            
            {error && <div className="alert alert-error">{error}</div>}
            {denialMessage && <div className="alert alert-error" style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' }}>{denialMessage}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            {selectedRole === 'resident' && (
              <div className="auth-footer">
                Don't have an account? <Link to="/register">Register here</Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
