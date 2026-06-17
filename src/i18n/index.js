import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import pt from "./pt"
import en from "./en"
import es from "./es"

function normalizeLanguage(language = "") {
  if (language.startsWith("en")) return "en"
  if (language.startsWith("es")) return "es"
  return "pt"
}

const savedLanguage = typeof window !== "undefined"
  ? normalizeLanguage(window.localStorage.getItem("i18nextLng") || "")
  : "pt"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      es: { translation: es },
    },
    lng: savedLanguage,
    supportedLngs: ["pt", "en", "es"],
    load: "languageOnly",
    fallbackLng: "pt",
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
