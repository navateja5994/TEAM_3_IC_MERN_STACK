import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TravelBags from "./pages/TravelBags";
import SchoolBags from "./pages/SchoolBags";
import HandBags from "./pages/HandBags";
import SlingBags from "./pages/SlingBags";
import Wallets from "./pages/Wallets";
import Purses from "./pages/Purses";

import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import NewArrivals from "./pages/NewArrivals";
import Offers from "./pages/Offers";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/travel-bags" element={<TravelBags />} />
        <Route path="/school-bags" element={<SchoolBags />} />
        <Route path="/hand-bags" element={<HandBags />} />
        <Route path="/sling-bags" element={<SlingBags />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/purses" element={<Purses />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        {/* New Pages */}
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/new-arrivals" element={<NewArrivals />} />
<Route path="/offers" element={<Offers />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;