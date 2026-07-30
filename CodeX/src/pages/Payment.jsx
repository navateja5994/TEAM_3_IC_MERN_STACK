import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState("");

  const amount = location.state?.total || 0;

  const payNow = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const order = {
      customerName: location.state?.customerName,
      phone: location.state?.phone,
      email: location.state?.email,
      address: location.state?.address,
      paymentMethod,
      totalAmount: amount,
      items: location.state?.cartItems || [],
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

      alert("Order Saved Successfully!");

      navigate("/success", {
        state: order,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save order");
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment</h1>

      <h2>Total Amount: ₹{amount}</h2>

      <label>
        <input
          type="radio"
          value="UPI"
          checked={paymentMethod === "UPI"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        UPI
      </label>

      <br />

      <label>
        <input
          type="radio"
          value="Cash On Delivery"
          checked={paymentMethod === "Cash On Delivery"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cash On Delivery
      </label>

      <br />
      <br />

      <button onClick={payNow}>Pay Now</button>
    </div>
  );
}

export default Payment;