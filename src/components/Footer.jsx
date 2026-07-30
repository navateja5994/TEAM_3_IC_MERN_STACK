import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-section">
                    <h2>Sports Store</h2>
                    <p>Your one-stop shop for sports shoes, jerseys and accessories.</p>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>Home</li>
                        <li>Categories</li>
                        <li>Products</li>
                        <li>Contact</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>📞 +91 8247458597</p>
                    <p>📧 support@sportsstore.com</p>
                    <p>📍 Andhra Pradesh, India</p>
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