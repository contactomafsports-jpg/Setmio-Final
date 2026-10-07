// @ts-nocheck
export const DOMOTICA_TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    "domotica.eyebrow": "Domótica & Pistas Autónomas Setmio IoT",
    "domotica.title": "Pistas de pádel autónomas.",
    "domotica.titleHighlight": "Abre las 24 horas sin costes de recepción.",
    "domotica.subtitle": "Conecta tu software de gestión directamente con las luces LED, tornos de acceso, cámaras de repetición y sistemas de climatización de tus pistas. Automatización industrial llave en mano instalable en menos de 48 horas.",
    "domotica.ctaDemo": "Solicitar Demo de Domótica",
    "domotica.compatible": "Compatible con relés Schneider, Finder y Shelly",
    "domotica.simTitle": "Simulador en Vivo: Pista 1 Central (Control IoT)",
    "domotica.simSubtitle": "Comprueba cómo reacciona la pista inteligente cuando un jugador interactúa con el sistema de acceso y luces.",
    "domotica.mqttBadge": "MQTT Broker Conectado (Ping: 14ms)",

    "domotica.catalogTitle": "Hardware y Automatizaciones IoT Disponibles",
    "domotica.catalogSub": "Dispositivos certificados e integrados de forma nativa con el motor de reservas de Setmio.",
    "domotica.hardware.subtitle": "Dispositivos certificados e integrados de forma nativa con el motor de reservas de Setmio.",
    "domotica.status": "Estado: ",
    "domotica.ledOn": "Encendido (400 Lux)",
    "domotica.ledOff": "Apagado (Standby 0W)",
    "domotica.turnOffLights": "Apagar Focos",
    "domotica.turnOnLights": "Encender Focos",
    "domotica.scheduledTime": "Horario programado:",
    "domotica.scheduledDetail": "19:25 a 21:05 (Reserva actual)",
    "domotica.turnstileTitle": "Torno / Puerta de Pista",
    "domotica.unlocked": "Desbloqueado (Abierto)",
    "domotica.locked": "Bloqueado con PIN",
    "domotica.authorized": "Pase Autorizado",
    "domotica.closed": "Cerrado",
    "domotica.pinPlaceholder": "Introduce PIN (ej: 4829)",
    "domotica.validatePin": "Validar PIN",
    "domotica.pinSuccess": "PIN correcto (#4829). Puerta abierta durante 10 segundos.",
    "domotica.pinError": "PIN incorrecto. Prueba con #4829 o #1234.",
    "domotica.auditClub": "Auditar mi club",
    "domotica.bannerTitle": "¿Quieres automatizar las pistas de tu club?",
    "domotica.bannerSub": "Nuestros ingenieros evalúan la instalación eléctrica de tu club y preparan los cuadros de mando preconfigurados para conectar y funcionar.",
    "domotica.bannerCta": "Solicitar Estudio de Domótica Gratuito",

    // Module 1: dom-luces
    "domotica.module.dom-luces.badge": "Eficiencia LED",
    "domotica.module.dom-luces.title": "Encendido y Apagado Automático de Focos LED",
    "domotica.module.dom-luces.desc": "Sincronización milimétrica con el cuadrante de reservas. Los proyectores LED se activan automáticamente 5 minutos antes del turno y se apagan al finalizar.",
    "domotica.module.dom-luces.specs.0": "Encendido y apagado suave (sin picos de tensión ni deslumbramiento)",
    "domotica.module.dom-luces.specs.1": "Margen de cortesía de 5 minutos al finalizar el partido",
    "domotica.module.dom-luces.specs.2": "Control remoto manual desde app móvil para personal de mantenimiento",
    "domotica.module.dom-luces.specs.3": "Ahorro comprobado de hasta un 40% en la factura eléctrica mensual",
    "domotica.module.dom-luces.kpi": "-40% en consumo de luz",

    // Module 2: dom-accesos
    "domotica.module.dom-accesos.badge": "Acceso Autónomo",
    "domotica.module.dom-accesos.title": "Control de Accesos por PIN y Código QR Dinámico",
    "domotica.module.dom-accesos.desc": "Cerraduras electrónicas y tornos peatonales de alta resistencia conectados a la nube. Cada jugador recibe en su móvil un PIN temporal o QR válido exclusivamente durante su horario reservado.",
    "domotica.module.dom-accesos.specs.0": "Apertura de pistas sin necesidad de personal en recepción",
    "domotica.module.dom-accesos.specs.1": "Desbloqueo automático 10 minutos antes del inicio del turno",
    "domotica.module.dom-accesos.specs.2": "Registro de auditoría con fecha y milisegundo de entrada",
    "domotica.module.dom-accesos.specs.3": "Integración nativa con cancelas exteriores y puertas de cristal",
    "domotica.module.dom-accesos.kpi": "Operación 24/7 sin personal",

    // Module 3: dom-video
    "domotica.module.dom-video.badge": "Experiencia Viral",
    "domotica.module.dom-video.title": "Cámaras de Repetición y Highlights con Pulsador en Pista",
    "domotica.module.dom-video.desc": "Sistema de grabación continua en bucle con pulsador físico inalámbrico instalado en el poste de la red. Cuando un jugador hace un punto épico, pulsa el botón y el clip se recorta y se envía a su app.",
    "domotica.module.dom-video.specs.0": "Grabación en resolución Full HD 60fps con lente gran angular",
    "domotica.module.dom-video.specs.1": "Generación automática de clip de 30 segundos (20s antes + 10s después)",
    "domotica.module.dom-video.specs.2": "Marca de agua con logotipo y patrocinadores del club",
    "domotica.module.dom-video.specs.3": "Opción de retransmisión en directo por streaming en YouTube",
    "domotica.module.dom-video.kpi": "+400% engagement social",

    // Module 4: dom-clima
    "domotica.module.dom-clima.badge": "Confort en Pista",
    "domotica.module.dom-clima.title": "Climatización, Aerotermia y Sensores Antihumedad",
    "domotica.module.dom-clima.desc": "Sondas IoT de temperatura, humedad relativa y punto de rocío en naves indoor. Activación inteligente de aerotermia y deshumidificadores para evitar cristales empañados.",
    "domotica.module.dom-clima.specs.0": "Prevención total de condensación en vidrios para rebotes limpios",
    "domotica.module.dom-clima.specs.1": "Encendido de calefacción o aire acondicionado según ocupación real",
    "domotica.module.dom-clima.specs.2": "Telemetría continua de calidad del aire y niveles de CO2",
    "domotica.module.dom-clima.specs.3": "Ajuste automático según previsión meteorológica exterior",
    "domotica.module.dom-clima.kpi": "Cristales 100% secos",

    // Module 5: dom-radar
    "domotica.module.dom-radar.badge": "Control en Tiempo Real",
    "domotica.module.dom-radar.title": "Radar de Pista Ocupada y Detección de Presencia",
    "domotica.module.dom-radar.desc": "Sensores volumétricos microondas que monitorizan si los jugadores están efectivamente disputando el partido, liberando la pista o alertando a recepción en caso de no-show.",
    "domotica.module.dom-radar.specs.0": "Detección no invasiva sin reconocimiento facial ni cámaras invasivas",
    "domotica.module.dom-radar.specs.1": "Aviso a recepción tras 15 minutos de incomparecencia",
    "domotica.module.dom-radar.specs.2": "Control de juego no autorizado fuera de horario reservado",
    "domotica.module.dom-radar.specs.3": "Comunicación por protocolo industrial MQTT cifrado de baja latencia",
    "domotica.module.dom-radar.kpi": "Liberación de pistas libres",

    // Module 6: dom-cuadro
    "domotica.module.dom-cuadro.badge": "Hardware Conectado",
    "domotica.module.dom-cuadro.title": "Cuadros Eléctricos Inteligentes y Relés Industriales",
    "domotica.module.dom-cuadro.desc": "Módulos de carril DIN instalados directamente en el cuadro eléctrico general del club. Fabricados bajo normativa europea para soportar cargas continuas y maniobras exigentes.",
    "domotica.module.dom-cuadro.specs.0": "Conexión dual Ethernet cableada y respaldo 4G LTE",
    "domotica.module.dom-cuadro.specs.1": "Medición de consumo eléctrico en kWh en tiempo real por pista",
    "domotica.module.dom-cuadro.specs.2": "Corte de emergencia y rearme automático desde el panel admin",
    "domotica.module.dom-cuadro.specs.3": "Compatibles con cualquier instalación eléctrica existente sin obras",
    "domotica.module.dom-cuadro.kpi": "Telemetría kWh en vivo"
  },

  en: {
    "domotica.eyebrow": "Domotics & Autonomous Padel Courts Setmio IoT",
    "domotica.title": "Autonomous padel courts.",
    "domotica.titleHighlight": "Open 24 hours with zero reception overhead.",
    "domotica.subtitle": "Connect your management software directly to LED lights, access turnstiles, replay cameras, and court climate systems. Turnkey industrial automation installable in under 48 hours.",
    "domotica.ctaDemo": "Request Domotics Demo",
    "domotica.compatible": "Compatible with Schneider, Finder, and Shelly relays",
    "domotica.simTitle": "Live Simulator: Court 1 Center (IoT Control)",
    "domotica.simSubtitle": "See how the smart court reacts when a player interacts with access doors and lighting.",
    "domotica.mqttBadge": "MQTT Broker Online (Ping: 14ms)",

    "domotica.catalogTitle": "Available IoT Hardware & Automation",
    "domotica.catalogSub": "Certified devices natively integrated with the Setmio booking engine.",
    "domotica.hardware.subtitle": "Certified devices natively integrated with the Setmio booking engine.",
    "domotica.status": "Status: ",
    "domotica.ledOn": "Turned On (400 Lux)",
    "domotica.ledOff": "Turned Off (Standby 0W)",
    "domotica.turnOffLights": "Turn Off Lights",
    "domotica.turnOnLights": "Turn On Lights",
    "domotica.scheduledTime": "Scheduled time:",
    "domotica.scheduledDetail": "19:25 to 21:05 (Current booking)",
    "domotica.turnstileTitle": "Court Turnstile / Door",
    "domotica.unlocked": "Unlocked (Open)",
    "domotica.locked": "Locked with PIN",
    "domotica.authorized": "Pass Authorized",
    "domotica.closed": "Closed",
    "domotica.pinPlaceholder": "Enter PIN (e.g. 4829)",
    "domotica.validatePin": "Validate PIN",
    "domotica.pinSuccess": "Valid PIN (#4829). Door unlocked for 10 seconds.",
    "domotica.pinError": "Invalid PIN. Try #4829 or #1234.",
    "domotica.auditClub": "Audit my club",
    "domotica.bannerTitle": "Want to automate your club's padel courts?",
    "domotica.bannerSub": "Our certified engineers inspect your electrical panels and deliver preconfigured controllers ready to plug and play.",
    "domotica.bannerCta": "Request Free Domotics Assessment",

    "domotica.module.dom-luces.badge": "LED Efficiency",
    "domotica.module.dom-luces.title": "Automated LED Spotlight Activation & Scheduling",
    "domotica.module.dom-luces.desc": "Seamless sync with booking calendar. LED competition floods turn on 5 minutes before the match and turn off automatically after play.",
    "domotica.module.dom-luces.specs.0": "Soft start/stop preventing power surges and glare",
    "domotica.module.dom-luces.specs.1": "5-minute courtesy buffer after match end",
    "domotica.module.dom-luces.specs.2": "Manual override from mobile app for maintenance staff",
    "domotica.module.dom-luces.specs.3": "Proven electricity bill savings of up to 40% monthly",
    "domotica.module.dom-luces.kpi": "-40% electricity consumption",

    "domotica.module.dom-accesos.badge": "Autonomous Entry",
    "domotica.module.dom-accesos.title": "PIN & Dynamic QR Code Access Control",
    "domotica.module.dom-accesos.desc": "Heavy-duty electric locks and pedestrian turnstiles connected to the cloud. Each player receives a temporary PIN code valid strictly during their slot.",
    "domotica.module.dom-accesos.specs.0": "Court unlocking without reception staff presence",
    "domotica.module.dom-accesos.specs.1": "Automatic unlock 10 minutes prior to match start",
    "domotica.module.dom-accesos.specs.2": "Audit logs capturing exact millisecond of entry",
    "domotica.module.dom-accesos.specs.3": "Native compatibility with exterior gates and glass doors",
    "domotica.module.dom-accesos.kpi": "24/7 unstaffed operation",

    "domotica.module.dom-video.badge": "Viral Experience",
    "domotica.module.dom-video.title": "Instant Replay Cameras & On-Court Highlight Buttons",
    "domotica.module.dom-video.desc": "Continuous loop recording system with physical wireless push-button on the net post. Press the button after an epic rally to instantly clip and receive the video.",
    "domotica.module.dom-video.specs.0": "Full HD 60fps recording with wide-angle glass optics",
    "domotica.module.dom-video.specs.1": "Automated 30-second highlight generation (20s before + 10s after)",
    "domotica.module.dom-video.specs.2": "Branded watermark with club logo and sponsors",
    "domotica.module.dom-video.specs.3": "Optional YouTube live stream broadcast integration",
    "domotica.module.dom-video.kpi": "+400% social engagement",

    "domotica.module.dom-clima.badge": "Court Comfort",
    "domotica.module.dom-clima.title": "Climate Control, Heat Pumps & Anti-Condensation Sensors",
    "domotica.module.dom-clima.desc": "IoT environmental sensors tracking temperature, relative humidity, and dew point in indoor arenas. Automated dehumidification to keep glass walls dry.",
    "domotica.module.dom-clima.specs.0": "Zero glass fogging ensuring crisp ball rebounds",
    "domotica.module.dom-clima.specs.1": "Heating or cooling tailored to real-time occupancy",
    "domotica.module.dom-clima.specs.2": "Continuous CO2 and air quality telemetry",
    "domotica.module.dom-clima.specs.3": "Weather-forecast adaptive schedule adjustments",
    "domotica.module.dom-clima.kpi": "100% dry glass walls",

    "domotica.module.dom-radar.badge": "Real-Time Tracking",
    "domotica.module.dom-radar.title": "Microwave Court Occupancy Radar & No-Show Detection",
    "domotica.module.dom-radar.desc": "Volumetric microwave sensors detecting whether players are physically on court, freeing up unused courts or notifying reception in case of no-shows.",
    "domotica.module.dom-radar.specs.0": "Non-invasive detection without facial recognition or invasive cameras",
    "domotica.module.dom-radar.specs.1": "Automated notification after 15 minutes of absence",
    "domotica.module.dom-radar.specs.2": "Unauthorized after-hours play detection",
    "domotica.module.dom-radar.specs.3": "Industrial encrypted low-latency MQTT communications",
    "domotica.module.dom-radar.kpi": "Instant court reclamation",

    "domotica.module.dom-cuadro.badge": "Connected Hardware",
    "domotica.module.dom-cuadro.title": "Smart Electrical Panels & Industrial Relays",
    "domotica.module.dom-cuadro.desc": "DIN-rail IoT controllers mounted in the club's main breaker panel. Engineered to European industrial standards for heavy continuous switching.",
    "domotica.module.dom-cuadro.specs.0": "Dual wired Gigabit Ethernet with 4G LTE cellular failover",
    "domotica.module.dom-cuadro.specs.1": "Live per-court kWh power consumption metering",
    "domotica.module.dom-cuadro.specs.2": "Emergency power cutoff and remote breaker reset from admin panel",
    "domotica.module.dom-cuadro.specs.3": "Compatible with existing electrical wiring without civil works",
    "domotica.module.dom-cuadro.kpi": "Live kWh power telemetry"
  },

  gl: {
    "domotica.eyebrow": "Domótica & Pistas Autónomas Setmio IoT",
    "domotica.title": "Pistas de pádel autónomas.",
    "domotica.titleHighlight": "Abre as 24 horas sen custos de recepción.",
    "domotica.subtitle": "Conecta o teu software de xestión con luces LED, tornos de acceso, cámaras de repetición e climatización. Automatización industrial lista en menos de 48 horas.",
    "domotica.ctaDemo": "Solicitar Demo de Domótica",
    "domotica.compatible": "Compatible con relés Schneider, Finder e Shelly",
    "domotica.simTitle": "Simulador en Vivo: Pista 1 Central (Control IoT)",
    "domotica.simSubtitle": "Comproba como reacciona a pista cando un xogador interactúa co acceso e iluminación.",
    "domotica.mqttBadge": "MQTT Broker Conectado (Ping: 14ms)",
    "domotica.catalogTitle": "Hardware e Automatizacións IoT Dispoñibles",
    "domotica.catalogSub": "Dispositivos certificados e integrados de xeito nativo co motor de reservas de Setmio.",
    "domotica.status": "Estado: ",
    "domotica.ledOn": "Acendido (400 Lux)",
    "domotica.ledOff": "Apagado (Standby 0W)",
    "domotica.turnOffLights": "Apagar Focos",
    "domotica.turnOnLights": "Acender Focos",
    "domotica.scheduledTime": "Horario programado:",
    "domotica.scheduledDetail": "19:25 a 21:05 (Reserva actual)",
    "domotica.turnstileTitle": "Torno / Porta de Pista",
    "domotica.unlocked": "Desbloqueado (Aberto)",
    "domotica.locked": "Bloqueado con PIN",
    "domotica.authorized": "Pase Autorizado",
    "domotica.closed": "Pechado",
    "domotica.pinPlaceholder": "Introduce PIN (ex: 4829)",
    "domotica.validatePin": "Validar PIN",
    "domotica.pinSuccess": "PIN correcto (#4829). Porta aberta durante 10 segundos.",
    "domotica.pinError": "PIN incorrecto. Proba con #4829 ou #1234.",
    "domotica.auditClub": "Auditar o meu club",
    "domotica.bannerTitle": "¿Queres automatizar as pistas do teu club?",
    "domotica.bannerSub": "Os nosos enxeñeiros avalían a instalación eléctrica do teu club e preparan os cadros preconfigurados.",
    "domotica.bannerCta": "Solicitar Estudo de Domótica de Balde"
  },

  ca: {
    "domotica.eyebrow": "Domòtica & Pistes Autònomes Setmio IoT",
    "domotica.title": "Pistes de pàdel autònomes.",
    "domotica.titleHighlight": "Obre les 24 hores sense costos de recepció.",
    "domotica.subtitle": "Connecta el teu programari de gestió amb llums LED, torns d'accés, càmeres de repetició i climatització. Automatització industrial instal·lable en menys de 48 hores.",
    "domotica.ctaDemo": "Sol·licitar Demo de Domòtica",
    "domotica.compatible": "Compatible amb relés Schneider, Finder i Shelly",
    "domotica.simTitle": "Simulador en Viu: Pista 1 Central (Control IoT)",
    "domotica.simSubtitle": "Comprova com reacciona la pista intel·ligent quan un jugador interactua amb accessos i llums.",
    "domotica.mqttBadge": "MQTT Broker Connectat (Ping: 14ms)",
    "domotica.catalogTitle": "Hardware i Automatitzacions IoT Disponibles",
    "domotica.catalogSub": "Dispositius certificats i integrats de forma nativa amb el motor de reserves de Setmio.",
    "domotica.status": "Estat: ",
    "domotica.ledOn": "Encès (400 Lux)",
    "domotica.ledOff": "Apagat (Standby 0W)",
    "domotica.turnOffLights": "Apagar Focs",
    "domotica.turnOnLights": "Encendre Focs",
    "domotica.scheduledTime": "Horari programat:",
    "domotica.scheduledDetail": "19:25 a 21:05 (Reserva actual)",
    "domotica.turnstileTitle": "Torn / Porta de Pista",
    "domotica.unlocked": "Desbloquejat (Obert)",
    "domotica.locked": "Bloquejat amb PIN",
    "domotica.authorized": "Pas Autoritzat",
    "domotica.closed": "Tancat",
    "domotica.pinPlaceholder": "Introdueix PIN (ex: 4829)",
    "domotica.validatePin": "Validar PIN",
    "domotica.pinSuccess": "PIN correcte (#4829). Porta oberta durant 10 segons.",
    "domotica.pinError": "PIN incorrecte. Prova amb #4829 o #1234.",
    "domotica.auditClub": "Auditar el meu club",
    "domotica.bannerTitle": "Vols automatitzar les pistes del teu club?",
    "domotica.bannerSub": "Els nostres enginyers avaluen la instal·lació elèctrica i preparen els quadres preconfigurats.",
    "domotica.bannerCta": "Sol·licitar Estudi de Domòtica Gratuït"
  }
};

