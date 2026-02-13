from fastapi import APIRouter, HTTPException
from bson import ObjectId
from .database import db

router = APIRouter()
collection = db["players"]


def serialize(player):
    return {
        "id": str(player["_id"]),
        "name": player["name"],
        "age": player["age"],
        "club": player["club"],
        "position": player["position"]
    }


@router.get("/players")
def get_all_players():
    players = collection.find()
    return [serialize(player) for player in players]


@router.post("/players")
def create_player(player: dict):
    result = collection.insert_one(player)
    return {"id": str(result.inserted_id)}


@router.get("/players/{player_id}")
def get_player(player_id: str):
    player = collection.find_one({"_id": ObjectId(player_id)})
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return serialize(player)


@router.get("/players/search/{name}")
def find_by_name(name: str):
    players = collection.find({"name": {"$regex": name, "$options": "i"}})
    return [serialize(p) for p in players]