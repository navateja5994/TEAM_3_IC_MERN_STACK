import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { testimonials } from "../data/product";
import "../styles/Testimonials.css";

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Loved by Beauty Lovers</p>
          <h2>Customer Reviews</h2>
        </div>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.name}
            className="testimonial-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <img src={item.image} alt={item.name} />
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p>“{item.review}”</p>
            <h3>{item.name}</h3>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
