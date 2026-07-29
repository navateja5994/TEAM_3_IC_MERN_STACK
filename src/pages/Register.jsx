import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Phone, User, Mail, Film } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phoneNumber || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, phoneNumber, password, role: 'customer' });
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      {/* Left side: Cinema Promo graphic */}
      <div className="auth-sidebar" style={{ background: 'linear-gradient(135deg, #07080a 0%, #171a24 100%)', borderRight: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
          <Film size={32} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900 }}>Mall CineBook</h1>
        </div>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginTop: '20px', lineHeight: '1.6', maxWidth: '440px' }}>
          Join Mall CineBook today. Get special ticket pricing, discount coupons, and seat deliveries.
        </p>

        <div className="auth-sidebar-illustrations" style={{ marginTop: '40px' }}>
          <div className="floating-card" style={{ animationDelay: '0s' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '4px', fontSize: '0.9rem' }}>🍿 Concessions & Popcorn</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pre-order snacks and have them delivered to your seats during the movie.</p>
          </div>
          <div className="floating-card" style={{ animationDelay: '2s' }}>
            <h4 style={{ color: '#10b981', marginBottom: '4px', fontSize: '0.9rem' }}>🏷️ Offers & Discounts</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Use coupon WELCOME50 on your very first ticket checkout.</p>
          </div>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="auth-form-container">
        <div className="auth-form-card">
          <div className="auth-header">
            <h2 className="auth-title" style={{ color: '#ffffff' }}>Create Account</h2>
            <p className="auth-subtitle">Join us to start booking tickets</p>
          </div>

          {error && (
            <div style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 500,
              marginBottom: '20px',
              border: '1px solid rgba(239, 68, 68, 0.1)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="John Doe"
                  style={{ paddingLeft: '44px' }}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="john@example.com"
                  style={{ paddingLeft: '44px' }}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input 
                  type="tel" 
                  className="input-field" 
                  placeholder="+919876543210"
                  style={{ paddingLeft: '44px' }}
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="input-field" 
                  placeholder="••••••••"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: '14px', top: '15px', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', marginTop: '16px', display: 'flex', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
