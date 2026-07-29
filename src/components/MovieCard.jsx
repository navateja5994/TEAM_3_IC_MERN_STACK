import React from 'react';
import { Star, Clock, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie._id}`);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    navigate(`/book/${movie._id}`);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      {/* Rating badge */}
      <div className="movie-rating-badge">
        <Star size={14} fill="var(--primary)" style={{ stroke: 'none' }} />
        <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
      </div>

      <div className="movie-poster-wrap">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="movie-poster"
          loading="lazy"
        />
        
        {/* Hover overlay */}
        <div className="movie-poster-overlay">
          <button 
            onClick={handleBookClick} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
          >
            <Ticket size={16} />
            Book Tickets
          </button>
        </div>
      </div>

      {/* Info panel */}
      <div className="movie-card-info">
        <h4 className="movie-card-title" title={movie.title}>{movie.title}</h4>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            {movie.certificate}
          </span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            {movie.language}
          </span>
          {movie.formats && movie.formats.slice(0, 2).map((fmt, idx) => (
            <span key={idx} style={{ fontSize: '0.7rem', background: 'rgba(229, 184, 59, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(229, 184, 59, 0.2)', color: 'var(--primary)', fontWeight: 'bold' }}>
              {fmt}
            </span>
          ))}
        </div>

        <div className="movie-card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} />
            {movie.duration} mins
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {movie.genres ? movie.genres.slice(0, 2).join(', ') : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
