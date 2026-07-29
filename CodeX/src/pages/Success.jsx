import { Link } from "react-router-dom";

function Success() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>🎉 Order Placed Successfully!</h1>

      <p>Thank you for shopping with CodeX Accessories.</p>

      <Link to="/">
        <button
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#e91e63",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}

export default Success;