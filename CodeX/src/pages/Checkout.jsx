import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const total = location.state?.total || 0;
  const cartItems = location.state?.cartItems || [];

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pin, setPin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/payment", {
      state: {
        customerName,
        phone,
        email,
        address: `${address}, ${city}, ${stateName} - ${pin}`,
        total,
        cartItems,
      },
    });
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit} className="checkout-form">

        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="State"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="PIN Code"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />

        <button type="submit">
          Proceed to Payment
        </button>

      </form>
    </div>
  );
}

export default Checkout;