import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslations from './locales/fr.json';
import enTranslations from './locales/en.json';
const resources = {
  fr: {
    translation: frTranslations,
  },
  en: {
    translation: enTranslations,
  },
};
const savedLng = localStorage.getItem('language') || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLng, // default language from storage
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });
export default i18n;
