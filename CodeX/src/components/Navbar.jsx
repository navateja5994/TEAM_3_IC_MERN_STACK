import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RiMovie2Line, RiMenu3Fill, RiCloseFill, RiUser3Line, RiSearchLine } from 'react-icons/ri';
import { useBooking } from '../context/BookingContext';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar-container">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo" onClick={() => setIsOpen(false)}>
          <RiMovie2Line className="brand-icon" />
          <span>MALL <span className="gold-text">CINEBOOK</span></span>
        </Link>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-form-desktop">
          <input
            type="text"
            placeholder="Search movies, genres, languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <RiSearchLine />
          </button>
        </form>

        {/* Desktop Links */}
        <div className="navbar-links-desktop">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/movies" className={`nav-link ${isActive('/movies')}`}>Movies</Link>
          <Link to="/offers" className={`nav-link ${isActive('/offers')}`}>Offers</Link>
          <Link to="/food" className={`nav-link ${isActive('/food')}`}>Food & Drinks</Link>
          <Link to="/profile" className="profile-badge-btn">
            <img src={user.avatar} alt={user.name} className="user-avatar-sm" />
            <span className="user-name-sm">{user.name.split(' ')[0]}</span>
          </Link>
        </div>

        {/* Hamburger Icon */}
        <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
          {isOpen ? <RiCloseFill /> : <RiMenu3Fill />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-drawer glass-panel fade-in">
          <form onSubmit={handleSearchSubmit} className="search-form-mobile">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <RiSearchLine />
            </button>
          </form>

          <Link to="/" className={`mobile-nav-link ${isActive('/')}`} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/movies" className={`mobile-nav-link ${isActive('/movies')}`} onClick={() => setIsOpen(false)}>Movies</Link>
          <Link to="/offers" className={`mobile-nav-link ${isActive('/offers')}`} onClick={() => setIsOpen(false)}>Offers</Link>
          <Link to="/food" className={`mobile-nav-link ${isActive('/food')}`} onClick={() => setIsOpen(false)}>Food & Drinks</Link>
          <Link to="/profile" className="mobile-profile-link" onClick={() => setIsOpen(false)}>
            <img src={user.avatar} alt={user.name} className="user-avatar-sm" />
            <span>My Profile</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
