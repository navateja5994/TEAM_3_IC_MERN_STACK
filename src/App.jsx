import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import Offers from "./components/Offers";
import Cart from "./pages/Cart";
import Buy from "./pages/Buy";
function Home() {
  return (
    <>

      <Hero />
      <Categories />
      <FeaturedProducts />
      <Offers />

    </>
  );
}
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/buy" element={<Buy />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <Footer />
    </>
  );
}
export default App;