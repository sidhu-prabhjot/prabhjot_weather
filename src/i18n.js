import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          sunset: "sunset",
          sunrise: "sunrise",
          pressure: "pressure",
          visibility: "visbility",
          otherIndexes: "other indexes",
          wind: "wind",
          humidity: "humidity",
          percipitation: "precipiation",
          feelsLike: "feels like: ",
          lastUpdated: "last updated:",
          lightMode: "light mode",
          cityName: "city name...",
          lightMode: "light mode",
          darkMode: "dark mode",
        },
      },
      fr: {
        translation: {
          sunset: "coucher du soleil",
          sunrise: "lever du soleil",
          pressure: "pression",
          visibility: "visibilité",
          otherIndexes: "autres index",
          wind: "vent",
          humidity: "humidité",
          precipitation: "précipitations",
          feelsLike: "sensation: ",
          lastUpdated: "dernière mise à jour: ",
          cityName: "nom de ville...",
          lightMode: "mode lumière",
          darkMode: "mode sombre",
        },
      },
    },
  });

export default i18n;
