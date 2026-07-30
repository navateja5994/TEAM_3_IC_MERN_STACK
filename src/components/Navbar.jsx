import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import "./Navbar.css";
function Navbar() {
    return (
        <nav className="navbar">
            <h2 className="logo">Sports Store</h2>

            <ul className="nav-links">
                <li>Home</li>
                <li>Products</li>
                <li>Categories</li>
                <li>Offers</li>
                <li>Contact</li>
            </ul>

            <div className="nav-icons">
                <FaSearch />
                <FaShoppingCart />
                <FaUser />
            </div>
        </nav>
    );
}

export default Navbar;