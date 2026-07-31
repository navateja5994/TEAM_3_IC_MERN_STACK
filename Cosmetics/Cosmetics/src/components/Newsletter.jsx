import { motion } from "framer-motion";
import "../styles/Newsletter.css";

function Newsletter({ onSubscribe }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    if (!email) {
      onSubscribe?.("Please enter your email address");
      return;
    }

    onSubscribe?.(`Thanks, ${email}! You are subscribed.`);
    event.target.reset();
  };

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

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
    </motion.section>
  );
}

export default Newsletter;
