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
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/payment", {
      state: {
        customerName,
        phone,
        email,
        address,
        city,
        state,
        pinCode,
        total,
        cartItems,
      },
    });
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <form className="checkout-form" onSubmit={handleSubmit}>
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
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="PIN Code"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          required
        />

        <button type="submit">Proceed To Payment</button>
      </form>
    </div>
  );
}

export default Checkout;