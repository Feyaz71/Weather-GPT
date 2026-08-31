from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
from app.schemas.weather import WarningSeverityLevel


class AlertChannel(str, Enum):
    WEBSOCKET = "WEBSOCKET"
    PUSH = "PUSH"
    SMS = "SMS"
    EMAIL = "EMAIL"


class AlertSubscriptionCreate(BaseModel):
    identifier: str = Field(..., description="Device ID, session ID, phone number or email")
    district: str
    state: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity_threshold: WarningSeverityLevel = WarningSeverityLevel.YELLOW
    categories: List[str] = Field(default_factory=lambda: ["THUNDERSTORM", "HEAVY_RAIN", "HEATWAVE", "CYCLONE"])
    channel: AlertChannel = AlertChannel.WEBSOCKET


class AlertSubscriptionResponse(BaseModel):
    id: int
    identifier: str
    district: str
    state: str
    severity_threshold: WarningSeverityLevel
    categories: List[str]
    is_active: bool
    created_at: datetime


class AlertNotificationEvent(BaseModel):
    event_id: str
    warning_id: str
    district: str
    state: str
    category: str
    severity: WarningSeverityLevel
    title: str
    description: str
    action_suggested: Optional[str] = None
    issued_at: datetime
    valid_from: datetime
    valid_until: datetime
    source: str = "India Meteorological Department"
