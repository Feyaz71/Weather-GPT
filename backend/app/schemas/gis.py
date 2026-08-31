from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field
from app.schemas.weather import WarningSeverityLevel


class GeoJSONGeometry(BaseModel):
    type: str  # "Point", "Polygon", "MultiPolygon"
    coordinates: Any


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoJSONGeometry
    properties: Dict[str, Any]


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]


class WeatherMapStationPoint(BaseModel):
    station_code: str
    name: str
    district: str
    state: str
    latitude: float
    longitude: float
    temperature_c: Optional[float] = None
    weather_condition: Optional[str] = None
    rainfall_24h_mm: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    warning_level: WarningSeverityLevel = WarningSeverityLevel.GREEN
