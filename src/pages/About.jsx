import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
    return (
        <>
            <Navbar />

            <section style={{ padding: "60px 10%" }}>
                <h1>About Us</h1>
                <p>
                    Welcome to Sports Store. We provide high-quality sports shoes,
                    jerseys, equipment, and accessories.
                </p>
            </section>

            <Footer />
        </>
    );
}

export default About;