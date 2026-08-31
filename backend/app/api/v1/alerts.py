import uuid
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas.alerts import (
    AlertSubscriptionCreate,
    AlertSubscriptionResponse,
    AlertNotificationEvent
)
from app.schemas.weather import WarningSeverityLevel
from app.core.redis import cache_service

router = APIRouter()

# In-memory subscription store with persistence fallback
SUBSCRIPTIONS_STORE: List[AlertSubscriptionResponse] = []


@router.post("/subscribe", response_model=AlertSubscriptionResponse)
async def subscribe_to_alerts(sub: AlertSubscriptionCreate):
    """Subscribe a device, session, or phone to district-level severe weather alerts."""
    sub_id = len(SUBSCRIPTIONS_STORE) + 1
    record = AlertSubscriptionResponse(
        id=sub_id,
        identifier=sub.identifier,
        district=sub.district,
        state=sub.state,
        severity_threshold=sub.severity_threshold,
        categories=sub.categories,
        is_active=True,
        created_at=datetime.utcnow()
    )
    SUBSCRIPTIONS_STORE.append(record)
    return record


@router.get("/subscriptions", response_model=List[AlertSubscriptionResponse])
async def get_active_subscriptions():
    """List active alert subscriptions."""
    return SUBSCRIPTIONS_STORE


@router.post("/simulate", response_model=AlertNotificationEvent)
async def simulate_severe_weather_alert(district: str = "Delhi", severity: WarningSeverityLevel = WarningSeverityLevel.ORANGE):
    """Simulate broadcasting a live severe weather warning to subscribers & WebSockets."""
    now = datetime.utcnow()
    event = AlertNotificationEvent(
        event_id=f"EVT_{uuid.uuid4().hex[:8]}",
        warning_id=f"IMD_WARN_{district.upper()}_{now.strftime('%Y%m%d')}",
        district=district,
        state="State",
        category="THUNDERSTORM",
        severity=severity,
        title=f"{severity} Alert: Severe Convective Storm Warning for {district}",
        description=f"Radar indicates active squall line moving toward {district} with lightning and gusty winds up to 45 km/h.",
        action_suggested="Seek secure shelter immediately. Do not park vehicles under old trees.",
        issued_at=now,
        valid_from=now,
        valid_until=now + timedelta(hours=3),
        source="India Meteorological Department (National Weather Warning Centre)"
    )

    # Publish alert over Redis Pub/Sub / WebSocket channel
    await cache_service.publish("weather_alerts", event.model_dump(mode="json"))
    return event
