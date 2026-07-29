import foodData from "../data/foodData";

function Menu() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Our Menu</h2>

      <div className="row">
        {foodData.map((food) => (
          <div className="col-md-4 mb-4" key={food.id}>
            <div className="card h-100 shadow">

              <img
                src={food.image}
                className="card-img-top"
                alt={food.name}
                style={{ height: "220px", objectFit: "cover" }}
              />

              <div className="card-body">

                <h4>{food.name}</h4>

                <p>
                  <strong>Category:</strong> {food.category}
                </p>

                <p>
                  <strong>Price:</strong> ₹{food.price}
                </p>

                <p>
                  ⭐ {food.rating}
                </p>

                <button className="btn btn-success w-100">
                  Add to Cart
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;