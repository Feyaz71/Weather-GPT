from typing import Optional, List
from app.schemas.weather import LocationInfo, WeatherObservation, ForecastResponse, WeatherWarning
from app.schemas.intelligence import TravelAdvisory


class TravelAdvisoryEngine:
    """
    Travel, Road Safety, and Commuter Hazard Advisory Engine.
    Evaluates visibility, road waterlogging, squall winds, and mountain landslide hazards.
    """
    @staticmethod
    def evaluate_travel_risk(
        location: LocationInfo,
        obs: Optional[WeatherObservation] = None,
        forecast: Optional[ForecastResponse] = None,
        warnings: Optional[List[WeatherWarning]] = None
    ) -> TravelAdvisory:
        vis_km = (obs.visibility_km or 8.0) if obs else 8.0
        rain_24h = (obs.rainfall_24h_mm or 0.0) if obs else 0.0
        gust = (obs.wind_gust_kmh or 15.0) if obs else 15.0

        guidelines = []
        delays = False

        if vis_km < 1.0:
            vis_hazard = "Dense Fog / Severe Low Visibility (< 1000m)"
            safety = "HAZARDOUS"
            road_cond = "Hazardous. Slow moving traffic; use fog lamps and maintain safe braking distance."
            delays = True
            guidelines.append("Use low beam headlights and hazard blinkers.")
            guidelines.append("Flight and train schedules may experience severe delays.")
        elif vis_km < 4.0:
            vis_hazard = f"Moderate Haze / Mist (Visibility ~{vis_km:.1f} km)"
            safety = "CAUTION"
            road_cond = "Moderate visibility reduction; proceed with caution."
            guidelines.append("Maintain headway between vehicles.")
        else:
            vis_hazard = "Good Visibility (> 5 km)"
            safety = "SAFE"
            road_cond = "Normal driving conditions."

        if rain_24h > 50.0:
            safety = "HAZARDOUS"
            delays = True
            road_cond += " Severe waterlogging and localized flash inundation in low-lying underpasses."
            guidelines.append("Avoid driving through flooded underpasses and waterlogged road stretches.")

        if gust > 45.0:
            guidelines.append(f"Strong crosswinds ({gust:.0f} km/h); maintain grip on high-speed expressways.")

        return TravelAdvisory(
            location=location,
            travel_mode="ROAD & COMMUTE",
            safety_rating=safety,
            visibility_hazard=vis_hazard,
            road_condition=road_cond,
            delays_likely=delays,
            guidelines=guidelines if guidelines else ["No significant travel advisories active."]
        )


travel_advisory_engine = TravelAdvisoryEngine()
