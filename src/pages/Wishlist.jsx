import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "./Wishlist.css";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Empty Wishlist
  if (wishlistItems.length === 0) {
    return (
      <section className="section container">
        <div className="empty-wishlist">
          <h2>Your Wishlist is Empty ❤️</h2>

          <p>Save your favorite bags here.</p>

          <Link to="/" className="btn">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  // Wishlist with products
  return (
    <section className="section container">

      <h2 className="page-title">
        My Wishlist ❤️
      </h2>

      <div className="wishlist-grid">

        {wishlistItems.map((item) => (

          <div className="wishlist-card" key={item.id}>

            <div className="wishlist-image">
              <img
                src={item.image}
                alt={item.name}
              />
            </div>

            <div className="wishlist-content">

              <p className="wishlist-category">
                {item.category}
              </p>

              <h3 className="wishlist-name">
                {item.name}
              </h3>

              <div className="wishlist-rating">
                ⭐ {item.rating} / 5
              </div>

              <h4 className="wishlist-price">
                ₹{item.price}
              </h4>

              <div className="wishlist-buttons">

                <button
                  className="cart-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  Remove
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Wishlist;