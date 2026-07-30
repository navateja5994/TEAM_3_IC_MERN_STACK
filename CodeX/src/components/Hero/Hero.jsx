import "./Hero.css";
import heroImage from "../../assets/images/hero/hero-icecream.png";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">

        <div className="hero-content">
          <h1>
            Taste the <span>Sweetest</span> Ice Cream
          </h1>

          <p>
            Explore our premium collection of delicious cups, cones,
            sticks, and kulfis made with the finest ingredients.
          </p>

          <div className="hero-buttons">
            <button className="shop-btn">Shop Now</button>
            <button className="explore-btn">Explore Menu</button>
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImage} alt="Ice Cream Banner" />
        </div>

      </div>
    </section>
  );
}

export default Hero;