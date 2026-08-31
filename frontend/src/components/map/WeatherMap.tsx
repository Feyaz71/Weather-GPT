import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { Layers, ShieldAlert, Thermometer, CloudRain, Radio, Info, Maximize2 } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';
import { weatherService } from '../../services/api';

const createStationIcon = (temp: number = 30, warning: string = 'GREEN', theme: string = 'dark') => {
  const color =
    warning === 'RED' ? '#ef4444' : warning === 'ORANGE' ? '#f97316' : warning === 'YELLOW' ? '#f59e0b' : '#10b981';

  const bgColor = theme === 'dark' ? '#0f172a' : '#ffffff';
  const textColor = theme === 'dark' ? '#ffffff' : '#0f172a';

  return L.divIcon({
    className: 'custom-station-pin',
    html: `
      <div style="
        background: ${bgColor};
        border: 2px solid ${color};
        color: ${textColor};
        padding: 3px 8px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
      ">
        <span style="width: 7px; height: 7px; border-radius: 50%; background: ${color}; display: inline-block;"></span>
        ${temp}°C
      </div>
    `,
    iconSize: [64, 26],
    iconAnchor: [32, 13]
  });
};

export const WeatherMap: React.FC = () => {
  const { location, setLocation } = useWeather();
  const { theme } = useTheme();
  const [stationGeo, setStationGeo] = useState<any>(null);
  const [warningGeo, setWarningGeo] = useState<any>(null);
  const [showWarnings, setShowWarnings] = useState<boolean>(true);
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  useEffect(() => {
    const loadGISLayers = async () => {
      try {
        const [stations, warnings] = await Promise.all([
          weatherService.getGISStations(),
          weatherService.getGISWarnings()
        ]);
        setStationGeo(stations);
        setWarningGeo(warnings);
      } catch (err) {
        console.error("GIS Layer fetch error", err);
      }
    };
    loadGISLayers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Map Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">National GIS & Warning Geospatial Map</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Interactive IMD Synoptic Observation Network & District Alert Polygons</p>
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowWarnings(!showWarnings)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              showWarnings
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Warning Polygons</span>
          </button>

          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              showStations
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>AWS Stations</span>
          </button>

          <button
            onClick={() => setShowRadar(!showRadar)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              showRadar
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Radar Layer</span>
          </button>
        </div>
      </div>

      {/* Main Map Container & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[650px]">
        {/* Leaflet Map */}
        <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative">
          <MapContainer
            center={[22.5, 78.9]}
            zoom={5}
            style={{ height: '100%', width: '100%', background: theme === 'dark' ? '#090d16' : '#e2e8f0' }}
            scrollWheelZoom={true}
          >
            {/* Free Zero-Key OpenStreetMap Tile Layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & IMD'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Warning Polygons Layer */}
            {showWarnings &&
              warningGeo?.features?.map((feat: any, idx: number) => {
                const props = feat.properties;
                const coords = feat.geometry.coordinates[0].map((c: any) => [c[1], c[0]]);
                const color =
                  props.severity === 'RED'
                    ? '#ef4444'
                    : props.severity === 'ORANGE'
                    ? '#f97316'
                    : props.severity === 'YELLOW'
                    ? '#f59e0b'
                    : '#10b981';

                return (
                  <Polygon
                    key={idx}
                    positions={coords}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.35,
                      weight: 2,
                      dashArray: '4'
                    }}
                    eventHandlers={{
                      click: () => setSelectedFeature(props)
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1 text-slate-900 font-sans">
                        <strong className="text-sm font-bold block">{props.title}</strong>
                        <p className="mt-1">{props.description}</p>
                        <p className="text-slate-500 mt-1">Valid Until: {props.valid_until}</p>
                      </div>
                    </Popup>
                  </Polygon>
                );
              })}

            {/* Station Pins */}
            {showStations &&
              stationGeo?.features?.map((feat: any, idx: number) => {
                const [lon, lat] = feat.geometry.coordinates;
                const props = feat.properties;

                return (
                  <Marker
                    key={idx}
                    position={[lat, lon]}
                    icon={createStationIcon(props.temperature_c, props.warning_level, theme)}
                    eventHandlers={{
                      click: () => {
                        setSelectedFeature(props);
                        setLocation(props.name);
                      }
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1 text-slate-900 font-sans">
                        <strong className="text-sm font-bold block">{props.name} ({props.station_code})</strong>
                        <p className="mt-0.5 font-semibold text-slate-700">
                          {props.temperature_c}°C • {props.weather_condition}
                        </p>
                        <p className="text-slate-600 mt-1">24h Rainfall: {props.rainfall_24h_mm || 0} mm</p>
                        <p className="text-slate-600">Wind: {props.wind_speed_kmh} km/h</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
        </div>

        {/* Selected Layer Inspector Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-4">
              <Info className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-wider">GIS Layer Inspector</h3>
            </div>

            {selectedFeature ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {selectedFeature.name || selectedFeature.district}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedFeature.state} • {selectedFeature.station_code || selectedFeature.category}
                  </p>
                </div>

                {selectedFeature.temperature_c !== undefined && (
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Surface Temp:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{selectedFeature.temperature_c}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Weather Condition:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedFeature.weather_condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">24h Precipitation:</span>
                      <span className="font-bold text-blue-600 dark:text-cyan-400">{selectedFeature.rainfall_24h_mm || 0} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sustained Wind:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedFeature.wind_speed_kmh || 12} km/h</span>
                    </div>
                  </div>
                )}

                {selectedFeature.title && (
                  <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-200 dark:border-amber-500/30 text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
                    <p className="font-bold text-amber-800 dark:text-amber-300">{selectedFeature.title}</p>
                    <p className="text-[11px] opacity-90 leading-relaxed">{selectedFeature.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p>Click on any weather station pin or warning polygon on the map to inspect live parameters.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span><span>Red Alert: Take Action</span></p>
            <p className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span><span>Orange Alert: Be Prepared</span></p>
            <p className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span><span>Yellow Watch: Be Updated</span></p>
            <p className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span><span>Green: Normal Conditions</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
