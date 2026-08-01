import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function Wishlist({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onMoveToCart
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="drawer-content animate-slide-right">
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={22} color="var(--primary)" fill="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark)' }}>
              My Wishlist ({wishlistItems.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
            aria-label="Close Wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem'
        }}>
          {wishlistItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '75px',
                      height: '95px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#F3F4F6'
                    }}
                  />

                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                      {item.category}
                    </span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '0.3rem' }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.6rem' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => onMoveToCart(item)}
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        <ShoppingBag size={14} /> Move to Cart
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(item.id)}
                        style={{
                          padding: '0.4rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-light)',
                          color: '#EF4444'
                        }}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <Heart size={56} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '0.5rem' }}>
                Your Wishlist is Empty
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Explore products and tap the heart icon on any product to save your favorite fashion pieces for later.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Discover Styles
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
