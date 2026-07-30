import ProductCard from "../components/ProductCard/ProductCard";
import products from "../data/products";

function SchoolBags() {
  const schoolBags = products.filter(
    (product) => product.category === "School Bags"
  );

  return (
    <section className="section container">
      <h2>School Bags</h2>

      <div className="grid">
        {schoolBags.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default SchoolBags;