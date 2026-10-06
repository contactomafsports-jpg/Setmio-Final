import fs from 'fs';
import { TRANSLATIONS as T } from './src/lib/i18n';

const files = process.argv.slice(2);
const en = T.en;
const tRe = /\bt\(\s*['"`]([^'"`]+)['"`]/g;
const accents = /[áéíóúñ¿¡]|\b(de|del|para|con|tu|los|las|una|sin|y|en)\b/i;

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const missing = new Set<string>();
  for (const m of src.matchAll(tRe)) {
    if (m[1].includes('${')) continue;
    if (!en[m[1]]) missing.add(m[1]);
  }
  const hard: string[] = [];
  src.split('\n').forEach((line, i) => {
    const l = line.trim();
    if (l.startsWith('//') || l.startsWith('{/*') || l.startsWith('*') || l.includes('className=') && !/>[^<{]*[a-záéíóúñ]{3}/i.test(l)) return;
    const jsxText = l.match(/>\s*([^<>{}]*[A-Za-zÁÉÍÓÚáéíóúñ]{3}[^<>{}]*)\s*(<|$)/);
    const plainLine = !/[<>{}=;()]/.test(l) && /[a-záéíóúñ]{3}/i.test(l) && !l.startsWith('import');
    const strProp = l.match(/(?:title|label|desc|description|placeholder|aria-label|alt|text|name|badge|subtitle|cta)\s*[:=]\s*['"]([^'"]{4,})['"]/);
    const cand = jsxText?.[1] || (plainLine ? l : '') || strProp?.[1];
    if (cand && accents.test(cand) && !/t\(/.test(l)) hard.push(`${i + 1}: ${l.slice(0, 140)}`);
  });
  if (missing.size || hard.length) {
    console.log(`\n=== ${f}`);
    if (missing.size) console.log('MISSING EN:', [...missing].join(', '));
    hard.forEach((h) => console.log('  HARD', h));
  }
}