// Aliases for VA, EU, PT, FR, DE, IT, AR (Strict rule: fallback to EN, NEVER ES)
DOMOTICA_TRANSLATIONS.va = { ...DOMOTICA_TRANSLATIONS.ca };
DOMOTICA_TRANSLATIONS.eu = { ...DOMOTICA_TRANSLATIONS.en };
DOMOTICA_TRANSLATIONS.pt = { ...DOMOTICA_TRANSLATIONS.en };
DOMOTICA_TRANSLATIONS.it = { ...DOMOTICA_TRANSLATIONS.en };
DOMOTICA_TRANSLATIONS.fr = { ...DOMOTICA_TRANSLATIONS.en };
DOMOTICA_TRANSLATIONS.de = { ...DOMOTICA_TRANSLATIONS.en };
DOMOTICA_TRANSLATIONS.ar = { ...DOMOTICA_TRANSLATIONS.en };

DOMOTICA_TRANSLATIONS.va["domotica.hardware.subtitle"] = "Dispositius certificats i integrats de forma nativa amb el motor de reserves de Setmio.";
DOMOTICA_TRANSLATIONS.va["domotica.catalogSub"] = "Dispositius certificats i integrats de forma nativa amb el motor de reserves de Setmio.";

DOMOTICA_TRANSLATIONS.eu["domotica.hardware.subtitle"] = "Setmioko erreserba-motorrarekin modu natiboan integratutako gailu ziurtatuak.";
DOMOTICA_TRANSLATIONS.eu["domotica.catalogSub"] = "Setmioko erreserba-motorrarekin modu natiboan integratutako gailu ziurtatuak.";

