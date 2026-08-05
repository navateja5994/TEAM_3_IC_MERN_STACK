import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

function Cart() {
    const { cartItems, removeFromCart } = useContext(CartContext);
    return (
        <>


            <section className="cart-page">
                <h1>🛒 Shopping Cart</h1>

                <div className="cart-container">

                    {cartItems.map((item, index) => (
                        <div className="cart-item" key={index}>
                            <img src={item.image} alt={item.name} />

                            <div className="cart-details">
                                <h3>{item.name}</h3>
                                <p>{item.price}</p>
                                <p>Quantity: 1</p>
                            </div>

                            <button className="remove-btn" onClick={() => removeFromCart(index)}>Remove</button>
                        </div>))}

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <p>Items: {cartItems.length}</p>
                        <button className="checkout-btn">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </section>


        </>
    );
}

export default Cart;