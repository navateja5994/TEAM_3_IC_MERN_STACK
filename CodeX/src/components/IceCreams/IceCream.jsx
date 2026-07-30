import "./IceCream.css";
import iceCreamData from "./iceCreamData";
import IceCreamCard from "./IceCreamCard";

function IceCream() {
  const cups = iceCreamData.filter(
    (item) => item.category === "cups"
  );

  const cones = iceCreamData.filter(
    (item) => item.category === "cones"
  );

  const sticks = iceCreamData.filter(
    (item) => item.category === "sticks"
  );

  const kulfi = iceCreamData.filter(
    (item) => item.category === "kulfi"
  );

  return (
    <section className="icecream-section">

      {/* Cup Ice Cream */}

      <section id="icecream" className="category-section">
        <h2 className="category-title">🍨 Cup Ice Cream</h2>

        <div className="product-grid">
          {cups.map((product) => (
            <IceCreamCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* Cone Ice Cream */}

      <section id="cones" className="category-section">
        <h2 className="category-title">🍦 Cone Collection</h2>

        <div className="product-grid">
          {cones.map((product) => (
            <IceCreamCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* Ice Cream Sticks */}

      <section id="sticks" className="category-section">
        <h2 className="category-title">🍫 Ice Cream Sticks</h2>

        <div className="product-grid">
          {sticks.map((product) => (
            <IceCreamCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* Kulfi */}

      <section id="kulfi" className="category-section">
        <h2 className="category-title">🥭 Kulfi Collection</h2>

        <div className="product-grid">
          {kulfi.map((product) => (
            <IceCreamCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

    </section>
  );
}

export default IceCream;