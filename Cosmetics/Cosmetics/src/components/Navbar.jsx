import { useState } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaGem,
} from "react-icons/fa";

import "../styles/Navbar.css";

const links = ["Home", "Makeup", "Skincare", "Hair Care", "Fragrance", "Offers"];

function Navbar({
  onCategorySelect,
  onNavigateToWishlist,
  onNavigateToCart,
  wishlistCount = 0,
  cartCount = 0,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (link) => {
    setMenuOpen(false);
    if (onCategorySelect) onCategorySelect(link);
  };

  return (
    <nav className="navbar">
      <button className="logo" onClick={() => handleClick("Home")}>
        <span>
          <FaGem />
        </span>
        Beauty Bliss
      </button>

      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        {links.map((link) => (
          <li key={link}>
            <button className="nav-link" onClick={() => handleClick(link)}>
              {link}
            </button>
          </li>
        ))}
      </ul>

      <div className="icons">
        <button className="icon-button" aria-label="Search">
          <FaSearch />
        </button>
        <button className="icon-button" aria-label="Wishlist" onClick={() => onNavigateToWishlist?.()}>
          <FaHeart />
          {wishlistCount > 0 ? <span className="icon-badge">{wishlistCount}</span> : null}
        </button>
        <button className="icon-button cart-button" aria-label="Cart" onClick={() => onNavigateToCart?.()}>
          <FaShoppingCart />
          <span className="cart-label">View Cart</span>
          {cartCount > 0 ? <span className="icon-badge">{cartCount}</span> : null}
        </button>
        <button className="icon-button" aria-label="Account">
          <FaUser />
        </button>
      </div>

      <button
        type="button"
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
}

export default Navbar;