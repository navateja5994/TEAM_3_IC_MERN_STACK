from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://sameenaghouse77_db_user:Afreen12345@cluster0.sgjnl3f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)

db = client["AccessoriesDB"]

products_collection = db["products"]
orders_collection = db["orders"]