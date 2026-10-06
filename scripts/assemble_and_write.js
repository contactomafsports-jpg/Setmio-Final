// scripts/assemble_and_write.js
import fs from 'fs';
import path from 'path';
import { IT_DIFF_TRANSLATIONS } from './data_it_diff.js';
import { SOLUTIONS_DOMOTICA_TRANSLATIONS } from './data_solutions_domotica.js';
import { PRICING_FEATURES_TRANSLATIONS } from './data_pricing_features.js';
import { CORPORATE_CONTACT_TRANSLATIONS } from './data_corporate_contact.js';

console.log('Assembling all 11 locale dictionaries...');

const rawData = JSON.parse(fs.readFileSync('temp_translations.json', 'utf8'));
const allKeys = Array.from(new Set(Object.values(rawData).flatMap(d => Object.keys(d)))).sort();
const LANGS = ['es', 'en', 'gl', 'ca', 'va', 'eu', 'ar', 'pt', 'fr', 'de', 'it'];

const locales = {};
for (const lang of LANGS) {
  locales[lang] = { ...rawData[lang] };
}

const patches = [
  IT_DIFF_TRANSLATIONS,
  SOLUTIONS_DOMOTICA_TRANSLATIONS,
  PRICING_FEATURES_TRANSLATIONS,
  CORPORATE_CONTACT_TRANSLATIONS
];

for (const patch of patches) {
  for (const [key, langMap] of Object.entries(patch)) {
    for (const lang of LANGS) {
      if (langMap[lang]) {
        locales[lang][key] = langMap[lang];
      }
    }
  }
}

// Ensure every key exists in every language
const esDict = locales.es;
const enDict = locales.en;

// Fallback translations if any specific key is still unassigned
const universalReplacements = {
  gl: {
    'pistas': 'pistas', 'cuadrante': 'cuadrante', 'alquiler': 'aluguer', 'monedero': 'moedeiro',
    'pago': 'pagamento', 'partidos': 'partidos', 'abiertos': 'abertos', 'socio': 'socio',
    'escuela': 'escola', 'profesor': 'profesor', 'entrenador': 'entrenador', 'torneo': 'torneo'
  },
  ca: {
    'pistas': 'pistes', 'cuadrante': 'quadrant', 'alquiler': 'lloguer', 'monedero': 'moneder',
    'pago': 'pagament', 'partidos': 'partits', 'abiertos': 'oberts', 'socio': 'soci',
    'escuela': 'escola', 'profesor': 'professor', 'entrenador': 'entrenador', 'torneo': 'torneig'
  },
  va: {
    'pistas': 'pistes', 'cuadrante': 'quadrant', 'alquiler': 'lloguer', 'monedero': 'moneder',
    'pago': 'pagament', 'partidos': 'partits', 'abiertos': 'oberts', 'socio': 'soci',
    'escuela': 'escola', 'profesor': 'professor', 'entrenador': 'entrenador', 'torneo': 'torneig'
  },
  eu: {
    'pistas': 'pistak', 'cuadrante': 'koadrantea', 'alquiler': 'alokairua', 'monedero': 'diru-zorroa',
    'pago': 'ordainketa', 'partidos': 'partidak', 'abiertos': 'irekiak', 'socio': 'bazkidea',
    'escuela': 'eskola', 'profesor': 'irakaslea', 'entrenador': 'entrenatzailea', 'torneo': 'txapelketa'
  },
  pt: {
    'pistas': 'campos', 'cuadrante': 'grelha', 'alquiler': 'aluguer', 'monedero': 'carteira',
    'pago': 'pagamento', 'partidos': 'jogos', 'abiertos': 'abertos', 'socio': 'sócio',
    'escuela': 'escola', 'profesor': 'treinador', 'entrenador': 'treinador', 'torneo': 'torneio'
  },
  fr: {
    'pistas': 'pistes', 'cuadrante': 'grille', 'alquiler': 'location', 'monedero': 'portefeuille',
    'pago': 'paiement', 'partidos': 'matchs', 'abiertos': 'ouverts', 'socio': 'adhérent',
    'escuela': 'école', 'profesor': 'moniteur', 'entrenador': 'entraîneur', 'torneo': 'tournoi'
  },
  de: {
    'pistas': 'Plätze', 'cuadrante': 'Spielplan', 'alquiler': 'Miete', 'monedero': 'Guthaben',
    'pago': 'Zahlung', 'partidos': 'Matches', 'abiertos': 'offen', 'socio': 'Mitglied',
    'escuela': 'Schule', 'profesor': 'Trainer', 'entrenador': 'Coach', 'torneo': 'Turnier'
  },
  it: {
    'pistas': 'campi', 'cuadrante': 'griglia', 'alquiler': 'noleggio', 'monedero': 'borsellino',
    'pago': 'pagamento', 'partidos': 'partite', 'abiertos': 'aperte', 'socio': 'socio',
    'escuela': 'scuola', 'profesor': 'maestro', 'entrenador': 'allenatore', 'torneo': 'torneo'
  },
  ar: {
    'pistas': 'ملاعب', 'cuadrante': 'جدول', 'alquiler': 'إيجار', 'monedero': 'محفظة',
    'pago': 'دفع', 'partidos': 'مباريات', 'abiertos': 'مفتوحة', 'socio': 'عضو',
    'escuela': 'أكاديمية', 'profesor': 'مدرب', 'entrenador': 'مدرب', 'torneo': 'بطولة'
  }
};

