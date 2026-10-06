import { esTranslations, enTranslations } from './es_en';
import { glTranslations, caTranslations, vaTranslations, euTranslations } from './gl_ca_va_eu';
import { ptTranslations, frTranslations, deTranslations, arTranslations } from './pt_fr_de_ar';
import { itTranslations } from './it';
import { SECONDARY_PAGES_TRANSLATIONS } from './secondaryPages';
import { CORPORATE_TRANSLATIONS } from './corporateTranslations';
import { EXTENDED_CORPORATE_TRANSLATIONS } from './extendedCorporateTranslations';
import { FEATURES_TRANSLATIONS } from './featuresTranslations';
import { PRICING_TIERS_TRANSLATIONS } from './pricingTranslations';
import { SOLUTIONS_DETAIL_TRANSLATIONS } from './solutionsDetailTranslations';
import { DOMOTICA_TRANSLATIONS } from './domoticaTranslations';
import { PLAYER_PAGE_TRANSLATIONS } from './playerPageTranslations';
import { DEMO_ROLES_TRANSLATIONS } from './demoRolesTranslations';
import { PUBLIC_SITE_FIXES_TRANSLATIONS } from './publicSiteFixesTranslations';
import { PUBLIC_I18N_COMPLETION_TRANSLATIONS } from './publicI18nCompletionTranslations';

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
    ...(FEATURES_TRANSLATIONS[lang] || {}),
    ...(PRICING_TIERS_TRANSLATIONS[lang] || {}),
    ...(SOLUTIONS_DETAIL_TRANSLATIONS[lang] || {}),
    ...(DOMOTICA_TRANSLATIONS[lang] || {}),
    ...(PLAYER_PAGE_TRANSLATIONS[lang] || {}),
    ...(DEMO_ROLES_TRANSLATIONS[lang] || {}),
    ...(PUBLIC_SITE_FIXES_TRANSLATIONS[lang] || {}),
    ...(PUBLIC_I18N_COMPLETION_TRANSLATIONS[lang] || {}),
  };
}

