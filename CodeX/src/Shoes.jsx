import React, { useState } from "react";
import "./Shoes.css";
import {
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaUserCircle,
  FaStar,
} from "react-icons/fa";

function Shoes() {
  const [cartCount, setCartCount] = useState(0);
  const [category, setCategory] = useState("All");

  const shoes = [
  // ================= MEN =================
  {
    id: 1,
    name: "Nike Air Max 270",
    brand: "Nike",
    category: "Men",
    price: 6999,
    oldPrice: 8999,
    rating: 4.8,
    offer: "22% OFF",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
  {
    id: 2,
    name: "Adidas Ultraboost",
    brand: "Adidas",
    category: "Men",
    price: 7999,
    oldPrice: 9999,
    rating: 4.7,
    offer: "20% OFF",
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=500",
  },
  {
    id: 3,
    name: "Puma RS-X",
    brand: "Puma",
    category: "Men",
    price: 5499,
    oldPrice: 6999,
    rating: 4.6,
    offer: "18% OFF",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500",
  },
  {
    id: 4,
    name: "Reebok Classic",
    brand: "Reebok",
    category: "Men",
    price: 4699,
    oldPrice: 5999,
    rating: 4.5,
    offer: "21% OFF",
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500",
  },
  {
    id: 5,
    name: "Nike Revolution",
    brand: "Nike",
    category: "Men",
    price: 5899,
    oldPrice: 7299,
    rating: 4.7,
    offer: "19% OFF",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500",
  },
  {
    id: 6,
    name: "New Balance 574",
    brand: "New Balance",
    category: "Men",
    price: 6499,
    oldPrice: 7999,
    rating: 4.6,
    offer: "18% OFF",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
  },

  // ================= WOMEN =================
  {
    id: 7,
    name: "Puma Women Runner",
    brand: "Puma",
    category: "Women",
    price: 5299,
    oldPrice: 6699,
    rating: 4.5,
    offer: "20% OFF",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
  },
  {
    id: 8,
    name: "Nike Zoom Fly",
    brand: "Nike",
    category: "Women",
    price: 7499,
    oldPrice: 8999,
    rating: 4.8,
    offer: "17% OFF",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500",
  },
  {
    id: 9,
    name: "Adidas Superstar",
    brand: "Adidas",
    category: "Women",
    price: 6399,
    oldPrice: 7899,
    rating: 4.7,
    offer: "19% OFF",
    image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=500",
  },
  {
    id: 10,
    name: "Skechers Go Walk",
    brand: "Skechers",
    category: "Women",
    price: 4999,
    oldPrice: 6299,
    rating: 4.6,
    offer: "21% OFF",
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500",
  },
  {
    id: 11,
    name: "Fila Fashion",
    brand: "Fila",
    category: "Women",
    price: 4399,
    oldPrice: 5699,
    rating: 4.4,
    offer: "22% OFF",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500",
  },
 
  {
    id: 14,
    name: "Adidas Kids Sport",
    brand: "Adidas",
    category: "Kids",
    price: 3199,
    oldPrice: 4299,
    rating: 4.6,
    offer: "23% OFF",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
  },
  {
    id: 15,
    name: "Puma Kids Sneaker",
    brand: "Puma",
    category: "Kids",
    price: 2799,
    oldPrice: 3599,
    rating: 4.5,
    offer: "22% OFF",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
  },
  
  {
    id: 17,
    name: "Converse Kids",
    brand: "Converse",
    category: "Kids",
    price: 2899,
    oldPrice: 3799,
    rating: 4.6,
    offer: "24% OFF",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
  },
  {
    id: 18,
    name: "Skechers Kids",
    brand: "Skechers",
    category: "Kids",
    price: 3399,
    oldPrice: 4399,
    rating: 4.7,
    offer: "23% OFF",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500",
  },
];

  const filteredShoes =
    category === "All"
      ? shoes
      : shoes.filter((shoe) => shoe.category === category);

  return (
    <div className="page">

      {/* Navbar */}

      <nav className="navbar">

        <h2 className="logo">ShopEase</h2>

        <div className="searchBox">
          <input type="text" placeholder="Search Shoes..." />
          <button>
            <FaSearch />
          </button>
        </div>

        <div className="menu">

          <a href="#">Home</a>
          <a href="#">Shoes</a>
          <a href="#">Orders</a>

          <FaHeart className="icon" />

          <div className="cartIcon">

            <FaShoppingCart className="icon" />

            <span>{cartCount}</span>

          </div>

          <FaUserCircle className="icon" />

        </div>

      </nav>

      {/* Hero */}

      <section className="hero">

        <div className="overlay">

          <h1>SHOES COLLECTION</h1>

          <p>Latest Trending Sneakers</p>

          <button>Shop Now</button>

        </div>

      </section>

      {/* Category Buttons */}

      <div className="categories">

        <button onClick={() => setCategory("All")}>
          All
        </button>

        <button onClick={() => setCategory("Men")}>
          Men
        </button>

        <button onClick={() => setCategory("Women")}>
          Women
        </button>

        <button onClick={() => setCategory("Kids")}>
          Kids
        </button>

      </div>

      {/* Heading */}

      <div className="heading">

        <h2>Trending Shoes</h2>

        <p>{filteredShoes.length} Products</p>

      </div>

      {/* Products */}

      <div className="products">

        {filteredShoes.map((shoe) => (

          <div className="card" key={shoe.id}>

            <span className="offer">
              {shoe.offer}
            </span>

            <FaHeart className="wishlist" />

            <img src={shoe.image} alt={shoe.name} />

            <div className="details">

              <h3>{shoe.name}</h3>

              <p>{shoe.brand}</p>

              <div className="rating">

                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />

                <span>{shoe.rating}</span>

              </div>

              <div className="price">

                <h2>₹{shoe.price}</h2>

                <del>₹{shoe.oldPrice}</del>

              </div>

              <button
                onClick={() =>
                  setCartCount(cartCount + 1)
                }
              >
                Add To Cart
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <footer>

        <h2>ShopEase</h2>

        <p>Premium Shoes Collection</p>

        <p>© 2026 ShopEase</p>

      </footer>

    </div>
  );
}

export default Shoes;