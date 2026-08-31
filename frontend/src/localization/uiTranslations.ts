export interface TranslationKeys {
  // Navigation
  ai_assistant: string;
  telemetry: string;
  gis_map: string;
  cyclone_nearby: string;
  agromet_portal: string;
  domain_advisories: string;
  climate_trends: string;
  alert_center: string;
  national_synoptic: string;
  models_tagline: string;
  
  // Dashboard & Telemetry
  current_weather: string;
  feels_like: string;
  humidity: string;
  wind_speed: string;
  barometric_pressure: string;
  visibility: string;
  uv_index: string;
  air_quality: string;
  rainfall_24h: string;
  cloud_cover: string;
  forecast_7day: string;
  model_consensus: string;
  model_agreement: string;
  
  // Chat
  chat_placeholder: string;
  chat_welcome_title: string;
  chat_welcome_desc: string;
  listening: string;
  stop_listening: string;
  ask_weather: string;
  sample_q1: string;
  sample_q2: string;
  sample_q3: string;
  
  // Agromet
  kisan_title: string;
  kisan_subtitle: string;
  select_crop: string;
  select_stage: string;
  irrigation_advice: string;
  spray_advice: string;
  harvest_advice: string;
  soil_wetness: string;
  solar_irradiance: string;
  
  // Cyclone & Nearby
  cyclone_center_title: string;
  cyclone_center_desc: string;
  active_cyclones: string;
  nearby_radar_cells: string;
  central_pressure: string;
  max_wind: string;
  landfall_bulletin: string;
  distance_from_you: string;
  
  // Domains
  aviation_title: string;
  marine_title: string;
  disaster_title: string;
  guidelines_title: string;
  
  // Install & Theme
  install_app: string;
  install_desc: string;
}

