import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./CategoryPage.css";

function CategoryPage() {

  const { categoryName } = useParams();

  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.log(err));

  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === categoryName
  );

  return (

    <div className="category-page">

      <h1>{categoryName.toUpperCase()}</h1>

      <div className="products-grid">

        {filteredProducts.length > 0 ? (

          filteredProducts.map((product) => (

            <ProductCard
              key={product._id}
              product={product}
            />

          ))

        ) : (

          <h2>No Products Found</h2>

        )}

      </div>

    </div>

  );

}

export default CategoryPage;