import "../styles/Cart.css";

function Cart({ cart, onClose, onRemove, total }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="cart-overlay" onClick={handleOverlayClick}>
      <div className="cart-slide" role="dialog" aria-modal="true" aria-label="Shopping Cart">
        <header className="cart-header">
          <div className="cart-header-left">
            <span className="cart-header-icon">🛒</span>
            <h2>Shopping Cart</h2>
            <span className="cart-header-count">{cart.length}</span>
          </div>
          <button
            className="close-cart-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🍫</span>
              <h3>Your cart is empty</h3>
              <p>Explore our delicious chocolate collection and add your favorites!</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div className="cart-card" key={`${item.id}-${index}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80";
                  }}
                />
                <div className="cart-card-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="cart-card-price">{item.price}</span>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <footer className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total Amount</span>
              <span className="cart-total-amount">{total}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={() => alert(`Thank you for your order! Total: ${total}`)}
            >
              Proceed to Checkout
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

export default Cart;
