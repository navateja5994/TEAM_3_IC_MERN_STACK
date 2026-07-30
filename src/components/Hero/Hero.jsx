import "./Hero.css";
import heroBg from "../../assets/images/bag-store.jpg";

function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.45)), url(${heroBg})`,
      }}
    >
      <div className="hero-content">

        <span className="hero-tag">
          ✨ New Luxury Collection
        </span>

        <h1>
          Discover Your
          <br />
          Perfect Bag
        </h1>

        <p>
          Premium handbags, travel bags, wallets and
          stylish accessories crafted to elevate your
          everyday fashion.
        </p>

        <div className="hero-buttons">
          <a href="/hand-bags" className="btn">
            Shop Now
          </a>

          <a href="/travel-bags" className="outline-btn">
            Explore Collection
          </a>
        </div>

      </div>
    </section>
  );
}

export default Hero;