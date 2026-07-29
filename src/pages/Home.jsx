import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import RestaurantCard from "../components/RestaurantCard";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <RestaurantCard />
      <Footer />
    </>
  );
}

export default Home;