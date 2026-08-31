import React, { useState, useEffect } from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  CloudRain,
  AlertTriangle,
  Layers,
  Sparkles,
  Compass,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Activity,
  Clock
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useTranslation } from '../../hooks/useTranslation';
import { weatherService } from '../../services/api';
import { ModelComparisonResponse } from '../../types/weather';

const HINDI_CONDITIONS: Record<string, string> = {
  'Thunderstorm with Moderate Rain': 'मध्यम वर्षा के साथ आंधी और गरज-चमक',
  'Thunderstorm with Heavy Rain': 'भारी वर्षा के साथ भीषण आंधी-तूफान',
  'Partly Cloudy': 'आंशिक रूप से बादल',
  'Mostly Cloudy': 'अधिकांशतः बादल छाए रहेंगे',
  'Overcast': 'घने बादल',
  'Clear Sky': 'साफ मौसम / धूप',
  'Sunny': 'चमकदार धूप',
  'Moderate Rain': 'मध्यम बारिश',
  'Heavy Rain': 'भारी बारिश',
  'Light Rain': 'हल्की फुहारें / बूंदाबांदी',
  'Drizzle': 'हल्की बूंदाबांदी',
  'Fog': 'घना कोहरा',
  'Mist': 'हल्का कोहरा / धुंध',
  'Haze': 'धुंध'
};

const HINDI_DAYS: Record<string, string> = {
  'Today': 'आज',
  'Tomorrow': 'कल',
  'Monday': 'सोमवार',
  'Tuesday': 'मंगलवार',
  'Wednesday': 'बुधवार',
  'Thursday': 'गुरुवार',
  'Friday': 'शुक्रवार',
  'Saturday': 'शनिवार',
  'Sunday': 'रविवार'
};

