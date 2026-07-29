import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <h2 style={{ padding: "40px", textAlign: "center" }}>Product not found.</h2>;
  }

  // Formatting currency helper
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  const handleAddToCart = () => {
    // Pass product with selected quantity to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-details">
      <div className="image-section">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="details-section">
        <h1 className="product-title">{product.name}</h1>

        <div className="rating-container">
          <span className="rating-badge">⭐ {product.rating}</span>
          <span className="reviews-count">({product.reviews} customer reviews)</span>
        </div>

        {/* Clean, formatted price block */}
        <div className="price-container">
          <span className="current-price">{formattedPrice}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
          {product.discount && (
            <span className="discount-badge">{product.discount} OFF</span>
          )}
        </div>

        <p className="tax-inclusive">Inclusive of all taxes</p>

        <p className="product-description">
          {product.description ||
            "Premium quality accessory crafted with elegant design. Perfect for parties, weddings, and everyday wear."}
        </p>

        {/* Quantity selector */}
        <div className="quantity-selector">
          <label>Quantity:</label>
          <div className="quantity-controls">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className={`add-to-cart-btn ${added ? "success" : ""}`}
            onClick={handleAddToCart}
          >
            {added ? "✓ Added to Cart" : "Add To Cart"}
          </button>
          
          <button
            className="buy-now-btn"
            onClick={() => {
              handleAddToCart();
              navigate("/payment", { state: { total: product.price * quantity } });
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;