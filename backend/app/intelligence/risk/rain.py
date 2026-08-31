from typing import List, Optional
from app.schemas.weather import WeatherObservation, ForecastResponse, WeatherWarning, WarningSeverityLevel
from app.schemas.intelligence import WeatherRiskAnalysis, RiskLevel, RiskFactor


class RainRiskEngine:
    """
    Deterministic Rainfall & Precipitation Risk Evaluation Engine.
    Standardized according to official IMD Rainfall Classification:
    - Very Light Rain: 0.1 to 2.4 mm
    - Light Rain: 2.5 to 15.5 mm
    - Moderate Rain: 15.6 to 64.4 mm
    - Heavy Rain: 64.5 to 115.5 mm
    - Very Heavy Rain: 115.6 to 204.4 mm
    - Extremely Heavy Rain: >= 204.5 mm
    """
    @staticmethod
    def analyze(
        obs: Optional[WeatherObservation],
        forecast: Optional[ForecastResponse],
        warnings: Optional[List[WeatherWarning]] = None
    ) -> WeatherRiskAnalysis:
        factors: List[RiskFactor] = []
        sources = ["IMD Rainfall Classification System"]
        total_score = 0.0

        # Factor 1: Current 24h Rainfall / 1h intensity
        recent_rain = (obs.rainfall_24h_mm or 0.0) if obs else 0.0
        if recent_rain >= 64.5:
            factors.append(RiskFactor(
                name="Antecedent 24h Precipitation",
                observed_value=f"{recent_rain:.1f} mm (Heavy)",
                threshold=">= 64.5 mm",
                impact_level=RiskLevel.HIGH,
                description="High soil saturation and active surface runoff increase localized waterlogging risk."
            ))
            total_score += 35.0
        elif recent_rain >= 15.6:
            factors.append(RiskFactor(
                name="Antecedent 24h Precipitation",
                observed_value=f"{recent_rain:.1f} mm (Moderate)",
                threshold=">= 15.6 mm",
                impact_level=RiskLevel.MODERATE,
                description="Moderate rainfall recorded over the past 24 hours."
            ))
            total_score += 20.0
        else:
            factors.append(RiskFactor(
                name="Antecedent 24h Precipitation",
                observed_value=f"{recent_rain:.1f} mm",
                threshold="< 15.6 mm",
                impact_level=RiskLevel.LOW,
                description="Low to negligible recent precipitation."
            ))
            total_score += 5.0

        # Factor 2: Forecast Precipitation Probability & Amount
        next_day = forecast.daily_forecasts[0] if (forecast and forecast.daily_forecasts) else None
        rain_prob = next_day.precipitation_prob_pct if next_day else 0.0
        rain_amt = next_day.precipitation_amount_mm if next_day else 0.0

        if rain_prob >= 75.0 or rain_amt >= 64.5:
            factors.append(RiskFactor(
                name="Short-Range Forecast Probability",
                observed_value=f"{rain_prob:.0f}% chance, ~{rain_amt:.1f} mm expected",
                threshold="Probability >= 75% or Amount >= 64.5 mm",
                impact_level=RiskLevel.HIGH,
                description="High likelihood of significant rain spells during the forecast window."
            ))
            total_score += 40.0
        elif rain_prob >= 40.0 or rain_amt >= 15.6:
            factors.append(RiskFactor(
                name="Short-Range Forecast Probability",
                observed_value=f"{rain_prob:.0f}% chance, ~{rain_amt:.1f} mm expected",
                threshold="Probability >= 40%",
                impact_level=RiskLevel.MODERATE,
                description="Moderate chance of scattered passing rain or showers."
            ))
            total_score += 25.0
        else:
            factors.append(RiskFactor(
                name="Short-Range Forecast Probability",
                observed_value=f"{rain_prob:.0f}%",
                threshold="Probability < 40%",
                impact_level=RiskLevel.LOW,
                description="Low likelihood of rain events."
            ))
            total_score += 5.0

        # Factor 3: Official Active Warnings
        active_warning = False
        if warnings:
            for w in warnings:
                if w.category in ["HEAVY_RAIN", "THUNDERSTORM", "CYCLONE"]:
                    sources.append(w.source)
                    if w.severity == WarningSeverityLevel.RED:
                        total_score += 30.0
                        factors.append(RiskFactor(
                            name="Official Meteorological Warning",
                            observed_value="RED ALERT (Take Action)",
                            threshold="IMD Red Warning Level",
                            impact_level=RiskLevel.EXTREME,
                            description=w.title
                        ))
                    elif w.severity == WarningSeverityLevel.ORANGE:
                        total_score += 20.0
                        factors.append(RiskFactor(
                            name="Official Meteorological Warning",
                            observed_value="ORANGE ALERT (Be Prepared)",
                            threshold="IMD Orange Warning Level",
                            impact_level=RiskLevel.HIGH,
                            description=w.title
                        ))
                    elif w.severity == WarningSeverityLevel.YELLOW:
                        total_score += 10.0
                        factors.append(RiskFactor(
                            name="Official Meteorological Warning",
                            observed_value="YELLOW WATCH (Be Updated)",
                            threshold="IMD Yellow Watch Level",
                            impact_level=RiskLevel.MODERATE,
                            description=w.title
                        ))
                    active_warning = True

        score = min(100.0, total_score)
        if score >= 75.0:
            level = RiskLevel.HIGH
            headline = "High Rainfall & Waterlogging Risk"
            explanation = "Atmospheric conditions and official meteorological alerts indicate high likelihood of heavy precipitation with potential road inundation and drainage bottlenecks."
            recs = ["Carry waterproof gear", "Avoid low-lying underpasses", "Plan travel ahead of peak evening spells"]
        elif score >= 45.0:
            level = RiskLevel.MODERATE
            headline = "Moderate Rain / Shower Probability"
            explanation = "Scattered rain showers or light thunderstorms are likely in the forecast window."
            recs = ["Keep an umbrella handy", "Check live radar updates before outdoor events"]
        else:
            level = RiskLevel.LOW
            headline = "Low Rain Risk"
            explanation = "Atmospheric stability and numerical models indicate minimal to dry conditions."
            recs = ["No rain disruptions anticipated"]

        return WeatherRiskAnalysis(
            risk_type="RAIN",
            overall_level=level,
            risk_score=round(score, 1),
            headline=headline,
            explanation=explanation,
            factors=factors,
            sources_used=sources,
            action_recommendations=recs,
            confidence="HIGH"
        )


rain_risk_engine = RainRiskEngine()
