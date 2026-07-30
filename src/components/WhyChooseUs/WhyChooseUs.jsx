import "./WhyChooseUs.css";

const features = [
  {
    id: 1,
    icon: "🚚",
    title: "Free Shipping",
    description:
      "Enjoy free delivery on eligible orders with safe, fast, and reliable shipping across India.",
  },
  {
    id: 2,
    icon: "🛡️",
    title: "Premium Quality",
    description:
      "Every bag is carefully selected from trusted brands to ensure durability, style, and comfort.",
  },
  {
    id: 3,
    icon: "💳",
    title: "Secure Payments",
    description:
      "Shop confidently using secure payment methods with a smooth and protected checkout experience.",
  },
  {
    id: 4,
    icon: "🔄",
    title: "Easy Returns",
    description:
      "Not satisfied? Return eligible products easily with our hassle-free return policy.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      <div className="why-container">
        <div className="section-header">
          <span className="section-tag">Why Choose BagWorld?</span>

          <h2>
            We Deliver More Than <span>Bags</span>
          </h2>

          <p>
            At BagWorld, we combine premium brands, modern designs, competitive
            prices, and exceptional customer service to give you the best online
            shopping experience.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.id}>
              <div className="feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;