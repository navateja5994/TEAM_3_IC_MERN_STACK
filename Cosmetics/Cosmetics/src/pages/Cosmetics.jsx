import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import OfferBanner from "../components/OfferBanner";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";

function Cosmetics({
  onCategorySelect,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onSubscribe,
}) {
  return (
    <>
      <Hero />
      <CategorySection onCategorySelect={onCategorySelect} />
      <OfferBanner />
      <Testimonials />
      <Newsletter onSubscribe={onSubscribe} />
    </>
  );
}

export default Cosmetics;
