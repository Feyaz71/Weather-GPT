from fastapi import APIRouter, Query
from app.schemas.intelligence import ClimateTrendAnalysis
from app.providers.geo.resolver import geo_resolver
from app.intelligence.climate.trend import climate_engine

router = APIRouter()


@router.get("/analyze", response_model=ClimateTrendAnalysis)
async def analyze_climate_trends(
    location: str = Query("Delhi", description="City or district name"),
    years: int = Query(10, ge=5, le=30, description="Historical analysis window in years")
):
    """Retrieve 10-year climate trends, decadal warming slopes, and monthly rainfall anomaly stats."""
    loc = geo_resolver.resolve_location(location)
    return await climate_engine.analyze_trends(loc, years=years)
