import re
from typing import Optional, Dict, Any, List
from app.schemas.chat import QueryIntent, StructuredIntent
from app.providers.geo.resolver import INDIAN_LOCATIONS
from app.localization.language_framework import language_detector

INTENT_PATTERNS = {
    QueryIntent.CYCLONE: [
        r"cyclone", r"tropical storm", r"depression", r"landfall", r"remal", r"biparjoy", r"amphan", r"tauktae",
        r"चक्रवात", r"तूफान", r"ঘূর্ণিঝড়", r"తుఫాను", r"चक्रीवादळ", r"புயல்", r"વાવાઝોડું", r"سمندری طوفان"
    ],
    QueryIntent.NEARBY_EVENT: [
        r"nearby", r"near me", r"proximity", r"surrounding", r"any storm near", r"dangerous weather near",
        r"आसपास", r"नजदीक", r"কাছাকাছি", r"దగ్గర", r"जवळ", r"அருகில்"
    ],
    QueryIntent.AGRICULTURE_ADVISORY: [
        r"irrigation", r"crop", r"spray", r"pesticide", r"fertilizer", r"harvest", r"kisan", r"farming", r"fasal", r"sinchai",
        r"सिंचाई", r"फसल", r"छिड़काव", r"गेहूं", r"धान", r"कृषि", r"किसान", r"সেচ", r"రైతు", r"పంట"
    ],
    QueryIntent.MODEL_COMPARISON: [
        r"compare", r"gfs", r"wrf", r"ecmwf", r"models", r"agreement", r"ensemble", r"nwp", r"forecast comparison",
        r"मॉडल तुलना", r"सहमति", r"তুলনা"
    ],
    QueryIntent.CLIMATE_ANALYSIS: [
        r"climate", r"trend", r"historical", r"past \d+ years", r"decade", r"anomaly", r"last 10 years", r"last 20 years", r"august rainfall",
        r"जलवायु", r"इतिहास", r"पुराना", r"रुझान", r"दशक", r"জলবায়ু"
    ],
    QueryIntent.WARNING: [
        r"warning", r"alert", r"red alert", r"orange alert", r"yellow watch", r"storm warning",
        r"चेतावनी", r"अलर्ट", r"रेड अलर्ट", r"ऑरेंज अलर्ट", r"সতর্কবার্তা", r"హెచ్చరిక"
    ],
    QueryIntent.WEATHER_RISK: [
        r"risk", r"hazard", r"safe to", r"flood risk", r"heatwave", r"thunderstorm risk", r"danger",
        r"खतरा", r"जोखिम", r"लू", r"तूफान", r"ঝুঁকি", r"ప్రమాదం"
    ],
    QueryIntent.RAINFALL: [
        r"rain", r"rainfall", r"precipitation", r"shower", r"baarish", r"barish", r"monsoon", r"downpour",
        r"बारिश", r"वर्षा", r"मानसून", r"बूंदाबांदी", r"বৃষ্টি", r"వర్షం", r"पाऊस", r"மழை"
    ],
    QueryIntent.FORECAST: [
        r"tomorrow", r"forecast", r"next week", r"kal", r"shaam", r"evening", r"weekend", r"7 days", r"aane wale",
        r"कल", r"पूर्वानुमान", r"शाम", r"अगले", r"भविष्य", r"কাল", r"రేపు", r"நாளை"
    ],
    QueryIntent.CURRENT_WEATHER: [
        r"current", r"today", r"right now", r"live", r"temperature", r"humidity", r"now", r"aaj", r"mausam",
        r"आज", r"मौसम", r"तापमान", r"वर्तमान", r"अभी", r"আজ", r"ఈ రోజు", r"இன்று"
    ]
}

TEMPORAL_PATTERNS = {
    "tomorrow evening": [r"tomorrow evening", r"kal shaam", r"कल शाम", r"kal sham", r"কাল সন্ধ্যা", r"రేపు సాయంత్రం"],
    "tomorrow": [r"tomorrow", r"kal", r"कल", r"next day", r"কাল", r"రేపు", r"நாளை"],
    "today evening": [r"today evening", r"aaj shaam", r"आज शाम", r"আজ সন্ধ্যা"],
    "today": [r"today", r"aaj", r"आज", r"now", r"right now", r"अभी", r"আজ", r"ఈ రోజు"],
    "next 7 days": [r"7 days", r"next week", r"hafte", r"अगले 7 दिन", r"अगले सप्ताह", r"পরবর্তী ৭ দিন"]
}

