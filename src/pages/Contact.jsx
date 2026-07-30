import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
    return (
        <>
            <Navbar />

            <section style={{ padding: "60px 10%" }}>
                <h1>Contact Us</h1>

                <p><strong>Email:</strong> support@sportsstore.com</p>
                <p><strong>Phone:</strong> +91 8247458597</p>
                <p><strong>Address:</strong> Andhra Pradesh, India</p>
            </section>

            <Footer />
        </>
    );
}

export default Contact;