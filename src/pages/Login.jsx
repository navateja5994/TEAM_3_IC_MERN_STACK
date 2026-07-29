import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, Ticket, Film } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone || !password) {
      setError('Please enter your email/phone and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(emailOrPhone, password);
      // Redirect based on role
      if (data.user && data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
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
          Experience cinema in luxury. Browse active shows, reserve premium seats, and order food in a single step.
        </p>

        <div className="auth-sidebar-illustrations" style={{ marginTop: '40px' }}>
          <div className="floating-card" style={{ animationDelay: '0s' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Ticket size={16} /> Instant Seating
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pick Standard, Premium, or VIP Recliners interactively.</p>
          </div>
          <div className="floating-card" style={{ animationDelay: '2s' }}>
            <h4 style={{ color: '#10b981', marginBottom: '4px', fontSize: '0.9rem' }}>🍿 Seat Snacks Delivery</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Add Popcorn, soft drinks, or combos and get them delivered to your seat.</p>
          </div>
          <div className="floating-card" style={{ animationDelay: '4s' }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '4px', fontSize: '0.9rem' }}>🎫 Barcode Tickets</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Skip the ticketing queues. Just scan your digital ticket at the gate.</p>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="auth-form-container">
        <div className="auth-form-card">
          <div className="auth-header">
            <h2 className="auth-title" style={{ color: '#ffffff' }}>Sign In</h2>
            <p className="auth-subtitle">Welcome back to Mall CineBook</p>
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
              <label className="form-label">Email or Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="customer@cinebook.com or +91..."
                  style={{ paddingLeft: '44px' }}
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
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
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
