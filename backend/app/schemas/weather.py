from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field


class SourceAuthorityType(str, Enum):
    OFFICIAL_WARNING = "OFFICIAL_WARNING"          # IMD Official District Warnings
    OFFICIAL_OBSERVATION = "OFFICIAL_OBSERVATION"  # IMD AWS / Synoptic Stations, MOSDAC
    MODEL_FORECAST = "MODEL_FORECAST"              # NOAA GFS, WRF-ARW, ECMWF
    THIRD_PARTY_FORECAST = "THIRD_PARTY_FORECAST"  # OpenWeather, WeatherAPI, Open-Meteo
    HISTORICAL_REANALYSIS = "HISTORICAL_REANALYSIS"# ERA5, NASA POWER, IMD Climate Gridded
    AI_INTERPRETATION = "AI_INTERPRETATION"        # Decision Support Explanation


class DataFreshnessStatus(str, Enum):
    LIVE = "LIVE"
    RECENT = "RECENT"
    STALE = "STALE"
    UNAVAILABLE = "UNAVAILABLE"


class WarningSeverityLevel(str, Enum):
    GREEN = "GREEN"      # No Warning / Normal
    YELLOW = "YELLOW"    # Watch / Be Updated
    ORANGE = "ORANGE"    # Alert / Be Prepared
    RED = "RED"          # Warning / Take Immediate Action


class CycloneCategory(str, Enum):
    DEPRESSION = "Depression (31-49 km/h)"
    DEEP_DEPRESSION = "Deep Depression (50-61 km/h)"
    CYCLONIC_STORM = "Cyclonic Storm (62-88 km/h)"
    SEVERE_CYCLONIC_STORM = "Severe Cyclonic Storm (89-117 km/h)"
    VERY_SEVERE_CYCLONIC_STORM = "Very Severe Cyclonic Storm (118-166 km/h)"
    EXTREMELY_SEVERE_CYCLONIC_STORM = "Extremely Severe Cyclonic Storm (167-221 km/h)"
    SUPER_CYCLONE = "Super Cyclonic Storm (>= 222 km/h)"


class NearbyEventRelevance(str, Enum):
    DIRECT_WARNING = "DIRECT_WARNING"                    # User coordinate inside active warning polygon
    NEARBY_POTENTIAL_RELEVANCE = "NEARBY_POTENTIAL_RELEVANCE" # Severe storm/cyclone within 50-100km radius moving toward user
    NEARBY_AWARENESS = "NEARBY_AWARENESS"                # Regional weather event within 100-250km (for situational awareness)


class LocationInfo(BaseModel):
    name: str = Field(..., description="City or place name")
    district: str = Field(..., description="Administrative district name")
    state: str = Field(..., description="State or Union Territory")
    country: str = Field(default="India")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    elevation_m: Optional[float] = None
    station_code: Optional[str] = None


class WeatherObservation(BaseModel):
    source: str = Field(..., description="Authoritative source e.g. IMD_AWS, MOSDAC, NOAA_NCEI, OpenWeather")
    source_type: SourceAuthorityType = SourceAuthorityType.OFFICIAL_OBSERVATION
    location: LocationInfo
    timestamp: datetime = Field(..., description="Observation recorded time")
    retrieved_at: datetime = Field(default_factory=datetime.utcnow)
    temperature_c: Optional[float] = None
    feels_like_c: Optional[float] = None
    humidity_pct: Optional[float] = None
    pressure_hpa: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    wind_gust_kmh: Optional[float] = None
    rainfall_1h_mm: Optional[float] = None
    rainfall_24h_mm: Optional[float] = None
    visibility_km: Optional[float] = None
    cloud_cover_pct: Optional[float] = None
    solar_radiation_wm2: Optional[float] = None  # NASA POWER / MOSDAC
    soil_moisture_m3m3: Optional[float] = None   # NASA POWER Agro
    uv_index: Optional[float] = None
    air_quality_aqi: Optional[int] = None
    weather_condition: Optional[str] = None
    weather_code: Optional[int] = None
    data_freshness: DataFreshnessStatus = DataFreshnessStatus.LIVE
    is_demo: bool = False


