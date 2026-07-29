import { Link } from "react-router-dom";
import { FaShoppingCart, FaGem } from "react-icons/fa";
import "./Navbar.css";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { cartItems } = useCart();
  return (
    <nav className="navbar">

      <div className="logo">
        <FaGem className="logo-icon" />
        <h2>CodeX Accessories</h2>
      </div>

      <ul className="nav-links">

        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
            <Link to="/products">Products</Link>
        </li>

        <li>
          <Link to="/cart">
  <FaShoppingCart />
  Cart ({cartItems.length})
</Link>
        </li>

        <li>
          <Link to="/checkout">
            Checkout
          </Link>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;