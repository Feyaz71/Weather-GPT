import httpx
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.schemas.weather import LocationInfo
from app.providers.base import BaseNWPProvider


class GFSProvider(BaseNWPProvider):
    """
    NOAA Global Forecast System (GFS) 0.25° NWP Provider.
    Retrieves global atmospheric numerical forecasts via Open-Meteo GFS API or fallback simulator.
    """
    def __init__(self):
        self.base_url = settings.GFS_API_BASE_URL

    async def get_nwp_forecast(self, location: LocationInfo, model_name: str = "GFS") -> Dict[str, Any]:
        if not settings.DEMO_MODE:
            try:
                async with httpx.AsyncClient(timeout=4.0) as client:
                    resp = await client.get(
                        "https://api.open-meteo.com/v1/forecast",
                        params={
                            "latitude": location.latitude,
                            "longitude": location.longitude,
                            "hourly": "temperature_2m,precipitation_probability,precipitation,wind_speed_10m,relative_humidity_2m",
                            "models": "gfs_seamless",
                            "forecast_days": 3
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return self._parse_gfs_response(data, location)
            except Exception as e:
                logger.warning(f"GFS live retrieval error: {e}. Falling back to standard NWP model approximation.")

        return self._generate_gfs_model_data(location)

    def _parse_gfs_response(self, data: Dict[str, Any], location: LocationInfo) -> Dict[str, Any]:
        hourly = data.get("hourly", {})
        temps = hourly.get("temperature_2m", [30.0])
        precips = hourly.get("precipitation", [0.0])
        probs = hourly.get("precipitation_probability", [20])
        winds = hourly.get("wind_speed_10m", [12.0])

        return {
            "source": "NOAA GFS (0.25° Grid)",
            "model_name": "GFS_SEAMLESS",
            "location": location.name,
            "forecast_temp_c": round(sum(temps[:24]) / max(1, len(temps[:24])), 1),
            "expected_rain_24h_mm": round(sum(precips[:24]), 1),
            "max_rain_prob_pct": max(probs[:24]) if probs else 20,
            "max_wind_kmh": max(winds[:24]) if winds else 15.0,
            "data_freshness": "Live NOAA GFS",
            "is_demo": False
        }

    def _generate_gfs_model_data(self, location: LocationInfo) -> Dict[str, Any]:
        # GFS model baseline for comparison
        is_delhi_or_mumbai = location.name.lower() in ["delhi", "mumbai"]
        return {
            "source": "NOAA GFS (0.25° NWP Simulation)",
            "model_name": "GFS_0P25",
            "location": location.name,
            "forecast_temp_c": 32.8 if location.name.lower() == "delhi" else 29.5,
            "expected_rain_24h_mm": 32.0 if is_delhi_or_mumbai else 0.0,
            "max_rain_prob_pct": 75 if is_delhi_or_mumbai else 15,
            "max_wind_kmh": 22.0,
            "data_freshness": "Demo NWP Simulation",
            "is_demo": True
        }


gfs_provider = GFSProvider()
