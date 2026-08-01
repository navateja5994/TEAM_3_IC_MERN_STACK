import React, { useState } from 'react';
import { ShoppingBag, Send, Heart, CheckCircle2, Share2, Globe, MessageCircle } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = (category = "All") => {
    if (category) onSelectCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: '#111827',
      color: '#FFFFFF',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      marginTop: '3rem',
      borderTop: '4px solid var(--primary)'
    }}>
      <div className="container">
        
        {/* Main 4-Column Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid #1F2937'
        }}>

          {/* Column 1: Brand Info */}
          <div>
            <div 
              onClick={() => scrollToTop("All")}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.25rem' }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8833 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <ShoppingBag size={20} strokeWidth={2.5} />
              </div>
              <span style={{ 
                fontSize: '1.4rem', 
                fontWeight: '800', 
                color: '#FFFFFF', 
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Dress<span style={{ color: 'var(--primary)' }}>ify</span>
              </span>
            </div>

            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your ultimate online fashion destination for Men, Women & Kids. Curating trendsetting styles, premium fabrics, and unmatched comfort.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: <Globe size={18} />, label: "Website" },
                { icon: <Share2 size={18} />, label: "Social" },
                { icon: <MessageCircle size={18} />, label: "Community" }
              ].map((s, idx) => (
                <a
                  key={idx}
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.label}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#1F2937',
                    color: '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1F2937';
                    e.currentTarget.style.color = '#9CA3AF';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              {[
                { label: "Home", value: "All" },
                { label: "Men's Wear", value: "Men's Wear" },
                { label: "Women's Wear", value: "Women's Wear" },
                { label: "Kids Wear", value: "Kids Wear" },
                { label: "New Arrivals", value: "All" }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollToTop(link.value)}
                    style={{ color: '#9CA3AF', transition: 'var(--transition)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Customer Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
              <li>Shipping & Delivery Policy</li>
              <li>30-Day Easy Return Policy</li>
              <li>Size & Fit Guide</li>
              <li>Track Order Status</li>
              <li>Contact Us: support@dressify.com</li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Stay In the Loop
            </h4>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Subscribe to unlock 15% OFF your first order and receive exclusive fashion updates!
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.9rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #374151',
                  backgroundColor: '#1F2937',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)' }}
                aria-label="Subscribe to newsletter"
              >
                <Send size={16} />
              </button>
            </form>

            {subscribed && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontSize: '0.8rem', fontWeight: '600' }}>
                <CheckCircle2 size={16} /> You're subscribed! Check your inbox soon.
              </div>
            )}
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '2rem',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#6B7280'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>Dressify Fashion Ltd</strong>. All rights reserved. Built with React & Vite.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
