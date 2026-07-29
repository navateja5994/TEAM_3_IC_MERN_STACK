import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';
import api from '../api/axios';
import { Star, Clock, Ticket, Play, Sparkles, Film, Heart } from 'lucide-react';

const Landing = () => {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTrailer, setActiveTrailer] = useState(null);

  // Parse search queries
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const filterStatus = queryParams.get('status') || '';

  const languages = ['All Languages', 'Telugu', 'Tamil', 'Hindi', 'English', 'Kannada', 'Malayalam'];

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/movies');
        setMovies(res.data);
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Automatic Banner slide timer
  const featuredMovies = movies.filter(m => m.status === 'Featured' || m.status === 'Now Showing').slice(0, 4);

  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setActiveSlide(prev => (prev + 1) % featuredMovies.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

  // Filters application
  const filteredMovies = movies.filter(movie => {
    // Language filter
    const matchesLang = selectedLanguage === 'All Languages' || movie.language === selectedLanguage;
    // Status filter (from URL query)
    const matchesStatus = !filterStatus || movie.status === filterStatus;
    // Search query filter
    const matchesSearch = !searchQuery || movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || movie.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLang && matchesStatus && matchesSearch;
  });

  const nowShowingList = filteredMovies.filter(m => m.status === 'Now Showing' || m.status === 'Featured');
  const comingSoonList = filteredMovies.filter(m => m.status === 'Coming Soon');

  return (
    <div className="landing-container">
      <Navbar />

      {/* Hero Banner Slider */}
      {!loading && featuredMovies.length > 0 && (
        <div className="hero-slider">
          {featuredMovies.map((movie, idx) => (
            <div 
              key={movie._id} 
              className={`hero-slide ${idx === activeSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${movie.backdropUrl})` }}
            >
              <div className="hero-slide-backdrop" />
              <div className="hero-slide-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-urgent" style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                    <Sparkles size={12} fill="var(--primary)" /> FEATURED SHOW
                  </span>
                  <span className="badge badge-normal">{movie.certificate}</span>
                </div>
                <h1 className="hero-title">{movie.title}</h1>
                <div className="hero-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--primary)' }}>
                    <Star size={14} fill="var(--primary)" style={{ stroke: 'none' }} />
                    {movie.rating.toFixed(1)} / 10
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                    <Clock size={14} />
                    {movie.duration} mins
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {movie.language} • {movie.genres.join(', ')}
                  </span>
                </div>
                <p className="hero-desc">{movie.description}</p>
                <div className="hero-buttons">
                  <a href={`/book/${movie._id}`} className="btn btn-primary">
                    <Ticket size={18} /> Book Tickets
                  </a>
                  {movie.trailerUrl && (
                    <button onClick={() => setActiveTrailer(movie.trailerUrl)} className="btn btn-glass">
                      <Play size={18} fill="#ffffff" /> Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="hero-controls">
            {featuredMovies.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveSlide(idx)}
                style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: idx === activeSlide ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Language Filter capsules */}
      <div className="language-section">
        <h3 className="section-title">
          <Film size={20} style={{ color: 'var(--primary)' }} />
          Filter by Language
        </h3>
        <div className="language-pills">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`lang-pill ${selectedLanguage === lang ? 'active' : ''}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Now Showing Section */}
      <div className="language-section" style={{ marginBottom: '60px' }}>
        <h3 className="section-title">
          <Heart size={20} style={{ color: 'var(--secondary-accent)' }} />
          Now Showing
        </h3>
        
        {loading ? (
          <div className="movies-grid">
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="skeleton" style={{ aspectRatio: '2/3', width: '100%' }}></div>
                <div className="skeleton" style={{ height: '20px', width: '80%' }}></div>
                <div className="skeleton" style={{ height: '15px', width: '50%' }}></div>
              </div>
            ))}
          </div>
        ) : nowShowingList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', color: 'var(--text-secondary)' }}>
            No movies currently running match your criteria.
          </div>
        ) : (
          <div className="movies-grid">
            {nowShowingList.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Coming Soon Section */}
      {!loading && comingSoonList.length > 0 && (
        <div className="language-section" style={{ marginBottom: '60px' }}>
          <h3 className="section-title">
            <Sparkles size={20} style={{ color: 'var(--primary)' }} />
            Coming Soon
          </h3>
          <div className="movies-grid">
            {comingSoonList.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* Mall Cinema Info details */}
      <div className="language-section" style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>
              Grand Galleria CineBook Mall Cinema
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Located in the premium Grand Galleria Shopping Mall, Mall CineBook Cinemas features the ultimate cinematic environment. We combine state-of-the-art projection technology with ultra-plush seating, making us the premier movie destination. Enjoy a day of shopping and top-tier entertainment all in one place.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h5 style={{ fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Location</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>4th Floor, East Wing, Grand Galleria Mall</p>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h5 style={{ fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>3 Screens</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dolby Atmos Surround Audio & Laser Projection</p>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h5 style={{ fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Parking Coupon</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Free 3-Hour Valet Parking coupon with every ticket</p>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h5 style={{ fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Accessibility</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Wheelchair access ramps & designated theater spaces</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer modal popup */}
      {activeTrailer && (
        <TrailerModal 
          trailerUrl={activeTrailer} 
          onClose={() => setActiveTrailer(null)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default Landing;
