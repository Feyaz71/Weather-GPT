import math
from typing import Optional, List, Dict, Tuple
from app.schemas.weather import LocationInfo

# Comprehensive database of major Indian cities, districts, states, and coordinates
INDIAN_LOCATIONS: Dict[str, Dict] = {
    "delhi": {
        "name": "Delhi",
        "district": "New Delhi",
        "state": "Delhi",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "elevation_m": 216.0,
        "station_code": "DEL001_SFD",
    },
    "mumbai": {
        "name": "Mumbai",
        "district": "Mumbai Suburban",
        "state": "Maharashtra",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "elevation_m": 14.0,
        "station_code": "BOM002_SCZ",
    },
    "bengaluru": {
        "name": "Bengaluru",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "elevation_m": 920.0,
        "station_code": "BLR003_HAL",
    },
    "bangalore": {
        "name": "Bengaluru",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "elevation_m": 920.0,
        "station_code": "BLR003_HAL",
    },
    "chennai": {
        "name": "Chennai",
        "district": "Chennai",
        "state": "Tamil Nadu",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "elevation_m": 6.0,
        "station_code": "MAA004_NGB",
    },
    "kolkata": {
        "name": "Kolkata",
        "district": "Kolkata",
        "state": "West Bengal",
        "latitude": 22.5726,
        "longitude": 88.3639,
        "elevation_m": 9.0,
        "station_code": "CCU005_ALP",
    },
    "hyderabad": {
        "name": "Hyderabad",
        "district": "Hyderabad",
        "state": "Telangana",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "elevation_m": 505.0,
        "station_code": "HYD006_BEG",
    },
    "ahmedabad": {
        "name": "Ahmedabad",
        "district": "Ahmedabad",
        "state": "Gujarat",
        "latitude": 23.0225,
        "longitude": 72.5714,
        "elevation_m": 53.0,
        "station_code": "AMD007_SVB",
    },
    "jaipur": {
        "name": "Jaipur",
        "district": "Jaipur",
        "state": "Rajasthan",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "elevation_m": 431.0,
        "station_code": "JAI008_SGN",
    },
    "shimla": {
        "name": "Shimla",
        "district": "Shimla",
        "state": "Himachal Pradesh",
        "latitude": 31.1048,
        "longitude": 77.1734,
        "elevation_m": 2206.0,
        "station_code": "SHI009_ML",
    },
    "patna": {
        "name": "Patna",
        "district": "Patna",
        "state": "Bihar",
        "latitude": 25.5941,
        "longitude": 85.1376,
        "elevation_m": 53.0,
        "station_code": "PAT010_AP",
    },
    "ludhiana": {
        "name": "Ludhiana",
        "district": "Ludhiana",
        "state": "Punjab",
        "latitude": 30.9010,
        "longitude": 75.8573,
        "elevation_m": 244.0,
        "station_code": "LDH011_PAU",
    },
    "srinagar": {
        "name": "Srinagar",
        "district": "Srinagar",
        "state": "Jammu & Kashmir",
        "latitude": 34.0837,
        "longitude": 74.7973,
        "elevation_m": 1585.0,
        "station_code": "SRN012_AP",
    },
    "guwahati": {
        "name": "Guwahati",
        "district": "Kamrup Metropolitan",
        "state": "Assam",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "elevation_m": 55.0,
        "station_code": "GAU013_BOR",
    },
    "pune": {
        "name": "Pune",
        "district": "Pune",
        "state": "Maharashtra",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "elevation_m": 560.0,
        "station_code": "PUN014_SHV",
    },
    "lucknow": {
        "name": "Lucknow",
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "latitude": 26.8467,
        "longitude": 80.9462,
        "elevation_m": 123.0,
        "station_code": "LKO015_AMA",
    },
    "bhubaneswar": {
        "name": "Bhubaneswar",
        "district": "Khordha",
        "state": "Odisha",
        "latitude": 20.2961,
        "longitude": 85.8245,
        "elevation_m": 45.0,
        "station_code": "BBI016_BPI",
    },
    "dehradun": {
        "name": "Dehradun",
        "district": "Dehradun",
        "state": "Uttarakhand",
        "latitude": 30.3165,
        "longitude": 78.0322,
        "elevation_m": 435.0,
        "station_code": "DED017_FR",
    }
}


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance between two points in km."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


class GeoResolver:
    @staticmethod
    def resolve_location(query: str) -> LocationInfo:
        """Resolve a city or district query to LocationInfo."""
        clean_q = query.strip().lower()
        
        # Direct match
        if clean_q in INDIAN_LOCATIONS:
            loc = INDIAN_LOCATIONS[clean_q]
            return LocationInfo(**loc)
        
        # Substring / partial match
        for key, loc in INDIAN_LOCATIONS.items():
            if key in clean_q or loc["district"].lower() in clean_q or loc["name"].lower() in clean_q:
                return LocationInfo(**loc)
        
        # Default to Delhi if location is unknown or unspecified
        default_loc = INDIAN_LOCATIONS["delhi"]
        return LocationInfo(
            name=query.title() if query else default_loc["name"],
            district=default_loc["district"],
            state=default_loc["state"],
            country="India",
            latitude=default_loc["latitude"],
            longitude=default_loc["longitude"],
            elevation_m=default_loc["elevation_m"],
            station_code=default_loc["station_code"]
        )

    @staticmethod
    def reverse_geocode(lat: float, lon: float) -> LocationInfo:
        """Find the nearest Indian station / district to the given coordinates."""
        closest_loc = None
        min_dist = float("inf")

        for key, loc in INDIAN_LOCATIONS.items():
            dist = haversine_distance(lat, lon, loc["latitude"], loc["longitude"])
            if dist < min_dist:
                min_dist = dist
                closest_loc = loc

        if closest_loc:
            return LocationInfo(**closest_loc)

        return LocationInfo(
            name=f"Lat {lat:.2f}, Lon {lon:.2f}",
            district="Local District",
            state="India",
            country="India",
            latitude=lat,
            longitude=lon
        )

    @staticmethod
    def get_all_stations() -> List[LocationInfo]:
        """Return all catalogued weather stations."""
        return [LocationInfo(**loc) for loc in INDIAN_LOCATIONS.values()]


geo_resolver = GeoResolver()
