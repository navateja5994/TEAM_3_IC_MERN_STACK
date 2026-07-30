import products from "../data/products";
import ProductCard from "../components/ProductCard/ProductCard";

function NewArrivals() {

  const arrivals = products.slice(0,8);

  return (

    <section className="section container">

      <h1>✨ New Arrivals</h1>

      <p
        style={{
          textAlign:"center",
          marginBottom:"40px"
        }}
      >
        Explore our latest luxury bag collection.
      </p>

      <div className="grid">

        {arrivals.map(product=>(
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>

  );

}

export default NewArrivals;