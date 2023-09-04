import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './i18n/en.json';
import pirate from './i18n/pirate.json';
import { isPirateDay } from './utils';

const resources = {
  en: {
    translation: en,
  },
  pirate: {
    translation: pirate,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: isPirateDay() ? 'pirate' : 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});
