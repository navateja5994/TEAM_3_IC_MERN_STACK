import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import "./Bookshop.css";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import atomicHabits from "../../assets/Books/atomic-habits.jpg";
import alchemist from "../../assets/Books/the-alchemist.jpg";
import ikigai from "../../assets/Books/ikigai.jpg";
import psychology from "../../assets/Books/psychology-of-money.jpg";
import richDad from "../../assets/Books/rich-dad-poor-dad.jpg";
import harryPotter from "../../assets/Books/harry-potter.jpg";
import thinkLikeAMonk from "../../assets/Books/think-like-a-monk.jpg";
import deepWork from "../../assets/Books/deep-work.jpg";
import zeroToOne from "../../assets/Books/zero-to-one.jpg";
import leanStartup from "../../assets/Books/the-lean-startup.jpg";
import cleanCode from "../../assets/Books/clean-code.jpg";
import javaReference from "../../assets/Books/java-complete-reference.jpg";
import eloquentJS from "../../assets/Books/eloquent-javascript.jpg";
import pythonCrash from "../../assets/Books/python-crash-course.jpg";
import silentPatient from "../../assets/Books/the-silent-patient.jpg";
import mockingbird from "../../assets/Books/to-kill-a-mockingbird.jpg";
import pride from "../../assets/Books/pride-and-prejudice.jpg";
import charlie from "../../assets/Books/charlie-and-the-chocolate-factory.jpg";
import matilda from "../../assets/Books/matilda.jpg";
import jungleBook from "../../assets/Books/the-jungle-book.jpg";
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
  title: "Think Like a Monk",
  author: "Jay Shetty",
  price: "₹499",
  rating: "⭐⭐⭐⭐⭐ (4.8)",
  image: thinkLikeAMonk,
  category: "Education",
  bestSeller: true,
},
{
  title: "Deep Work",
  author: "Cal Newport",
  price: "₹520",
  rating: "⭐⭐⭐⭐☆ (4.7)",
  image: deepWork,
  category: "Education",
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
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: "₹399",
    rating: "⭐⭐⭐⭐☆ (4.7)",
    image: alchemist,
    category: "Fiction",
    bestSeller: false,
  },
{
  title: "The Silent Patient",
  author: "Alex Michaelides",
  price: "₹520",
  rating: "⭐⭐⭐⭐⭐ (4.8)",
  image: silentPatient,
  category: "Fiction",
  bestSeller: true,
},
{
  title: "To Kill a Mockingbird",
  author: "Harper Lee",
  price: "₹450",
  rating: "⭐⭐⭐⭐⭐ (4.9)",
  image: mockingbird,
  category: "Fiction",
  bestSeller: false,
},
{
  title: "Pride and Prejudice",
  author: "Jane Austen",
  price: "₹380",
  rating: "⭐⭐⭐⭐☆ (4.7)",
  image: pride,
  category: "Fiction",
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
  },{
  title: "Zero to One",
  author: "Peter Thiel",
  price: "₹480",
  rating: "⭐⭐⭐⭐⭐ (4.8)",
  image: zeroToOne,
  category: "Business",
  bestSeller: true,
},
{
  title: "The Lean Startup",
  author: "Eric Ries",
  price: "₹530",
  rating: "⭐⭐⭐⭐☆ (4.7)",
  image: leanStartup,
  category: "Business",
  bestSeller: false,
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
  title: "Clean Code",
  author: "Robert C. Martin",
  price: "₹699",
  rating: "⭐⭐⭐⭐⭐ (4.9)",
  image: cleanCode,
  category: "Programming",
  bestSeller: true,
},
{
  title: "Java: The Complete Reference",
  author: "Herbert Schildt",
  price: "₹850",
  rating: "⭐⭐⭐⭐⭐ (4.8)",
  image: javaReference,
  category: "Programming",
  bestSeller: true,
},
{
  title: "Eloquent JavaScript",
  author: "Marijn Haverbeke",
  price: "₹650",
  rating: "⭐⭐⭐⭐☆ (4.7)",
  image: eloquentJS,
  category: "Programming",
  bestSeller: false,
},
{
  title: "Python Crash Course",
  author: "Eric Matthes",
  price: "₹720",
  rating: "⭐⭐⭐⭐⭐ (4.8)",
  image: pythonCrash,
  category: "Programming",
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
 {
  title: "Charlie and the Chocolate Factory",
  author: "Roald Dahl",
  price: "₹350",
  rating: "⭐⭐⭐⭐☆ (4.7)",
  image: charlie,
  category: "Kids",
  bestSeller: false,
},
{
  title: "Matilda",
  author: "Roald Dahl",
  price: "₹340",
  rating: "⭐⭐⭐⭐⭐ (4.8)",
  image: matilda,
  category: "Kids",
  bestSeller: false,
},
{
  title: "The Jungle Book",
  author: "Rudyard Kipling",
  price: "₹320",
  rating: "⭐⭐⭐⭐☆ (4.6)",
  image: jungleBook,
  category: "Kids",
  bestSeller: false,
}, 
];
function Bookshop() {
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
});
    const [category, setCategory] = useState("All");
