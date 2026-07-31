import { useState, useEffect } from "react";
import "../styles/Navbar.css";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "dark", label: "Dark" },
  { id: "milk", label: "Milk" },
  { id: "premium", label: "Premium" },
  { id: "giftbox", label: "Gift Box" }
];

function Navbar({ cartCount, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map((link) => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_LINKS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div
          className="logo"
          onClick={() => scrollToSection("home")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && scrollToSection("home")}
        >
          <span className="logo-icon">🍫</span>
          <span className="logo-text">Cacao &amp; Co.</span>
        </div>

        <button
          className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                className={`nav-link ${activeSection === link.id ? "active" : ""}`}
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button className="cart-btn" onClick={onCartClick}>
          <span className="cart-icon">🛒</span>
          <span className="cart-label">Cart</span>
          <span className={`cart-count ${cartCount > 0 ? "has-items" : ""}`}>
            {cartCount}
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
