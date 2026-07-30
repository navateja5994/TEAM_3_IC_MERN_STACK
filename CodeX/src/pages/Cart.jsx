import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {

  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart
  } = useCart();


  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );


  return (

    <div className="cart-container">

      <h1>Your Shopping Cart 🛒</h1>


      {
        cartItems.length === 0 ? (

          <div className="empty-cart">

            <h2>Your cart is empty</h2>

            <Link to="/products">
              <button>
                Shop Now
              </button>
            </Link>

          </div>

        ) : (


        <>

        <div className="cart-items">


        {
          cartItems.map((item)=>(


            <div className="cart-card" key={item.id}>


              <img
                src={item.image}
                alt={item.name}
              />


              <div className="cart-details">


                <h2>
                  {item.name}
                </h2>


                <p>
                  Price: ₹{item.price}
                </p>


                <div className="quantity">


                  <button onClick={() =>
                    decreaseQty(item.id)
                  }>
                    -
                  </button>


                  <span>
                    {item.quantity}
                  </span>


                  <button onClick={() =>
                    increaseQty(item.id)
                  }>
                    +
                  </button>


                </div>


                <button
                  className="remove"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  Remove
                </button>


              </div>


            </div>


          ))
        }


        </div>



        <div className="summary">


          <h2>
            Order Summary
          </h2>


          <p>
            Total Items:
            {cartItems.length}
          </p>


          <h2>
            Total Amount:
            ₹{totalAmount}
          </h2>



       <Link
  to="/checkout"
  state={{
    total: totalAmount,
    cartItems: cartItems,
  }}
>
  <button className="checkout-btn">
    Proceed To Checkout
  </button>
</Link>

        </div>


        </>


        )
      }


    </div>

  );
}


export default Cart;