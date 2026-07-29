import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import "../styles/FeaturedProducts.css";

function ProductGrid({ products, title, subtitle }) {
  return (
    <section className="featured-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;
