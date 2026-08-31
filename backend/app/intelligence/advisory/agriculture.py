from typing import Optional, List, Dict, Any
from app.schemas.weather import LocationInfo, WeatherObservation, ForecastResponse, WeatherWarning
from app.schemas.intelligence import AgricultureAdvisory, CropStage


# Comprehensive agromet guidelines mapped to Indian Kharif & Rabi staples
CROP_WEATHER_RULES: Dict[str, Dict[str, Any]] = {
    "wheat": {
        "name_hi": "गेहूं",
        "sowing_temp_opt": (18.0, 24.0),
        "irrigation_sensitive_stages": [CropStage.SOWING, CropStage.VEGETATIVE, CropStage.FLOWERING, CropStage.GRAIN_FILLING],
        "disease_drivers_en": "High humidity (>80%) + warm days causes Yellow Rust / Karnal Bunt vulnerability.",
        "disease_drivers_hi": "उच्च आर्द्रता (>80%) और गर्म मौसम से पीला रतुआ (Yellow Rust) और करनाल बंट का खतरा बढ़ जाता है।",
        "spraying_wind_max": 15.0  # km/h
    },
    "rice": {
        "name_hi": "धान / चावल",
        "sowing_temp_opt": (25.0, 35.0),
        "irrigation_sensitive_stages": [CropStage.SOWING, CropStage.VEGETATIVE, CropStage.FLOWERING],
        "disease_drivers_en": "Continuous cloudy spells with RH >85% fosters Bacterial Leaf Blight and Sheath Rot.",
        "disease_drivers_hi": "लगातार बादल और 85% से अधिक नमी से जीवाणु पत्ती झुलसा और शीथ रॉट का प्रकोप फैलता है।",
        "spraying_wind_max": 18.0
    },
    "cotton": {
        "name_hi": "कपास",
        "sowing_temp_opt": (28.0, 38.0),
        "irrigation_sensitive_stages": [CropStage.FLOWERING, CropStage.GRAIN_FILLING],
        "disease_drivers_en": "Cloudy humid weather encourages Pink Bollworm and Whitefly infestation.",
        "disease_drivers_hi": "बादल और उमस भरा मौसम गुलाबी सुंडी (Pink Bollworm) और सफेद मक्खी के प्रकोप को बढ़ावा देता है।",
        "spraying_wind_max": 12.0
    },
    "mustard": {
        "name_hi": "सरसों",
        "sowing_temp_opt": (15.0, 25.0),
        "irrigation_sensitive_stages": [CropStage.VEGETATIVE, CropStage.FLOWERING],
        "disease_drivers_en": "Overcast weather and sudden rain surge aphid attacks and Alternaria blight.",
        "disease_drivers_hi": "बादल छाए रहने और अचानक बारिश से माहू/चेपा (Aphids) और अल्टरनेरिया ब्लाइट का खतरा बढ़ता है।",
        "spraying_wind_max": 14.0
    },
    "tomato": {
        "name_hi": "टमाटर",
        "sowing_temp_opt": (20.0, 30.0),
        "irrigation_sensitive_stages": [CropStage.VEGETATIVE, CropStage.FLOWERING, CropStage.GRAIN_FILLING],
        "disease_drivers_en": "Excess soil moisture combined with humidity causes Early Blight and Fruit Rot.",
        "disease_drivers_hi": "मिट्टी में अत्यधिक नमी और उच्च आर्द्रता से अगेती झुलसा (Early Blight) और फल सड़न रोग होता है।",
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
        warnings: Optional[List[WeatherWarning]] = None,
        language: str = "en"
    ) -> AgricultureAdvisory:
        clean_crop = crop_name.lower().strip()
        crop_rules = CROP_WEATHER_RULES.get(clean_crop, CROP_WEATHER_RULES["wheat"])
        is_hi = (language == "hi")

        next_day = forecast.daily_forecasts[0] if (forecast and forecast.daily_forecasts) else None
        rain_prob = next_day.precipitation_prob_pct if next_day else 0.0
        rain_mm = next_day.precipitation_amount_mm if next_day else 0.0
        wind_speed = (obs.wind_speed_kmh or 12.0) if obs else 12.0
        humidity = (obs.humidity_pct or 65.0) if obs else 65.0

        crop_display = crop_rules.get("name_hi", clean_crop.title()) if is_hi else clean_crop.title()
        drivers = []

        # 1. Irrigation Decision Logic
        if rain_prob >= 60.0 or rain_mm >= 15.0:
            irrigation_action = "रोकें (STOP)" if is_hi else "STOP"
            if is_hi:
                irrigation_advice = f"{crop_display} के लिए सिंचाई तुरंत स्थगित करें। आगामी 24 घंटों में भारी वर्षा ({rain_prob:.0f}% संभावना, ~{rain_mm:.1f} मिमी) से मिट्टी में पर्याप्त नमी रहेगी और जलभराव से जड़ें सड़ने से बचेंगी।"
                drivers.append(f"अनुमानित वर्षा: {rain_mm:.1f} मिमी ({rain_prob:.0f}% संभावना)")
            else:
                irrigation_advice = f"Postpone irrigation for {clean_crop.title()}. High precipitation likelihood ({rain_prob:.0f}% chance, ~{rain_mm:.1f} mm) will provide adequate soil moisture and prevent waterlogging root asphyxia."
                drivers.append(f"Expected Rainfall: {rain_mm:.1f} mm ({rain_prob:.0f}% probability)")
        elif rain_prob >= 35.0:
            irrigation_action = "स्थगित करें (DELAY)" if is_hi else "DELAY"
            if is_hi:
                irrigation_advice = f"सिंचाई को 24-36 घंटे के लिए टालें। जिले में हल्की से मध्यम फुहारों की संभावना है।"
                drivers.append(f"मध्यम वर्षा की संभावना: {rain_prob:.0f}%")
            else:
                irrigation_advice = f"Delay irrigation for 24-36 hours. Light to moderate showers expected in the district."
                drivers.append(f"Moderate Rain Chance: {rain_prob:.0f}%")
        else:
            irrigation_action = "सिंचाई करें (PROCEED)" if is_hi else "PROCEED"
            if is_hi:
                irrigation_advice = f"निर्धारित सिंचाई के लिए मौसम अनुकूल है। फसल की जड़ों के क्षेत्र में शुष्क स्थिति बनी हुई है।"
                drivers.append("वर्षा का नगण्य जोखिम (<20%)")
            else:
                irrigation_advice = f"Favorable for scheduled irrigation. Dry conditions prevailing across the root zone."
                drivers.append("Negligible Rain Risk (<20%)")

        # 2. Chemical Spraying Decision Logic
        if rain_prob >= 40.0:
            spraying_action = "रोकें (HOLD)" if is_hi else "HOLD"
            if is_hi:
                spraying_advice = f"आज कीटनाशक, फफूंदनाशक या पर्णीय उर्वरक का छिड़काव बिल्कुल न करें। संभावित बारिश से दवा धुल जाएगी, जिससे रसायनों का नुकसान और व्यर्थ व्यय होगा।"
                drivers.append("वर्षा से दवा धुलने का उच्च जोखिम")
            else:
                spraying_advice = f"Do not spray insecticides, fungicides, or foliar fertilizers today. Imminent rain will wash away agrochemicals, causing chemical runoff and economic loss."
                drivers.append("High Washout Risk from Rain")
        elif wind_speed > crop_rules["spraying_wind_max"]:
            spraying_action = "रोकें (HOLD)" if is_hi else "HOLD"
            if is_hi:
                spraying_advice = f"छिड़काव रोकें। हवा की गति ({wind_speed:.1f} किमी/घंटा) सुरक्षित सीमा ({crop_rules['spraying_wind_max']} किमी/घंटा) से अधिक है, जिससे दवा उड़कर बर्बाद होगी।"
                drivers.append(f"तेज़ हवा से दवा उड़ने का जोखिम ({wind_speed:.1f} किमी/घंटा)")
            else:
                spraying_advice = f"Hold spray operations. Wind speed ({wind_speed:.1f} km/h) exceeds safe threshold ({crop_rules['spraying_wind_max']} km/h), causing chemical drift."
                drivers.append(f"High Wind Drift ({wind_speed:.1f} km/h)")
        else:
            spraying_action = "अनुकूल (FAVORABLE)" if is_hi else "FAVORABLE"
            if is_hi:
                spraying_advice = f"सुबह के समय (प्रातः 7:00 से 10:30 बजे तक) कीटनाशक व पर्णीय छिड़काव के लिए मौसम पूरी तरह शांत और अनुकूल है।"
                drivers.append(f"शांत हवाएँ ({wind_speed:.1f} किमी/घंटा) और साफ मौसम")
            else:
                spraying_advice = f"Weather conditions are calm and favorable for foliar spray applications during morning hours (7:00 AM - 10:30 AM)."
                drivers.append(f"Calm Winds ({wind_speed:.1f} km/h) and Dry Sky")

        # 3. Harvesting & Storage Advice
        if crop_stage in [CropStage.MATURITY, CropStage.POST_HARVEST]:
            if rain_prob >= 40.0:
                harvest_advice = "काटी गई फसल को तुरंत तिरपाल से ढकें। खलिहानों में जल निकासी की उचित व्यवस्था रखें।" if is_hi else "Cover harvested produce with tarpaulin sheets immediately. Ensure proper drainage in threshing yards."
            else:
                harvest_advice = "भंडारण से पहले अनाज की नमी 12% से कम लाने के लिए कटी फसल को धूप में अच्छी तरह सुखाएं।" if is_hi else "Dry harvested produce under sun to bring grain moisture below 12% before storage."
        else:
            harvest_advice = f"फसल {crop_stage.value} अवस्था में है; खेत को खरपतवार मुक्त रखें और नमी की निगरानी करें।" if is_hi else f"Crop is in {crop_stage.value}; maintain weed-free condition and monitor canopy moisture."

        # 4. Disease / Pest Risk
        disease_risk = crop_rules["disease_drivers_hi"] if is_hi else crop_rules["disease_drivers_en"]
        if humidity > 75.0:
            drivers.append(f"उच्च सापेक्ष आर्द्रता ({humidity:.0f}%)" if is_hi else f"Elevated Relative Humidity ({humidity:.0f}%)")

        summary = f"{location.district} में {crop_display} ({crop_stage.value}) के लिए कृषि सलाह: सिंचाई {irrigation_action}, छिड़काव {spraying_action}।" if is_hi else f"Agromet advisory for {clean_crop.title()} ({crop_stage.value}) in {location.district}: Irrigation is advised to {irrigation_action}, Spraying is {spraying_action}."

        return AgricultureAdvisory(
            location=location,
            crop_name=crop_display,
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
