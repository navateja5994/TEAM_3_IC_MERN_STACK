function Categories() {
  const categories = [
    "🍕 Pizza",
    "🍔 Burger",
    "🍗 Fried Chicken",
    "🍛 Biryani",
    "🍜 Noodles",
    "🍨 Ice Cream",
    "🥤 Drinks",
    "☕ Coffee"
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Popular Categories</h2>

      <div className="row">
        {categories.map((item, index) => (
          <div className="col-md-3 mb-3" key={index}>
            <div className="card shadow-sm text-center p-4">
              <h4>{item}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;