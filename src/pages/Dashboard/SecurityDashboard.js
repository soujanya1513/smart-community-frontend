import React, { useState } from 'react';
import jsQR from 'jsqr';
import Layout from '../../components/Layout';
import api from '../../services/api';

const SecurityDashboard = () => {
  const [qrCode, setQrCode] = useState('');
  const [visitor, setVisitor] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [scanStatus, setScanStatus] = useState('');

  const verifyCode = async (code) => {
    if (!code) return;
    setLoading(true);
    setMessage('');
    setVisitor(null);

    try {
      const response = await api.verifyVisitor(code);
      setVisitor(response.data);
      setMessage('✅ Visitor verified and entry approved!');
      setQrCode('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    await verifyCode(qrCode);
  };

  const decodeQrFromImage = async (file) => {
    if (!file) throw new Error('No file received');
    if (!file.type.startsWith('image/')) throw new Error('Please use an image file');

    const imageBitmap = await createImageBitmap(file);

    if (window.BarcodeDetector) {
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const codes = await detector.detect(imageBitmap);
      const value = codes?.[0]?.rawValue?.trim();
      if (value) return value;
    }

    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas not supported in this browser');

    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height);

    if (result?.data) return result.data.trim();

    throw new Error('Could not detect a QR code in the selected image');
  };

  const handleFile = async (file) => {
    if (!file) return;
    setScanStatus('Scanning QR image...');
    try {
      const code = await decodeQrFromImage(file);
      setQrCode(code);
      setScanStatus('QR detected. Verifying...');
      await verifyCode(code);
      setScanStatus('');
    } catch (err) {
      setScanStatus(err.message || 'Unable to scan this file');
    }
  };

  const onFileInputChange = async (event) => {
    const file = event.target.files?.[0];
    await handleFile(file);
    event.target.value = '';
  };

  const onDrop = async (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    await handleFile(file);
  };

  const handleClear = () => {
    setQrCode('');
    setVisitor(null);
    setMessage('');
    setScanStatus('');
  };

  return (
    <Layout title="Security Dashboard">
      <div className="content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '32px' }}>👮</span>
          <h2 style={{ margin: 0 }}>Security Gate - Visitor Verification</h2>
        </div>

        <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffc107' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>📱 Verification Process:</h4>
          <ol style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '14px', color: '#856404' }}>
            <li>Ask visitor to show their QR code</li>
            <li>Drop the QR image below or tap "Choose file" to upload</li>
            <li>We will scan the image and verify automatically</li>
            <li>Or paste the decoded text (starts with "VISITOR-") and verify</li>
            <li>System will display visitor details and record entry time</li>
          </ol>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          style={{
            border: dragActive ? '2px solid #007bff' : '2px dashed #bbb',
            backgroundColor: dragActive ? '#e8f0fe' : '#f8f9fa',
            padding: '24px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center',
            transition: 'all 0.15s ease-in-out'
          }}
        >
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '16px' }}>
            Drag & drop a QR image here or choose a file to scan
          </p>
          <input
            id="qr-file-input"
            type="file"
            accept="image/*"
            onChange={onFileInputChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="qr-file-input" className="btn btn-secondary" style={{ cursor: 'pointer', padding: '10px 16px' }}>
            Choose file
          </label>
          <p style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
            Works best with clear QR photos or screenshots
          </p>
          {scanStatus && <p style={{ marginTop: '8px', color: '#007bff', fontWeight: 'bold' }}>{scanStatus}</p>}
        </div>

        {message && (
          <div className={`alert ${message.includes('✅') || message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} style={{ marginBottom: '30px' }}>
          <div className="form-group">
            <label style={{ fontSize: '16px', fontWeight: 'bold' }}>QR Code String</label>
            <input
              type="text"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Paste decoded QR code here (e.g., VISITOR-1234567890-abc123)"
              required
              style={{ fontSize: '16px', padding: '12px' }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
              💡 Paste manually if scanning is blocked; the QR code string should start with "VISITOR-" followed by numbers and letters
            </small>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, padding: '12px', fontSize: '16px' }}>
              {loading ? 'Verifying...' : '✓ Verify & Approve Entry'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClear} style={{ padding: '12px' }}>
              Clear
            </button>
          </div>
        </form>

        {visitor && (
          <div style={{ 
            marginTop: '30px', 
            padding: '25px', 
            backgroundColor: '#e8f5e9', 
            borderRadius: '10px', 
            border: '3px solid #4CAF50',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '40px' }}>✅</span>
              <h3 style={{ color: '#2e7d32', margin: 0 }}>Entry Approved!</h3>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px',
              marginBottom: '15px' 
            }}>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
                <strong style={{ color: '#666', fontSize: '14px' }}>Visitor Name:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>{visitor.visitorName}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
                <strong style={{ color: '#666', fontSize: '14px' }}>Phone Number:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>{visitor.visitorPhone}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
                <strong style={{ color: '#666', fontSize: '14px' }}>Check-in Time:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>
                  {new Date(visitor.entryTime).toLocaleString()}
                </p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
                <strong style={{ color: '#666', fontSize: '14px' }}>Verified By:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>{visitor.verifiedBy}</p>
              </div>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#4CAF50', 
              color: 'white',
              borderRadius: '5px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              🚪 VISITOR MAY ENTER
            </div>
          </div>
        )}

        {/* Removed duplicate bottom placeholder for scan instructions */}
      </div>
    </Layout>
  );
};

export default SecurityDashboard;
