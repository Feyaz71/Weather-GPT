import datetime
from typing import Optional
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Boolean,
    Text,
    ForeignKey,
    JSON,
    Index
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(128), nullable=True)
    preferred_language = Column(String(10), default="en")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    subscriptions = relationship("AlertSubscription", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), index=True, nullable=False)
    district = Column(String(128), index=True, nullable=False)
    state = Column(String(128), index=True, nullable=False)
    country = Column(String(64), default="India")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)

    __table_args__ = (
        Index("idx_location_lat_lon", "latitude", "longitude"),
        Index("idx_location_state_district", "state", "district"),
    )


class WeatherStation(Base):
    __tablename__ = "weather_stations"

    id = Column(Integer, primary_key=True, index=True)
    station_code = Column(String(32), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)
    station_type = Column(String(32), default="AWS")  # AWS, ARG, IMD_SYNOP, RADAR
    district = Column(String(128), nullable=False)
    state = Column(String(128), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    last_reported = Column(DateTime, nullable=True)


class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(64), index=True, nullable=False)  # IMD_AWS, IMD_SYNOP, GFS_ANALYSIS
    station_code = Column(String(32), nullable=True)
    location_name = Column(String(128), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    temperature = Column(Float, nullable=True)
    feels_like = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    pressure = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    wind_direction = Column(Float, nullable=True)
    wind_gust = Column(Float, nullable=True)
    rainfall_1h = Column(Float, nullable=True)
    rainfall_24h = Column(Float, nullable=True)
    visibility = Column(Float, nullable=True)
    cloud_cover = Column(Float, nullable=True)
    weather_condition = Column(String(128), nullable=True)
    raw_payload = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ForecastRecord(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(64), index=True, nullable=False)  # IMD_OFFICIAL, GFS_0P25, WRF_3KM
    location_name = Column(String(128), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    forecast_reference_time = Column(DateTime, nullable=False)
    valid_from = Column(DateTime, index=True, nullable=False)
    valid_until = Column(DateTime, index=True, nullable=False)
    temp_min = Column(Float, nullable=True)
    temp_max = Column(Float, nullable=True)
    precipitation_prob = Column(Float, nullable=True)
    precipitation_amount = Column(Float, nullable=True)
    weather_condition = Column(String(128), nullable=True)
    wind_speed = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class WeatherWarning(Base):
    __tablename__ = "weather_warnings"

    id = Column(Integer, primary_key=True, index=True)
    warning_id = Column(String(64), unique=True, index=True, nullable=False)
    source = Column(String(64), default="IMD_OFFICIAL")
    district = Column(String(128), index=True, nullable=False)
    state = Column(String(128), index=True, nullable=False)
    category = Column(String(64), nullable=False)  # THUNDERSTORM, HEAVY_RAIN, HEATWAVE, CYCLONE, GALE_WIND
    severity = Column(String(32), index=True, nullable=False)  # GREEN, YELLOW, ORANGE, RED
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    issued_at = Column(DateTime, nullable=False)
    valid_from = Column(DateTime, index=True, nullable=False)
    valid_until = Column(DateTime, index=True, nullable=False)
    geometry = Column(JSON, nullable=True)  # GeoJSON polygon or district centroid
    action_suggested = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)


class AlertSubscription(Base):
    __tablename__ = "alert_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    identifier = Column(String(128), index=True, nullable=False)  # phone, email, push_token, session_id
    channel = Column(String(32), default="WEBSOCKET")  # WEBSOCKET, PUSH, SMS, EMAIL
    district = Column(String(128), index=True, nullable=False)
    state = Column(String(128), index=True, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    severity_threshold = Column(String(32), default="YELLOW")  # YELLOW, ORANGE, RED
    categories = Column(JSON, nullable=True)  # List of categories subscribed to
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="subscriptions")


class AlertEvent(Base):
    __tablename__ = "alert_events"

    id = Column(Integer, primary_key=True, index=True)
    warning_id = Column(String(64), ForeignKey("weather_warnings.warning_id"), nullable=False)
    subscription_id = Column(Integer, ForeignKey("alert_subscriptions.id"), nullable=True)
    severity = Column(String(32), nullable=False)
    district = Column(String(128), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(32), default="DISPATCHED")
    dispatched_at = Column(DateTime, default=datetime.datetime.utcnow)


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    language = Column(String(10), default="en")
    current_location = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), ForeignKey("chat_sessions.session_id"), nullable=False)
    sender = Column(String(16), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    intent = Column(String(64), nullable=True)
    structured_data = Column(JSON, nullable=True)
    tool_calls = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")
