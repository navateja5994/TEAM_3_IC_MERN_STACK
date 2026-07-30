import { Link } from "react-router-dom";
import "./CategoryCard.css";

const CategoryCard = ({ title, image, link }) => {
  return (
    <Link to={link} className="category-card">
      <div className="category-image">
        <img src={image} alt={title} />
      </div>

      <div className="category-content">
        <h3>{title}</h3>
        <span className="category-btn">
          Explore Collection
          <span className="arrow">→</span>
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;