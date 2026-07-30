import ProductCard from "../components/ProductCard/ProductCard";
import products from "../data/products";

function SlingBags() {

  const slingBags = products.filter(
  (product) => product.category === "Sling Bags"
);

  return (
    <section className="section container">

      <h2>Sling Bags</h2>

      <div className="grid">

        {slingBags.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </section>
  );
}

export default SlingBags;