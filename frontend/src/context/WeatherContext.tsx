import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeatherObservation, ForecastResponse, WeatherWarning, AlertNotificationEvent } from '../types/weather';
import { weatherService } from '../services/api';

interface WeatherContextType {
  location: string;
  setLocation: (loc: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  unit: 'C' | 'F';
  setUnit: (u: 'C' | 'F') => void;
  toggleUnit: () => void;
  currentWeather: WeatherObservation | null;
  forecast: ForecastResponse | null;
  warnings: WeatherWarning[];
  loading: boolean;
  error: string | null;
  activeAlerts: AlertNotificationEvent[];
  refreshWeatherData: () => Promise<void>;
  dismissAlert: (eventId: string) => void;
  triggerLiveAlertDemo: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<string>('Delhi');
  const [language, setLanguage] = useState<string>('en');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [currentWeather, setCurrentWeather] = useState<WeatherObservation | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [warnings, setWarnings] = useState<WeatherWarning[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<AlertNotificationEvent[]>([]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const [obs, fc, warns] = await Promise.all([
        weatherService.getCurrentWeather(location),
        weatherService.getForecast(location, 7),
        weatherService.getWarnings(location)
      ]);
      setCurrentWeather(obs);
      setForecast(fc);
      setWarnings(warns);
    } catch (err: any) {
      console.error("Failed to load weather data:", err);
      setError("Unable to connect to weather backend. Make sure the FastAPI service is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  // Connect to WebSocket for Live Weather & Alert broadcasts
  useEffect(() => {
    const wsUrl = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1') + '/ws/weather';
    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket(wsUrl);
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event_id) {
            setActiveAlerts((prev) => [data, ...prev]);
          }
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };
    } catch (err) {
      console.warn("WebSocket stream not reachable:", err);
    }

    return () => {
      if (socket) socket.close();
    };
  }, []);

  const dismissAlert = (eventId: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.event_id !== eventId));
  };

  const triggerLiveAlertDemo = async () => {
    try {
      const evt = await weatherService.simulateAlert(location, 'ORANGE');
      setActiveAlerts((prev) => [evt, ...prev]);
    } catch (e) {
      console.error("Error triggering demo alert", e);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        location,
        setLocation,
        language,
        setLanguage,
        unit,
        setUnit,
        toggleUnit,
        currentWeather,
        forecast,
        warnings,
        loading,
        error,
        activeAlerts,
        refreshWeatherData: fetchWeather,
        dismissAlert,
        triggerLiveAlertDemo
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};
