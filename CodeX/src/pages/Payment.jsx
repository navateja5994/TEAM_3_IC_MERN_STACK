import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState("");

  const amount = location.state?.total || 0;

  const upiId = "9030523441@ibl";
  const payeeName = encodeURIComponent("CodeX Accessories");

  const upiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR`;

  const payNow = async () => {

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const order = {
      customerName: location.state.customerName,
      phone: location.state.phone,
      email: location.state.email,
      address: location.state.address,
      city: location.state.city,
      state: location.state.state,
      pinCode: location.state.pinCode,

      paymentMethod: paymentMethod,

      totalAmount: amount,

      items: location.state.cartItems || [],

      orderDate: new Date().toISOString(),

      status: "Paid",
    };

    try {

      const response = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      console.log(data);

      alert("Order Saved Successfully");

      navigate("/success", {
        state: order,
      });

    } catch (error) {

      console.log(error);

      alert("Failed to save order");

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
            value="UPI"
            checked={paymentMethod === "UPI"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
        </label>

        {paymentMethod === "UPI" && (
          <div
            style={{
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            <p>Scan QR Code</p>

            <QRCodeSVG
              value={upiLink}
              size={180}
            />
          </div>
        )}

        <label>
          <input
            type="radio"
            value="Credit Card"
            checked={paymentMethod === "Credit Card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Credit Card
        </label>

        <label>
          <input
            type="radio"
            value="Debit Card"
            checked={paymentMethod === "Debit Card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Debit Card
        </label>

        <label>
          <input
            type="radio"
            value="Cash On Delivery"
            checked={paymentMethod === "Cash On Delivery"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash On Delivery
        </label>

        <button onClick={payNow}>
          Pay Now
        </button>

      </div>

    </div>
  );
}

export default Payment;