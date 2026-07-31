import { useState } from "react";
import "../../styles/CartPage.css";

function CartPage({
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onPlaceOrder,
  orderConfirmed,
}) {
  const [step, setStep] = useState("cart"); // 'cart' | 'address' | 'payment' | 'confirmed'
  const [addressData, setAddressData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });
  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price.replace(/[^\d.]/g, "")) * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    setStep("address");
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!addressData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!addressData.address.trim()) newErrors.address = "Address is required";
    if (!addressData.city.trim()) newErrors.city = "City is required";
    if (!addressData.state.trim()) newErrors.state = "State is required";
    if (!addressData.zip.trim()) newErrors.zip = "ZIP code is required";
    if (!addressData.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!paymentData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    if (!paymentData.expiry.trim()) newErrors.expiry = "Expiry date is required";
    if (!paymentData.cvv.trim()) newErrors.cvv = "CVV is required";
    if (!paymentData.cardName.trim()) newErrors.cardName = "Name on card is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep("payment");
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      onPlaceOrder();
      setStep("confirmed");
    }
  };

  const handleAddressChange = (field, value) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handlePaymentChange = (field, value) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const renderAddressForm = () => (
    <div className="checkout-section">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => setStep("cart")}>
          ← Back to Cart
        </button>
        <h2>Shipping Address</h2>
      </div>
      <form className="checkout-form" onSubmit={handleAddressSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={addressData.fullName}
            onChange={(e) => handleAddressChange("fullName", e.target.value)}
            placeholder="Enter your full name"
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            value={addressData.address}
            onChange={(e) => handleAddressChange("address", e.target.value)}
            placeholder="Enter your address"
            rows="3"
          />
          {errors.address && <span className="form-error">{errors.address}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={addressData.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              placeholder="City"
            />
            {errors.city && <span className="form-error">{errors.city}</span>}
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={addressData.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              placeholder="State"
            />
            {errors.state && <span className="form-error">{errors.state}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              value={addressData.zip}
              onChange={(e) => handleAddressChange("zip", e.target.value)}
              placeholder="ZIP code"
            />
            {errors.zip && <span className="form-error">{errors.zip}</span>}
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={addressData.phone}
              onChange={(e) => handleAddressChange("phone", e.target.value)}
              placeholder="Phone number"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="continue-btn">
            Continue to Payment →
          </button>
        </div>
      </form>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="checkout-section">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => setStep("address")}>
          ← Back to Address
        </button>
        <h2>Payment Details</h2>
      </div>
      <form className="checkout-form" onSubmit={handlePaymentSubmit}>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            value={paymentData.cardNumber}
            onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
          />
          {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
        </div>
        <div className="form-group">
          <label>Name on Card</label>
          <input
            type="text"
            value={paymentData.cardName}
            onChange={(e) => handlePaymentChange("cardName", e.target.value)}
            placeholder="Name as on card"
          />
          {errors.cardName && <span className="form-error">{errors.cardName}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              value={paymentData.expiry}
              onChange={(e) => handlePaymentChange("expiry", e.target.value)}
              placeholder="MM/YY"
              maxLength="5"
            />
            {errors.expiry && <span className="form-error">{errors.expiry}</span>}
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              value={paymentData.cvv}
              onChange={(e) => handlePaymentChange("cvv", e.target.value)}
              placeholder="123"
              maxLength="4"
            />
            {errors.cvv && <span className="form-error">{errors.cvv}</span>}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="continue-btn">
            Pay & Place Order →
          </button>
        </div>
      </form>
    </div>
  );

  const renderConfirmed = () => (
    <div className="checkout-section">
      <div className="order-confirmed">
        <div className="success-icon">✓</div>
        <h2>Order Confirmed!</h2>
        <p>Your package is on the way. Thank you for your purchase!</p>
        <div className="shipping-info">
          <h3>Shipping To:</h3>
          <p>{addressData.fullName}</p>
          <p>{addressData.address}</p>
          <p>{addressData.city}, {addressData.state} - {addressData.zip}</p>
          <p>Phone: {addressData.phone}</p>
        </div>
      </div>
    </div>
  );

  // Cart view (step === 'cart')
  if (step === "cart") {
    return (
      <section className="cart-page">
        <div className="cart-header">
          <div>
            <p className="eyebrow">Your Basket</p>
            <h2>Shopping Cart</h2>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty. Add a few favorites to get started.</p>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.brand}</p>
                    <div className="cart-actions">
                      <button onClick={() => onUpdateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-price-block">
                    <strong>{item.price}</strong>
                    <button onClick={() => onRemoveFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{subtotal.toFixed(0)}</strong>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <strong>Free</strong>
              </div>
              <button className="checkout-btn" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </aside>
          </div>
        )}
      </section>
    );
  }

  // Checkout steps (address, payment, confirmed)
  return (
    <section className="cart-page">
      <div className="checkout-progress">
        <div className={`progress-step ${step === "address" || step === "payment" || step === "confirmed" ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-label">Address</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step === "payment" || step === "confirmed" ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-label">Payment</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step === "confirmed" ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-label">Confirmation</span>
        </div>
      </div>

      {step === "address" && renderAddressForm()}
      {step === "payment" && renderPaymentForm()}
      {step === "confirmed" && renderConfirmed()}
    </section>
  );
}

export default CartPage;
