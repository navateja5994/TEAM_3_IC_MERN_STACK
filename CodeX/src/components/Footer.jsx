import { useState } from "react";
import "./Footer.css";

function Footer() {
  const [showContact, setShowContact] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-section">
        <h2>💎 CodeX Accessories</h2>
        <p>
          Elegant accessories for every occasion.
          Style that defines you.
        </p>
      </div>

      <div className="footer-section">
        <h3>Customer Support</h3>
        
        {/* Displays 9030523441 on click */}
        <p 
          onClick={() => setShowContact(!showContact)} 
          style={{ cursor: "pointer", fontWeight: "bold", color: "#3182ce" }}
        >
          {showContact ? "📞 9030523441" : "Contact Us"}
        </p>
<p onClick={()=>setShowContact(!showContact)}
  style={{cursor:"pointer",fontWeight:"bold",color:"#b31561"}}>
    {showContact ? "NO RETURNS": "Return Policy"}
  </p>



      </div>

      <div className="copyright">
        © 2026 CodeX Accessories. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;