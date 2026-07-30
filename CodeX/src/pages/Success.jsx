import { useLocation, Link } from "react-router-dom";
import "./Success.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Success() {
  const location = useLocation();
  const order = location.state;

  const downloadBill = async () => {
    const input = document.getElementById("invoice");

    if (!input) {
      alert("Invoice not found");
      return;
    }

    const canvas = await html2canvas(input, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    pdf.save("Invoice.pdf");
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <div id="invoice">
          <h1>🎉 Order Placed!</h1>

          <h2>Customer Details</h2>

          <p>
            <strong>Name:</strong> {order?.customerName}
          </p>

          <p>
            <strong>Phone:</strong> {order?.phone}
          </p>

          <p>
            <strong>Email:</strong> {order?.email}
          </p>

          <p>
            <strong>Address:</strong> {order?.address}
          </p>

          <p>
            <strong>City:</strong> {order?.city}
          </p>

          <p>
            <strong>State:</strong> {order?.state}
          </p>

          <p>
            <strong>PIN:</strong> {order?.pinCode}
          </p>

          <hr />

          <h2>Products</h2>

          {order?.items?.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index}>
                <p>
                  <strong>{item.name}</strong>
                </p>

                <p>Price : ₹{item.price}</p>

                <p>Quantity : {item.quantity}</p>

                <p>Subtotal : ₹{item.price * item.quantity}</p>

                <hr />
              </div>
            ))
          ) : (
            <p>No Products Found</p>
          )}

          <h2>Payment Details</h2>

          <p>
            <strong>Payment Method:</strong> {order?.paymentMethod}
          </p>

          <p>
            <strong>Total Amount:</strong> ₹{order?.totalAmount}
          </p>

          <p>
            <strong>Status:</strong> {order?.status}
          </p>

          <p>
            <strong>Order Date:</strong>{" "}
            {order?.orderDate
              ? new Date(order.orderDate).toLocaleString()
              : ""}
          </p>

          <hr />

          <h3 style={{ textAlign: "center" }}>
            Thank You for Shopping with CodeX Accessories ❤️
          </h3>
        </div>

        <br />

        <button onClick={downloadBill}>
          Download Bill
        </button>

        <br />
        <br />

        <Link to="/">
          <button>Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}

export default Success;