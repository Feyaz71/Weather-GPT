from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from app.schemas.weather import (
    WeatherObservation,
    ForecastResponse,
    WeatherWarning,
    LocationInfo
)
from app.providers.geo.resolver import geo_resolver
from app.providers.imd.provider import imd_provider
from app.core.redis import cache_service
from app.core.config import settings

router = APIRouter()


@router.get("/current", response_model=WeatherObservation)
async def get_current_weather(
    location: str = Query("Delhi", description="City or district name in India"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    """Retrieve authoritative real-time weather observation from IMD stations."""
    cache_key = f"weather:current:{location.lower()}:{lat}:{lon}"
    cached = await cache_service.get_json(cache_key)
    if cached:
        return WeatherObservation(**cached)

    if lat is not None and lon is not None:
        loc_info = geo_resolver.reverse_geocode(lat, lon)
    else:
        loc_info = geo_resolver.resolve_location(location)

    obs = await imd_provider.get_current_weather(loc_info)
    await cache_service.set_json(cache_key, obs.model_dump(mode="json"), ex=settings.REDIS_CACHE_TTL_CURRENT)
    return obs


@router.get("/forecast", response_model=ForecastResponse)
async def get_forecast(
    location: str = Query("Delhi", description="City or district name"),
    days: int = Query(7, ge=1, le=14, description="Forecast duration in days")
):
    """Retrieve 7-day official city and NWP multi-model forecast."""
    cache_key = f"weather:forecast:{location.lower()}:{days}"
    cached = await cache_service.get_json(cache_key)
    if cached:
        return ForecastResponse(**cached)

    loc_info = geo_resolver.resolve_location(location)
    fc = await imd_provider.get_forecast(loc_info, days=days)
    await cache_service.set_json(cache_key, fc.model_dump(mode="json"), ex=settings.REDIS_CACHE_TTL_FORECAST)
    return fc


@router.get("/warnings", response_model=List[WeatherWarning])
async def get_warnings(
    location: str = Query("Delhi", description="City or district name")
):
    """Retrieve active official weather warnings and nowcasts."""
    cache_key = f"weather:warnings:{location.lower()}"
    cached = await cache_service.get_json(cache_key)
    if cached:
        return [WeatherWarning(**w) for w in cached]

    loc_info = geo_resolver.resolve_location(location)
    warns = await imd_provider.get_warnings(loc_info)
    await cache_service.set_json(cache_key, [w.model_dump(mode="json") for w in warns], ex=settings.REDIS_CACHE_TTL_WARNINGS)
    return warns


@router.get("/rainfall")
async def get_rainfall_summary(
    location: str = Query("Delhi", description="City or district name")
):
    """Retrieve AWS/ARG cumulative rainfall statistics and departures."""
    loc_info = geo_resolver.resolve_location(location)
    return await imd_provider.get_rainfall_data(loc_info)


@router.get("/stations", response_model=List[LocationInfo])
async def get_weather_stations():
    """Retrieve all catalogued IMD synoptic / AWS stations."""
    return geo_resolver.get_all_stations()
