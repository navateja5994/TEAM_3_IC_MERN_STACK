import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { ArrowLeft, Ticket, ShoppingBag, CreditCard, Tag, Sparkles } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  
  // Coupon State
  const [coupon, setCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState('');
  const [offersList, setOffersList] = useState([]);

  useEffect(() => {
    const rawData = localStorage.getItem('currentBookingData');
    if (!rawData) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(rawData);
    setBookingData(parsed);

    // Fetch Show details
    const fetchShow = async () => {
      try {
        const res = await api.get(`/api/shows/${parsed.showId}`);
        setShowDetails(res.data.show);
      } catch (err) {
        console.error('Failed to load show details:', err);
      }
    };
    fetchShow();

    // Fetch active offers
    const fetchOffers = async () => {
      try {
        const res = await api.get('/api/offers');
        setOffersList(res.data);
      } catch (err) {
        console.error('Failed to load active offers:', err);
      }
    };
    fetchOffers();
  }, [navigate]);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    const offer = offersList.find(o => o.code === code);
    if (!offer) {
      setCouponError('Invalid coupon code.');
      setDiscountAmount(0);
      setCouponApplied('');
      return;
    }

    // Apply Discount
    const rawDiscount = (bookingData.ticketSubtotal * offer.discountPercentage) / 100;
    const finalDiscount = Math.min(rawDiscount, offer.maxDiscount);
    setDiscountAmount(finalDiscount);
    setCouponApplied(code);
    setCoupon('');
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setCouponApplied('');
  };

  const handleProceedToPayment = () => {
    // Save updated total with coupon info in localStorage
    const finalBookingData = {
      ...bookingData,
      couponCode: couponApplied || null,
      discountAmount,
      totalAmount: Math.max(0, (bookingData.ticketSubtotal - discountAmount) + bookingData.foodSubtotal + bookingData.convenienceFee + Math.round(((bookingData.ticketSubtotal - discountAmount) + bookingData.foodSubtotal) * 0.18))
    };
    localStorage.setItem('currentBookingData', JSON.stringify(finalBookingData));
    navigate('/payment');
  };

  if (!bookingData || !showDetails) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div className="flex-center" style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: '80%', height: '300px', borderRadius: 'var(--radius-lg)' }}></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Recalculate totals dynamically
  const ticketSubtotal = bookingData.ticketSubtotal;
  const foodSubtotal = bookingData.foodSubtotal;
  const convenienceFee = bookingData.convenienceFee;
  const taxable = (ticketSubtotal - discountAmount) + foodSubtotal;
  const taxes = Math.round(taxable * 0.18);
  const finalTotal = taxable + convenienceFee + taxes;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '40px 0' }}>
        <div className="checkout-grid">
          {/* Left Column: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <ArrowLeft size={18} />
              </button>
              <h2 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800 }}>Review Booking</h2>
            </div>

            {/* Movie Info Card */}
            <div className="card ticket-stub ticket-stub-horizontal" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <img 
                  src={showDetails.movieId.posterUrl} 
                  alt={showDetails.movieId.title} 
                  style={{ width: '80px', height: '120px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>{showDetails.movieId.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>{showDetails.screenId.type} • {showDetails.movieId.language}</p>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {showDetails.date} | {showDetails.time} | {showDetails.screenId.name}
                  </p>
                </div>
              </div>

              <div className="ticket-stub-divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Selected Seats</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                    {bookingData.selectedSeats.join(', ')} ({bookingData.selectedSeats.length} Tickets)
                  </p>
                </div>
                <Ticket size={24} style={{ color: 'var(--primary)' }} />
              </div>
            </div>

            {/* Concessions Info Card */}
            {bookingData.foodItems.length > 0 && (
              <div className="card" style={{ padding: '24px' }}>
                <h4 style={{ color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={18} style={{ color: 'var(--primary)' }} /> Added Concessions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {bookingData.foodItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span>{item.name} (x{item.quantity})</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Checkout Billing breakdown & Coupons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Promo coupon card */}
            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} style={{ color: 'var(--primary)' }} /> Apply Special Offer
              </h4>

              {couponApplied ? (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={14} /> Coupon applied: {couponApplied}
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Saved ₹{discountAmount}</p>
                  </div>
                  <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: 'var(--secondary-accent)', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. WELCOME50)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="input-field"
                    style={{ padding: '8px 12px', textTransform: 'uppercase', fontSize: '0.85rem' }}
                  />
                  <button onClick={handleApplyCoupon} className="btn btn-secondary" style={{ padding: '8px 16px', textTransform: 'none', fontSize: '0.85rem' }}>
                    Apply
                  </button>
                </div>
              )}

              {couponError && (
                <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '6px' }}>{couponError}</p>
              )}
            </div>

            {/* Price details summary */}
            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ color: '#ffffff', marginBottom: '16px' }}>Payment Summary</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Ticket Price ({bookingData.selectedSeats.length} seats)</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>₹{bookingData.ticketSubtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>Promo Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                {foodSubtotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Food & Concessions Subtotal</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>₹{foodSubtotal}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Convenience Fee</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>₹{convenienceFee}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GST Taxes (18%)</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>₹{taxes}</span>
                </div>

                <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  <span>Final Payable Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{finalTotal}</span>
                </div>
              </div>

              <button 
                onClick={handleProceedToPayment} 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}
              >
                <CreditCard size={18} /> Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
