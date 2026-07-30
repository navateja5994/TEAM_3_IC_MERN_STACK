import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Success.css";

function Success() {

  const location = useLocation();

  const order = location.state;

  return (

    <div className="success-container">

      <div className="success-card">

        <h1>🎉 Order Placed!</h1>

        <h2>Customer Details</h2>

        <p><strong>Name:</strong> {order?.customerName}</p>

        <p><strong>Phone:</strong> {order?.phone}</p>

        <p><strong>Email:</strong> {order?.email}</p>

        <p><strong>Address:</strong> {order?.address}</p>

        <p><strong>City:</strong> {order?.city}</p>

        <p><strong>State:</strong> {order?.state}</p>

        <p><strong>PIN:</strong> {order?.pinCode}</p>

        <p><strong>Payment:</strong> {order?.paymentMethod}</p>

        <p><strong>Total:</strong> ₹{order?.totalAmount}</p>

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