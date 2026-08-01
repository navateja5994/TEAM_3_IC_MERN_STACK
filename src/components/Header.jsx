import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles } from 'lucide-react';

export default function Header({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: "Home", value: "All" },
    { name: "Men's Wear", value: "Men's Wear" },
    { name: "Women's Wear", value: "Women's Wear" },
    { name: "Kids Wear", value: "Kids Wear" }
  ];

  const handleNavClick = (value) => {
    onSelectCategory(value);
    setMobileMenuOpen(false);
    // Smooth scroll to products section if not on top
    const gridEl = document.getElementById('products-section');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header-sticky">
      <div className="container" style={{ padding: '0.85rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick("All")} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF8833 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)'
            }}>
              <ShoppingBag size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                color: '#111827', 
                letterSpacing: '-0.03em',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Dress<span style={{ color: 'var(--primary)' }}>ify</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: '-4px' }}>
                FASHION STUDIO
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleNavClick(cat.value)}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                    position: 'relative',
                    padding: '0.4rem 0',
                    transition: 'var(--transition)'
                  }}
                >
                  {cat.name}
                  {isActive && (
                    <span 
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '3px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Bar & Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '420px', justifyContent: 'flex-end' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '260px' }}>
              <Search 
                size={18} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem 0.6rem 2.4rem',
                  fontSize: '0.875rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-secondary)',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Wishlist Icon */}
            <button 
              className="btn-icon"
              onClick={onOpenWishlist}
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={20} color={wishlistCount > 0 ? "var(--primary)" : "currentColor"} fill={wishlistCount > 0 ? "var(--primary)" : "none"} />
              {wishlistCount > 0 && (
                <span className="badge-count">{wishlistCount}</span>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              className="btn-icon"
              onClick={onOpenCart}
              title="View Cart"
              aria-label="Cart"
              style={{
                backgroundColor: cartCount > 0 ? 'var(--primary-light)' : '#FFFFFF',
                borderColor: cartCount > 0 ? 'var(--primary)' : 'var(--border-light)',
                color: cartCount > 0 ? 'var(--primary)' : 'var(--text-main)'
              }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="badge-count">{cartCount}</span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', padding: '0.4rem', color: 'var(--text-main)' }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div 
            style={{
              paddingTop: '1rem',
              paddingBottom: '0.5rem',
              borderTop: '1px solid var(--border-light)',
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleNavClick(cat.value)}
                style={{
                  textAlign: 'left',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: selectedCategory === cat.value ? '700' : '500',
                  backgroundColor: selectedCategory === cat.value ? 'var(--primary-light)' : 'transparent',
                  color: selectedCategory === cat.value ? 'var(--primary)' : 'var(--text-main)'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
