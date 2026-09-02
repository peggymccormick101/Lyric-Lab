# LyricLab

Describe a song — topic, genre, mood, style, perspective — and get original,
ready-to-sing lyrics with a title, powered by Claude.

## How it works

1. Fill out the form: topic/story, genre, mood, style, perspective, optional
   keywords, and length.
2. LyricLab generates a full set of original lyrics with section labels
   (`[Verse 1]`, `[Chorus]`, etc.) and a title.
3. Past songs are saved so you can revisit or delete them later.

## Stack

- **Backend:** FastAPI + SQLAlchemy (SQLite) + the Claude API (`anthropic`
  Python SDK)
- **Frontend:** React (Vite) + React Router, installable as a PWA

## Setup

### Backend

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env   # then edit .env and set ANTHROPIC_API_KEY
.venv/bin/uvicorn app.main:app --reload --port 8000
```

The API runs at `http://localhost:8000` (docs at `/docs`). It creates
`backend/lyriclab.db` (SQLite) on first run.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the
backend on port 8000 (see `vite.config.js`).

## API

- `POST /api/songs` — generate and save lyrics for a topic/genre/mood/etc.
  combo
- `GET /api/songs` — list saved songs
- `GET /api/songs/{id}` — get a song's full lyrics
- `DELETE /api/songs/{id}` — delete a saved song

## Deployment (Render)

The app deploys as a single service: a Docker image builds the React
frontend, then FastAPI serves both the API (`/api/*`) and the built
frontend (everything else) from one process.

1. Push this repo to GitHub (already done if you're reading this from there).
2. On [render.com](https://render.com), sign up / log in, then **New >
   Blueprint**, and point it at this repo. Render reads `render.yaml`
   automatically and creates the service.
3. When prompted, enter your `ANTHROPIC_API_KEY` (and `ANTHROPIC_WORKSPACE_ID`
   if your account requires one — see `backend/.env.example`) as the
   service's environment variables. These are entered directly in Render's
   dashboard, never committed to the repo.
4. Deploy. Render builds the Docker image (`Dockerfile` at the repo root)
   and gives you a public `https://lyriclab-xxxx.onrender.com` URL.
5. To install it on your phone's home screen: open the URL in your mobile
   browser, then use "Add to Home Screen" (Safari) or "Install app" (Chrome).

**Note on data:** the free tier's disk is ephemeral — the SQLite database
(saved songs) resets on every redeploy. That's fine for personal/testing
use; if persistence across deploys matters later, that would mean adding a
Render persistent disk or switching to a hosted database.

## Swapping in the hero image

`frontend/src/components/HeroPanel.jsx` currently renders a text-and-icon
placeholder in place of a hero photo. To use a real image instead, drop it
in `frontend/public/` (e.g. `hero.png`) and replace the placeholder content
in `HeroPanel.jsx` with an `<img src="/hero.png" alt="LyricLab" />`.
