import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "forensix_db")


class Database:
    client: AsyncIOMotorClient = None
    db = None


db_instance = Database()


async def connect_to_mongo():
    """Establish connection to MongoDB Atlas."""
    db_instance.client = AsyncIOMotorClient(MONGO_URI)
    db_instance.db = db_instance.client[DB_NAME]
    print(f"[Forensix] Connected to MongoDB — database: '{DB_NAME}'")


async def close_mongo_connection():
    """Close the MongoDB connection."""
    if db_instance.client:
        db_instance.client.close()
        print("[Forensix] MongoDB connection closed.")


def get_database():
    """Return the active database instance."""
    return db_instance.db
