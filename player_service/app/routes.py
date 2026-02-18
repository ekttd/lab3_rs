from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from .database import db
from .config import STATISTICS_SERVICE_URL
from .security import verify_token
import requests


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
def get_all_players(user=Depends(verify_token)):
    players = collection.find()
    return [serialize(player) for player in players]


@router.post("/players")
def create_player(player: dict, user=Depends(verify_token)):
    name = player.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")

    player_id = None

    # Проверяем statistics-service
    try:
        response = requests.get(
            f"{STATISTICS_SERVICE_URL}/statistics/by-name/{name}",
            timeout=2
        )

        if response.status_code == 200:
            stats = response.json()

            if isinstance(stats, list) and stats:
                player_id = stats[0]["id"]
            elif isinstance(stats, dict):
                player_id = stats["id"]

    except requests.RequestException:
        pass

    obj_id = ObjectId(player_id) if player_id else ObjectId()

    existing = collection.find_one({
        "$or": [
            {"_id": obj_id},
            {"name": {"$regex": f"^{name}$", "$options": "i"}}
        ]
    })

    if existing:
        raise HTTPException(status_code=400, detail="Player already exists")

    player_document = {
        "_id": obj_id,
        "name": name,
        "age": player.get("age", 0),
        "club": player.get("club", ""),
        "position": player.get("position", "")
    }

    collection.insert_one(player_document)

    return {
        "message": "Player created",
        "id": str(obj_id)
    }


@router.get("/players/{player_id}")
def get_player(player_id: str, user=Depends(verify_token)):
    player = collection.find_one({"_id": ObjectId(player_id)})
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return serialize(player)


@router.get("/players/search/{name}")
def find_by_name(name: str, user=Depends(verify_token)):
    players = collection.find({"name": {"$regex": f"^{name}$", "$options": "i"}})
    return [serialize(p) for p in players]


@router.get("/players/full/{name}")
def get_full_player_info(name: str, user=Depends(verify_token)):
    player = collection.find_one({
        "name": {"$regex": f"^{name}$", "$options": "i"}
    })

    if not player:
        raise HTTPException(status_code=404, detail="Player not found")

    player_data = serialize(player)
    player_id = player_data["id"]

    statistics_data = None

    try:
        response = requests.get(
            f"{STATISTICS_SERVICE_URL}/statistics/{player_id}",
            timeout=2
        )

        if response.status_code == 200:
            statistics_data = response.json()

    except requests.RequestException:
        pass

    if not statistics_data:
        try:
            response = requests.get(
                f"{STATISTICS_SERVICE_URL}/statistics/by-name/{name}",
                timeout=2
            )

            if response.status_code == 200:
                stats = response.json()

                if isinstance(stats, list) and stats:
                    statistics_data = stats[0]
                elif isinstance(stats, dict):
                    statistics_data = stats

        except requests.RequestException:
            pass

    return {
        "player": player_data,
        "statistics": statistics_data
    }
