import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [qrImage, setQrImage] = useState('');
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    purpose: '',
    expectedDate: new Date().toISOString().split('T')[0]
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await api.getUserVisitors();
      setVisitors(response.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.generateQR(formData);
      setQrImage(response.data.qrCodeImage);
      setMessage('QR Code generated successfully!');
      fetchVisitors();
      setFormData({ 
        visitorName: '', 
        visitorPhone: '',
        purpose: '',
        expectedDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      setMessage('Failed to generate QR code');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setQrImage('');
    setMessage('');
  };

  return (
    <Layout title="Visitor Management">
      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>My Visitors</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Generate QR for Visitor
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Phone</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Verified By</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td>{visitor.visitorName}</td>
                  <td>{visitor.visitorPhone}</td>
                  <td>
                    {visitor.entryTime 
                      ? new Date(visitor.entryTime).toLocaleString() 
                      : 'Not checked in'}
                  </td>
                  <td>
                    {visitor.exitTime 
                      ? new Date(visitor.exitTime).toLocaleString() 
                      : '-'}
                  </td>
                  <td>{visitor.verifiedBy || '-'}</td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No visitors yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Generate Visitor QR Code</h3>
            
            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}
            
            {!qrImage ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Visitor Name</label>
                  <input
                    type="text"
                    name="visitorName"
                    value={formData.visitorName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Visitor Phone</label>
                  <input
                    type="tel"
                    name="visitorPhone"
                    value={formData.visitorPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Purpose of Visit</label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Family visit, Delivery, etc."
                  />
                </div>
                
                <div className="form-group">
                  <label>Expected Date</label>
                  <input
                    type="date"
                    name="expectedDate"
                    value={formData.expectedDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    Generate QR
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="qr-display">
                <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>✓ QR Code Generated Successfully!</h4>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>
                    <strong>How to use this QR code:</strong>
                  </p>
                  <ol style={{ margin: '10px 0', paddingLeft: '20px', fontSize: '14px' }}>
                    <li>Download or screenshot this QR code</li>
                    <li>Share it with your visitor via WhatsApp/Email/SMS</li>
                    <li>Visitor shows the QR code at the security gate</li>
                    <li>Security scans and verifies the code</li>
                    <li>Visitor is granted entry after verification</li>
                  </ol>
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <img src={qrImage} alt="Visitor QR Code" style={{ maxWidth: '300px', border: '2px solid #ddd', padding: '10px', borderRadius: '5px' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = qrImage;
                      link.download = `visitor-qr-${Date.now()}.png`;
                      link.click();
                    }}
                    style={{ flex: 1 }}
                  >
                    Download QR
                  </button>
                  <button className="btn btn-secondary" onClick={closeModal} style={{ flex: 1 }}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Visitors;
