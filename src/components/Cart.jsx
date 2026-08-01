import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const totalSavings = originalSubtotal - subtotal;
  
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 99;
  const finalTotal = subtotal + shippingCost;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Trigger festive confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
    }, 1200);
  };

  const handleFinishOrder = () => {
    setOrderComplete(false);
    onClearCart();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Drawer Body */}
      <div className="drawer-content animate-slide-right">
        
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark)' }}>
              Shopping Cart ({totalItemsCount})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {cartItems.length > 0 && !orderComplete && (
          <div style={{
            backgroundColor: 'var(--primary-light)',
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Truck size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--dark)' }}>
                {isFreeShipping ? (
                  "Congratulations! You unlocked FREE Delivery!"
                ) : (
                  <>Add <strong>₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</strong> more for FREE Shipping!</>
                )}
              </span>
            </div>
            
            {/* Progress Track */}
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#E5E7EB',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                backgroundColor: 'var(--primary)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        )}

        {/* Drawer Scrollable Content */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem'
        }}>

          {orderComplete ? (
            /* Order Success View */
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CheckCircle2 size={64} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '0.5rem' }}>
                Order Confirmed!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Thank you for shopping with <strong>Dressify</strong>. Your order has been placed successfully.
              </p>
              <button
                onClick={handleFinishOrder}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : cartItems.length > 0 ? (
            /* Item List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '80px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#F3F4F6'
                    }}
                  />

                  {/* Info */}
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--dark)', lineHeight: 1.2 }}>
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          style={{ color: '#EF4444', padding: '0.2rem', cursor: 'pointer' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.category}
                      </span>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Qty +/- */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: '0.25rem 0.5rem', backgroundColor: '#F9FAFB' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', fontWeight: '700' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '0.25rem 0.5rem', backgroundColor: '#F9FAFB' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty Cart View */
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <ShoppingBag size={56} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '0.5rem' }}>
                Your Cart is Empty
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Looks like you haven't added any fashion items to your cart yet.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Explore Collection
              </button>
            </div>
          )}

        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && !orderComplete && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#FFFFFF'
          }}>
            
            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal ({totalItemsCount} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {totalSavings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: '600' }}>
                  <span>Bag Discount</span>
                  <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Delivery Charge</span>
                <span>{isFreeShipping ? <span style={{ color: '#10B981', fontWeight: '700' }}>FREE</span> : `₹${shippingCost}`}</span>
              </div>

              <div style={{
                display: 'flex',
                justify: 'space-between',
                fontSize: '1.15rem',
                fontWeight: '800',
                color: 'var(--dark)',
                paddingTop: '0.6rem',
                borderTop: '1px solid var(--border-light)'
              }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary)' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem 0', fontSize: '1rem' }}
              >
                {isCheckingOut ? "Processing Order..." : <>Proceed to Checkout <ArrowRight size={18} /></>}
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={onClearCart}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0',
                    fontSize: '0.8rem',
                    color: '#EF4444',
                    fontWeight: '600'
                  }}
                >
                  Empty Cart
                </button>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    fontWeight: '600'
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </>
  );
}
