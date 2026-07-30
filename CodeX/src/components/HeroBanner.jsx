import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiPlayCircleLine, RiTicket2Line, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useBooking } from '../context/BookingContext';
import './HeroBanner.css';

export default function HeroBanner({ movies }) {
  const [current, setCurrent] = useState(0);
  const { selectMovie } = useBooking();
  const navigate = useNavigate();

  // Get trending or select now-showing movies for slider
  const sliderMovies = movies.filter(m => m.isTrending || m.status === 'now-showing').slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === sliderMovies.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderMovies.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? sliderMovies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === sliderMovies.length - 1 ? 0 : prev + 1));
  };

  if (!sliderMovies.length) return null;

  const currentMovie = sliderMovies[current];

  const handleBookClick = () => {
    selectMovie(currentMovie);
    navigate(`/movie/${currentMovie.id}`);
  };

  return (
    <div className="hero-banner">
      <div 
        className="hero-backdrop"
        style={{ backgroundImage: `url(${currentMovie.backdrop})` }}
      />
      <div className="hero-overlay" />
      
      <div className="container hero-content-wrapper">
        <div className="hero-content fade-in" key={currentMovie.id}>
          <div className="hero-badges">
            <span className="hero-badge rating">{currentMovie.rating}</span>
            <span className="hero-badge lang">{currentMovie.language}</span>
            <span className="hero-badge format">{currentMovie.formats.join(' / ')}</span>
          </div>
          <h1 className="hero-title">{currentMovie.title}</h1>
          <p className="hero-genres">{currentMovie.genre.join(' • ')}</p>
          <p className="hero-desc">{currentMovie.description}</p>
          
          <div className="hero-actions">
            <button className="btn-primary hero-btn" onClick={handleBookClick}>
              <RiTicket2Line /> Book Tickets
            </button>
            <button 
              className="btn-secondary hero-btn" 
              onClick={() => {
                selectMovie(currentMovie);
                navigate(`/movie/${currentMovie.id}?playTrailer=true`);
              }}
            >
              <RiPlayCircleLine /> Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <button className="slider-arrow left" onClick={handlePrev} aria-label="Previous slide">
        <RiArrowLeftSLine />
      </button>
      <button className="slider-arrow right" onClick={handleNext} aria-label="Next slide">
        <RiArrowRightSLine />
      </button>

      {/* Dots Indicator */}
      <div className="slider-dots">
        {sliderMovies.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
