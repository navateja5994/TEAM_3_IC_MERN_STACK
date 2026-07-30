import "./Hero.css";

import heroImage from "../assets/images/Hero.png";
function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Level Up Your Game</h1>
                <p>Best Sports Shoes, Jerseys & Accessories</p>
                <button>Shop Now</button>
            </div>

            <div className="hero-image">
                <img src={heroImage} alt="Sports" />
            </div>
        </section>
    );
}

export default Hero;