from fastapi import APIRouter, Query
from typing import List
from app.schemas.weather import NearbyWeatherEvent
from app.providers.geo.resolver import geo_resolver
from app.intelligence.nearby.event_engine import nearby_event_engine

router = APIRouter()


@router.get("/events", response_model=List[NearbyWeatherEvent])
async def get_nearby_events(
    location: str = Query(default="Delhi", description="City or district"),
    radius_km: float = Query(default=150.0, description="Detection radius in km")
):
    """Retrieve severe storm cells and convective squalls within detection radius."""
    resolved_loc = geo_resolver.resolve_location(location)
    return nearby_event_engine.evaluate_nearby_events(resolved_loc, radius_km=radius_km)
