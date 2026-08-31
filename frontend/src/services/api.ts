import axios from 'axios';
import {
  WeatherObservation,
  ForecastResponse,
  WeatherWarning,
  ModelComparisonResponse,
  AgricultureAdvisory,
  ClimateTrendAnalysis,
  ChatQueryResponse,
  CycloneInfo,
  NearbyWeatherEvent,
  DomainAdvisoryResponse,
  LanguageMetadata,
  AlertNotificationEvent
} from '../types/weather';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const weatherService = {
  getCurrentWeather: async (location: string): Promise<WeatherObservation> => {
    const response = await apiClient.get<WeatherObservation>('/weather/current', {
      params: { location },
    });
    return response.data;
  },

  getForecast: async (location: string, days: number = 7): Promise<ForecastResponse> => {
    const response = await apiClient.get<ForecastResponse>('/weather/forecast', {
      params: { location, days },
    });
    return response.data;
  },

  getWarnings: async (location: string): Promise<WeatherWarning[]> => {
    const response = await apiClient.get<WeatherWarning[]>('/weather/warnings', {
      params: { location },
    });
    return response.data;
  },

  getActiveCyclones: async (location: string): Promise<CycloneInfo[]> => {
    const response = await apiClient.get<CycloneInfo[]>('/cyclone/active', {
      params: { location },
    });
    return response.data;
  },

  getNearbyEvents: async (location: string, radiusKm: number = 150): Promise<NearbyWeatherEvent[]> => {
    const response = await apiClient.get<NearbyWeatherEvent[]>('/nearby/events', {
      params: { location, radius_km: radiusKm },
    });
    return response.data;
  },

  getAviationAdvisory: async (location: string): Promise<DomainAdvisoryResponse> => {
    const response = await apiClient.get<DomainAdvisoryResponse>('/domains/aviation', {
      params: { location },
    });
    return response.data;
  },

  getMarineAdvisory: async (location: string): Promise<DomainAdvisoryResponse> => {
    const response = await apiClient.get<DomainAdvisoryResponse>('/domains/marine', {
      params: { location },
    });
    return response.data;
  },

  getDisasterReadiness: async (location: string): Promise<DomainAdvisoryResponse> => {
    const response = await apiClient.get<DomainAdvisoryResponse>('/domains/disaster', {
      params: { location },
    });
    return response.data;
  },

  getSupportedLanguages: async (): Promise<LanguageMetadata[]> => {
    const response = await apiClient.get<LanguageMetadata[]>('/languages/list');
    return response.data;
  },

  compareModels: async (location: string): Promise<ModelComparisonResponse> => {
    const response = await apiClient.get<ModelComparisonResponse>('/intelligence/compare-models', {
      params: { location },
    });
    return response.data;
  },

  getAgricultureAdvisory: async (
    location: string,
    crop: string = 'wheat',
    stage: string = 'Vegetative Growth'
  ): Promise<AgricultureAdvisory> => {
    const response = await apiClient.get<AgricultureAdvisory>('/intelligence/agri-advisory', {
      params: { location, crop, stage },
    });
    return response.data;
  },

  getClimateTrends: async (location: string, years: number = 10): Promise<ClimateTrendAnalysis> => {
    const response = await apiClient.get<ClimateTrendAnalysis>('/climate/analyze', {
      params: { location, years },
    });
    return response.data;
  },

  postChatQuery: async (
    message: string,
    sessionId?: string,
    currentLocation?: string,
    language?: string
  ): Promise<ChatQueryResponse> => {
    const response = await apiClient.post<ChatQueryResponse>('/chat', {
      message,
      session_id: sessionId,
      current_location: currentLocation,
      language,
    });
    return response.data;
  },

  getGISStations: async () => {
    const response = await apiClient.get('/gis/stations');
    return response.data;
  },

  getGISWarnings: async () => {
    const response = await apiClient.get('/gis/warnings');
    return response.data;
  },

  subscribeToAlerts: async (district: string, state: string, recipient: string) => {
    const response = await apiClient.post('/alerts/subscribe', {
      district,
      state,
      recipient_identifier: recipient,
      channel: 'PUSH',
    });
    return response.data;
  },

  simulateAlert: async (district: string, severity: string = 'ORANGE'): Promise<AlertNotificationEvent> => {
    const response = await apiClient.post<AlertNotificationEvent>('/alerts/simulate', null, {
      params: { district, severity }
    });
    return response.data;
  }
};
