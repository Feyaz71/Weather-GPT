import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Radio,
  Bell,
  Languages,
  Sun,
  Moon,
  Search,
  Check,
  Compass,
  Plane,
  Sprout,
  TrendingUp,
  MapPin,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { weatherService } from '../services/api';
import { LanguageMetadata } from '../types/weather';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const INDIAN_METROS = [
  'Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad',
  'Ahmedabad', 'Pune', 'Jaipur', 'Shimla', 'Lucknow', 'Patna', 'Bhubaneswar'
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { location, setLocation, language, setLanguage, unit, toggleUnit, warnings } = useWeather();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [supportedLangs, setSupportedLangs] = useState<LanguageMetadata[]>([]);
  const [langPickerOpen, setLangPickerOpen] = useState<boolean>(false);
  const [searchLangQuery, setSearchLangQuery] = useState<string>('');

  useEffect(() => {
    const fetchLangs = async () => {
      try {
        const langs = await weatherService.getSupportedLanguages();
        setSupportedLangs(langs);
      } catch (e) {
        console.error("Languages fetch error", e);
      }
    };
    fetchLangs();
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    setLangPickerOpen(false);
    // RTL script reflow for Urdu
    if (langCode === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const filteredLangs = supportedLangs.filter(l =>
    l.name_english.toLowerCase().includes(searchLangQuery.toLowerCase()) ||
    l.name_native.toLowerCase().includes(searchLangQuery.toLowerCase())
  );

  const activeLangMeta = supportedLangs.find(l => l.code === language) || {
    name_english: 'English',
    name_native: 'English',
    code: 'en'
  };

  const navItems = [
    { id: 'chat', label: t.ai_assistant, icon: Sparkles },
    { id: 'dashboard', label: t.telemetry, icon: CloudSun },
    { id: 'map', label: t.gis_map, icon: Layers },
    { id: 'cyclone', label: t.cyclone_nearby, icon: Compass },
    { id: 'advisory', label: t.agromet_portal, icon: Sprout },
    { id: 'domains', label: t.domain_advisories, icon: Plane },
    { id: 'climate', label: t.climate_trends, icon: TrendingUp },
    { id: 'alerts', label: t.alert_center, icon: Bell, badge: warnings.length },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Telemetry Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">WeatherGPT</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {t.national_synoptic}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {t.models_tagline}
              </p>
            </div>
          </div>

          {/* Center: District Selector Dropdown */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {INDIAN_METROS.map((city) => (
                <option key={city} value={city} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {city}, India
                </option>
              ))}
            </select>
          </div>

          {/* Right Controls: Unit, 13-Language Picker, Theme Toggle */}
          <div className="flex items-center space-x-2.5">
            {/* Unit Toggle (°C / °F) */}
            <button
              onClick={toggleUnit}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Toggle Unit (°C / °F)"
            >
              °{unit}
            </button>

            {/* Searchable 13 Indian Language Picker */}
            <div className="relative">
              <button
                onClick={() => setLangPickerOpen(!langPickerOpen)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
              >
                <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-extrabold text-blue-700 dark:text-blue-300">{activeLangMeta.name_native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langPickerOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                  <div className="p-1.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center space-x-1.5">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchLangQuery}
                      onChange={(e) => setSearchLangQuery(e.target.value)}
                      placeholder="Search language..."
                      className="w-full text-xs bg-transparent focus:outline-none text-slate-900 dark:text-white"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-0.5">
                    {filteredLangs.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleLanguageSelect(l.code)}
                        className={`w-full px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
                          language === l.code
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="font-semibold">{l.name_native}</span>
                          <span className="text-[10px] text-slate-400">({l.name_english})</span>
                        </span>
                        {language === l.code && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar with full dynamic translation */}
        <div className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none border-t border-slate-100 dark:border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ml-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
