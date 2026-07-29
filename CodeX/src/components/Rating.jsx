import { FaStar } from "react-icons/fa";

function Rating({ rating, reviews }) {
  return (
    <div className="rating">
      <FaStar color="#FFD700" />
      <span>{rating}</span>
      <small>({reviews} Reviews)</small>
    </div>
  );
}

export default Rating;