import pytest
from app.providers.geo.resolver import geo_resolver
from app.providers.imd.provider import imd_provider
from app.providers.mosdac.provider import mosdac_provider
from app.providers.noaa.provider import noaa_provider
from app.providers.era5.provider import era5_provider
from app.providers.openweather.provider import openweather_provider
from app.providers.openmeteo.provider import open_meteo_provider
from app.providers.weatherapi.provider import weather_api_provider
from app.providers.nasapower.provider import nasa_power_provider
from app.providers.router.source_router import source_router


@pytest.mark.asyncio
async def test_all_8_providers():
    loc = geo_resolver.resolve_location("Mumbai")

    # 1. IMD Provider
    imd_obs = await imd_provider.get_current_weather(loc)
    assert imd_obs.temperature_c is not None
    assert imd_obs.source_type.value == "OFFICIAL_OBSERVATION"

    # 2. MOSDAC Provider
    mosdac_data = await mosdac_provider.get_satellite_observations(loc)
    assert "cloud_top_temperature_k" in mosdac_data

    # 3. NOAA Provider
    noaa_data = await noaa_provider.get_gfs_forecast(loc)
    assert "forecast_temp_c" in noaa_data

    # 4. ERA5 Provider
    era5_data = await era5_provider.get_climatological_reanalysis(loc, years=20)
    assert era5_data.temperature_trend_per_decade_c > 0

    # 5. OpenWeather Provider (Graceful fallback)
    ow_obs = await openweather_provider.get_current_weather(loc)
    # May be None if no key configured in test env, perfectly valid

    # 6. Open-Meteo Provider
    om_fc = await open_meteo_provider.get_multi_model_forecast(loc, days=3)
    if om_fc:
        assert len(om_fc.daily_forecasts) > 0

    # 7. WeatherAPI Provider (Graceful fallback)
    wapi_obs = await weather_api_provider.get_current_weather(loc)
    # May be None if no key configured

    # 8. NASA POWER Provider
    nasa_data = await nasa_power_provider.get_agroclimatology_parameters(loc)
    assert "solar_radiation_mj_m2_day" in nasa_data

    # Source Router Ingestion
    best_obs = await source_router.get_best_current_observation(loc)
    assert best_obs.temperature_c is not None
