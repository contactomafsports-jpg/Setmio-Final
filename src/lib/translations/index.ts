import { esTranslations, enTranslations } from './es_en';
import { glTranslations, caTranslations, vaTranslations, euTranslations } from './gl_ca_va_eu';
import { ptTranslations, frTranslations, deTranslations, arTranslations } from './pt_fr_de_ar';
import { itTranslations } from './it';
import { SECONDARY_PAGES_TRANSLATIONS } from './secondaryPages';
import { CORPORATE_TRANSLATIONS } from './corporateTranslations';
import { EXTENDED_CORPORATE_TRANSLATIONS } from './extendedCorporateTranslations';

const baseTranslations: Record<string, Record<string, string>> = {
  es: esTranslations,
  en: enTranslations,
  gl: glTranslations,
  ca: caTranslations,
  va: vaTranslations,
  eu: euTranslations,
  pt: ptTranslations,
  fr: frTranslations,
  de: deTranslations,
  it: itTranslations,
  ar: arTranslations,
};

export const ALL_EXTRA_TRANSLATIONS: Record<string, Record<string, string>> = {};

for (const [lang, dict] of Object.entries(baseTranslations)) {
  ALL_EXTRA_TRANSLATIONS[lang] = {
    ...dict,
    ...(SECONDARY_PAGES_TRANSLATIONS[lang] || {}),
    ...(CORPORATE_TRANSLATIONS[lang] || {}),
    ...(EXTENDED_CORPORATE_TRANSLATIONS[lang] || {}),
  };
}
