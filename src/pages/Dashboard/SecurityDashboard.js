import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import Layout from '../../components/Layout';
import api from '../../services/api';

const SecurityDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    fetchPendingVisitors();
  }, []);

  const fetchPendingVisitors = async () => {
    setLoading(true);
    try {
      const response = await api.getPendingVisitors();
      setVisitors(response.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (visitorId) => {
    try {
      const response = await api.checkInVisitor(visitorId);
      setMessage(`✅ ${response.data.visitor.visitorName} checked in successfully!`);
      fetchPendingVisitors();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Check-in failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleVerifyQR = async (e) => {
    e.preventDefault();
    if (!qrCode.trim()) return;
    
    setVerifying(true);
    try {
      const response = await api.verifyVisitor(qrCode);
      setMessage(`✅ ${response.data.visitorName} verified and checked in!`);
      setQrCode('');
      fetchPendingVisitors();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid QR code - not found in system');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setVerifying(false);
    }
  };

  const handleScan = async (result, error) => {
    if (result) {
      const scannedText = result?.text;
      if (scannedText && scannedText.startsWith('VISITOR-')) {
        setShowScanner(false);
        setVerifying(true);
        try {
          const response = await api.verifyVisitor(scannedText);
          setMessage(`✅ ${response.data.visitorName} verified and checked in!`);
          setQrCode('');
          fetchPendingVisitors();
          setTimeout(() => setMessage(''), 3000);
        } catch (err) {
          setMessage(err.response?.data?.message || 'Invalid QR code - not found in system');
          setTimeout(() => setMessage(''), 3000);
        } finally {
          setVerifying(false);
        }
      }
    }
  };

  return (
    <Layout title="Security - Visitor Check-In">
      <div className="content-card">
        <h2 style={{ marginBottom: '20px' }}>Security Gate - Visitor Verification</h2>

        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '20px' }}>
            {message}
          </div>
        )}

        {/* QR Code Verification Section */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '2px solid #007bff' }}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>🔍 Scan Visitor QR Code</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <button 
              className={`btn ${showScanner ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setShowScanner(!showScanner)}
              style={{ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 'bold' }}
            >
              {showScanner ? '📷 Stop Camera' : '📷 Open Camera to Scan'}
            </button>
          </div>

          {showScanner && (
            <div style={{ marginBottom: '20px', border: '3px solid #007bff', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' }}>
              <QrReader
                onResult={handleScan}
                constraints={{ facingMode: 'environment' }}
                style={{ width: '100%' }}
              />
              <div style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                📱 Point camera at visitor's QR code
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', margin: '15px 0', color: '#666', fontWeight: 'bold' }}>OR MANUAL ENTRY</div>

          <form onSubmit={handleVerifyQR}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px' }}>QR Code Text</label>
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="Paste QR code here (e.g., VISITOR-1234567890-abc123)"
                style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '5px', border: '2px solid #ddd' }}
              />
              <small style={{ color: '#666', fontSize: '13px' }}>Only QR codes generated by residents will be accepted</small>
            </div>
            <button 
              type="submit" 
              className="btn btn-secondary" 
              disabled={verifying || !qrCode.trim()}
              style={{ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 'bold' }}
            >
              {verifying ? 'Verifying...' : '✓ Verify & Check In'}
            </button>
          </form>
        </div>

        {/* Expected Visitors Table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Expected Visitors Today (Backup Method)</h3>
          <button className="btn btn-secondary" onClick={fetchPendingVisitors} disabled={loading}>
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Phone</th>
                <th>Purpose</th>
                <th>Resident</th>
                <th>Block/House</th>
                <th>Resident Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td style={{ fontWeight: 'bold' }}>{visitor.visitorName}</td>
                  <td>{visitor.visitorPhone}</td>
                  <td>{visitor.purpose}</td>
                  <td>{visitor.residentId?.fullName || 'N/A'}</td>
                  <td>{visitor.residentId ? `${visitor.residentId.block}-${visitor.residentId.houseNumber}` : 'N/A'}</td>
                  <td>{visitor.residentId?.phone || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleCheckIn(visitor._id)}
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      ✓ Check In
                    </button>
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                    {loading ? 'Loading visitors...' : 'No pending visitors for today'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '5px', border: '1px solid #4CAF50' }}>
          <h4 style={{ marginTop: 0, color: '#2e7d32' }}>✅ Security Features:</h4>
          <ul style={{ marginBottom: 0, paddingLeft: '20px', color: '#2e7d32' }}>
            <li>Use camera to scan QR codes directly - fastest method</li>
            <li>QR codes are validated against resident-generated codes only</li>
            <li>Invalid or fake QR codes will be rejected</li>
            <li>Each QR code can only be used once</li>
            <li>Use table check-in only if visitor doesn't have QR code</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityDashboard;
