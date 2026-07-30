import Hero from "../components/Hero/Hero";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import CategoryCard from "../components/CategoryCard/CategoryCard";

import travelImg from "../assets/images/travel.jpg";
import schoolImg from "../assets/images/school.jpg";
import handbagImg from "../assets/images/handbag.jpg";
import slingImg from "../assets/images/sling.jpg";
import walletImg from "../assets/images/wallet.jpg";
import purseImg from "../assets/images/purse.jpg";

const categories = [
  {
    title: "Travel Bags",
    image: travelImg,
    link: "/travel-bags",
  },
  {
    title: "School Bags",
    image: schoolImg,
    link: "/school-bags",
  },
  {
    title: "Hand Bags",
    image: handbagImg,
    link: "/hand-bags",
  },
  {
    title: "Sling Bags",
    image: slingImg,
    link: "/sling-bags",
  },
  {
    title: "Wallets",
    image: walletImg,
    link: "/wallets",
  },
  {
    title: "Women's Purses",
    image: purseImg,
    link: "/purses",
  },
];

function Home() {
  return (
    <>
      <Hero />

      {/* Today's Offer Banner */}

      <section className="offer-banner container">

        <div className="offer-left">

          <span className="offer-tag">
            🔥 Today's Offer
          </span>

          <h2>
            Flat <span>30% OFF</span>
          </h2>

          <p>
            Premium Handbags • Wallets • Travel Bags
          </p>

        </div>

        <div className="offer-right">

          <div className="offer-box">
            🚚 Free Shipping
          </div>

          <div className="offer-box">
            💳 Secure Payments
          </div>

          <div className="offer-box">
            🎁 New Collection
          </div>

        </div>

      </section>

      <section className="collection-section">

<div className="container">

<h2>Explore Our Collection</h2>

<p className="collection-subtitle">
Luxury bags crafted for every journey, every occasion and every style.
</p>
</div>

        <div className="grid">

          {categories.map((category, index) => (

            <CategoryCard
              key={index}
              title={category.title}
              image={category.image}
              link={category.link}
            />

          ))}

        </div>

      </section>

      <WhyChooseUs />

    </>
  );
}

export default Home;