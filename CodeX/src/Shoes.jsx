import React, { useState } from "react";
import "./Shoes.css";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

function Shoes() {
  const [shoes] = useState([
    {
      id: 1,
      name: "Nike Air Max 270",
      brand: "Nike",
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
      price: 5499,
      oldPrice: 6999,
      rating: 4.6,
      offer: "18% OFF",
      image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500",
    },
    {
      id: 4,
      name: "New Balance 574",
      brand: "New Balance",
      price: 6499,
      oldPrice: 7999,
      rating: 4.5,
      offer: "15% OFF",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
    },
    {
      id: 5,
      name: "Reebok Classic",
      brand: "Reebok",
      price: 4699,
      oldPrice: 5999,
      rating: 4.4,
      offer: "20% OFF",
      image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500",
    },
    {
      id: 6,
      name: "Converse Chuck Taylor",
      brand: "Converse",
      price: 3999,
      oldPrice: 4999,
      rating: 4.6,
      offer: "20% OFF",
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500",
    },
    {
      id: 7,
      name: "Nike Revolution 6",
      brand: "Nike",
      price: 5899,
      oldPrice: 7299,
      rating: 4.7,
      offer: "19% OFF",
      image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500",
    },
    {
      id: 8,
      name: "Skechers Go Walk",
      brand: "Skechers",
      price: 4599,
      oldPrice: 5999,
      rating: 4.5,
      offer: "23% OFF",
      image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500",
    },
  ]);

  return (
    <div className="page">

      {/* Navbar */}

      <nav className="navbar">

        <h2 className="logo">ShopEase</h2>

        <div className="searchBox">
          <input type="text" placeholder="Search shoes..." />
          <button>
            <FaSearch />
          </button>
        </div>

        <div className="menu">
          <a href="#">Home</a>
          <a href="#">Men</a>
          <a href="#">Women</a>
          <a href="#">Shoes</a>
          <a href="#">Orders</a>

          <FaHeart className="icon" />
          <FaShoppingCart className="icon" />
          <FaUserCircle className="icon" />
        </div>

      </nav>

      {/* Hero */}

    


      <div className="heading">

        <h2>🔥 Trending Sneakers</h2>

        <p>{shoes.length} Products Available</p>

      </div>

      {/* Products */}

      <div className="products">

        {shoes.map((shoe) => (

          <div className="card" key={shoe.id}>

            <span className="offer">{shoe.offer}</span>

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

              <button>Add To Cart</button>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <footer>

        <h2>ShopEase</h2>

        <p>
          Premium Shopping Experience for Shoes, Fashion &
          Lifestyle.
        </p>

        <p>© 2026 ShopEase. All Rights Reserved.</p>

      </footer>

    </div>
  );
}

export default Shoes;