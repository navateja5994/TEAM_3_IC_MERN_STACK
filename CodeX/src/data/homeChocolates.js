const homeChocolates = [
  {
    id: 1,
    name: "Classic Milk Chocolate Bar",
    price: "$7.99",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80",
    description: "Smooth, creamy milk chocolate crafted from premium cocoa beans for a timeless, indulgent taste.",
    rating: 4.5
  },
  {
    id: 2,
    name: "Velvet Truffle Collection",
    price: "$18.50",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80",
    description: "Assorted chocolate truffles with silky ganache centers, dusted with fine cocoa powder.",
    rating: 4.8
  },
  {
    id: 3,
    name: "Hazelnut Praline Delight",
    price: "$12.00",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
    description: "Rich hazelnut praline encased in smooth milk chocolate with crunchy caramelized nut pieces.",
    rating: 4.6
  },
  {
    id: 4,
    name: "Creamy White Chocolate",
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1514996937319-344454492b37?w=400&q=80",
    description: "Luxuriously smooth white chocolate with vanilla notes and a touch of creamy cocoa butter.",
    rating: 4.3
  },
  {
    id: 5,
    name: "Salted Caramel Bliss",
    price: "$10.49",
    image: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400&q=80",
    description: "Golden caramel center with fleur de sel, enveloped in rich milk chocolate.",
    rating: 4.7
  },
  {
    id: 6,
    name: "Roasted Almond Crunch",
    price: "$11.99",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    description: "Whole roasted almonds embedded in premium milk chocolate for a satisfying crunch.",
    rating: 4.4
  },
  {
    id: 7,
    name: "Strawberry Dream Truffle",
    price: "$9.99",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&q=80",
    description: "Sun-ripened strawberry ganache wrapped in white chocolate with a pink shimmer finish.",
    rating: 4.5
  },
  {
    id: 8,
    name: "Cocoa Nib Crunch Bar",
    price: "$10.99",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80",
    description: "Dark chocolate studded with roasted cocoa nibs for an intense, textured experience.",
    rating: 4.2
  },
  {
    id: 9,
    name: "Peanut Butter Cup",
    price: "$6.99",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
    description: "Creamy peanut butter filling nestled inside a thick milk chocolate shell.",
    rating: 4.6
  },
  {
    id: 10,
    name: "Raspberry Ganache Hearts",
    price: "$14.50",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80",
    description: "Heart-shaped chocolates filled with tangy raspberry ganache and dark chocolate.",
    rating: 4.7
  },
  {
    id: 11,
    name: "Toffee Crunch Cluster",
    price: "$9.75",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
    description: "Buttery toffee pieces with toasted pecans, enrobed in silky milk chocolate.",
    rating: 4.4
  },
  {
    id: 12,
    name: "Matcha White Chocolate",
    price: "$11.50",
    image: "https://images.unsplash.com/photo-1582657233895-0f37a3f150c0?w=400&q=80",
    description: "Premium Japanese matcha infused into creamy white chocolate for an earthy delight.",
    rating: 4.3
  },
  {
    id: 13,
    name: "Coconut Paradise Bar",
    price: "$8.50",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80",
    description: "Chewy coconut caramel filling covered in smooth milk chocolate with tropical flair.",
    rating: 4.5
  },
  {
    id: 14,
    name: "Espresso Bean Truffle",
    price: "$13.25",
    image: "https://images.unsplash.com/photo-1594041225306-7949c2e08dfb?w=400&q=80",
    description: "Dark chocolate truffle with espresso ganache and a whole roasted coffee bean on top.",
    rating: 4.8
  },
  {
    id: 15,
    name: "Mint Chocolate Thins",
    price: "$7.50",
    image: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=400&q=80",
    description: "Crispy dark chocolate thins infused with natural peppermint oil for a fresh finish.",
    rating: 4.4
  },
  {
    id: 16,
    name: "Caramel Nut Cluster",
    price: "$10.75",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    description: "Walnuts, pecans, and almonds held together by golden caramel and milk chocolate.",
    rating: 4.6
  },
  {
    id: 17,
    name: "Vanilla Bean Truffle",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80",
    description: "Madagascar vanilla bean ganache in white chocolate, garnished with edible gold leaf.",
    rating: 4.7
  },
  {
    id: 18,
    name: "Banana Chocolate Bites",
    price: "$8.25",
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&q=80",
    description: "Freeze-dried banana pieces dipped in rich dark chocolate for a tropical treat.",
    rating: 4.2
  },
  {
    id: 19,
    name: "Lavender Honey Truffle",
    price: "$15.00",
    image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400&q=80",
    description: "Lavender-infused honey ganache in dark chocolate with dried lavender petals.",
    rating: 4.5
  },
  {
    id: 20,
    name: "Pistachio Marzipan",
    price: "$13.75",
    image: "https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=400&q=80",
    description: "Sweet pistachio marzipan center wrapped in milk chocolate with crushed pistachios.",
    rating: 4.6
  }
];

export default homeChocolates;
