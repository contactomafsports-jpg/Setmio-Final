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

export const LANGUAGES = ['es', 'en', 'gl', 'ca', 'va', 'eu', 'ar', 'pt', 'fr', 'de', 'it'] as const;
export type LangCode = typeof LANGUAGES[number];

// Additional translations specifically targeted at eliminating 100% of English text in secondary languages
export const TARGETED_PATCHES: Record<LangCode, Record<string, string>> = {
  es: {
    "pricing.finalCta": "Solicitar Demo o Alta Directa",
    "blog.subtitle": "Artículos técnicos elaborados por entrenadores titulados, análisis de biomecánica, crónicas de torneos y novedades del club.",
    // domotica.hardware.item_1 to item_6
    "domotica.hardware.item_1.badge": "Eficiencia LED",
    "domotica.hardware.item_1.title": "Encendido y Apagado Automático de Focos LED",
    "domotica.hardware.item_1.desc": "Sincronización milimétrica con el cuadrante de reservas. Los proyectores LED se activan automáticamente 5 minutos antes del turno y se apagan al finalizar.",
    "domotica.hardware.item_1.specs.0": "Encendido y apagado suave (sin picos de tensión ni deslumbramiento)",
    "domotica.hardware.item_1.specs.1": "Margen de cortesía de 5 minutos al finalizar el partido",
    "domotica.hardware.item_1.specs.2": "Control remoto manual desde app móvil para personal de mantenimiento",
    "domotica.hardware.item_1.specs.3": "Ahorro comprobado de hasta un 40% en la factura eléctrica mensual",
    "domotica.hardware.item_1.kpi": "-40% en consumo de luz",

    "domotica.hardware.item_2.badge": "Acceso Autónomo",
    "domotica.hardware.item_2.title": "Control de Accesos por PIN y Código QR Dinámico",
    "domotica.hardware.item_2.desc": "Cerraduras electrónicas y tornos peatonales de alta resistencia conectados a la nube. Cada jugador recibe en su móvil un PIN temporal o QR válido exclusivamente durante su horario reservado.",
    "domotica.hardware.item_2.specs.0": "Apertura de pistas sin necesidad de personal en recepción",
    "domotica.hardware.item_2.specs.1": "Desbloqueo automático 10 minutos antes del inicio del turno",
    "domotica.hardware.item_2.specs.2": "Registro de auditoría con fecha y milisegundo de entrada",
    "domotica.hardware.item_2.specs.3": "Integración nativa con cancelas exteriores y puertas de cristal",
    "domotica.hardware.item_2.kpi": "Operación 24/7 sin personal",

    "domotica.hardware.item_3.badge": "Experiencia Viral",
    "domotica.hardware.item_3.title": "Cámaras de Repetición y Highlights con Pulsador en Pista",
    "domotica.hardware.item_3.desc": "Sistema de grabación continua en bucle con pulsador físico inalámbrico instalado en el poste de la red. Cuando un jugador hace un punto épico, pulsa el botón y el clip se recorta y se envía a su app.",
    "domotica.hardware.item_3.specs.0": "Grabación en resolución Full HD 60fps con lente gran angular",
    "domotica.hardware.item_3.specs.1": "Generación automática de clip de 30 segundos (20s antes + 10s después)",
    "domotica.hardware.item_3.specs.2": "Marca de agua con logotipo y patrocinadores del club",
    "domotica.hardware.item_3.specs.3": "Opción de retransmisión en directo por streaming en YouTube",
    "domotica.hardware.item_3.kpi": "+400% engagement social",

    "domotica.hardware.item_4.badge": "Confort en Pista",
    "domotica.hardware.item_4.title": "Climatización, Aerotermia y Sensores Antihumedad",
    "domotica.hardware.item_4.desc": "Sondas IoT de temperatura, humedad relativa y punto de rocío en naves indoor. Activación inteligente de aerotermia y deshumidificadores para evitar cristales empañados.",
    "domotica.hardware.item_4.specs.0": "Prevención total de condensación en vidrios para rebotes limpios",
    "domotica.hardware.item_4.specs.1": "Encendido de calefacción o aire acondicionado según ocupación real",
    "domotica.hardware.item_4.specs.2": "Telemetría continua de calidad del aire y niveles de CO2",
    "domotica.hardware.item_4.specs.3": "Ajuste automático según previsión meteorológica exterior",
    "domotica.hardware.item_4.kpi": "Cristales 100% secos",

    "domotica.hardware.item_5.badge": "Control en Tiempo Real",
    "domotica.hardware.item_5.title": "Radar de Pista Ocupada y Detección de Presencia",
    "domotica.hardware.item_5.desc": "Sensores volumétricos microondas que monitorizan si los jugadores están efectivamente disputando el partido, liberando la pista o alertando a recepción en caso de no-show.",
    "domotica.hardware.item_5.specs.0": "Detección no invasiva sin reconocimiento facial ni cámaras invasivas",
    "domotica.hardware.item_5.specs.1": "Aviso a recepción tras 15 minutos de incomparecencia",
    "domotica.hardware.item_5.specs.2": "Control de juego no autorizado fuera de horario reservado",
    "domotica.hardware.item_5.specs.3": "Comunicación por protocolo industrial MQTT cifrado de baja latencia",
    "domotica.hardware.item_5.kpi": "Liberación de pistas libres",

    "domotica.hardware.item_6.badge": "Señalética Digital",
    "domotica.hardware.item_6.title": "Pantallas de Marcador y Cartelería Digital",
    "domotica.hardware.item_6.desc": "Pantallas en pista y en recepción que muestran marcadores en directo, próximas reservas, partidos abiertos y publicidad de patrocinadores.",
    "domotica.hardware.item_6.specs.0": "Marcador en vivo sincronizado con la app del jugador",
    "domotica.hardware.item_6.specs.1": "Parrilla de reservas y turnos en tiempo real",
    "domotica.hardware.item_6.specs.2": "Rotación programada de anuncios de patrocinadores",
    "domotica.hardware.item_6.specs.3": "Gestión remota de contenidos desde el panel",
    "domotica.hardware.item_6.kpi": "Nuevos ingresos por patrocinio",
  },
  en: {
    "pricing.finalCta": "Request Demo or Direct Sign-up",
    "blog.subtitle": "Technical articles by certified coaches, biomechanics breakdowns, tournament recaps, and club news.",
    "domotica.hardware.item_1.badge": "LED Efficiency",
    "domotica.hardware.item_1.title": "Automated LED Spotlight Activation & Scheduling",
    "domotica.hardware.item_1.desc": "Seamless sync with booking calendar. LED competition floods turn on 5 minutes before the match and turn off automatically after play.",
    "domotica.hardware.item_1.specs.0": "Soft start/stop preventing power surges and glare",
    "domotica.hardware.item_1.specs.1": "5-minute courtesy buffer after match end",
    "domotica.hardware.item_1.specs.2": "Manual override from mobile app for maintenance staff",
    "domotica.hardware.item_1.specs.3": "Proven electricity bill savings of up to 40% monthly",
    "domotica.hardware.item_1.kpi": "-40% electricity consumption",

    "domotica.hardware.item_2.badge": "Autonomous Entry",
    "domotica.hardware.item_2.title": "PIN & Dynamic QR Code Access Control",
    "domotica.hardware.item_2.desc": "Heavy-duty electric locks and pedestrian turnstiles connected to the cloud. Each player receives a temporary PIN code valid strictly during their slot.",
    "domotica.hardware.item_2.specs.0": "Court unlocking without reception staff presence",
    "domotica.hardware.item_2.specs.1": "Automatic unlock 10 minutes prior to match start",
    "domotica.hardware.item_2.specs.2": "Audit logs capturing exact millisecond of entry",
    "domotica.hardware.item_2.specs.3": "Native compatibility with exterior gates and glass doors",
    "domotica.hardware.item_2.kpi": "24/7 unstaffed operation",

    "domotica.hardware.item_3.badge": "Viral Experience",
    "domotica.hardware.item_3.title": "Instant Replay Cameras & On-Court Highlight Buttons",
    "domotica.hardware.item_3.desc": "Continuous loop recording system with physical wireless push-button on the net post. Press the button after an epic rally to instantly clip and receive the video.",
    "domotica.hardware.item_3.specs.0": "Full HD 60fps recording with wide-angle glass optics",
    "domotica.hardware.item_3.specs.1": "Automated 30-second highlight generation (20s before + 10s after)",
    "domotica.hardware.item_3.specs.2": "Branded watermark with club logo and sponsors",
    "domotica.hardware.item_3.specs.3": "Optional YouTube live stream broadcast integration",
    "domotica.hardware.item_3.kpi": "+400% social engagement",

    "domotica.hardware.item_4.badge": "Court Comfort",
    "domotica.hardware.item_4.title": "Climate Control, Heat Pumps & Anti-Condensation Sensors",
    "domotica.hardware.item_4.desc": "IoT environmental sensors tracking temperature, relative humidity, and dew point in indoor arenas. Automated dehumidification to keep glass walls dry.",
    "domotica.hardware.item_4.specs.0": "Zero glass fogging ensuring crisp ball rebounds",
    "domotica.hardware.item_4.specs.1": "Heating or cooling tailored to real-time occupancy",
    "domotica.hardware.item_4.specs.2": "Continuous CO2 and air quality telemetry",
    "domotica.hardware.item_4.specs.3": "Weather-forecast adaptive schedule adjustments",
    "domotica.hardware.item_4.kpi": "100% dry glass walls",

    "domotica.hardware.item_5.badge": "Real-Time Tracking",
    "domotica.hardware.item_5.title": "Microwave Court Occupancy Radar & No-Show Detection",
    "domotica.hardware.item_5.desc": "Volumetric microwave sensors detecting whether players are physically on court, freeing up unused courts or notifying reception in case of no-shows.",
    "domotica.hardware.item_5.specs.0": "Non-invasive detection without facial recognition or invasive cameras",
    "domotica.hardware.item_5.specs.1": "Automated notification after 15 minutes of absence",
    "domotica.hardware.item_5.specs.2": "Unauthorized after-hours play detection",
    "domotica.hardware.item_5.specs.3": "Industrial encrypted low-latency MQTT communications",
    "domotica.hardware.item_5.kpi": "Instant court reclamation",

    "domotica.hardware.item_6.badge": "Digital Signage",
    "domotica.hardware.item_6.title": "Court Scoreboard Displays & Digital Signage",
    "domotica.hardware.item_6.desc": "Digital displays showing live scores, upcoming court slots, open matches, and sponsor advertising.",
    "domotica.hardware.item_6.specs.0": "Live match scoreboard synced with player mobile app",
    "domotica.hardware.item_6.specs.1": "Real-time court schedule and upcoming turn matrix",
    "domotica.hardware.item_6.specs.2": "Automated rotating advertising banner loop",
    "domotica.hardware.item_6.specs.3": "Cloud-based remote content control from admin panel",
    "domotica.hardware.item_6.kpi": "New sponsor revenue streams",
  },
  gl: {},
  ca: {},
  va: {},
  eu: {},
  ar: {},
  pt: {},
  fr: {},
  de: {},
  it: {}
};
