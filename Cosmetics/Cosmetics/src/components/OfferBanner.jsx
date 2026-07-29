import { motion } from "framer-motion";
import "../styles/OfferBanner.css";

function OfferBanner() {
  return (
    <motion.section
      className="offer-banner"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <p className="eyebrow">Limited Time</p>
        <h2>Glow Like Never Before</h2>
        <p>Up to 50% OFF on premium beauty products</p>
      </div>
      <button>Shop Deals</button>
    </motion.section>
  );
}

export default OfferBanner;
