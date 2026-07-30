import ProductCard from "../components/ProductCard/ProductCard";
import products from "../data/products";

function Purses() {

  const purses = products.filter(
  (product) => product.category === "Women's Purses"
);

  return (
    <section className="section container">

      <h2>Women's Hand Purses</h2>

      <div className="grid">

        {purses.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </section>
  );
}

export default Purses;