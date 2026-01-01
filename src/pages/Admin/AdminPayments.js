import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);

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

  const totalAmount = payments.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + payment.amount : sum, 0
  );

  return (
    <Layout title="Payment Management">
      <div className="content-card">
        <h2>Payment Overview</h2>
        
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
                <th>Amount</th>
                <th>Month</th>
                <th>Status</th>
                <th>Date</th>
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
                  <td>{payment.transactionId}</td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.month}</td>
                  <td>
                    <span className={`badge badge-${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
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
