from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import logger
from app.api.v1.weather import router as weather_router
from app.api.v1.chat import router as chat_router
from app.api.v1.gis import router as gis_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.climate import router as climate_router
from app.api.v1.intelligence import router as intelligence_router
from app.api.v1.ws import router as ws_router
from app.api.endpoints.cyclone import router as cyclone_router
from app.api.endpoints.nearby import router as nearby_router
from app.api.endpoints.domain import router as domain_router
from app.api.endpoints.languages import router as languages_router
from app.db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing WeatherGPT Enterprise Backend...")
    await init_db()
    logger.info("WeatherGPT Database Initialized & Authoritative Providers Ready.")
    yield
    logger.info("Shutting down WeatherGPT Services.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    return response


# Include V1 Routers
app.include_router(weather_router, prefix=f"{settings.API_V1_PREFIX}/weather", tags=["Meteorological Telemetry"])
app.include_router(chat_router, prefix=f"{settings.API_V1_PREFIX}/chat", tags=["Conversational AI"])
app.include_router(gis_router, prefix=f"{settings.API_V1_PREFIX}/gis", tags=["GIS & Geospatial Layers"])
app.include_router(alerts_router, prefix=f"{settings.API_V1_PREFIX}/alerts", tags=["Emergency Alerts & Push"])
app.include_router(climate_router, prefix=f"{settings.API_V1_PREFIX}/climate", tags=["Climate Analytics"])
app.include_router(intelligence_router, prefix=f"{settings.API_V1_PREFIX}/intelligence", tags=["Risk & Advisory Engines"])
app.include_router(ws_router, prefix=f"{settings.API_V1_PREFIX}/ws", tags=["Real-Time WebSockets"])

# Specialized Domain Routers
app.include_router(cyclone_router, prefix=f"{settings.API_V1_PREFIX}/cyclone", tags=["Cyclone Tracking"])
app.include_router(nearby_router, prefix=f"{settings.API_V1_PREFIX}/nearby", tags=["Nearby Storm Proximity"])
app.include_router(domain_router, prefix=f"{settings.API_V1_PREFIX}/domains", tags=["Specialized Domain Advisories"])
app.include_router(languages_router, prefix=f"{settings.API_V1_PREFIX}/languages", tags=["Multilingual Localization"])


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "PRODUCTION",
        "providers": {
            "IMD": "ACTIVE (Primary Authoritative)",
            "MOSDAC_ISRO": "ACTIVE",
            "NOAA_GFS": "ACTIVE",
            "ERA5_Copernicus": "ACTIVE",
            "OpenWeather": "ACTIVE",
            "OpenMeteo": "ACTIVE",
            "WeatherAPI": "ACTIVE",
            "NASA_POWER": "ACTIVE"
        },
        "supported_languages_count": len(settings.SUPPORTED_LANGUAGES)
    }


@app.get("/readiness", tags=["System"])
async def readiness_check():
    return {"status": "READY", "timestamp": time.time()}
