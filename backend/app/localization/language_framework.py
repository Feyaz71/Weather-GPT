import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel


class LanguageMetadata(BaseModel):
    code: str
    name_english: str
    name_native: str
    direction: str = "ltr"  # "ltr" or "rtl"
    script: str


INDIAN_LANGUAGES: Dict[str, LanguageMetadata] = {
    "en": LanguageMetadata(code="en", name_english="English", name_native="English", direction="ltr", script="Latin"),
    "hi": LanguageMetadata(code="hi", name_english="Hindi", name_native="हिन्दी", direction="ltr", script="Devanagari"),
    "bn": LanguageMetadata(code="bn", name_english="Bengali", name_native="বাংলা", direction="ltr", script="Bengali"),
    "te": LanguageMetadata(code="te", name_english="Telugu", name_native="తెలుగు", direction="ltr", script="Telugu"),
    "mr": LanguageMetadata(code="mr", name_english="Marathi", name_native="मराठी", direction="ltr", script="Devanagari"),
    "ta": LanguageMetadata(code="ta", name_english="Tamil", name_native="தமிழ்", direction="ltr", script="Tamil"),
    "gu": LanguageMetadata(code="gu", name_english="Gujarati", name_native="ગુજરાતી", direction="ltr", script="Gujarati"),
    "ur": LanguageMetadata(code="ur", name_english="Urdu", name_native="اردو", direction="rtl", script="Arabic"),
    "kn": LanguageMetadata(code="kn", name_english="Kannada", name_native="ಕನ್ನಡ", direction="ltr", script="Kannada"),
    "ml": LanguageMetadata(code="ml", name_english="Malayalam", name_native="മലയാളം", direction="ltr", script="Malayalam"),
    "pa": LanguageMetadata(code="pa", name_english="Punjabi", name_native="ਪੰਜਾਬੀ", direction="ltr", script="Gurmukhi"),
    "or": LanguageMetadata(code="or", name_english="Odia", name_native="ଓଡ଼ିଆ", direction="ltr", script="Odia"),
    "as": LanguageMetadata(code="as", name_english="Assamese", name_native="অসমীয়া", direction="ltr", script="Bengali")
}

WEATHER_DICTIONARY: Dict[str, Dict[str, str]] = {
    "temperature": {
        "en": "Temperature", "hi": "तापमान", "bn": "তাপমাত্রা", "te": "ఉష్ణోగ్రత", "mr": "तापमान",
        "ta": "வெப்பநிலை", "gu": "તાપમાન", "ur": "درجہ حرارت", "kn": "ತಾಪಮಾನ", "ml": "താപനില",
        "pa": "ਤਾਪਮਾਨ", "or": "ତାପମାତ୍ରା", "as": "তাপমাত্ৰা"
    },
    "rainfall": {
        "en": "Rainfall", "hi": "वर्षा / बारिश", "bn": "বৃষ্টিপাত", "te": "వర్షపాతం", "mr": "पाऊस",
        "ta": "மழைப்பொழிவு", "gu": "વરસાદ", "ur": "بارش", "kn": "ಮಳೆ", "ml": "മഴ",
        "pa": "ਮੀਂਹ", "or": "ବର୍ଷା", "as": "বৰষুণ"
    },
    "warning": {
        "en": "Warning", "hi": "चेतावनी", "bn": "সতর্কবার্তা", "te": "హెచ్చరిక", "mr": "इशारा",
        "ta": "எச்சரிக்கை", "gu": "ચેતવણી", "ur": "وارننگ", "kn": "ಎಚ್ಚರಿಕೆ", "ml": "മുന്നറിയിപ്പ്",
        "pa": "ਚੇਤਾਵਨੀ", "or": "ଚେତାବନୀ", "as": "সতৰ্কবাণী"
    },
    "thunderstorm": {
        "en": "Thunderstorm", "hi": "गरज के साथ तूफान", "bn": "বজ্রবিদ্যুৎ সহ ঝড়", "te": "ఉరుములతో కూడిన తుఫాను", "mr": "वादळी पाऊस",
        "ta": "இடியுடன் கூடிய மழை", "gu": "ગાજવીજ સાથે વાવાઝોડું", "ur": "گرج چمک کے ساتھ طوفان", "kn": "ಗುಡುಗು ಸಹಿತ ಮಳೆ", "ml": "ഇടിമിന്നലോടുകൂടിയ മഴ",
        "pa": "ਗਰਜ ਨਾਲ ਤੂਫਾਨ", "or": "ଘଡ଼ଘଡ଼ି ସହ ବର୍ଷା", "as": "বজ্ৰপাতসহ ধুমুহা"
    },
    "cyclone": {
        "en": "Tropical Cyclone", "hi": "चक्रवात", "bn": "ঘূর্ণিঝড়", "te": "తుఫాను", "mr": "चक्रीवादळ",
        "ta": "புயல்", "gu": "વાવાઝોડું", "ur": "سمندری طوفان", "kn": "ಚಂಡಮಾರುತ", "ml": "ചുഴലിക്കാറ്റ്",
        "pa": "ਚੱਕਰਵਾਤ", "or": "ବାତ୍ୟା", "as": "ঘূৰ্ণিবতাহ"
    }
}


