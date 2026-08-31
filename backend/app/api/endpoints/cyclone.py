from fastapi import APIRouter, Query
from typing import List
from app.schemas.weather import CycloneInfo
from app.providers.geo.resolver import geo_resolver
from app.intelligence.cyclone.tracker import cyclone_tracker

router = APIRouter()


@router.get("/active", response_model=List[CycloneInfo])
async def get_active_cyclones(
    location: str = Query(default="Delhi", description="City or coastal district")
):
    """Retrieve active tropical cyclone trajectories and impact distance."""
    resolved_loc = geo_resolver.resolve_location(location)
    return cyclone_tracker.get_cyclone_intelligence(resolved_loc)
