
import axios from 'axios';

// Use Render/API base URL from environment when available; default to local dev
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

const api = {
  // Set payable amount for a user (admin)
  setPayableAmount: (id, amount) => axios.put(`/users/payable/${id}`, { amount }),
  // Auth
  register: (data) => axios.post('/auth/register', data),
  login: (data) => axios.post('/auth/login', data),
  getMe: () => axios.get('/auth/me'),
  // Get current user's payable amount
  getMyPayableAmount: async () => {
    const res = await axios.get('/auth/me');
    return res.data.payableAmount;
  },
  getMyPaymentDescription: async () => {
    const res = await axios.get('/auth/me');
    return res.data.paymentDescription || '';
  },
  getMyUpiQrUrl: async () => {
    const res = await axios.get('/auth/me');
    return res.data.upiQrUrl;
  },

  // Users
  getAllUsers: () => axios.get('/users'),
  approveUser: (id) => axios.put(`/users/approve/${id}`),
  denyUser: (id) => axios.put(`/users/deny/${id}`, { reason: '' }),
  updateProfile: (data, userId) => {
    if (userId) {
      return axios.put(`/users/profile/${userId}`, data);
    }
    return axios.put('/users/profile', data);
  },

  // Amenities
  createBooking: (data) => axios.post('/amenities', data),
  getUserBookings: () => axios.get('/amenities/user'),
  getAllBookings: () => axios.get('/amenities/all'),
  updateBookingStatus: (id, status) => axios.put(`/amenities/${id}/status`, { status }),
  cancelBooking: (id) => axios.put(`/amenities/${id}/cancel`),

  // Polls
  createPoll: (data) => axios.post('/polls', data),
  getPolls: () => axios.get('/polls'),
  votePoll: (id, optionIndex) => axios.post(`/polls/${id}/vote`, { optionIndex }),
  closePoll: (id) => axios.put(`/polls/${id}/close`),

  // Gamification
  getUserGamification: () => axios.get('/gamification/user'),
  getAllGamification: () => axios.get('/gamification/all'),
  assignBadge: (userId, badge) => axios.put(`/gamification/badge/${userId}`, { badge }),

  // Alerts
  getUserAlerts: () => axios.get('/alerts'),
  markAlertAsRead: (id) => axios.put(`/alerts/${id}/read`),
  createAlert: (data) => axios.post('/alerts', data),

  // Payments
  createPayment: (data) => axios.post('/payments', data),
  getUserPayments: () => axios.get('/payments/user'),
  getAllPayments: () => axios.get('/payments/all'),
  verifyPayment: (id, status) => axios.put(`/payments/${id}/verify`, { status }),

  // Visitors
  generateQR: (data) => axios.post('/visitors/generate', data),
  verifyVisitor: (qrCode) => axios.post('/visitors/verify', { qrCode }),
  getUserVisitors: () => axios.get('/visitors/user'),
  getPendingVisitors: () => axios.get('/visitors/pending'),
  checkInVisitor: (id) => axios.put(`/visitors/checkin/${id}`),

  // Announcements
  createAnnouncement: (data) => axios.post('/announcements', data),
  getAnnouncements: () => axios.get('/announcements'),
  markAnnouncementAsRead: (id) => axios.put(`/announcements/${id}/read`),

  // Complaints
  createComplaint: (data) => axios.post('/complaints', data),
  getUserComplaints: () => axios.get('/complaints/user'),
  getAllComplaints: () => axios.get('/complaints/all'),
  updateComplaintStatus: (id, status) => axios.put(`/complaints/${id}/status`, { status })
};

export default api;