export const UI_TRANSLATIONS: Record<string, TranslationKeys> = {
  en: {
    ai_assistant: "AI Assistant",
    telemetry: "Telemetry",
    gis_map: "GIS Map",
    cyclone_nearby: "Cyclone & Nearby",
    agromet_portal: "Agromet Portal",
    domain_advisories: "Domain Advisories",
    climate_trends: "Climate Trends",
    alert_center: "Alert Dispatch",
    national_synoptic: "National Synoptic",
    models_tagline: "IMD • GFS • WRF-ARW Multi-Model Intelligence",
    
    current_weather: "Current Synoptic Observation",
    feels_like: "Feels Like",
    humidity: "Relative Humidity",
    wind_speed: "Surface Wind",
    barometric_pressure: "Pressure",
    visibility: "Visibility",
    uv_index: "UV Index",
    air_quality: "Air Quality (AQI)",
    rainfall_24h: "24h Rainfall",
    cloud_cover: "Cloud Cover",
    forecast_7day: "7-Day Numerical Forecast",
    model_consensus: "Multi-Model Consensus",
    model_agreement: "Model Agreement",
    
    chat_placeholder: "Ask anything about weather, rainfall, crops, cyclone...",
    chat_welcome_title: "How can WeatherGPT help you today?",
    chat_welcome_desc: "Real-time grounded weather intelligence powered by IMD, GFS, ISRO MOSDAC & NASA POWER.",
    listening: "Listening to your voice...",
    stop_listening: "Stop Listening",
    ask_weather: "Send Query",
    sample_q1: "Will it rain heavily in Delhi tomorrow?",
    sample_q2: "Is it safe to spray pesticide on wheat crop?",
    sample_q3: "Any cyclone active near Bay of Bengal?",
    
    kisan_title: "Agromet Advisory & Precision Farming Portal",
    kisan_subtitle: "Scientific crop management and weather-driven farming decisions",
    select_crop: "Select Crop",
    select_stage: "Crop Growth Stage",
    irrigation_advice: "Irrigation Directive",
    spray_advice: "Pesticide Spray Directive",
    harvest_advice: "Harvesting & Storage",
    soil_wetness: "Topsoil Moisture (NASA POWER)",
    solar_irradiance: "Surface Solar Irradiance",
    
    cyclone_center_title: "Tropical Cyclone Tracking & Severe Storm Proximity Center",
    cyclone_center_desc: "IMD RSMC Trajectories & Doppler Radar Nowcasts",
    active_cyclones: "Active Tropical Cyclones in Basin",
    nearby_radar_cells: "Doppler Radar Convective Cells within 200 km",
    central_pressure: "Central Pressure",
    max_wind: "Max Sustained Wind",
    landfall_bulletin: "Official IMD Landfall Forecast Bulletin",
    distance_from_you: "from your location",
    
    aviation_title: "Aviation & Aerodrome Guidance",
    marine_title: "Marine & Coastal Waters Advisory",
    disaster_title: "NDMA Emergency Disaster Readiness",
    guidelines_title: "Operational Directives & Action Protocol",
    
    install_app: "Install WeatherGPT App",
    install_desc: "Get instant offline alerts and real-time radar on your home screen"
  },
  
  hi: {
    ai_assistant: "एआई सहायक",
    telemetry: "लाइव मौसम विवरण",
    gis_map: "जीआईएस नक्शा",
    cyclone_nearby: "चक्रवात और रडार",
    agromet_portal: "कृषि मौसम पोर्टल",
    domain_advisories: "विशेषज्ञ परामर्श",
    climate_trends: "जलवायु रुझान",
    alert_center: "चेतावनी केंद्र",
    national_synoptic: "राष्ट्रीय मौसम विज्ञान",
    models_tagline: "आईएमडी • जीएफएस • डब्ल्यूआरएफ मल्टी-मॉडल विश्लेषण",
    
    current_weather: "वर्तमान मौसम स्थिति",
    feels_like: "अनुमानित तापमान",
    humidity: "आर्द्रता (नमी)",
    wind_speed: "हवा की गति",
    barometric_pressure: "वायुमंडलीय दबाव",
    visibility: "दृश्यता",
    uv_index: "यूवी सूचकांक",
    air_quality: "वायु गुणवत्ता (AQI)",
    rainfall_24h: "24 घंटे की वर्षा",
    cloud_cover: "बादलों का आवरण",
    forecast_7day: "7-दिवसीय मौसम पूर्वानुमान",
    model_consensus: "मल्टी-मॉडल सर्वसम्मति",
    model_agreement: "मॉडल सहमति स्तर",
    
    chat_placeholder: "मौसम, बारिश, खेती या चक्रवात के बारे में कुछ भी पूछें...",
    chat_welcome_title: "WeatherGPT आज आपकी क्या सहायता कर सकता है?",
    chat_welcome_desc: "आईएमडी, जीएफएस, इसरो और नासा के आधिकारिक डेटा द्वारा संचालित मौसम बुद्धिमत्ता।",
    listening: "आपकी आवाज सुन रहे हैं...",
    stop_listening: "माइक बंद करें",
    ask_weather: "पूछें",
    sample_q1: "क्या कल दिल्ली में भारी बारिश होगी?",
    sample_q2: "क्या गेहूं की फसल पर कीटनाशक छिड़कना सुरक्षित है?",
    sample_q3: "क्या बंगाल की खाड़ी में कोई चक्रवात सक्रिय है?",
    
    kisan_title: "कृषि-मौसम सलाह एवं सटीक खेती पोर्टल",
    kisan_subtitle: "वैज्ञानिक फसल प्रबंधन और मौसम आधारित कृषि निर्णय",
    select_crop: "फसल चुनें",
    select_stage: "फसल विकास की अवस्था",
    irrigation_advice: "सिंचाई सलाह",
    spray_advice: "कीटनाशक छिड़काव सलाह",
    harvest_advice: "कटाई एवं भंडारण",
    soil_wetness: "मिट्टी की नमी (नासा पावर)",
    solar_irradiance: "सौर विकिरण",
    
    cyclone_center_title: "उष्णकटिबंधीय चक्रवात ट्रैकिंग और तूफान रडार केंद्र",
    cyclone_center_desc: "आईएमडी आरएसएमसी चक्रवात प्रक्षेपवक्र और डॉप्लर रडार स्थिति",
    active_cyclones: "समुद्री बेसिन में सक्रिय चक्रवात",
    nearby_radar_cells: "200 किमी के भीतर डॉप्लर रडार तूफान कोशिकाएं",
    central_pressure: "केंद्रीय दबाव",
    max_wind: "अधिकतम निरंतर हवा",
    landfall_bulletin: "आईएमडी आधिकारिक लैंडफॉल बुलेटिन",
    distance_from_you: "आपकी लोकेशन से दूरी",
    
    aviation_title: "विमानन एवं हवाई अड्डा मौसम मार्गदर्शन",
    marine_title: "समुद्री एवं तटीय जल परामर्श",
    disaster_title: "एनडीएमए आपातकालीन आपदा तैयारी",
    guidelines_title: "परिचालन निर्देश एवं सुरक्षा दिशानिर्देश",
    
    install_app: "WeatherGPT ऐप इंस्टॉल करें",
    install_desc: "लाइव मौसम और रडार अलर्ट सीधे अपने फोन के होम स्क्रीन पर पाएं"
  },

  bn: {
    ai_assistant: "এআই সহকারী",
    telemetry: "আবহাওয়া বিবরণ",
    gis_map: "জিআইএস মানচিত্র",
    cyclone_nearby: "ঘূর্ণিঝড় ও রাডার",
    agromet_portal: "কৃষি আবহাওয়া পোর্টাল",
    domain_advisories: "বিশেষজ্ঞ পরামর্শ",
    climate_trends: "জলবায়ু বিশ্লেষণ",
    alert_center: "সতর্কতা কেন্দ্র",
    national_synoptic: "জাতীয় আবহাওয়া বিজ্ঞান",
    models_tagline: "আইএমডি • জিএফএস • ডব্লিউআরএফ বহু-মডেল বিশ্লেষণ",
    
    current_weather: "বর্তমান আবহাওয়া পর্যবেক্ষণ",
    feels_like: "অনুভূত তাপমাত্রা",
    humidity: "আর্দ্রতা",
    wind_speed: "বাতাসের গতি",
    barometric_pressure: "বায়ুর চাপ",
    visibility: "দৃশ্যমানতা",
    uv_index: "ইউভি সূচক",
    air_quality: "বাতাসের মান (AQI)",
    rainfall_24h: "২৪ ঘণ্টার বৃষ্টিপাত",
    cloud_cover: "মেঘের আচ্ছাদন",
    forecast_7day: "৭ দিনের আবহাওয়া পূর্বাভাস",
    model_consensus: "মাল্টি-মডেল ঐক্যমত",
    model_agreement: "মডেল সম্মতি স্কোর",
    
    chat_placeholder: "আবহাওয়া, বৃষ্টিপাত, কৃষি বা ঘূর্ণিঝড় সম্পর্কে জিজ্ঞাসা করুন...",
    chat_welcome_title: "WeatherGPT আজ আপনাকে কীভাবে সাহায্য করতে পারে?",
    chat_welcome_desc: "আইএমডি, জিএফএস এবং ইসরো উপগ্রহ ডেটা দ্বারা চালিত বুদ্ধিমত্তা।",
    listening: "আপনার কথা শুনছি...",
    stop_listening: "মাইক বন্ধ করুন",
    ask_weather: "পাঠান",
    sample_q1: "কাল কি কলকাতায় ভারী বৃষ্টি হবে?",
    sample_q2: "ফসলে কি এখন কীটনাশক স্প্রে করা নিরাপদ?",
    sample_q3: "বঙ্গোপসাগরে কি কোনো ঘূর্ণিঝড় তৈরি হয়েছে?",
    
    kisan_title: "কৃষি আবহাওয়া পরামর্শ ও নির্ভুল কৃষি পোর্টাল",
    kisan_subtitle: "বৈজ্ঞানিক ফসল ব্যবস্থাপনা এবং আবহাওয়া নির্ভর সিদ্ধান্ত",
    select_crop: "ফসল নির্বাচন করুন",
    select_stage: "ফসলের বৃদ্ধির পর্যায়",
    irrigation_advice: "সেচ সংক্রান্ত নির্দেশ",
    spray_advice: "কীটনাশক প্রয়োগের নির্দেশ",
    harvest_advice: "ফসল কাটা ও সংরক্ষণ",
    soil_wetness: "মাটির আর্দ্রতা সূচক",
    solar_irradiance: "সৌর বিকিরণ",
    
    cyclone_center_title: "ঘূর্ণিঝড় ট্র্যাকিং ও নিকটবর্তী ঝড় রাডার কেন্দ্র",
    cyclone_center_desc: "আইএমডি ট্র্যাজেক্টোরি এবং ডপলার রাডার বুলেটিন",
    active_cyclones: "সক্রিয় ক্রান্তীয় ঘূর্ণিঝড়",
    nearby_radar_cells: "২০০ কিলোমিটারের মধ্যে ডপলার রাডার স্টর্ম সেল",
    central_pressure: "কেন্দ্রীয় বায়ুর চাপ",
    max_wind: "সর্বোচ্চ বাতাসের গতিবেগ",
    landfall_bulletin: "আইএমডি ল্যান্ডফল পূর্বাভাস বুলেটিন",
    distance_from_you: "আপনার অবস্থান থেকে দূরত্ব",
    
    aviation_title: "বিমানচালনা ও বিমানবন্দর নির্দেশিকা",
    marine_title: "সামুদ্রিক ও উপকূলীয় জলের সতর্কতা",
    disaster_title: "এনডিএমএ জরুরি দুর্যোগ প্রস্তুতি",
    guidelines_title: "জরুরি নির্দেশিকা ও সুরক্ষা প্রোটোকল",
    
    install_app: "WeatherGPT অ্যাপ ইনস্টল করুন",
    install_desc: "হোম স্ক্রিনে সরাসরি ইনস্টল করে দ্রুত আবহাওয়া তথ্য পান"
  },

  te: {
    ai_assistant: "AI సహాయకుడు",
    telemetry: "వాతావరణ వివరాలు",
    gis_map: "GIS మ్యాప్",
    cyclone_nearby: "తుఫాను & రాడార్",
    agromet_portal: "వ్యవసాయ వాతావరణం",
    domain_advisories: "డొమైన్ సలహాలు",
    climate_trends: "శీతోష్ణస్థితి పోకడలు",
    alert_center: "హెచ్చరిక కేంద్రం",
    national_synoptic: "జాతీయ వాతావరణ విభాగం",
    models_tagline: "IMD • GFS • WRF మల్టీ-మోడల్ ఇంటెలిజెన్స్",
    
    current_weather: "ప్రస్తుత వాతావరణ పరిశీలన",
    feels_like: "అనిపించే ఉష్ణోగ్రత",
    humidity: "తేమ శాతం",
    wind_speed: "గాలి వేగం",
    barometric_pressure: "వాయు పీడనం",
    visibility: "దృశ్యత",
    uv_index: "UV సూచిక",
    air_quality: "గాలి నాణ్యత (AQI)",
    rainfall_24h: "24 గంటల వర్షపాతం",
    cloud_cover: "మేఘాల కవరేజ్",
    forecast_7day: "7-రోజుల వాతావరణ సూచన",
    model_consensus: "మల్టీ-మోడల్ ఏకాభిప్రాయం",
    model_agreement: "మోడల్ ఒప్పందం",
    
    chat_placeholder: "వాతావరణం, వర్షం, పంటలు లేదా తుఫాను గురించి ఏదైనా అడగండి...",
    chat_welcome_title: "WeatherGPT మీకు ఎలా సహాయం చేయగలదు?",
    chat_welcome_desc: "IMD, GFS, ఇస్రో ఉపగ్రహ డేటాతో కూడిన వాతావరణ సమాచారం.",
    listening: "వినబడుతోంది...",
    stop_listening: "ఆపివేయి",
    ask_weather: "పంపండి",
    sample_q1: "రేపు హైదరాబాద్‌లో భారీ వర్షం పడుతుందా?",
    sample_q2: "పంటలకు పురుగుమందులు పిచికారీ చేయడం సురక్షితమేనా?",
    sample_q3: "బంగాళాఖాతంలో ఏదైనా తుఫాను ఉందా?",
    
    kisan_title: "వ్యవసాయ వాతావరణ సలహా & ఖచ్చితమైన వ్యవసాయం",
    kisan_subtitle: "శాస్త్రీయ పంట నిర్వహణ మరియు వాతావరణ నిర్ణయాలు",
    select_crop: "పంటను ఎంచుకోండి",
    select_stage: "పంట దశ",
    irrigation_advice: "నీటిపారుదల సలహా",
    spray_advice: "పురుగుమందుల పిచికారీ సలహా",
    harvest_advice: "కోత & నిల్వ",
    soil_wetness: "నేల తేమ సూచిక",
    solar_irradiance: "సౌర వికిరణం",
    
    cyclone_center_title: "తుఫాను ట్రాకింగ్ & సమీప తుఫాను రాడార్ కేంద్రం",
    cyclone_center_desc: "IMD తుఫాను మార్గాలు & డాప్లర్ రాడార్ వివరాలు",
    active_cyclones: "సముద్రంలో యాక్టివ్ తుఫానులు",
    nearby_radar_cells: "200 కిమీ పరిధిలోని రాడార్ తుఫానులు",
    central_pressure: "కేంద్ర పీడనం",
    max_wind: "గరిష్ట గాలి వేగం",
    landfall_bulletin: "IMD ల్యాండ్‌ఫాల్ బులెటిన్",
    distance_from_you: "మీ లొకేషన్ నుండి దూరం",
    
    aviation_title: "విమానయాన & విమానాశ్రయ మార్గదర్శకాలు",
    marine_title: "సముద్ర & తీర ప్రాంత హెచ్చరికలు",
    disaster_title: "NDMA అత్యవసర విపత్తు సంసిద్ధత",
    guidelines_title: "భద్రతా మార్గదర్శకాలు & చర్యలు",
    
    install_app: "WeatherGPT యాప్‌ను ఇన్‌స్టాల్ చేయండి",
    install_desc: "హోమ్ స్క్రీన్‌పై ఇన్‌స్టాల్ చేసి సులభంగా యాక్సెస్ చేయండి"
  },

  mr: {
    ai_assistant: "एआय सहाय्यक",
    telemetry: "थेट हवामान तपशील",
    gis_map: "जीआयएस नकाशा",
    cyclone_nearby: "चक्रीवादळ व रडार",
    agromet_portal: "कृषी हवामान पोर्टल",
    domain_advisories: "तज्ज्ञ सल्लागार",
    climate_trends: "हवामान ट्रेंड्स",
    alert_center: "इशारा केंद्र",
    national_synoptic: "राष्ट्रीय हवामान विज्ञान",
    models_tagline: "IMD • GFS • WRF मल्टी-मॉडेल विश्लेषण",
    
    current_weather: "सध्याचे हवामान निरीक्षण",
    feels_like: "जाणवणारे तापमान",
    humidity: "आर्द्रता (हवेतील ओलावा)",
    wind_speed: "वाऱ्याचा वेग",
    barometric_pressure: "हवेचा दाब",
    visibility: "दृश्यमानता",
    uv_index: "युव्ही निर्देशांक",
    air_quality: "हवेची गुणवत्ता (AQI)",
    rainfall_24h: "२४ तासांचा पाऊस",
    cloud_cover: "ढगांचे आच्छादन",
    forecast_7day: "७ दिवसांचा हवामान अंदाज",
    model_consensus: "मल्टी-मॉडेल एकमत",
    model_agreement: "मॉडेल सहमती स्तर",
    
    chat_placeholder: "हवामान, पाऊस, शेती किंवा चक्रीवादळाबद्दल विचारा...",
    chat_welcome_title: "WeatherGPT आज तुम्हाला कशी मदत करू शकते?",
    chat_welcome_desc: "IMD, GFS आणि इस्रो उपग्रहावर आधारित अचूक हवामान बुद्धिमत्ता.",
    listening: "तुमचा आवाज ऐकत आहे...",
    stop_listening: "माईक बंद करा",
    ask_weather: "विचारा",
    sample_q1: "उद्या मुंबईत मुसळधार पाऊस पडेल का?",
    sample_q2: "पिकांवर कीटकनाशक फवारणी करणे सुरक्षित आहे का?",
    sample_q3: "अरबी समुद्रात कोणते चक्रीवादळ सक्रिय आहे का?",
    
    kisan_title: "कृषी हवामान सल्ला व अचूक शेती पोर्टल",
    kisan_subtitle: "वैज्ञानिक पीक व्यवस्थापन आणि हवामानावर आधारित निर्णय",
    select_crop: "पीक निवडा",
    select_stage: "पिकाची वाढीची अवस्था",
    irrigation_advice: "सिंचन सल्ला",
    spray_advice: "कीटकनाशक फवारणी सल्ला",
    harvest_advice: "कापणी आणि साठवणूक",
    soil_wetness: "मातीतील ओलावा",
    solar_irradiance: "सौर विकिरण",
    
    cyclone_center_title: "चक्रीवादळ ट्रॅकिंग आणि स्थानिक वादळ रडार केंद्र",
    cyclone_center_desc: "IMD चक्रीवादळ मार्ग आणि डॉपलर रडार स्थिती",
    active_cyclones: "समुद्रातील सक्रिय चक्रीवादळे",
    nearby_radar_cells: "२०० किमीच्या परिघातील रडार वादळे",
    central_pressure: "केंद्रीत हवेचा दाब",
    max_wind: "वाऱ्याचा कमाल वेग",
    landfall_bulletin: "अधिकृत लँडफॉल बुलेटिन",
    distance_from_you: "तुमच्या ठिकाणापासून अंतर",
    
    aviation_title: "विमान उड्डाण व विमानतळ मार्गदर्शन",
    marine_title: "सागरी व किनारपट्टी हवामान सूचना",
    disaster_title: "आपत्ती व्यवस्थापन सज्जता",
    guidelines_title: "सुरक्षा मार्गदर्शक तत्त्वे",
    
    install_app: "WeatherGPT ॲप इन्स्टॉल करा",
    install_desc: "थेट फोनच्या होम स्क्रीनवर इन्स्टॉल करून जलद वापर करा"
  },

  ta: {
    ai_assistant: "AI உதவியாளர்",
    telemetry: "வானிலை விவரங்கள்",
    gis_map: "GIS வரைபடம்",
    cyclone_nearby: "புயல் & ரேடார்",
    agromet_portal: "வேளாண் வானிலை",
    domain_advisories: "துறை ஆலோசனைகள்",
    climate_trends: "காலநிலை போக்குகள்",
    alert_center: "எச்சரிக்கை மையம்",
    national_synoptic: "தேசிய வானிலை அமைப்பு",
    models_tagline: "IMD • GFS • WRF பல-மாதிரி நுண்ணறிவு",
    
    current_weather: "தற்போதைய வானிலை கண்காணிப்பு",
    feels_like: "உணரப்படும் வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    wind_speed: "காற்றின் வேகம்",
    barometric_pressure: "காற்று அழுத்தம்",
    visibility: "பார்வை தூரம்",
    uv_index: "UV குறியீடு",
    air_quality: "காற்றின் தரம் (AQI)",
    rainfall_24h: "24 மணி நேர மழைப்பொழிவு",
    cloud_cover: "மேக மூட்டம்",
    forecast_7day: "7-நாள் வானிலை முன்னறிவிப்பு",
    model_consensus: "பல-மாதிரி உடன்பாடு",
    model_agreement: "மாதிரி ஒப்பந்த மதிப்பெண்",
    
    chat_placeholder: "வானிலை, மழை, பயிர்கள் அல்லது புயல் பற்றி கேட்கவும்...",
    chat_welcome_title: "WeatherGPT இன்று உங்களுக்கு எப்படி உதவ முடியும்?",
    chat_welcome_desc: "IMD, GFS மற்றும் இஸ்ரோ செயற்கைக்கோள் தரவு சார்ந்த வானிலை தகவல்.",
    listening: "கேட்கிறது...",
    stop_listening: "நிறுத்து",
    ask_weather: "அனுப்பு",
    sample_q1: "நாளை சென்னையில் கனமழை பெய்யுமா?",
    sample_q2: "பயிர்களுக்கு பூச்சிக்கொல்லி தெளிப்பது பாதுகாப்பானதா?",
    sample_q3: "வங்கக்கடலில் புயல் ஏதேனும் உருவாகியுள்ளதா?",
    
    kisan_title: "வேளாண் வானிலை ஆலோசனை & துல்லிய பண்ணையம்",
    kisan_subtitle: "விஞ்ஞான பயிர் மேலாண்மை மற்றும் வானிலை சார்ந்த முடிவுகள்",
    select_crop: "பயிரைத் தேர்ந்தெடுக்கவும்",
    select_stage: "பயிர் வளர்ச்சி நிலை",
    irrigation_advice: "நீர்ப்பாசன ஆலோசனை",
    spray_advice: "பூச்சிக்கொல்லி தெளிக்கும் ஆலோசனை",
    harvest_advice: "அறுவடை & சேமிப்பு",
    soil_wetness: "மண் ஈரப்பத குறியீடு",
    solar_irradiance: "சூரிய கதிர்வீச்சு",
    
    cyclone_center_title: "புயல் கண்காணிப்பு & ரேடார் மையம்",
    cyclone_center_desc: "IMD புயல் பாதை மற்றும் டாப்ளர் ரேடார் தகவல்கள்",
    active_cyclones: "கடலில் உள்ள தீவிர புயல்கள்",
    nearby_radar_cells: "200 கி.மீ தூரத்திற்குள் உள்ள ரேடார் செல்கள்",
    central_pressure: "மைய அழுத்தம்",
    max_wind: "அதிகபட்ச காற்றின் வேகம்",
    landfall_bulletin: "IMD கரையைக் கடக்கும் அறிவிப்பு",
    distance_from_you: "உங்கள் இடத்திலிருந்து தூரம்",
    
    aviation_title: "விமானப் போக்குவரத்து வழிகாட்டுதல்",
    marine_title: "கடல் மற்றும் கடலோர எச்சரிக்கை",
    disaster_title: "பேரிடர் மேலாண்மை தயார்நிலை",
    guidelines_title: "பாதுகாப்பு நெறிமுறைகள்",
    
    install_app: "WeatherGPT செயலியை நிறுவவும்",
    install_desc: "முகப்புத் திரையில் நிறுவி உடனடி எச்சரிக்கைகளைப் பெறுங்கள்"
  },

  gu: {
    ai_assistant: "AI સહાયક",
    telemetry: "હવામાન વિગતો",
    gis_map: "GIS નકશો",
    cyclone_nearby: "વાવાઝોડું અને રડાર",
    agromet_portal: "કૃષિ હવામાન પોર્ટલ",
    domain_advisories: "વિશેષજ્ઞ સલાહ",
    climate_trends: "આબોહવા વલણો",
    alert_center: "ચેતવણી કેન્દ્ર",
    national_synoptic: "રાષ્ટ્રીય હવામાન વિભાગ",
    models_tagline: "IMD • GFS • WRF મલ્ટી-મોડેલ વિશ્લેષણ",
    
    current_weather: "વર્તમાન હવામાન સ્થિતિ",
    feels_like: "અનુભવાતું તાપમાન",
    humidity: "ભેજનું પ્રમાણ",
    wind_speed: "પવનની ગતિ",
    barometric_pressure: "હવાનું દબાણ",
    visibility: "દૃશ્યતા",
    uv_index: "યુવી ઇન્ડેક્સ",
    air_quality: "હવાની ગુણવત્તા (AQI)",
    rainfall_24h: "24 કલાકનો વરસાદ",
    cloud_cover: "વાદળોનું પ્રમાણ",
    forecast_7day: "7-દિવસીય હવામાન આગાહી",
    model_consensus: "મલ્ટી-મોડેલ સર્વસંમતિ",
    model_agreement: "મોડેલ સંમતિ સ્તર",
    
    chat_placeholder: "હવામાન, વરસાદ, ખેતી કે વાવાઝોડા વિશે પૂછો...",
    chat_welcome_title: "WeatherGPT આજે તમને કેવી રીતે મદદ કરી શકે?",
    chat_welcome_desc: "IMD, GFS અને ISRO સેટેલાઇટ ડેટા આધારિત સચોટ હવામાન માહિતી.",
    listening: "સાંભળી રહ્યું છે...",
    stop_listening: "માઇક બંધ કરો",
    ask_weather: "પૂછો",
    sample_q1: "શું કાલે અમદાવાદમાં ભારે વરસાદ પડશે?",
    sample_q2: "પાક પર જંતુનાશક દવાનો છંટકાવ કરવો સુરક્ષિત છે?",
    sample_q3: "અરબી સમુદ્રમાં કોઈ વાવાઝોડું સક્રિય છે?",
    
    kisan_title: "કૃષિ હવામાન સલાહ અને સચોટ ખેતી પોર્ટલ",
    kisan_subtitle: "વૈજ્ઞાનિક પાક વ્યવસ્થાપન અને હવામાન આધારિત નિર્ણયો",
    select_crop: "પાક પસંદ કરો",
    select_stage: "પાક વિકાસ તબક્કો",
    irrigation_advice: "પિયત સલાહ",
    spray_advice: "જંતુનાશક છંટકાવ સલાહ",
    harvest_advice: "લણણી અને સંગ્રહ",
    soil_wetness: "જમીનનો ભેજ",
    solar_irradiance: "સૌર કિરણોત્સર્ગ",
    
    cyclone_center_title: "વાવાઝોડું ટ્રેકિંગ અને તોફાન રડાર કેન્દ્ર",
    cyclone_center_desc: "IMD વાવાઝોડા માર્ગ અને ડોપ્લર રડાર વિગતો",
    active_cyclones: "સક્રિય વાવાઝોડા",
    nearby_radar_cells: "200 કિમી વિસ્તારમાં રડાર તોફાન",
    central_pressure: "કેન્દ્રીય દબાણ",
    max_wind: "મહત્તમ પવન ગતિ",
    landfall_bulletin: "IMD લૅન્ડફૉલ બુલેટિન",
    distance_from_you: "તમારા સ્થાનથી અંતર",
    
    aviation_title: "ઉડ્ડયન અને એરપોર્ટ માર્ગદર્શન",
    marine_title: "દરિયાઈ અને દરિયાકાંઠાની સલાહ",
    disaster_title: "આપત્તિ વ્યવસ્થાપન સજ્જતા",
    guidelines_title: "સુરક્ષા માર્ગદર્શિકા",
    
    install_app: "WeatherGPT એપ ઇન્સ્ટોલ કરો",
    install_desc: "હોમ સ્ક્રીન પર ઇન્સ્ટોલ કરીને ઝડપી હવામાન માહિતી મેળવો"
  },

  ur: {
    ai_assistant: "اے آئی اسسٹنٹ",
    telemetry: "موسمیاتی تفصیلات",
    gis_map: "جی آئی ایس نقشہ",
    cyclone_nearby: "سمندری طوفان اور راڈار",
    agromet_portal: "زرعی موسمیات پورٹل",
    domain_advisories: "ماہرین کی ہدایات",
    climate_trends: "آب و ہوا کے رجحانات",
    alert_center: "انتباہی مرکز",
    national_synoptic: "قومی موسمیاتی ادارہ",
    models_tagline: "IMD • GFS • WRF کثیر ماڈل انٹیلی جنس",
    
    current_weather: "موجودہ موسمی مشاہدہ",
    feels_like: "محسوس شدہ درجہ حرارت",
    humidity: "نمی کا تناسب",
    wind_speed: "ہوا کی رفتار",
    barometric_pressure: "ہوائی دباؤ",
    visibility: "حد نگاہ",
    uv_index: "الٹرا وائلٹ انڈیکس",
    air_quality: "ہوا کا معیار (AQI)",
    rainfall_24h: "24 گھنٹے کی بارش",
    cloud_cover: "بادلوں کا تناسب",
    forecast_7day: "7 دن کی موسمی پیش گوئی",
    model_consensus: "ماڈلز کا باہمی اتفاق",
    model_agreement: "ماڈل معاہدہ اسکور",
    
    chat_placeholder: "موسم، بارش، فصلوں یا طوفان کے بارے میں پوچھیں...",
    chat_welcome_title: "WeatherGPT آج آپ کی کیا مدد کر سکتا ہے؟",
    chat_welcome_desc: "IMD، GFS اور اسرو سیٹلائٹ ڈیٹا پر مبنی مستند موسمیاتی انٹیلی جنس۔",
    listening: "سن رہا ہے...",
    stop_listening: "مائیک بند کریں",
    ask_weather: "ارسال کریں",
    sample_q1: "کیا کل دہلی میں تیز بارش ہوگی؟",
    sample_q2: "کیا فصل پر کیڑے مار دوا چھڑکنا محفوظ ہے؟",
    sample_q3: "کیا خلیج بنگال میں کوئی طوفان سرگرم ہے؟",
    
    kisan_title: "زرعی موسمیاتی مشاورتی پورٹل",
    kisan_subtitle: "سائنسی بنیادوں پر فصلوں کی دیکھ بھال اور زرعی فیصلے",
    select_crop: "فصل منتخب کریں",
    select_stage: "فصل کی نشوونما کا مرحلہ",
    irrigation_advice: "آبپاشی کی ہدایت",
    spray_advice: "اسپرے کی ہدایت",
    harvest_advice: "کٹائی اور ذخیرہ اندوزی",
    soil_wetness: "مٹی میں نمی کا تناسب",
    solar_irradiance: "شمسی تابکاری",
    
    cyclone_center_title: "سمندری طوفان ٹریکنگ اور راڈار سینٹر",
    cyclone_center_desc: "IMD طوفان کے راستے اور ڈوپلر راڈار کی معلومات",
    active_cyclones: "سرگرم سمندری طوفان",
    nearby_radar_cells: "200 کلومیٹر کے اندر راڈار طوفانی خلیات",
    central_pressure: "مرکزی ہوائی دباؤ",
    max_wind: "ہوا کی زیادہ سے زیادہ رفتار",
    landfall_bulletin: "سرکاری لینڈ فال بلیٹن",
    distance_from_you: "آپ کے مقام سے فاصلہ",
    
    aviation_title: "ہوابازی اور ہوائی اڈے کی رہنمائی",
    marine_title: "سمندری اور ساحلی انتباہ",
    disaster_title: "ڈیزاسٹر مینجمنٹ کی تیاری",
    guidelines_title: "حفاظتی ہدایات اور طریقہ کار",
    
    install_app: "WeatherGPT ایپ انسٹال کریں",
    install_desc: "ہوم اسکرین پر انسٹال کر کے براہ راست استعمال کریں"
  },

  kn: {
    ai_assistant: "AI ಸಹಾಯಕ",
    telemetry: "ಹವಾಮಾನ ವಿವರಗಳು",
    gis_map: "GIS ನಕ್ಷೆ",
    cyclone_nearby: "ಚಂಡಮಾರುತ & ರೇಡಾರ್",
    agromet_portal: "ಕೃಷಿ ಹವಾಮಾನ ಪೋರ್ಟಲ್",
    domain_advisories: "ತಜ್ಞರ ಸಲಹೆಗಳು",
    climate_trends: "ಹವಾಮಾನ ಪ್ರವೃತ್ತಿಗಳು",
    alert_center: "ಎಚ್ಚರಿಕೆ ಕೇಂದ್ರ",
    national_synoptic: "ರಾಷ್ಟ್ರೀಯ ಹವಾಮಾನ ವಿಜ್ಞಾನ",
    models_tagline: "IMD • GFS • WRF ಮಲ್ಟಿ-ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ",
    
    current_weather: "ಪ್ರಸ್ತುತ ಹವಾಮಾನ ವೀಕ್ಷಣೆ",
    feels_like: "ಅನುಭವವಾಗುವ ತಾಪಮಾನ",
    humidity: "ಆರ್ದ್ರತೆ (ತೇವಾಂಶ)",
    wind_speed: "ಗಾಳಿಯ ವೇಗ",
    barometric_pressure: "ವಾಯುಭಾರ ಒತ್ತಡ",
    visibility: "ಗೋಚರತೆ",
    uv_index: "UV ಸೂಚ್ಯಂಕ",
    air_quality: "ಗಾಳಿಯ ಗುಣಮಟ್ಟ (AQI)",
    rainfall_24h: "24 ಗಂಟೆಗಳ ಮಳೆ",
    cloud_cover: "ಮೋಡದ ಹೊದಿಕೆ",
    forecast_7day: "7 ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    model_consensus: "ಮಲ್ಟಿ-ಮಾದರಿ ಒಮ್ಮತ",
    model_agreement: "ಮಾದರಿ ಒಪ್ಪಂದದ ಮಟ್ಟ",
    
    chat_placeholder: "ಹವಾಮಾನ, ಮಳೆ, ಬೆಳೆಗಳು ಅಥವಾ ಚಂಡಮಾರುತದ ಬಗ್ಗೆ ಕೇಳಿ...",
    chat_welcome_title: "WeatherGPT ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    chat_welcome_desc: "IMD, GFS ಮತ್ತು ಇಸ್ರೋ ಉಪಗ್ರಹ ಆಧಾರಿತ ಹವಾಮಾನ ಮಾಹಿತಿ.",
    listening: "ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    stop_listening: "ನಿಲ್ಲಿಸಿ",
    ask_weather: "ಕಳುಹಿಸಿ",
    sample_q1: "ನಾಳೆ ಬೆಂಗಳೂರಿನಲ್ಲಿ ಭಾರಿ ಮಳೆಯಾಗಲಿದೆಯೇ?",
    sample_q2: "ಬೆಳೆಗಳಿಗೆ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸುವುದು ಸುರಕ್ಷಿತವೇ?",
    sample_q3: "ಬಂಗಾಳ ಕೊಲ್ಲಿಯಲ್ಲಿ ಯಾವುದಾದರೂ ಚಂಡಮಾರುತ ಸಕ್ರಿಯವಾಗಿದೆಯೇ?",
    
    kisan_title: "ಕೃಷಿ ಹವಾಮಾನ ಸಲಹೆ & ನಿಖರ ಕೃಷಿ ಪೋರ್ಟಲ್",
    kisan_subtitle: "ವೈಜ್ಞಾನಿಕ ಬೆಳೆ ನಿರ್ವಹಣೆ ಮತ್ತು ಹವಾಮಾನ ಆಧಾರಿತ ನಿರ್ಧಾರಗಳು",
    select_crop: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
    select_stage: "ಬೆಳೆ ಬೆಳವಣಿಗೆಯ ಹಂತ",
    irrigation_advice: "ನೀರಾವರಿ ಸಲಹೆ",
    spray_advice: "ಕೀಟನಾಶಕ ಸಿಂಪರಣೆ ಸಲಹೆ",
    harvest_advice: "ಕೊಯ್ಲು ಮತ್ತು ಸಂಗ್ರಹಣೆ",
    soil_wetness: "ಮಣ್ಣಿನ ತೇವಾಂಶ ಸೂಚ್ಯಂಕ",
    solar_irradiance: "ಸೌರ ವಿಕಿರಣ",
    
    cyclone_center_title: "ಚಂಡಮಾರುತ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ರೇಡಾರ್ ಕೇಂದ್ರ",
    cyclone_center_desc: "IMD ಚಂಡಮಾರುತ ಪಥ ಮತ್ತು ಡಾಪ್ಲರ್ ರೇಡಾರ್ ಮಾಹಿತಿ",
    active_cyclones: "ಸಕ್ರಿಯ ಚಂಡಮಾರುತಗಳು",
    nearby_radar_cells: "200 ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ರೇಡಾರ್ ಕೋಶಗಳು",
    central_pressure: "ಕೇಂದ್ರ ವಾಯುಭಾರ",
    max_wind: "ಗರಿಷ್ಠ ಗಾಳಿಯ ವೇಗ",
    landfall_bulletin: "IMD ಲ್ಯಾಂಡ್‌ಫಾಲ್ ಬುಲೆಟಿನ್",
    distance_from_you: "ನಿಮ್ಮ ಸ್ಥಳದಿಂದ ದೂರ",
    
    aviation_title: "ವಿಮಾನಯಾನ ಮತ್ತು ವಿಮಾನ ನಿಲ್ದಾಣ ಮಾರ್ಗದರ್ಶನ",
    marine_title: "ಸಾಗರ ಮತ್ತು ಕರಾವಳಿ ಎಚ್ಚರಿಕೆ",
    disaster_title: "ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಸನ್ನದ್ಧತೆ",
    guidelines_title: "ಸುರಕ್ಷತಾ ಮಾರ್ಗಸೂಚಿಗಳು",
    
    install_app: "WeatherGPT ಅಪ್ಲಿಕೇಶನ್ ಸ್ಥಾಪಿಸಿ",
    install_desc: "ಮುಖಪುಟದಲ್ಲಿ ಸ್ಥಾಪಿಸಿ ನೇರವಾಗಿ ಹವಾಮಾನ ಮಾಹಿತಿ ಪಡೆಯಿರಿ"
  },

  ml: {
    ai_assistant: "AI അസിസ്റ്റന്റ്",
    telemetry: "തത്സമയ കാലാവസ്ഥ",
    gis_map: "ജിഐഎസ് ഭൂപടം",
    cyclone_nearby: "ചുഴലിക്കാറ്റും റഡാറും",
    agromet_portal: "കാർഷിക കാലാവസ്ഥാ പോർട്ടൽ",
    domain_advisories: "വിദഗ്ദ്ധ നിർദ്ദേശങ്ങൾ",
    climate_trends: "കാലാവസ്ഥാ പ്രവണതകൾ",
    alert_center: "മുന്നറിയിപ്പ് കേന്ദ്രം",
    national_synoptic: "ദേശീയ കാലാവസ്ഥാ ശാസ്ത്രം",
    models_tagline: "IMD • GFS • WRF മൾട്ടി-മോഡൽ വിശകലനം",
    
    current_weather: "നിലവിലെ കാലാവസ്ഥാ നിരീക്ഷണം",
    feels_like: "അനുഭവപ്പെടുന്ന താപനില",
    humidity: "ആർദ്രത",
    wind_speed: "കാറ്റിന്റെ വേഗത",
    barometric_pressure: "വായുമർദ്ദം",
    visibility: "കാഴ്ചപരിധി",
    uv_index: "UV സൂചിക",
    air_quality: "വായു ഗുണനിലവാരം (AQI)",
    rainfall_24h: "24 മണിക്കൂർ മഴ",
    cloud_cover: "മേഘാവൃതത",
    forecast_7day: "7 ദിവസത്തെ കാലാവസ്ഥാ പ്രവചനം",
    model_consensus: "മൾട്ടി-മോഡൽ സമവായം",
    model_agreement: "മോഡൽ കരാർ സ്കോർ",
    
    chat_placeholder: "കാലാവസ്ഥ, മഴ, കൃഷി, ചുഴലിക്കാറ്റ് എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
    chat_welcome_title: "WeatherGPT-ക്ക് ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?",
    chat_welcome_desc: "IMD, GFS, ഐഎസ്ആർഒ ഉപഗ്രഹ വിവരങ്ങൾ അടിസ്ഥാനമാക്കിയുള്ള വിവരങ്ങൾ.",
    listening: "ശ്രദ്ധിക്കുന്നു...",
    stop_listening: "നിർത്തുക",
    ask_weather: "അയക്കുക",
    sample_q1: "നാളെ കൊച്ചിയിൽ കനത്ത മഴ പെയ്യുമോ?",
    sample_q2: "വിളകൾക്ക് കീടനാശിനി തളിക്കുന്നത് സുരക്ഷിതമാണോ?",
    sample_q3: "ബംഗാൾ ഉൾക്കടലിൽ എന്തെങ്കിലും ചുഴലിക്കാറ്റ് സജീവമാണോ?",
    
    kisan_title: "കാർഷിക കാലാവസ്ഥാ ഉപദേശക പോർട്ടൽ",
    kisan_subtitle: "ശാസ്ത്രീയ വിള പരിപാലനവും കാലാവസ്ഥാ തീരുമാനങ്ങളും",
    select_crop: "വിള തിരഞ്ഞെടുക്കുക",
    select_stage: "വിളയുടെ വളർച്ചാ ഘട്ടം",
    irrigation_advice: "നനയ്ക്കൽ നിർദ്ദേശം",
    spray_advice: "കീടനാശിനി തളിക്കൽ നിർദ്ദേശം",
    harvest_advice: "വിളവെടുപ്പും സംഭരണവും",
    soil_wetness: "മണ്ണിലെ ഈർപ്പ സൂചിക",
    solar_irradiance: "സൗരവികിരണം",
    
    cyclone_center_title: "ചുഴലിക്കാറ്റ് ട്രാക്കിംഗും റഡാർ കേന്ദ്രവും",
    cyclone_center_desc: "IMD ചുഴലിക്കാറ്റ് പാതയും ഡോപ്ലർ റഡാർ വിവരങ്ങളും",
    active_cyclones: "സജീവ ചുഴലിക്കാറ്റുകൾ",
    nearby_radar_cells: "200 കിലോമീറ്ററിനുള്ളിലെ റഡാർ വിവരങ്ങൾ",
    central_pressure: "കേന്ദ്ര വായുമർദ്ദം",
    max_wind: "പരമാവധി കാറ്റിന്റെ വേഗത",
    landfall_bulletin: "IMD ലാൻഡ്ഫാൾ ബുള്ളറ്റിൻ",
    distance_from_you: "നിങ്ങളുടെ സ്ഥലത്തുനിന്നുള്ള ദൂരം",
    
    aviation_title: "വ്യോമയാന വിമാനത്താവള നിർദ്ദേശങ്ങൾ",
    marine_title: "തീരദേശ സമുദ്ര മുന്നറിയിപ്പ്",
    disaster_title: "ദുരന്ത നിവാരണ സജ്ജീകരണം",
    guidelines_title: "സുരക്ഷാ മാർഗ്ഗനിർദ്ദേശങ്ങൾ",
    
    install_app: "WeatherGPT ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക",
    install_desc: "ഹോം സ്ക്രീനിൽ ഇൻസ്റ്റാൾ ചെയ്ത് തത്സമയ വിവരങ്ങൾ നേടുക"
  },

  pa: {
    ai_assistant: "ਏਆਈ ਸਹਾਇਕ",
    telemetry: "ਲਾਈਵ ਮੌਸਮ ਜਾਣਕਾਰੀ",
    gis_map: "ਜੀਆਈਐਸ ਨਕਸ਼ਾ",
    cyclone_nearby: "ਤੂਫਾਨ ਅਤੇ ਰਡਾਰ",
    agromet_portal: "ਖੇਤੀ ਮੌਸਮ ਪੋਰਟਲ",
    domain_advisories: "ਮਾਹਰ ਸਲਾਹਕਾਰ",
    climate_trends: "ਜਲਵਾਯੂ ਰੁਝਾਨ",
    alert_center: "ਚੇਤਾਵਨੀ ਕੇਂਦਰ",
    national_synoptic: "ਰਾਸ਼ਟਰੀ ਮੌਸਮ ਵਿਗਿਆਨ",
    models_tagline: "IMD • GFS • WRF ਮਲਟੀ-ਮਾਡਲ ਵਿਸ਼ਲੇਸ਼ਣ",
    
    current_weather: "ਮੌਜੂਦਾ ਮੌਸਮ ਸਥਿਤੀ",
    feels_like: "ਮਹਿਸੂਸ ਹੁੰਦਾ ਤਾਪਮਾਨ",
    humidity: "ਨਮੀ (ਸਿੱਲ੍ਹ)",
    wind_speed: "ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ",
    barometric_pressure: "ਹਵਾ ਦਾ ਦਬਾਅ",
    visibility: "ਦਿੱਖਣਯੋਗਤਾ",
    uv_index: "ਯੂਵੀ ਇੰਡੈਕਸ",
    air_quality: "ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ (AQI)",
    rainfall_24h: "24 ਘੰਟੇ ਦੀ ਬਾਰਿਸ਼",
    cloud_cover: "ਬੱਦਲਾਂ ਦਾ ਘੇਰਾ",
    forecast_7day: "7 ਦਿਨਾਂ ਦਾ ਮੌਸਮ ਪੂਰਵ-ਅਨੁਮਾਨ",
    model_consensus: "ਮਲਟੀ-ਮਾਡਲ ਸਹਿਮਤੀ",
    model_agreement: "ਮਾਡਲ ਸਮਝੌਤਾ ਸਕੋਰ",
    
    chat_placeholder: "ਮੌਸਮ, ਮੀਂਹ, ਫਸਲਾਂ ਜਾਂ ਤੂਫ਼ਾਨ ਬਾਰੇ ਪੁੱਛੋ...",
    chat_welcome_title: "WeatherGPT ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ?",
    chat_welcome_desc: "IMD, GFS ਅਤੇ ਇਸਰੋ ਸੈਟੇਲਾਈਟ ਡੇਟਾ ਆਧਾਰਿਤ ਸਟੀਕ ਜਾਣਕਾਰੀ।",
    listening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
    stop_listening: "ਮਾਈਕ ਬੰਦ ਕਰੋ",
    ask_weather: "ਭੇਜੋ",
    sample_q1: "ਕੀ ਕੱਲ੍ਹ ਪੰਜਾਬ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਪਵੇਗਾ?",
    sample_q2: "ਕੀ ਕਣਕ ਦੀ ਫਸਲ ਤੇ ਕੀਟਨਾਸ਼ਕ ਸਪਰੇਅ ਕਰਨਾ ਸੁਰੱਖਿਅਤ ਹੈ?",
    sample_q3: "ਕੀ ਕੋਈ ਤੂਫਾਨ ਸਰਗਰਮ ਹੈ?",
    
    kisan_title: "ਖੇਤੀਬਾੜੀ ਮੌਸਮ ਸਲਾਹਕਾਰੀ ਪੋਰਟਲ",
    kisan_subtitle: "ਵਿਗਿਆਨਕ ਫਸਲ ਪ੍ਰਬੰਧਨ ਅਤੇ ਮੌਸਮ ਆਧਾਰਿਤ ਫੈਸਲੇ",
    select_crop: "ਫਸਲ ਚੁਣੋ",
    select_stage: "ਫਸਲ ਦਾ ਵਾਧਾ ਪੜਾਅ",
    irrigation_advice: "ਸਿੰਚਾਈ ਸੰਬੰਧੀ ਸਲਾਹ",
    spray_advice: "ਸਪਰੇਅ ਸੰਬੰਧੀ ਸਲਾਹ",
    harvest_advice: "ਕਟਾਈ ਅਤੇ ਸਟੋਰੇਜ",
    soil_wetness: "ਮਿੱਟੀ ਦੀ ਨਮੀ",
    solar_irradiance: "ਸੂਰਜੀ ਰੇਡੀਏਸ਼ਨ",
    
    cyclone_center_title: "ਤੂਫਾਨ ਟਰੈਕਿੰਗ ਅਤੇ ਰਡਾਰ ਕੇਂਦਰ",
    cyclone_center_desc: "IMD ਤੂਫਾਨ ਮਾਰਗ ਅਤੇ ਡੋਪਲਰ ਰਡਾਰ ਜਾਣਕਾਰੀ",
    active_cyclones: "ਸਰਗਰਮ ਤੂਫਾਨ",
    nearby_radar_cells: "200 ਕਿਲੋਮੀਟਰ ਦੇ ਦਾਇਰੇ ਵਿੱਚ ਰਡਾਰ ਤੂਫਾਨ",
    central_pressure: "ਕੇਂਦਰੀ ਹਵਾ ਦਾ ਦਬਾਅ",
    max_wind: "ਵੱਧ ਤੋਂ ਵੱਧ ਹਵਾ ਦੀ ਰਫਤਾਰ",
    landfall_bulletin: "ਅਧਿਕਾਰਤ ਲੈਂਡਫਾਲ ਬੁਲੇਟਿਨ",
    distance_from_you: "ਤੁਹਾਡੇ ਸਥਾਨ ਤੋਂ ਦੂਰੀ",
    
    aviation_title: "ਹਵਾਬਾਜ਼ੀ ਅਤੇ ਹਵਾਈ ਅੱਡਾ ਮਾਰਗਦਰਸ਼ਨ",
    marine_title: "ਸਮੁੰਦਰੀ ਅਤੇ ਤੱਟਵਰਤੀ ਚੇਤਾਵਨੀ",
    disaster_title: "ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਤਿਆਰੀ",
    guidelines_title: "ਸੁਰੱਖਿਆ ਨਿਰਦੇਸ਼",
    
    install_app: "WeatherGPT ਐਪ ਇੰਸਟਾਲ ਕਰੋ",
    install_desc: "ਸਿੱਧਾ ਫ਼ੋਨ ਸਕ੍ਰੀਨ 'ਤੇ ਇੰਸਟਾਲ ਕਰਕੇ ਲਾਈਵ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ"
  },

  or: {
    ai_assistant: "AI ସହାୟକ",
    telemetry: "ପାଣିପାଗ ବିବରଣୀ",
    gis_map: "GIS ମାନଚିତ୍ର",
    cyclone_nearby: "ବାତ୍ୟା ଏବଂ ରାଡାର",
    agromet_portal: "କୃଷି ପାଣିପାଗ ପୋର୍ଟାଲ",
    domain_advisories: "ବିଶେଷଜ୍ଞ ପରାମର୍ଶ",
    climate_trends: "ଜଳବାୟୁ ଧାରା",
    alert_center: "ଚେତାବନୀ କେନ୍ଦ୍ର",
    national_synoptic: "ଜାତୀୟ ପାଣିପାଗ ବିଭାଗ",
    models_tagline: "IMD • GFS • WRF ମଲ୍ଟି-ମଡେଲ ବିଶ୍ଳେଷଣ",
    
    current_weather: "ବର୍ତ୍ତମାନର ପାଣିପାଗ ସ୍ଥିତି",
    feels_like: "ଅନୁଭୂତ ତାପମାତ୍ରା",
    humidity: "ଆର୍ଦ୍ରତା (ଓଦାଳିଆପଣ)",
    wind_speed: "ପବନର ବେଗ",
    barometric_pressure: "ବାୟୁମଣ୍ଡଳୀୟ ଚାପ",
    visibility: "ଦୃଶ୍ୟମାନତା",
    uv_index: "UV ସୂଚକାଙ୍କ",
    air_quality: "ବାୟୁ ଗୁଣବତ୍ତା (AQI)",
    rainfall_24h: "୨୪ ଘଣ୍ଟାର ବର୍ଷା",
    cloud_cover: "ମେଘାବୃତ ସ୍ଥିତି",
    forecast_7day: "୭ ଦିନିଆ ପାଣିପାଗ ପୂର୍ବାନୁମାନ",
    model_consensus: "ମଲ୍ଟି-ମଡେଲ ସହମତି",
    model_agreement: "ମଡେଲ ସହମତି ସ୍କୋର",
    
    chat_placeholder: "ପାଣିପାଗ, ବର୍ଷା, ଫସଲ କିମ୍ବା ବାତ୍ୟା ବିଷୟରେ ପଚାରନ୍ତୁ...",
    chat_welcome_title: "WeatherGPT ଆଜି ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବ?",
    chat_welcome_desc: "IMD, GFS ଏବଂ ଇସ୍ରୋ ଉପଗ୍ରହ ତଥ୍ୟ ଉପରେ ଆଧାରିତ ପାଣିପାଗ ସୂଚନା।",
    listening: "ଶୁଣୁଛି...",
    stop_listening: "ବନ୍ଦ କରନ୍ତୁ",
    ask_weather: "ପଚାରନ୍ତୁ",
    sample_q1: "ଆସନ୍ତାକାଲି ଭୁବନେଶ୍ୱରରେ ପ୍ରବଳ ବର୍ଷା ହେବ କି?",
    sample_q2: "ଫସଲରେ କୀଟନାଶକ ପ୍ରୟୋଗ କରିବା ସୁରକ୍ଷିତ କି?",
    sample_q3: "ବଙ୍ଗୋପସାଗରରେ କୌଣସି ବାତ୍ୟା ସକ୍ରିୟ ଅଛି କି?",
    
    kisan_title: "କୃଷି ପାଣିପାଗ ପରାମର୍ଶ ପୋର୍ଟାଲ",
    kisan_subtitle: "ବୈଜ୍ଞାନିକ ଫସଲ ପରିଚାଳନା ଏବଂ ପାଣିପାଗ ଆଧାରିତ ନିଷ୍ପତ୍ତି",
    select_crop: "ଫସଲ ଚୟନ କରନ୍ତୁ",
    select_stage: "ଫସଲ ବୃଦ୍ଧି ପର୍ଯ୍ୟାୟ",
    irrigation_advice: "ଜଳସେଚନ ପରାମର୍ଶ",
    spray_advice: "କୀଟନାଶକ ସ୍ପ୍ରେ ପରାମର୍ଶ",
    harvest_advice: "ଅମଳ ଏବଂ ସଂରକ୍ଷଣ",
    soil_wetness: "ମାଟିର ଆର୍ଦ୍ରତା ସୂଚକାଙ୍କ",
    solar_irradiance: "ସୌର ବିକିରଣ",
    
    cyclone_center_title: "ବାତ୍ୟା ଟ୍ରାକିଂ ଏବଂ ରାଡାର କେନ୍ଦ୍ର",
    cyclone_center_desc: "IMD ବାତ୍ୟା ଗତିପଥ ଏବଂ ଡପଲର ରାଡାର ବିବରଣୀ",
    active_cyclones: "ସକ୍ରିୟ ବାତ୍ୟା",
    nearby_radar_cells: "୨୦୦ କିମି ମଧ୍ୟରେ ରାଡାର ବାତ୍ୟା କୋଷ",
    central_pressure: "କେନ୍ଦ୍ରୀୟ ଚାପ",
    max_wind: "ସର୍ବାଧିକ ପବନର ବେଗ",
    landfall_bulletin: "IMD ସ୍ଥଳଭାଗ ଛୁଇଁବା ବୁଲେଟିନ",
    distance_from_you: "ଆପଣଙ୍କ ସ୍ଥାନରୁ ଦୂରତା",
    
    aviation_title: "ବିମାନ ଚଳାଚଳ ଓ ବିମାନବନ୍ଦର ମାର୍ଗଦର୍ଶିକା",
    marine_title: "ସାମୁଦ୍ରିକ ଓ ଉପକୂଳବର୍ତ୍ତୀ ସତର୍କତା",
    disaster_title: "ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ପ୍ରସ୍ତୁତି",
    guidelines_title: "ସୁରକ୍ଷା ନିର୍ଦ୍ଦେଶାବଳୀ",
    
    install_app: "WeatherGPT ଆପ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ",
    install_desc: "ଫୋନରେ ଇନଷ୍ଟଲ୍ କରି ତୁରନ୍ତ ପାଣିପାଗ ସତର୍କତା ପାଆନ୍ତୁ"
  },

  as: {
    ai_assistant: "AI সহায়ক",
    telemetry: "বতৰৰ তথ্য",
    gis_map: "GIS মানচিত্ৰ",
    cyclone_nearby: "ঘূৰ্ণীবতাহ আৰু ৰাডাৰ",
    agromet_portal: "কৃষি বতৰ বিজ্ঞান",
    domain_advisories: "বিশেষজ্ঞ পৰামৰ্শ",
    climate_trends: "জলবায়ু ধাৰা",
    alert_center: "সতৰ্কতা কেন্দ্ৰ",
    national_synoptic: "ৰাষ্ট্ৰীয় বতৰ বিজ্ঞান",
    models_tagline: "IMD • GFS • WRF বহু-মডেল বিশ্লেষণ",
    
    current_weather: "বৰ্তমানৰ বতৰ পৰ্যবেক্ষণ",
    feels_like: "অনুভৱ হোৱা উষ্ণতা",
    humidity: "আৰ্দ্ৰতা",
    wind_speed: "বতাহৰ গতি",
    barometric_pressure: "বায়ুৰ চাপ",
    visibility: "দৃশ্যমানতা",
    uv_index: "UV সূচক",
    air_quality: "বায়ুৰ গুণমান (AQI)",
    rainfall_24h: "২৪ ঘণ্টাৰ বৰষুণ",
    cloud_cover: "মেঘৰ আৱৰণ",
    forecast_7day: "৭ দিনৰ বতৰৰ পূৰ্বাভাস",
    model_consensus: "মাল্টি-মডেল সহমত",
    model_agreement: "মডেল চুক্তি স্কোৰ",
    
    chat_placeholder: "বতৰ, বৰষুণ, খেতি বা ঘূৰ্ণীবতাহৰ বিষয়ে সোধক...",
    chat_welcome_title: "WeatherGPT-য়ে আজি আপোনাক কেনেকৈ সহায় কৰিব পাৰে?",
    chat_welcome_desc: "IMD, GFS আৰু ইছৰো উপগ্ৰহ তথ্যৰ ওপৰত আধাৰিত বতৰ বিজ্ঞান।",
    listening: "শুনি আছো...",
    stop_listening: "মাইক বন্ধ কৰক",
    ask_weather: "পঠিয়াওক",
    sample_q1: "কাইলৈ গুৱাহাটীত প্ৰবল বৰষুণ হ'ব নেকি?",
    sample_q2: "শস্যত কীটনাশক প্ৰয়োগ কৰাটো নিৰাপদ নেকি?",
    sample_q3: "বংগোপসাগৰত কোনো ধুমুহা সক্ৰিয় হৈ আছে নেকি?",
    
    kisan_title: "কৃষি বতৰ বিজ্ঞান পৰামৰ্শ পোৰ্টেল",
    kisan_subtitle: "বৈজ্ঞানিক শস্য ব্যৱস্থাপনা আৰু বতৰ ভিত্তিক সিদ্ধান্ত",
    select_crop: "শস্য বাছক",
    select_stage: "শস্য বৃদ্ধিৰ পৰ্যায়",
    irrigation_advice: "জলসিঞ্চন পৰামৰ্শ",
    spray_advice: "কীটনাশক ছটিওৱাৰ পৰামৰ্শ",
    harvest_advice: "শস্য চপোৱা আৰু সংৰক্ষণ",
    soil_wetness: "মাটিৰ আৰ্দ্ৰতা সূচক",
    solar_irradiance: "সৌৰ বিকিৰণ",
    
    cyclone_center_title: "ঘূৰ্ণীবতাহ ট্ৰেকিং আৰু ৰাডাৰ কেন্দ্ৰ",
    cyclone_center_desc: "IMD ঘূৰ্ণীবতাহৰ গতিপথ আৰু ডপলাৰ ৰাডাৰ তথ্য",
    active_cyclones: "সক্ৰিয় ঘূৰ্ণীবতাহ",
    nearby_radar_cells: "২০০ কিমি ব্যাসাৰ্ধত ৰাডাৰ ধুমুহা",
    central_pressure: "কেন্দ্ৰীয় বায়ুৰ চাপ",
    max_wind: "সৰ্বাধিক বতাহৰ গতি",
    landfall_bulletin: "IMD লেণ্ডফল বুলেটিন",
    distance_from_you: "আপোনাৰ স্থানৰ পৰা দূৰত্ব",
    
    aviation_title: "বিমান পৰিবহণ আৰু বিমানবন্দৰ নিৰ্দেশনা",
    marine_title: "সামুদ্ৰিক আৰু উপকূলীয় সতৰ্কতা",
    disaster_title: "দুৰ্যোগ ব্যৱস্থাপনা প্ৰস্তুতি",
    guidelines_title: "সুৰক্ষা নীতি-নিৰ্দেশনা",
    
    install_app: "WeatherGPT এপ ইনষ্টল কৰক",
    install_desc: "হ'ম স্ক্ৰীণত ইনষ্টল কৰি ক্ষিপ্ৰভাৱে বতৰৰ তথ্য লাভ কৰক"
  }
};

export const getTranslation = (langCode: string): TranslationKeys => {
  return UI_TRANSLATIONS[langCode] || UI_TRANSLATIONS['en'];
};
