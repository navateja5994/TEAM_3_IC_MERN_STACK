import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import IceCream from "./components/IceCreams/IceCream";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <IceCream />
      <Footer />
    </div>
  );
}

export default App;