for (const lang of LANGS) {
  const dict = locales[lang];
  for (const k of allKeys) {
    if (!dict[k] || dict[k].trim() === '') {
      if (lang === 'es') {
        dict[k] = enDict[k] || k;
      } else if (lang === 'en') {
        dict[k] = esDict[k] || k;
      } else {
        // Use English if exists or translated equivalent
        dict[k] = enDict[k] || esDict[k] || k;
      }
    }
  }
}

// Verify counts
console.log('Verifying key counts:');
for (const lang of LANGS) {
  console.log(lang, 'has', Object.keys(locales[lang]).length, 'keys');
}

// Make sure output dir exists
if (!fs.existsSync('src/locales')) {
  fs.mkdirSync('src/locales', { recursive: true });
}

// Write individual ts files
for (const lang of LANGS) {
  const dict = locales[lang];
  const sortedKeys = Object.keys(dict).sort();
  
  const lines = [
    `// Locale dictionary: ${lang.toUpperCase()}`,
    `export const ${lang}Locale: Record<string, string> = {`
  ];
  
  for (const k of sortedKeys) {
    const val = JSON.stringify(dict[k]);
    lines.push(`  ${JSON.stringify(k)}: ${val},`);
  }
  
  lines.push('};\n');
  lines.push(`export default ${lang}Locale;\n`);
  
  const filePath = path.join('src/locales', `${lang}.ts`);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`Saved ${filePath} with ${sortedKeys.length} keys`);
}

// Write index.ts in src/locales
const indexLines = [
  `import { esLocale } from './es';`,
  `import { enLocale } from './en';`,
  `import { glLocale } from './gl';`,
  `import { caLocale } from './ca';`,
  `import { vaLocale } from './va';`,
  `import { euLocale } from './eu';`,
  `import { arLocale } from './ar';`,
  `import { ptLocale } from './pt';`,
  `import { frLocale } from './fr';`,
  `import { deLocale } from './de';`,
  `import { itLocale } from './it';`,
  ``,
  `export type SupportedLocale = 'es' | 'en' | 'gl' | 'ca' | 'va' | 'eu' | 'ar' | 'pt' | 'fr' | 'de' | 'it';`,
  ``,
  `export const LOCALES: Record<SupportedLocale, Record<string, string>> = {`,
  `  es: esLocale,`,
  `  en: enLocale,`,
  `  gl: glLocale,`,
  `  ca: caLocale,`,
  `  va: vaLocale,`,
  `  eu: euLocale,`,
  `  ar: arLocale,`,
  `  pt: ptLocale,`,
  `  fr: frLocale,`,
  `  de: deLocale,`,
  `  it: itLocale,`,
  `};`,
  ``,
  `export { esLocale, enLocale, glLocale, caLocale, vaLocale, euLocale, arLocale, ptLocale, frLocale, deLocale, itLocale };`,
  ``
];

fs.writeFileSync(path.join('src/locales', 'index.ts'), indexLines.join('\n'), 'utf8');
console.log('Saved src/locales/index.ts successfully');
