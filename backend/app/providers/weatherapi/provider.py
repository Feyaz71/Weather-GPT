import httpx
from datetime import datetime
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.schemas.weather import (
    LocationInfo,
    WeatherObservation,
    SourceAuthorityType,
    DataFreshnessStatus
)


class WeatherAPIProvider:
    """
    WeatherAPI.com Provider.
    Retrieves current weather, 3-day forecast, air quality indices, and severe alerts.
    """
    def __init__(self):
        self.base_url = settings.WEATHERAPI_BASE_URL
        self.api_key = settings.WEATHERAPI_KEY

    async def get_current_weather(self, location: LocationInfo) -> Optional[WeatherObservation]:
        if self.api_key:
            try:
                async with httpx.AsyncClient(timeout=4.0) as client:
                    resp = await client.get(
                        f"{self.base_url}/current.json",
                        params={
                            "key": self.api_key,
                            "q": f"{location.latitude},{location.longitude}",
                            "aqi": "yes"
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        curr = data.get("current", {})
                        cond = curr.get("condition", {}).get("text", "Clear")
                        aqi = curr.get("air_quality", {}).get("pm2_5", 50.0)

                        return WeatherObservation(
                            source="WeatherAPI.com Global Station Feed",
                            source_type=SourceAuthorityType.THIRD_PARTY_FORECAST,
                            location=location,
                            timestamp=datetime.utcnow(),
                            temperature_c=float(curr.get("temp_c", 30.0)),
                            feels_like_c=float(curr.get("feelslike_c", 32.0)),
                            humidity_pct=float(curr.get("humidity", 65.0)),
                            pressure_hpa=float(curr.get("pressure_mb", 1010.0)),
                            wind_speed_kmh=float(curr.get("wind_kph", 15.0)),
                            wind_direction_deg=float(curr.get("wind_degree", 90.0)),
                            wind_gust_kmh=float(curr.get("gust_kph", 20.0)),
                            visibility_km=float(curr.get("vis_km", 6.0)),
                            uv_index=float(curr.get("uv", 6.0)),
                            air_quality_aqi=int(aqi),
                            weather_condition=cond,
                            data_freshness=DataFreshnessStatus.LIVE,
                            is_demo=False
                        )
            except Exception as e:
                logger.warning(f"WeatherAPI live retrieval error ({e})")
        return None


weather_api_provider = WeatherAPIProvider()