DOMOTICA_TRANSLATIONS.ar["domotica.hardware.subtitle"] = "أجهزة معتمدة ومدمجة بشكل أصلي مع محرك حجوزات Setmio.";
DOMOTICA_TRANSLATIONS.ar["domotica.catalogSub"] = "أجهزة معتمدة ومدمجة بشكل أصلي مع محرك حجوزات Setmio.";

DOMOTICA_TRANSLATIONS.pt["domotica.hardware.subtitle"] = "Dispositivos certificados e integrados de forma nativa com o motor de reservas da Setmio.";
DOMOTICA_TRANSLATIONS.pt["domotica.catalogSub"] = "Dispositivos certificados e integrados de forma nativa com o motor de reservas da Setmio.";

DOMOTICA_TRANSLATIONS.fr["domotica.hardware.subtitle"] = "Appareils certifiés et intégrés nativement au moteur de réservation Setmio.";
DOMOTICA_TRANSLATIONS.fr["domotica.catalogSub"] = "Appareils certifiés et intégrés nativement au moteur de réservation Setmio.";

DOMOTICA_TRANSLATIONS.de["domotica.hardware.subtitle"] = "Zertifizierte und nativ in die Setmio-Buchungsmaschine integrierte Geräte.";
DOMOTICA_TRANSLATIONS.de["domotica.catalogSub"] = "Zertifizierte und nativ in die Setmio-Buchungsmaschine integrierte Geräte.";

