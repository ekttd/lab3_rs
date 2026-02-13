from fastapi import FastAPI
from .routes import router
from .config import SERVICE_PORT
import uvicorn


app = FastAPI(title="Player Service")

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=SERVICE_PORT, reload=True)
