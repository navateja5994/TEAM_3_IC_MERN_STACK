import "./Categories.css";

function Categories() {
    const categories = [
        { name: "Sports Shoes", emoji: "👟" },
        { name: "Jerseys", emoji: "👕" },
        { name: "Equipment", emoji: "🏏" },
        { name: "Accessories", emoji: "🎒" },
    ];

    return (
        <section className="categories">
            <h2>Shop by Category</h2>

            <div className="category-grid">
                {categories.map((item, index) => (
                    <div className="category-card" key={index}>
                        <span className="category-icon">{item.emoji}</span>
                        <h3>{item.name}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Categories;