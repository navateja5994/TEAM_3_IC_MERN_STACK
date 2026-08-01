import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default function Hero({ onSelectCategory }) {
  
  const scrollToProducts = (category = "All") => {
    if (category) onSelectCategory(category);
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        
        {/* Main Hero Banner Card */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '460px',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          
          {/* Background Image with Dark Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            opacity: 0.45,
            filter: 'brightness(0.85)'
          }} />

          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.6) 60%, rgba(17, 24, 39, 0.1) 100%)'
          }} />

          {/* Banner Content */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            padding: '3.5rem 2.5rem',
            maxWidth: '650px',
            color: '#FFFFFF'
          }}>
            {/* Tag Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 107, 0, 0.2)',
              border: '1px solid rgba(255, 107, 0, 0.5)',
              color: '#FF8833',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={14} /> New Season Collection 2026
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: '800',
              lineHeight: 1.1,
              marginBottom: '1rem',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.02em'
            }}>
              Elevate Your Everyday <span style={{ color: 'var(--primary)' }}>Style</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.05rem',
              color: '#D1D5DB',
              marginBottom: '2rem',
              lineHeight: 1.6,
              maxWidth: '520px'
            }}>
              Discover handpicked fashion trends across Men's, Women's & Kids' collections. Enjoy premium craftsmanship at unbeatable prices.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={() => scrollToProducts("All")}
                className="btn-primary" 
                style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
              >
                Shop Now <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={() => scrollToProducts("Women's Wear")}
                className="btn-secondary"
                style={{ 
                  padding: '0.9rem 1.8rem', 
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF'
                }}
              >
                Women's Edit
              </button>
            </div>

          </div>

        </div>

        {/* Categories Spotlight Bar */}
        <div style={{
          marginTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {[
            {
              title: "Men's Wear",
              subtitle: "10 Premium Products",
              category: "Men's Wear",
              image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Women's Wear",
              subtitle: "10 Elegant Styles",
              category: "Women's Wear",
              image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Kids Wear",
              subtitle: "10 Comfy Outfits",
              category: "Kids Wear",
              image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=600&q=80"
            }
          ].map((cat) => (
            <div
              key={cat.title}
              onClick={() => scrollToProducts(cat.category)}
              style={{
                position: 'relative',
                height: '140px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'var(--transition)'
              }}
              className="category-card-hover"
            >
              <img 
                src={cat.image} 
                alt={cat.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.75)',
                  transition: 'transform 0.5s ease'
                }}
                className="category-img"
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 80%)',
                color: '#FFFFFF'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{cat.title}</h3>
                <span style={{ fontSize: '0.8rem', color: '#E5E7EB' }}>{cat.subtitle} &rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Badges Bar */}
        <div style={{
          marginTop: '1.5rem',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--dark)' }}>Free Express Delivery</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On orders above ₹999</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--dark)' }}>100% Authentic</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Guaranteed quality products</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--dark)' }}>30 Days Easy Return</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hassle-free refunds</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Award size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--dark)' }}>Best Price Guarantee</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct designer pricing</p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .category-card-hover:hover .category-img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
