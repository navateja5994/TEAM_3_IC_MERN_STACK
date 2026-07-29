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

const links = [
  "Home",
  "Makeup",
  "Skincare",
  "Hair Care",
  "Fragrance",
  "Bath & Body",
  "Beauty Tools",
  "Offers",
];

function Navbar({ onCategorySelect }) {
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
        <FaSearch />
        <FaHeart />
        <FaShoppingCart />
        <FaUser />
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