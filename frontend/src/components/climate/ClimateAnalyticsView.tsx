import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, CloudRain, Thermometer, Calendar, Info } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';
import { weatherService } from '../../services/api';
import { ClimateTrendAnalysis } from '../../types/weather';

export const ClimateAnalyticsView: React.FC = () => {
  const { location } = useWeather();
  const { theme } = useTheme();
  const [climateData, setClimateData] = useState<ClimateTrendAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [years, setYears] = useState<number>(10);

  useEffect(() => {
    const fetchClimate = async () => {
      try {
        setLoading(true);
        const data = await weatherService.getClimateTrends(location, years);
        setClimateData(data);
      } catch (err) {
        console.error("Climate fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClimate();
  }, [location, years]);

  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const tooltipBg = theme === 'dark' ? '#0f172a' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#cbd5e1';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Historical Climatological Analytics & Decadal Trend Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Statistical Decadal Warming Drift & Monthly Monsoon Departure Indices for {location}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-sm">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <select
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value={5} className="bg-white dark:bg-slate-900">5-Year Baseline</option>
            <option value={10} className="bg-white dark:bg-slate-900">10-Year Baseline</option>
            <option value={20} className="bg-white dark:bg-slate-900">20-Year Baseline</option>
            <option value={30} className="bg-white dark:bg-slate-900">30-Year IMD Normal</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-medium">Processing historical station reanalysis...</div>
      ) : climateData ? (
        <div className="space-y-6">
          {/* Key Metrics KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Decadal Warming Drift
              </span>
              <div className="mt-2 text-3xl font-black text-rose-500 dark:text-rose-400">
                +{climateData.temperature_trend_per_decade_c}°C / decade
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Linear regression warming rate</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Monsoon Rainfall Departure
              </span>
              <div className="mt-2 text-3xl font-black text-blue-600 dark:text-cyan-400">
                +{climateData.rainfall_trend_pct_change}% vs Normal
              </div>
              <p className="text-[11px] text-slate-400 mt-1">High-intensity convective spell variance</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Variability Index
              </span>
              <div className="mt-2 text-3xl font-black text-amber-500 dark:text-amber-400">
                {climateData.monsoon_variability_index}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Inter-annual coefficient of variation</p>
            </div>
          </div>

          {/* Monthly Rainfall Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CloudRain className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  Monthly Precipitation vs 30-Year IMD Normal (mm)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Station Gridded Climatology</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={climateData.monthly_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" stroke={textColor} fontSize={11} />
                  <YAxis stroke={textColor} fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '0.875rem', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="avg_rainfall_mm" name="Observed Recent (mm)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="historical_avg_rainfall_mm" name="30y Normal (mm)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Temperature Climatology Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  Monthly Maximum & Minimum Climatological Normal Temperatures (°C)
                </h3>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={climateData.monthly_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" stroke={textColor} fontSize={11} />
                  <YAxis stroke={textColor} fontSize={11} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '0.875rem', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="avg_temp_max_c" name="Max Temp (°C)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="avg_temp_min_c" name="Min Temp (°C)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Methodology Card */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h4 className="font-black text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Scientific Methodology & Climatological Synthesis</span>
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{climateData.summary}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              Data Pipeline: {climateData.methodology}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
