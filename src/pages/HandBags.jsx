import ProductCard from "../components/ProductCard/ProductCard";
import products from "../data/products";

function HandBags() {
  const handBags = products.filter(
    (product) => product.category === "Hand Bags"
  );

  return (
    <section className="section container">
      <h2>Hand Bags</h2>

      <div className="grid">
        {handBags.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default HandBags;