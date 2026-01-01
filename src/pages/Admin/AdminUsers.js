import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [editingAmountId, setEditingAmountId] = useState(null);
  const [amountInput, setAmountInput] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveUser(id);
      setMessage('User approved successfully!');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to approve user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeny = async (id) => {
    try {
      await api.denyUser(id);
      setMessage('User denied successfully!');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error denying user:', error);
      setMessage('Failed to deny user: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleEditAmount = (user) => {
    setEditingAmountId(user._id);
    setAmountInput(user.payableAmount || '');
  };

  const handleSaveAmount = async (user) => {
    try {
      await api.setPayableAmount(user._id, Number(amountInput));
      setMessage('Payable amount updated!');
      setEditingAmountId(null);
      fetchUsers();
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to update amount');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <Layout title="User Management">
      <div className="content-card">
        <h2>All Users</h2>

        {message && (
          <div className={`alert ${message.includes('success') || message.includes('updated') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Block/House</th>
                <th>Role</th>
                <th>Status</th>
                <th>Payable Amount (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.block}/{user.houseNumber}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-completed' : 'badge-pending'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.approved ? 'badge-approved' : user.denied ? 'badge-error' : 'badge-pending'}`}>
                      {user.approved ? 'Approved' : user.denied ? 'Denied' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {editingAmountId === user._id ? (
                      <>
                        <input
                          type="number"
                          value={amountInput}
                          min="0"
                          onChange={e => setAmountInput(e.target.value)}
                          style={{ width: 80 }}
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => handleSaveAmount(user)} style={{ marginLeft: 4 }}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingAmountId(null)} style={{ marginLeft: 2 }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        {user.payableAmount || 0}
                        <button className="btn btn-link btn-sm" onClick={() => handleEditAmount(user)} style={{ marginLeft: 4 }}>Edit</button>
                      </>
                    )}
                  </td>
                  <td>
                    {!user.approved && !user.denied && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(user._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeny(user._id)}
                        >
                          Deny
                        </button>
                      </div>
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

export default AdminUsers;
