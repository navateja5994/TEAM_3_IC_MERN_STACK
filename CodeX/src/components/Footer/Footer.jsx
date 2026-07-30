import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">

        {/* Company */}
        <div className="footer-box">
          <h2 className="footer-logo">🍨 Ice Cream Mall</h2>

          <p>
            Enjoy premium quality ice creams made with fresh ingredients.
            We deliver happiness in every scoop.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-box">
          <h3>Quick Links</h3>

          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#icecream">Ice Cream</a></li>
            <li><a href="#cones">Cones</a></li>
            <li><a href="#sticks">Sticks</a></li>
            <li><a href="#kulfi">Kulfi</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-box">
          <h3>Contact Us</h3>

          <p>
            <FaMapMarkerAlt /> Madanapalli , Andhra Pradesh
          </p>

          <p>
            <FaPhoneAlt /> +91 98765 43210
          </p>

          <p>
            <FaEnvelope /> support@icecreammall.com
          </p>
        </div>

        {/* Social */}
        <div className="footer-box">
          <h3>Follow Us</h3>

          <div className="social-icons">

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Ice Cream  Mall. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;