import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8001))
STATISTICS_SERVICE_URL = os.getenv("STATISTICS_SERVICE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
