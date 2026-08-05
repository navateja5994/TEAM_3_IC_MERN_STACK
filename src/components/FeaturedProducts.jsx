import { useNavigate } from "react-router-dom";
import "./FeaturedProducts.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import shoes from "../assets/images/shoes.png";
import jersey from "../assets/images/jersey.png";
import bat from "../assets/images/bat.png";
import bag from "../assets/images/bag.png";
import womenjersey from "../assets/images/womenjersey.png";
import hockey from "../assets/images/hockey.png";
import shuttle from "../assets/images/shuttle.png";
import skippingRope from "../assets/images/skippingRope.png";
import Tennisball from "../assets/images/Tennisball.png";
import Throwball from "../assets/images/Throwball.png";
import volleyball from "../assets/images/volleyball.png";
import sportsTshirt from "../assets/images/sportsTshirt.png";
import bottle from "../assets/images/bottle.png";
import sleeves from "../assets/images/sleeves.png";
import StopWatch from "../assets/images/StopWatch.png";
import support from "../assets/images/support.png";

function FeaturedProducts() {
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const products = [
        {
            id: 1,
            name: "Sports Shoes",
            price: "₹2,499",
            image: shoes,
        },
        {
            id: 2,
            name: "Sports Jersey",
            price: "₹999",
            image: jersey,
        },
        {
            id: 3,
            name: "Cricket Bat",
            price: "₹1,899",
            image: bat,
        },
        {
            id: 4,
            name: "Sports Bag",
            price: "₹1,299",
            image: bag,
        },
        {
            id: 5,
            name: "womenjersey",
            price: "₹1,000",
            image: womenjersey,
        },
        {
            id: 6,
            name: "Hockey",
            price: "₹1,500",
            image: hockey,
        },
        {
            id: 7,
            name: "shuttle",
            price: "₹800",
            image: shuttle,
        },
        {
            id: 8,
            name: "SkippingRope",
            price: "₹500",
            image: skippingRope,
        },
        {
            id: 9,
            name: "Tennisball",
            price: "₹200",
            image: Tennisball,
        },
        {
            id: 10,
            name: "Throwball",
            price: "₹900",
            image: Throwball,
        },
        {
            id: 11,
            name: "volleyball",
            price: "₹1,200",
            image: volleyball,
        },
        {
            id: 12,
            name: "SportsT-Shirt",
            price: "₹600",
            image: sportsTshirt,
        },

        {
            id: 13,
            name: "bottle",
            price: "₹500",
            image: bottle,
        },
        {
            id: 14,
            name: "Arm&Leg Sleeves",
            price: "₹300",
            image: sleeves,
        },
        {
            id: 15,
            name: "StopWatch",
            price: "₹1500",
            image: StopWatch,
        },
        {
            id: 16,
            name: "Elbow&Knee Support",
            price: "₹300",
            image: support,
        },

    ];

    return (
        <section className="products">
            <h2>Featured Products</h2>

            <div className="product-grid">
                {products.map((item) => (
                    <div className="product-card" key={item.id}>
                        <img src={item.image} alt={item.name} />
                        <h3>{item.name}</h3>
                        <p>{item.price}</p>
                        <button
                            onClick={() => {
                                addToCart(item);
                                navigate("/cart");
                            }}
                        >
                            Add Cart
                        </button>
                        <button onClick={() => navigate("/buy")}>Buy Now</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FeaturedProducts;