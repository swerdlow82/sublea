## temp import models during dev (auth)
# later to be replaced with migrations
from auth import models
from database import Base, engine
from fastapi import FastAPI

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sublea Backend API",)

@app.get("/")
def root():
    return {"status": "ok", "message": "Sublea Backend API is running."}