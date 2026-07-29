import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { Calendar, Film, Info, ArrowLeft } from 'lucide-react';

const BookTickets = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState([]);

  // Generate 7 days dynamically starting today
  useEffect(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const generatedDates = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateNum = String(d.getDate()).padStart(2, '0');

      generatedDates.push({
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${d.getDate()} ${monthNames[d.getMonth()]}`,
        dateStr: `${year}-${month}-${dateNum}`,
        dayName: dayNames[d.getDay()],
        dateNum: d.getDate()
      });
    }

    setDates(generatedDates);
    if (generatedDates.length > 0) {
      setSelectedDate(generatedDates[0].dateStr); // Default to today
    }
  }, []);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/api/movies/${movieId}`);
        setMovie(res.data);
      } catch (err) {
        console.error('Failed to load movie details:', err);
      }
    };
    fetchMovie();
  }, [movieId]);

  // Fetch shows when date changes
  useEffect(() => {
    if (selectedDate && movieId) {
      const fetchShows = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/api/shows?movieId=${movieId}&date=${selectedDate}`);
          setShows(res.data);
        } catch (err) {
          console.error('Failed to load shows:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchShows();
    }
  }, [selectedDate, movieId]);

  // Group shows by Screen
  const groupShowsByScreen = () => {
    const grouped = {};
    shows.forEach(show => {
      if (show.screenId) {
        const screenId = show.screenId._id.toString();
        if (!grouped[screenId]) {
          grouped[screenId] = {
            screen: show.screenId,
            showsList: []
          };
        }
        grouped[screenId].showsList.push(show);
      }
    });
    return Object.values(grouped);
  };

  // Determine Showtime Occupancy Status
  const getShowtimeStatus = (show) => {
    if (!show.screenId) return 'available';
    const capacity = show.screenId.rows * show.screenId.cols;
    const booked = show.bookedSeats.length;
    
    if (booked >= capacity) return 'soldout';
    if (booked >= capacity * 0.9) return 'full';
    if (booked >= capacity * 0.4) return 'filling';
    return 'available';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'soldout': return 'showtime-status-soldout';
      case 'full': return 'showtime-status-full';
      case 'filling': return 'showtime-status-filling';
      default: return 'showtime-status-available';
    }
  };

  const handleShowtimeClick = (show) => {
    const status = getShowtimeStatus(show);
    if (status === 'soldout') return;
    navigate(`/seats/${show._id}`);
  };

  const groupedScreens = groupShowsByScreen();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        {/* Back Link */}
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '20px', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Movie Details
        </button>

        {movie && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{movie.title}</h2>
            <span className="badge badge-normal">{movie.language}</span>
            <span className="badge badge-important" style={{ background: 'rgba(229, 184, 59, 0.1)', border: '1px solid rgba(229, 184, 59, 0.2)', color: 'var(--primary)' }}>
              {movie.certificate}
            </span>
          </div>
        )}

        {/* Date Selector */}
        <div className="date-selector-row">
          {dates.map((d, idx) => (
            <div 
              key={idx} 
              className={`date-pill ${selectedDate === d.dateStr ? 'active' : ''}`}
              onClick={() => setSelectedDate(d.dateStr)}
            >
              <span className="date-day">{d.dayName}</span>
              <span className="date-num">{d.dateNum}</span>
            </div>
          ))}
        </div>

        {/* Availability indicators legends */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)' }}></span> Available
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--warning)' }}></span> Filling Fast
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger)' }}></span> Almost Full
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-muted)' }}></span> Sold Out
          </span>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', marginBottom: '30px' }} />

        {/* Screens & Showtimes list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1, 2].map(n => (
              <div key={n} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }}></div>
            ))}
          </div>
        ) : groupedScreens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <Info size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h4 style={{ color: '#ffffff', marginBottom: '8px' }}>No Shows Scheduled</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>There are no showtimes scheduled for this movie on the selected date.</p>
          </div>
        ) : (
          <div className="screen-shows-container">
            {groupedScreens.map(({ screen, showsList }) => (
              <div key={screen._id} className="screen-show-row">
                <div className="screen-details-side">
                  <span className="screen-name-label">{screen.name}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                    {screen.type}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Dolby Atmos Sound & 4K Laser Projection
                  </span>
                </div>
                <div className="showtimes-grid">
                  {showsList.map(show => {
                    const status = getShowtimeStatus(show);
                    return (
                      <div 
                        key={show._id} 
                        className={`showtime-pill ${getStatusClass(status)}`}
                        onClick={() => handleShowtimeClick(show)}
                      >
                        <span style={{ fontSize: '1.05rem' }}>{show.time}</span>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' }}>
                          {status === 'soldout' ? 'Sold Out' : status === 'full' ? 'Almost Full' : status === 'filling' ? 'Filling Fast' : 'Available'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookTickets;