const [selectedBook, setSelectedBook] = useState(null);
const [wishlist, setWishlist] = useState(() => {
  const savedWishlist = localStorage.getItem("wishlist");
  return savedWishlist ? JSON.parse(savedWishlist) : [];
});
 useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
useEffect(() => {
  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );
}, [wishlist]);
const addToCart = (book) => {
  const existingBook = cart.find((item) => item.title === book.title);

  if (existingBook) {
    const updatedCart = cart.map((item) =>
      item.title === book.title
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updatedCart);
    toast.success(`${book.title} quantity updated!`);
  } else {
    setCart([...cart, { ...book, quantity: 1 }]);
    toast.success(`${book.title} added to cart!`);
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
  toast.info("Book removed from cart");
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
    toast.error("Your cart is empty!");
    return;
  }

  toast.success("🎉 Order placed successfully!");

  setCart([]);
  localStorage.removeItem("cart");
};
const toggleWishlist = (book) => {
  const exists = wishlist.some(
    (item) => item.title === book.title
  );

  if (exists) {
    setWishlist(
      wishlist.filter(
        (item) => item.title !== book.title
      )
    );

    toast.info("Removed from Wishlist");
  } else {
    setWishlist([...wishlist, book]);

    toast.success("Added to Wishlist ❤️");
  }
};
  return (
    <div className="bookshop-container">

<header className="hero">

  <div className="hero-left">

    <h1>📚 Book Haven</h1>

    <p>Discover your next favorite book at the mall.</p>

    <input
      type="text"
      placeholder="🔍 Search books..."
      className="search-bar"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

  </div>

  <div className="hero-right">
<div
  className="cart-info"
  onClick={() =>
    document
      .getElementById("cart-section")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
>
    <FaShoppingCart />
    <span>Cart ({totalItems})</span>
</div>

<div className="wishlist-info">
    <FaHeart />
    <span>Wishlist ({wishlist.length})</span>
</div>
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
<span
  className="wishlist-icon"
  onClick={() => toggleWishlist(book)}
>
  {wishlist.some((item) => item.title === book.title)
    ? "❤️"
    : "🤍"}
</span>
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
<button
  className="details-btn"
  onClick={() => setSelectedBook(book)}
>
  View Details
</button>
      </div>
    ))
  ) : (
    <div className="no-books">
      <h3>📚 No books available in this category.</h3>
    </div>
  )}
</div>
<section id="cart-section" className="cart-section">

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
{selectedBook && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedBook(null)}
  >
    <div
      className="book-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={selectedBook.image}
        alt={selectedBook.title}
      />

      <h2>{selectedBook.title}</h2>

      <p><strong>Author:</strong> {selectedBook.author}</p>

      <p><strong>Category:</strong> {selectedBook.category}</p>

      <p><strong>Price:</strong> {selectedBook.price}</p>

      <p><strong>Rating:</strong> {selectedBook.rating}</p>

      <p>
        <strong>Status:</strong>{" "}
        {selectedBook.bestSeller
          ? "Best Seller"
          : "Popular Book"}
      </p>

      <button
        onClick={() => {
          addToCart(selectedBook);
          setSelectedBook(null);
        }}
      >
        Add to Cart
      </button>

      <button
        className="close-btn"
        onClick={() => setSelectedBook(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
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
<ToastContainer
  position="top-right"
  autoClose={2000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  theme="colored"
/>
 </div>
  )
};

export default Bookshop;