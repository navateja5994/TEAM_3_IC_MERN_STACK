import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../assets/images/Hero.png";
import "./ProductDetails.css";

function ProductDetails() {
    return (
        <>
            <Navbar />

            <section className="product-details">
                <div className="product-image">
                    <img src={heroImage} alt="Product" />
                </div>

                <div className="product-info">
                    <h1>Running Shoes</h1>
                    <h2>₹2,499</h2>

                    <p>
                        High-quality sports shoes designed for comfort, speed,
                        and long-lasting performance.
                    </p>

                    <button>Add to Cart</button>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default ProductDetails;