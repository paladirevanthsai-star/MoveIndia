import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    live_map: "Live Bus Map",
    reports: "Crowd Reports",
    operator: "Operator Deck",
    admin: "Admin Moderation",
    search_placeholder: "Search Bus plate (e.g. TS-09, 4421), Route (101-H), Stop or Landmark...",
    report_action: "Report Crowding / Delay",
    digital_ticket: "Buy Digital Ticket",
    seats_available: "Seats Available",
    medium_crowd: "Medium Rush",
    crowded: "Crowded",
    on_time: "On Time",
    delayed: "Delayed",
    favorite_fleet: "My Pinned Commute Fleet",
    all_fleet: "All Fleet",
    saved: "Saved",
    view_seats: "View Seats",
    set_alarm: "Set Alert",
    alarm_active: "Alert Active",
    google_maps: "Google Maps",
    approaching: "Approaching",
    cruising: "Cruising",
    fare: "Fare",
    stops: "Stops"
  },
  hi: {
    live_map: "लाइव बस मैप",
    reports: "भीड़ रिपोर्ट",
    operator: "चालक डेक",
    admin: "नियंत्रक हब",
    search_placeholder: "बस नंबर (TS-09, 4421), रूट (101-H), या स्टॉप खोजें...",
    report_action: "भीड़ / देरी की रिपोर्ट करें",
    digital_ticket: "डिजिटल टिकट खरीदें",
    seats_available: "सीटें उपलब्ध",
    medium_crowd: "मध्यम भीड़",
    crowded: "अधिक भीड़",
    on_time: "समय पर",
    delayed: "देरी से",
    favorite_fleet: "मेरी पसंदीदा बसें",
    all_fleet: "सभी बसें",
    saved: "सहेजे गए",
    view_seats: "सीट देखें",
    set_alarm: "अलार्म सेट करें",
    alarm_active: "अलार्म चालू",
    google_maps: "गूगल मैप्स",
    approaching: "पहुंचने वाली है",
    cruising: "रफ़्तार",
    fare: "किराया",
    stops: "स्टॉप"
  },
  te: {
    live_map: "లైవ్ బస్ మ్యాప్",
    reports: "రద్దీ నివేదికలు",
    operator: "డ్రైవర్ డెక్",
    admin: "అడ్మిన్ హబ్",
    search_placeholder: "బస్సు నంబర్ (TS-09, 4421), రూట్ (101-H), లేదా స్టాప్ వెతకండి...",
    report_action: "రద్దీ / ఆలస్యాన్ని నివేదించండి",
    digital_ticket: "డిజిటల్ టికెట్ కొనండి",
    seats_available: "సీట్లు ఉన్నాయి",
    medium_crowd: "సాధారణ రద్దీ",
    crowded: "ఎక్కువ రద్దీ",
    on_time: "సమయానికి",
    delayed: "ఆలస్యం",
    favorite_fleet: "నా ఇష్టమైన బస్సులు",
    all_fleet: "అన్ని బస్సులు",
    saved: "సేవ్ చేసినవి",
    view_seats: "సీట్లు చూడండి",
    set_alarm: "అలారం పెట్టండి",
    alarm_active: "అలారం ఆన్",
    google_maps: "గూగుల్ మ్యాప్స్",
    approaching: "చేరుకుంటోంది",
    cruising: "వేగం",
    fare: "చార్జీ",
    stops: "స్టాప్‌లు"
  },
  kn: {
    live_map: "ಲೈವ್ ಬಸ್ ನಕ್ಷೆ",
    reports: "ಜನಸಂದಣಿ ವರದಿ",
    operator: "ಚಾಲಕ ಡೆಕ್",
    admin: "ನಿರ್ವಾಹಕ ಹಬ್",
    search_placeholder: "ಬಸ್ ಸಂಖ್ಯೆ (KA-01, 9912), ಮಾರ್ಗ (335-E), ನಿಲ್ದಾಣ ಹುಡುಕಿ...",
    report_action: "ಜನಸಂದಣಿ / ವಿಳಂಬ ವರದಿ ಮಾಡಿ",
    digital_ticket: "ಡಿಜಿಟಲ್ ಟಿಕೆಟ್ ಖರೀದಿಸಿ",
    seats_available: "ಆಸನಗಳು ಲಭ್ಯ",
    medium_crowd: "ಮಧ್ಯಮ ಜನಸಂದಣಿ",
    crowded: "ತುಂಬಿದ ಬಸ್",
    on_time: "ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ",
    delayed: "ವಿಳಂಬವಾಗಿದೆ",
    favorite_fleet: "ನನ್ನ ಮೆಚ್ಚಿನ ಬಸ್‌ಗಳು",
    all_fleet: "ಎಲ್ಲಾ ಬಸ್‌ಗಳು",
    saved: "ಉಳಿಸಲಾಗಿದೆ",
    view_seats: "ಆಸನ ವಿನ್ಯಾಸ",
    set_alarm: "ಅಲಾರಾಂ ಹೊಂದಿಸಿ",
    alarm_active: "ಅಲಾರಾಂ ಆನ್",
    google_maps: "ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್",
    approaching: "ತಲುಪುತ್ತಿದೆ",
    cruising: "ವೇಗ",
    fare: "ದರ",
    stops: "ನಿಲ್ದಾಣಗಳು"
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("move_india_lang") || "en";
    } catch {
      return "en";
    }
  });

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      try {
        localStorage.setItem("move_india_lang", newLang);
      } catch (e) {}
    }
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
