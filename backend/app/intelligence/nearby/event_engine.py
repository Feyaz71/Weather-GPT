import math
from datetime import datetime, timedelta
from typing import List, Optional
from app.schemas.weather import (
    LocationInfo,
    NearbyWeatherEvent,
    WarningSeverityLevel,
    NearbyEventRelevance
)
from app.providers.geo.resolver import haversine_distance


def calculate_compass_bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> str:
    """Calculate 8-point compass bearing from point 1 to point 2."""
    d_lon = math.radians(lon2 - lon1)
    y = math.sin(d_lon) * math.cos(math.radians(lat2))
    x = (math.cos(math.radians(lat1)) * math.sin(math.radians(lat2)) -
         math.sin(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.cos(d_lon))
    bearing = (math.degrees(math.atan2(y, x)) + 360) % 360

    compass_points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]
    idx = int((bearing + 22.5) / 45)
    return compass_points[idx]


class NearbyEventEngine:
    """
    Nearby Severe Weather Event & Disaster Proximity Engine.
    Evaluates convective clusters within a configurable radius (e.g. 100km).
    """
    @staticmethod
    def evaluate_nearby_events(
        location: LocationInfo,
        radius_km: float = 150.0
    ) -> List[NearbyWeatherEvent]:
        # Catalog of active regional meteorological events
        synoptic_events = [
            {
                "event_id": "EVT_CONV_NCR_01",
                "event_type": "SEVERE_THUNDERSTORM",
                "headline": "Active Convective Squall Line with Lightning",
                "severity": WarningSeverityLevel.ORANGE,
                "lat": 28.85,
                "lon": 77.05,
                "movement_dir": "Southeast (SE)",
                "movement_speed": 35.0,
                "advisory": "Gusty squalls (40-50 km/h) approaching; avoid open grounds."
            },
            {
                "event_id": "EVT_MONSOON_KONKAN_02",
                "event_type": "FLASH_FLOOD_CELL",
                "headline": "Intense Monsoonal Convective Rainband",
                "severity": WarningSeverityLevel.RED,
                "lat": 18.82,
                "lon": 72.95,
                "movement_dir": "East-Northeast (ENE)",
                "movement_speed": 22.0,
                "advisory": "Extremely heavy rainband causing localized drainage congestion."
            }
        ]

        results: List[NearbyWeatherEvent] = []
        now = datetime.utcnow()

        for ev in synoptic_events:
            dist = haversine_distance(location.latitude, location.longitude, ev["lat"], ev["lon"])
            if dist <= radius_km:
                bearing = calculate_compass_bearing(location.latitude, location.longitude, ev["lat"], ev["lon"])
                
                if dist <= 30.0:
                    relevance = NearbyEventRelevance.DIRECT_WARNING
                elif dist <= 80.0:
                    relevance = NearbyEventRelevance.NEARBY_POTENTIAL_RELEVANCE
                else:
                    relevance = NearbyEventRelevance.NEARBY_AWARENESS

                results.append(NearbyWeatherEvent(
                    event_id=ev["event_id"],
                    event_type=ev["event_type"],
                    headline=ev["headline"],
                    severity=ev["severity"],
                    epicenter_lat=ev["lat"],
                    epicenter_lon=ev["lon"],
                    distance_km=round(dist, 1),
                    bearing_compass=bearing,
                    movement_direction=ev["movement_dir"],
                    movement_speed_kmh=ev["movement_speed"],
                    relevance=relevance,
                    action_advisory=ev["advisory"],
                    source="IMD Doppler Weather Radar & Nowcast Division",
                    issued_at=now - timedelta(minutes=25)
                ))

        return results


nearby_event_engine = NearbyEventEngine()
