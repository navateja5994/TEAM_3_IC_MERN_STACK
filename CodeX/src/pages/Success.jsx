import { Link, useLocation } from "react-router-dom";
import "./Success.css";

function Success() {

  const location = useLocation();

  const order = location.state || {};

  return (

    <div className="success-container">

      <div className="invoice">

        <h1>🎉 Order Placed!</h1>

        <h2>CodeX Accessories</h2>

        <hr />

        <p><strong>Customer :</strong> {order.customerName}</p>

        <p><strong>Phone :</strong> {order.phone}</p>

        <p><strong>Email :</strong> {order.email}</p>

        <p><strong>Address :</strong> {order.address}</p>

        <p><strong>Payment :</strong> {order.paymentMethod}</p>

        <p><strong>Total :</strong> ₹{order.totalAmount}</p>

        <button onClick={() => window.print()}>
          Download Bill
        </button>

        <br /><br />

        <Link to="/">
          <button>
            Continue Shopping
          </button>
        </Link>

      </div>

    </div>

  );
}

export default Success;