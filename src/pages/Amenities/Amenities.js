import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const AMENITIES = [
  { name: 'Swimming Pool', features: ['Book slot', 'View timing', 'Capacity display', 'Cancel booking'] },
  { name: 'Clubhouse', features: ['Book event', 'Check calendar', 'Upload event note', 'Get admin approval'] },
  { name: 'Gym', features: ['Reserve slot', 'Occupancy info', 'Cancel'] },
  { name: 'Banquet Hall', features: ['Date+hour booking', 'Cost display', 'Approval/reject', 'Booking history'] },
  { name: 'Guest Rooms', features: ['Night booking', 'Upload ID', 'History'] },
  { name: 'Garden Zone', features: ['Slot booking', 'Occupancy', 'Cancel'] },
  { name: 'Badminton Court', features: ['Book match', 'Singles/doubles', 'Booking record'] },
  { name: 'Parking Slots', features: ['Allocate space', 'Guest parking request', 'Status'] }
];

const Amenities = () => {
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    additionalInfo: {}
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleAmenityClick = (amenity) => {
    setSelectedAmenity(amenity);
    setShowModal(true);
    setFormData({ date: '', timeSlot: '', additionalInfo: {} });
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.createBooking({
        amenityName: selectedAmenity.name,
        ...formData
      });
      setMessage('Booking created successfully!');
      fetchBookings();
      setTimeout(() => {
        setShowModal(false);
        setMessage('');
      }, 1500);
    } catch (error) {
      setMessage('Failed to create booking');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.cancelBooking(id);
        fetchBookings();
      } catch (error) {
        alert('Failed to cancel booking');
      }
    }
  };

  return (
    <Layout title="Amenity Booking">
      <div className="content-card">
        <h2>Select an Amenity</h2>
        <div className="amenity-grid">
          {AMENITIES.map((amenity, index) => (
            <div
              key={index}
              className="amenity-card"
              onClick={() => handleAmenityClick(amenity)}
            >
              <h3>{amenity.name}</h3>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                {amenity.features.map((feature, idx) => (
                  <li key={idx} style={{ fontSize: '13px', marginBottom: '5px' }}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="content-card">
        <h2>My Bookings</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Amenity</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
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
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No bookings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Book {selectedAmenity.name}</h3>
            
            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label>Time Slot</label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Time</option>
                  <option value="6:00 AM - 8:00 AM">6:00 AM - 8:00 AM</option>
                  <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                  <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Book Now
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

export default Amenities;
