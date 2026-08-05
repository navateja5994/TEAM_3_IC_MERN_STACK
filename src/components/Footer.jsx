import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-section">
                    <h2>Sports Store</h2>
                    <p>
                        Your one-stop destination for sports shoes, jerseys,
                        accessories and equipment.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>Home</li>
                        <li>Products</li>
                        <li>Categories</li>
                        <li>Offers</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>Email: sportsstore@gmail.com</p>
                    <p>Phone: +91 9876543210</p>
                    <p>Location: Andhra Pradesh</p>
                </div>

            </div>

            <hr />

            <p className="copyright">
                © 2026 Sports Store. All Rights Reserved.
            </p>
        </footer>
    );
}

export default Footer;