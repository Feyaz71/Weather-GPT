import pytest
from app.ai.intent_parser import intent_parser
from app.schemas.chat import QueryIntent


def test_english_rain_forecast_intent():
    query = "Will it rain tomorrow evening in Delhi?"
    parsed = intent_parser.parse_query(query)
    assert parsed.location == "Delhi"
    assert parsed.intent in [QueryIntent.FORECAST, QueryIntent.RAINFALL]
    assert parsed.target_date_or_time == "tomorrow evening"
    assert parsed.language == "en"


def test_hindi_rain_query():
    query = "कल शाम दिल्ली में बारिश होगी क्या?"
    parsed = intent_parser.parse_query(query)
    assert parsed.location == "Delhi"
    assert parsed.intent in [QueryIntent.FORECAST, QueryIntent.RAINFALL]
    assert parsed.target_date_or_time == "tomorrow evening"
    assert parsed.language == "hi"


def test_multi_turn_follow_up_inheritance():
    # Turn 1:
    turn1 = intent_parser.parse_query("What is the weather in Mumbai tomorrow?")
    assert turn1.location == "Mumbai"
    
    # Turn 2: Follow up without mentioning Mumbai
    turn2 = intent_parser.parse_query("What about evening?", previous_intent=turn1)
    assert turn2.location == "Mumbai"  # Inherited Mumbai from turn 1
    assert turn2.is_follow_up is True


def test_agriculture_intent_detection():
    query = "Should I irrigate my wheat crop tomorrow in Ludhiana?"
    parsed = intent_parser.parse_query(query)
    assert parsed.location == "Ludhiana"
    assert parsed.intent == QueryIntent.AGRICULTURE_ADVISORY
    assert parsed.crop_name == "wheat"
