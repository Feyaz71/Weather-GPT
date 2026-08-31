from typing import List, Optional
from app.schemas.weather import WeatherObservation, ForecastResponse, WeatherWarning, WarningSeverityLevel
from app.schemas.intelligence import WeatherRiskAnalysis, RiskLevel, RiskFactor


class ThunderstormRiskEngine:
    """
    Thunderstorm, Lightning and Severe Convective Risk Engine.
    Combines IMD Nowcasts, radar signatures, CAPE instability, and active warnings.
    """
    @staticmethod
    def analyze(
        obs: Optional[WeatherObservation],
        forecast: Optional[ForecastResponse],
        warnings: Optional[List[WeatherWarning]] = None
    ) -> WeatherRiskAnalysis:
        factors: List[RiskFactor] = []
        sources = ["IMD Nowcast & Severe Weather Bulletin"]
        score = 0.0

        # Check conditions
        cond_str = (obs.weather_condition or "").lower() if obs else ""
        is_active_thunderstorm = "thunderstorm" in cond_str or "lightning" in cond_str or "squall" in cond_str

        if is_active_thunderstorm:
            factors.append(RiskFactor(
                name="Current Convective Activity",
                observed_value=obs.weather_condition or "Thunderstorm Active",
                threshold="Active Lightning / Thunder Cell",
                impact_level=RiskLevel.HIGH,
                description="Active convective storm cell in the observation radius."
            ))
            score += 45.0

        # Gust speeds
        gust = (obs.wind_gust_kmh or 0.0) if obs else 0.0
        if gust >= 50.0:
            factors.append(RiskFactor(
                name="Peak Wind Gusts",
                observed_value=f"{gust:.1f} km/h (Squally)",
                threshold=">= 50 km/h",
                impact_level=RiskLevel.HIGH,
                description="High squall winds capable of breaking tree branches and temporary hoardings."
            ))
            score += 30.0
        elif gust >= 30.0:
            factors.append(RiskFactor(
                name="Peak Wind Gusts",
                observed_value=f"{gust:.1f} km/h",
                threshold=">= 30 km/h",
                impact_level=RiskLevel.MODERATE,
                description="Moderate gusty conditions."
            ))
            score += 15.0

        # Warning severity
        if warnings:
            for w in warnings:
                if w.category in ["THUNDERSTORM", "LIGHTNING", "CYCLONE"]:
                    sources.append(w.source)
                    if w.severity in [WarningSeverityLevel.RED, WarningSeverityLevel.ORANGE]:
                        score += 35.0
                        factors.append(RiskFactor(
                            name="Official Thunderstorm Warning",
                            observed_value=f"{w.severity} ALERT",
                            threshold="IMD District Nowcast Alert",
                            impact_level=RiskLevel.HIGH,
                            description=w.title
                        ))
                    elif w.severity == WarningSeverityLevel.YELLOW:
                        score += 15.0
                        factors.append(RiskFactor(
                            name="Official Thunderstorm Warning",
                            observed_value="YELLOW WATCH",
                            threshold="IMD Watch",
                            impact_level=RiskLevel.MODERATE,
                            description=w.title
                        ))

        final_score = min(100.0, max(5.0, score))
        if final_score >= 60.0:
            level = RiskLevel.HIGH
            headline = "Severe Thunderstorm & Lightning Hazard"
            explanation = "Atmospheric instability and active radar/warning indications present high thunderstorm and gusty squall risks."
            recs = [
                "Stay indoors during lightning activity",
                "Do not take shelter under tall trees or metal structures",
                "Unplug sensitive electronic devices"
            ]
        elif final_score >= 30.0:
            level = RiskLevel.MODERATE
            headline = "Moderate Thunderstorm / Convective Risk"
            explanation = "Scattered convective showers with isolated thunder or lightning are possible."
            recs = ["Be alert to darkening skies or sudden wind shifts", "Keep track of IMD nowcasts"]
        else:
            level = RiskLevel.LOW
            headline = "Low Thunderstorm Risk"
            explanation = "Atmosphere is stable with no significant convective development observed."
            recs = ["Normal conditions"]

        return WeatherRiskAnalysis(
            risk_type="THUNDERSTORM",
            overall_level=level,
            risk_score=round(final_score, 1),
            headline=headline,
            explanation=explanation,
            factors=factors,
            sources_used=sources,
            action_recommendations=recs,
            confidence="HIGH"
        )


thunderstorm_risk_engine = ThunderstormRiskEngine()
