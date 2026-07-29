import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TrailerModal from '../components/TrailerModal';
import api from '../api/axios';
import { Star, Clock, Ticket, Play, Calendar, User, Shield } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}></div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="skeleton" style={{ width: '200px', height: '300px', borderRadius: 'var(--radius-md)' }}></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="skeleton" style={{ height: '40px', width: '60%' }}></div>
              <div className="skeleton" style={{ height: '20px', width: '40%' }}></div>
              <div className="skeleton" style={{ height: '100px', width: '100%' }}></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <h3>Movie details could not be found.</h3>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBookTickets = () => {
    navigate(`/book/${movie._id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Backdrop Image Banner */}
      <div 
        className="detail-backdrop-banner"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="detail-backdrop-overlay" />
      </div>

      {/* Main Details block */}
      <div className="detail-main-layout">
        {/* Left Column: Poster */}
        <div>
          <div className="detail-poster-card">
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
          {movie.status !== 'Coming Soon' && (
            <button 
              onClick={handleBookTickets} 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px', padding: '14px' }}
            >
              <Ticket size={20} /> Book Tickets
            </button>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="detail-info-block">
          <h1 className="detail-title">{movie.title}</h1>
          
          {/* Metadata badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <span className="badge badge-urgent" style={{ background: 'rgba(229, 184, 59, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
              <Star size={14} fill="var(--primary)" style={{ stroke: 'none' }} />
              {movie.rating.toFixed(1)} ({movie.numRatings} votes)
            </span>
            <span className="badge badge-normal" style={{ gap: '6px' }}>
              <Clock size={14} /> {movie.duration} mins
            </span>
            <span className="badge badge-normal" style={{ gap: '6px' }}>
              <Shield size={14} /> {movie.certificate}
            </span>
            <span className="badge badge-normal">
              {movie.language}
            </span>
            {movie.formats.map((fmt, idx) => (
              <span key={idx} className="badge badge-important" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                {fmt}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Calendar size={16} /> Release Date: {new Date(movie.releaseDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {movie.trailerUrl && (
              <button 
                onClick={() => setTrailerOpen(true)} 
                className="btn btn-secondary"
                style={{ padding: '8px 16px', textTransform: 'none', fontSize: '0.85rem' }}
              >
                <Play size={14} fill="#ffffff" /> Play Trailer
              </button>
            )}
          </div>

          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '8px', fontSize: '1.1rem' }}>Synopsis</h4>
            <p className="detail-synopsis">{movie.description}</p>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '30px 0' }} />

          {/* Cast list */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="detail-cast-crew">
              <h4 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '1.2rem' }}>Cast Members</h4>
              <div className="cast-grid">
                {movie.cast.map((c, idx) => (
                  <div key={idx} className="cast-member-card">
                    <div className="cast-member-avatar">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt={c.name} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                          <User size={30} style={{ color: 'var(--text-muted)' }} />
                        </div>
                      )}
                    </div>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={c.name}>{c.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={c.character}>{c.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crew list */}
          {movie.crew && movie.crew.length > 0 && (
            <div className="detail-cast-crew" style={{ marginTop: '30px' }}>
              <h4 style={{ color: '#ffffff', marginBottom: '12px', fontSize: '1.1rem' }}>Crew Members</h4>
              <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                {movie.crew.map((cr, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>{cr.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cr.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trailer modal popup */}
      {trailerOpen && (
        <TrailerModal 
          trailerUrl={movie.trailerUrl} 
          onClose={() => setTrailerOpen(false)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default MovieDetails;
