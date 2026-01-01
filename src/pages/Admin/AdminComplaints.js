import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.getAllComplaints();
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.updateComplaintStatus(id, status);
      setMessage(`Complaint marked as ${status}!`);
      fetchComplaints();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update complaint');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <Layout title="Complaint Management">
      <div className="content-card">
        <h2>All Complaints</h2>

        {message && (
          <div className={`alert ${message.includes('success') || message.includes('marked') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Complaint</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>
                    {complaint.userId.fullName}<br />
                    <small>{complaint.userId.email}</small>
                  </td>
                  <td>{complaint.message}</td>
                  <td>
                    <span className={`badge badge-${complaint.status}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>
                    {complaint.status !== 'closed' && (
                      <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                        {complaint.status === 'open' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStatusUpdate(complaint._id, 'in-progress')}
                          >
                            In Progress
                          </button>
                        )}
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusUpdate(complaint._id, 'closed')}
                        >
                          Close
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

export default AdminComplaints;
