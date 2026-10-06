// scripts/buildLocales.js
import fs from 'fs';
import path from 'path';

console.log('Starting locales builder...');

const rawData = JSON.parse(fs.readFileSync('temp_translations.json', 'utf8'));
const allKeys = Array.from(new Set(Object.values(rawData).flatMap(d => Object.keys(d)))).sort();
console.log('Total universal keys:', allKeys.length);

export const LANG_CODES = ['es', 'en', 'gl', 'ca', 'va', 'eu', 'ar', 'pt', 'fr', 'de', 'it'];

// Helper to sanitize and write
