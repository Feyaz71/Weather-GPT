# WeatherGPT Architecture Reference

## 1. Architectural Philosophy
WeatherGPT is built as a **Modular Monolith** designed for high reliability, clear provider decoupling, zero hallucinations, and low latency. It strictly adheres to the principle that **Meteorological models, official IMD warnings, and synoptic observations are the sole source of truth**.

```
+-----------------------------------------------------------------------------------+
|                            Presentation & Client Tier                             |
|  - React 18 + TypeScript + Vite                                                   |
|  - Tailwind CSS + Lucide Icons                                                    |
|  - Leaflet GIS Interactive Map with GeoJSON Layer Stack                           |
|  - Web Speech API STT / TTS & Multilingual Engine (English & हिन्दी)              |
+-----------------------------------------+-----------------------------------------+
                                          | (REST / WebSocket)
                                          v
+-----------------------------------------------------------------------------------+
|                             FastAPI Gateway & Middleware                          |
|  - Request ID Tracing, Latency Tracking, Structured JSON Logging                  |
|  - CORS & Rate Limiting                                                           |
|  - Redis Async Caching (with Transparent In-Memory Fallback)                      |
|  - PostGIS / SQLite Session & Spatial Filtering                                  |
+--------------------+------------------------------------+-------------------------+
                     |                                    |
                     v                                    v
+------------------------------------+   +------------------------------------------+
|    AI Query Orchestrator Layer     |   |          REST Router Endpoints           |
| - Intent Parser (English & Hindi)  |   | - /api/v1/weather/*                      |
| - Context Memory & Slot Extraction |   | - /api/v1/intelligence/*                 |
| - Tool Selection & Parameter Val.  |   | - /api/v1/climate/*                      |
| - LLM Abstraction (Gemini/GPT/     |   | - /api/v1/alerts/*                       |
|   Heuristic Fallback Engine)       |   | - /api/v1/gis/*                          |
+--------------------+---------------+   +--------------------+---------------------+
                     |                                        |
                     +-------------------+--------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        Meteorological Data Provider Layer                         |
|  - IMDProvider: Official API (api.imd.gov.in) & Synoptic/AWS Observation Network  |
|  - GFSProvider: NOAA Global Forecast System 0.25° NWP Grid API                    |
|  - WRFProvider: Regional 3km Mesoscale Convective Simulation Adapter              |
|  - HistoricalProvider: 10-Year Climatological Baselines & ERA5 Normalization      |
|  - GeoResolver: Indian Districts, Cities, and Coordinate Matcher                  |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         Normalization & Validation Layer                          |
|  - Strict Pydantic v2 Models (Nullable missing values; no invented numbers)       |
|  - Metric Unit Standardization (°C, mm, km/h, hPa, %)                             |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                     Weather Intelligence & Decision-Support Tier                  |
|  - RainRiskEngine: IMD Rainfall Classification & Antecedent Soil Runoff Index     |
|  - HeatRiskEngine: Rothfusz Heat Index Regression & IMD Heatwave Rules            |
|  - ThunderstormRiskEngine: Convective Instability & Nowcast Alert Synthesis       |
|  - WindRiskEngine: Beaufort Scale & IMD Squall Gale Criteria                      |
|  - ModelAgreementEngine: IMD vs GFS vs WRF Variance & Uncertainty Metric         |
|  - AgricultureAdvisoryEngine: Crop-specific (Wheat, Rice, Cotton, etc.) AAS Rules |
|  - TravelAdvisoryEngine: Road Waterlogging, Commuter Visibility & Squall Safety   |
|  - ClimateEngine: Decadal Linear Regression Slope & Monthly Rainfall Anomalies    |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                    Explainability & Natural Language Generator                    |
|  - Grounded Synthesis with "Why? Factors" and Source Attribution Badges           |
+-----------------------------------------------------------------------------------+
```

---

## 2. Key Modules & Directory Structure

- `backend/app/core/`: Application settings (`config.py`), structured logging (`logging.py`), and Redis client with in-memory fallback (`redis.py`).
- `backend/app/db/`: SQLAlchemy declarative models (`models.py`) and database session maker (`session.py`).
- `backend/app/schemas/`: Pydantic domain models for weather, intelligence, chat, alerts, and GIS GeoJSON.
- `backend/app/providers/`: Provider abstraction base classes and implementations for IMD, GFS, WRF, and Historical data.
- `backend/app/intelligence/`: Specialized deterministic risk and advisory engines.
- `backend/app/ai/`: Multi-turn conversational orchestrator, intent parser, and LLM abstraction.
- `backend/app/api/v1/`: FastAPI REST endpoints and WebSocket stream.
- `frontend/src/components/`: Modular React components for Chat, Dashboard, GIS Map, Agriculture, Climate, and Alerts.
- `frontend/src/context/`: Global state management for Weather and Voice.
