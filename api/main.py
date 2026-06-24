import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any, Optional

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select

load_dotenv()

RAWG_API_KEY = os.getenv("RAWG_API_KEY")
if not RAWG_API_KEY:
    raise RuntimeError("RAWG_API_KEY environment variable is not set")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")

RAWG_BASE_URL = "https://api.rawg.io/api"

engine = create_engine(DATABASE_URL)


class GameLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rawg_id: int
    title: str
    cover_url: Optional[str] = None
    status: str
    rating: Optional[int] = None
    review: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GameLogCreate(SQLModel):
    rawg_id: int
    title: str
    cover_url: Optional[str] = None
    status: str
    rating: Optional[int] = None
    review: Optional[str] = None


def get_session():
    with Session(engine) as session:
        yield session


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(title="Respawnd API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://respawnd.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def fetch_rawg(path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    query = {"key": RAWG_API_KEY, **(params or {})}
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{RAWG_BASE_URL}{path}", params=query)
    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="Game not found")
    if not response.is_success:
        raise HTTPException(status_code=response.status_code, detail="RAWG API request failed")
    return response.json()


@app.get("/api/search")
async def search_games(q: str = Query(..., min_length=1)):
    data = await fetch_rawg("/games", params={"search": q, "page_size": 12})
    games = [{"id": g["id"], "name": g["name"], "background_image": g.get("background_image"), "released": g.get("released"), "genres": g.get("genres", [])} for g in data.get("results", [])]
    return {"results": games}


@app.get("/api/popular")
async def popular_games():
    data = await fetch_rawg("/games", params={"ordering": "-rating", "page_size": 12})
    games = [{"id": g["id"], "name": g["name"], "background_image": g.get("background_image"), "released": g.get("released"), "genres": g.get("genres", [])} for g in data.get("results", [])]
    return {"results": games}


@app.get("/api/game/{game_id}/trailers")
async def get_trailers(game_id: int):
    data = await fetch_rawg(f"/games/{game_id}/movies")
    trailers = [{"id": t["id"], "name": t["name"], "preview": t.get("preview"), "youtube_url": f"https://www.youtube.com/watch?v={t['data']['480'].split('/')[-1].split('?')[0]}" if t.get("data") else None} for t in data.get("results", [])]
    return {"results": trailers}


@app.get("/api/game/{game_id}/screenshots")
async def get_screenshots(game_id: int):
    data = await fetch_rawg(f"/games/{game_id}/screenshots")
    screenshots = [{"id": s["id"], "image": s["image"]} for s in data.get("results", [])]
    return {"results": screenshots}


@app.get("/api/game/{game_id}/similar")
async def similar_games(game_id: int):
    game = await fetch_rawg(f"/games/{game_id}")
    genres = ",".join([str(g["id"]) for g in game.get("genres", [])])
    if not genres:
        return {"results": []}
    data = await fetch_rawg("/games", params={"genres": genres, "ordering": "-rating", "page_size": 10, "metacritic": "1,100"})
    results = [{"id": g["id"], "name": g["name"], "background_image": g.get("background_image"), "rating": g.get("rating"), "genres": g.get("genres", [])} for g in data.get("results", []) if g["id"] != game_id and g.get("background_image")]
    return {"results": results[:6]}


@app.get("/api/game/{game_id}")
async def get_game(game_id: int):
    return await fetch_rawg(f"/games/{game_id}")


@app.get("/api/top250")
async def top_250_games():
    results = []
    for page in range(1, 8):
        data = await fetch_rawg("/games", params={"ordering": "-rating", "page_size": 40, "page": page, "metacritic": "1,100"})
        for game in data.get("results", []):
            results.append({"id": game["id"], "name": game["name"], "background_image": game.get("background_image"), "released": game.get("released"), "genres": game.get("genres", []), "rating": game.get("rating"), "metacritic": game.get("metacritic")})
        if len(results) >= 250:
            break
    return {"results": results[:250]}


@app.get("/api/genres")
async def get_genres():
    data = await fetch_rawg("/genres", params={"page_size": 20})
    genres = [{"id": g["id"], "name": g["name"], "slug": g["slug"]} for g in data.get("results", [])]
    return {"results": genres}


@app.get("/api/games/genre/{genre_slug}")
async def games_by_genre(genre_slug: str):
    data = await fetch_rawg("/games", params={"genres": genre_slug, "ordering": "-rating", "page_size": 20, "metacritic": "1,100"})
    games = [{"id": g["id"], "name": g["name"], "background_image": g.get("background_image"), "released": g.get("released"), "genres": g.get("genres", []), "rating": g.get("rating")} for g in data.get("results", [])]
    return {"results": games}


@app.get("/api/upcoming")
async def upcoming_games():
    from datetime import date
    today = date.today().isoformat()
    future = date(date.today().year + 1, 12, 31).isoformat()
    data = await fetch_rawg("/games", params={"dates": f"{today},{future}", "ordering": "-added", "page_size": 20})
    games = [{"id": g["id"], "name": g["name"], "background_image": g.get("background_image"), "released": g.get("released"), "genres": g.get("genres", [])} for g in data.get("results", [])]
    return {"results": games}


@app.post("/api/logs", response_model=GameLog, status_code=201)
def create_log(payload: GameLogCreate, session: Session = Depends(get_session)):
    log = GameLog(**payload.model_dump())
    session.add(log)
    session.commit()
    session.refresh(log)
    return log


@app.get("/api/logs", response_model=list[GameLog])
def list_logs(status: Optional[str] = Query(default=None), session: Session = Depends(get_session)):
    query = select(GameLog)
    if status:
        query = query.where(GameLog.status == status)
    return session.exec(query.order_by(GameLog.created_at.desc())).all()


@app.delete("/api/logs/{log_id}", status_code=204)
def delete_log(log_id: int, session: Session = Depends(get_session)):
    log = session.get(GameLog, log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    session.delete(log)
    session.commit()