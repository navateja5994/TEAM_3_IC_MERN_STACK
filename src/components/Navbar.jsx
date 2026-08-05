import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <h2>MR Sports</h2>
                <h3>(Mrudula initials style)</h3>
            </div>

            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">Products</Link></li>
                <li><Link to="/">Categories</Link></li>
                <li><Link to="/">Offers</Link></li>
                <li><Link to="/">Contact</Link></li>
            </ul>

            <div className="nav-icons">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products..."
                    />
                </div>
                <FaUser />
                <Link to="/cart">
                    <FaShoppingCart />
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;