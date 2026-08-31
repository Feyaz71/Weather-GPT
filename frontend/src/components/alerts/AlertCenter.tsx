import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, AlertTriangle, Send, X, Radio } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { weatherService } from '../../services/api';

export const AlertCenter: React.FC = () => {
  const { location, warnings, activeAlerts, dismissAlert, triggerLiveAlertDemo } = useWeather();
  const [district, setDistrict] = useState<string>(location);
  const [identifier, setIdentifier] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    try {
      setLoading(true);
      await weatherService.subscribeToAlerts(district, 'State', identifier);
      setSubscribed(true);
    } catch (err) {
      console.error("Subscription error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              National Meteorological Alert & Warning Broadcast Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-Time Push Dispatches, District Subscriptions & Public Safety Warning Ingestion
          </p>
        </div>

        <button
          onClick={triggerLiveAlertDemo}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-600/25 transition-all"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Dispatch Emergency Warning</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Warnings Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Active Warnings & Dispatched Alerts ({warnings.length + activeAlerts.length})</span>
          </h3>

          {/* Live broadcast events */}
          {activeAlerts.map((alt) => (
            <div
              key={alt.event_id}
              className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/50 shadow-md relative flex items-start space-x-4"
            >
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    ⚡ Live WebSocket Broadcast ({alt.severity})
                  </span>
                  <button
                    onClick={() => dismissAlert(alt.event_id)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{alt.title}</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{alt.description}</p>
                {alt.action_suggested && (
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-300 mt-2">
                    Safety Advisory: {alt.action_suggested}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-amber-200 dark:border-amber-500/20">
                  <span>District: {alt.district}</span>
                  <span>{new Date(alt.issued_at).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Official IMD active warnings */}
          {warnings.map((w) => (
            <div
              key={w.warning_id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-4"
            >
              <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-1 ${
                w.severity === 'RED' ? 'bg-rose-500 shadow-lg shadow-rose-500/50' : 'bg-amber-500 shadow-lg shadow-amber-500/50'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-amber-600 dark:text-amber-400">{w.severity} ALERT</span>
                  <span className="text-slate-400">{w.source}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 mt-1">{w.title}</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{w.description}</p>
                {w.action_suggested && (
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mt-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    Action: {w.action_suggested}
                  </p>
                )}
              </div>
            </div>
          ))}

          {warnings.length === 0 && activeAlerts.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-black text-slate-900 dark:text-slate-100">No Extreme Weather Warnings Active</p>
              <p className="text-slate-400 mt-0.5">District meteorological parameters are currently within normal baseline thresholds.</p>
            </div>
          )}
        </div>

        {/* Subscribe to Alerts Form */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 h-fit">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Emergency Alert Subscription</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Receive automated SMS, Push notifications, and Webhooks when official Orange or Red alerts are issued for your district.
          </p>

          {subscribed ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
              <div className="flex items-center space-x-2 font-bold text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscription Registered!</span>
              </div>
              <p>You will receive instantaneous alerts for {district}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Device ID / Phone / Email / Push Endpoint
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or emergency-ops@imd.gov.in"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Registering...' : 'Activate Alert Subscription'}</span>
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p>• Zero spam, emergency dispatches only.</p>
            <p>• PostGIS spatial filtering matches subscriber boundary.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
