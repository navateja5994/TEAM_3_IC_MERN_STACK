import "./Navbar.css";
import SearchBar from "./SearchBar";

import {
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";

function Navbar() {
  return (
    <header className="navbar">

      <div className="container navbar-container">

        {/* Logo */}

        <div className="logo">
          🍨
          <span>GuiltFree Scoops</span>
        </div>

        {/* Navigation */}

        <nav>

          <ul className="nav-links">

            <li>
              <a href="#">Home</a>
            </li>

            <li>
              <a href="#icecream">Protein Scoops</a>
            </li>

            <li>
              <a href="#cones">Protein Cones</a>
            </li>

            <li>
              <a href="#sticks">Protein Sticks</a>
            </li>

            <li>
              <a href="#kulfi">Protein Kulfi</a>
            </li>

          </ul>

        </nav>

        {/* Right Side */}

        <div className="nav-right">

          <SearchBar />

          <div className="nav-icons">

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;