import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      <section className="hero">

        <div className="hero-content">

          <h1>Luxury Accessories Collection</h1>

          <p>
            Discover elegant jewellery and fashion accessories
            crafted to make every moment shine.
          </p>

          <Link to="/products">
            <button>Shop Now</button>
          </Link>

        </div>

      </section>

      <section className="collections">

        <h2>Featured Collections</h2>

        <div className="collection-grid">

          <div className="collection one">
            <h3>Earrings</h3>
          </div>

          <div className="collection two">
            <h3>Necklace Sets</h3>
          </div>

          <div className="collection three">
            <h3>Bracelets</h3>
          </div>

        </div>

      </section>

      <section className="offer">

        <h2>Flat 30% OFF</h2>

        <p>On Selected Fashion Accessories</p>

      </section>

      <section className="features">

        <div>
          <h3>🚚 Free Shipping</h3>
          <p>On Orders Above ₹999</p>
        </div>

        <div>
          <h3>🔒 Secure Payment</h3>
          <p>100% Safe Checkout</p>
        </div>

        <div>
          <h3>💖 Premium Quality</h3>
          <p>Handpicked Designs</p>
        </div>

        <div>
          <h3>↩ Easy Returns</h3>
          <p>7-Day Return Policy</p>
        </div>

      </section>

    </div>
  );
}

export default Home;