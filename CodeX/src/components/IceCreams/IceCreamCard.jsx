import "./IceCreamCard.css";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";

function IceCreamCard({ product }) {
  return (
    <div className="icecream-card">

      {/* Wishlist */}
      <button className="wishlist-btn">
        <FaHeart />
      </button>

      {/* Product Image */}
      <div className="card-image">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Product Details */}
      <div className="card-content">

        <h3>{product.name}</h3>

        <div className="rating">
          <FaStar className="star" />
          <span>{product.rating}</span>
        </div>

        <h2 className="price">₹{product.price}</h2>

        <button className="cart-btn">
          <FaShoppingCart />
          <span>Add to Cart</span>
        </button>

      </div>

    </div>
  );
}

export default IceCreamCard;