import React from 'react';
import ProductCard from './ProductCard';
import { PackageX, Sparkles } from 'lucide-react';

export default function ProductGrid({
  products,
  wishlistIds,
  cartItemIds,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  onResetFilters,
  selectedCategory
}) {
  return (
    <section id="products-section" style={{ paddingBottom: '4rem' }}>
      
      {/* Section Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: 'var(--dark)',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            {selectedCategory === 'All' ? 'All Fashion Collections' : selectedCategory}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--primary)' }}>{products.length}</strong> items tailored for you
          </p>
        </div>
      </div>

      {/* Product Cards Grid */}
      {products.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              isInCart={cartItemIds.includes(product.id)}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '4rem 2rem',
          textAlign: 'center',
          border: '1px dashed var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <PackageX size={36} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '0.5rem' }}>
            No Matching Products Found
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            We couldn't find any items matching your selected category, price range, or rating filters.
          </p>

          <button
            onClick={onResetFilters}
            className="btn-primary"
          >
            <Sparkles size={16} /> Reset All Filters
          </button>
        </div>
      )}

    </section>
  );
}
