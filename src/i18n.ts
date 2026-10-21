import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { esLocale } from './locales/es';
import { enLocale } from './locales/en';
import { glLocale } from './locales/gl';
import { caLocale } from './locales/ca';
import { vaLocale } from './locales/va';
import { euLocale } from './locales/eu';
import { arLocale } from './locales/ar';
import { ptLocale } from './locales/pt';
import { frLocale } from './locales/fr';
import { deLocale } from './locales/de';
import { itLocale } from './locales/it';

export const resources = {
  es: { translation: esLocale },
  en: { translation: enLocale },
  gl: { translation: glLocale },
  ca: { translation: caLocale },
  va: { translation: vaLocale },
  eu: { translation: euLocale },
  ar: { translation: arLocale },
  pt: { translation: ptLocale },
  fr: { translation: frLocale },
  de: { translation: deLocale },
  it: { translation: itLocale },
};

const getInitialLanguage = (): string => {
  try {
    const saved = localStorage.getItem('setmio_lang');
    if (saved && Object.keys(resources).includes(saved.toLowerCase())) {
      return saved.toLowerCase();
    }
  } catch {
    // Ignore storage issues
  }
  return 'es';
};

const initialLang = getInitialLanguage();

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLang,
      fallbackLng: 'en',
      supportedLngs: ['es', 'en', 'gl', 'ca', 'va', 'eu', 'ar', 'pt', 'fr', 'de', 'it'],
      interpolation: {
        escapeValue: false,
      },
    });
}

import { LOCALES } from './locales';

export {
  i18n,
  LOCALES,
  esLocale,
  enLocale,
  glLocale,
  caLocale,
  vaLocale,
  euLocale,
  arLocale,
  ptLocale,
  frLocale,
  deLocale,
  itLocale,
};

export default i18n;
export * from './lib/i18n';
