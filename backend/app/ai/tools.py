import time
from typing import Dict, Any, List, Optional
from app.core.logging import logger
from app.schemas.weather import (
    LocationInfo,
    WeatherObservation,
    ForecastResponse,
    WeatherWarning,
    ModelComparisonResponse,
    CycloneInfo,
    NearbyWeatherEvent
)
from app.schemas.intelligence import (
    WeatherRiskAnalysis,
    AgricultureAdvisory,
    ClimateTrendAnalysis,
    CropStage
)
from app.providers.geo.resolver import geo_resolver
from app.providers.router.source_router import source_router
from app.providers.gfs.provider import gfs_provider
from app.providers.wrf.provider import wrf_provider
from app.intelligence.risk.rain import rain_risk_engine
from app.intelligence.risk.heat import heat_risk_engine
from app.intelligence.risk.thunderstorm import thunderstorm_risk_engine
from app.intelligence.risk.wind import wind_risk_engine
from app.intelligence.fusion.agreement import model_agreement_engine
from app.intelligence.advisory.agriculture import agriculture_advisory_engine
from app.intelligence.cyclone.tracker import cyclone_tracker
from app.intelligence.nearby.event_engine import nearby_event_engine
from app.intelligence.domains.decision_framework import domain_framework


WEATHER_TOOLS_SCHEMA = [
    {
        "name": "get_current_weather",
        "description": "Fetch authoritative current weather observations from IMD Synoptic/AWS networks and global stations.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City, district or place name in India"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_forecast",
        "description": "Fetch official multi-day weather forecast (up to 7 days) and hourly predictions.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City or district name"},
                "days": {"type": "integer", "description": "Forecast duration in days (default 7)"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_weather_warning",
        "description": "Retrieve official IMD color-coded district warnings (Red, Orange, Yellow) and nowcasts.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "District or city name"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_cyclone_tracking",
        "description": "Retrieve active tropical cyclone tracking trajectories, intensity categories, and distance from location.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "District or coastal city name"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_nearby_weather_events",
        "description": "Retrieve active severe convective storm cells, flash flood rainbands, and squalls within 150km radius.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City or district name"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_satellite_weather",
        "description": "Retrieve INSAT-3D/3DR geostationary satellite cloud top temperature and hydro-estimator rainfall rate from ISRO MOSDAC.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City or district name"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_aviation_advisory",
        "description": "Evaluate aerodrome visibility, cloud base, wind shear, and flight safety ratings.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "Airport or city name"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "get_marine_advisory",
        "description": "Evaluate ocean wave height, sea surface conditions, coastal gale alerts, and fishing advisories.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "Coastal port or maritime district"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "calculate_weather_risk",
        "description": "Perform deterministic meteorological risk calculation for Rain, Heat, Thunderstorm, or Wind.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City or district name"},
                "risk_type": {"type": "string", "enum": ["RAIN", "HEAT", "THUNDERSTORM", "WIND"], "description": "Type of risk"}
            },
            "required": ["location", "risk_type"]
        }
    },
    {
        "name": "generate_agriculture_advisory",
        "description": "Generate agromet decision-support advisory for crops (Wheat, Rice, Cotton, Mustard, Tomato).",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "Agricultural district"},
                "crop_name": {"type": "string", "description": "Crop name (e.g. wheat, rice, cotton)"},
                "crop_stage": {"type": "string", "description": "Growth stage (e.g. vegetative, flowering, maturity)"}
            },
            "required": ["location", "crop_name"]
        }
    },
    {
        "name": "compare_forecasts",
        "description": "Compare multi-model predictions across IMD, NOAA GFS, Open-Meteo ECMWF, and WRF models.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City or district name"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "analyze_climate_trend",
        "description": "Analyze multi-decade historical climate baselines, temperature trend slopes, and monsoon rainfall anomalies.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City or district name"},
                "years": {"type": "integer", "description": "Number of years (default 10)"}
            },
            "required": ["location"]
        }
    }
]


