import pytest
from datetime import datetime, timedelta
from app.schemas.weather import (
    LocationInfo,
    WeatherObservation,
    ForecastResponse,
    DailyForecastPoint,
    WeatherWarning,
    WarningSeverityLevel
)
from app.schemas.intelligence import RiskLevel
from app.intelligence.risk.rain import rain_risk_engine
from app.intelligence.risk.heat import heat_risk_engine, calculate_heat_index
from app.intelligence.risk.thunderstorm import thunderstorm_risk_engine
from app.intelligence.risk.wind import wind_risk_engine


@pytest.fixture
def mock_location():
    return LocationInfo(
        name="Delhi",
        district="New Delhi",
        state="Delhi",
        latitude=28.6139,
        longitude=77.2090
    )


def test_heat_index_calculation():
    # 35°C with 75% RH gives high apparent heat index
    hi = calculate_heat_index(35.0, 75.0)
    assert hi > 45.0  # Danger category


def test_rain_risk_engine_heavy_rain(mock_location):
    obs = WeatherObservation(
        source="IMD",
        location=mock_location,
        timestamp=datetime.utcnow(),
        rainfall_24h_mm=75.0  # Heavy rain
    )
    forecast = ForecastResponse(
        source="IMD",
        location=mock_location,
        generated_at=datetime.utcnow(),
        valid_from=datetime.utcnow(),
        valid_until=datetime.utcnow() + timedelta(days=7),
        daily_forecasts=[
            DailyForecastPoint(
                date="2026-08-30",
                day_name="Tomorrow",
                temp_max_c=32.0,
                temp_min_c=25.0,
                precipitation_prob_pct=85.0,
                precipitation_amount_mm=45.0,
                weather_condition="Heavy Rain"
            )
        ]
    )
    warn = [
        WeatherWarning(
            warning_id="WARN_1",
            district="Delhi",
            state="Delhi",
            category="HEAVY_RAIN",
            severity=WarningSeverityLevel.ORANGE,
            title="Orange Alert",
            description="Heavy rain expected",
            issued_at=datetime.utcnow(),
            valid_from=datetime.utcnow(),
            valid_until=datetime.utcnow()
        )
    ]
    analysis = rain_risk_engine.analyze(obs, forecast, warn)
    assert analysis.overall_level in [RiskLevel.HIGH, RiskLevel.EXTREME]
    assert analysis.risk_score >= 70.0
    assert len(analysis.factors) > 0


def test_wind_risk_engine(mock_location):
    obs = WeatherObservation(
        source="IMD",
        location=mock_location,
        timestamp=datetime.utcnow(),
        wind_speed_kmh=65.0,  # Gale force
        wind_gust_kmh=80.0
    )
    analysis = wind_risk_engine.analyze(obs, None, None)
    assert analysis.overall_level == RiskLevel.HIGH
    assert analysis.risk_score >= 80.0
