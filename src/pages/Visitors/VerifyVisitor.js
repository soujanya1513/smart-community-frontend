import React, { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const VerifyVisitor = () => {
  const [qrCode, setQrCode] = useState('');
  const [visitor, setVisitor] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setVisitor(null);

    try {
      const response = await api.verifyVisitor(qrCode);
      setVisitor(response.data);
      setMessage('Visitor verified and checked in successfully!');
      setQrCode('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Verify Visitor">
      <div className="content-card">
        <h2>Security Gate - Visitor Verification</h2>
        
        <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>📱 How to Verify:</h4>
          <ol style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px', color: '#856404' }}>
            <li>Ask visitor to show their QR code</li>
            <li>Scan the QR code with a QR scanner app</li>
            <li>Copy the decoded text (starts with "VISITOR-")</li>
            <li>Paste it in the field below and click Verify</li>
          </ol>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>QR Code String</label>
            <input
              type="text"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Paste decoded QR code here (e.g., VISITOR-1234567890-abc123)"
              required
            />
            <small style={{ color: '#666' }}>
              The QR code string should start with "VISITOR-"
            </small>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Check In'}
          </button>
        </form>

        {visitor && (
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '5px', border: '2px solid #4CAF50' }}>
            <h3 style={{ color: '#2e7d32', margin: '0 0 15px 0' }}>✓ Visitor Verified!</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <strong>Visitor Name:</strong>
                <p style={{ margin: '5px 0' }}>{visitor.visitorName}</p>
              </div>
              <div>
                <strong>Phone:</strong>
                <p style={{ margin: '5px 0' }}>{visitor.visitorPhone}</p>
              </div>
              <div>
                <strong>Check-in Time:</strong>
                <p style={{ margin: '5px 0' }}>{new Date(visitor.entryTime).toLocaleString()}</p>
              </div>
              <div>
                <strong>Verified By:</strong>
                <p style={{ margin: '5px 0' }}>{visitor.verifiedBy}</p>
              </div>
            </div>
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '5px' }}>
              <strong>Status:</strong> ✅ Entry Granted
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VerifyVisitor;
