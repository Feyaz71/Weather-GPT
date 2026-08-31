from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Query, HTTPException
from app.schemas.intelligence import (
    WeatherRiskAnalysis,
    AgricultureAdvisory,
    TravelAdvisory,
    CropStage
)
from app.schemas.weather import ModelComparisonResponse
from app.providers.geo.resolver import geo_resolver
from app.providers.imd.provider import imd_provider
from app.providers.gfs.provider import gfs_provider
from app.providers.wrf.provider import wrf_provider
from app.intelligence.risk.rain import rain_risk_engine
from app.intelligence.risk.heat import heat_risk_engine
from app.intelligence.risk.thunderstorm import thunderstorm_risk_engine
from app.intelligence.risk.wind import wind_risk_engine
from app.intelligence.fusion.agreement import model_agreement_engine
from app.intelligence.advisory.agriculture import agriculture_advisory_engine
from app.intelligence.advisory.travel import travel_advisory_engine

router = APIRouter()


class RiskQueryRequest(BaseModel):
    location: str = "Delhi"
    risk_type: str = "RAIN"  # RAIN, HEAT, THUNDERSTORM, WIND


class AgricultureQueryRequest(BaseModel):
    location: str = "Ludhiana"
    crop_name: str = "wheat"
    crop_stage: CropStage = CropStage.VEGETATIVE


@router.post("/risk", response_model=WeatherRiskAnalysis)
async def evaluate_weather_risk(request: RiskQueryRequest):
    """Calculate deterministic meteorological risk score and breakdown."""
    loc = geo_resolver.resolve_location(request.location)
    obs = await imd_provider.get_current_weather(loc)
    fc = await imd_provider.get_forecast(loc, days=3)
    warns = await imd_provider.get_warnings(loc)

    risk_type = request.risk_type.upper()
    if risk_type == "HEAT":
        return heat_risk_engine.analyze(obs, fc, warns)
    elif risk_type == "THUNDERSTORM":
        return thunderstorm_risk_engine.analyze(obs, fc, warns)
    elif risk_type == "WIND":
        return wind_risk_engine.analyze(obs, fc, warns)
    return rain_risk_engine.analyze(obs, fc, warns)


@router.get("/agri-advisory", response_model=AgricultureAdvisory)
@router.get("/agriculture", response_model=AgricultureAdvisory)
async def get_agriculture_advisory_get(
    location: str = Query("Delhi", description="District or city name"),
    crop: str = Query("wheat", description="Crop name"),
    stage: str = Query("Vegetative Growth", description="Crop growth stage")
):
    """Generate real-time agromet advisory for irrigation, spraying, and crop protection."""
    loc = geo_resolver.resolve_location(location)
    obs = await imd_provider.get_current_weather(loc)
    fc = await imd_provider.get_forecast(loc, days=3)
    warns = await imd_provider.get_warnings(loc)

    crop_stage_enum = CropStage.VEGETATIVE
    s_lower = stage.lower()
    if "sow" in s_lower:
        crop_stage_enum = CropStage.SOWING
    elif "flower" in s_lower:
        crop_stage_enum = CropStage.FLOWERING
    elif "grain" in s_lower or "fill" in s_lower:
        crop_stage_enum = CropStage.GRAIN_FILLING
    elif "harvest" in s_lower or "matur" in s_lower:
        crop_stage_enum = CropStage.MATURITY

    return agriculture_advisory_engine.generate_advisory(
        location=loc,
        crop_name=crop,
        crop_stage=crop_stage_enum,
        obs=obs,
        forecast=fc,
        warnings=warns
    )


@router.post("/agriculture", response_model=AgricultureAdvisory)
async def generate_agriculture_advisory(request: AgricultureQueryRequest):
    """Generate agromet decision-support advisory for irrigation, spraying, and crop protection."""
    loc = geo_resolver.resolve_location(request.location)
    obs = await imd_provider.get_current_weather(loc)
    fc = await imd_provider.get_forecast(loc, days=3)
    warns = await imd_provider.get_warnings(loc)

    return agriculture_advisory_engine.generate_advisory(
        location=loc,
        crop_name=request.crop_name,
        crop_stage=request.crop_stage,
        obs=obs,
        forecast=fc,
        warnings=warns
    )


@router.get("/travel", response_model=TravelAdvisory)
async def evaluate_travel_risk(
    location: str = Query("Delhi", description="City or district name")
):
    """Evaluate commuter, highway, and visibility safety ratings."""
    loc = geo_resolver.resolve_location(location)
    obs = await imd_provider.get_current_weather(loc)
    fc = await imd_provider.get_forecast(loc, days=1)
    warns = await imd_provider.get_warnings(loc)

    return travel_advisory_engine.evaluate_travel_risk(loc, obs, fc, warns)


@router.get("/compare-models", response_model=ModelComparisonResponse)
@router.get("/models/compare", response_model=ModelComparisonResponse)
async def compare_nwp_models(
    location: str = Query("Delhi", description="City or district name")
):
    """Compare multi-model predictions across IMD, NOAA GFS, and WRF models."""
    loc = geo_resolver.resolve_location(location)
    fc = await imd_provider.get_forecast(loc, days=1)
    gfs_data = await gfs_provider.get_nwp_forecast(loc)
    wrf_data = await wrf_provider.get_nwp_forecast(loc)

    next_day = fc.daily_forecasts[0] if fc.daily_forecasts else None
    imd_dict = {
        "temp_c": next_day.temp_max_c if next_day else 33.0,
        "rain_mm": next_day.precipitation_amount_mm if next_day else 35.0,
        "rain_prob_pct": next_day.precipitation_prob_pct if next_day else 80.0
    }

    return model_agreement_engine.compare_models(loc, imd_dict, gfs_data, wrf_data)
