import { useState } from "react";
import "./Bookshop.css";
import atomicHabits from "../../assets/Books/atomic-habits.jpg";
import alchemist from "../../assets/Books/the-alchemist.jpg";
import ikigai from "../../assets/Books/ikigai.jpg";
import psychology from "../../assets/Books/psychology-of-money.jpg";
import richDad from "../../assets/books/rich-dad-poor-dad.jpg";
import harryPotter from "../../assets/books/harry-potter.jpg";
const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: "₹499",
    rating: "⭐⭐⭐⭐⭐ (4.9)",
    image: atomicHabits,
     category: "Education",
    bestSeller: true,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: "₹399",
    rating: "⭐⭐⭐⭐☆ (4.7)",
    image: alchemist,
    category: "Fiction",
    bestSeller: false,
  },
  {
    title: "Ikigai",
    author: "Héctor García",
    price: "₹450",
    rating: "⭐⭐⭐⭐⭐ (4.8)",
    image: ikigai,
    category: "Education",
    bestSeller: false,
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: "₹550",
    rating: "⭐⭐⭐⭐⭐ (4.9)",
    image: psychology,
    category: "Business",
    bestSeller: true,
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: "₹420",
    rating: "⭐⭐⭐⭐☆ (4.6)",
    image: richDad,
    category: "Business",
    bestSeller: false,
  },
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    price: "₹599",
    rating: "⭐⭐⭐⭐⭐ (5.0)",
    image: harryPotter,
    category: "Kids",
    bestSeller: true,
  },
  
];
function Bookshop() {
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [category, setCategory] = useState("All");
const addToCart = (book) => {
  const existingBook = cart.find((item) => item.title === book.title);

  if (existingBook) {
    const updatedCart = cart.map((item) =>
      item.title === book.title
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updatedCart);
  } else {
    setCart([...cart, { ...book, quantity: 1 }]);
  }
};
const removeFromCart = (title) => {
  const updatedCart = cart
    .map((item) =>
      item.title === title
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  setCart(updatedCart);
};
const totalItems = cart.reduce(
  (total, item) => total + item.quantity,
  0
);
const totalPrice = cart.reduce((total, item) => {
  const price = Number(item.price.replace("₹", ""));
  return total + price * item.quantity;
}, 0);
const filteredBooks = books.filter(
  (book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || book.category === category)
);
const checkout = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("🎉 Thank you for your purchase!");

  setCart([]);
};
  return (
    <div className="bookshop-container">

      <header className="hero">
        <h1>📚 Book Haven</h1>
        <p>Discover your next favorite book at the mall.</p>

      <input
  type="text"
  placeholder="🔍 Search books..."
  className="search-bar"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
<div className="cart-info">
  🛒 Cart ({totalItems})
</div>
      </header>
<section className="categories">
  <button
    className={category === "All" ? "active" : ""}
    onClick={() => setCategory("All")}
  >
    All
  </button>

  <button
    className={category === "Fiction" ? "active" : ""}
    onClick={() => setCategory("Fiction")}
  >
    Fiction
  </button>

  <button
    className={category === "Education" ? "active" : ""}
    onClick={() => setCategory("Education")}
  >
    Education
  </button>

  <button
    className={category === "Programming" ? "active" : ""}
    onClick={() => setCategory("Programming")}
  >
    Programming
  </button>

  <button
    className={category === "Kids" ? "active" : ""}
    onClick={() => setCategory("Kids")}
  >
    Kids
  </button>

  <button
    className={category === "Business" ? "active" : ""}
    onClick={() => setCategory("Business")}
  >
    Business
  </button>
</section>

<section className="featured-books">
  <h2>Featured Books</h2>

 <div className="book-grid">
  {filteredBooks.length > 0 ? (
    filteredBooks.map((book, index) => (
      <div className="book-card" key={index}>

        {book.bestSeller && (
          <span className="badge">Best Seller</span>
        )}

        <img src={book.image} alt={book.title} />

        <h3>{book.title}</h3>

        <p>{book.author}</p>

        <h4>{book.price}</h4>

        <p className="rating">{book.rating}</p>

        <button onClick={() => addToCart(book)}>
          Add to Cart
        </button>

      </div>
    ))
  ) : (
    <div className="no-books">
      <h3>📚 No books available in this category.</h3>
    </div>
  )}
</div>
<section className="cart-section">

  <h2>Shopping Cart</h2>

 {cart.length === 0 ? (
  <p>Your cart is empty.</p>
) : (
  <>
    <ul>
      {cart.map((item, index) => (
        <li key={index} className="cart-item">

          <div className="cart-details">

  <img
    src={item.image}
    alt={item.title}
    className="cart-image"
  />

  <div>

    <strong>{item.title}</strong>

    <p>{item.price}</p>

    <p>Qty: {item.quantity}</p>

  </div>

</div>
          <button
            className="remove-btn"
            onClick={() => removeFromCart(item.title)}
          >
            Remove
          </button>

        </li>
      ))}
    </ul>

    <hr />

    <h3 className="cart-total">
      Total Price: ₹{totalPrice}
    </h3>
    <button
  className="checkout-btn"
  onClick={checkout}
>
  Proceed to Checkout
</button>
  </>
)}

</section>
<section className="new-arrivals">

  <h2>📚 New Arrivals</h2>

  <div className="arrival-container">

    <div className="arrival-card">
      <h3>Think Like a Monk</h3>
      <p>Jay Shetty</p>
    </div>

    <div className="arrival-card">
      <h3>Wings of Fire</h3>
      <p>Dr. A.P.J. Abdul Kalam</p>
    </div>

    <div className="arrival-card">
      <h3>Deep Work</h3>
      <p>Cal Newport</p>
    </div>

  </div>

</section>
<section className="why-us">

  <h2>Why Choose Our Bookshop?</h2>

  <div className="features">

    <div className="feature-card">
      <h3>📚 Huge Collection</h3>
      <p>
        Explore thousands of books across fiction, education, technology,
        self-help, business, and more.
      </p>
    </div>

    <div className="feature-card">
      <h3>💰 Affordable Prices</h3>
      <p>
        Get your favorite books at the best prices with exciting seasonal
        discounts.
      </p>
    </div>

    <div className="feature-card">
      <h3>🚚 Fast Pickup</h3>
      <p>
        Buy online and collect your books from the mall store quickly and
        conveniently.
      </p>
    </div>

  </div>

</section>
</section>
<footer className="footer">

  <div className="footer-container">

    <div className="footer-box">
      <h3>📚 Book Haven</h3>
      <p>Your one-stop destination for books at the mall.</p>
    </div>

    <div className="footer-box">
      <h3>Quick Links</h3>
      <ul>
        <li>Home</li>
        <li>Featured Books</li>
        <li>New Arrivals</li>
        <li>Contact</li>
      </ul>
    </div>

    <div className="footer-box">
      <h3>Contact Us</h3>
      <p>📍 Mall Road, City Center</p>
      <p>📞 +91 98765 43210</p>
      <p>📧 support@bookhaven.com</p>
    </div>
  </div>

  <hr />

  <p className="copyright">
    © 2026 Book Haven. All Rights Reserved.
  </p>

</footer>
 </div>
  )
};

export default Bookshop;