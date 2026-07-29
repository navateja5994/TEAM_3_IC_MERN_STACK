import React from 'react';
import { Film, MapPin, Compass, Car, Pizza, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-wrap">
      <div className="footer-content">
        {/* Mall CineBook Details */}
        <div className="footer-section">
          <h3 className="footer-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={20} /> Mall CineBook
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Premium cinema experience at the heart of the city's favorite shopping destination. Watch your favorite movies in unparalleled luxury.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} style={{ color: 'var(--primary)' }} />
              Level 4, The Grand Galleria Mall, Outer Ring Road, Bangalore
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={16} style={{ color: 'var(--primary)' }} />
              Floor: East Wing, Next to the Food Court
            </p>
          </div>
        </div>

        {/* Cinema Venues Specs */}
        <div className="footer-section">
          <h4 className="footer-title">CineBook Cinemas Info</h4>
          <ul className="footer-links" style={{ listStyle: 'none' }}>
            <li>• <strong>Screens:</strong> 3 State-of-the-art screens</li>
            <li>• <strong>Projection:</strong> RealD 3D & 4K Barco Laser Projectors</li>
            <li>• <strong>Sound:</strong> Dolby Atmos® Spatial Sound System</li>
            <li>• <strong>Total Capacity:</strong> 450 Luxury Seats</li>
          </ul>
        </div>

        {/* Mall Facilities */}
        <div className="footer-section">
          <h4 className="footer-title">Mall Facilities</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={16} style={{ color: 'var(--primary)' }} />
              <strong>Valet Parking:</strong> Levels B1 & B2 (CineBook coupon gets 3 hours free)
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pizza size={16} style={{ color: 'var(--primary)' }} />
              <strong>Food Delivery:</strong> Order popcorn/nachos directly to your seat during showtime
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} style={{ color: 'var(--primary)' }} />
              <strong>Premium Recliners:</strong> Extra wide recliners with USB charging ports
            </p>
          </div>
        </div>

        {/* Navigation / Policy Links */}
        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <div className="footer-links">
            <Link to="/" className="footer-link">Now Showing</Link>
            <Link to="/offers" className="footer-link">Special Offers</Link>
            <Link to="/food" className="footer-link">Concessions Stand Menu</Link>
            <a href="#privacy" className="footer-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#terms" className="footer-link" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mall CineBook Cinemas Ltd. All rights reserved. Created for premium entertainment.</p>
      </div>
    </footer>
  );
};

export default Footer;
