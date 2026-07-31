import "../../styles/WishlistPage.css";

function WishlistPage({ wishlistProducts, onRemove, onAddToCart }) {
  return (
    <section className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <p className="eyebrow">Saved for later</p>
          <h2>Your Wishlist</h2>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="wishlist-empty">
          <p>No favorites yet. Tap the heart on a product to save it.</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistProducts.map((product) => (
            <article className="wishlist-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="wishlist-info">
                <h3>{product.name}</h3>
                <p>{product.brand}</p>
                <strong>{product.price}</strong>
              </div>
              <div className="wishlist-actions">
                <button onClick={() => onAddToCart(product)}>Add to Cart</button>
                <button className="secondary" onClick={() => onRemove(product)}>Remove</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default WishlistPage;