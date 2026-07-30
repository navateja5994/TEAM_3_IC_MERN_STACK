import "./FeaturedProducts.css";

import shoes from "../assets/images/shoes.png";
import jersey from "../assets/images/jersey.png";
import bat from "../assets/images/bat.png";
import bag from "../assets/images/bag.png";

function FeaturedProducts() {
    const products = [
        {
            name: "Running Shoes",
            price: "₹2,499",
            image: shoes,
        },
        {
            name: "Football Jersey",
            price: "₹999",
            image: jersey,
        },
        {
            name: "Cricket Bat",
            price: "₹1,799",
            image: bat,
        },
        {
            name: "Sports Bag",
            price: "₹1,299",
            image: bag,
        },
    ];

    return (
        <section className="products">
            <h2>Featured Products</h2>

            <div className="product-grid">
                {products.map((product, index) => (
                    <div className="product-card" key={index}>
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                        <button>Buy Now</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FeaturedProducts;