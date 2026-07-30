from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["AccessoriesDB"]

products_collection = db["products"]
orders_collection = db["orders"]