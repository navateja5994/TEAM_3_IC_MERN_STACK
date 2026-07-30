import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  if (!product) {
    return (
      <section className="section container">
        <h2>Product Not Found</h2>
      </section>
    );
  }

  const favourite = isInWishlist(product.id);

  return (
    <section className="section container">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        {/* Product Image */}

        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 12px 30px rgba(0,0,0,.15)",
          }}
        />

        {/* Product Info */}

        <div>
          <p
            style={{
              color: "#888",
              fontSize: "14px",
            }}
          >
            {product.category}
          </p>

          <h1
            style={{
              fontSize: "2.3rem",
              marginBottom: "10px",
            }}
          >
            {product.name}
          </h1>

          <h3
            style={{
              color: "#8b4513",
              marginBottom: "15px",
            }}
          >
            {product.brand}
          </h3>

          <h2
            style={{
              color: "#b76e79",
              marginBottom: "20px",
            }}
          >
            ₹{product.price}
          </h2>

          <p
            style={{
              marginBottom: "20px",
            }}
          >
            ⭐ {product.rating} / 5
          </p>

          <p
            style={{
              lineHeight: "1.8",
              marginBottom: "35px",
            }}
          >
            {product.description}
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn"
              onClick={() => addToCart(product)}
            >
              🛍️ Add to Cart
            </button>

            <button
              className="btn"
              style={{
                background: favourite
                  ? "#d9534f"
                  : "#b76e79",
              }}
              onClick={() =>
                toggleWishlist(product)
              }
            >
              {favourite
                ? "❤️ Remove Wishlist"
                : "🤍 Add Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;