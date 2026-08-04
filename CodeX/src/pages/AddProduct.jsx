import { useState } from "react";
import "./AddProduct.css";
function AddProduct() {

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    rating: "",
    reviews: "",
    image: ""
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

    const data = await response.json();

    alert(data.message);

    setProduct({
      name: "",
      category: "",
      price: "",
      rating: "",
      reviews: "",
      image: ""
    });
  };

 return (

<div className="add-product">

<div className="add-card">

<h1>Add Product</h1>

<form onSubmit={saveProduct}>

<input
type="text"
name="name"
placeholder="Product Name"
value={product.name}
onChange={handleChange}
/>

<select
  name="category"
  value={product.category}
  onChange={handleChange}
>

  <option value="">Select Category</option>

  <option value="earrings">Earrings</option>

  <option value="rings">Rings</option>

  <option value="necklace">Necklace</option>

  <option value="bracelets">Bracelets</option>

  <option value="bangles">Bangles</option>

  <option value="anklets">Anklets</option>

  <option value="chains">Chains</option>

  <option value="nosepins">Nose Pins</option>

  <option value="hairbands">Hair Bands</option>

  <option value="hairclips">Hair Clips</option>

  <option value="hairpluckers">Hair Pluckers</option>

  <option value="pins">Hair Pins</option>

</select>

<input
type="number"
name="price"
placeholder="Price"
value={product.price}
onChange={handleChange}
/>

<input
type="number"
step="0.1"
name="rating"
placeholder="Rating"
value={product.rating}
onChange={handleChange}
/>

<input
type="number"
name="reviews"
placeholder="Reviews"
value={product.reviews}
onChange={handleChange}
/>

<input
type="text"
name="image"
placeholder="/images/ring1.jpg"
value={product.image}
onChange={handleChange}
/>

<button type="submit">
Add Product
</button>

</form>

</div>

</div>

);
}

export default AddProduct;