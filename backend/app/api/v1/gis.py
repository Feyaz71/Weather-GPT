from typing import List
from fastapi import APIRouter
from app.schemas.gis import GeoJSONFeatureCollection, GeoJSONFeature, GeoJSONGeometry, WeatherMapStationPoint
from app.schemas.weather import WarningSeverityLevel
from app.providers.geo.resolver import geo_resolver
from app.providers.imd.provider import imd_provider

router = APIRouter()


@router.get("/stations", response_model=GeoJSONFeatureCollection)
async def get_gis_station_features():
    """Retrieve all IMD station points formatted as a GeoJSON FeatureCollection."""
    stations = geo_resolver.get_all_stations()
    features: List[GeoJSONFeature] = []

    for st in stations:
        obs = await imd_provider.get_current_weather(st)
        warns = await imd_provider.get_warnings(st)
        highest_sev = WarningSeverityLevel.GREEN
        if warns:
            highest_sev = warns[0].severity

        feat = GeoJSONFeature(
            geometry=GeoJSONGeometry(
                type="Point",
                coordinates=[st.longitude, st.latitude]
            ),
            properties={
                "station_code": st.station_code or "IMD_AWS",
                "name": st.name,
                "district": st.district,
                "state": st.state,
                "temperature_c": obs.temperature_c,
                "feels_like_c": obs.feels_like_c,
                "humidity_pct": obs.humidity_pct,
                "weather_condition": obs.weather_condition,
                "rainfall_24h_mm": obs.rainfall_24h_mm,
                "wind_speed_kmh": obs.wind_speed_kmh,
                "warning_level": highest_sev
            }
        )
        features.append(feat)

    return GeoJSONFeatureCollection(features=features)


@router.get("/warnings", response_model=GeoJSONFeatureCollection)
async def get_gis_warning_polygons():
    """Retrieve GeoJSON polygons for active district weather warnings."""
    stations = geo_resolver.get_all_stations()
    features: List[GeoJSONFeature] = []

    for st in stations:
        warns = await imd_provider.get_warnings(st)
        for w in warns:
            if w.affected_coordinates:
                feat = GeoJSONFeature(
                    geometry=GeoJSONGeometry(
                        type="Polygon",
                        coordinates=[w.affected_coordinates]
                    ),
                    properties={
                        "warning_id": w.warning_id,
                        "district": w.district,
                        "state": w.state,
                        "category": w.category,
                        "severity": w.severity,
                        "title": w.title,
                        "description": w.description,
                        "valid_until": w.valid_until.isoformat(),
                        "source": w.source
                    }
                )
                features.append(feat)

    return GeoJSONFeatureCollection(features=features)
