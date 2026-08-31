from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
from app.schemas.weather import LocationInfo, WarningSeverityLevel


class RiskLevel(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    EXTREME = "EXTREME"


class RiskFactor(BaseModel):
    name: str
    observed_value: str
    threshold: str
    impact_level: RiskLevel
    description: str


class WeatherRiskAnalysis(BaseModel):
    risk_type: str  # RAIN, THUNDERSTORM, HEAT, FLOOD, WIND, OUTDOOR_ACTIVITY, TRAVEL
    overall_level: RiskLevel
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Deterministic risk index 0-100")
    headline: str
    explanation: str
    factors: List[RiskFactor]
    sources_used: List[str]
    valid_until: Optional[str] = None
    action_recommendations: List[str]
    confidence: str = Field(default="HIGH", description="HIGH, MEDIUM, LOW based on model agreement and data freshness")


class CropStage(str, Enum):
    SOWING = "Sowing / Transplanting"
    VEGETATIVE = "Vegetative Growth"
    FLOWERING = "Flowering / Tasseling"
    GRAIN_FILLING = "Grain Filling / Pod Development"
    MATURITY = "Maturity / Harvest"
    POST_HARVEST = "Post Harvest / Storage"


class AgricultureAdvisory(BaseModel):
    location: LocationInfo
    crop_name: str
    crop_stage: CropStage
    irrigation_advice: str
    irrigation_action: str  # "PROCEED", "DELAY", "STOP", "DRAIN_FIELD"
    spraying_advice: str
    spraying_action: str    # "FAVORABLE", "UNFAVORABLE", "HOLD"
    harvesting_advice: str
    disease_pest_risk: str
    meteorological_drivers: List[str]
    advisory_summary: str
    source: str = Field(default="IMD Agromet Advisory Service (AAS) Guidelines")


class TravelAdvisory(BaseModel):
    location: LocationInfo
    travel_mode: str  # ROAD, AVIATION, OUTDOOR
    safety_rating: str  # SAFE, CAUTION, HAZARDOUS
    visibility_hazard: Optional[str] = None
    road_condition: str
    delays_likely: bool
    guidelines: List[str]


class MonthlyClimateStats(BaseModel):
    month: str
    avg_rainfall_mm: float
    historical_avg_rainfall_mm: float
    rainfall_anomaly_pct: float
    avg_temp_max_c: float
    avg_temp_min_c: float
    temp_anomaly_c: float


class ClimateTrendAnalysis(BaseModel):
    location: LocationInfo
    period: str
    historical_years_analyzed: int
    temperature_trend_per_decade_c: float
    rainfall_trend_pct_change: float
    monsoon_variability_index: str  # STABLE, MODERATE, HIGH
    extreme_weather_event_frequency: str
    monthly_data: List[MonthlyClimateStats]
    summary: str
    methodology: str = Field(default="IMD Gridded Climate Data & ERA5 Reanalysis Normalization")
