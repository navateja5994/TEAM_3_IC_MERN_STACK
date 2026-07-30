import ProductCard from "../components/ProductCard/ProductCard";
import products from "../data/products";

function Wallets() {

  const wallets = products.filter(
  (product) => product.category === "Men's Wallets"
);

  return (
    <section className="section container">

      <h2>Men's Wallets</h2>

      <div className="grid">

        {wallets.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </section>
  );
}

export default Wallets;