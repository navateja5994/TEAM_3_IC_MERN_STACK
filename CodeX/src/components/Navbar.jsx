import { Link } from "react-router-dom";
import { FaShoppingCart, FaGem } from "react-icons/fa";
import "./Navbar.css";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { cartItems } = useCart();
  return (
    <nav className="navbar">

     <Link to="/" className="logo">
    <FaGem className="logo-icon" />
    <h2>CodeX Accessories</h2>
</Link>

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