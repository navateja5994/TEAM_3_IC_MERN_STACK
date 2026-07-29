function Hero() {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">

        <div className="col-md-6">
          <h1 className="display-4 fw-bold">
            Delicious Food,
            <br />
            Delivered Fast 🍕
          </h1>

          <p className="lead mt-3">
            Order your favorite meals from restaurants inside the mall.
          </p>

          <button className="btn btn-warning btn-lg mt-3">
            Order Now
          </button>
        </div>

        <div className="col-md-6 text-center">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700"
            alt="Food"
            className="img-fluid rounded"
          />
        </div>

      </div>
    </div>
  );
}

export default Hero;