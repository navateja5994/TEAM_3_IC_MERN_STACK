import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    brand,
    category,
    price,
    rating,
    image,
  } = product;

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const favourite = isInWishlist(id);

  return (
    <div className="product-card">

      {/* Image */}

      <div className="product-image">

        <img src={image} alt={name} />

        <span className="product-brand">
          {brand}
        </span>

        <button
          className="wishlist-btn"
          onClick={() => toggleWishlist(product)}
        >
          {favourite ? "❤️" : "🤍"}
        </button>

      </div>

      {/* Content */}

      <div className="product-content">

        <p className="product-category">
          {category}
        </p>

        <h3 className="product-name">
          {name}
        </h3>

        <div className="product-rating">
          ⭐ {rating} / 5
        </div>

        <div className="product-footer">

          <span className="product-price">
            ₹{price}
          </span>

        </div>

        <div className="product-buttons">

          <button
            className="cart-btn"
            onClick={() => addToCart(product)}
          >
            🛍️ Add to Cart
          </button>

          <Link
            to={`/product/${id}`}
            className="view-btn"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;