class ForecastPoint(BaseModel):
    timestamp: datetime
    temp_min_c: Optional[float] = None
    temp_max_c: Optional[float] = None
    temp_c: Optional[float] = None
    precipitation_prob_pct: Optional[float] = None
    precipitation_amount_mm: Optional[float] = None
    weather_condition: str
    weather_code: Optional[int] = None
    humidity_pct: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    cloud_cover_pct: Optional[float] = None


class DailyForecastPoint(BaseModel):
    date: str  # YYYY-MM-DD
    day_name: str
    temp_max_c: float
    temp_min_c: float
    precipitation_prob_pct: float
    precipitation_amount_mm: float
    weather_condition: str
    warning_level: WarningSeverityLevel = WarningSeverityLevel.GREEN
    humidity_pct: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    hourly: Optional[List[ForecastPoint]] = None


class ForecastResponse(BaseModel):
    source: str = Field(default="IMD Official NWP & Multi-Model Ensemble")
    source_type: SourceAuthorityType = SourceAuthorityType.MODEL_FORECAST
    location: LocationInfo
    generated_at: datetime
    retrieved_at: datetime = Field(default_factory=datetime.utcnow)
    valid_from: datetime
    valid_until: datetime
    daily_forecasts: List[DailyForecastPoint]
    hourly_forecasts: Optional[List[ForecastPoint]] = None
    data_freshness: DataFreshnessStatus = DataFreshnessStatus.LIVE
    is_demo: bool = False


class WeatherWarning(BaseModel):
    warning_id: str
    source: str = Field(default="India Meteorological Department (IMD)")
    source_type: SourceAuthorityType = SourceAuthorityType.OFFICIAL_WARNING
    district: str
    state: str
    category: str  # THUNDERSTORM, HEAVY_RAIN, HEATWAVE, CYCLONE, GALE_WIND, DUST_STORM
    severity: WarningSeverityLevel
    title: str
    description: str
    action_suggested: Optional[str] = None
    issued_at: datetime
    valid_from: datetime
    valid_until: datetime
    affected_coordinates: Optional[List[List[float]]] = None  # GeoJSON polygon coords
    is_active: bool = True


class CycloneTrackPoint(BaseModel):
    timestamp: datetime
    latitude: float
    longitude: float
    intensity_category: CycloneCategory
    max_sustained_wind_kmh: float
    central_pressure_hpa: float
    is_forecast: bool = False  # False = Historical observation, True = IMD Forecast Track


class CycloneInfo(BaseModel):
    cyclone_id: str
    name: str
    basin: str = "North Indian Ocean (Bay of Bengal / Arabian Sea)"
    current_category: CycloneCategory
    current_lat: float
    current_lon: float
    max_sustained_wind_kmh: float
    estimated_central_pressure_hpa: float
    movement_direction: str
    movement_speed_kmh: float
    distance_from_user_km: Optional[float] = None
    relevance_to_user: NearbyEventRelevance = NearbyEventRelevance.NEARBY_AWARENESS
    track_points: List[CycloneTrackPoint]
    landfall_forecast: Optional[str] = None
    source: str = "IMD Cyclone Warning Division (RSMC New Delhi)"


class NearbyWeatherEvent(BaseModel):
    event_id: str
    event_type: str  # CYCLONE, SEVERE_THUNDERSTORM, FLASH_FLOOD, SQUALL_LINE
    headline: str
    severity: WarningSeverityLevel
    epicenter_lat: float
    epicenter_lon: float
    distance_km: float
    bearing_compass: str  # N, NE, E, SE, S, SW, W, NW
    movement_direction: str
    movement_speed_kmh: Optional[float] = None
    relevance: NearbyEventRelevance
    action_advisory: str
    source: str = "IMD Radar / Severe Weather Division"
    issued_at: datetime


class ModelAgreement(BaseModel):
    parameter: str
    imd_value: Any
    gfs_value: Any
    wrf_value: Optional[Any] = None
    ecmwf_value: Optional[Any] = None
    agreement_level: str = Field(..., description="HIGH, MEDIUM, LOW")
    variance_explanation: str


class ModelComparisonResponse(BaseModel):
    location: LocationInfo
    target_time: str
    models_evaluated: List[str]
    agreement_score: float = Field(..., ge=0.0, le=1.0)
    agreement_level: str  # HIGH, MEDIUM, LOW
    parameters: List[ModelAgreement]
    synthesis: str
    uncertainty_index: str  # LOW, MODERATE, HIGH
