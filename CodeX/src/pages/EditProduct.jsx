import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        rating: "",
        reviews: "",
        image: ""
    });

    useEffect(() => {

        fetch("http://127.0.0.1:8000/api/products/")
            .then(res => res.json())
            .then(data => {

                const selected = data.find(
                    item => item._id === id
                );

                if (selected) {
                    setProduct(selected);
                }

            });

    }, [id]);

    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

    };

    const updateProduct = async (e) => {

        e.preventDefault();

        await fetch(
            `http://127.0.0.1:8000/api/products/update/${id}/`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            }
        );

        alert("Product Updated Successfully");

        navigate("/admin/manage-products");

    };

    return (

        <div className="admin-container">

            <h1>Edit Product</h1>

            <form onSubmit={updateProduct}>

                <input
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                />

                <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                >

                    <option value="earrings">Earrings</option>
                    <option value="rings">Rings</option>
                    <option value="necklace">Necklace</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="bangles">Bangles</option>
                    <option value="hairbands">Hair Bands</option>
                    <option value="hairclips">Hair Clips</option>
                    <option value="anklets">Anklets</option>
                    <option value="pluckers">Pluckers</option>
                    <option value="nosepins">Nose Pins</option>

                </select>

                <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Price"
                />

                <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={product.rating}
                    onChange={handleChange}
                    placeholder="Rating"
                />

                <input
                    type="number"
                    name="reviews"
                    value={product.reviews}
                    onChange={handleChange}
                    placeholder="Reviews"
                />

                <input
                    name="image"
                    value={product.image}
                    onChange={handleChange}
                    placeholder="/images/image.jpg"
                />

                <button type="submit">
                    Update Product
                </button>

            </form>

        </div>

    );

}

export default EditProduct;