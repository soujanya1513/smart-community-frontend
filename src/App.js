import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import SecurityDashboard from './pages/Dashboard/SecurityDashboard';
import Profile from './pages/Auth/Profile';
import Amenities from './pages/Amenities/Amenities';
import Polls from './pages/Polls/Polls';
import Payments from './pages/Payments/Payments';
import Visitors from './pages/Visitors/Visitors';
import VerifyVisitor from './pages/Visitors/VerifyVisitor';
import Announcements from './pages/Announcements/Announcements';
import Complaints from './pages/Complaints/Complaints';
import Gamification from './pages/Gamification/Gamification';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminBookings from './pages/Admin/AdminBookings';
import AdminPolls from './pages/Admin/AdminPolls';
import AdminAnnouncements from './pages/Admin/AdminAnnouncements';
import AdminComplaints from './pages/Admin/AdminComplaints';
import AdminPayments from './pages/Admin/AdminPayments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/security" element={
            <ProtectedRoute>
              <SecurityDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/amenities" element={
            <ProtectedRoute>
              <Amenities />
            </ProtectedRoute>
          } />
          
          <Route path="/polls" element={
            <ProtectedRoute>
              <Polls />
            </ProtectedRoute>
          } />
          
          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
          
          <Route path="/visitors" element={
            <ProtectedRoute>
              <Visitors />
            </ProtectedRoute>
          } />
          
          <Route path="/visitors/verify" element={
            <ProtectedRoute>
              <VerifyVisitor />
            </ProtectedRoute>
          } />
          
          <Route path="/announcements" element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          } />
          
          <Route path="/complaints" element={
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          } />
          
          <Route path="/gamification" element={
            <ProtectedRoute>
              <Gamification />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/bookings" element={
            <ProtectedRoute adminOnly>
              <AdminBookings />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/polls" element={
            <ProtectedRoute adminOnly>
              <AdminPolls />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/announcements" element={
            <ProtectedRoute adminOnly>
              <AdminAnnouncements />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/complaints" element={
            <ProtectedRoute adminOnly>
              <AdminComplaints />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/payments" element={
            <ProtectedRoute adminOnly>
              <AdminPayments />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
