import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <section className="section container">
        <div className="empty-cart">
          <h2>Your Cart is Empty 🛍️</h2>
          <p>Add your favorite bags to start shopping.</p>

          <Link to="/" className="btn">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <h2 className="cart-title">Shopping Cart</h2>

      <div className="cart-grid">
        {cartItems.map((item) => (
          <div className="cart-card" key={item.id}>
            {/* Product Image */}
            <div className="cart-image">
              <img src={item.image} alt={item.name} />
            </div>

            {/* Product Details */}
            <div className="cart-content">
              <p className="cart-category">{item.category}</p>

              <h3>{item.name}</h3>

              <div className="cart-rating">
                ⭐ {item.rating} / 5
              </div>

              <h4 className="cart-price">
                ₹{item.price}
              </h4>

              {/* Quantity */}
              <div className="quantity-box">
                <button onClick={() => decreaseQuantity(item.id)}>
                  −
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => increaseQuantity(item.id)}>
                  +
                </button>
              </div>

              {/* Subtotal */}
              <h4
                style={{
                  marginTop: "10px",
                  color: "#8B4513",
                }}
              >
                Subtotal : ₹{item.price * item.quantity}
              </h4>

              {/* Remove Button */}
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Total */}
      <div className="cart-total">
        <h2>Total : ₹{cartTotal}</h2>

        <div className="cart-buttons">
          <button className="btn" onClick={clearCart}>
            Clear Cart
          </button>

          <Link
            to="/checkout"
            className="btn"
            style={{
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Cart;