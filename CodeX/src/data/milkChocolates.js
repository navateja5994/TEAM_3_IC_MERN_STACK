const milkChocolates = [
  {
    id: 41,
    name: "Swiss Milk Chocolate Classic",
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80",
    description: "Authentic Swiss milk chocolate made with Alpine milk for an ultra-smooth, creamy taste.",
    rating: 4.7
  },
  {
    id: 42,
    name: "Caramel Filled Milk Squares",
    price: "$9.75",
    image: "https://cococart.in/cdn/shop/products/277561913_1329995014160836_4796798666536159654_n.jpg?v=1675772161&width=1946",
    description: "Milk chocolate squares oozing with buttery soft caramel center in every bite.",
    rating: 4.6
  },
  {
    id: 43,
    name: "Macadamia Nut Milk Bar",
    price: "$13.25",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80",
    description: "Whole Hawaiian macadamia nuts embedded in creamy milk chocolate for tropical luxury.",
    rating: 4.8
  },
  {
    id: 44,
    name: "Milk Chocolate Honeycomb Crunch",
    price: "$10.50",
    image: "https://floristchennai.com/cdn/shop/files/KitKat-DairyMilk-Chocolate-Bouquet.jpg?v=1756864553",
    description: "Aerated honeycomb pieces coated in milk chocolate for a satisfying crispy texture.",
    rating: 4.5
  },
  {
    id: 45,
    name: "Nougat Milk Chocolate Bar",
    price: "$7.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQozqNwQ2A-q_GpZYgapWWFlahDhIK9UXWMqPPzlTIFKw&s",
    description: "Fluffy vanilla nougat and caramel layered under smooth milk chocolate.",
    rating: 4.4
  },
  {
    id: 46,
    name: "Milk Chocolate Covered Pretzels",
    price: "$8.25",
    image: "https://www.soothys.in/cdn/shop/files/Milk_Chocolate_Classic_2.png?v=1742398693",
    description: "Crunchy salted pretzels generously dipped in velvety milk chocolate. Sweet meets salty.",
    rating: 4.6
  },
  {
    id: 47,
    name: "Irish Cream Milk Truffles",
    price: "$16.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZHIKTxExsSq6q5igEdVjlbBGgtudAuTSTr0Tmwx2txg&s=10",
    description: "Luxurious Irish cream ganache truffles enrobed in silky milk chocolate.",
    rating: 4.7
  },
  {
    id: 48,
    name: "Rice Crisp Milk Chocolate",
    price: "$6.99",
    image: "https://cdn.bloomsflora.com/uploads/product/bloomsflora/FEB2026/13715-1770285424519.webp",
    description: "Crisped rice cereal mixed with creamy milk chocolate for a delightful childhood crunch.",
    rating: 4.3
  },
  {
    id: 49,
    name: "Tiramisu Milk Chocolate Square",
    price: "$11.25",
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&q=80",
    description: "Mascarpone and espresso ganache filling in milk chocolate, dusted with cocoa powder.",
    rating: 4.6
  },
  {
    id: 50,
    name: "Milk Chocolate Peanut Brittle",
    price: "$9.00",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
    description: "Classic peanut brittle with roasted peanuts wrapped in a milk chocolate coating.",
    rating: 4.4
  },
  {
    id: 51,
    name: "Banana Cream Milk Delight",
    price: "$8.75",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&q=80",
    description: "Creamy banana ganache filling inside milk chocolate with natural banana essence.",
    rating: 4.2
  },
  {
    id: 52,
    name: "Toasted Coconut Milk Rounds",
    price: "$10.00",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80",
    description: "Chewy toasted coconut centers coated in premium milk chocolate for island bliss.",
    rating: 4.5
  },
  {
    id: 53,
    name: "Dulce de Leche Milk Bar",
    price: "$12.00",
    image: "https://images.unsplash.com/photo-1611229406189-f5586e5ac506?w=400&q=80",
    description: "Slow-cooked dulce de leche caramel swirl inside rich Argentine milk chocolate.",
    rating: 4.8
  },
  {
    id: 54,
    name: "Cinnamon Milk Chocolate Discs",
    price: "$7.50",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
    description: "Round milk chocolate discs infused with warm Ceylon cinnamon for a spicy-sweet treat.",
    rating: 4.3
  },
  {
    id: 55,
    name: "Milk Chocolate Turtles",
    price: "$13.50",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    description: "Pecans and chewy caramel clusters shaped like turtles, drenched in milk chocolate.",
    rating: 4.7
  },
  {
    id: 56,
    name: "Birthday Cake Milk Bites",
    price: "$9.50",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80",
    description: "Funfetti cake and frosting ganache in milk chocolate, rolled in colorful sprinkles.",
    rating: 4.5
  },
  {
    id: 57,
    name: "Maple Walnut Milk Square",
    price: "$11.75",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80",
    description: "Vermont maple syrup ganache with toasted walnuts, wrapped in creamy milk chocolate.",
    rating: 4.6
  },
  {
    id: 58,
    name: "S'mores Milk Chocolate Bar",
    price: "$8.50",
    image: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=400&q=80",
    description: "Graham cracker crumbs and marshmallow fluff layered inside classic milk chocolate.",
    rating: 4.4
  },
  {
    id: 59,
    name: "Cashew Butter Milk Cups",
    price: "$10.25",
    image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=400&q=80",
    description: "Smooth roasted cashew butter filling inside handcrafted milk chocolate cups.",
    rating: 4.5
  },
  {
    id: 60,
    name: "Shortbread Milk Chocolate Bites",
    price: "$9.25",
    image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400&q=80",
    description: "Buttery shortbread cookie pieces dipped and drizzled in creamy milk chocolate.",
    rating: 4.4
  }
];

export default milkChocolates;
