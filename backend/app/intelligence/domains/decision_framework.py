from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.schemas.weather import LocationInfo, WeatherObservation, ForecastResponse, WeatherWarning, WarningSeverityLevel
from app.schemas.intelligence import RiskLevel


class DomainAdvisoryResponse(BaseModel):
    domain: str  # AVIATION, MARINE, URBAN, OUTDOOR, DISASTER_MANAGEMENT
    location: LocationInfo
    overall_status: str  # OPERATIONAL, CAUTION, HAZARDOUS, SUSPENDED
    headline: str
    key_metrics: Dict[str, Any]
    safety_guidelines: List[str]
    contributing_factors: List[str]
    source_attribution: str = "IMD Specialized Meteorological Services"


class DomainDecisionFramework:
    """
    Unified Domain Decision Support Framework.
    Generates domain-specific intelligence for Aviation, Marine, Urban Planning, Outdoor, and Disaster Management.
    """
    @staticmethod
    def evaluate_aviation_weather(location: LocationInfo, obs: Optional[WeatherObservation]) -> DomainAdvisoryResponse:
        vis = (obs.visibility_km or 6.0) if obs else 6.0
        gust = (obs.wind_gust_kmh or 15.0) if obs else 15.0
        cond = (obs.weather_condition or "").lower() if obs else ""

        is_storm = "thunderstorm" in cond or "rain" in cond
        if vis < 1.5 or gust > 55.0 or is_storm:
            status = "HAZARDOUS"
            headline = "Instrument Flight Rules (IFR) / Convective Cell Active"
            recs = ["Expect holding patterns and runway approach delays", "Check for low-level windshear (LLWS)", "Monitor aerodrome TAF updates"]
        elif vis < 4.0 or gust > 35.0:
            status = "CAUTION"
            headline = "Marginal VFR (Visual Flight Rules) Conditions"
            recs = ["Crosswind component elevated on active runway", "Visual approach with caution"]
        else:
            status = "OPERATIONAL"
            headline = "Standard VFR Conditions"
            recs = ["Normal aerodrome operations"]

        return DomainAdvisoryResponse(
            domain="AVIATION",
            location=location,
            overall_status=status,
            headline=headline,
            key_metrics={"visibility_km": vis, "wind_gust_kmh": gust, "cloud_base_ft": 2500 if is_storm else 6000},
            safety_guidelines=recs,
            contributing_factors=[f"Surface visibility: {vis:.1f} km", f"Peak wind gust: {gust:.1f} km/h"],
            source_attribution="IMD Aviation Meteorological Office (AMO)"
        )

    @staticmethod
    def evaluate_marine_weather(location: LocationInfo, obs: Optional[WeatherObservation]) -> DomainAdvisoryResponse:
        is_coastal = location.name.lower() in ["mumbai", "chennai", "kolkata", "bhubaneswar", "kochi", "goa"]
        wind_spd = (obs.wind_speed_kmh or 18.0) if obs else 18.0
        gust = (obs.wind_gust_kmh or 25.0) if obs else 25.0

        if wind_spd > 45.0 or gust > 60.0:
            status = "SUSPENDED"
            headline = "Rough to Very Rough Sea Conditions (Squally Gale Warning)"
            recs = ["Fishermen advised not to venture into deep sea", "Small crafts and harbor boats suspended", "Secure dockside moorings"]
            wave_h = 3.8
        elif wind_spd > 25.0 or is_coastal:
            status = "CAUTION"
            headline = "Moderate Sea State with Passing Swells"
            recs = ["Exercise caution in open coastal waters", "Check tidal bulletin before harbor departure"]
            wave_h = 1.8
        else:
            status = "OPERATIONAL"
            headline = "Calm to Slight Sea Conditions"
            recs = ["Normal marine navigation"]
            wave_h = 0.8

        return DomainAdvisoryResponse(
            domain="MARINE",
            location=location,
            overall_status=status,
            headline=headline,
            key_metrics={"significant_wave_height_m": wave_h, "surface_wind_kmh": wind_spd, "sea_surface_temp_c": 28.5},
            safety_guidelines=recs,
            contributing_factors=[f"Sustained marine wind: {wind_spd:.1f} km/h", f"Estimated wave height: ~{wave_h}m"],
            source_attribution="IMD Marine Weather & INCOIS Ocean State Services"
        )

    @staticmethod
    def evaluate_disaster_readiness(
        location: LocationInfo,
        warnings: List[WeatherWarning]
    ) -> DomainAdvisoryResponse:
        red_warn = [w for w in warnings if w.severity == WarningSeverityLevel.RED]
        orange_warn = [w for w in warnings if w.severity == WarningSeverityLevel.ORANGE]

        if red_warn:
            status = "HAZARDOUS"
            headline = "High Priority Emergency Response: Red Alert Active"
            recs = ["Activate district disaster response teams (NDRF/SDRF)", "Open emergency shelter centers in low-lying zones", "Issue broadcast SMS evacuation warnings"]
            factors = [red_warn[0].title]
        elif orange_warn:
            status = "CAUTION"
            headline = "Alert Stage: Orange Severe Weather Warning Active"
            recs = ["Place dewatering pumps on standby at underpasses", "Pre-position rescue teams in vulnerable wards", "Clear storm water drainage bottlenecks"]
            factors = [orange_warn[0].title]
        else:
            status = "OPERATIONAL"
            headline = "Baseline Preparedness: No Active Emergency Warnings"
            recs = ["Routine municipal surveillance", "Maintain standard emergency hotline readiness"]
            factors = ["No severe weather alerts active"]

        return DomainAdvisoryResponse(
            domain="DISASTER_MANAGEMENT",
            location=location,
            overall_status=status,
            headline=headline,
            key_metrics={"active_emergency_alerts": len(red_warn) + len(orange_warn)},
            safety_guidelines=recs,
            contributing_factors=factors,
            source_attribution="National Disaster Management Authority (NDMA) & IMD"
        )


domain_framework = DomainDecisionFramework()
