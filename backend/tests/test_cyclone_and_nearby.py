import pytest
from app.providers.geo.resolver import geo_resolver
from app.intelligence.cyclone.tracker import cyclone_tracker
from app.intelligence.nearby.event_engine import nearby_event_engine
from app.intelligence.domains.decision_framework import domain_framework


def test_cyclone_tracking():
    loc = geo_resolver.resolve_location("Kolkata")
    cyclones = cyclone_tracker.get_cyclone_intelligence(loc)
    assert len(cyclones) > 0
    assert cyclones[0].distance_from_user_km is not None
    assert cyclones[0].relevance_to_user is not None


def test_nearby_severe_events():
    loc = geo_resolver.resolve_location("Delhi")
    events = nearby_event_engine.evaluate_nearby_events(loc, radius_km=250.0)
    assert len(events) > 0
    assert events[0].distance_km > 0
    assert events[0].bearing_compass in ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]


def test_domain_advisories():
    loc = geo_resolver.resolve_location("Mumbai")
    av = domain_framework.evaluate_aviation_weather(loc, None)
    assert av.domain == "AVIATION"
    assert av.overall_status in ["OPERATIONAL", "CAUTION", "HAZARDOUS", "SUSPENDED"]

    mar = domain_framework.evaluate_marine_weather(loc, None)
    assert mar.domain == "MARINE"
    assert mar.key_metrics["significant_wave_height_m"] > 0
