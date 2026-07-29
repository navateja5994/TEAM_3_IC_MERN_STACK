import { useMemo } from "react";
import ProductGrid from "../components/ProductGrid";
import { categories } from "../data/product";

function CategoryPage({ category, products }) {
  const selectedCategory = categories.find((item) => item.title === category);

  const filteredProducts = useMemo(() => {
    if (category === "Offers") {
      return products.filter((product) => {
        if (!product.discount) return false;
        const match = product.discount.match(/(\d+)%/);
        if (!match) return false;
        return Number(match[1]) >= 25;
      });
    }
    return products.filter((product) => product.category === category);
  }, [category, products]);

  if (!selectedCategory && category !== "Offers") {
    return (
      <section className="category-page">
        <div className="page-heading">
          <h2>Page not found</h2>
          <p>Choose a valid category from the navbar to view products.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="category-page">
      <div className="page-heading">
        <h2>{category}</h2>
      </div>

      <ProductGrid
        products={filteredProducts}
        title={category === "Offers" ? "Special Offers" : `${category} Essentials`}
        subtitle={category === "Offers" ? "Shop the best deals" : `All ${category.toLowerCase()} products`}
      />
    </section>
  );
}

export default CategoryPage;
