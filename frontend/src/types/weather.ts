export type WarningSeverity = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface LocationInfo {
  name: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  station_code?: string;
}

export interface WeatherObservation {
  source: string;
  source_type?: string;
  location: LocationInfo;
  timestamp: string;
  temperature_c?: number;
  feels_like_c?: number;
  humidity_pct?: number;
  pressure_hpa?: number;
  wind_speed_kmh?: number;
  wind_direction_deg?: number;
  wind_gust_kmh?: number;
  rainfall_1h_mm?: number;
  rainfall_24h_mm?: number;
  visibility_km?: number;
  cloud_cover_pct?: number;
  uv_index?: number;
  air_quality_aqi?: number;
  weather_condition?: string;
  data_freshness?: string;
  is_demo?: boolean;
}

export interface DailyForecastPoint {
  date: string;
  day_name: string;
  temp_max_c: number;
  temp_min_c: number;
  precipitation_prob_pct: number;
  precipitation_amount_mm: number;
  weather_condition: string;
  warning_level: WarningSeverity;
  humidity_pct?: number;
  wind_speed_kmh?: number;
}

export interface ForecastResponse {
  source: string;
  location: LocationInfo;
  generated_at: string;
  valid_from: string;
  valid_until: string;
  daily_forecasts: DailyForecastPoint[];
}

export interface WeatherWarning {
  warning_id: string;
  source: string;
  district: string;
  state: string;
  category: string;
  severity: WarningSeverity;
  title: string;
  description: string;
  action_suggested?: string;
  issued_at: string;
  valid_from: string;
  valid_until: string;
  affected_coordinates?: number[][];
  is_active: boolean;
}

export interface AlertNotificationEvent {
  event_id: string;
  title: string;
  description: string;
  severity: WarningSeverity;
  district: string;
  state: string;
  issued_at: string;
  valid_until?: string;
  action_suggested?: string;
}

export interface CycloneTrackPoint {
  timestamp: string;
  latitude: number;
  longitude: number;
  intensity_category: string;
  max_sustained_wind_kmh: number;
  central_pressure_hpa: number;
  is_forecast: boolean;
}

export interface CycloneInfo {
  cyclone_id: string;
  name: string;
  basin: string;
  current_category: string;
  current_lat: number;
  current_lon: number;
  max_sustained_wind_kmh: number;
  estimated_central_pressure_hpa: number;
  movement_direction: string;
  movement_speed_kmh: number;
  distance_from_user_km?: number;
  relevance_to_user: string;
  track_points: CycloneTrackPoint[];
  landfall_forecast?: string;
  source: string;
}

export interface NearbyWeatherEvent {
  event_id: string;
  event_type: string;
  headline: string;
  severity: WarningSeverity;
  epicenter_lat: number;
  epicenter_lon: number;
  distance_km: number;
  bearing_compass: string;
  movement_direction: string;
  movement_speed_kmh?: number;
  relevance: string;
  action_advisory: string;
  source: string;
  issued_at: string;
}

export interface DomainAdvisoryResponse {
  domain: string;
  location: LocationInfo;
  overall_status: string;
  headline: string;
  key_metrics: Record<string, any>;
  safety_guidelines: string[];
  contributing_factors: string[];
  source_attribution: string;
}

export interface LanguageMetadata {
  code: string;
  name_english: string;
  name_native: string;
  direction: string;
  script: string;
}

export interface ModelAgreement {
  parameter: string;
  imd_value: any;
  gfs_value: any;
  wrf_value?: any;
  agreement_level: string;
  variance_explanation: string;
}

export interface ModelComparisonResponse {
  location: LocationInfo;
  target_time: string;
  models_evaluated: string[];
  agreement_score: number;
  agreement_level: string;
  parameters: ModelAgreement[];
  synthesis: string;
  uncertainty_index: string;
}

export interface AgricultureAdvisory {
  location: LocationInfo;
  crop_name: string;
  crop_stage: string;
  irrigation_advice: string;
  irrigation_action: string;
  spraying_advice: string;
  spraying_action: string;
  harvesting_advice: string;
  disease_pest_risk: string;
  meteorological_drivers: string[];
  advisory_summary: string;
  source: string;
}

export interface MonthlyClimateStats {
  month: string;
  avg_rainfall_mm: number;
  historical_avg_rainfall_mm: number;
  rainfall_anomaly_pct: number;
  avg_temp_max_c: number;
  avg_temp_min_c: number;
  temp_anomaly_c: number;
}

export interface ClimateTrendAnalysis {
  location: LocationInfo;
  period: string;
  historical_years_analyzed: number;
  temperature_trend_per_decade_c: number;
  rainfall_trend_pct_change: number;
  monsoon_variability_index: string;
  extreme_weather_event_frequency: string;
  monthly_data: MonthlyClimateStats[];
  summary: string;
  methodology: string;
}

export interface ExplainabilityDetail {
  headline: string;
  factors: string[];
  active_warnings: string[];
  sources: string[];
  data_freshness: string;
}

export interface ChatQueryResponse {
  session_id: string;
  response_text: string;
  language: string;
  direction: string;
  intent: string;
  extracted_location: string;
  extracted_time?: string;
  observation?: WeatherObservation;
  forecast?: ForecastResponse;
  warnings?: WeatherWarning[];
  cyclones?: CycloneInfo[];
  nearby_events?: NearbyWeatherEvent[];
  domain_advisory?: DomainAdvisoryResponse;
  agriculture_advisory?: AgricultureAdvisory;
  model_comparison?: ModelComparisonResponse;
  climate_analysis?: ClimateTrendAnalysis;
  explainability: ExplainabilityDetail;
  source_attribution: string;
}
