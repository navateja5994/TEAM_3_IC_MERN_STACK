import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiStarFill, RiTimeLine } from 'react-icons/ri';
import { useBooking } from '../context/BookingContext';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  const { selectMovie } = useBooking();
  const navigate = useNavigate();

  const handleBookClick = (e) => {
    e.stopPropagation(); // prevent card click navigation
    selectMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card glass-card" onClick={() => { selectMovie(movie); navigate(`/movie/${movie.id}`); }}>
      <div className="poster-container">
        <img src={movie.poster} alt={movie.title} className="movie-poster" />
        <div className="poster-overlay">
          {movie.status === 'now-showing' ? (
            <button className="btn-primary book-btn" onClick={handleBookClick}>
              Book Tickets
            </button>
          ) : (
            <span className="coming-soon-badge">Coming Soon</span>
          )}
        </div>
        {movie.userRating > 0 && (
          <div className="rating-badge">
            <RiStarFill className="star-icon" />
            <span>{movie.userRating}</span>
          </div>
        )}
      </div>
      <div className="movie-card-info">
        <div className="movie-meta-top">
          <span className="movie-lang">{movie.language}</span>
          {movie.formats && (
            <div className="format-badges">
              {movie.formats.slice(0, 2).map(f => (
                <span key={f} className="format-badge">{f}</span>
              ))}
            </div>
          )}
        </div>
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genres">{movie.genre.join(', ')}</p>
        <div className="movie-meta-bottom">
          <span className="movie-rating-badge">{movie.rating}</span>
          <span className="movie-duration">
            <RiTimeLine /> {movie.duration}
          </span>
        </div>
      </div>
    </div>
  );
}