class WeatherToolExecutor:
    """Executes backend meteorological tools with validation."""

    @staticmethod
    async def execute_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        loc_str = arguments.get("location", "Delhi")
        location = geo_resolver.resolve_location(loc_str)

        try:
            if tool_name == "get_current_weather":
                obs = await source_router.get_best_current_observation(location)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": obs, "execution_time_ms": elapsed}

            elif tool_name == "get_forecast":
                days = arguments.get("days", 7)
                fc = await source_router.get_best_forecast(location, days=days)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": fc, "execution_time_ms": elapsed}

            elif tool_name == "get_weather_warning":
                warns = await source_router.get_official_warnings(location)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": warns, "execution_time_ms": elapsed}

            elif tool_name == "get_cyclone_tracking":
                cyclones = cyclone_tracker.get_cyclone_intelligence(location)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": cyclones, "execution_time_ms": elapsed}

            elif tool_name == "get_nearby_weather_events":
                events = nearby_event_engine.evaluate_nearby_events(location)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": events, "execution_time_ms": elapsed}

            elif tool_name == "get_satellite_weather":
                sat = await source_router.get_satellite_telemetry(location)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": sat, "execution_time_ms": elapsed}

            elif tool_name == "get_aviation_advisory":
                obs = await source_router.get_best_current_observation(location)
                adv = domain_framework.evaluate_aviation_weather(location, obs)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": adv, "execution_time_ms": elapsed}

            elif tool_name == "get_marine_advisory":
                obs = await source_router.get_best_current_observation(location)
                adv = domain_framework.evaluate_marine_weather(location, obs)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": adv, "execution_time_ms": elapsed}

            elif tool_name == "calculate_weather_risk":
                risk_type = arguments.get("risk_type", "RAIN").upper()
                obs = await source_router.get_best_current_observation(location)
                fc = await source_router.get_best_forecast(location, days=3)
                warns = await source_router.get_official_warnings(location)

                if risk_type == "HEAT":
                    res = heat_risk_engine.analyze(obs, fc, warns)
                elif risk_type == "THUNDERSTORM":
                    res = thunderstorm_risk_engine.analyze(obs, fc, warns)
                elif risk_type == "WIND":
                    res = wind_risk_engine.analyze(obs, fc, warns)
                else:
                    res = rain_risk_engine.analyze(obs, fc, warns)

                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": res, "execution_time_ms": elapsed}

            elif tool_name == "generate_agriculture_advisory":
                crop = arguments.get("crop_name", "wheat")
                stage_str = arguments.get("crop_stage", "Vegetative Growth")
                obs = await source_router.get_best_current_observation(location)
                fc = await source_router.get_best_forecast(location, days=3)
                warns = await source_router.get_official_warnings(location)

                stage_enum = CropStage.VEGETATIVE
                for s in CropStage:
                    if s.value.lower() in stage_str.lower():
                        stage_enum = s
                        break

                adv = agriculture_advisory_engine.generate_advisory(location, crop, stage_enum, obs, fc, warns)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": adv, "execution_time_ms": elapsed}

            elif tool_name == "compare_forecasts":
                fc = await source_router.get_best_forecast(location, days=1)
                gfs_data = await gfs_provider.get_nwp_forecast(location)
                wrf_data = await wrf_provider.get_nwp_forecast(location)

                next_day = fc.daily_forecasts[0] if fc.daily_forecasts else None
                imd_dict = {
                    "temp_c": next_day.temp_max_c if next_day else 33.0,
                    "rain_mm": next_day.precipitation_amount_mm if next_day else 35.0,
                    "rain_prob_pct": next_day.precipitation_prob_pct if next_day else 80.0
                }

                comp = model_agreement_engine.compare_models(location, imd_dict, gfs_data, wrf_data)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": comp, "execution_time_ms": elapsed}

            elif tool_name == "analyze_climate_trend":
                years = arguments.get("years", 20)
                clim = await source_router.get_climatological_analysis(location, years=years)
                elapsed = (time.time() - start_time) * 1000
                return {"status": "success", "data": clim, "execution_time_ms": elapsed}

            else:
                return {"status": "error", "message": f"Unknown tool: {tool_name}"}

        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return {"status": "error", "message": str(e)}


tool_executor = WeatherToolExecutor()
