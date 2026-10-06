import fs from 'fs';
import path from 'path';

import { esLocale } from '../src/locales/es';
import { enLocale } from '../src/locales/en';
import { glLocale } from '../src/locales/gl';
import { caLocale } from '../src/locales/ca';
import { vaLocale } from '../src/locales/va';
import { euLocale } from '../src/locales/eu';
import { arLocale } from '../src/locales/ar';
import { ptLocale } from '../src/locales/pt';
import { frLocale } from '../src/locales/fr';
import { deLocale } from '../src/locales/de';
import { itLocale } from '../src/locales/it';

import { EXTENDED_CORPORATE_TRANSLATIONS } from '../src/lib/translations/extendedCorporateTranslations';
import { CORPORATE_TRANSLATIONS } from '../src/lib/translations/corporateTranslations';
import { FEATURES_TRANSLATIONS } from '../src/lib/translations/featuresTranslations';
import { DOMOTICA_TRANSLATIONS } from '../src/lib/translations/domoticaTranslations';
import { PRICING_TRANSLATIONS } from '../src/lib/translations/pricingTranslations';
import { PLAYER_PAGE_TRANSLATIONS } from '../src/lib/translations/playerPageTranslations';
import { PUBLIC_SITE_FIXES_TRANSLATIONS } from '../src/lib/translations/publicSiteFixesTranslations';
import { PUBLIC_I18N_COMPLETION_TRANSLATIONS } from '../src/lib/translations/publicI18nCompletionTranslations';

import { glTranslations, caTranslations, vaTranslations, euTranslations } from '../src/lib/translations/gl_ca_va_eu';
import { ptTranslations, frTranslations, deTranslations, arTranslations } from '../src/lib/translations/pt_fr_de_ar';
import { itTranslations } from '../src/lib/translations/it';

import { glSecondary } from '../src/lib/translations/secondary/gl';
import { caSecondary } from '../src/lib/translations/secondary/ca';
import { vaSecondary } from '../src/lib/translations/secondary/va';
import { euSecondary } from '../src/lib/translations/secondary/eu';
import { arSecondary } from '../src/lib/translations/secondary/ar';
import { ptSecondary } from '../src/lib/translations/secondary/pt';
import { frSecondary } from '../src/lib/translations/secondary/fr';
import { deSecondary } from '../src/lib/translations/secondary/de';
import { itSecondary } from '../src/lib/translations/secondary/it';

import { SOLUTIONS_TRANSLATIONS } from './translations_solutions';

console.log('Script initialized successfully');
