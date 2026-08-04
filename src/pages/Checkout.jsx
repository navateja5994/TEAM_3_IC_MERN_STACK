import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const order = {
      id: "BW" + Date.now(),
      customer: formData,
      payment: paymentMethod,
      items: cartItems,
      total: cartTotal,
      date: new Date().toLocaleString(),
      status: "Confirmed",
    };

    const oldOrders =
      JSON.parse(localStorage.getItem("bagworld-orders")) || [];

    oldOrders.push(order);

    localStorage.setItem(
      "bagworld-orders",
      JSON.stringify(oldOrders)
    );

    clearCart();

    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <section className="checkout-success">
        <h1>🎉 Order Placed Successfully!</h1>

        <h3>Thank you for shopping with BagWorld.</h3>

        <p>Your order has been confirmed.</p>

        <Link to="/" className="btn">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">

      <h1 className="checkout-title">
        Checkout
      </h1>

      <div className="checkout-container">

        {/* Left */}

        <div className="checkout-form">

          <h2>Shipping Details</h2>

          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <textarea
            placeholder="Address"
            name="address"
            rows="4"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />

          <h2>Payment Method</h2>

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          >
            <option>Cash on Delivery</option>
          </select>

        </div>

        {/* Right */}

        <div className="order-summary">

          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="summary-item"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <hr />

          <div className="summary-item">
            <strong>Delivery</strong>

            <strong>FREE</strong>
          </div>

          <div className="summary-item">
            <strong>Total</strong>

            <strong>₹{cartTotal}</strong>
          </div>

          <button
            className="place-order-btn"
            onClick={handleOrder}
          >
            Place Order
          </button>

        </div>

      </div>

    </section>
  );
}

export default Checkout;