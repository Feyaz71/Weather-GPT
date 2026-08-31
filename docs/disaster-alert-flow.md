# Severe Weather Alert & Disaster Warning Flow

```mermaid
graph LR
    IMD_API[Official IMD Warning Bulletin] --> Processor[Warning Ingestion Engine]
    Processor --> Normalizer[Severity Normalizer: Red / Orange / Yellow]
    Normalizer --> SpatialFilter[PostGIS Spatial Point-in-Polygon Matcher]
    SpatialFilter --> Subscriptions[(Alert Subscriptions Database)]
    SpatialFilter --> PubSub[Redis Pub/Sub Channel]
    PubSub --> WebSocket[FastAPI WebSocket Stream]
    PubSub --> Push[FCM Push Service]
    WebSocket --> WebClient[Web Dashboard Alert Banner]
    Push --> MobileClient[Mobile & SMS Alerts]
```

## Severity Tiers

1. **RED (Warning)**: Take Immediate Action. Severe cyclones, intense thunderstorm downpours (>150 mm), catastrophic winds (>65 km/h).
2. **ORANGE (Alert)**: Be Prepared. Squally winds (40-60 km/h), heavy rains (65-115 mm), localized flooding.
3. **YELLOW (Watch)**: Be Updated. Advisory conditions; keep track of meteorological developments.
4. **GREEN (No Warning)**: Safe meteorological baseline.
