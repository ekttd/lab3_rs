from pymongo import MongoClient
from .config import MONGO_URL, DATABASE_NAME, USERS

client = MongoClient(MONGO_URL)
db = client[DATABASE_NAME]
users_collection = db[USERS]
users_collection.create_index("username", unique=True)
