import React, { useState, useEffect } from 'react';
import { Plane, Anchor, ShieldAlert, CheckCircle2, AlertTriangle, Wind, Eye, Compass, Info } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { weatherService } from '../../services/api';
import { DomainAdvisoryResponse } from '../../types/weather';

export const DomainAdvisoriesView: React.FC = () => {
  const { location } = useWeather();
  const [aviation, setAviation] = useState<DomainAdvisoryResponse | null>(null);
  const [marine, setMarine] = useState<DomainAdvisoryResponse | null>(null);
  const [disaster, setDisaster] = useState<DomainAdvisoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const [avData, marData, disData] = await Promise.all([
          weatherService.getAviationAdvisory(location),
          weatherService.getMarineAdvisory(location),
          weatherService.getDisasterReadiness(location)
        ]);
        setAviation(avData);
        setMarine(marData);
        setDisaster(disData);
      } catch (err) {
        console.error("Domain advisories error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, [location]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Specialized Domain Decision-Support Portal
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Aerodrome Aviation Meteorological Guidance, Ocean State Wave Bulletins & NDMA Emergency Readiness for {location}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-medium">Evaluating specialized domain rules...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Aviation Advisory Card */}
          {aviation && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Plane className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Aviation & Aerodrome</h3>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                    aviation.overall_status === 'HAZARDOUS'
                      ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                      : aviation.overall_status === 'CAUTION'
                      ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                      : 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                  }`}>
                    {aviation.overall_status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">{aviation.headline}</h4>

                {/* Key Aviation Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block">Visibility</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{aviation.key_metrics.visibility_km} km</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block">Cloud Ceiling</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{aviation.key_metrics.cloud_base_ft} ft</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-slate-200 block">Pilot & Aerodrome Guidelines:</span>
                  {aviation.safety_guidelines.map((g, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Source: {aviation.source_attribution}
              </div>
            </div>
          )}

          {/* 2. Marine Advisory Card */}
          {marine && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Anchor className="w-5 h-5 text-cyan-500" />
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Marine & Coastal Waters</h3>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                    marine.overall_status === 'SUSPENDED' || marine.overall_status === 'HAZARDOUS'
                      ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                      : marine.overall_status === 'CAUTION'
                      ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                      : 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                  }`}>
                    {marine.overall_status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">{marine.headline}</h4>

                {/* Key Marine Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block">Wave Height (Hs)</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{marine.key_metrics.significant_wave_height_m} meters</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block">Marine Winds</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{marine.key_metrics.surface_wind_kmh} km/h</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-slate-200 block">Fisheries & Port Directives:</span>
                  {marine.safety_guidelines.map((g, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Source: {marine.source_attribution}
              </div>
            </div>
          )}

          {/* 3. Disaster Readiness Card */}
          {disaster && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Disaster Management</h3>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                    disaster.overall_status === 'HAZARDOUS'
                      ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                      : disaster.overall_status === 'CAUTION'
                      ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                      : 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                  }`}>
                    {disaster.overall_status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">{disaster.headline}</h4>

                <div className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-slate-200 block">Emergency Response Protocols:</span>
                  {disaster.safety_guidelines.map((g, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Source: {disaster.source_attribution}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
