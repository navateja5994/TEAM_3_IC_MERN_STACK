import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { featuredProducts, bestSellerProducts } from "../data/product";
import "../styles/FeaturedProducts.css";

function FeaturedProducts() {
  return (
    <section className="featured-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Curated Picks</p>
          <h2>Featured Products</h2>
        </div>
        <a href="#" className="section-link">
          View all
        </a>
      </div>

      <div className="products-grid">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      <div className="best-sellers">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Hot Right Now</p>
            <h2>Best Sellers</h2>
          </div>
        </div>

        <div className="best-seller-row">
          {bestSellerProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <ProductCard product={product} compact />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
