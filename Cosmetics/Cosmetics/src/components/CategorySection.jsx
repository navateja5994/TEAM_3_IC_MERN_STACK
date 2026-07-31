import { motion } from "framer-motion";
import { FaPaintBrush, FaSpa, FaCut, FaSprayCan } from "react-icons/fa";

import "../styles/CategorySection.css";

const categories = [
  {
    icon: <FaPaintBrush />,
    title: "Makeup",
    description: "Foundation, powder, kajal, mascara, lipstick, nail polish.",
    accent: "#ff5c9a",
    softBg: "#fff0f5",
  },
  {
    icon: <FaSpa />,
    title: "Skincare",
    description: "Serums, face wash, moisturizer, sunscreen, toner.",
    accent: "#2f8f79",
    softBg: "#effcf7",
  },
  {
    icon: <FaCut />,
    title: "Hair Care",
    description: "Shampoo, conditioner, serum, rosemary oil, repair treatments.",
    accent: "#7b5cff",
    softBg: "#f3efff",
  },
  {
    icon: <FaSprayCan />,
    title: "Fragrance",
    description: "Signature scents crafted to linger.",
    accent: "#c07a00",
    softBg: "#fff8e8",
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
            style={{ background: `linear-gradient(180deg, #fff 0%, ${item.softBg} 100%)` }}
          >
            <div className="category-icon" style={{ background: `linear-gradient(135deg, ${item.softBg}, ${item.accent}22)`, color: item.accent }}>
              {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button type="button" style={{ color: item.accent, borderColor: `${item.accent}30` }}>
              Explore
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;