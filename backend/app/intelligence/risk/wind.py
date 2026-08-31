from typing import List, Optional
from app.schemas.weather import WeatherObservation, ForecastResponse, WeatherWarning, WarningSeverityLevel
from app.schemas.intelligence import WeatherRiskAnalysis, RiskLevel, RiskFactor


class WindRiskEngine:
    """
    Wind Speed and Gale Risk Engine.
    Based on Beaufort Wind Scale and IMD Cyclone/Squall Warning standards.
    """
    @staticmethod
    def analyze(
        obs: Optional[WeatherObservation],
        forecast: Optional[ForecastResponse],
        warnings: Optional[List[WeatherWarning]] = None
    ) -> WeatherRiskAnalysis:
        factors: List[RiskFactor] = []
        sources = ["Beaufort Wind Scale", "IMD Cyclone & Squall Classification"]
        
        speed = (obs.wind_speed_kmh or 12.0) if obs else 12.0
        gust = (obs.wind_gust_kmh or speed * 1.3) if obs else speed * 1.3

        if speed >= 62.0 or gust >= 75.0:
            factors.append(RiskFactor(
                name="Sustained Wind / Gale",
                observed_value=f"{speed:.1f} km/h (Gusts: {gust:.1f} km/h)",
                threshold=">= 62 km/h (Gale Force / IMD Squall)",
                impact_level=RiskLevel.EXTREME,
                description="Structural damage, uprooted trees, and disruption of power lines possible."
            ))
            score = 90.0
            level = RiskLevel.HIGH
            headline = "Gale Force / Severe Squall Hazard"
            recs = ["Secure loose outdoor items", "Avoid driving high-sided vehicles", "Stay clear of power lines"]
        elif speed >= 40.0 or gust >= 50.0:
            factors.append(RiskFactor(
                name="Strong Breeze / Squally Wind",
                observed_value=f"{speed:.1f} km/h (Gusts: {gust:.1f} km/h)",
                threshold=">= 40 km/h (Beaufort 6)",
                impact_level=RiskLevel.MODERATE,
                description="Large branches in motion; umbrellas used with difficulty."
            ))
            score = 55.0
            level = RiskLevel.MODERATE
            headline = "Moderate Squally Wind Risk"
            recs = ["Secure balconies and loose fixtures", "Exercise caution while cycling or two-wheeler riding"]
        else:
            factors.append(RiskFactor(
                name="Gentle to Moderate Breeze",
                observed_value=f"{speed:.1f} km/h",
                threshold="< 40 km/h",
                impact_level=RiskLevel.LOW,
                description="Normal wind conditions with no hazards."
            ))
            score = 15.0
            level = RiskLevel.LOW
            headline = "Low Wind Hazard"
            recs = ["Normal activity"]

        return WeatherRiskAnalysis(
            risk_type="WIND",
            overall_level=level,
            risk_score=round(score, 1),
            headline=headline,
            explanation=f"Wind speed currently measured at {speed} km/h with maximum gusts of {gust} km/h.",
            factors=factors,
            sources_used=sources,
            action_recommendations=recs,
            confidence="HIGH"
        )


wind_risk_engine = WindRiskEngine()
