const premiumChocolates = [
  {
    id: 61,
    name: "Anhydrous Grand Cru 99%",
    price: "$28.00",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80",
    description: "Ultra-premium 99% single-origin cacao bar showcasing pure, unadulterated chocolate essence.",
    rating: 4.9
  },
  {
    id: 62,
    name: "Gold Leaf Chocolate Bonbons",
    price: "$45.00",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80",
    description: "Exquisite bonbons hand-finished with 24-karat edible gold leaf for the ultimate luxury.",
    rating: 5.0
  },
  {
    id: 63,
    name: "Caviar Chocolate Pearls",
    price: "$65.00",
    image: "https://images.unsplash.com/photo-1599599810694-56e29615f751?w=400&q=80",
    description: "Tiny dark chocolate pearls with a salted caramel core, presented in a crystal jar.",
    rating: 4.9
  },
  {
    id: 64,
    name: "Truffle Selection Vintage Reserve",
    price: "$55.00",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80",
    description: "Aged reserve truffle collection featuring rare 5-year cocoa bean blends and vintage spirits.",
    rating: 4.9
  },
  {
    id: 65,
    name: "Saffron Pistachio Chocolate",
    price: "$32.00",
    image: "https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=400&q=80",
    description: "Persian saffron and Sicilian pistachios blended into single-origin white chocolate.",
    rating: 4.8
  },
  {
    id: 66,
    name: "Ruby Chocolate Diamond Set",
    price: "$38.50",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80",
    description: "Rare naturally pink ruby chocolate cut into diamond shapes with raspberry notes.",
    rating: 4.7
  },
  {
    id: 67,
    name: "Cognac Infused Dark Ganache",
    price: "$36.00",
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80",
    description: "XO Cognac-infused dark chocolate ganache in hand-painted shells with a caramel crown.",
    rating: 4.9
  },
  {
    id: 68,
    name: "Himalayan Salt Crystal Discs",
    price: "$24.00",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
    description: "72% dark chocolate discs topped with hand-harvested pink Himalayan salt crystals.",
    rating: 4.7
  },
  {
    id: 69,
    name: "Édition Limitée Caramel Truffle",
    price: "$42.00",
    image: "https://images.unsplash.com/photo-1610450948581-2b66d58f14ca?w=400&q=80",
    description: "Limited-edition French salted caramel truffles in handcrafted ceramic gift box.",
    rating: 4.9
  },
  {
    id: 70,
    name: "Matcha Wagyu Chocolate",
    price: "$48.00",
    image: "https://images.unsplash.com/photo-1582657233895-0f37a3f150c0?w=400&q=80",
    description: "Uji matcha white chocolate with edible A5 Wagyu beef fat infusion, uniquely Japanese.",
    rating: 4.6
  },
  {
    id: 71,
    name: "Black Truffle Dark Ganache",
    price: "$58.00",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
    description: "Italian black winter truffle shavings inside 80% dark chocolate ganache squares.",
    rating: 4.8
  },
  {
    id: 72,
    name: "Dom Pérignon Champagne Truffles",
    price: "$75.00",
    image: "https://images.unsplash.com/photo-1551024709-8f23bef4c123?w=400&q=80",
    description: "Dom Pérignon champagne cream ganache in dark chocolate, finished with platinum leaf.",
    rating: 5.0
  },
  {
    id: 73,
    name: "Paco Jamandreu Masterpiece",
    price: "$40.00",
    image: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400&q=80",
    description: "Argentine master chocolatier signature piece with hazelnut praline and dulce de leche.",
    rating: 4.9
  },
  {
    id: 74,
    name: "Yuzu Citrus White Tiles",
    price: "$29.00",
    image: "https://images.unsplash.com/photo-1544551763-8dd475b64763?w=400&q=80",
    description: "Japanese yuzu zest-infused white chocolate tiles with candied yuzu peel.",
    rating: 4.6
  },
  {
    id: 75,
    name: "Vintage Port Wine Ganache",
    price: "$34.00",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80",
    description: "40-year Tawny Port wine ganache in dark chocolate shells with port reduction glaze.",
    rating: 4.8
  },
  {
    id: 76,
    name: "Crystalized Rose Petal Artisan",
    price: "$27.50",
    image: "https://images.unsplash.com/photo-1611229406189-f5586e5ac506?w=400&q=80",
    description: "Bulgarian rose water ganache with crystallized organic rose petals on white chocolate.",
    rating: 4.7
  },
  {
    id: 77,
    name: "Tonka Bean Madagascar Bar",
    price: "$22.00",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
    description: "Rare tonka bean infused into single-origin Madagascar dark chocolate 75%.",
    rating: 4.6
  },
  {
    id: 78,
    name: "Royal Pistachio Praliné",
    price: "$31.00",
    image: "https://images.unsplash.com/photo-1558326567-e063ae3e9436?w=400&q=80",
    description: "Sicilian pistachio praliné feuilletine crunch layered in premium milk and dark chocolate.",
    rating: 4.8
  },
  {
    id: 79,
    name: "Monsoon Harvest Collection",
    price: "$52.00",
    image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80",
    description: "Indian-origin monsoon-harvested cocoa bars with mango, cardamom, and jasmine infusions.",
    rating: 4.7
  },
  {
    id: 80,
    name: "Platinum Cacao Nib Brittle",
    price: "$26.00",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
    description: "Platinum-dusted gourmet cacao nib brittle with Madagascar vanilla and sea salt.",
    rating: 4.5
  }
];

export default premiumChocolates;
