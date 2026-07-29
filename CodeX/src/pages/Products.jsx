import "./Products.css";
import { Link } from "react-router-dom";

import { useState } from "react";

const categories = [
  {
    name: "Earrings",
    image: "/images/earrings.jpg",
    path: "/category/earrings",
  },
  {
    name: "Rings",
    image: "/images/rings.jpg",
    path: "/category/rings",
  },
  {
    name: "Necklace Sets",
    image: "/images/necklace.jpg",
    path: "/category/necklace",
  },
  {
    name: "Bracelets",
    image: "/images/bracelets.jpg",
    path: "/category/bracelets",
  },
  {
    name: "Bangles",
    image: "/images/bangles.jpg",
    path: "/category/bangles",
  },
  {
    name: "Hair Bands",
    image: "/images/hairband.jpg",
    path: "/category/hairbands",
  },
  {
    name: "Hair Clips",
    image: "/images/hairclip.jpg",
    path: "/category/hairclips",
  },
  {
    name: "Hair Pluckers",
    image: "/images/plucker.jpg",
    path: "/category/pluckers",
  },
  {
    name: "Anklets",
    image: "/images/anklets.jpg",
    path: "/category/anklets",
  },
  {
    name: "Nose Pins",
    image: "/images/nosepin.jpg",
    path: "/category/nosepins",
  },
];

function Products() {
  return (
    
    <div className="products-page">
      <h1>Shop By Category</h1>

      <div className="category-container">
        {categories.map((category) => (
          <Link
            to={category.path}
            className="category-card"
            key={category.name}
          >
            <img src={category.image} alt={category.name} />

            <div className="category-name">
              {category.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;