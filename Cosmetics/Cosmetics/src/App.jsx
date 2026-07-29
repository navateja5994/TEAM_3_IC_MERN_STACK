import { useState } from "react";
import Navbar from "./components/Navbar";
import Cosmetics from "./pages/Cosmetics";
import CategoryPage from "./pages/CategoryPage";
import Footer from "./components/Footer";
import { products } from "./data/product";

function App() {
  const [selectedPage, setSelectedPage] = useState("Home");

  return (
    <div className="page-shell">
      <Navbar onCategorySelect={setSelectedPage} />
      <main>
        {selectedPage === "Home" ? (
          <Cosmetics onCategorySelect={setSelectedPage} />
        ) : (
          <CategoryPage category={selectedPage} products={products} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;