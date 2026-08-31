import pytest
from datetime import datetime
from app.schemas.weather import (
    LocationInfo,
    WeatherObservation,
    ForecastResponse,
    DailyForecastPoint,
    WeatherWarning,
    WarningSeverityLevel
)


def test_location_info_normalization():
    loc = LocationInfo(
        name="Delhi",
        district="New Delhi",
        state="Delhi",
        country="India",
        latitude=28.6139,
        longitude=77.2090,
        elevation_m=216.0
    )
    assert loc.name == "Delhi"
    assert loc.latitude == 28.6139
    assert loc.country == "India"


def test_weather_observation_null_safety():
    loc = LocationInfo(
        name="Mumbai",
        district="Mumbai Suburban",
        state="Maharashtra",
        latitude=19.0760,
        longitude=72.8777
    )
    obs = WeatherObservation(
        source="IMD_AWS",
        location=loc,
        timestamp=datetime.utcnow(),
        temperature_c=29.5,
        feels_like_c=34.0,
        humidity_pct=85.0
        # Other fields default to None without fabrication
    )
    assert obs.temperature_c == 29.5
    assert obs.rainfall_1h_mm is None
    assert obs.air_quality_aqi is None


def test_weather_warning_severity():
    warn = WeatherWarning(
        warning_id="IMD_WARN_001",
        district="Delhi",
        state="Delhi",
        category="THUNDERSTORM",
        severity=WarningSeverityLevel.ORANGE,
        title="Orange Alert: Thunderstorm",
        description="Gusty winds up to 40 kmph",
        issued_at=datetime.utcnow(),
        valid_from=datetime.utcnow(),
        valid_until=datetime.utcnow()
    )
    assert warn.severity == WarningSeverityLevel.ORANGE
    assert warn.is_active is True
