import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState("");
  const amount = location.state?.total || 1;

  const upiId = "9030523441@ibl";
  const payeeName = encodeURIComponent("CodeX Accessories");
  const upiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR`;

  const payNow = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (paymentMethod === "UPI") {
      // Direct deep-link attempt (primarily works on mobile browsers)
      window.location.href = upiLink;
    } else {
      navigate("/success");
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment</h1>
      <h2>Amount to Pay: ₹{amount}</h2>

      <div className="payment-box">
        <label>
          <input
            type="radio"
            name="payment"
            value="UPI"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
        </label>

        {/* Display QR code when UPI is selected */}
        {paymentMethod === "UPI" && (
          <div className="qr-section" style={{ margin: "15px 0", textAlign: "center" }}>
            <p>Scan with any UPI App (GPay, PhonePe, Paytm):</p>
            <QRCodeSVG value={upiLink} size={180} />
          </div>
        )}

        <label>
          <input
            type="radio"
            name="payment"
            value="Credit Card"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Credit Card
        </label>

        <label>
          <input
            type="radio"
            name="payment"
            value="Debit Card"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Debit Card
        </label>

        <label>
          <input
            type="radio"
            name="payment"
            value="Cash On Delivery"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash On Delivery
        </label>

        <button onClick={payNow}>Pay Now</button>
      </div>
    </div>
  );
}

export default Payment;