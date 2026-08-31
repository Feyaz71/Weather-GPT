# WeatherGPT: AI-Powered Conversational Weather Intelligence & Decision-Support Platform

[![Smart India Hackathon](https://img.shields.io/badge/SIH-2024-orange.svg)](https://sih.gov.in)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg)](https://tailwindcss.com)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.4+-336791.svg)](https://postgis.net)
[![Redis](https://img.shields.io/badge/Redis-7.0+-DC382D.svg)](https://redis.io)

> **Official Problem Statement Submission**: WeatherGPT is an authoritative conversational meteorological intelligence platform engineered for India. It integrates India Meteorological Department (IMD) synoptic/AWS observation networks, NOAA GFS, and regional WRF mesoscale NWP models with deterministic risk engines and an explainable AI layer.

---

## 🌟 Key Capabilities

1. **Authoritative Meteorological Source of Truth**:
   - Primary data grounded on official IMD API specifications (`api.imd.gov.in`), AWS/ARG stations, nowcasts, and district warnings.
   - The LLM is strictly restricted from inventing weather numbers or fabricated warnings.

2. **Deterministic Weather Intelligence & Risk Engines**:
   - **Rain Risk**: IMD Rainfall Classification, precipitation probabilities, antecedent soil moisture.
   - **Heat Risk**: NOAA / IMD Rothfusz Heat Index regression and official Plains/Coastal/Hills heatwave criteria.
   - **Thunderstorm & Gale Risk**: Convective instability (CAPE), nowcast alerts, and Beaufort scale wind impact.
   - **Agromet Advisory**: Crop-specific decision support (Wheat, Rice, Cotton, Mustard, Tomato) for irrigation and spraying.
   - **Travel Risk**: Visibility, road waterlogging, and highway squall assessments.

3. **Multi-Model NWP Comparison & Uncertainty**:
   - Compares IMD vs NOAA GFS vs WRF-ARW predictions.
   - Calculates deterministic Model Agreement Index (0.0 to 1.0) and synthesizes forecast uncertainty transparently.

4. **Transparent Explainability ("Why?")**:
   - Every risk recommendation and advisory displays the exact observed parameters, thresholds, and data freshness timestamps.

5. **Interactive Leaflet GIS Weather Map**:
   - Color-coded IMD district warning polygons (Red, Orange, Yellow, Green).
   - Synoptic and AWS station pin markers with interactive inspection cards.
   - Simulated radar and wind vector layers.

6. **Multilingual & Voice-Enabled**:
   - Fluent conversational interaction in English and **हिन्दी (Hindi)**.
   - Web Speech API Speech-to-Text (STT) and Text-to-Speech (TTS) integration with Bhashini-compatible architecture.

7. **Historical & Climate Trend Analytics**:
   - 10-year decadal temperature warming slopes and monthly monsoon rainfall departure charts.

8. **Zero-Setup Hackathon Demo Mode (`DEMO_MODE=true`)**:
   - Ships with realistic pre-curated Indian meteorological data across major hubs.
   - Guaranteed 100% stable execution without mandatory external API keys.

---

## 🏗️ Architecture

```
User Query (English / हिन्दी / Voice)
    ↓
AI Query Orchestrator & Multi-Turn Slot Extractor
    ↓
Tool Calling Execution Layer
    ├── IMDProvider (Official API & Synoptic/AWS Network)
    ├── GFSProvider (NOAA Global Forecast System NWP)
    ├── WRFProvider (Regional Mesoscale Adapter)
    └── HistoricalProvider (10-Year Climate Baselines)
    ↓
Pydantic v2 Normalization & Null Validation
    ↓
Weather Intelligence & Decision-Support Engines
    ├── RainRiskEngine | HeatRiskEngine | ThunderstormRiskEngine
    ├── ModelAgreementEngine (IMD vs GFS vs WRF Consensus)
    └── AgricultureAdvisoryEngine (Irrigation & Spraying Rules)
    ↓
Explainability & Grounded Response Generator
    ↓
Text / Voice / Leaflet GIS Map Dashboard
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Python 3.12+
- Node.js 20+ & npm

### 2. Backend Setup
```powershell
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 3. Frontend Setup
```powershell
# Navigate to frontend (in a separate terminal)
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 🐳 Docker Deployment

To launch the full production stack (FastAPI Backend + React Frontend + PostgreSQL with PostGIS + Redis):

```powershell
docker compose up --build
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## 🧪 Automated Testing

Run the comprehensive pytest suite:
```powershell
python -m pytest -v
```
All 18 tests cover:
- Pydantic domain normalization and null safety
- Deterministic risk engine thresholds
- Multilingual intent extraction (English & Hindi)
- Multi-turn conversational memory
- REST endpoints and GIS GeoJSON feeds

---

## 📄 License & Attribution
Developed for Smart India Hackathon (SIH). Ground truth meteorological schemas conform to India Meteorological Department (IMD) specifications.
