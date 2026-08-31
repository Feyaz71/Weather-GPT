import pytest
from app.localization.language_framework import language_detector, locale_service, INDIAN_LANGUAGES
from app.ai.intent_parser import intent_parser
from app.schemas.chat import QueryIntent


def test_13_languages_registered():
    assert len(INDIAN_LANGUAGES) == 13
    assert "hi" in INDIAN_LANGUAGES
    assert "bn" in INDIAN_LANGUAGES
    assert "ta" in INDIAN_LANGUAGES
    assert "te" in INDIAN_LANGUAGES
    assert "ur" in INDIAN_LANGUAGES
    assert INDIAN_LANGUAGES["ur"].direction == "rtl"


def test_multilingual_language_detection():
    # Urdu (RTL script)
    assert language_detector.detect_language("کیا کل دہلی میں بارش ہوگی؟") == "ur"
    # Hindi (Devanagari)
    assert language_detector.detect_language("क्या कल दिल्ली में बारिश होगी?") == "hi"
    # Bengali
    assert language_detector.detect_language("কাল কি কলকাতায় বৃষ্টি হবে?") == "bn"
    # Tamil
    assert language_detector.detect_language("சென்னையில் நாளை மழை பெய்யுமா?") == "ta"
    # Telugu
    assert language_detector.detect_language("హైదరాబాద్‌లో రేపు వర్షం పడుతుందా?") == "te"
    # English
    assert language_detector.detect_language("Will it rain tomorrow in Delhi?") == "en"


def test_multilingual_intent_parsing():
    # Bengali Rain query
    res_bn = intent_parser.parse_query("কাল কি কলকাতায় বৃষ্টি হবে?")
    assert res_bn.location == "Kolkata"
    assert res_bn.language == "bn"
    assert res_bn.intent in [QueryIntent.RAINFALL, QueryIntent.FORECAST]

    # Hindi Cyclone query
    res_hi = intent_parser.parse_query("क्या मुंबई में चक्रवात का खतरा है?")
    assert res_hi.location == "Mumbai"
    assert res_hi.language == "hi"
    assert res_hi.intent == QueryIntent.CYCLONE


def test_meteorological_terminology():
    assert locale_service.get_term("rainfall", "hi") == "वर्षा / बारिश"
    assert locale_service.get_term("rainfall", "bn") == "বৃষ্টিপাত"
    assert locale_service.get_term("cyclone", "ta") == "புயல்"
    assert locale_service.get_term("temperature", "ur") == "درجہ حرارت"
