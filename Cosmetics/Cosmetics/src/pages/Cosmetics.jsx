import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import OfferBanner from "../components/OfferBanner";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import { products } from "../data/product";

function Cosmetics({ onCategorySelect }) {
  return (
    <>
      <Hero />
      <CategorySection onCategorySelect={onCategorySelect} />
      <ProductGrid
        products={products}
        title="Featured Products"
        subtitle="Curated Picks"
      />
      <OfferBanner />
      <Testimonials />
      <Newsletter />
    </>
  );
}

export default Cosmetics;
