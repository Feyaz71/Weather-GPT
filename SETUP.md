# WeatherGPT Setup & Deployment Guide

## System Requirements
- OS: Linux / macOS / Windows
- Python 3.12 or higher
- Node.js 20.0 or higher & npm
- Docker & Docker Compose (Optional for containerized run)

---

## Option 1: Quick Local Run (Zero Configuration)

The backend and frontend are pre-configured to run out-of-the-box using SQLite and an in-memory cache fallback. No external API keys are required for testing.

### 1. Start the Backend
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
API server will be running at `http://localhost:8000`.

### 2. Start the Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## Option 2: Full Dockerized Stack (PostgreSQL/PostGIS + Redis)

To run the full stack with PostGIS spatial database and Redis cache:

```powershell
docker compose up --build
```

Services will start:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- PostgreSQL + PostGIS: `localhost:5432`
- Redis: `localhost:6379`

---

## Option 3: Production Configuration with Live IMD & LLM Keys

1. Copy `.env.example` to `.env`:
   ```powershell
   copy .env.example .env
   ```
2. Configure your keys:
   - `DEMO_MODE=False`
   - `IMD_API_KEY=your_imd_api_token`
   - `LLM_PROVIDER=gemini` (or `openai`)
   - `GEMINI_API_KEY=your_gemini_key`
3. Restart the backend.
