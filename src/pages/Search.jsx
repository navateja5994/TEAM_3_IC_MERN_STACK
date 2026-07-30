import { useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";

function Search() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.brand.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="section container">
      <h2>Search Bags</h2>

      <input
        type="text"
        placeholder="Search by product, brand or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginBottom: "40px",
          fontSize: "16px",
          outline: "none",
        }}
      />

      {filteredProducts.length === 0 ? (
        <h3>No products found 😔</h3>
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                />
              </div>

              <div className="product-content">
                <h3>{product.name}</h3>

                <p>{product.brand}</p>

                <h4
                  style={{
                    color: "#b76e79",
                    margin: "10px 0",
                  }}
                >
                  ₹{product.price}
                </h4>

                <Link
                  to={`/product/${product.id}`}
                  className="btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Search;