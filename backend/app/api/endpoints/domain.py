from fastapi import APIRouter, Query
from app.schemas.weather import LocationInfo
from app.providers.geo.resolver import geo_resolver
from app.providers.router.source_router import source_router
from app.intelligence.domains.decision_framework import domain_framework, DomainAdvisoryResponse

router = APIRouter()


@router.get("/aviation", response_model=DomainAdvisoryResponse)
async def get_aviation_advisory(location: str = Query(default="Delhi")):
    """Aerodrome weather, visibility, and flight operations intelligence."""
    loc = geo_resolver.resolve_location(location)
    obs = await source_router.get_best_current_observation(loc)
    return domain_framework.evaluate_aviation_weather(loc, obs)


@router.get("/marine", response_model=DomainAdvisoryResponse)
async def get_marine_advisory(location: str = Query(default="Mumbai")):
    """Coastal sea conditions, significant wave height, and squall warnings."""
    loc = geo_resolver.resolve_location(location)
    obs = await source_router.get_best_current_observation(loc)
    return domain_framework.evaluate_marine_weather(loc, obs)


@router.get("/disaster", response_model=DomainAdvisoryResponse)
async def get_disaster_readiness(location: str = Query(default="Delhi")):
    """NDMA & district disaster emergency response readiness."""
    loc = geo_resolver.resolve_location(location)
    warns = await source_router.get_official_warnings(loc)
    return domain_framework.evaluate_disaster_readiness(loc, warns)
