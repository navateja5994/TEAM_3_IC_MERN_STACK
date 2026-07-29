import { Link } from "react-router-dom";
import pizza from "../assets/pizza.jpg";
import kfc from "../assets/kfc.jpg";
import biryani from "../assets/biryani.jpg";

function RestaurantCard() {
  const restaurants = [
    {
      name: "Pizza Hut",
      rating: 4.8,
      time: "20 min",
      price: "$20 for two",
      image: pizza,
    },
    {
      name: "KFC",
      rating: 4.7,
      time: "18 min",
      price: "$18 for two",
      image: kfc,
    },
    {
      name: "Paradise Biryani",
      rating: 4.9,
      time: "25 min",
      price: "$25 for two",
      image: biryani,
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Popular Restaurants</h2>

      <div className="row">
        {restaurants.map((restaurant, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100 shadow">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="card-img-top"
                style={{ height: "220px", objectFit: "cover" }}
              />

              <div className="card-body text-center">
                <h3>{restaurant.name}</h3>
                <p>⭐ {restaurant.rating}</p>
                <p>⏱ {restaurant.time}</p>
                <p>{restaurant.price}</p>

                <Link to="/menu">
                  <button className="btn btn-warning w-100">
                    View Menu
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantCard;