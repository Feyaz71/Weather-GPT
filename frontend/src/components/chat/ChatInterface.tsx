import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Compass,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Database,
  Copy,
  Check,
  Trash2,
  Radio,
  ExternalLink,
  Droplets,
  Wind
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useVoice } from '../../context/VoiceContext';
import { useTranslation } from '../../hooks/useTranslation';
import { weatherService } from '../../services/api';
import { ChatQueryResponse } from '../../types/weather';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  data?: ChatQueryResponse;
}

export const ChatInterface: React.FC = () => {
  const { location, language, currentWeather, warnings, unit } = useWeather();
  const { t } = useTranslation();
  const {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    hasSpeechSupport
  } = useVoice();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId] = useState<string>(() => `sess_${Math.random().toString(36).substring(2, 9)}`);
  const [expandedWhy, setExpandedWhy] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Welcome message initialization
  useEffect(() => {
    if (messages.length === 0) {
      const initialText = language === 'hi'
        ? `नमस्ते! मैं WeatherGPT हूँ — राष्ट्रीय मौसम बुद्धिमत्ता सहायक। आप ${location} या किसी भी भारतीय जिले के मौसम पूर्वानुमान, वर्षा संभावना, आधिकारिक IMD चेतावनी, कृषि सलाह या मॉडल तुलना के बारे में पूछ सकते हैं।`
        : `Welcome to WeatherGPT — India's Authoritative Conversational Weather Intelligence Platform. Query precipitation probabilities, official IMD warnings, agricultural advisories, or multi-model comparisons for ${location} and across all Indian districts.`;

      setMessages([
        {
          id: 'welcome_msg',
          sender: 'assistant',
          text: initialText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [language, location]);

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
      handleSendMessage(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = (msgText || inputMessage).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const resp = await weatherService.postChatQuery(textToSend, sessionId, location, language);
      const assistantMsg: Message = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: resp.response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: resp
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setExpandedWhy((prev) => ({ ...prev, [assistantMsg.id]: true }));
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: language === 'hi'
          ? "मौसम डेटा लोड करने में समस्या आई। कृपया सुनिश्चित करें कि बैकएंड सेवा सक्रिय है।"
          : "An error occurred while retrieving meteorological intelligence. Live IMD synchronization may be in progress.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWhy = (msgId: string) => {
    setExpandedWhy((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const sampleQueries = language === 'hi' ? [
    `क्या कल शाम ${location} में बारिश होगी?`,
    `क्या मुझे कल गेहूं की फसल में सिंचाई करनी चाहिए?`,
    `${location} के लिए IMD और GFS मॉडल तुलना बताएं`,
    `पिछले 10 वर्षों में ${location} के वर्षा के रुझान क्या हैं?`
  ] : [
    `Will it rain tomorrow evening in ${location}?`,
    `Should I irrigate my wheat crop tomorrow in ${location}?`,
    `Compare IMD and GFS forecast for ${location}`,
    `What is the 10-year August rainfall trend in ${location}?`
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)] min-h-[580px]">
        {/* Left / Main Column: Conversational AI Workspace */}
        <div className="lg:col-span-3 flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Conversational Weather Intelligence Engine
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Direct grounding on IMD Synoptic Observation & Numerical NWP Predictions
                </p>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Query Suggestion Pills */}
          <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center space-x-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>Recommended:</span>
            </span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all whitespace-nowrap shadow-xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const qData = msg.data;
              const isWhyOpen = expandedWhy[msg.id] ?? false;

              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4.5 shadow-sm transition-all ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs mb-1.5 opacity-75">
                      <span className="font-bold flex items-center space-x-1.5">
                        {isUser ? (
                          <span>You</span>
                        ) : (
                          <span className="flex items-center text-blue-600 dark:text-blue-400 space-x-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>WeatherGPT</span>
                          </span>
                        )}
                      </span>
                      <span className="text-[10px]">{msg.timestamp}</span>
                    </div>

                    {/* Text Body */}
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                      {msg.text}
                    </div>

                    {/* Structured Intelligence Cards */}
                    {qData && (
                      <div className="mt-3.5 space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                        {/* Active Warning Banner */}
                        {qData.warnings && qData.warnings.length > 0 && (
                          <div className="p-3 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 rounded-xl">
                            <div className="flex items-start space-x-2.5">
                              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                                  {qData.warnings[0].title}
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-200/90 mt-0.5">
                                  {qData.warnings[0].description}
                                </p>
                                {qData.warnings[0].action_suggested && (
                                  <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 mt-1">
                                    Action: {qData.warnings[0].action_suggested}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Meteorological Quick Matrix */}
                        {qData.observation && (
                          <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                            <div className="flex items-center space-x-2">
                              <Thermometer className="w-4 h-4 text-rose-500" />
                              <div>
                                <span className="text-slate-400 text-[10px] block">Temperature</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">
                                  {qData.observation.temperature_c}°C
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <CloudRain className="w-4 h-4 text-sky-500" />
                              <div>
                                <span className="text-slate-400 text-[10px] block">24h Precip</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">
                                  {qData.observation.rainfall_24h_mm || 0} mm
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Compass className="w-4 h-4 text-emerald-500" />
                              <div>
                                <span className="text-slate-400 text-[10px] block">Wind Gusts</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">
                                  {qData.observation.wind_gust_kmh || 15} km/h
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Collapsible Explainability / Ground Truth Section */}
                        {qData.explainability && (
                          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden">
                            <button
                              onClick={() => toggleWhy(msg.id)}
                              className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              <span className="flex items-center space-x-1.5">
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Why? Traceable Meteorological Ground Truth & Factors</span>
                              </span>
                              {isWhyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {isWhyOpen && (
                              <div className="px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 space-y-1.5 bg-slate-50/50 dark:bg-slate-950/60">
                                {qData.explainability.factors.map((factor, fIdx) => (
                                  <div key={fIdx} className="flex items-start space-x-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{factor}</span>
                                  </div>
                                ))}

                                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                                  <span className="flex items-center space-x-1">
                                    <Database className="w-3 h-3 text-slate-400" />
                                    <span>Source: {qData.source_attribution}</span>
                                  </span>
                                  <span>{qData.explainability.data_freshness}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Toolbar */}
                    {!isUser && (
                      <div className="mt-3 flex items-center justify-end space-x-3 text-slate-400 dark:text-slate-500">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="hover:text-slate-700 dark:hover:text-slate-300 flex items-center space-x-1 text-[11px] transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => (isSpeaking ? stopSpeaking() : speakText(msg.text, language))}
                          className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1 text-[11px] transition-colors"
                          title="Listen to audio synthesis"
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-500" />
                              <span className="text-rose-500">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin"></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Querying authoritative IMD stations, computing risk models...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Input Form */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
            >
              {hasSpeechSupport && (
                <button
                  type="button"
                  onClick={() => (isListening ? stopListening() : startListening(language))}
                  className={`p-2.5 rounded-xl transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                  title={isListening ? "Listening... click to stop" : "Voice search"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t.chat_placeholder}
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (Desktop Only): Live Atmospheric Station Telemetry */}
        <div className="hidden lg:flex lg:col-span-1 flex-col space-y-4 h-full">
          {/* Station Overview Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {t.telemetry}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">{location}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentWeather?.location.state}, India
              </p>

              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  {currentWeather?.temperature_c !== undefined ? `${currentWeather.temperature_c}°${unit}` : '--'}
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {currentWeather?.weather_condition}
                </span>
              </div>

              {/* Station Parameters Stack */}
              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    <span>{t.humidity}</span>
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {currentWeather?.humidity_pct || 70}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <Wind className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t.wind_speed}</span>
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {currentWeather?.wind_speed_kmh || 15} km/h
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t.rainfall_24h}</span>
                  </span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    {currentWeather?.rainfall_24h_mm || 0} mm
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
              Station Code: {currentWeather?.location.station_code || 'IMD_AWS_SFD'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
