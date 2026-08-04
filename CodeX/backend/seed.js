import Product from './models/Product.js';

const products = [
  // Original 13 Products
  {
    id: 1,
    name: 'AURA NOIR',
    category: 'men',
    price: 145.0,
    image: 'aura_noir',
    concentration: 'Eau de Parfum',
    description: 'An intense, mysterious scent combining earthy vetiver, smoky cedarwood, and cracked black pepper.',
    notes: ['Vetiver', 'Cedarwood', 'Black Pepper', 'Sandalwood'],
    rating: 4.9,
    reviews: 124
  },
  {
    id: 2,
    name: 'BLEU AZUR',
    category: 'men',
    price: 125.0,
    image: 'bleu_azur',
    concentration: 'Eau de Parfum',
    description: 'A clean, crisp composition featuring marine sea salt, zesty bergamot, and rich, earthy ambergris.',
    notes: ['Sea Salt', 'Bergamot', 'Ambergris', 'Grapefruit'],
    rating: 4.7,
    reviews: 98
  },
  {
    id: 3,
    name: 'ROSE D\'AMOUR',
    category: 'women',
    price: 135.0,
    image: 'rose_damour',
    concentration: 'Eau de Parfum',
    description: 'An enchanting, seductive fragrance layered with sweet Damask rose, warm patchouli, and dark cocoa.',
    notes: ['Damask Rose', 'Patchouli', 'Dark Chocolate', 'Vanilla'],
    rating: 4.8,
    reviews: 156
  },
  {
    id: 4,
    name: 'AMBER LUMIÈRE',
    category: 'women',
    price: 175.0,
    image: 'amber_lumiere',
    concentration: 'Extrait de Parfum',
    description: 'A glowing, sophisticated blend of warm golden amber, sweet tonka bean, and sheer white musk.',
    notes: ['Golden Amber', 'Tonka Bean', 'White Musk', 'Benzoin'],
    rating: 5.0,
    reviews: 82
  },
  {
    id: 5,
    name: 'OUD INSENSÉ',
    category: 'men',
    price: 165.0,
    image: 'oud_insense',
    concentration: 'Extrait de Parfum',
    description: 'A deep, hypnotic blend of premium Cambodian oud, dark leather, warm saffron, and burning incense.',
    notes: ['Cambodian Oud', 'Leather', 'Saffron', 'Incense'],
    rating: 4.9,
    reviews: 112
  },
  {
    id: 6,
    name: 'ROUGE SOIRÉE',
    category: 'women',
    price: 155.0,
    image: 'rouge_soiree',
    concentration: 'Eau de Parfum',
    description: 'A glamorous, velvety symphony of sweet jasmine grandiflorum, bitter almond, warm amberwood, and sheer musk.',
    notes: ['Jasmine', 'Bitter Almond', 'Amberwood', 'Musk'],
    rating: 4.8,
    reviews: 143
  },
  {
    id: 7,
    name: 'VERT ÉCLAT',
    category: 'men',
    price: 130.0,
    image: 'vert_eclat',
    concentration: 'Eau de Parfum',
    description: 'A bright, invigorating creation featuring fresh crushed mint, crisp green tea, zesty lime, and clean white cedar.',
    notes: ['Mint', 'Green Tea', 'Lime', 'White Cedar'],
    rating: 4.6,
    reviews: 76
  },
  {
    id: 8,
    name: 'SOLEIL D\'OR',
    category: 'women',
    price: 180.0,
    image: 'soleil_dor',
    concentration: 'Extrait de Parfum',
    description: 'A glowing, radiant composition layered with sweet orange blossom, creamy coconut milk, sea salt, and ylang-ylang.',
    notes: ['Orange Blossom', 'Coconut Milk', 'Sea Salt', 'Ylang-Ylang'],
    rating: 5.0,
    reviews: 64
  },
  {
    id: 9,
    name: 'CUIR IMPÉRIAL',
    category: 'men',
    price: 160.0,
    image: 'cuir_imperial',
    concentration: 'Eau de Parfum',
    description: 'A powerful, sophisticated fusion of rich Russian leather, smoky tobacco leaf, and warm amberwood.',
    notes: ['Russian Leather', 'Tobacco Leaf', 'Amberwood', 'Cacao'],
    rating: 4.8,
    reviews: 92
  },
  {
    id: 10,
    name: 'JARDIN DE NUIT',
    category: 'women',
    price: 150.0,
    image: 'jardin_de_nuit',
    concentration: 'Eau de Parfum',
    description: 'A seductive nocturnal bloom blending sweet night-blooming jasmine, creamy tuberose, and warm Madagascar vanilla.',
    notes: ['Night Jasmine', 'Tuberose', 'Vanilla', 'Sandalwood'],
    rating: 4.9,
    reviews: 104
  },
  {
    id: 11,
    name: 'SANTAL SUPRÊME',
    category: 'men',
    price: 170.0,
    image: 'santal_supreme',
    concentration: 'Extrait de Parfum',
    description: 'A smooth, enveloping composition of warm Australian sandalwood, spicy cardamom, and sheer papyrus.',
    notes: ['Sandalwood', 'Cardamom', 'Papyrus', 'Leather'],
    rating: 4.7,
    reviews: 88
  },
  {
    id: 12,
    name: 'NEROLI BLANC',
    category: 'women',
    price: 140.0,
    image: 'neroli_blanc',
    concentration: 'Eau de Parfum',
    description: 'A sparkling, sunlit masterpiece combining crisp Tunisian neroli, sweet orange blossom, and clean white musk.',
    notes: ['Neroli', 'Orange Blossom', 'White Musk', 'Petitgrain'],
    rating: 5.0,
    reviews: 73
  },
  {
    id: 13,
    name: 'NOIR ÉPICE',
    category: 'men',
    price: 155.0,
    image: 'noir_epice',
    concentration: 'Eau de Parfum',
    description: 'An exotic, spicy blend featuring warm cinnamon bark, zesty fresh ginger, and rich Indonesian patchouli.',
    notes: ['Cinnamon Bark', 'Ginger', 'Patchouli', 'Pimento'],
    rating: 4.8,
    reviews: 65
  },
  
  // 10 New Men's Fragrances
  {
    id: 14,
    name: 'ONYX ABSOLU',
    category: 'men',
    price: 165.0,
    image: 'onyx_absolu',
    concentration: 'Extrait de Parfum',
    description: 'A bold, dark essence of black oud, charred incense, and raw leather.',
    notes: ['Black Oud', 'Incense', 'Leather', 'Vanilla'],
    rating: 4.9,
    reviews: 102
  },
  {
    id: 15,
    name: 'CANYON MIST',
    category: 'men',
    price: 135.0,
    image: 'bleu_azur',
    concentration: 'Eau de Parfum',
    description: 'A refreshing morning breeze of wild sage, juniper berries, and damp granite.',
    notes: ['Sage', 'Juniper', 'Granite', 'Vetiver'],
    rating: 4.7,
    reviews: 88
  },
  {
    id: 16,
    name: 'SAFFRON NOIR',
    category: 'men',
    price: 150.0,
    image: 'noir_epice',
    concentration: 'Eau de Parfum',
    description: 'An exotic oriental dry spice blend of golden saffron, black tea leaf, and warm tobacco.',
    notes: ['Saffron', 'Black Tea', 'Tobacco', 'Cardamom'],
    rating: 4.8,
    reviews: 74
  },
  {
    id: 17,
    name: 'VAPOR OCEAN',
    category: 'men',
    price: 140.0,
    image: 'vert_eclat',
    concentration: 'Eau de Parfum',
    description: 'A bracing coastal marine air blended with fresh eucalyptus and ocean driftwood.',
    notes: ['Sea Kelp', 'Eucalyptus', 'Driftwood', 'Bergamot'],
    rating: 4.6,
    reviews: 92
  },
  {
    id: 18,
    name: 'CEDRUS ROYALE',
    category: 'men',
    price: 155.0,
    image: 'cuir_imperial',
    concentration: 'Eau de Parfum',
    description: 'A sophisticated combination of royal cedar, precious iris root, and warm amber resin.',
    notes: ['Cedarwood', 'Iris Root', 'Amber Resin', 'Musk'],
    rating: 4.8,
    reviews: 110
  },
  {
    id: 19,
    name: 'MAISON OAK',
    category: 'men',
    price: 170.0,
    image: 'santal_supreme',
    concentration: 'Extrait de Parfum',
    description: 'A heavy, comforting forest aroma of aged oakwood, sweet maple sap, and roasted chestnuts.',
    notes: ['Oakwood', 'Maple Sap', 'Chestnut', 'Sandalwood'],
    rating: 4.9,
    reviews: 63
  },
  {
    id: 20,
    name: 'CITRON VETIVER',
    category: 'men',
    price: 130.0,
    image: 'vert_eclat',
    concentration: 'Eau de Parfum',
    description: 'A bright, citrusy opening of Sicilian lemon melting into smokey, earthy vetiver roots.',
    notes: ['Sicilian Lemon', 'Vetiver', 'Grapefruit', 'Patchouli'],
    rating: 4.7,
    reviews: 85
  },
  {
    id: 21,
    name: 'SPICE BAZAAR',
    category: 'men',
    price: 148.0,
    image: 'noir_epice',
    concentration: 'Eau de Parfum',
    description: 'An aromatic stroll through a spice market with warm nutmeg, star anise, and sweet honey.',
    notes: ['Nutmeg', 'Star Anise', 'Honey', 'Clove'],
    rating: 4.8,
    reviews: 67
  },
  {
    id: 22,
    name: 'OUD CELESTE',
    category: 'men',
    price: 185.0,
    image: 'oud_insense',
    concentration: 'Extrait de Parfum',
    description: 'A heavenly, spiritual blend of white oud, sweet frankincense, and soft cashmere wood.',
    notes: ['White Oud', 'Frankincense', 'Cashmere', 'Ambergris'],
    rating: 5.0,
    reviews: 54
  },
  {
    id: 23,
    name: 'NOIR INFINI',
    category: 'men',
    price: 160.0,
    image: 'aura_noir',
    concentration: 'Eau de Parfum',
    description: 'An elegant, mysterious cocktail of dark cacao, roasted coffee bean, and black suede.',
    notes: ['Dark Cacao', 'Coffee Bean', 'Suede', 'Vanilla'],
    rating: 4.9,
    reviews: 79
  },

  // 10 New Women's Fragrances
  {
    id: 24,
    name: 'PIVOINE NECTAR',
    category: 'women',
    price: 145.0,
    image: 'pivoine_nectar',
    concentration: 'Eau de Parfum',
    description: 'A sweet, blooming bouquet of pink peonies, white nectarine, and warm vanilla sugar.',
    notes: ['Peony', 'Nectarine', 'Vanilla', 'White Musk'],
    rating: 4.9,
    reviews: 115
  },
  {
    id: 25,
    name: 'ORANGERIE SOL',
    category: 'women',
    price: 138.0,
    image: 'neroli_blanc',
    concentration: 'Eau de Parfum',
    description: 'A bright, sunny grove of sweet orange blossom, green mandarin, and warm honeyed honeycomb.',
    notes: ['Orange Blossom', 'Mandarin', 'Honey', 'Petitgrain'],
    rating: 4.8,
    reviews: 90
  },
  {
    id: 26,
    name: 'NUIT VANILLE',
    category: 'women',
    price: 160.0,
    image: 'jardin_de_nuit',
    concentration: 'Extrait de Parfum',
    description: 'A seductive evening blend of dark Madagascar vanilla, burning amberwood, and orchid.',
    notes: ['Madagascar Vanilla', 'Amberwood', 'Orchid', 'Musk'],
    rating: 4.9,
    reviews: 134
  },
  {
    id: 27,
    name: 'PETAL BLUSH',
    category: 'women',
    price: 128.0,
    image: 'rose_damour',
    concentration: 'Eau de Parfum',
    description: 'A delicate, powdery touch of fresh cherry blossoms, pink rose, and soft musk.',
    notes: ['Cherry Blossom', 'Rose', 'Powdery Musk', 'Pear'],
    rating: 4.7,
    reviews: 81
  },
  {
    id: 28,
    name: 'COCO SCENT',
    category: 'women',
    price: 152.0,
    image: 'soleil_dor',
    concentration: 'Eau de Parfum',
    description: 'A tropical paradise of creamy coconut milk, fresh tiare flower, and warm beach sand.',
    notes: ['Coconut Milk', 'Tiare Flower', 'Sand', 'Vanilla'],
    rating: 4.8,
    reviews: 107
  },
  {
    id: 29,
    name: 'LUMIÈRE BLANCHE',
    category: 'women',
    price: 165.0,
    image: 'amber_lumiere',
    concentration: 'Extrait de Parfum',
    description: 'A radiant, sparkling crystal blend of white amber, sweet pear nectar, and soft cashmeran.',
    notes: ['White Amber', 'Pear Nectar', 'Cashmeran', 'Jasmine'],
    rating: 5.0,
    reviews: 72
  },
  {
    id: 30,
    name: 'JASMINE SATIN',
    category: 'women',
    price: 142.0,
    image: 'rouge_soiree',
    concentration: 'Eau de Parfum',
    description: 'A smooth, velvety drape of night-blooming jasmine, sweet peach skin, and light musk.',
    notes: ['Jasmine', 'Peach', 'Musk', 'Sandalwood'],
    rating: 4.7,
    reviews: 95
  },
  {
    id: 31,
    name: 'IRIS CACHEMIRE',
    category: 'women',
    price: 170.0,
    image: 'amber_lumiere',
    concentration: 'Extrait de Parfum',
    description: 'An elegant, luxurious embrace of precious Florentine iris, warm suede, and sweet benzoin.',
    notes: ['Florentine Iris', 'Suede', 'Benzoin', 'Vanilla'],
    rating: 4.9,
    reviews: 66
  },
  {
    id: 32,
    name: 'FRAISE D\'AMOUR',
    category: 'women',
    price: 135.0,
    image: 'rose_damour',
    concentration: 'Eau de Parfum',
    description: 'A playful, sweet confection of wild strawberries, whipped sugar cream, and pink petals.',
    notes: ['Wild Strawberry', 'Sugar Cream', 'Rose', 'Musk'],
    rating: 4.8,
    reviews: 121
  },
  {
    id: 33,
    name: 'TUBEROSE ROYALE',
    category: 'women',
    price: 158.0,
    image: 'jardin_de_nuit',
    concentration: 'Eau de Parfum',
    description: 'A royal, heavy white floral declaration of Indian tuberose, sweet gardenia, and warm amber.',
    notes: ['Tuberose', 'Gardenia', 'Amber', 'Sandalwood'],
    rating: 4.9,
    reviews: 88
  }
];

export const seedDatabase = async () => {
  try {
    // Clear existing products to ensure we have the fresh 33 products list
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Database seeded successfully with all 33 luxury products (17 men's, 16 women's).");
  } catch (error) {
    console.error("Error seeding the database:", error.message);
  }
};
