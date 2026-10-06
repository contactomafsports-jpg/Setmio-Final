import { TRANSLATIONS as T } from './src/lib/i18n';
const en=T.en;console.log(Object.keys(en).filter(k=>k.startsWith('register.roles.')||k.startsWith('register.level')||k.startsWith('corporate.tagline')||k.startsWith('nav.changeLanguage')||k.startsWith('auth.demo')).join('\n'));
