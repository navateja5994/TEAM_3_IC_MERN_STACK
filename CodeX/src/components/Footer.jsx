import React from 'react';
import { Link } from 'react-router-dom';
import { RiMovie2Line, RiFacebookCircleFill, RiTwitterFill, RiInstagramFill, RiYoutubeFill } from 'react-icons/ri';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <RiMovie2Line className="footer-logo-icon" />
            <span>MALL <span className="gold-text">CINEBOOK</span></span>
          </Link>
          <p className="footer-desc">
            Experience cinema like never before in luxury and comfort. Book premium reclining seats, gourmet snacks, and enjoy the latest releases in high definition audio and visual setups.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><RiFacebookCircleFill /></a>
            <a href="#" aria-label="Twitter"><RiTwitterFill /></a>
            <a href="#" aria-label="Instagram"><RiInstagramFill /></a>
            <a href="#" aria-label="Youtube"><RiYoutubeFill /></a>
          </div>
        </div>

        <div className="footer-nav">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/movies">Now Showing</Link>
          <Link to="/movies">Coming Soon</Link>
          <Link to="/offers">Special Offers</Link>
          <Link to="/food">Food & Drinks</Link>
        </div>

        <div className="footer-legal">
          <h4>Quick Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <Link to="/profile">My Bookings</Link>
          <a href="#">Refund Policy</a>
        </div>

        <div className="footer-newsletter">
          <h4>Subscribe</h4>
          <p>Get exclusive discounts, early previews, and food deals delivered straight to your inbox.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit" className="btn-primary">Join</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Mall CineBook. All rights reserved.</p>
          <p>Made with ❤️ for cinematic lovers.</p>
        </div>
      </div>
    </footer>
  );
}
