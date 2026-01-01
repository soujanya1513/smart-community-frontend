import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    month: ''
  });
  const [payableAmount, setPayableAmount] = useState(null);
  // Removed unused upiQrUrl state
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchPayableAmount();
    // Removed fetchUpiQrUrl();
  }, []);



  const fetchPayableAmount = async () => {
    try {
      const amount = await api.getMyPayableAmount();
      setPayableAmount(amount);
      setFormData((prev) => ({ ...prev, amount: amount || '' }));
    } catch (err) {
      setPayableAmount(null);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.getUserPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleChange = (e) => {
    // Only allow month to be changed, not amount
    if (e.target.name === 'month') {
      setFormData({ ...formData, month: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.createPayment(formData);
      setMessage('Payment successful!');
      fetchPayments();
      setTimeout(() => {
        setShowModal(false);
        setMessage('');
        setFormData({ amount: '', month: '' });
      }, 1500);
    } catch (error) {
      setMessage('Payment failed');
    }
  };

  const downloadReceipt = (payment) => {
    const receiptContent = `
SMART COMMUNITY PORTAL
PAYMENT RECEIPT

Transaction ID: ${payment.transactionId}
Amount: ₹${payment.amount}
Month: ${payment.month}
Status: ${payment.status}
Date: ${new Date(payment.createdAt).toLocaleString()}

Thank you for your payment!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.transactionId}.txt`;
    a.click();
  };

  return (
    <Layout title="Rent Payments">
      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Payment History</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Make Payment
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Month</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.transactionId}</td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.month}</td>
                  <td>
                    <span className={`badge badge-${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => downloadReceipt(payment)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No payments yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Make Rent Payment</h3>
            
            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Month</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    required
                    style={{ flex: 1, padding: '10px', fontSize: '16px' }}
                  >
                    <option value="">Select month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select
                    name="year"
                    value={formData.year || ''}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    required
                    style={{ flex: 1, padding: '10px', fontSize: '16px' }}
                  >
                    <option value="">Select year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={payableAmount !== null ? payableAmount : ''}
                  readOnly
                  required
                  min="1"
                  style={{ background: '#f5f5f5', color: '#888', cursor: 'not-allowed' }}
                />
                {payableAmount === 0 && (
                  <small style={{ color: 'red' }}>No payable amount assigned. Please contact admin.</small>
                )}
              </div>
              {formData.month && formData.year && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>UPI QR Code</div>
                  <QRCodeCanvas
                    value={`upi://pay?pa=mysociety@okicici&pn=Smart Community&am=${payableAmount}&cu=INR&tn=Rent payment for ${formData.month}-${formData.year}`}
                    size={200}
                  />
                  <div style={{ marginTop: 10, fontSize: 16 }}>
                    <b>Scan to Pay</b><br />
                    <span>Amount: ₹{payableAmount}</span>
                  </div>
                </div>
              )}
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Pay Now
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

export default Payments;
