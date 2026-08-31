import React, { useState, useEffect } from 'react';
import { Compass, Radio, Wind, Gauge, ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useTranslation } from '../../hooks/useTranslation';
import { weatherService } from '../../services/api';
import { CycloneInfo, NearbyWeatherEvent } from '../../types/weather';

export const CycloneNearbyView: React.FC = () => {
  const { location, language } = useWeather();
  const { t } = useTranslation();
  const [cyclones, setCyclones] = useState<CycloneInfo[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<NearbyWeatherEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const isHi = language === 'hi';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cycData, nearData] = await Promise.all([
          weatherService.getActiveCyclones(location),
          weatherService.getNearbyEvents(location, 200)
        ]);
        setCyclones(cycData);
        setNearbyEvents(nearData);
      } catch (err) {
        console.error("Error fetching cyclone and nearby data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {t.cyclone_center_title}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.cyclone_center_desc} ({location})
          </p>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center space-x-1.5">
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-ping" />
          <span>{isHi ? 'लाइव बेसिन टेलीमेट्री' : 'Live Basin Telemetry'}</span>
        </span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-medium">
          {isHi ? 'उत्तर हिंद महासागर के तूफानों की लाइव ट्रैकिंग जारी है...' : 'Tracking North Indian Ocean storms...'}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Tropical Cyclone Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Wind className="w-4 h-4 text-rose-500" />
              <span>{t.active_cyclones} ({cyclones.length})</span>
            </h3>

            {cyclones.map((c) => (
              <div
                key={c.cyclone_id}
                className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      {isHi ? (c.basin.includes('Bay') ? 'बंगाल की खाड़ी' : 'अरब सागर') : c.basin}
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      {isHi ? `उष्णकटिबंधीय चक्रवात ${c.name}` : `Tropical Cyclone ${c.name}`}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-3 py-1 rounded-full font-black bg-rose-100 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30">
                      {isHi ? 'गंभीर चक्रवाती तूफान' : c.current_category}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      ~{c.distance_from_user_km} km {t.distance_from_you}
                    </span>
                  </div>
                </div>

                {/* Metrics Stack */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block font-medium">{isHi ? 'निर्देशांक (Coordinates)' : 'Coordinates'}</span>
                    <span className="text-base font-black text-slate-900 dark:text-slate-100 mt-1 block">
                      {c.current_lat}°N, {c.current_lon}°E
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block font-medium">{t.max_wind}</span>
                    <span className="text-base font-black text-slate-900 dark:text-slate-100 mt-1 block">
                      {c.max_sustained_wind_kmh} km/h ({(c.max_sustained_wind_kmh / 1.852).toFixed(0)} knots)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block font-medium">{t.central_pressure}</span>
                    <span className="text-base font-black text-slate-900 dark:text-slate-100 mt-1 block">
                      {c.estimated_central_pressure_hpa} hPa
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block font-medium">{isHi ? 'गति और दिशा' : 'Movement & Velocity'}</span>
                    <span className="text-base font-black text-slate-900 dark:text-slate-100 mt-1 block">
                      {isHi ? `उत्तर-उत्तरपूर्व (NNE) @ ${c.movement_speed_kmh} km/h` : `${c.movement_direction} @ ${c.movement_speed_kmh} km/h`}
                    </span>
                  </div>
                </div>

                {/* Landfall Bulletin */}
                {c.landfall_forecast && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="font-bold flex items-center space-x-1.5 text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t.landfall_bulletin}</span>
                    </div>
                    <p className="leading-relaxed">
                      {isHi ? 'अगले 18 घंटों के भीतर खेपुपारा और सागर द्वीप के बीच तट को पार करने की संभावना है।' : c.landfall_forecast}
                    </p>
                  </div>
                )}

                {/* Trajectory Waypoints Timeline */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {isHi ? 'पूर्वानुमान एवं ऐतिहासिक प्रक्षेपवक्र बिंदु' : 'Forecast & Historical Trajectory Points'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    {c.track_points.map((tp, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border text-xs space-y-1 text-center ${
                          tp.is_forecast
                            ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-500/40 text-blue-900 dark:text-blue-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {tp.is_forecast ? (isHi ? '🔮 पूर्वानुमान' : '🔮 Forecast') : (isHi ? '📍 अवलोकित' : '📍 Observed')}
                        </span>
                        <div className="font-black text-slate-900 dark:text-white">
                          {tp.latitude}°N, {tp.longitude}°E
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{tp.max_sustained_wind_kmh} km/h</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
                  Source: {c.source}
                </div>
              </div>
            ))}
          </div>

          {/* Nearby Convective Storms & Radar Proximity */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-500" />
              <span>{t.nearby_radar_cells} ({nearbyEvents.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyEvents.map((ev) => (
                <div
                  key={ev.event_id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">
                      {isHi ? 'भीषण आंधी-तूफान (SEVERE THUNDERSTORM)' : ev.event_type.replace('_', ' ')}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {ev.distance_km} km {ev.bearing_compass}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {isHi ? 'बिजली चमकने के साथ सक्रिय संवाहक तूफान रेखा' : ev.headline}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isHi ? '40-50 किमी/घंटा की तेज हवाएं और आंधी; खुले मैदानों में जाने से बचें।' : ev.action_advisory}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{isHi ? `दिशा: दक्षिण-पूर्व (SE) | ${ev.movement_speed_kmh || 30} km/h` : `Moving: ${ev.movement_direction} (${ev.movement_speed_kmh || 30} km/h)`}</span>
                    <span>{isHi ? 'प्रासंगिकता: निकटवर्ती संभावित प्रभाव' : `Relevance: ${ev.relevance.replace('_', ' ')}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
