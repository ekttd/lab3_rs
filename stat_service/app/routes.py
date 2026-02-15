from fastapi import APIRouter, HTTPException
from bson import ObjectId
from .config import PLAYER_SERVICE_URL
from .database import db
import requests


router = APIRouter()
collection = db["statistics"]


def serialize(stat):
    return {
        "id": str(stat["_id"]),
        "name": stat["name"],
        "goals": stat["goals"],
        "assists": stat["assists"],
        "matches_played": stat["matches_played"]
    }


@router.get("/statistics")
def get_all_statistics():
    stats = collection.find()
    return [serialize(stat) for stat in stats]


@router.post("/statistics")
def create_statistics(stat: dict):
    name = stat.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")

    player_id = None
    try:
        response = requests.get(f"{PLAYER_SERVICE_URL}/players/search/{name}", timeout=2)
        if response.status_code == 200:
            players = response.json()
            if players:
                player_id = players[0]["id"]
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
        raise HTTPException(status_code=400, detail="Statistics already exists")

    stat_document = {
        "_id": obj_id,
        "name": name,
        "goals": stat.get("goals", 0),
        "assists": stat.get("assists", 0),
        "matches_played": stat.get("matches_played", 0)
    }

    collection.insert_one(stat_document)

    return {
        "message": "Statistics created",
        "id": str(obj_id)
    }

@router.get("/statistics/by-name/{name}")
def get_statistics_by_name(name: str):

    stat = collection.find_one({
        "name": {"$regex": f"^{name}$", "$options": "i"}
    })

    if not stat:
        raise HTTPException(status_code=404, detail="Statistics not found")

    return serialize(stat)



@router.get("/statistics/full/{name}")
def get_full_player_info(name: str):

    stat = collection.find_one({
        "name": {"$regex": f"^{name}$", "$options": "i"}
    })

    if not stat:
        raise HTTPException(status_code=404, detail="Statistics not found")

    stat_data = serialize(stat)
    player = None

    try:
        response = requests.get(
            f"{PLAYER_SERVICE_URL}/players/{stat_data['id']}",
            timeout=2
        )

        if response.status_code == 200:
            player = response.json()

    except requests.RequestException:
        pass

    if not player:
        try:
            response = requests.get(
                f"{PLAYER_SERVICE_URL}/players/search/{name}",
                timeout=2
            )

            if response.status_code == 200:
                players = response.json()

                for p in players:
                    if p["name"].lower() == name.lower():
                        player = p
                        break

        except requests.RequestException:
            pass

    return {
        "player": player, 
        "statistics": stat_data
    }


# поиск по id для сервиса игроков
@router.get("/statistics/{stat_id}")
def get_statistics_by_id(stat_id: str):
    stat = collection.find_one({"_id": ObjectId(stat_id)})

    if not stat:
        raise HTTPException(status_code=404, detail="Statistics not found")

    return serialize(stat)
