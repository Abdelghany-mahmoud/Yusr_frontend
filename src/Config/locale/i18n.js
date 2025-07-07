import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

let savedLanguage = "ar";
try {
  savedLanguage = localStorage.getItem("language") || "ar";
} catch (error) {
  console.warn("localStorage is not available");
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: "ar",
    supportedLngs: ["ar", "en"],
    ns: ["layout"],
    defaultNS: "common",
    backend: {
      loadPath: "/assets/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
