import { useNavigate,useLocation } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
    const location = useLocation();

const total = location.state?.total || 0;
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
navigate("/payment", {
  state: { total }
});
};

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit} className="checkout-form">

        <input type="text" placeholder="Full Name" required />

        <input type="tel" placeholder="Phone Number" required />

        <input type="email" placeholder="Email Address" required />

        <textarea placeholder="Address" required />

        <input type="text" placeholder="City" required />

        <input type="text" placeholder="State" required />

        <input type="text" placeholder="PIN Code" required />

        <button type="submit">
          Proceed to Payment
        </button>

      </form>
    </div>
  );
}

export default Checkout;