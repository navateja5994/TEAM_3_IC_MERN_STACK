import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Ticket, Lock, Mail, Phone, Calendar, MapPin, Printer } from 'lucide-react';

const Profile = () => {
  const { user, reloadProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateErr, setUpdateErr] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await api.get('/api/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load booking history:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMsg('');
    setUpdateErr('');

    try {
      await api.put('/api/auth/profile', { name, email, phoneNumber });
      await reloadProfile();
      setUpdateMsg('Profile updated successfully.');
    } catch (err) {
      setUpdateErr(err.response?.data?.error || 'Profile update failed.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will release your reserved seats immediately.')) {
      return;
    }

    try {
      await api.post(`/api/bookings/${bookingId}/cancel`);
      alert('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Cancellation failed.');
    }
  };

  const filterBookings = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    return bookings.filter(b => {
      const show = b.showId;
      if (!show) return false;
      const isCancelled = b.bookingStatus === 'Cancelled';

      if (activeTab === 'cancelled') {
        return isCancelled;
      }
      
      const isUpcoming = show.date >= todayStr;
      if (activeTab === 'upcoming') {
        return isUpcoming && !isCancelled;
      }
      
      // Past tab
      return !isUpcoming && !isCancelled;
    });
  };

  const filteredList = filterBookings();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '40px 0' }}>
        <div className="profile-layout">
          {/* Left Column: Edit Profile */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} style={{ color: 'var(--primary)' }} /> Profile Settings
            </h3>
            
            {updateMsg && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '12px' }}>{updateMsg}</p>}
            {updateErr && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '12px' }}>{updateErr}</p>}

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="input-field" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="input-field" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  required 
                  className="input-field" 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Save Changes
              </button>
            </form>
          </div>

          {/* Right Column: Booking History tabs */}
          <div>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <button 
                onClick={() => setActiveTab('upcoming')}
                style={{
                  background: 'none', border: 'none', padding: '12px 24px', fontWeight: 'bold', fontSize: '1rem',
                  color: activeTab === 'upcoming' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'upcoming' ? '3px solid var(--primary)' : 'none', cursor: 'pointer'
                }}
              >
                Upcoming Shows
              </button>
              <button 
                onClick={() => setActiveTab('past')}
                style={{
                  background: 'none', border: 'none', padding: '12px 24px', fontWeight: 'bold', fontSize: '1rem',
                  color: activeTab === 'past' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'past' ? '3px solid var(--primary)' : 'none', cursor: 'pointer'
                }}
              >
                Past Bookings
              </button>
              <button 
                onClick={() => setActiveTab('cancelled')}
                style={{
                  background: 'none', border: 'none', padding: '12px 24px', fontWeight: 'bold', fontSize: '1rem',
                  color: activeTab === 'cancelled' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'cancelled' ? '3px solid var(--primary)' : 'none', cursor: 'pointer'
                }}
              >
                Cancelled Bookings
              </button>
            </div>

            {loadingBookings ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2].map(n => (
                  <div key={n} className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-lg)' }}></div>
                ))}
              </div>
            ) : filteredList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', color: 'var(--text-secondary)' }}>
                No bookings found in this category.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredList.map(booking => {
                  const show = booking.showId;
                  const movie = show.movieId;
                  const screen = show.screenId;
                  
                  return (
                    <div key={booking._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title} 
                          style={{ width: '70px', height: '105px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <h4 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800 }}>{movie.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>{screen.type} • {movie.language}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} /> {show.date} | {show.time}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={12} /> {screen.name} • Seats: {booking.seats.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payable Bill</p>
                          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>₹{booking.totalAmount}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          {booking.bookingStatus !== 'Cancelled' && (
                            <button 
                              onClick={() => navigate(`/ticket/${booking._id}`)} 
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', textTransform: 'none' }}
                            >
                              <Printer size={12} /> View Ticket
                            </button>
                          )}
                          
                          {activeTab === 'upcoming' && booking.bookingStatus !== 'Cancelled' && (
                            <button 
                              onClick={() => handleCancelBooking(booking._id)} 
                              className="btn btn-danger"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', textTransform: 'none' }}
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
