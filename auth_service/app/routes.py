from fastapi import APIRouter, HTTPException, Query
from .schemas import UserRegister, UserLogin
from .database import db, users_collection
from .security import hash_password, verify_password, create_access_token
from .config import PLAYER_SERVICE_URL
from urllib.parse import urlparse, urlencode, urlunparse, parse_qsl
from typing import Optional
from fastapi.responses import RedirectResponse


router = APIRouter()


@router.post("/register")
def register(user: UserRegister):
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)

    users_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed
    })

    return {"message": "User created successfully"}


@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})

    return {"access_token": token, "token_type": "bearer"}