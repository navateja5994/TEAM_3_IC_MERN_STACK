import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { ArrowLeft, Ticket, Calendar, Clock, MapPin, Printer, Download, Film } from 'lucide-react';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        console.error('Failed to load booking ticket details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Simulating ticket download... Saving PDF structure to local disk.');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div className="flex-center" style={{ flex: 1, padding: '40px' }}>
          <div className="skeleton" style={{ width: '400px', height: '500px', borderRadius: 'var(--radius-lg)' }}></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <h3>Ticket details not found.</h3>
        </div>
        <Footer />
      </div>
    );
  }

  const show = booking.showId;
  const movie = show.movieId;
  const screen = show.screenId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '40px 24px', width: '100%' }} className="print-area-container">
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* Back button */}
          <button 
            onClick={() => navigate('/profile')} 
            className="no-print"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '20px', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Back to My Bookings
          </button>

          {/* Ticket layout */}
          <div className="ticket-stub ticket-stub-horizontal" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            {/* Header info */}
            <div style={{ padding: '24px 24px 12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                <Film size={20} />
                <span style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Mall CineBook</span>
              </div>
              <span className="badge badge-success" style={{ background: 'var(--success-light)', color: 'var(--success)', fontWeight: 'bold' }}>
                CONFIRMED
              </span>
            </div>

            {/* Ticket movie info */}
            <div style={{ padding: '0 24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                style={{ width: '70px', height: '100px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>{movie.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>{screen.type} • {movie.language}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {booking.bookingId}</p>
              </div>
            </div>

            {/* Dashed line */}
            <div className="ticket-stub-divider" />

            {/* Ticket core show details */}
            <div style={{ padding: '0 24px 16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Date</span>
                <span style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} style={{ color: 'var(--primary)' }} /> {show.date}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Time</span>
                <span style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} style={{ color: 'var(--primary)' }} /> {show.time}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Screen</span>
                <span style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} style={{ color: 'var(--primary)' }} /> {screen.name}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Seats</span>
                <span style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Ticket size={14} style={{ color: 'var(--primary)' }} /> {booking.seats.join(', ')}
                </span>
              </div>
            </div>

            {/* Food concessions sublist if any */}
            {booking.foodItems && booking.foodItems.length > 0 && (
              <div style={{ padding: '0 24px 16px 24px', borderTop: '1px dashed var(--border-color)', paddingTop: '16px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Food Orders</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {booking.foodItems.map((item, idx) => (
                    <span key={idx} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {item.name} (x{item.quantity})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Summary banner */}
            <div style={{ padding: '16px 24px', background: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Amount Paid</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{booking.totalAmount}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Payment Mode</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textAlign: 'right' }}>Mock Gateway</p>
              </div>
            </div>

            {/* QR Code presentation */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: '#ffffff', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
              {booking.qrCodeUrl && (
                <img 
                  src={booking.qrCodeUrl} 
                  alt="Ticket QR Code" 
                  style={{ width: '130px', height: '130px' }}
                />
              )}
              <span style={{ fontSize: '0.75rem', color: '#111827', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                SCAN AT CINEMA ENTRANCE
              </span>
            </div>
          </div>

          {/* Action buttons (Print/Download) */}
          <div className="no-print" style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button 
              onClick={handlePrint}
              className="btn btn-secondary" 
              style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              <Printer size={18} /> Print Ticket
            </button>
            <button 
              onClick={handleDownload}
              className="btn btn-primary" 
              style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print, header, footer, .navbar-wrapper, .footer-wrap {
            display: none !important;
          }
          body, .landing-container, .print-area-container {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .ticket-stub {
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .ticket-stub * {
            color: #000000 !important;
          }
          .ticket-stub-divider {
            border-color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TicketDetails;
