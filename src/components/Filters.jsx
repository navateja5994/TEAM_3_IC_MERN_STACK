import React from 'react';
import { Filter, ArrowUpDown, RotateCcw, Star, Check } from 'lucide-react';

export default function Filters({
  selectedCategory,
  onSelectCategory,
  selectedPriceRange,
  onSelectPriceRange,
  selectedRating,
  onSelectRating,
  sortBy,
  onSortChange,
  onResetFilters,
  activeFilterCount
}) {

  const categories = [
    { label: "All Products", value: "All" },
    { label: "Men's Wear", value: "Men's Wear" },
    { label: "Women's Wear", value: "Women's Wear" },
    { label: "Kids Wear", value: "Kids Wear" }
  ];

  const priceRanges = [
    { label: "All Prices", value: "ALL" },
    { label: "₹0 – ₹500", value: "0-500" },
    { label: "₹500 – ₹1000", value: "500-1000" },
    { label: "₹1000 – ₹2000", value: "1000-2000" },
    { label: "₹2000+", value: "2000-ABOVE" }
  ];

  const ratingOptions = [
    { label: "All Ratings", value: 0 },
    { label: "4★ & Above", value: 4 },
    { label: "3★ & Above", value: 3 },
    { label: "2★ & Above", value: 2 },
    { label: "1★ & Above", value: 1 },
    { label: "5★ Only", value: 5 }
  ];

  const sortOptions = [
    { label: "Featured / Recommended", value: "default" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Rating: High to Low (5 → 1)", value: "rating-desc" },
    { label: "Rating: Low to High (1 → 5)", value: "rating-asc" },
    { label: "Name: A to Z", value: "name-asc" },
    { label: "Name: Z to A", value: "name-desc" }
  ];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-light)'
    }}>
      
      {/* Top Header: Title & Sort Dropdown */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        
        {/* Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? '700' : '500',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  transition: 'var(--transition)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid transparent'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort Selector & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>
            <ArrowUpDown size={16} />
            <span>Sort:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              padding: '0.55rem 2rem 0.55rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              backgroundColor: '#FFFFFF',
              color: 'var(--dark)',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'var(--primary)',
                padding: '0.5rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                transition: 'var(--transition)'
              }}
              title="Reset all active filters"
            >
              <RotateCcw size={14} /> Clear ({activeFilterCount})
            </button>
          )}

        </div>

      </div>

      {/* Sub Filters Row: Price Range & Rating */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        paddingTop: '1.25rem'
      }}>
        
        {/* Price Range Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Price:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {priceRanges.map((range) => {
              const isSelected = selectedPriceRange === range.value;
              return (
                <button
                  key={range.value}
                  onClick={() => onSelectPriceRange(range.value)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? '700' : '500',
                    backgroundColor: isSelected ? 'var(--dark)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                    border: isSelected ? '1px solid var(--dark)' : '1px solid var(--border-light)',
                    transition: 'var(--transition)'
                  }}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Rating:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {ratingOptions.map((rate) => {
              const isSelected = selectedRating === rate.value;
              return (
                <button
                  key={rate.value}
                  onClick={() => onSelectRating(rate.value)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? '700' : '500',
                    backgroundColor: isSelected ? '#FFFBEB' : '#FFFFFF',
                    color: isSelected ? '#D97706' : 'var(--text-main)',
                    border: isSelected ? '1px solid #F59E0B' : '1px solid var(--border-light)',
                    transition: 'var(--transition)'
                  }}
                >
                  {rate.value > 0 && <Star size={12} fill="#F59E0B" color="#F59E0B" />}
                  {rate.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
