# WeatherGPT REST & WebSocket API Documentation

## Base URL
- Development: `http://localhost:8000/api/v1`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

---

## 1. Conversational AI Chat

### `POST /api/v1/chat`
Processes natural language weather questions in English or Hindi, dispatches meteorological tools, runs intelligence engines, and returns a grounded explainable response.

**Request Body:**
```json
{
  "message": "Will it rain tomorrow evening in Delhi?",
  "session_id": "sess_12345",
  "current_location": "Delhi",
  "language": "en"
}
```

**Response:**
```json
{
  "session_id": "sess_12345",
  "response_text": "Rain is likely tomorrow evening in Delhi (85% probability, ~35.0 mm expected). Condition: Thunderstorm with Moderate Rain.\n\n⚠️ Official Weather Warning: Orange Alert: Thunderstorm accompanied with Gusty Winds (30-40 kmph).",
  "language": "en",
  "intent": "forecast",
  "extracted_location": "Delhi",
  "extracted_time": "tomorrow evening",
  "tools_executed": [
    { "tool_name": "get_current_weather", "arguments": { "location": "Delhi" }, "status": "success" },
    { "tool_name": "get_forecast", "arguments": { "location": "Delhi", "days": 7 }, "status": "success" },
    { "tool_name": "calculate_weather_risk", "arguments": { "location": "Delhi", "risk_type": "RAIN" }, "status": "success" }
  ],
  "explainability": {
    "headline": "Meteorological Analysis for Delhi",
    "factors": [
      "Short-Range Forecast Probability: 85% chance, ~35.0 mm expected (High likelihood of significant rain spells)",
      "Official Meteorological Warning: ORANGE ALERT (Orange Alert: Thunderstorm accompanied with Gusty Winds)"
    ],
    "sources": ["India Meteorological Department (IMD)"],
    "data_freshness": "Authoritative IMD AWS Feeds"
  },
  "source_attribution": "India Meteorological Department (IMD)",
  "is_demo": true
}
```

---

## 2. Weather & Forecast

### `GET /api/v1/weather/current?location=Delhi`
Retrieves authoritative synoptic / AWS telemetry.

### `GET /api/v1/weather/forecast?location=Delhi&days=7`
Retrieves 7-day official city and NWP multi-model forecast.

### `GET /api/v1/weather/warnings?location=Delhi`
Retrieves active official color-coded warnings (Red, Orange, Yellow).

### `GET /api/v1/weather/rainfall?location=Delhi`
Retrieves 24-hour AWS/ARG rainfall accumulations and departures.

---

## 3. Decision-Support Intelligence

### `POST /api/v1/intelligence/risk`
Calculates deterministic risk scores (0-100) for `RAIN`, `HEAT`, `THUNDERSTORM`, or `WIND`.

### `POST /api/v1/intelligence/agriculture`
Generates agromet decision-support advisory for irrigation scheduling and spraying.

### `GET /api/v1/intelligence/models/compare?location=Delhi`
Performs multi-model comparison across IMD, NOAA GFS, and WRF models.

---

## 4. Historical & Climate

### `GET /api/v1/climate/analyze?location=Delhi&years=10`
Returns 10-year decadal temperature warming trend slopes and monthly precipitation departures against 30-year IMD baselines.

---

## 5. GIS GeoJSON

### `GET /api/v1/gis/stations`
Returns GeoJSON FeatureCollection of all catalogued IMD weather stations.

### `GET /api/v1/gis/warnings`
Returns GeoJSON FeatureCollection of active warning bounding polygons.

---

## 6. Real-Time WebSocket

### `WS /api/v1/ws/weather`
Real-time stream broadcasting severe weather alert dispatches to connected clients.
