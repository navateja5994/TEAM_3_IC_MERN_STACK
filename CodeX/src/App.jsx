import AddProduct from "./pages/AddProduct";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";

import Products from "./pages/Products";

import ProductDetails from "./pages/ProductDetails";


import Success from "./pages/Success";
import Footer from "./components/Footer";

import AdminLogin from "./pages/AdminLogin";

import ManageProducts from "./pages/ManageProducts";
import EditProduct from "./pages/EditProduct";

import AdminDashboard from "./pages/AdminDashboard";
import Orders from "./pages/Orders";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} 
        />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route
    path="/admin/edit-product/:id"
    element={<EditProduct />}
/>

<Route 
path="/admin"
element={<AdminDashboard />}
/>


<Route
path="/admin/orders"
element={<Orders/>}
/>

<Route path="/success" element={<Success />} />
<Route
  path="/admin/manage-products"
  element={<ManageProducts />}
/>

      </Routes>
      <Footer />
    </>
  );
}

export default App;