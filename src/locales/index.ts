import { esLocale } from './es';
import { enLocale } from './en';
import { glLocale } from './gl';
import { caLocale } from './ca';
import { vaLocale } from './va';
import { euLocale } from './eu';
import { arLocale } from './ar';
import { ptLocale } from './pt';
import { frLocale } from './fr';
import { deLocale } from './de';
import { itLocale } from './it';

export type SupportedLocale = 'es' | 'en' | 'gl' | 'ca' | 'va' | 'eu' | 'ar' | 'pt' | 'fr' | 'de' | 'it';

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

export const LOCALES: Record<SupportedLocale, Record<string, string>> = {
  es: esLocale,
  en: enLocale,
  gl: glLocale,
  ca: caLocale,
  va: vaLocale,
  eu: euLocale,
  ar: arLocale,
  pt: ptLocale,
  fr: frLocale,
  de: deLocale,
  it: itLocale,
};

export { esLocale, enLocale, glLocale, caLocale, vaLocale, euLocale, arLocale, ptLocale, frLocale, deLocale, itLocale };
