import products from "../data/products";
import ProductCard from "../components/ProductCard/ProductCard";

function TravelBags() {

  const travelBags = products.filter(
    (product) => product.category === "Travel Bags"
  );

  return (
    <section className="section container">

      <h2>Travel Bags</h2>

      <div className="grid">
        {travelBags.map((product)=>(
          <ProductCard 
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}

export default TravelBags;