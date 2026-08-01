import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react';

export default function QuickViewModal({
  product,
  onClose,
  isWishlisted,
  onAddToCart,
  onToggleWishlist
}) {
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : 'M');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      
      <div 
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <X size={20} />
        </button>

        {/* Left: Product Image */}
        <div style={{
          position: 'relative',
          backgroundColor: '#F3F4F6',
          minHeight: '380px',
          overflow: 'hidden'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {discountPercent > 0 && (
            <span 
              className="badge-discount" 
              style={{ position: 'absolute', top: '16px', left: '16px' }}
            >
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Right: Product Details */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {product.category}
            </span>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--dark)', margin: '0.3rem 0 0.8rem 0' }}>
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', color: '#F59E0B' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating) ? "#F59E0B" : "none"} 
                    color="#F59E0B" 
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--dark)' }}>
                {product.rating}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ({product.reviewsCount} customer reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '1.1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Available Sizes */}
            {product.sizes && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--dark)' }}>
                  Select Size:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        backgroundColor: selectedSize === size ? 'var(--dark)' : '#FFFFFF',
                        color: selectedSize === size ? '#FFFFFF' : 'var(--dark)',
                        border: selectedSize === size ? '1px solid var(--dark)' : '1px solid var(--border-light)',
                        transition: 'var(--transition)'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <button
                onClick={handleAdd}
                className="btn-primary"
                style={{ flex: 1, padding: '0.85rem 0', fontSize: '1rem', backgroundColor: addedSuccess ? '#10B981' : 'var(--primary)' }}
              >
                {addedSuccess ? <><Check size={20} /> Added to Bag</> : <><ShoppingBag size={20} /> Add to Cart</>}
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className="btn-secondary"
                style={{
                  padding: '0.85rem 1.25rem',
                  color: isWishlisted ? 'var(--primary)' : 'var(--dark)',
                  borderColor: isWishlisted ? 'var(--primary)' : 'var(--border-light)'
                }}
                title="Save to Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? 'var(--primary)' : 'none'} />
              </button>
            </div>

            {/* Delivery & Warranty info */}
            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Truck size={14} color="var(--primary)" /> Express Delivery Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} color="var(--primary)" /> 100% Quality Inspected
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