class LanguageDetector:
    @staticmethod
    def detect_language(text: str) -> str:
        """Detect language based on Unicode script ranges and regional lexicon."""
        # Urdu / Arabic Script
        if re.search(r'[\u0600-\u06FF]', text):
            return "ur"
        # Devanagari (Hindi / Marathi)
        elif re.search(r'[\u0900-\u097F]', text):
            if any(w in text for w in ["आहे", "होईल", "पाऊस", "कसा", "पुणे"]):
                return "mr"
            return "hi"
        # Bengali / Assamese
        elif re.search(r'[\u0980-\u09FF]', text):
            # Unique Assamese characters Ra (ৰ: \u09F0) and Wa (ৱ: \u09F1) or Assamese vocabulary
            if re.search(r'[\u09F0\u09F1]', text) or any(w in text for w in ["বৰষুণ", "অসম", "গুৱাহাটী"]):
                return "as"
            return "bn"
        # Tamil
        elif re.search(r'[\u0B80-\u0BFF]', text):
            return "ta"
        # Telugu
        elif re.search(r'[\u0C00-\u0C7F]', text):
            return "te"
        # Kannada
        elif re.search(r'[\u0C80-\u0CFF]', text):
            return "kn"
        # Malayalam
        elif re.search(r'[\u0D00-\u0D7F]', text):
            return "ml"
        # Gujarati
        elif re.search(r'[\u0A80-\u0AFF]', text):
            return "gu"
        # Gurmukhi (Punjabi)
        elif re.search(r'[\u0A00-\u0A7F]', text):
            return "pa"
        # Odia
        elif re.search(r'[\u0B00-\u0B7F]', text):
            return "or"
        
        # Hinglish / Romanized Hindi keywords
        t_low = text.lower()
        if any(w in t_low for w in ["kya", "hogi", "baarish", "mausam", "kaisa", "batayein", "kal", "aaj"]):
            return "hi"

        return "en"


class LocaleService:
    @staticmethod
    def get_supported_languages() -> List[LanguageMetadata]:
        return list(INDIAN_LANGUAGES.values())

    @staticmethod
    def get_language_metadata(code: str) -> LanguageMetadata:
        return INDIAN_LANGUAGES.get(code, INDIAN_LANGUAGES["en"])

    @staticmethod
    def get_term(term_key: str, lang_code: str) -> str:
        dict_entry = WEATHER_DICTIONARY.get(term_key, {})
        return dict_entry.get(lang_code, dict_entry.get("en", term_key))


language_detector = LanguageDetector()
locale_service = LocaleService()
