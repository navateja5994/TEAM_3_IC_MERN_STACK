import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Cart.css";

function Cart() {
    return (
        <>
            <Navbar />

            <section className="cart-page">
                <h1>🛒 Shopping Cart</h1>

                <div className="cart-container">
                    <div className="cart-item">
                        <img
                            src="https://via.placeholder.com/120"
                            alt="Product"
                        />

                        <div className="cart-details">
                            <h3>Running Shoes</h3>
                            <p>Price: ₹2,499</p>
                            <p>Quantity: 1</p>
                        </div>

                        <button className="remove-btn">Remove</button>
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <p>Total: ₹2,499</p>
                        <button className="checkout-btn">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Cart;