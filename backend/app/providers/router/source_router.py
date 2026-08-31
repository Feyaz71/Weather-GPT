from typing import Dict, Any, Optional, List
from datetime import datetime
from app.core.logging import logger
from app.schemas.weather import (
    LocationInfo,
    WeatherObservation,
    ForecastResponse,
    WeatherWarning,
    SourceAuthorityType,
    DataFreshnessStatus
)
from app.schemas.intelligence import ClimateTrendAnalysis
from app.providers.imd.provider import imd_provider
from app.providers.mosdac.provider import mosdac_provider
from app.providers.noaa.provider import noaa_provider
from app.providers.era5.provider import era5_provider
from app.providers.openweather.provider import openweather_provider
from app.providers.openmeteo.provider import open_meteo_provider
from app.providers.weatherapi.provider import weather_api_provider
from app.providers.nasapower.provider import nasa_power_provider


class SourceRouter:
    """
    Intelligent Source Router and Provider Registry.
    Routes queries based on authority, data category, temporal window, and fallback chains.
    """
    @staticmethod
    async def get_best_current_observation(location: LocationInfo) -> WeatherObservation:
        """Fallback Chain: IMD Official AWS -> OpenWeather -> WeatherAPI -> Open-Meteo."""
        # 1. Primary: IMD AWS / Synoptic Observation
        try:
            obs = await imd_provider.get_current_weather(location)
            if obs:
                return obs
        except Exception as e:
            logger.warning(f"Primary IMD observation failed: {e}")

        # 2. Secondary: OpenWeather (if key configured)
        try:
            ow_obs = await openweather_provider.get_current_weather(location)
            if ow_obs:
                return ow_obs
        except Exception as e:
            logger.warning(f"OpenWeather observation failed: {e}")

        # 3. Tertiary: WeatherAPI (if key configured)
        try:
            wapi_obs = await weather_api_provider.get_current_weather(location)
            if wapi_obs:
                return wapi_obs
        except Exception as e:
            logger.warning(f"WeatherAPI observation failed: {e}")

        # 4. Final: Authoritative IMD Default Grid
        return imd_provider._generate_authoritative_observation(location)

    @staticmethod
    async def get_best_forecast(location: LocationInfo, days: int = 7) -> ForecastResponse:
        """Fallback Chain: IMD Official Ensemble -> Open-Meteo Multi-Model."""
        try:
            fc = await imd_provider.get_forecast(location, days=days)
            if fc:
                return fc
        except Exception as e:
            logger.warning(f"Primary IMD forecast failed: {e}")

        # Open-Meteo High-Resolution Multi-Model NWP Fallback
        om_fc = await open_meteo_provider.get_multi_model_forecast(location, days=days)
        if om_fc:
            return om_fc

        return imd_provider._generate_authoritative_forecast(location, days=days)

    @staticmethod
    async def get_official_warnings(location: LocationInfo) -> List[WeatherWarning]:
        """Official Warnings are strictly retrieved from authoritative IMD bulletins."""
        return await imd_provider.get_warnings(location)

    @staticmethod
    async def get_satellite_telemetry(location: LocationInfo) -> Dict[str, Any]:
        """Retrieve INSAT-3D/3DR satellite cloud products from ISRO MOSDAC."""
        return await mosdac_provider.get_satellite_observations(location)

    @staticmethod
    async def get_climatological_analysis(location: LocationInfo, years: int = 20) -> ClimateTrendAnalysis:
        """Retrieve historical reanalysis from Copernicus CDS ERA5 & NASA POWER."""
        return await era5_provider.get_climatological_reanalysis(location, years=years)

    @staticmethod
    async def get_agroclimatology(location: LocationInfo) -> Dict[str, Any]:
        """Retrieve solar radiation and surface soil moisture from NASA POWER."""
        return await nasa_power_provider.get_agroclimatology_parameters(location)


source_router = SourceRouter()
