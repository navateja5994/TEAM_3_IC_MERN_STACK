import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { ArrowLeft, CreditCard, Smartphone, ShieldCheck, CheckCircle } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successBookingId, setSuccessBookingId] = useState('');
  
  // Card Inputs state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const rawData = localStorage.getItem('currentBookingData');
    if (!rawData) {
      navigate('/');
      return;
    }
    setBookingData(JSON.parse(rawData));
  }, [navigate]);

  const handlePayNow = async (e) => {
    e.preventDefault();
    if (!bookingData) return;

    setProcessing(true);

    try {
      // Step 1: Create the booking (this atomically locks seats in MongoDB)
      const createRes = await api.post('/api/bookings/create', {
        showId: bookingData.showId,
        seats: bookingData.selectedSeats,
        foodItems: bookingData.foodItems,
        couponCode: bookingData.couponCode
      });

      const serverBooking = createRes.data.booking;

      // Step 2: Confirm the payment for this booking
      const confirmRes = await api.post('/api/bookings/confirm-payment', {
        bookingId: serverBooking._id,
        paymentMethod
      });

      // Clear local booking storage
      localStorage.removeItem('currentBookingData');

      setSuccessBookingId(confirmRes.data.booking._id);
      setSuccess(true);
    } catch (err) {
      console.error('Payment booking failed:', err);
      alert(err.response?.data?.error || 'Booking reservation failed. The seats might have been booked by someone else. Please try again.');
      navigate(`/book/${bookingData?.movieId || ''}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingData) {
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

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="success-card">
            <div className="success-icon-wrap">
              <CheckCircle size={44} />
            </div>
            <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>Booking Successful!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Your payment has been verified successfully. Your seats are booked, and your digital ticket is ready.
            </p>
            <button 
              onClick={() => navigate(`/ticket/${successBookingId}`)} 
              className="btn btn-primary"
              style={{ padding: '12px 24px', width: '100%' }}
            >
              View Digital Ticket
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '40px 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <ArrowLeft size={18} />
            </button>
            <h2 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800 }}>Choose Payment Method</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }} className="payment-grid">
            {/* Left side: Options list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                onClick={() => setPaymentMethod('UPI')}
                style={{
                  background: 'var(--bg-secondary)', border: `1.5px solid ${paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--border-color)'}`,
                  padding: '16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease'
                }}
              >
                <Smartphone size={20} style={{ color: paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--text-secondary)' }} />
                <span style={{ fontWeight: 600, color: paymentMethod === 'UPI' ? '#ffffff' : 'var(--text-secondary)' }}>UPI (GooglePay / PhonePe)</span>
              </div>
              <div 
                onClick={() => setPaymentMethod('Card')}
                style={{
                  background: 'var(--bg-secondary)', border: `1.5px solid ${paymentMethod === 'Card' ? 'var(--primary)' : 'var(--border-color)'}`,
                  padding: '16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease'
                }}
              >
                <CreditCard size={20} style={{ color: paymentMethod === 'Card' ? 'var(--primary)' : 'var(--text-secondary)' }} />
                <span style={{ fontWeight: 600, color: paymentMethod === 'Card' ? '#ffffff' : 'var(--text-secondary)' }}>Credit / Debit Card</span>
              </div>
              <div 
                onClick={() => setPaymentMethod('Net Banking')}
                style={{
                  background: 'var(--bg-secondary)', border: `1.5px solid ${paymentMethod === 'Net Banking' ? 'var(--primary)' : 'var(--border-color)'}`,
                  padding: '16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease'
                }}
              >
                <ShieldCheck size={20} style={{ color: paymentMethod === 'Net Banking' ? 'var(--primary)' : 'var(--text-secondary)' }} />
                <span style={{ fontWeight: 600, color: paymentMethod === 'Net Banking' ? '#ffffff' : 'var(--text-secondary)' }}>Net Banking</span>
              </div>
            </div>

            {/* Right side: Selected Method Form */}
            <div className="card" style={{ padding: '24px' }}>
              {processing ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div className="skeleton" style={{ width: '50px', height: '50px', borderRadius: '50%', margin: '0 auto 20px auto' }}></div>
                  <h4 style={{ color: '#ffffff', marginBottom: '8px' }}>Processing Payment...</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Do not refresh or close this page.</p>
                </div>
              ) : (
                <form onSubmit={handlePayNow}>
                  <h4 style={{ color: '#ffffff', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    Pay ₹{bookingData.totalAmount}
                  </h4>

                  {paymentMethod === 'UPI' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Enter UPI ID</label>
                        <input 
                          type="text" 
                          placeholder="username@upi"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="input-field" 
                        />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>You will receive a payment request on your linked UPI app.</p>
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Card Holder Name</label>
                        <input 
                          type="text" 
                          placeholder="Cardholder Name"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="input-field" 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="1234 5678 1234 5678"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="input-field" 
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="input-field" 
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV</label>
                          <input 
                            type="password" 
                            placeholder="***"
                            maxLength={3}
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="input-field" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Net Banking' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Select Your Bank</label>
                        <select className="input-field" required style={{ background: 'var(--input-bg)' }}>
                          <option value="">-- Select Bank --</option>
                          <option value="SBI">State Bank of India</option>
                          <option value="HDFC">HDFC Bank</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="AXIS">Axis Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center' }}
                  >
                    Simulate Payment Success
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .payment-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Payment;
