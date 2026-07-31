import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Chocolates from "./components/Products";
import Cart from "./components/Cart";
import "./App.css";

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    console.error(`Failed to parse ${key}`);
    return fallback;
  }
}

function App() {
  const [cart, setCart] = useState(() => loadFromStorage("chocolateCart", []));
  const [wishlist, setWishlist] = useState(() => loadFromStorage("chocolateWishlist", []));
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("chocolateCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("chocolateWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const toggleWishlist = (id) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(id)
        ? prevWishlist.filter((item) => item !== id)
        : [...prevWishlist, id]
    );
  };

  const getTotalPrice = () => {
    const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    return `$${total.toFixed(2)}`;
  };

  return (
    <div className="app-root">
      <Navbar
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="app-main">
        <Chocolates
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      </main>

      {isCartOpen && (
        <Cart
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemove={removeFromCart}
          total={getTotalPrice()}
        />
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🍫</span>
            <h3>Cacao &amp; Co.</h3>
            <p>Artisan chocolates crafted with passion since 1985</p>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Cacao &amp; Co. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
