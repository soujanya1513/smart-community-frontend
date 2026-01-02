import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    month: '',
    utr: '' // UPI Transaction Reference
  });
  const [payableAmount, setPayableAmount] = useState(null);
  const [paymentDescription, setPaymentDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
    fetchPayableAmount();
  }, []);



  const fetchPayableAmount = async () => {
    try {
      const amount = await api.getMyPayableAmount();
      const description = await api.getMyPaymentDescription();
      setPayableAmount(amount);
      setPaymentDescription(description);
      setFormData((prev) => ({ ...prev, amount: amount || '', month: description || '' }));
    } catch (err) {
      setPayableAmount(null);
      setPaymentDescription('');
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    try {
      await api.createPayment(formData);
      setMessage('Payment request submitted! Waiting for admin verification.');
      fetchPayments();
      setTimeout(() => {
        setShowModal(false);
        setMessage('');
        setFormData({ amount: '', month: '', utr: '' });
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      setMessage('Payment submission failed');
      setIsSubmitting(false);
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
                <th>Payment For</th>
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
                    {payment.status === 'completed' ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => downloadReceipt(payment)}
                      >
                        Download Receipt
                      </button>
                    ) : (
                      <span style={{ color: '#999' }}>
                        {payment.status === 'pending' ? 'Awaiting Verification' : 'Payment Failed'}
                      </span>
                    )}
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
                <label>Payment For</label>
                <input
                  type="text"
                  value={paymentDescription || 'Not specified by admin'}
                  readOnly
                  style={{ background: '#f5f5f5', color: '#333', cursor: 'not-allowed', fontWeight: '500' }}
                />
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
              {payableAmount > 0 && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>UPI QR Code</div>
                  <QRCodeCanvas
                    value={`upi://pay?pa=soujanyapoojari1513@oksbi&pn=Soujanya Poojari&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(paymentDescription || 'Society Payment')}`}
                    size={200}
                  />
                  <div style={{ marginTop: 10, fontSize: 16 }}>
                    <b>Scan to Pay</b><br />
                    <span>Amount: ₹{payableAmount}</span><br />
                    <small style={{ color: '#666', fontSize: '12px' }}>UPI ID: soujanyapoojari1513@oksbi</small>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>UTR Number (UPI Transaction Reference) *</label>
                <input
                  type="text"
                  name="utr"
                  value={formData.utr}
                  onChange={handleChange}
                  placeholder="Enter 12-digit UTR number after payment"
                  required
                  className="form-control"
                />
                <small style={{ color: '#666' }}>
                  After scanning QR and paying, enter the UTR/Transaction ID from your payment app
                </small>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Payment Proof'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
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
