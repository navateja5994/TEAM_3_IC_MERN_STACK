import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section">
          <Link to="/" className="footer-logo">
            <span>Bag</span>World
          </Link>

          <p className="footer-description">
            BagWorld is your one-stop destination for premium travel bags,
            school bags, handbags, sling bags, wallets, purses, and branded
            collections. We bring quality, style, and durability together for
            every journey.
          </p>

          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              🌐
            </a>
            <a href="#" aria-label="Instagram">
              📷
            </a>
            <a href="#" aria-label="Twitter">
              🐦
            </a>
            <a href="#" aria-label="YouTube">
              ▶️
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/travel-bags">Travel Bags</Link>
            </li>

            <li>
              <Link to="/school-bags">School Bags</Link>
            </li>

            <li>
              <Link to="/brands">Brands</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3>Categories</h3>

          <ul>
            <li>
              <Link to="/hand-bags">Hand Bags</Link>
            </li>

            <li>
              <Link to="/sling-bags">Sling Bags</Link>
            </li>

            <li>
              <Link to="/wallets">Men's Wallets</Link>
            </li>

            <li>
              <Link to="/purses">Women's Purses</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>

          <p>📍 India</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ support@bagworld.com</p>

          <p className="footer-support">
            Customer Support available 24/7.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} BagWorld. All Rights Reserved. Designed with ❤️ using React
          & Vite.
        </p>
      </div>
    </footer>
  );
};

export default Footer;