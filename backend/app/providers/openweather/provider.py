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


class OpenWeatherProvider:
    """
    OpenWeather API Provider.
    Retrieves application-level current conditions and global forecasts.
    """
    def __init__(self):
        self.base_url = settings.OPENWEATHER_BASE_URL
        self.api_key = settings.OPENWEATHER_API_KEY

    async def get_current_weather(self, location: LocationInfo) -> Optional[WeatherObservation]:
        if self.api_key:
            try:
                async with httpx.AsyncClient(timeout=4.0) as client:
                    resp = await client.get(
                        f"{self.base_url}/weather",
                        params={
                            "lat": location.latitude,
                            "lon": location.longitude,
                            "appid": self.api_key,
                            "units": "metric"
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        main = data.get("main", {})
                        wind = data.get("wind", {})
                        weather_desc = data.get("weather", [{}])[0].get("description", "Clear").title()

                        return WeatherObservation(
                            source="OpenWeatherMap API",
                            source_type=SourceAuthorityType.THIRD_PARTY_FORECAST,
                            location=location,
                            timestamp=datetime.utcnow(),
                            temperature_c=float(main.get("temp", 30.0)),
                            feels_like_c=float(main.get("feels_like", 32.0)),
                            humidity_pct=float(main.get("humidity", 65.0)),
                            pressure_hpa=float(main.get("pressure", 1010.0)),
                            wind_speed_kmh=round(float(wind.get("speed", 4.0)) * 3.6, 1),
                            weather_condition=weather_desc,
                            data_freshness=DataFreshnessStatus.LIVE,
                            is_demo=False
                        )
            except Exception as e:
                logger.warning(f"OpenWeather live retrieval error: {e}")
        return None


openweather_provider = OpenWeatherProvider()
