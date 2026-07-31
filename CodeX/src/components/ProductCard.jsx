import "../styles/ProductCard.css";

function ProductCard({ product, addToCart, toggleWishlist, isWishlisted }) {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80";
          }}
        />
        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          {renderStars(product.rating)}
          <span className="rating-text">({product.rating})</span>
        </div>

        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <span className="product-price">{product.price}</span>
        </div>

        <button
          className="add-to-cart-btn"
          onClick={() => addToCart(product)}
        >
          <span className="cart-icon">🛒</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
