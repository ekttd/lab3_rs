import os
from dotenv import load_dotenv


load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8003))
PLAYER_SERVICE_URL = os.getenv("PLAYER_SERVICE_URL")
SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
USERS=os.getenv("USERS")
PLAYER_SERVICE_URL=os.getenv("PLAYER_SERVICE_URL")
