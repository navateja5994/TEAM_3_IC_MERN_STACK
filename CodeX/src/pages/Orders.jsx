import { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/orders/")
      .then((res) => res.json())
      .then((data) => {
        console.log("ORDERS FROM DATABASE:", data);
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });

  }, []);

  return (
    <div className="orders-page">

      <div className="orders-container">

        <h1 className="orders-title">
          Customer Orders
        </h1>

        <p className="orders-subtitle">
          Customer order details
        </p>

        <div className="orders-table-wrapper">

          <table className="orders-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Ordered Items</th>
                <th>Phone</th>
                <th>Total Amount</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>

              {orders.length === 0 ? (

                <tr>
                  <td colSpan="5" className="no-orders">
                    No orders found
                  </td>
                </tr>

              ) : (

                orders.map((order, index) => (

                  <tr key={index}>

                    {/* NAME */}
                    <td className="customer-name">
                      {order.customerName || "N/A"}
                    </td>


                    {/* ORDERED ITEMS */}
                    <td className="items-column">

                      {order.items && order.items.length > 0 ? (

                        order.items.map((item, itemIndex) => (

                          <div
                            className="order-item"
                            key={itemIndex}
                          >
                            <strong>
                              {item.name || "Product"}
                            </strong>

                            <span>
                              {" × "}
                              {item.quantity || 1}
                            </span>
                          </div>

                        ))

                      ) : (

                        <span className="no-items">
                          No item details
                        </span>

                      )}

                    </td>


                    {/* PHONE */}
                    <td className="phone">
                      {order.phone || "N/A"}
                    </td>


                    {/* AMOUNT */}
                    <td className="amount">
                      ₹{order.totalAmount || 0}
                    </td>


                    {/* ADDRESS */}
                    <td className="address">

                      <div>
                        {order.address || ""}
                      </div>

                      <div>
                        {order.city || ""}
                        {order.city && order.state ? ", " : ""}
                        {order.state || ""}
                      </div>

                      {order.pinCode && (
                        <div>
                          PIN: {order.pinCode}
                        </div>
                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Orders;