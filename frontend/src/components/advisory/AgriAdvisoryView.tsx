import React, { useState, useEffect } from 'react';
import { Sprout, Droplet, SprayCan as Spray, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { weatherService } from '../../services/api';
import { AgricultureAdvisory } from '../../types/weather';

const CROPS = [
  { id: 'wheat', label: 'Wheat (गेहूं)' },
  { id: 'rice', label: 'Rice / Paddy (धान/चावल)' },
  { id: 'cotton', label: 'Cotton (कपास)' },
  { id: 'mustard', label: 'Mustard (सरसों)' },
  { id: 'tomato', label: 'Tomato (टमाटर)' },
];

const CROP_STAGES = [
  'Sowing / Transplanting',
  'Vegetative Growth',
  'Flowering / Tasseling',
  'Grain Filling / Pod Development',
  'Maturity / Harvest'
];

export const AgriAdvisoryView: React.FC = () => {
  const { location } = useWeather();
  const [selectedCrop, setSelectedCrop] = useState<string>('wheat');
  const [selectedStage, setSelectedStage] = useState<string>('Vegetative Growth');
  const [advisory, setAdvisory] = useState<AgricultureAdvisory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAdvisory = async () => {
    try {
      setLoading(true);
      const data = await weatherService.getAgricultureAdvisory(location, selectedCrop, selectedStage);
      setAdvisory(data);
    } catch (e) {
      console.error("Advisory error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, [location, selectedCrop, selectedStage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              National Agrometeorological Decision Support Portal
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            IMD Agromet Advisory Service (AAS) & Soil Moisture Guided Decisions for {location}
          </p>
        </div>

        {/* Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none shadow-sm cursor-pointer"
          >
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none shadow-sm cursor-pointer"
          >
            {CROP_STAGES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-medium">Computing agromet decision rules...</div>
      ) : advisory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Irrigation Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplet className="w-5 h-5 text-sky-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Irrigation Scheduling</h3>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                  advisory.irrigation_action === 'STOP' || advisory.irrigation_action === 'DELAY'
                    ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                    : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                }`}>
                  Action: {advisory.irrigation_action}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-4 leading-relaxed font-normal">
                {advisory.irrigation_advice}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
              <span>Optimizes root zone aeration and soil moisture retention</span>
            </div>
          </div>

          {/* Spraying Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Spray className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Agrochemical Spraying</h3>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                  advisory.spraying_action === 'HOLD'
                    ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                    : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                }`}>
                  {advisory.spraying_action}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-4 leading-relaxed font-normal">
                {advisory.spraying_advice}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Prevents wind drift and precipitation chemical washout</span>
            </div>
          </div>

          {/* Disease Risk Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertOctagon className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Disease / Pest Risk</h3>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-black">
                  Surveillance
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-4 leading-relaxed font-normal">
                {advisory.disease_pest_risk}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>IMD AAS Microclimate Biological Threat Index</span>
            </div>
          </div>

          {/* Meteorological Drivers Breakdown */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Key Meteorological Drivers Influencing This Advisory
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {advisory.meteorological_drivers.map((drv, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{drv}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              Source: {advisory.source}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
