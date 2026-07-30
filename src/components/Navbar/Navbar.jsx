import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <span className="logo-highlight">Bag</span>World
        </Link>

        {/* Navigation */}
     <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

  <NavLink to="/" onClick={closeMenu}>
    Home
  </NavLink>

  <div className="dropdown">

    <button className="drop-btn">
      Categories ▾
    </button>

    <div className="dropdown-content">

      <NavLink to="/travel-bags" onClick={closeMenu}>
        Travel Bags
      </NavLink>

      <NavLink to="/school-bags" onClick={closeMenu}>
        School Bags
      </NavLink>

      <NavLink to="/hand-bags" onClick={closeMenu}>
        Hand Bags
      </NavLink>

      <NavLink to="/sling-bags" onClick={closeMenu}>
        Sling Bags
      </NavLink>

      <NavLink to="/wallets" onClick={closeMenu}>
        Wallets
      </NavLink>

      <NavLink to="/purses" onClick={closeMenu}>
        Purses
      </NavLink>

    </div>

  </div>

  <NavLink to="/new-arrivals" onClick={closeMenu}>
    New Arrivals
  </NavLink>

  <NavLink to="/offers" onClick={closeMenu}>
    Offers
  </NavLink>

  <NavLink to="/about" onClick={closeMenu}>
    About
  </NavLink>

  <NavLink to="/contact" onClick={closeMenu}>
    Contact
  </NavLink>

</nav>

        {/* Icons */}
        <div className="navbar-actions">

          {/* Search */}
          <Link
            to="/search"
            className="icon-btn"
            onClick={closeMenu}
          >
            🔍
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="icon-btn badge-btn"
            onClick={closeMenu}
          >
            ❤️

            {wishlistCount > 0 && (
              <span className="badge">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="icon-btn badge-btn"
            onClick={closeMenu}
          >
            🛍️

            {cartCount > 0 && (
              <span className="badge">
                {cartCount}
              </span>
            )}
          </Link>

        </div>

        {/* Mobile */}
        <button
          className={`menu-toggle ${
            menuOpen ? "open" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
};

export default Navbar;