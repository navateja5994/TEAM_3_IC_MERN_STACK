import { motion } from "framer-motion";
import { FaHeart, FaEye, FaShoppingCart, FaStar } from "react-icons/fa";
import "../styles/ProductCard.css";

function ProductCard({ product, compact = false }) {
  return (
    <motion.article
      className={`product-card ${compact ? "compact" : ""}`}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
        <span className="discount-badge">{product.discount}</span>
        <button className="wishlist-btn" aria-label="Add to wishlist">
          <FaHeart />
        </button>
      </div>

      <div className="product-info">
        <p className="brand">{product.brand}</p>
        <h3>{product.name}</h3>
        <div className="rating-row">
          <span className="stars">
            <FaStar /> {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="price-row">
          <div>
            <span className="current-price">{product.price}</span>
            <span className="old-price">{product.oldPrice}</span>
          </div>
          <button className="icon-btn">
            <FaEye />
          </button>
        </div>
        <button className="add-btn">
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </motion.article>
  );
}

export default ProductCard;
