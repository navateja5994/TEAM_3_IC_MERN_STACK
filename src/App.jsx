import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;