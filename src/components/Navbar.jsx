import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Search, User, LogOut, Ticket, Settings, Film, Percent, Pizza, Compass } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar">
        {/* Brand Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <Film size={24} style={{ color: 'var(--primary)' }} />
          <span>Mall <span style={{ color: '#ffffff' }}>CineBook</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links" style={{ display: 'none' }}>
          {/* Note: Managed below via media queries, we define CSS or helper styles */}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="nav-right-desktop">
          {/* Navigation Items (Hidden on mobile) */}
          <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/?status=Now Showing" className={`nav-link ${isActive('/now-showing') ? 'active' : ''}`}>Now Showing</Link>
            <Link to="/?status=Coming Soon" className={`nav-link ${isActive('/coming-soon') ? 'active' : ''}`}>Coming Soon</Link>
            <Link to="/offers" className={`nav-link ${isActive('/offers') ? 'active' : ''}`}>Offers</Link>
            <Link to="/food" className={`nav-link ${isActive('/food') ? 'active' : ''}`}>Food & Beverages</Link>
            {user && (
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>My Bookings</Link>
            )}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="nav-search-bar">
            <Search size={16} style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
            />
          </form>

          {/* Auth Actions */}
          <div className="nav-auth-actions">
            {user ? (
              <div className="profile-drop-container">
                <div 
                  className="profile-drop-trigger" 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    border: '1.5px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <User size={18} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#ffffff' }} className="nav-username">{user.name.split(' ')[0]}</span>
                </div>

                {profileDropdownOpen && (
                  <div className="profile-dropdown">
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                    
                    <Link to="/profile" className="profile-dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                      <Ticket size={16} />
                      My Bookings
                    </Link>

                    {user.role === 'admin' && (
                      <Link to="/admin" className="profile-dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                        <Settings size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <button 
                      onClick={handleLogout} 
                      className="profile-dropdown-item" 
                      style={{ width: '100%', textLeft: 'left', background: 'none', border: 'none', color: 'var(--secondary-accent)' }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button 
          className="mobile-hamburger" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--navbar-height)',
          left: 0, right: 0, bottom: 0,
          background: 'rgba(7, 8, 10, 0.98)',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }} className="mobile-drawer-open animate-fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/" className="nav-link" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/?status=Now Showing" className="nav-link" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Now Showing</Link>
            <Link to="/?status=Coming Soon" className="nav-link" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Coming Soon</Link>
            <Link to="/offers" className="nav-link" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Offers</Link>
            <Link to="/food" className="nav-link" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Food & Beverages</Link>
            {user && (
              <Link to="/profile" className="nav-link" style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="nav-link" style={{ fontSize: '1.2rem', color: 'var(--primary)' }} onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#ffffff' }}>{user.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-danger"
                  style={{ alignSelf: 'flex-start' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Navbar Responsive Styles Inline for exact layout control */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-links, .nav-auth-actions, .nav-username, .nav-search-bar {
            display: none !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
