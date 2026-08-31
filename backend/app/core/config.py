from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "WeatherGPT"
    PROJECT_DESCRIPTION: str = "AI-Powered Conversational Weather Intelligence & Decision-Support Platform"
    VERSION: str = "2.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Environment & Modes
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    DEMO_MODE: bool = False  # Production mode with live provider fallback chains
    
    # Database & Cache
    DATABASE_URL: str = "sqlite+aiosqlite:///./weathergpt.db"
    POSTGRES_URL: Optional[str] = None
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL_CURRENT: int = 600       # 10 min
    REDIS_CACHE_TTL_FORECAST: int = 1800     # 30 min
    REDIS_CACHE_TTL_WARNINGS: int = 300      # 5 min
    REDIS_CACHE_TTL_HISTORICAL: int = 86400  # 24 hours
    
    # 1. IMD (Official Indian Meteorological Source)
    IMD_API_BASE_URL: str = "https://api.imd.gov.in/v1"
    IMD_API_KEY: Optional[str] = None
    
    # 2. MOSDAC / ISRO (Satellite & Oceanographic Products)
    MOSDAC_API_BASE_URL: str = "https://mosdac.gov.in/api"
    MOSDAC_USER: Optional[str] = None
    MOSDAC_PASSWORD: Optional[str] = None
    
    # 3. NOAA / NCEI / GFS / NOMADS (Global NWP & Observations)
    GFS_API_BASE_URL: str = "https://nomads.ncep.noaa.gov/dods/gfs_0p25"
    WRF_API_BASE_URL: str = "https://internal-wrf.weathergpt.org/api/v1"
    NOAA_GFS_API_URL: str = "https://nomads.ncep.noaa.gov/dods/gfs_0p25"
    NOAA_NCEI_API_URL: str = "https://www.ncei.noaa.gov/cdo-web/api/v2"
    NOAA_API_KEY: Optional[str] = None
    
    # 4. ERA5 / Copernicus CDS (Historical Climate & Reanalysis)
    COPERNICUS_CDS_API_URL: str = "https://cds.climate.copernicus.eu/api/v2"
    COPERNICUS_API_KEY: Optional[str] = None
    
    # 5. OpenWeather (Application-level Current & Forecast)
    OPENWEATHER_API_KEY: Optional[str] = None
    OPENWEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"
    
    # 6. Open-Meteo (No-Key High-Resolution Forecast & Multi-Model NWP)
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1/forecast"
    OPEN_METEO_HISTORICAL_URL: str = "https://archive-api.open-meteo.com/v1/archive"
    
    # 7. WeatherAPI.com (Current, Forecast, Historical & Alerts)
    WEATHERAPI_KEY: Optional[str] = None
    WEATHERAPI_BASE_URL: str = "https://api.weatherapi.com/v1"
    
    # 8. NASA POWER (Agroclimatology, Solar & Environmental Analytics)
    NASA_POWER_API_URL: str = "https://power.larc.nasa.gov/api/temporal/daily/point"
    
    # AI & LLM Orchestration
    LLM_PROVIDER: str = "gemini"  # "gemini" | "openai" | "heuristic" | "ollama"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    LLM_MODEL_NAME: str = "gemini-3.6-flash"
    
    # Multilingual & Bhashini Voice
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_LANGUAGES: List[str] = [
        "en", "hi", "bn", "te", "mr", "ta", "gu", "ur", "kn", "ml", "pa", "or", "as"
    ]
    BHASHINI_API_KEY: Optional[str] = None
    BHASHINI_USER_ID: Optional[str] = None
    BHASHINI_PIPELINE_ID: Optional[str] = None
    
    # Push Notifications
    FCM_SERVER_KEY: Optional[str] = None
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