DOMOTICA_TRANSLATIONS.it["domotica.hardware.subtitle"] = "Dispositivi certificati e integrati nativamente con il motore di prenotazione di Setmio.";
DOMOTICA_TRANSLATIONS.it["domotica.catalogSub"] = "Dispositivi certificati e integrati nativamente con il motore di prenotazione di Setmio.";

// Italian additions
DOMOTICA_TRANSLATIONS.it = {
  ...DOMOTICA_TRANSLATIONS.it,
  "domotica.title": "Campi da padel autonomi.",
  "domotica.titleHighlight": "Aperti 24 ore su 24 senza costi di reception.",
  "domotica.ctaDemo": "Richiedi Demo Domotica",
  "domotica.simTitle": "Simulatore dal Vivo: Campo 1 Centrale (Controllo IoT)",
  "domotica.catalogTitle": "Hardware e Automazioni IoT Disponibili",
  "domotica.status": "Stato: ",
  "domotica.ledOn": "Acceso (400 Lux)",
  "domotica.ledOff": "Spento (Standby 0W)",
  "domotica.turnOffLights": "Spegni Fari",
  "domotica.turnOnLights": "Accendi Fari",
  "domotica.turnstileTitle": "Tornello / Porta del Campo",
  "domotica.unlocked": "Sbloccato (Aperto)",
  "domotica.locked": "Bloccato con PIN",
  "domotica.pinPlaceholder": "Inserisci PIN (es: 4829)",
  "domotica.validatePin": "Verifica PIN",
  "domotica.bannerTitle": "Vuoi automatizzare i campi del tuo club?",
  "domotica.bannerCta": "Richiedi Studio Domotico Gratuito"
};
