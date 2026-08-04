import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Rating from "./Rating";
import "./ProductCard.css";

function ProductCard({ product }) {

  const { addToCart } = useCart();

  return (

    <div className="product-card">

      {product.discount && (
        <span className="discount">
          {product.discount}
        </span>
      )}

      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
        />
      </Link>

      <Link
        to={`/product/${product._id}`}
        className="product-link"
      >
        <h3>{product.name}</h3>
      </Link>

      <Rating
        rating={Number(product.rating)}
        reviews={Number(product.reviews)}
      />

      <h2>₹{product.price}</h2>

      <button onClick={() => addToCart(product)}>
        Add To Cart
      </button>

    </div>

  );

}

export default ProductCard;