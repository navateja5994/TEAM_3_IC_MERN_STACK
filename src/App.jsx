import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Protected Route wrapper helper
import ProtectedRoute from './components/ProtectedRoute';

// Public Page views
import Landing from './pages/Landing';
import MovieDetails from './pages/MovieDetails';
import BookTickets from './pages/BookTickets';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Page views (requires login)
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import TicketDetails from './pages/TicketDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Movie Browsing Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/book/:movieId" element={<BookTickets />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Booking Flow & Customer Area */}
            <Route path="/seats/:showId" element={<ProtectedRoute><SeatSelection /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/ticket/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Protected Admin Only Route */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
