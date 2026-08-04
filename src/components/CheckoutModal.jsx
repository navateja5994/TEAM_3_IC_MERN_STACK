import React, { useState } from 'react';
import {
  X,
  MapPin,
  LocateFixed,
  ChevronLeft,
  ChevronRight,
  Check,
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  Truck,
  Loader2,
  CheckCircle2,
  Package,
  Calendar,
  Home
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  shippingCost,
  finalTotal,
  totalItemsCount,
  onPlaceOrder
}) {
  const [step, setStep] = useState(1);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    lat: null,
    lng: null
  });

  const [payment, setPayment] = useState({
    upiId: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    upiPin: ''
  });

  if (!isOpen) return null;

  const totalItemsCountSafe = totalItemsCount || cartItems.reduce((a, i) => a + i.quantity, 0);
  const finalTotalSafe = finalTotal ?? subtotal + shippingCost;

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode using OpenStreetMap Nominatim (free, no key needed)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};
          setAddress((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            city: addr.city || addr.town || addr.village || prev.city || '',
            state: addr.state || prev.state || '',
            pincode: addr.postcode || prev.pincode || '',
            country: addr.country || prev.country || 'India'
          }));
        } catch {
          // Fallback: just store coordinates
          setAddress((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude
          }));
          setLocationError('Location detected, but could not resolve address. Please fill manually.');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setLocationError(
          err.code === 1
            ? 'Location permission denied. Please enable location or fill the address manually.'
            : 'Unable to detect your location. Please fill the address manually.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const isAddressValid = () => {
    return (
      address.fullName.trim() &&
      address.phone.trim().length >= 10 &&
      address.line1.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.pincode.trim().length >= 6
    );
  };

  const isPaymentValid = () => {
    if (paymentMethod === 'cod') return true;
    if (paymentMethod === 'upi') return payment.upiId.includes('@');
    if (paymentMethod === 'card') {
      return (
        payment.cardNumber.replace(/\s/g, '').length >= 12 &&
        payment.cardName.trim() &&
        payment.cardExpiry.trim() &&
        payment.cardCvv.trim().length >= 3
      );
    }
    return false;
  };

  const handleNextFromAddress = () => {
    if (!isAddressValid()) {
      setLocationError('Please fill all required address fields (name, phone, address, city, state, pincode).');
      return;
    }
    setLocationError('');
    setStep(2);
  };

  const handlePay = () => {
    if (!isPaymentValid()) {
      setLocationError('Please complete the payment details for your selected method.');
      return;
    }
    setProcessing(true);
    setLocationError('');
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      const id = 'DRS' + Math.floor(100000 + Math.random() * 900000);
      const date = new Date();
      date.setDate(date.getDate() + 5);
      setOrderId(id);
      setDeliveryDate(date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }));
      setStep(3);
    }, 1800);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    onPlaceOrder({
      orderId,
      deliveryDate,
      address,
      paymentMethod,
      finalTotal: finalTotalSafe
    });
  };

  const handleClose = () => {
    if (orderPlaced) {
      // Reset for next time
      setStep(1);
      setOrderPlaced(false);
      setAddress({
        fullName: '', phone: '', email: '', line1: '', line2: '',
        city: '', state: '', pincode: '', country: 'India', lat: null, lng: null
      });
      setPayment({ upiId: '', cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '', upiPin: '' });
    }
    onClose();
  };

  const inputStyle = (invalid) => ({
    width: '100%',
    padding: '0.7rem 0.9rem',
    fontSize: '0.875rem',
    borderRadius: 'var(--radius-md)',
    border: invalid ? '1px solid #EF4444' : '1px solid var(--border-light)',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    transition: 'var(--transition)'
  });

  const stepDots = [
    { n: 1, label: 'Delivery Location' },
    { n: 2, label: 'Payment' },
    { n: 3, label: 'Confirmation' }
  ];

  return (
    <div className="modal-overlay" onClick={orderPlaced ? undefined : handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
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
          aria-label="Close Checkout"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: '#FAF9F6'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--dark)', fontFamily: "'Space Grotesk', sans-serif" }}>
            Secure Checkout
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {totalItemsCountSafe} item{totalItemsCountSafe !== 1 ? 's' : ''} · {finalTotalSafe > 0 ? `₹${finalTotalSafe.toLocaleString('en-IN')}` : ''}
          </p>
        </div>

        {/* Stepper */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1.25rem 2rem',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: '#FFFFFF'
        }}>
          {stepDots.map((s, idx) => (
            <React.Fragment key={s.n}>
              {idx > 0 && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: step >= s.n ? 'var(--primary)' : 'var(--border-light)'
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  backgroundColor: step >= s.n ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: step >= s.n ? '#FFFFFF' : 'var(--text-muted)'
                }}>
                  {step > s.n ? <Check size={16} /> : s.n}
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: step >= s.n ? '700' : '500',
                  color: step >= s.n ? 'var(--dark)' : 'var(--text-muted)',
                  display: 'none'
                }}>
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: '2rem' }}>
          {/* ============ STEP 1: LOCATION & ADDRESS ============ */}
          {step === 1 && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '0.25rem' }}>
                    <MapPin size={18} color="var(--primary)" style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                    Delivery Location
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {address.lat ? `📍 Detected: ${address.lat.toFixed(4)}, ${address.lng.toFixed(4)}` : 'Enter your shipping address or auto-detect your location.'}
                  </p>
                </div>

                <button
                  onClick={handleDetectLocation}
                  disabled={locating}
                  className="btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 1.1rem',
                    color: 'var(--primary)',
                    borderColor: 'var(--primary)',
                    backgroundColor: 'var(--primary-light)'
                  }}
                >
                  {locating ? <Loader2 size={16} className="spin" /> : <LocateFixed size={16} />}
                  {locating ? 'Detecting...' : 'Detect My Location'}
                </button>
              </div>

              {locationError && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  color: '#B91C1C',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  border: '1px solid #FECACA'
                }}>
                  {locationError}
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    placeholder="e.g. Rahul Sharma"
                    style={inputStyle()}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone *</label>
                  <input
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="10-digit mobile number"
                    style={inputStyle(address.phone && address.phone.length < 10)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    name="email"
                    value={address.email}
                    onChange={handleAddressChange}
                    placeholder="you@example.com"
                    style={inputStyle()}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Address Line 1 *</label>
                  <input
                    name="line1"
                    value={address.line1}
                    onChange={handleAddressChange}
                    placeholder="House no, Street, Area"
                    style={inputStyle()}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Address Line 2</label>
                  <input
                    name="line2"
                    value={address.line2}
                    onChange={handleAddressChange}
                    placeholder="Landmark, Apartment (optional)"
                    style={inputStyle()}
                  />
                </div>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    style={inputStyle()}
                  />
                </div>
                <div>
                  <label style={labelStyle}>State *</label>
                  <input
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    style={inputStyle()}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Pincode *</label>
                  <input
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="6-digit PIN"
                    style={inputStyle(address.pincode && address.pincode.length < 6)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <input
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    style={inputStyle()}
                  />
                </div>
              </div>

              {/* Delivery estimate note */}
              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--primary-light)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'var(--dark)'
              }}>
                <Truck size={16} color="var(--primary)" />
                Estimated delivery: 4-6 business days to {address.city || 'your location'}
              </div>
            </div>
          )}

          {/* ============ STEP 2: PAYMENT ============ */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '1.25rem' }}>
                <CreditCard size={18} color="var(--primary)" style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                Select Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { value: 'upi', icon: <Smartphone size={20} />, title: 'UPI', desc: 'GPay, PhonePe, Paytm & more' },
                  { value: 'card', icon: <CreditCard size={20} />, title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay, Amex' },
                  { value: 'cod', icon: <Banknote size={20} />, title: 'Cash on Delivery', desc: 'Pay when your order arrives' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPaymentMethod(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === opt.value ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                      backgroundColor: paymentMethod === opt.value ? 'var(--primary-light)' : '#FFFFFF',
                      transition: 'var(--transition)',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: paymentMethod === opt.value ? 'var(--primary)' : 'var(--bg-secondary)',
                      color: paymentMethod === opt.value ? '#FFFFFF' : 'var(--text-muted)'
                    }}>
                      {opt.icon}
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: '800', color: 'var(--dark)', fontSize: '0.95rem' }}>{opt.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: paymentMethod === opt.value ? 'var(--primary)' : 'var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {paymentMethod === opt.value && <Check size={14} color="var(--primary)" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment details form */}
              {paymentMethod === 'upi' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>UPI ID *</label>
                  <input
                    name="upiId"
                    value={payment.upiId}
                    onChange={handlePaymentChange}
                    placeholder="yourname@upi"
                    style={inputStyle(payment.upiId && !payment.upiId.includes('@'))}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    A payment request will be simulated on your UPI app.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Card Number *</label>
                    <input
                      name="cardNumber"
                      value={payment.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      style={inputStyle()}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Name on Card *</label>
                    <input
                      name="cardName"
                      value={payment.cardName}
                      onChange={handlePaymentChange}
                      placeholder="RAHUL SHARMA"
                      style={inputStyle()}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Expiry (MM/YY) *</label>
                    <input
                      name="cardExpiry"
                      value={payment.cardExpiry}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      style={inputStyle()}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>CVV *</label>
                    <input
                      name="cardCvv"
                      value={payment.cardCvv}
                      onChange={handlePaymentChange}
                      placeholder="•••"
                      type="password"
                      style={inputStyle()}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div style={{
                  marginBottom: '1.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)'
                }}>
                  <Banknote size={20} color="var(--primary)" />
                  You'll pay <strong>₹{finalTotalSafe.toLocaleString('en-IN')}</strong> in cash when your order is delivered.
                </div>
              )}

              {/* Security note */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '1rem'
              }}>
                <ShieldCheck size={16} color="#10B981" />
                This is a <strong>simulated payment</strong> for demo purposes. No real money will be charged.
              </div>
            </div>
          )}

          {/* ============ STEP 3: CONFIRMATION ============ */}
          {step === 3 && (
            <div>
              {orderPlaced ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <CheckCircle2 size={72} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '0.5rem' }}>
                    Order Placed Successfully!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Thank you for shopping with <strong>Dressify</strong>. Your order is confirmed.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '1.25rem' }}>
                    <Package size={18} color="var(--primary)" style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                    Review & Place Order
                  </h3>

                  {/* Order ID */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '0.9rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Order ID</span>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)' }}>{orderId}</span>
                  </div>

                  {/* Items */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Items ({totalItemsCountSafe})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {cartItems.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={item.image} alt={item.name} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                          <div style={{ flexGrow: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark)' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} · Size: {item.selectedSize || 'M'}</div>
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--dark)' }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery address */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      <Home size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} /> Deliver To
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      <strong>{address.fullName}</strong> · {address.phone}
                      <br />
                      {address.line1}{address.line2 ? `, ${address.line2}` : ''}
                      <br />
                      {address.city}, {address.state} - {address.pincode}, {address.country}
                      {address.lat && (
                        <span style={{ color: 'var(--text-muted)' }}> · 📍 {address.lat.toFixed(4)}, {address.lng.toFixed(4)}</span>
                      )}
                    </div>
                  </div>

                  {/* Delivery estimate */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--primary-light)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--dark)',
                    marginBottom: '1.25rem'
                  }}>
                    <Calendar size={16} color="var(--primary)" />
                    Estimated delivery by <strong>{deliveryDate}</strong>
                  </div>

                  {/* Payment summary */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '1rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Subtotal: ₹{subtotal.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Delivery: {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Payment: <strong>{paymentMethod.toUpperCase()}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                        ₹{finalTotalSafe.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1.25rem 2rem',
          borderTop: '1px solid var(--border-light)',
          backgroundColor: '#FAF9F6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {step > 1 && !orderPlaced && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ChevronLeft size={18} /> Back
            </button>
          )}

          {step === 1 && (
            <button
              onClick={handleNextFromAddress}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}
            >
              Continue to Payment <ChevronRight size={18} />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handlePay}
              disabled={processing}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}
            >
              {processing ? (
                <><Loader2 size={18} className="spin" /> Processing Payment...</>
              ) : (
                <>Pay ₹{finalTotalSafe.toLocaleString('en-IN')} <ChevronRight size={18} /></>
              )}
            </button>
          )}

          {step === 3 && !orderPlaced && (
            <button
              onClick={handlePlaceOrder}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}
            >
              <Check size={18} /> Place Order
            </button>
          )}

          {orderPlaced && (
            <button
              onClick={handleClose}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: '700',
  color: 'var(--dark)',
  marginBottom: '0.4rem'
};
