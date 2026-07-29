import { motion } from "framer-motion";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <motion.span
          className="badge"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ✨ New Collection 2026
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          Discover Your <span>Natural Beauty</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Shop premium skincare, makeup, fragrances, and beauty essentials with
          exciting offers curated for your glow.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button>Shop Now</button>
          <button className="ghost">Explore Collection</button>
        </motion.div>
      </div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-card">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80"
            alt="Luxury beauty products"
          />
          <div className="floating-badge">Luxury Edit</div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;