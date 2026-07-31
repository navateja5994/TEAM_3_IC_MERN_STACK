import "../styles/Products.css";
import ProductCard from "./ProductCard";
import homeChocolates from "../data/homeChocolates";
import darkChocolates from "../data/darkChocolates";
import milkChocolates from "../data/milkChocolates";
import premiumChocolates from "../data/premiumChocolates";
import giftBoxChocolates from "../data/giftBoxChocolates";

function Chocolates({ addToCart, wishlist, toggleWishlist }) {
  const categories = [
    {
      id: "home",
      title: "Home Collection",
      subtitle: "Discover our handpicked everyday favorites",
      products: homeChocolates,
      gradient: "linear-gradient(135deg, #f5e6d3 0%, #e8d4bc 100%)"
    },
    {
      id: "dark",
      title: "Dark Chocolate",
      subtitle: "Rich, intense flavors for the true connoisseur",
      products: darkChocolates,
      gradient: "linear-gradient(135deg, #3e2723 0%, #5d4037 100%)"
    },
    {
      id: "milk",
      title: "Milk Chocolate",
      subtitle: "Creamy, smooth, and irresistibly classic",
      products: milkChocolates,
      gradient: "linear-gradient(135deg, #8d6e63 0%, #a1887f 100%)"
    },
    {
      id: "premium",
      title: "Premium Selection",
      subtitle: "The pinnacle of luxury chocolate craftsmanship",
      products: premiumChocolates,
      gradient: "linear-gradient(135deg, #4e342e 0%, #6d4c41 100%)"
    },
    {
      id: "giftbox",
      title: "Gift Boxes",
      subtitle: "Thoughtfully curated collections for every occasion",
      products: giftBoxChocolates,
      gradient: "linear-gradient(135deg, #d7ccc8 0%, #bcaaa4 100%)"
    }
  ];

  return (
    <div className="products-page">
      {categories.map((category) => (
        <section
          key={category.id}
          id={category.id}
          className="category-section"
        >
          <div
            className="category-header"
            style={{ background: category.gradient }}
          >
            <div className="category-header-inner">
              <span className="category-accent">— {category.id.toUpperCase()} —</span>
              <h2 className="category-title">{category.title}</h2>
              <p className="category-subtitle">{category.subtitle}</p>
              <span className="category-count">{category.products.length} Chocolates</span>
            </div>
          </div>

          <div className="products-grid">
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                isWishlisted={wishlist.includes(product.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default Chocolates;
