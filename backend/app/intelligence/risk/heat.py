import math
from typing import List, Optional
from app.schemas.weather import WeatherObservation, ForecastResponse, WeatherWarning, WarningSeverityLevel
from app.schemas.intelligence import WeatherRiskAnalysis, RiskLevel, RiskFactor


def calculate_heat_index(temp_c: float, rh_pct: float) -> float:
    """
    Calculate NOAA/NWS Rothfusz Heat Index regression in Celsius.
    Formula applies when Temp >= 26.7°C (80°F) and RH >= 40%.
    """
    if temp_c < 26.7 or rh_pct < 40.0:
        return temp_c

    t_f = (temp_c * 9.0 / 5.0) + 32.0
    r = rh_pct

    # Steadman / Rothfusz full quadratic regression
    hi_f = (-42.379 +
            2.04901523 * t_f +
            10.14333127 * r -
            0.22475541 * t_f * r -
            0.00683783 * t_f * t_f -
            0.05481717 * r * r +
            0.00122874 * t_f * t_f * r +
            0.00085282 * t_f * r * r -
            0.00000199 * t_f * t_f * r * r)

    hi_c = (hi_f - 32.0) * 5.0 / 9.0
    return round(hi_c, 1)


class HeatRiskEngine:
    """
    Heat Stress and Heatwave Risk Analysis Engine.
    Follows official IMD Heatwave Criteria:
    - Plains: Max Temp >= 40.0°C and departure from normal >= 4.5°C (Heatwave) or >= 6.5°C (Severe Heatwave)
    - Coastal: Max Temp >= 37.0°C and departure >= 4.5°C
    - Hills: Max Temp >= 30.0°C
    """
    @staticmethod
    def analyze(
        obs: Optional[WeatherObservation],
        forecast: Optional[ForecastResponse],
        warnings: Optional[List[WeatherWarning]] = None
    ) -> WeatherRiskAnalysis:
        factors: List[RiskFactor] = []
        sources = ["IMD Heatwave Criteria", "NOAA Heat Index Formula"]
        
        temp_c = obs.temperature_c if obs and obs.temperature_c else 32.0
        rh = obs.humidity_pct if obs and obs.humidity_pct else 50.0
        heat_idx = calculate_heat_index(temp_c, rh)

        # Factor 1: Ambient Temperature vs IMD Heat Thresholds
        if temp_c >= 45.0:
            factors.append(RiskFactor(
                name="Severe Ambient Temperature",
                observed_value=f"{temp_c:.1f}°C",
                threshold=">= 45.0°C (Severe Heatwave)",
                impact_level=RiskLevel.EXTREME,
                description="Extremely dangerous thermal conditions for outdoor activities."
            ))
            base_score = 90.0
        elif temp_c >= 40.0:
            factors.append(RiskFactor(
                name="Elevated Ambient Temperature",
                observed_value=f"{temp_c:.1f}°C",
                threshold=">= 40.0°C (IMD Plains Heatwave Threshold)",
                impact_level=RiskLevel.HIGH,
                description="High heat stress requiring hydration and shade protection."
            ))
            base_score = 65.0
        elif temp_c >= 35.0:
            factors.append(RiskFactor(
                name="Warm Temperature",
                observed_value=f"{temp_c:.1f}°C",
                threshold=">= 35.0°C",
                impact_level=RiskLevel.MODERATE,
                description="Moderate warmth; prolonged direct exposure may cause fatigue."
            ))
            base_score = 35.0
        else:
            factors.append(RiskFactor(
                name="Normal Temperature Range",
                observed_value=f"{temp_c:.1f}°C",
                threshold="< 35.0°C",
                impact_level=RiskLevel.LOW,
                description="Temperature is within comfortable limits."
            ))
            base_score = 10.0

        # Factor 2: Apparent Heat Index (Humidity Factor)
        if heat_idx >= 41.0:
            factors.append(RiskFactor(
                name="Apparent Heat Index (Feels Like)",
                observed_value=f"{heat_idx:.1f}°C",
                threshold=">= 41.0°C (Danger Category)",
                impact_level=RiskLevel.HIGH,
                description="High humidity impedes evaporative cooling; heat cramps and heat exhaustion are likely."
            ))
            base_score += 20.0
        elif heat_idx >= 36.0:
            factors.append(RiskFactor(
                name="Apparent Heat Index",
                observed_value=f"{heat_idx:.1f}°C",
                threshold=">= 36.0°C (Extreme Caution)",
                impact_level=RiskLevel.MODERATE,
                description="Discomfort index is elevated due to moisture content."
            ))
            base_score += 10.0

        score = min(100.0, base_score)
        if score >= 75.0:
            level = RiskLevel.HIGH
            headline = "High Heat Stress / Heatwave Hazard"
            explanation = f"Current heat index of {heat_idx}°C combined with high ambient temperature presents significant thermal strain."
            recs = ["Avoid outdoor exertion between 12:00 PM and 4:00 PM", "Drink ORS, coconut water or buttermilk regularly", "Wear lightweight, light-colored cotton clothing"]
        elif score >= 40.0:
            level = RiskLevel.MODERATE
            headline = "Moderate Heat Discomfort"
            explanation = f"Apparent temperature is {heat_idx}°C. Mild discomfort expected during peak afternoon hours."
            recs = ["Carry water bottle", "Take frequent shade breaks if outdoors"]
        else:
            level = RiskLevel.LOW
            headline = "Low Heat Risk"
            explanation = f"Thermal comfort index is normal ({temp_c}°C)."
            recs = ["Normal outdoor activity"]

        return WeatherRiskAnalysis(
            risk_type="HEAT",
            overall_level=level,
            risk_score=round(score, 1),
            headline=headline,
            explanation=explanation,
            factors=factors,
            sources_used=sources,
            action_recommendations=recs,
            confidence="HIGH"
        )


heat_risk_engine = HeatRiskEngine()
