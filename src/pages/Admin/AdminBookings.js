import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status);
      setMessage(`Booking ${status} successfully!`);
      fetchBookings();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update booking');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <Layout title="Booking Management">
      <div className="content-card">
        <h2>All Bookings</h2>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Amenity</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    {booking.userId.fullName}<br />
                    <small>{booking.userId.block}/{booking.userId.houseNumber}</small>
                  </td>
                  <td>{booking.amenityName}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.timeSlot}</td>
                  <td>
                    <span className={`badge badge-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusUpdate(booking._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                        >
                          Reject
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

export default AdminBookings;
