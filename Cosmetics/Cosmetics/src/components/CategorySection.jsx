import { motion } from "framer-motion";
import {
  FaPaintBrush,
  FaSpa,
  FaCut,
  FaSprayCan,
  FaPumpSoap,
  FaHandSparkles,
  FaMale,
} from "react-icons/fa";

import "../styles/CategorySection.css";

const categories = [
  {
    icon: <FaPaintBrush />,
    title: "Makeup",
    description: "Foundation, powder, kajal, mascara, lipstick, nail polish.",
  },
  {
    icon: <FaSpa />,
    title: "Skincare",
    description: "Serums, face wash, moisturizer, sunscreen, toner.",
  },
  {
    icon: <FaCut />,
    title: "Hair Care",
    description: "Shampoo, conditioner, serum, rosemary oil, repair treatments.",
  },
  {
    icon: <FaSprayCan />,
    title: "Fragrance",
    description: "Signature scents crafted to linger.",
  },
  {
    icon: <FaPumpSoap />,
    title: "Bath & Body",
    description: "Soft textures and indulgent rituals.",
  },
  {
    icon: <FaHandSparkles />,
    title: "Beauty Tools",
    description: "Precision tools and accessories for polished results.",
  },
  {
    icon: <FaMale />,
    title: "Men's Grooming",
    description: "Modern essentials with effortless style.",
  },
];

function CategorySection({ onCategorySelect }) {
  return (
    <section className="categories-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Curated Collections</p>
          <h2>Shop by Category</h2>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((item, index) => (
          <motion.article
            className="category-card"
            key={item.title}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            onClick={() => onCategorySelect(item.title)}
          >
            <div className="category-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button type="button">Explore</button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;