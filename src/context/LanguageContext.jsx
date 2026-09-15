import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    dashboard: "Dashboard", map: "Risk Map", alerts: "Alerts", community: "Community", waterTests: "Water Tests", history: "History", logout: "Logout",
    appName: "EpiStream", tagline: "Community Health Early Warning Dashboard",
    activeAlerts: "Active Alerts", villagesMonitored: "Villages Monitored", reportsLive: "Reports (Live)", waterTestsLogged: "Water Tests Logged",
    recentReports: "Recent Reports", noReportsYet: "No reports yet.",
    reportSymptoms: "Report Symptoms", villageArea: "Village / Area", symptom: "Symptom", severity: "Severity", submitReport: "Submit Report", reportSubmitted: "Report submitted!",
    diarrhea: "Diarrhea", vomiting: "Vomiting", fever: "Fever", jaundice: "Jaundice", mild: "Mild", moderate: "Moderate", severe: "Severe",
    waterTestEntry: "Water Test Entry", phLevel: "pH Level", turbidity: "Turbidity (NTU)", tds: "TDS (ppm)", submitTest: "Submit Test", testLogged: "Test logged!",
    incidentHistory: "Incident History", riskMap: "Risk Map",
    reportsInLast7Days: "report(s) in last 7 days",
    resolved: "Resolved", active: "Active", monitoring: "Monitoring",
    low: "Low", medium: "Medium", high: "High",
  },
  hi: {
    dashboard: "डैशबोर्ड", map: "जोखिम मानचित्र", alerts: "अलर्ट", community: "समुदाय", waterTests: "जल परीक्षण", history: "इतिहास", logout: "लॉगआउट",
    appName: "एपिस्ट्रीम", tagline: "सामुदायिक स्वास्थ्य पूर्व चेतावनी डैशबोर्ड",
    activeAlerts: "सक्रिय अलर्ट", villagesMonitored: "निगरानी किए गए गांव", reportsLive: "रिपोर्ट (लाइव)", waterTestsLogged: "जल परीक्षण दर्ज",
    recentReports: "हाल की रिपोर्ट", noReportsYet: "अभी तक कोई रिपोर्ट नहीं।",
    reportSymptoms: "लक्षण रिपोर्ट करें", villageArea: "गांव / क्षेत्र", symptom: "लक्षण", severity: "गंभीरता", submitReport: "रिपोर्ट सबमिट करें", reportSubmitted: "रिपोर्ट सबमिट हो गई!",
    diarrhea: "दस्त", vomiting: "उल्टी", fever: "बुखार", jaundice: "पीलिया", mild: "हल्का", moderate: "मध्यम", severe: "गंभीर",
    waterTestEntry: "जल परीक्षण प्रविष्टि", phLevel: "पीएच स्तर", turbidity: "टर्बिडिटी (NTU)", tds: "टीडीएस (ppm)", submitTest: "परीक्षण सबमिट करें", testLogged: "परीक्षण दर्ज हुआ!",
    incidentHistory: "घटना इतिहास", riskMap: "जोखिम मानचित्र",
    reportsInLast7Days: "पिछले 7 दिनों में रिपोर्ट",
    resolved: "हल हो गया", active: "सक्रिय", monitoring: "निगरानी में",
    low: "कम", medium: "मध्यम", high: "उच्च",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড", map: "ঝুঁকি মানচিত্র", alerts: "সতর্কতা", community: "সম্প্রদায়", waterTests: "জল পরীক্ষা", history: "ইতিহাস", logout: "লগআউট",
    appName: "এপিস্ট্রিম", tagline: "সম্প্রদায় স্বাস্থ্য পূর্ব সতর্কতা ড্যাশবোর্ড",
    activeAlerts: "সক্রিয় সতর্কতা", villagesMonitored: "পর্যবেক্ষিত গ্রাম", reportsLive: "রিপোর্ট (লাইভ)", waterTestsLogged: "জল পরীক্ষা লগ",
    recentReports: "সাম্প্রতিক রিপোর্ট", noReportsYet: "এখনও কোনো রিপোর্ট নেই।",
    reportSymptoms: "লক্ষণ রিপোর্ট করুন", villageArea: "গ্রাম / এলাকা", symptom: "লক্ষণ", severity: "তীব্রতা", submitReport: "রিপোর্ট জমা দিন", reportSubmitted: "রিপোর্ট জমা হয়েছে!",
    diarrhea: "ডায়রিয়া", vomiting: "বমি", fever: "জ্বর", jaundice: "জন্ডিস", mild: "হালকা", moderate: "মাঝারি", severe: "গুরুতর",
    waterTestEntry: "জল পরীক্ষা এন্ট্রি", phLevel: "পিএইচ স্তর", turbidity: "টার্বিডিটি (NTU)", tds: "টিডিএস (ppm)", submitTest: "পরীক্ষা জমা দিন", testLogged: "পরীক্ষা লগ হয়েছে!",
    incidentHistory: "ঘটনার ইতিহাস", riskMap: "ঝুঁকি মানচিত্র",
    reportsInLast7Days: "গত ৭ দিনে রিপোর্ট",
    resolved: "সমাধান হয়েছে", active: "সক্রিয়", monitoring: "পর্যবেক্ষণে",
    low: "কম", medium: "মাঝারি", high: "উচ্চ",
  },
  ta: {
    dashboard: "டாஷ்போர்டு", map: "ஆபத்து வரைபடம்", alerts: "எச்சரிக்கைகள்", community: "சமூகம்", waterTests: "நீர் பரிசோதனை", history: "வரலாறு", logout: "வெளியேறு",
    appName: "எபிஸ்ட்ரீம்", tagline: "சமூக சுகாதார முன்னெச்சரிக்கை டாஷ்போர்டு",
    activeAlerts: "செயலில் உள்ள எச்சரிக்கைகள்", villagesMonitored: "கண்காணிக்கப்படும் கிராமங்கள்", reportsLive: "அறிக்கைகள் (நேரலை)", waterTestsLogged: "நீர் பரிசோதனைகள்",
    recentReports: "சமீபத்திய அறிக்கைகள்", noReportsYet: "இன்னும் அறிக்கைகள் இல்லை.",
    reportSymptoms: "அறிகுறிகளை அறிவிக்கவும்", villageArea: "கிராமம் / பகுதி", symptom: "அறிகுறி", severity: "தீவிரம்", submitReport: "அறிக்கையை சமர்ப்பிக்கவும்", reportSubmitted: "அறிக்கை சமர்ப்பிக்கப்பட்டது!",
    diarrhea: "வயிற்றுப்போக்கு", vomiting: "வாந்தி", fever: "காய்ச்சல்", jaundice: "மஞ்சள் காமாலை", mild: "லேசான", moderate: "மிதமான", severe: "கடுமையான",
    waterTestEntry: "நீர் பரிசோதனை பதிவு", phLevel: "பிஎச் நிலை", turbidity: "கலங்கல் (NTU)", tds: "TDS (ppm)", submitTest: "பரிசோதனையை சமர்ப்பிக்கவும்", testLogged: "பரிசோதனை பதிவு செய்யப்பட்டது!",
    incidentHistory: "சம்பவ வரலாறு", riskMap: "ஆபத்து வரைபடம்",
    reportsInLast7Days: "கடந்த 7 நாட்களில் அறிக்கைகள்",
    resolved: "தீர்க்கப்பட்டது", active: "செயலில்", monitoring: "கண்காணிப்பில்",
    low: "குறைவு", medium: "நடுத்தரம்", high: "அதிகம்",
  },
  te: {
    dashboard: "డాష్‌బోర్డ్", map: "రిస్క్ మ్యాప్", alerts: "హెచ్చరికలు", community: "సంఘం", waterTests: "నీటి పరీక్షలు", history: "చరిత్ర", logout: "లాగ్అవుట్",
    appName: "ఎపిస్ట్రీమ్", tagline: "సముదాయ ఆరోగ్య ముందస్తు హెచ్చరిక డాష్‌బోర్డ్",
    activeAlerts: "క్రియాశీల హెచ్చరికలు", villagesMonitored: "పర్యవేక్షిస్తున్న గ్రామాలు", reportsLive: "నివేదికలు (ప్రత్యక్షం)", waterTestsLogged: "నీటి పరీక్షలు నమోదు",
    recentReports: "ఇటీవలి నివేదికలు", noReportsYet: "ఇంకా నివేదికలు లేవు.",
    reportSymptoms: "లక్షణాలను నివేదించండి", villageArea: "గ్రామం / ప్రాంతం", symptom: "లక్షణం", severity: "తీవ్రత", submitReport: "నివేదికను సమర్పించండి", reportSubmitted: "నివేదిక సమర్పించబడింది!",
    diarrhea: "విరేచనాలు", vomiting: "వాంతులు", fever: "జ్వరం", jaundice: "కామెర్లు", mild: "తేలికపాటి", moderate: "మధ్యస్థ", severe: "తీవ్రమైన",
    waterTestEntry: "నీటి పరీక్ష నమోదు", phLevel: "పిహెచ్ స్థాయి", turbidity: "టర్బిడిటీ (NTU)", tds: "TDS (ppm)", submitTest: "పరీక్షను సమర్పించండి", testLogged: "పరీక్ష నమోదైంది!",
    incidentHistory: "సంఘటన చరిత్ర", riskMap: "రిస్క్ మ్యాప్",
    reportsInLast7Days: "గత 7 రోజుల్లో నివేదికలు",
    resolved: "పరిష్కరించబడింది", active: "క్రియాశీలం", monitoring: "పర్యవేక్షణలో",
    low: "తక్కువ", medium: "మధ్యస్థం", high: "అధికం",
  },
  mr: {
    dashboard: "डॅशबोर्ड", map: "जोखीम नकाशा", alerts: "सूचना", community: "समुदाय", waterTests: "पाणी चाचणी", history: "इतिहास", logout: "लॉगआउट",
    appName: "एपिस्ट्रीम", tagline: "सामुदायिक आरोग्य पूर्व सूचना डॅशबोर्ड",
    activeAlerts: "सक्रिय सूचना", villagesMonitored: "निरीक्षण केलेली गावे", reportsLive: "अहवाल (थेट)", waterTestsLogged: "पाणी चाचण्या नोंदवल्या",
    recentReports: "अलीकडील अहवाल", noReportsYet: "अद्याप कोणतेही अहवाल नाहीत.",
    reportSymptoms: "लक्षणे नोंदवा", villageArea: "गाव / क्षेत्र", symptom: "लक्षण", severity: "तीव्रता", submitReport: "अहवाल सबमिट करा", reportSubmitted: "अहवाल सबमिट झाला!",
    diarrhea: "अतिसार", vomiting: "उलटी", fever: "ताप", jaundice: "कावीळ", mild: "सौम्य", moderate: "मध्यम", severe: "तीव्र",
    waterTestEntry: "पाणी चाचणी नोंद", phLevel: "पीएच पातळी", turbidity: "गढूळपणा (NTU)", tds: "टीडीएस (ppm)", submitTest: "चाचणी सबमिट करा", testLogged: "चाचणी नोंदवली!",
    incidentHistory: "घटना इतिहास", riskMap: "जोखीम नकाशा",
    reportsInLast7Days: "गेल्या 7 दिवसातील अहवाल",
    resolved: "निराकरण झाले", active: "सक्रिय", monitoring: "निरीक्षणाखाली",
    low: "कमी", medium: "मध्यम", high: "उच्च",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = (key) => translations[lang]?.[key] || translations.en[key];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);