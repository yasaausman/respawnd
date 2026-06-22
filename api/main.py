import os
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# Load variables from a local .env file (e.g. RAWG_API_KEY) into the process environment.
load_dotenv()

# Read the RAWG API key once at startup; fail fast if it is missing.
RAWG_API_KEY = os.getenv("RAWG_API_KEY")
if not RAWG_API_KEY:
    raise RuntimeError("RAWG_API_KEY environment variable is not set")

# Base URL for all RAWG HTTP requests.
RAWG_BASE_URL = "https://api.rawg.io/api"

# Create the FastAPI application instance.
app = FastAPI(title="Respawnd API")

# Allow the Next.js dev server on localhost:3000 to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

    # Map RAWG results down to the fields the frontend needs.
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
