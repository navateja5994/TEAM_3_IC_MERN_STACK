import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const WishlistContext = createContext();

// Custom Hook
export const useWishlist = () => {
  return useContext(WishlistContext);
};

// Provider
export const WishlistProvider = ({ children }) => {
  // Load wishlist from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("bagworld-wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save whenever wishlist changes
  useEffect(() => {
    localStorage.setItem(
      "bagworld-wishlist",
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);

  // Add to Wishlist
  const addToWishlist = (product) => {
    const exists = wishlistItems.find(
      (item) => item.id === product.id
    );

    if (!exists) {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = (id) => {
    setWishlistItems(
      wishlistItems.filter((item) => item.id !== id)
    );
  };

  // Toggle Wishlist
  const toggleWishlist = (product) => {
    const exists = wishlistItems.find(
      (item) => item.id === product.id
    );

    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Check if product exists
  const isInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};