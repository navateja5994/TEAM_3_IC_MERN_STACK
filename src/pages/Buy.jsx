import { useState } from "react";
import "./Buy.css";

function Buy() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        payment: "Cash on Delivery",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const placeOrder = () => {
        alert("🎉 Order Placed Successfully!");
    };

    return (
        <div className="buy-page">
            <h1>Buy Now</h1>

            <input
                type="text"
                name="name"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={handleChange}
            />

            <input
                type="tel"
                name="phone"
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={handleChange}
            />

            <textarea
                name="address"
                placeholder="Enter Delivery Address"
                value={formData.address}
                onChange={handleChange}
            />

            <select
                name="payment"
                value={formData.payment}
                onChange={handleChange}
            >
                <option>Cash on Delivery</option>
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
            </select>

            <button onClick={placeOrder}>Place Order</button>
        </div>
    );
}

export default Buy;