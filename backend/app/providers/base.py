from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.weather import (
    WeatherObservation,
    ForecastResponse,
    WeatherWarning,
    LocationInfo
)
from app.schemas.intelligence import ClimateTrendAnalysis


class BaseWeatherProvider(ABC):
    @abstractmethod
    async def get_current_weather(self, location: LocationInfo) -> WeatherObservation:
        """Fetch real-time weather observation for the given location."""
        pass


class BaseForecastProvider(ABC):
    @abstractmethod
    async def get_forecast(self, location: LocationInfo, days: int = 7) -> ForecastResponse:
        """Fetch multi-day weather forecast."""
        pass


class BaseWarningProvider(ABC):
    @abstractmethod
    async def get_warnings(self, location: LocationInfo) -> List[WeatherWarning]:
        """Fetch active official weather warnings/alerts."""
        pass


class BaseRainfallProvider(ABC):
    @abstractmethod
    async def get_rainfall_data(self, location: LocationInfo) -> Dict[str, Any]:
        """Fetch AWS/ARG cumulative rainfall observations."""
        pass


class BaseNWPProvider(ABC):
    @abstractmethod
    async def get_nwp_forecast(self, location: LocationInfo, model_name: str = "GFS") -> Dict[str, Any]:
        """Fetch numerical weather prediction grid data."""
        pass


class BaseHistoricalProvider(ABC):
    @abstractmethod
    async def get_historical_climate(self, location: LocationInfo, years: int = 10) -> ClimateTrendAnalysis:
        """Fetch multi-year historical meteorological records and trends."""
        pass
