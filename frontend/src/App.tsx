import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InstallAppBanner } from './components/InstallAppBanner';
import { ChatInterface } from './components/chat/ChatInterface';
import { WeatherDashboard } from './components/dashboard/WeatherDashboard';
import { WeatherMap } from './components/map/WeatherMap';
import { CycloneNearbyView } from './components/cyclone/CycloneNearbyView';
import { AgriAdvisoryView } from './components/advisory/AgriAdvisoryView';
import { DomainAdvisoriesView } from './components/domain/DomainAdvisoriesView';
import { ClimateAnalyticsView } from './components/climate/ClimateAnalyticsView';
import { AlertCenter } from './components/alerts/AlertCenter';
import { WeatherProvider } from './context/WeatherContext';
import { VoiceProvider } from './context/VoiceContext';
import { ThemeProvider } from './context/ThemeContext';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('chat');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white transition-colors pb-16 md:pb-0">
      <InstallAppBanner />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 w-full">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'dashboard' && <WeatherDashboard />}
        {activeTab === 'map' && <WeatherMap />}
        {activeTab === 'cyclone' && <CycloneNearbyView />}
        {activeTab === 'advisory' && <AgriAdvisoryView />}
        {activeTab === 'domains' && <DomainAdvisoriesView />}
        {activeTab === 'climate' && <ClimateAnalyticsView />}
        {activeTab === 'alerts' && <AlertCenter />}
      </main>

      {/* Mobile Native Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modern Executive Footer */}
      <footer className="hidden md:block py-4 px-6 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 text-center text-xs text-slate-500 dark:text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            WeatherGPT National Weather Intelligence Platform &copy; {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-600">
            <span>IMD AWS/Synoptic</span>
            <span>•</span>
            <span>ISRO MOSDAC (INSAT-3D)</span>
            <span>•</span>
            <span>NOAA GFS</span>
            <span>•</span>
            <span>Copernicus ERA5</span>
            <span>•</span>
            <span>NASA POWER</span>
            <span>•</span>
            <span>Open-Meteo Multi-Model</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <VoiceProvider>
          <AppContent />
        </VoiceProvider>
      </WeatherProvider>
    </ThemeProvider>
  );
};

export default App;
