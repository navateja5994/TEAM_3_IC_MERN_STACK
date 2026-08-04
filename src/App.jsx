import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import QuickViewModal from './components/QuickViewModal';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { PRODUCTS } from './data/products';

export default function App() {
  // State for Cart & Wishlist with local storage fallback
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dressify_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dressify_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter & Search & Sort states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

// Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync cart & wishlist to local storage
  useEffect(() => {
    localStorage.setItem('dressify_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('dressify_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Helper for displaying toast notifications
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Cart Operations
  const handleAddToCart = (product, quantity = 1, size = 'M') => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity, selectedSize: size }];
    });
    showToast(`Added "${product.name}" to bag!`, 'cart');
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    showToast(`Item removed from bag`, 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Operations
  const handleToggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from Wishlist`, 'wishlist');
    } else {
      setWishlistItems((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to Wishlist!`, 'wishlist');
    }
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
  };

  // Reset Filters action
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedPriceRange('ALL');
    setSelectedRating(0);
    setSortBy('default');
    setSearchQuery('');
  };

  // Filter & Sorting memoization logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) return false;
      }

      // 3. Price Filter
      if (selectedPriceRange !== 'ALL') {
        const price = product.price;
        if (selectedPriceRange === '0-500' && (price < 0 || price > 500)) return false;
        if (selectedPriceRange === '500-1000' && (price <= 500 || price > 1000)) return false;
        if (selectedPriceRange === '1000-2000' && (price <= 1000 || price > 2000)) return false;
        if (selectedPriceRange === '2000-ABOVE' && price <= 2000) return false;
      }

      // 4. Rating Filter
      if (selectedRating > 0) {
        if (selectedRating === 5 && product.rating < 4.9) return false;
        if (selectedRating < 5 && product.rating < selectedRating) return false;
      }

      return true;
    }).sort((a, b) => {
      // 5. Sorting Logic
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [selectedCategory, searchQuery, selectedPriceRange, selectedRating, sortBy]);

  // Active filters count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedPriceRange !== 'ALL') count++;
    if (selectedRating > 0) count++;
    if (sortBy !== 'default') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedCategory, selectedPriceRange, selectedRating, sortBy, searchQuery]);

const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const wishlistIds = wishlistItems.map((item) => item.id);
  const cartItemIds = cartItems.map((item) => item.id);

  // Checkout totals
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const cartShippingCost = isFreeShipping ? 0 : 99;
  const cartFinalTotal = cartSubtotal + cartShippingCost;

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCompleteOrder = (orderInfo) => {
    setCartItems([]);
    showToast(`Order ${orderInfo.orderId} placed successfully! 🎉`, 'order');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Hero Section */}
      <Hero onSelectCategory={setSelectedCategory} />

      {/* Main Content Area */}
      <main className="container" style={{ flexGrow: 1 }}>
        
        {/* Filters & Sorting Bar */}
        <Filters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedPriceRange={selectedPriceRange}
          onSelectPriceRange={setSelectedPriceRange}
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          wishlistIds={wishlistIds}
          cartItemIds={cartItemIds}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={setQuickViewProduct}
          onResetFilters={handleResetFilters}
          selectedCategory={selectedCategory}
        />

      </main>

      {/* Footer */}
      <Footer onSelectCategory={setSelectedCategory} />

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleOpenCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        shippingCost={cartShippingCost}
        finalTotal={cartFinalTotal}
        totalItemsCount={cartCount}
        onPlaceOrder={handleCompleteOrder}
      />

      {/* Wishlist Drawer */}
      <Wishlist
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={(id) => handleToggleWishlist({ id })}
        onMoveToCart={handleMoveToCart}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          isWishlisted={wishlistIds.includes(quickViewProduct.id)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Toast Notification Popup */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
