import products from "../data/products";
import ProductCard from "../components/ProductCard/ProductCard";

function Offers() {

  const offers = products.filter(
    item => item.price < 2000
  );

  return (

    <section className="section container">

      <h1>🔥 Today's Offers</h1>

      <p
        style={{
          textAlign:"center",
          marginBottom:"40px"
        }}
      >
        Amazing deals available today.
      </p>

      <div className="grid">

        {offers.map(product=>(
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>

  );

}

export default Offers;