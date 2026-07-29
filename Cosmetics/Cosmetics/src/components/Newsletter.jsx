import { motion } from "framer-motion";
import "../styles/Newsletter.css";

function Newsletter() {
  return (
    <motion.section
      className="newsletter"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}
    >
      <div>
        <p className="eyebrow">Stay in the Glow</p>
        <h2>Stay Beautiful</h2>
        <p>Receive exclusive offers and first access to luxe beauty launches.</p>
      </div>

      <form className="newsletter-form">
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
    </motion.section>
  );
}

export default Newsletter;
