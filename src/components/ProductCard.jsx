import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';

export default function ProductCard({
  product,
  isWishlisted,
  isInCart,
  onAddToCart,
  onToggleWishlist,
  onQuickView
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <div 
      className="product-card"
      onClick={() => onQuickView(product)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'var(--transition)',
        cursor: 'pointer'
      }}
    >
      
      {/* Top Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '125%', // 4:5 Aspect Ratio for high-end fashion cards
        backgroundColor: '#F3F4F6',
        overflow: 'hidden'
      }}>

        {/* Skeleton Image Loader */}
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#E5E7EB',
            animation: 'pulse 1.5s infinite'
          }} />
        )}

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            opacity: imageLoaded ? 1 : 0
          }}
          className="product-card-img"
        />

        {/* Badges Overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 5
        }}>
          {discountPercent > 0 && (
            <span className="badge-discount">
              {discountPercent}% OFF
            </span>
          )}
          {product.tag && (
            <span className="badge-tag">
              {product.tag}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button Top Right */}
        <button
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: isWishlisted ? 'rgba(255, 107, 0, 0.95)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isWishlisted ? '#FFFFFF' : '#374151',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'var(--transition)'
          }}
        >
          <Heart size={18} fill={isWishlisted ? '#FFFFFF' : 'none'} />
        </button>

        {/* Quick View Hover Button Overlay */}
        <div 
          className="quick-view-overlay"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            zIndex: 5,
            opacity: 0,
            transform: 'translateY(10px)',
            transition: 'var(--transition)'
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            style={{
              width: '100%',
              padding: '0.6rem 0',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Eye size={16} /> Quick View
          </button>
        </div>

      </div>

      {/* Product Information Body */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        
        <div>
          {/* Category & Rating Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.4rem'
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {product.category}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Star size={14} fill="#F59E0B" color="#F59E0B" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark)' }}>
                {product.rating}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--dark)',
            marginBottom: '0.75rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              color: 'var(--primary)'
            }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--text-light)',
              textDecoration: 'line-through'
            }}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '0.7rem 0',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: justAdded ? '#10B981' : (isInCart ? 'var(--dark)' : 'var(--primary)'),
              color: '#FFFFFF',
              transition: 'var(--transition)',
              boxShadow: justAdded ? 'none' : (isInCart ? 'none' : 'var(--shadow-sm)')
            }}
          >
            {justAdded ? (
              <>
                <Check size={18} /> Added!
              </>
            ) : isInCart ? (
              <>
                <ShoppingBag size={18} /> Add More
              </>
            ) : (
              <>
                <ShoppingBag size={18} /> Add to Cart
              </>
            )}
          </button>
        </div>

      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-4px);
          boxShadow: var(--shadow-lg);
          border-color: rgba(255, 107, 0, 0.3);
        }
        .product-card:hover .product-card-img {
          transform: scale(1.06);
        }
        .product-card:hover .quick-view-overlay {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
