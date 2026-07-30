import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

function SearchBar() {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search guilt-free ice creams..."
      />

      <button className="search-btn">
        <FaSearch />
      </button>
    </div>
  );
}

export default SearchBar;