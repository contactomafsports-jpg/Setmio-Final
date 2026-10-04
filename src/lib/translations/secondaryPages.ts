// @ts-nocheck
import { esSecondary } from './secondary/es';
import { enSecondary } from './secondary/en';
import { itSecondary } from './secondary/it';
import { glSecondary } from './secondary/gl';
import { caSecondary } from './secondary/ca';
import { vaSecondary } from './secondary/va';
import { euSecondary } from './secondary/eu';
import { ptSecondary } from './secondary/pt';
import { frSecondary } from './secondary/fr';
import { deSecondary } from './secondary/de';
import { arSecondary } from './secondary/ar';

export const SECONDARY_PAGES_TRANSLATIONS: Record<string, Record<string, string>> = {
  es: esSecondary,
  en: enSecondary,
  it: itSecondary,
  gl: glSecondary,
  ca: caSecondary,
  va: vaSecondary,
  eu: euSecondary,
  pt: ptSecondary,
  fr: frSecondary,
  de: deSecondary,
  ar: arSecondary,
};
