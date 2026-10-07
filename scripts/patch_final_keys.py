import json
import re

LANGS = ['es', 'en', 'gl', 'ca', 'va', 'eu', 'ar', 'pt', 'fr', 'de', 'it']

PATCHES = {
    'domotica.hardware.subtitle': {
        'es': 'Dispositivos certificados e integrados de forma nativa con el motor de reservas de Setmio.',
        'en': 'Certified devices natively integrated with the Setmio booking engine.',
        'gl': 'Dispositivos certificados e integrados de xeito nativo co motor de reservas de Setmio.',
        'ca': 'Dispositius certificats i integrats de forma nativa amb el motor de reserves de Setmio.',
        'va': 'Dispositius certificats i integrats de forma nativa amb el motor de reserves de Setmio.',
        'eu': 'Setmioko erreserba-motorrarekin modu natiboan integratutako gailu ziurtatuak.',
        'ar': 'أجهزة معتمدة ومدمجة بشكل أصلي مع محرك حجوزات Setmio.',
        'pt': 'Dispositivos certificados e integrados de forma nativa com o motor de reservas da Setmio.',
        'fr': 'Appareils certifiés et intégrés nativement au moteur de réservation Setmio.',
        'de': 'Zertifizierte und nativ in die Setmio-Buchungsmaschine integrierte Geräte.',
        'it': 'Dispositivi certificati e integrati nativamente con il motore di prenotazione di Setmio.',
    },
    'domotica.catalogSub': {
        'es': 'Dispositivos certificados e integrados de forma nativa con el motor de reservas de Setmio.',
        'en': 'Certified devices natively integrated with the Setmio booking engine.',
        'gl': 'Dispositivos certificados e integrados de xeito nativo co motor de reservas de Setmio.',
        'ca': 'Dispositius certificats i integrats de forma nativa amb el motor de reserves de Setmio.',
        'va': 'Dispositius certificats i integrats de forma nativa amb el motor de reserves de Setmio.',
        'eu': 'Setmioko erreserba-motorrarekin modu natiboan integratutako gailu ziurtatuak.',
        'ar': 'أجهزة معتمدة ومدمجة بشكل أصلي مع محرك حجوزات Setmio.',
        'pt': 'Dispositivos certificados e integrados de forma nativa com o motor de reservas da Setmio.',
        'fr': 'Appareils certifiés et intégrés nativement au moteur de réservation Setmio.',
        'de': 'Zertifizierte und nativ in die Setmio-Buchungsmaschine integrierte Geräte.',
        'it': 'Dispositivi certificati e integrati nativamente con il motore di prenotazione di Setmio.',
    },
    'club.nav.iot': {
        'es': 'Domótica',
        'en': 'Domotics',
        'gl': 'Domótica',
        'ca': 'Domòtica',
        'va': 'Domòtica',
        'eu': 'Domotika',
        'ar': 'الأتمتة',
        'pt': 'Domótica',
        'fr': 'Domotique',
        'de': 'Haussteuerung',
        'it': 'Domotica',
    },
    'club.menu.viewWeb': {
        'es': 'Ver Web del Club',
        'en': 'View Club Website',
        'gl': 'Ver Web do Club',
        'ca': 'Veure Web del Club',
        'va': 'Veure Web del Club',
        'eu': 'Ikusi Klubaren Webgunea',
        'ar': 'عرض موقع النادي',
        'pt': 'Ver Site do Clube',
        'fr': 'Voir le Site du Club',
        'de': 'Club-Website ansehen',
        'it': 'Vedi Sito del Club',
    },
    'club.menu.myProfile': {
        'es': 'Mi Perfil',
        'en': 'My Profile',
        'gl': 'O Meu Perfil',
        'ca': 'El Meu Perfil',
        'va': 'El Meu Perfil',
        'eu': 'Nire Profila',
        'ar': 'ملفي الشخصي',
        'pt': 'O Meu Perfil',
        'fr': 'Mon Profil',
        'de': 'Mein Profil',
        'it': 'Il Mio Profilo',
    },
    'club.menu.clubSettings': {
        'es': 'Ajustes del Club',
        'en': 'Club Settings',
        'gl': 'Axustes do Club',
        'ca': 'Ajustos del Club',
        'va': 'Ajustos del Club',
        'eu': 'Klubaren Ezarpenak',
        'ar': 'إعدادات النادي',
        'pt': 'Definições do Clube',
        'fr': 'Paramètres du Club',
        'de': 'Club-Einstellungen',
        'it': 'Impostazioni del Club',
    },
}

for lang in LANGS:
    file_path = f"src/locales/{lang}.ts"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Parse current key/values from the ts file
    items = {}
    for line in content.split("\n"):
        match = re.match(r'^\s*"(.*?)":\s*"(.*?)"(?:\s*,)?\s*$', line)
        if match:
            k = match.group(1).replace('\\"', '"').replace('\\\\', '\\')
            v = match.group(2).replace('\\"', '"').replace('\\\\', '\\')
            items[k] = v

    # Apply patches
    for patch_key, lang_map in PATCHES.items():
        if lang in lang_map:
            items[patch_key] = lang_map[lang]

    # Re-write the file
    lang_upper = lang.upper()
    sorted_items = sorted(items.items(), key=lambda x: x[0])
    lines = [f"// Locale dictionary: {lang_upper}"]
    lines.append(f"export const {lang}Locale: Record<string, string> = {{")
    for k, v in sorted_items:
        k_json = json.dumps(k, ensure_ascii=False)
        v_json = json.dumps(v, ensure_ascii=False)
        lines.append(f"  {k_json}: {v_json},")
    lines.append("};")
    lines.append("")
    lines.append(f"export default {lang}Locale;")
    lines.append("")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Patched {file_path} successfully ({len(items)} keys)")

print("All 11 locale dictionaries successfully patched!")
