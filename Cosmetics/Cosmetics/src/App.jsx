import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Cosmetics from "./pages/Cosmetics";
import CategoryPage from "./pages/CategoryPage";
import Footer from "./components/Footer";
import CartPage from "./styles/pages/Cart";
import WishlistPage from "./styles/pages/Wishlist";
import { products } from "./data/product";

function App() {
  const [selectedPage, setSelectedPage] = useState("Home");
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message) => setToast(message);

  const toggleWishlist = (product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`${product.name} removed from wishlist`);
        return prev.filter((id) => id !== product.id);
      }

      showToast(`${product.name} added to wishlist`);
      return [...prev, product.id];
    });
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
    setOrderConfirmed(false);
    showToast(`${product.name} added to cart`);
  };

  const updateCartQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const placeOrder = () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty");
      return;
    }

    setOrderConfirmed(true);
    setCartItems([]);
    showToast("Order placed successfully. Thank you!");
  };

  const handleNavigate = (page) => {
    setSelectedPage(page);
    setOrderConfirmed(false);
  };

  const wishlistProducts = products.filter((product) => wishlistIds.includes(product.id));
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page-shell">
      <Navbar
        onCategorySelect={handleNavigate}
        onNavigateToWishlist={() => handleNavigate("Wishlist")}
        onNavigateToCart={() => handleNavigate("Cart")}
        wishlistCount={wishlistProducts.length}
        cartCount={cartCount}
      />
      <main>
        {selectedPage === "Home" ? (
          <Cosmetics
            onCategorySelect={handleNavigate}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistIds={wishlistIds}
          />
        ) : selectedPage === "Wishlist" ? (
          <WishlistPage
            wishlistProducts={wishlistProducts}
            onRemove={toggleWishlist}
            onAddToCart={addToCart}
          />
        ) : selectedPage === "Cart" ? (
          <CartPage
            cartItems={cartItems}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveFromCart={removeFromCart}
            onPlaceOrder={placeOrder}
            orderConfirmed={orderConfirmed}
          />
        ) : (
          <CategoryPage
            category={selectedPage}
            products={products}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}
      </main>
      <Footer />
      {toast ? <div className="app-toast">{toast}</div> : null}
    </div>
  );
}

export default App;