CROP_KEYWORDS = {
    "wheat": ["wheat", "gehun", "gehu", "गेहूं", "गेंहू", "গম", "గోధుమలు"],
    "rice": ["rice", "paddy", "dhan", "चावल", "धान", "ধান", "వరి"],
    "cotton": ["cotton", "kapas", "कपास", "তুলা", "పత్తి"],
    "mustard": ["mustard", "sarson", "सरसों", "সরিষা", "ఆవాలు"],
    "tomato": ["tomato", "tamatar", "टमाटर", "টমেটো", "టమాటా"]
}


class IntentParser:
    """Extracts language-neutral structured intent, location, time window, and domain slots."""

    @staticmethod
    def parse_query(
        query: str,
        previous_intent: Optional[StructuredIntent] = None,
        default_location: str = "Delhi"
    ) -> StructuredIntent:
        q_lower = query.lower()
        
        # 1. Automatic Language Detection
        detected_lang = language_detector.detect_language(query)

        # 2. Extract Location
        detected_loc = None
        for key, loc in INDIAN_LOCATIONS.items():
            if key in q_lower or loc["district"].lower() in q_lower or loc["name"].lower() in q_lower:
                detected_loc = loc["name"]
                break

        # Multilingual City Name Mapping
        regional_cities = {
            "दिल्ली": "Delhi", "দিল্লি": "Delhi", "ఢిల్లీ": "Delhi", "தில்லி": "Delhi", "دہلی": "Delhi",
            "मुंबई": "Mumbai", "মুম্বাই": "Mumbai", "ముంబై": "Mumbai", "மும்பை": "Mumbai", "ممبئی": "Mumbai",
            "बेंगलुरु": "Bengaluru", "बैंगलोर": "Bengaluru", "বেঙ্গালুরু": "Bengaluru", "బెంగళూరు": "Bengaluru",
            "चेन्नई": "Chennai", "চেন্নাই": "Chennai", "చెన్నై": "Chennai", "சென்னை": "Chennai",
            "कोलकाता": "Kolkata", "কলকাতা": "Kolkata", "కోల్‌కతా": "Kolkata",
            "जयपुर": "Jaipur", "जयपूर": "Jaipur", "জয়পুর": "Jaipur",
            "शिमला": "Shimla", "শিমলা": "Shimla",
            "पटना": "Patna", "পাটনা": "Patna",
            "हैदराबाद": "Hyderabad", "హైదరాబాద్": "Hyderabad",
            "पुणे": "Pune", "পুনে": "Pune",
            "लखनऊ": "Lucknow", "লখনউ": "Lucknow",
            "लुधियाना": "Ludhiana", "লুধিয়ানা": "Ludhiana"
        }
        for r_name, en_name in regional_cities.items():
            if r_name in query:
                detected_loc = en_name
                break

        # Follow-up context resolution
        is_follow_up = False
        if not detected_loc:
            if previous_intent and previous_intent.location:
                detected_loc = previous_intent.location
                is_follow_up = True
            else:
                detected_loc = default_location

        # 3. Extract Temporal Window
        detected_time = None
        for time_label, patterns in TEMPORAL_PATTERNS.items():
            for p in patterns:
                if re.search(p, q_lower):
                    detected_time = time_label
                    break
            if detected_time:
                break

        if not detected_time:
            if is_follow_up and previous_intent and previous_intent.target_date_or_time:
                detected_time = previous_intent.target_date_or_time
            else:
                detected_time = "today"

        # 4. Extract Crop
        detected_crop = None
        for crop_name, aliases in CROP_KEYWORDS.items():
            for alias in aliases:
                if alias in q_lower:
                    detected_crop = crop_name
                    break
            if detected_crop:
                break

        # 5. Extract Intent
        detected_intent = QueryIntent.GENERAL_WEATHER
        for intent_enum, patterns in INTENT_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, q_lower):
                    detected_intent = intent_enum
                    break
            if detected_intent != QueryIntent.GENERAL_WEATHER:
                break

        if detected_intent == QueryIntent.GENERAL_WEATHER:
            if any(w in q_lower for w in ["rain", "baarish", "barish", "বৃষ্টি", "వర్షం", "पाऊस"]):
                detected_intent = QueryIntent.RAINFALL
            elif any(w in q_lower for w in ["tomorrow", "kal", "कल", "কাল", "రేపు"]):
                detected_intent = QueryIntent.FORECAST
            else:
                detected_intent = QueryIntent.CURRENT_WEATHER

        return StructuredIntent(
            intent=detected_intent,
            location=detected_loc,
            target_date_or_time=detected_time,
            parameters=["temperature", "rainfall", "humidity", "wind", "warnings"],
            crop_name=detected_crop or "wheat",
            language=detected_lang,
            is_follow_up=is_follow_up,
            confidence=0.98
        )


intent_parser = IntentParser()
