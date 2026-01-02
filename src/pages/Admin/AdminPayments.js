import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.getAllPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await api.verifyPayment(id, status);
      setMessage(`Payment ${status === 'completed' ? 'approved' : 'rejected'} successfully`);
      fetchPayments();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update payment status');
    }
  };

  const totalAmount = payments.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + payment.amount : sum, 0
  );

  return (
    <Layout title="Payment Management">
      <div className="content-card">
        <h2>Payment Overview</h2>
        
        {message && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            {message}
          </div>
        )}
        
        <div className="grid grid-3" style={{ marginBottom: '30px' }}>
          <div className="stat-card">
            <h3>Total Collected</h3>
            <div className="value">₹{totalAmount}</div>
          </div>
          <div className="stat-card">
            <h3>Total Payments</h3>
            <div className="value">{payments.length}</div>
          </div>
          <div className="stat-card">
            <h3>This Month</h3>
            <div className="value">
              {payments.filter(p => 
                new Date(p.createdAt).getMonth() === new Date().getMonth()
              ).length}
            </div>
          </div>
        </div>

        <h2>All Payments</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Block/House</th>
                <th>Transaction ID</th>
                <th>UTR</th>
                <th>Amount</th>
                <th>Payment For</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>
                    {payment.userId.fullName}<br />
                    <small>{payment.userId.email}</small>
                  </td>
                  <td>{payment.userId.block}/{payment.userId.houseNumber}</td>
                  <td><small>{payment.transactionId}</small></td>
                  <td><strong>{payment.utr || 'N/A'}</strong></td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.month}</td>
                  <td>
                    <span className={`badge badge-${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>
                    {payment.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleVerify(payment._id, 'completed')}
                          title="Approve Payment"
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleVerify(payment._id, 'failed')}
                          title="Reject Payment"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>
                        {payment.status === 'completed' ? 'Verified' : 'Rejected'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPayments;
