import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"].upper() == "HEALTHY"
    assert data["service"] == "WeatherGPT"


def test_get_current_weather():
    response = client.get("/api/v1/weather/current?location=Delhi")
    assert response.status_code == 200
    data = response.json()
    assert data["location"]["name"] == "Delhi"
    assert "temperature_c" in data
    assert "source" in data


def test_get_forecast():
    response = client.get("/api/v1/weather/forecast?location=Delhi&days=7")
    assert response.status_code == 200
    data = response.json()
    assert len(data["daily_forecasts"]) == 7
    assert data["location"]["name"] == "Delhi"


def test_get_warnings():
    response = client.get("/api/v1/weather/warnings?location=Delhi")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_chat_endpoint():
    payload = {
        "message": "Will it rain tomorrow evening in Delhi?",
        "language": "en"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response_text" in data
    assert data["extracted_location"] == "Delhi"
    assert len(data["tools_executed"]) > 0
    assert "explainability" in data
    assert "India Meteorological Department" in data["source_attribution"]


def test_chat_endpoint_hindi():
    payload = {
        "message": "कल शाम दिल्ली में बारिश होगी क्या?",
        "language": "hi"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response_text" in data
    assert data["language"] == "hi"
    assert data["extracted_location"] == "Delhi"


def test_gis_stations():
    response = client.get("/api/v1/gis/stations")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) > 0


def test_climate_analysis():
    response = client.get("/api/v1/climate/analyze?location=Delhi&years=10")
    assert response.status_code == 200
    data = response.json()
    assert data["historical_years_analyzed"] == 10
    assert len(data["monthly_data"]) == 12
