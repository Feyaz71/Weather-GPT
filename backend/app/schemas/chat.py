from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
from app.schemas.weather import (
    WeatherObservation,
    ForecastResponse,
    WeatherWarning,
    ModelComparisonResponse,
    CycloneInfo,
    NearbyWeatherEvent
)
from app.schemas.intelligence import (
    WeatherRiskAnalysis,
    AgricultureAdvisory,
    ClimateTrendAnalysis
)
from app.intelligence.domains.decision_framework import DomainAdvisoryResponse


class QueryIntent(str, Enum):
    CURRENT_WEATHER = "current_weather"
    FORECAST = "forecast"
    RAINFALL = "rainfall"
    WARNING = "warning"
    SEVERE_WEATHER = "severe_weather"
    WEATHER_RISK = "weather_risk"
    NEARBY_EVENT = "nearby_event"
    CYCLONE = "cyclone"
    MODEL_COMPARISON = "model_comparison"
    AGRICULTURE_ADVISORY = "agriculture_advisory"
    AVIATION_ADVISORY = "aviation_advisory"
    MARINE_ADVISORY = "marine_advisory"
    TRAVEL_ADVISORY = "travel_advisory"
    HISTORICAL_WEATHER = "historical_weather"
    CLIMATE_ANALYSIS = "climate_analysis"
    GENERAL_WEATHER = "general_weather"


class StructuredIntent(BaseModel):
    intent: QueryIntent
    location: str
    target_date_or_time: Optional[str] = None
    parameters: List[str] = Field(default_factory=list)
    crop_name: Optional[str] = None
    crop_stage: Optional[str] = None
    language: str = "en"
    is_follow_up: bool = False
    confidence: float = 0.98


class ToolCallRecord(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
    status: str = "success"
    execution_time_ms: float = 0.0


class ExplainabilityDetail(BaseModel):
    headline: str
    factors: List[str]
    active_warnings: List[str] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list)
    data_freshness: str = "Live"


class ChatQueryRequest(BaseModel):
    message: str = Field(..., description="User prompt in any Indian language or English")
    session_id: Optional[str] = None
    current_location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    language: Optional[str] = None


class ChatQueryResponse(BaseModel):
    session_id: str
    response_text: str
    language: str = "en"
    direction: str = "ltr"  # "ltr" or "rtl" (for Urdu)
    intent: QueryIntent
    extracted_location: str
    extracted_time: Optional[str] = None
    tools_executed: List[ToolCallRecord] = Field(default_factory=list)
    
    # Structured Payloads
    observation: Optional[WeatherObservation] = None
    forecast: Optional[ForecastResponse] = None
    warnings: Optional[List[WeatherWarning]] = None
    cyclones: Optional[List[CycloneInfo]] = None
    nearby_events: Optional[List[NearbyWeatherEvent]] = None
    risk_analysis: Optional[WeatherRiskAnalysis] = None
    agriculture_advisory: Optional[AgricultureAdvisory] = None
    domain_advisory: Optional[DomainAdvisoryResponse] = None
    model_comparison: Optional[ModelComparisonResponse] = None
    climate_analysis: Optional[ClimateTrendAnalysis] = None
    
    explainability: ExplainabilityDetail
    source_attribution: str = "India Meteorological Department (IMD) & Integrated NWP Grid"
    is_demo: bool = False
