import "./About.css";
import bagStore from "../assets/images/bag-store.jpg";

function About() {
  return (
    <section className="about-page">
      <div className="container">

        <div className="about-header">
          <h1>About BagWorld</h1>
          <p>Luxury. Elegance. Style.</p>
        </div>

        <div className="about-content">

          <div className="about-image">
            <img
              src={bagStore}
              alt="BagWorld"
            />
          </div>

          <div className="about-text">

            <h2>Luxury Bags for Every Occasion</h2>

            <p>
              BagWorld is your premium destination for elegant handbags,
              travel bags, wallets, purses and fashion accessories.
            </p>

            <p>
              We carefully select stylish collections that combine
              comfort, quality, and modern fashion.
            </p>

            <div className="about-features">

              <div className="feature">
                ⭐ Premium Quality
              </div>

              <div className="feature">
                🚚 Fast Delivery
              </div>

              <div className="feature">
                💳 Secure Payment
              </div>

              <div className="feature">
                ❤️ Trusted by Thousands
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;