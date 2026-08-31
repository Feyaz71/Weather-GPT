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

const HINDI_CONDITIONS: Record<string, string> = {
  'Thunderstorm with Moderate Rain': 'मध्यम वर्षा के साथ आंधी और गरज-चमक',
  'Thunderstorm with Heavy Rain': 'भारी वर्षा के साथ भीषण आंधी-तूफान',
  'Partly Cloudy': 'आंशिक रूप से बादल',
  'Mostly Cloudy': 'अधिकांशतः बादल छाए रहेंगे',
  'Overcast': 'घने बादल',
  'Clear Sky': 'साफ मौसम / धूप',
  'Sunny': 'चमकदार धूप',
  'Moderate Rain': 'मध्यम बारिश',
  'Heavy Rain': 'भारी बारिश',
  'Light Rain': 'हल्की फुहारें / बूंदाबांदी',
  'Drizzle': 'हल्की बूंदाबांदी',
  'Fog': 'घना कोहरा',
  'Mist': 'हल्का कोहरा / धुंध',
  'Haze': 'धुंध'
};

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

  const isHi = language === 'hi';

  const translateCondition = (cond?: string) => {
    if (!cond) return isHi ? 'आंशिक रूप से बादल' : 'Partly Cloudy';
    if (isHi && HINDI_CONDITIONS[cond]) return HINDI_CONDITIONS[cond];
    return cond;
  };

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
      const initialText = isHi
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
    }
  }, [transcript]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || loading) return;

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
      const res = await weatherService.postChatQuery(textToSend, sessionId, location, language);
      const assistantMsg: Message = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: res.response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: res
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setExpandedWhy((prev) => ({ ...prev, [assistantMsg.id]: true }));

      // Auto TTS if user sent via voice
      if (isListening || transcript) {
        speakText(res.response_text, language);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: isHi
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

  const sampleQueries = isHi ? [
    `क्या कल शाम ${location} में बारिश होगी?`,
    `क्या मुझे कल ${location} में गेहूं की फसल में सिंचाई करनी चाहिए?`,
    `${location} के लिए IMD और GFS मॉडल तुलना बताएं`,
    `${location} में चक्रवात या आंधी का कोई खतरा है?`
  ] : [
    `Will it rain tomorrow evening in ${location}?`,
    `Should I irrigate my wheat crop tomorrow in ${location}?`,
    `Compare IMD and GFS forecast for ${location}`,
    `Any severe cyclone or storm warning for ${location}?`
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 h-[calc(100dvh-12rem)] md:h-[calc(100vh-9.5rem)] min-h-[520px]">
        {/* Left / Main Column: Conversational AI Workspace */}
        <div className="lg:col-span-3 flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isHi ? 'संवादात्मक मौसम बुद्धिमत्ता इंजन' : 'Conversational Weather Intelligence Engine'}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-md">
                  {isHi ? 'आईएमडी सिनॉप्टिक डेटा और संख्यात्मक एनडब्ल्यूपी भविष्यवाणियों पर आधारित' : 'Direct grounding on IMD Synoptic Observation & Numerical NWP Predictions'}
                </p>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isHi ? 'वार्तालाप साफ़ करें' : 'Clear conversation'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Query Suggestion Pills */}
          <div className="px-4 sm:px-5 py-2.5 bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center space-x-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center space-x-1 shrink-0">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>{isHi ? 'सुझाए गए प्रश्न:' : 'Recommended:'}</span>
            </span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all whitespace-nowrap shadow-xs shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const qData = msg.data;
              const isWhyOpen = expandedWhy[msg.id] ?? false;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 sm:space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      isUser
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isUser ? 'U' : 'AI'}
                  </div>

                  <div className={`max-w-[88%] sm:max-w-[82%] space-y-2`}>
                    <div
                      className={`p-4 sm:p-4.5 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80 font-normal'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>

                    {!isUser && qData && (
                      <div className="space-y-2.5 pt-1">
                        {qData.warnings && qData.warnings.length > 0 && (
                          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-1 text-xs">
                            <div className="font-bold flex items-center space-x-1.5 text-amber-800 dark:text-amber-300">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span className="font-black uppercase">
                                {isHi ? (qData.warnings[0].severity === 'ORANGE' ? 'नारंगी चेतावनी (ORANGE ALERT)' : qData.warnings[0].severity === 'RED' ? 'लाल चेतावनी (RED ALERT)' : 'पीली चेतावनी (YELLOW ALERT)') : `${qData.warnings[0].severity} Warning`}
                              </span>
                            </div>
                            <p className="font-semibold text-xs">{qData.warnings[0].title}</p>
                            {qData.warnings[0].action_suggested && (
                              <p className="text-[11px] opacity-90">
                                <strong>{isHi ? 'सार्वजनिक सुरक्षा सलाह:' : 'Action:'}</strong> {qData.warnings[0].action_suggested}
                              </p>
                            )}
                          </div>
                        )}

                        {qData.observation && (
                          <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-900/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
                            <div className="flex items-center space-x-2">
                              <Thermometer className="w-4 h-4 text-rose-500 shrink-0" />
                              <div>
                                <span className="text-slate-400 text-[10px] block font-medium">
                                  {isHi ? 'तापमान' : 'Temperature'}
                                </span>
                                <span className="font-black text-slate-800 dark:text-slate-100">
                                  {qData.observation.temperature_c}°C
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <CloudRain className="w-4 h-4 text-sky-500 shrink-0" />
                              <div>
                                <span className="text-slate-400 text-[10px] block font-medium">
                                  {isHi ? '24h वर्षा' : '24h Precip'}
                                </span>
                                <span className="font-black text-slate-800 dark:text-slate-100">
                                  {qData.observation.rainfall_24h_mm || 0} mm
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Compass className="w-4 h-4 text-emerald-500 shrink-0" />
                              <div>
                                <span className="text-slate-400 text-[10px] block font-medium">
                                  {isHi ? 'हवा के झोंके' : 'Wind Gusts'}
                                </span>
                                <span className="font-black text-slate-800 dark:text-slate-100">
                                  {qData.observation.wind_gust_kmh || 15} km/h
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {qData.explainability && (
                          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs">
                            <button
                              onClick={() => toggleWhy(msg.id)}
                              className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                            >
                              <span className="flex items-center space-x-1.5">
                                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{isHi ? 'वैज्ञानिक कारण: आधिकारिक मौसमी कारक व आधार' : 'Why? Traceable Meteorological Ground Truth & Factors'}</span>
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
                                    <span>{isHi ? 'स्रोत:' : 'Source:'} {qData.source_attribution}</span>
                                  </span>
                                  <span>{qData.explainability.data_freshness}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {!isUser && (
                      <div className="mt-2 flex items-center justify-end space-x-3 text-slate-400 dark:text-slate-500">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="hover:text-slate-700 dark:hover:text-slate-300 flex items-center space-x-1 text-[11px] font-medium transition-colors cursor-pointer"
                          title={isHi ? 'कॉपी करें' : 'Copy response'}
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">{isHi ? 'कॉपी हो गया' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isHi ? 'कॉपी' : 'Copy'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => (isSpeaking ? stopSpeaking() : speakText(msg.text, language))}
                          className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-1 text-[11px] font-medium transition-colors cursor-pointer"
                          title={isHi ? 'ऑडियो सुनें' : 'Listen to audio synthesis'}
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-500" />
                              <span className="text-rose-500">{isHi ? 'रोकें' : 'Stop'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>{isHi ? 'सुनें' : 'Listen'}</span>
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
              <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
                <span>
                  {isHi ? 'आईएमडी और जीएफएस से वास्तविक समय डेटा संसाधित हो रहा है...' : 'Retrieving grounded NWP models & synoptic observations...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 sm:p-4 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
            >
              {hasSpeechSupport && (
                <button
                  type="button"
                  onClick={() => (isListening ? stopListening() : startListening(language))}
                  className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={isListening ? (isHi ? 'माइक बंद करें' : 'Stop listening') : (isHi ? 'बोलकर पूछें' : 'Speak voice input')}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isHi ? `${location}, बारिश, फसल या चक्रवात के बारे में कुछ भी पूछें...` : `Ask anything about weather, rainfall, crops, cyclone in ${location}...`}
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex lg:col-span-1 flex-col space-y-4 h-full">
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
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-right">
                  {translateCondition(currentWeather?.weather_condition)}
                </span>
              </div>

              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    <span>{t.humidity}</span>
                  </span>
                  <span className="font-black text-slate-800 dark:text-slate-200">
                    {currentWeather?.humidity_pct || 70}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <Wind className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t.wind_speed}</span>
                  </span>
                  <span className="font-black text-slate-800 dark:text-slate-200">
                    {currentWeather?.wind_speed_kmh || 15} km/h
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
                  <span className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t.rainfall_24h}</span>
                  </span>
                  <span className="font-black text-cyan-600 dark:text-cyan-400">
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
