import React from 'react';
import { Sparkles, CloudSun, Layers, Compass, Sprout, Bell } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useTranslation } from '../hooks/useTranslation';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { warnings } = useWeather();
  const { t } = useTranslation();

  const primaryTabs = [
    { id: 'chat', label: t.ai_assistant, icon: Sparkles },
    { id: 'dashboard', label: t.telemetry, icon: CloudSun },
    { id: 'map', label: t.gis_map, icon: Layers },
    { id: 'cyclone', label: t.cyclone_nearby, icon: Compass },
    { id: 'advisory', label: t.agromet_portal, icon: Sprout },
    { id: 'alerts', label: t.alert_center, icon: Bell, badge: warnings.length }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[9.5px] mt-0.5 tracking-tight truncate max-w-[55px] text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
