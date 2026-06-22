import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any, Optional

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select

# Load variables from a local .env file (e.g. RAWG_API_KEY, DATABASE_URL).
load_dotenv()

# Read required env vars once at startup; fail fast if either is missing.
RAWG_API_KEY = os.getenv("RAWG_API_KEY")
if not RAWG_API_KEY:
    raise RuntimeError("RAWG_API_KEY environment variable is not set")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")

RAWG_BASE_URL = "https://api.rawg.io/api"

# ── Database ──────────────────────────────────────────────────────────────────

engine = create_engine(DATABASE_URL)


class GameLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rawg_id: int
    title: str
    cover_url: Optional[str] = None
    status: str
    rating: Optional[int] = None
    review: Optional[str] = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


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


# ── App ───────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(title="Respawnd API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── RAWG helpers ──────────────────────────────────────────────────────────────

async def fetch_rawg(path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    """Call a RAWG endpoint and return the parsed JSON body."""
    query = {"key": RAWG_API_KEY, **(params or {})}

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{RAWG_BASE_URL}{path}", params=query)

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="Game not found")

    if not response.is_success:
        raise HTTPException(
            status_code=response.status_code,
            detail="RAWG API request failed",
        )

    return response.json()


# ── RAWG endpoints ────────────────────────────────────────────────────────────

@app.get("/api/search")
async def search_games(q: str = Query(..., min_length=1, description="Search query")):
    """
    Search RAWG for games matching `q` and return the top 12 results
    with id, name, background_image, released, and genres.
    """
    data = await fetch_rawg(
        "/games",
        params={"search": q, "page_size": 12},
    )

    games = [
        {
            "id": game["id"],
            "name": game["name"],
            "background_image": game.get("background_image"),
            "released": game.get("released"),
            "genres": game.get("genres", []),
        }
        for game in data.get("results", [])
    ]

    return {"results": games}


@app.get("/api/popular")
async def popular_games():
    """
    Return the top 12 games from RAWG ordered by rating descending.
    Used as the default home-page grid before the user types a search query.
    """
    data = await fetch_rawg(
        "/games",
        params={"ordering": "-rating", "page_size": 12},
    )

    games = [
        {
            "id": game["id"],
            "name": game["name"],
            "background_image": game.get("background_image"),
            "released": game.get("released"),
            "genres": game.get("genres", []),
        }
        for game in data.get("results", [])
    ]

    return {"results": games}


@app.get("/api/game/{game_id}")
async def get_game(game_id: int):
    """Return full RAWG details for a single game by id."""
    return await fetch_rawg(f"/games/{game_id}")


# ── Log endpoints ─────────────────────────────────────────────────────────────

@app.post("/api/logs", response_model=GameLog, status_code=201)
def create_log(payload: GameLogCreate, session: Session = Depends(get_session)):
    """Create a new game log entry."""
    log = GameLog(**payload.model_dump())
    session.add(log)
    session.commit()
    session.refresh(log)
    return log


@app.get("/api/logs", response_model=list[GameLog])
def list_logs(
    status: Optional[str] = Query(default=None, description="Filter by status"),
    session: Session = Depends(get_session),
):
    """Return all game logs, optionally filtered by status."""
    query = select(GameLog)
    if status:
        query = query.where(GameLog.status == status)
    return session.exec(query.order_by(GameLog.created_at.desc())).all()


@app.delete("/api/logs/{log_id}", status_code=204)
def delete_log(log_id: int, session: Session = Depends(get_session)):
    """Delete a game log entry by id."""
    log = session.get(GameLog, log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    session.delete(log)
    session.commit()
