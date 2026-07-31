const darkChocolates = [
  {
    id: 21,
    name: "Midnight 72% Dark Bar",
    price: "$9.49",
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80",
    description: "Premium 72% cacao dark chocolate with deep, rich cocoa notes and a smooth velvety finish.",
    rating: 4.7
  },
  {
    id: 22,
    name: "Extra Dark 85% Intense",
    price: "$11.99",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80",
    description: "Bold 85% cacao dark chocolate with intense earthy flavors and a subtly bitter aftertaste.",
    rating: 4.5
  },
  {
    id: 23,
    name: "Dark Sea Salt Caramel",
    price: "$10.99",
    image: "https://images.unsplash.com/photo-1610450948581-2b66d58f14ca?w=400&q=80",
    description: "Silky dark chocolate with liquid salted caramel center and flecks of Mediterranean sea salt.",
    rating: 4.8
  },
  {
    id: 24,
    name: "Belgian Dark Truffles",
    price: "$21.50",
    image: "https://images.unsplash.com/photo-1599599810694-56e29615f751?w=400&q=80",
    description: "Hand-rolled Belgian dark chocolate truffles with smooth ganache and cocoa dusting.",
    rating: 4.9
  },
  {
    id: 25,
    name: "Dark Chocolate Covered Espresso Beans",
    price: "$8.75",
    image: "https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=400&q=80",
    description: "Roasted Arabica espresso beans generously coated in rich 65% dark chocolate.",
    rating: 4.4
  },
  {
    id: 26,
    name: "Single Origin Ecuador 75%",
    price: "$14.25",
    image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=400&q=80",
    description: "Single-origin Ecuadorian cacao with floral notes, red fruit undertones, and smooth finish.",
    rating: 4.7
  },
  {
    id: 27,
    name: "Dark Chocolate Raspberry Rounds",
    price: "$12.50",
    image: "https://images.unsplash.com/photo-1551024709-8f23bef4c123?w=400&q=80",
    description: "Tangy raspberry jelly centers coated in premium dark chocolate with a glossy finish.",
    rating: 4.6
  },
  {
    id: 28,
    name: "Peru 80% Organic Dark",
    price: "$13.00",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
    description: "Certified organic Peruvian cacao, 80% dark with notes of blackberry and earthy spices.",
    rating: 4.5
  },
  {
    id: 29,
    name: "Dark Chocolate Almond Bark",
    price: "$10.25",
    image: "https://images.unsplash.com/photo-1571766075764-efae1e5d02d7?w=400&q=80",
    description: "Thin dark chocolate bark scattered with whole roasted almonds and a touch of sea salt.",
    rating: 4.3
  },
  {
    id: 30,
    name: "Chili Lime Dark Chocolate",
    price: "$9.99",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80",
    description: "Adventurous dark chocolate with a kick of cayenne chili and refreshing lime zest.",
    rating: 4.4
  },
  {
    id: 31,
    name: "Madagascar Vanilla Dark",
    price: "$12.75",
    image: "https://images.unsplash.com/photo-1611229406189-f5586e5ac506?w=400&q=80",
    description: "70% dark chocolate infused with real Madagascar vanilla bean pods for aromatic depth.",
    rating: 4.6
  },
  {
    id: 32,
    name: "Dark Chocolate Cherry Cordials",
    price: "$14.00",
    image: "https://images.unsplash.com/photo-1558326567-e063ae3e9436?w=400&q=80",
    description: "Whole maraschino cherries in liquid sugar syrup, wrapped in premium dark chocolate.",
    rating: 4.7
  },
  {
    id: 33,
    name: "Venezuela Criollo 78%",
    price: "$17.50",
    image: "https://images.unsplash.com/photo-1544551763-8dd475b64763?w=400&q=80",
    description: "Rare Venezuelan Criollo cacao offering delicate floral notes and refined cocoa flavor.",
    rating: 4.9
  },
  {
    id: 34,
    name: "Dark Orange Peel Strips",
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400&q=80",
    description: "Candied orange peel strips hand-dipped in 70% dark chocolate, lightly sugar-dusted.",
    rating: 4.5
  },
  {
    id: 35,
    name: "Dark Chocolate Hazelnut Spread Bar",
    price: "$11.50",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
    description: "Dark chocolate filled with creamy hazelnut spread, reminiscent of luxury Nutella.",
    rating: 4.6
  },
  {
    id: 36,
    name: "Ghana Gold 70% Dark",
    price: "$10.75",
    image: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400&q=80",
    description: "West African Ghanaian cacao with bold, classic dark chocolate flavor and smooth texture.",
    rating: 4.4
  },
  {
    id: 37,
    name: "Dark Blueberry Acai Bites",
    price: "$9.50",
    image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80",
    description: "Dried blueberries and acai pieces enrobed in dark chocolate, an antioxidant-rich treat.",
    rating: 4.3
  },
  {
    id: 38,
    name: "Smoked Sea Salt Dark Square",
    price: "$12.25",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
    description: "Rich dark chocolate squares topped with artisanal smoked sea salt for a savory-sweet kick.",
    rating: 4.7
  },
  {
    id: 39,
    name: "Sugar-Free Dark Delight",
    price: "$9.25",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80",
    description: "Stevia-sweetened 75% dark chocolate bar, perfect for low-sugar and keto lifestyles.",
    rating: 4.2
  },
  {
    id: 40,
    name: "Dark Chocolate Walnut Cluster",
    price: "$11.00",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    description: "Premium California walnuts clustered together with silky 68% dark chocolate.",
    rating: 4.5
  }
];

export default darkChocolates;
