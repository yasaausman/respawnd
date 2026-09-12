# 🎮 Respawnd

**Your gaming life, tracked.** Respawnd is a video-game tracking and backlog app — log everything you play, drop, or finish, rate and review it, and never lose track of what to play next. Think Letterboxd, but for games.

Built with a Next.js 16 front end (React 19, an interactive 3D landing scene, and dynamic cover-art theming) on top of a FastAPI service that pulls live game data from the [RAWG](https://rawg.io) database.

> _Add a live demo link and screenshots here once deployed — e.g._ **Live:** `respawnd.vercel.app`

---

## ✨ Features

- **Log everything** — track each game with a status (playing, finished, dropped, backlog), a rating, a written review, and trophies.
- **Rate & review** — score your games and record your take.
- **Build your backlog** — keep a running list of what to play next.
- **Discover** — browse popular and upcoming titles, a curated **Top 250**, and games by genre, with full search.
- **Rich game pages** — trailers, screenshots, and "similar games" for every title.
- **Gaming news** — an in-app news feed (via GNews).
- **Living, reactive UI** — an animated 3D controller on the landing page (React Three Fiber), color backdrops extracted from each game's cover art (ColorThief), a custom cursor, and scroll-reveal animations.
- **Accounts** — authentication and per-user libraries powered by Supabase.

## 🧱 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **3D / visuals** | Three.js, React Three Fiber, `@react-three/drei`, ColorThief |
| **Auth** | Supabase (`@supabase/ssr`) |
| **Backend API** | FastAPI, SQLModel, Uvicorn, httpx |
| **Database** | PostgreSQL (via SQLModel / psycopg2) |
| **External data** | RAWG (games), GNews (news) |
| **Deploy** | Vercel |

## 🗺️ Architecture

```
┌──────────────────────────────┐        ┌───────────────────────────────┐
│  Next.js app (frontend)      │  HTTP  │  FastAPI service (api/)        │
│  • 3D landing + discover UI  │ ─────▶ │  • RAWG proxy (search,        │
│  • game pages, library, logs │        │    popular, top250, genres…)  │
│  • Supabase auth (SSR)       │ ◀───── │  • game logs CRUD (Postgres)  │
└──────────────────────────────┘        │  • news feed (GNews, cached)  │
              │                          └───────────────────────────────┘
              ▼                                        │
     Supabase (auth + user)                            ▼
                                              PostgreSQL (game_logs)
```

The Next.js app handles auth and the UI; the FastAPI service is the only thing that talks to RAWG/GNews and owns the game-log database.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+ (the API uses [`uv`](https://github.com/astral-sh/uv))
- A PostgreSQL database
- A free [RAWG API key](https://rawg.io/apidocs) and a [Supabase](https://supabase.com) project (a [GNews](https://gnews.io) key is optional, for the news feed)

### 1. Frontend

```bash
npm install
```

Create `.env` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev   # http://localhost:3000
```

### 2. Backend API

```bash
cd api
uv sync
```

Create `api/.env`:

```env
RAWG_API_KEY=your_rawg_key
DATABASE_URL=postgresql://user:password@host:5432/dbname
GNEWS_API_KEY=your_gnews_key   # optional (news feed)
```

```bash
uv run uvicorn main:app --reload   # http://localhost:8000
```

## 📡 API Reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `GET` | `/api/search` | Search games |
| `GET` | `/api/popular` | Popular games |
| `GET` | `/api/top250` | Curated Top 250 |
| `GET` | `/api/upcoming` | Upcoming releases |
| `GET` | `/api/genres` | List genres |
| `GET` | `/api/games/genre/{genre_slug}` | Games by genre |
| `GET` | `/api/game/{game_id}` | Game details |
| `GET` | `/api/game/{game_id}/trailers` | Trailers |
| `GET` | `/api/game/{game_id}/screenshots` | Screenshots |
| `GET` | `/api/game/{game_id}/similar` | Similar games |
| `GET` | `/api/news` | Gaming news (cached) |
| `POST` | `/api/logs` | Create a game log |
| `GET` | `/api/logs` | List a user's logs |
| `DELETE` | `/api/logs/{log_id}` | Delete a log |

## 📁 Project Structure

```
respawnd/
├── app/                     # Next.js App Router
│   ├── page.tsx             # 3D landing page
│   ├── discover/            # discover + top250
│   ├── games/[id]/          # game detail pages
│   ├── library/             # your logged games
│   ├── login/, auth/        # Supabase auth
│   ├── components/          # UI (GameGrid, LogGameForm, Navbar, ColorBackdrop…)
│   │   └── three/           # ControllerScene (React Three Fiber)
│   └── lib/                 # data + Supabase client
├── api/                     # FastAPI service
│   └── main.py              # RAWG proxy, news, game-log CRUD
└── public/models/           # 3D assets (controller.glb)
```

## 📌 Roadmap

- Public profiles and shareable lists
- Backlog prioritization and "what to play next" suggestions
- Playtime tracking and stats dashboards

## 👤 Author

**Yasaa Usman** — [GitHub](https://github.com/yasaausman) · [LinkedIn](https://www.linkedin.com/in/yasaa-usman)
