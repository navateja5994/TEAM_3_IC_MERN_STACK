import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'cart':
        return <ShoppingBag size={18} color="var(--primary)" />;
      case 'wishlist':
        return <Heart size={18} color="#EF4444" fill="#EF4444" />;
      default:
        return <Info size={18} color="var(--primary)" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 300,
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-md)',
      padding: '0.9rem 1.25rem',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      minWidth: '280px',
      maxWidth: '380px'
    }} className="animate-fade-in">
      <div style={{
        padding: '0.4rem',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {getIcon()}
      </div>

      <div style={{ flexGrow: 1 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--dark)' }}>
          {toast.message}
        </p>
      </div>

      <button onClick={onClose} style={{ color: 'var(--text-muted)' }} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}