export const WeatherDashboard: React.FC = () => {
  const { location, unit, currentWeather, forecast, warnings, loading, language } = useWeather();
  const { t } = useTranslation();
  const [modelComparison, setModelComparison] = useState<ModelComparisonResponse | null>(null);

  const isHi = language === 'hi';

  const translateCondition = (cond?: string) => {
    if (!cond) return isHi ? 'आंशिक रूप से बादल' : 'Partly Cloudy';
    if (isHi && HINDI_CONDITIONS[cond]) return HINDI_CONDITIONS[cond];
    return cond;
  };

  const translateDay = (day: string) => {
    if (isHi && HINDI_DAYS[day]) return HINDI_DAYS[day];
    return day;
  };

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const comp = await weatherService.compareModels(location);
        setModelComparison(comp);
      } catch (e) {
        console.error("Error fetching model comparison", e);
      }
    };
    fetchComparison();
  }, [location]);

  if (loading && !currentWeather) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isHi ? 'आईएमडी के आधिकारिक मौसम विज्ञान डेटा को लोड किया जा रहा है...' : 'Loading authoritative IMD meteorological telemetry...'}
          </p>
        </div>
      </div>
    );
  }

  const tempDisplay = (cVal?: number) => {
    if (cVal === undefined || cVal === null) return '--';
    if (unit === 'F') return `${Math.round((cVal * 9) / 5 + 32)}°F`;
    return `${cVal}°C`;
  };

  const primaryWarning = warnings.length > 0 ? warnings[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Warning Banner if Active */}
      {primaryWarning && (
        <div className={`p-4 sm:p-5 rounded-3xl border flex items-start space-x-4 shadow-md transition-all ${
          primaryWarning.severity === 'RED'
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/50 text-rose-900 dark:text-rose-200'
            : primaryWarning.severity === 'ORANGE'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/50 text-amber-900 dark:text-amber-200'
            : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-500/40 text-yellow-900 dark:text-yellow-200'
        }`}>
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-black text-xs uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300">
                {isHi ? (primaryWarning.severity === 'ORANGE' ? 'नारंगी चेतावनी (ORANGE ALERT)' : primaryWarning.severity === 'RED' ? 'लाल चेतावनी (RED ALERT)' : 'पीली चेतावनी (YELLOW ALERT)') : `${primaryWarning.severity} Warning`}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({primaryWarning.source})</span>
            </div>
            <p className="text-sm sm:text-base font-bold mt-1 text-slate-900 dark:text-white">
              {isHi && primaryWarning.severity === 'ORANGE'
                ? 'नारंगी चेतावनी: गरज-चमक के साथ तेज हवाएं (30-40 किमी/घंटा) और मध्यम वर्षा'
                : primaryWarning.title}
            </p>
            <p className="text-xs opacity-90 mt-1 leading-relaxed">
              {isHi && primaryWarning.severity === 'ORANGE'
                ? `अगले 24-48 घंटों के दौरान ${location} और आसपास के क्षेत्रों में बिजली चमकने व आंधी के साथ मध्यम वर्षा की संभावना है।`
                : primaryWarning.description}
            </p>
            {primaryWarning.action_suggested && (
              <p className="text-xs font-bold mt-2 text-blue-700 dark:text-amber-300 underline underline-offset-2">
                {isHi ? 'सार्वजनिक सुरक्षा सलाह: पेड़ों के नीचे शरण न लें। संवेदनशील विद्युत उपकरणों को अनप्लग करें।' : `Public Safety Advisory: ${primaryWarning.action_suggested}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Meteorological Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{location}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {currentWeather?.location.district}, {currentWeather?.location.state}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold">
                {currentWeather?.location.station_code || 'IMD SYNOP'}
              </span>
            </div>

            <div className="mt-8 flex items-baseline justify-between">
              <div className="text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                {tempDisplay(currentWeather?.temperature_c)}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {translateCondition(currentWeather?.weather_condition)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {t.feels_like} {tempDisplay(currentWeather?.feels_like_c)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{currentWeather?.source}</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{currentWeather?.data_freshness}</span>
          </div>
        </div>

        {/* High Density Atmospheric Metrics Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Humidity */}
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold">{t.humidity}</span>
              <Droplets className="w-4 h-4 text-sky-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentWeather?.humidity_pct || 70}%</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{isHi ? 'ओस बिंदु ~23°C' : 'Dew Point ~23°C'}</p>
            </div>
          </div>

          {/* Wind Speed & Gusts */}
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold">{t.wind_speed}</span>
              <Wind className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentWeather?.wind_speed_kmh || 15} km/h</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{isHi ? `झोंके: ${currentWeather?.wind_gust_kmh || 25} km/h` : `Gusts: ${currentWeather?.wind_gust_kmh || 25} km/h`}</p>
            </div>
          </div>

          {/* 24h Precipitation */}
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold">{t.rainfall_24h}</span>
              <CloudRain className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">{currentWeather?.rainfall_24h_mm || 0} mm</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{isHi ? `1h दर: ${currentWeather?.rainfall_1h_mm || 0} mm/h` : `1h Rate: ${currentWeather?.rainfall_1h_mm || 0} mm/h`}</p>
            </div>
          </div>

          {/* Barometric Pressure */}
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold">{t.barometric_pressure}</span>
              <Gauge className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentWeather?.pressure_hpa || 1008} hPa</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{isHi ? 'समुद्र तल मानक' : 'MSL Normalized'}</p>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold">{t.visibility}</span>
              <Eye className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentWeather?.visibility_km || 5} km</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{isHi ? 'स्पष्ट दृष्टि रेखा' : 'Clear Line-of-Sight'}</p>
            </div>
          </div>

          {/* UV Index */}
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold">{t.uv_index}</span>
              <Sun className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentWeather?.uv_index || 6.5}</span>
              <p className="text-[11px] text-orange-500 mt-0.5">{isHi ? 'मध्यम जोखिम' : 'Moderate Exposure'}</p>
            </div>
          </div>

          {/* Air Quality (AQI) */}
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold">{t.air_quality}</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentWeather?.air_quality_aqi || 85}</span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">{isHi ? 'संतोषजनक' : 'Satisfactory'}</p>
            </div>
          </div>

          {/* Cloud Cover */}
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold">{t.cloud_cover}</span>
              <Layers className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentWeather?.cloud_cover_pct || 60}%</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{isHi ? 'संवाहक बादल आवरण' : 'Convective Cloud Deck'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              {t.forecast_7day}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi ? 'आईएमडी सिनॉप्टिक एन्सेम्बल और उच्च-रिज़ॉल्यूशन एनडब्ल्यूपी मार्गदर्शन' : 'IMD Synoptic Ensemble & High-Resolution NWP Guidance'}
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
            {isHi ? 'दैनिक समयरेखा' : 'Daily Timeline'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
          {forecast?.daily_forecasts.map((df, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center flex flex-col justify-between space-y-2 transition-all hover:shadow-md ${
                idx === 0
                  ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-500/40 text-blue-900 dark:text-blue-100'
                  : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{translateDay(df.day_name)}</div>
              <p className="text-[10px] text-slate-400 font-medium">{df.date.substring(5)}</p>

              <div className="my-1">
                <CloudRain className="w-6 h-6 mx-auto text-blue-600 dark:text-blue-400" />
              </div>

              <div className="text-xs">
                <span className="font-black text-slate-900 dark:text-white">{tempDisplay(df.temp_max_c)}</span>
                <span className="text-slate-400 ml-1.5">{tempDisplay(df.temp_min_c)}</span>
              </div>

              <div className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold">
                💧 {df.precipitation_prob_pct}% {isHi ? 'वर्षा' : 'rain'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Model Comparison & Forecast Uncertainty Section */}
      {modelComparison && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                Multi-Model NWP Forecast Agreement & Uncertainty Analysis
              </h3>
            </div>
            <span className={`text-xs px-3.5 py-1 rounded-full font-black uppercase ${
              modelComparison.agreement_level === 'HIGH'
                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                : modelComparison.agreement_level === 'MEDIUM'
                ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                : 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
            }`}>
              {modelComparison.agreement_level} Model Consensus ({Math.round(modelComparison.agreement_score * 100)}%)
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {modelComparison.synthesis}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modelComparison.parameters.map((param, pIdx) => (
              <div key={pIdx} className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>{param.parameter}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    param.agreement_level === 'HIGH'
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10'
                      : 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10'
                  }`}>
                    {param.agreement_level}
                  </span>
                </div>

                <div className="text-xs grid grid-cols-3 gap-1.5 pt-1 text-center font-semibold">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="block text-[9px] text-slate-400 uppercase">IMD</span>
                    <span className="text-slate-900 dark:text-slate-100">{param.imd_value}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="block text-[9px] text-slate-400 uppercase">GFS</span>
                    <span className="text-slate-900 dark:text-slate-100">{param.gfs_value}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="block text-[9px] text-slate-400 uppercase">WRF</span>
                    <span className="text-slate-900 dark:text-slate-100">{param.wrf_value || '--'}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{param.variance_explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
