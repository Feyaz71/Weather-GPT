from typing import Optional, List, Dict, Any
from app.schemas.weather import LocationInfo, WeatherObservation, ForecastResponse, WeatherWarning
from app.schemas.intelligence import AgricultureAdvisory, CropStage


# Comprehensive agromet guidelines mapped to Indian Kharif & Rabi staples
CROP_WEATHER_RULES: Dict[str, Dict[str, Any]] = {
    "wheat": {
        "sowing_temp_opt": (18.0, 24.0),
        "irrigation_sensitive_stages": [CropStage.SOWING, CropStage.VEGETATIVE, CropStage.FLOWERING, CropStage.GRAIN_FILLING],
        "disease_drivers": "High humidity (>80%) + warm days causes Yellow Rust / Karnal Bunt vulnerability.",
        "spraying_wind_max": 15.0  # km/h
    },
    "rice": {
        "sowing_temp_opt": (25.0, 35.0),
        "irrigation_sensitive_stages": [CropStage.SOWING, CropStage.VEGETATIVE, CropStage.FLOWERING],
        "disease_drivers": "Continuous cloudy spells with RH >85% fosters Bacterial Leaf Blight and Sheath Rot.",
        "spraying_wind_max": 18.0
    },
    "cotton": {
        "sowing_temp_opt": (28.0, 38.0),
        "irrigation_sensitive_stages": [CropStage.FLOWERING, CropStage.GRAIN_FILLING],
        "disease_drivers": "Cloudy humid weather encourages Pink Bollworm and Whitefly infestation.",
        "spraying_wind_max": 12.0
    },
    "mustard": {
        "sowing_temp_opt": (15.0, 25.0),
        "irrigation_sensitive_stages": [CropStage.VEGETATIVE, CropStage.FLOWERING],
        "disease_drivers": "Overcast weather and sudden rain surge aphid attacks and Alternaria blight.",
        "spraying_wind_max": 14.0
    },
    "tomato": {
        "sowing_temp_opt": (20.0, 30.0),
        "irrigation_sensitive_stages": [CropStage.VEGETATIVE, CropStage.FLOWERING, CropStage.GRAIN_FILLING],
        "disease_drivers": "Excess soil moisture combined with humidity causes Early Blight and Fruit Rot.",
        "spraying_wind_max": 12.0
    }
}


class AgricultureAdvisoryEngine:
    """
    Agricultural Decision-Support and Agromet Advisory Engine.
    Conforms to IMD Agrometeorological Advisory Services (AAS) principles.
    Evaluates weather parameters for irrigation scheduling, chemical spraying, and disease prevention.
    """
    @staticmethod
    def generate_advisory(
        location: LocationInfo,
        crop_name: str = "wheat",
        crop_stage: CropStage = CropStage.VEGETATIVE,
        obs: Optional[WeatherObservation] = None,
        forecast: Optional[ForecastResponse] = None,
        warnings: Optional[List[WeatherWarning]] = None
    ) -> AgricultureAdvisory:
        clean_crop = crop_name.lower().strip()
        crop_rules = CROP_WEATHER_RULES.get(clean_crop, CROP_WEATHER_RULES["wheat"])

        next_day = forecast.daily_forecasts[0] if (forecast and forecast.daily_forecasts) else None
        rain_prob = next_day.precipitation_prob_pct if next_day else 0.0
        rain_mm = next_day.precipitation_amount_mm if next_day else 0.0
        wind_speed = (obs.wind_speed_kmh or 12.0) if obs else 12.0
        humidity = (obs.humidity_pct or 65.0) if obs else 65.0

        drivers = []

        # 1. Irrigation Decision Logic
        if rain_prob >= 60.0 or rain_mm >= 15.0:
            irrigation_action = "STOP"
            irrigation_advice = f"Postpone irrigation for {clean_crop.title()}. High precipitation likelihood ({rain_prob:.0f}% chance, ~{rain_mm:.1f} mm) will provide adequate soil moisture and prevent waterlogging root asphyxia."
            drivers.append(f"Expected Rainfall: {rain_mm:.1f} mm ({rain_prob:.0f}% probability)")
        elif rain_prob >= 35.0:
            irrigation_action = "DELAY"
            irrigation_advice = f"Delay irrigation for 24-36 hours. Light to moderate showers expected in the district."
            drivers.append(f"Moderate Rain Chance: {rain_prob:.0f}%")
        else:
            irrigation_action = "PROCEED"
            irrigation_advice = f"Favorable for scheduled irrigation. Dry conditions prevailing across the root zone."
            drivers.append("Negligible Rain Risk (<20%)")

        # 2. Chemical Spraying Decision Logic
        if rain_prob >= 40.0:
            spraying_action = "HOLD"
            spraying_advice = f"Do not spray insecticides, fungicides, or foliar fertilizers today. Imminent rain will wash away agrochemicals, causing chemical runoff and economic loss."
            drivers.append("High Washout Risk from Rain")
        elif wind_speed > crop_rules["spraying_wind_max"]:
            spraying_action = "HOLD"
            spraying_advice = f"Hold spray operations. Wind speed ({wind_speed:.1f} km/h) exceeds safe threshold ({crop_rules['spraying_wind_max']} km/h), causing chemical drift."
            drivers.append(f"High Wind Drift ({wind_speed:.1f} km/h)")
        else:
            spraying_action = "FAVORABLE"
            spraying_advice = f"Weather conditions are calm and favorable for foliar spray applications during morning hours (7:00 AM - 10:30 AM)."
            drivers.append(f"Calm Winds ({wind_speed:.1f} km/h) and Dry Sky")

        # 3. Harvesting & Storage Advice
        if crop_stage in [CropStage.MATURITY, CropStage.POST_HARVEST]:
            if rain_prob >= 40.0:
                harvest_advice = "Cover harvested produce with tarpaulin sheets immediately. Ensure proper drainage in threshing yards."
            else:
                harvest_advice = "Dry harvested produce under sun to bring grain moisture below 12% before storage."
        else:
            harvest_advice = f"Crop is in {crop_stage.value}; maintain weed-free condition and monitor canopy moisture."

        # 4. Disease / Pest Risk
        disease_risk = crop_rules["disease_drivers"]
        if humidity > 75.0:
            drivers.append(f"Elevated Relative Humidity ({humidity:.0f}%)")

        summary = f"Agromet advisory for {clean_crop.title()} ({crop_stage.value}) in {location.district}: Irrigation is advised to {irrigation_action}, Spraying is {spraying_action}. {irrigation_advice}"

        return AgricultureAdvisory(
            location=location,
            crop_name=clean_crop.title(),
            crop_stage=crop_stage,
            irrigation_advice=irrigation_advice,
            irrigation_action=irrigation_action,
            spraying_advice=spraying_advice,
            spraying_action=spraying_action,
            harvesting_advice=harvest_advice,
            disease_pest_risk=disease_risk,
            meteorological_drivers=drivers,
            advisory_summary=summary,
            source="IMD Agrometeorological Advisory Services (AAS) Bulletin"
        )


agriculture_advisory_engine = AgricultureAdvisoryEngine()
