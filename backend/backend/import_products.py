from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["AccessoriesDB"]

products = [
    {
        "name": "Small Pearl Earrings",
        "category": "earrings",
        "price": 10,
        "rating": 4.5,
        "reviews": 120,
        "image": "/images/earring1.jpg"
    },
    {
        "name": "Mini Hoop Earrings",
        "category": "earrings",
        "price": 20,
        "rating": 4.8,
        "reviews": 250,
        "image": "/images/earring2.jpg"
    },
    {
        "name": "Simple Fashion Ring",
        "category": "rings",
        "price": 10,
        "rating": 4.6,
        "reviews": 98,
        "image": "/images/ring1.jpg"
    },
    {
        "name": "Cute Necklace Set",
        "category": "necklace",
        "price": 50,
        "rating": 4.9,
        "reviews": 450,
        "image": "/images/necklace1.jpg"
    },
    {
        "name": "Charm Bracelet",
        "category": "bracelets",
        "price": 30,
        "rating": 4.7,
        "reviews": 320,
        "image": "/images/bracelet1.jpg"
    },
    {
        "name": "Designer Bangles",
        "category": "bangles",
        "price": 40,
        "rating": 4.8,
        "reviews": 200,
        "image": "/images/bangle1.jpg"
    },
    {
        "name": "Cute Hair Band",
        "category": "hairbands",
        "price": 10,
        "rating": 4.4,
        "reviews": 150,
        "image": "/images/hairband1.jpg"
    },
    {
        "name": "Butterfly Hair Clip",
        "category": "hairclips",
        "price": 15,
        "rating": 4.6,
        "reviews": 170,
        "image": "/images/hairclip1.jpg"
    },
    {
        "name": "Silver Anklet",
        "category": "anklets",
        "price": 60,
        "rating": 4.9,
        "reviews": 300,
        "image": "/images/anklet1.jpg"
    },
    {
        "name": "Professional Hair Plucker",
        "category": "pluckers",
        "price": 25,
        "rating": 4.5,
        "reviews": 90,
        "image": "/images/plucker1.jpg"
    },
    {
        "name": "Small Nose Pin",
        "category": "nosepins",
        "price": 10,
        "rating": 4.7,
        "reviews": 180,
        "image": "/images/nosepin1.jpg"
    },
    {
        "name": "Floral Gold Earrings",
        "category": "earrings",
        "price": 25,
        "rating": 4.7,
        "reviews": 340,
        "image": "/images/earring3.jpg"
    },
    {
        "name": "Adjustable Fashion Ring",
        "category": "rings",
        "price": 20,
        "rating": 4.5,
        "reviews": 210,
        "image": "/images/ring2.jpg"
    },
    {
        "name": "Pearl Necklace Set",
        "category": "necklace",
        "price": 80,
        "rating": 4.9,
        "reviews": 560,
        "image": "/images/necklace2.jpg"
    },
    {
        "name": "Stone Bracelet",
        "category": "bracelets",
        "price": 30,
        "rating": 4.6,
        "reviews": 180,
        "image": "/images/bracelet2.jpg"
    }
]

db.products.insert_many(products)

print("✅ Products Imported Successfully")