import { PublicPage } from '../../../context/AppContext';

export type SetmioProSegmentId =
  | 'clubes'
  | 'escuelas'
  | 'profesores'
  | 'administraciones'
  | 'federaciones'
  | 'equipos'
  | 'profesionales';

export interface SegmentCapability {
  title: string;
  desc: string;
  bullets: string[];
  specLabel: string;
}

export interface SegmentWorkflowStep {
  number: string;
  title: string;
  desc: string;
}

export interface SegmentDeploymentItem {
  label: string;
  value: string;
  detail: string;
}

export interface SetmioProSegment {
  id: SetmioProSegmentId;
  order: string;
  pageKey: PublicPage;
  path: string;
  shortTitle: string;
  badge: string;
  title: string;
  headline: string;
  summary: string;
  heroDetail: string;
  highlights: string[];
  capabilities: SegmentCapability[];
  workflow: SegmentWorkflowStep[];
  deployment: SegmentDeploymentItem[];
  outcomeTitle: string;
  outcomes: string[];
  recommendedPlan: string;
}

export const SETMIO_PRO_SEGMENTS: SetmioProSegment[] = [
  {
    id: 'clubes',
    order: '01',
    pageKey: 'solution_clubs',
    path: '/soluciones/clubes',
    shortTitle: 'Clubes de Pádel',
    badge: 'Setmio Pro · Instalaciones',
    title: 'Clubes de Pádel',
    headline: 'Operación integral de pistas, cobros y socios bajo tu propia marca.',
    summary:
      'Centraliza el cuadrante multi-sede, elimina la morosidad mediante pagos divididos directos al IBAN y automatiza iluminación y accesos 24/7.',
    heroDetail:
      'Diseñado para clubes privados, centros indoor y cadenas multi-sede de 2 a 30+ pistas. Tus jugadores reservan en tu web y app de marca blanca sin intermediarios ni comisiones por pista.',
    highlights: [
      'Cuadrante táctil multi-pista con tarifas por franja',
      'Pago dividido 1/4 directo a tu cuenta bancaria',
      'Domótica LED y control de acceso por PIN o QR',
      'TPV de bar, tienda pro-shop y facturación AEAT',
    ],
    capabilities: [
      {
        title: 'Cuadrante reactivo y tarifas dinámicas',
        desc: 'Control de reservas en tiempo real para pistas indoor, exteriores e individuales con reglas por socio o franja horaria.',
        bullets: [
          'Tarifas valle y pico diferenciadas por día y tipo de socio',
          'Bloqueos por mantenimiento, torneos o clases de escuela',
          'Gestión multi-sede unificada desde un mismo panel',
        ],
        specLabel: 'Sincronización instantánea entre recepción, web y app',
      },
      {
        title: 'Cobro directo y Split Payment',
        desc: 'Cada jugador abona su parte de la pista con Bizum, tarjeta o monedero del club antes de entrar.',
        bullets: [
          'Liquidación directa en tu cuenta bancaria sin retenciones',
          'Monedero digital de club con recargas bonificadas',
          'Cobro automático de suplementos de luz o alquiler de palas',
        ],
        specLabel: 'Compatible con Redsys, Stripe, Bizum y SEPA',
      },
      {
        title: 'Domótica IoT y apertura desatendida',
        desc: 'Opera en horarios de mañana y noche sin recepcionista presencial manteniendo el control de acceso.',
        bullets: [
          'Encendido de focos LED 5 minutos antes del partido',
          'Apagado automático tras un margen configurable de cortesía',
          'Códigos PIN temporales por reserva para tornos y puertas',
        ],
        specLabel: 'Relés IP industriales con memoria horaria local',
      },
      {
        title: 'TPV integrado y marca blanca propia',
        desc: 'Bar, tienda y presencia digital propia bajo tu dominio corporativo sin fugas hacia clubes rivales.',
        bullets: [
          'Cargo directo de consumiciones a la cuenta de la pista',
          'Control de stock y prueba de palas (Test Center)',
          'Web pública y PWA instalable con tu logotipo y dominio',
        ],
        specLabel: 'Certificado SSL dedicado y facturación VeriFactu',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Reserva en tu marca blanca',
        desc: 'El jugador accede al enlace propio de tu club, elige pista y divide el importe entre los participantes.',
      },
      {
        number: '02',
        title: 'Validación y PIN de acceso',
        desc: 'Al completarse el pago, el sistema emite el código PIN temporal y programa el circuito eléctrico de la pista.',
      },
      {
        number: '03',
        title: 'Juego y consumo en pista',
        desc: 'La iluminación se enciende automáticamente y el personal anota bebidas o bolas en el TPV táctil en dos toques.',
      },
      {
        number: '04',
        title: 'Cierre contable automático',
        desc: 'Cada movimiento queda conciliado en caja y preparado para exportación fiscal mensual.',
      },
    ],
    deployment: [
      { label: 'Migración inicial', value: '24 - 48 h', detail: 'Importación asistida de socios, bonos y saldos' },
      { label: 'Dominio y marca', value: '100% Propio', detail: 'Dominio personalizado y colores del club' },
      { label: 'Comisión por reserva', value: '0%', detail: 'Suscripción fija sin peajes por pista' },
    ],
    outcomeTitle: 'Impacto operativo en clubes activos',
    outcomes: [
      'Eliminación de reservas impagadas mediante cobro previo fraccionado',
      'Reducción drástica de llamadas repetitivas en recepción',
      'Ahorro eléctrico en pistas sin uso o partidos cancelados',
      'Retención del socio dentro de la identidad y canal del club',
    ],
    recommendedPlan: 'Plan Club / Club Pro',
  },
  {
    id: 'escuelas',
    order: '02',
    pageKey: 'solution_schools',
    path: '/soluciones/escuelas',
    shortTitle: 'Academias y Escuelas',
    badge: 'Setmio Pro · Formación',
    title: 'Academias y Escuelas',
    headline: 'Organiza grupos, niveles, monitores y cuotas recurrentes sin hojas de cálculo.',
    summary:
      'Diseñado para escuelas de pádel con volumen alto de alumnos, trimestres estructurados, recuperaciones de clase y remesas bancarias automáticas.',
    heroDetail:
      'Unifica la planificación académica con la disponibilidad real de pistas. Asigna entrenadores, controla asistencia desde el móvil en pista y automatiza el cobro mensual o trimestral de cada alumno.',
    highlights: [
      'Agrupación por nivel, edad y disponibilidad horaria',
      'Remesas SEPA y cobro recurrente con tarjeta',
      'Control de asistencia y gestión de recuperaciones',
      'Comunicación directa con familias y alumnos',
    ],
    capabilities: [
      {
        title: 'Matriz de grupos y niveles',
        desc: 'Clasifica alumnos por nivel técnico, categoría infantil o adulto y franja horaria preferida.',
        bullets: [
          'Listas de espera automáticas ante bajas de plaza',
          'Seguimiento de ocupación por grupo y monitor',
          'Traspaso ágil entre temporadas o trimestres',
        ],
        specLabel: 'Vista semanal por pista docente y horario',
      },
      {
        title: 'Facturación académica y remesas SEPA',
        desc: 'Olvida el seguimiento manual de recibos, transferencias o pagos en efectivo en recepción.',
        bullets: [
          'Generación de remesas SEPA ISO 20022 en un clic',
          'Cobro recurrente mensual, trimestral o por bono',
          'Control claro de cuotas pendientes y descuentos familiares',
        ],
        specLabel: 'Conciliación automática por alumno y tutor',
      },
      {
        title: 'Asistencia y recuperación de clases',
        desc: 'Los profesores registran faltas en segundos desde pista y el alumno solicita recuperación en huecos libres.',
        bullets: [
          'Aviso previo de ausencia con liberación automática de plaza',
          'Reglas de caducidad y cupo máximo de recuperaciones',
          'Historial completo de sesiones impartidas por grupo',
        ],
        specLabel: 'Acceso móvil ligero para todo el equipo docente',
      },
      {
        title: 'Evaluación técnica periódica',
        desc: 'Comparte informes estructurados de evolución de golpeo, táctica y objetivos con cada alumno.',
        bullets: [
          'Rúbricas configurables por etapa formativa',
          'Evolución del nivel deportivo vinculada a la ficha',
          'Portal privado para consulta de padres y jugadores',
        ],
        specLabel: 'Histórico técnico trimestral descargable',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Inscripción y prueba de nivel',
        desc: 'El alumno se registra online indicando su disponibilidad y recibe asignación al grupo adecuado.',
      },
      {
        number: '02',
        title: 'Reserva fija de pistas y monitores',
        desc: 'El cuadrante bloquea automáticamente las pistas docentes durante toda la temporada sin solapamientos.',
      },
      {
        number: '03',
        title: 'Pase de lista desde pista',
        desc: 'Cada monitor marca asistencia y notas técnicas desde su teléfono al comenzar la sesión.',
      },
      {
        number: '04',
        title: 'Liquidación recurrente mensual',
        desc: 'Las cuotas se cobran de forma automatizada el día configurado con envío de recibo.',
      },
    ],
    deployment: [
      { label: 'Alta de grupos', value: 'Importación CSV', detail: 'Carga rápida de alumnos y horarios actuales' },
      { label: 'Cobros recurrentes', value: 'SEPA + Tarjeta', detail: 'Remesas bancarias y domiciliación digital' },
      { label: 'Pistas vinculadas', value: 'Multi-sede', detail: 'Para escuelas dentro de uno o varios clubes' },
    ],
    outcomeTitle: 'Control docente y administrativo',
    outcomes: [
      'Ahorro semanal de horas de coordinación y mensajería dispersa',
      'Cero errores en asignación de profesores o pistas duplicadas',
      'Aprovechamiento de plazas vacantes mediante recuperaciones ordenadas',
      'Visibilidad real de rentabilidad por grupo y franja docente',
    ],
    recommendedPlan: 'Plan Club / Academia',
  },
  {
    id: 'profesores',
    order: '03',
    pageKey: 'solution_coaches',
    path: '/soluciones/profesores',
    shortTitle: 'Entrenadores y Profesores',
    badge: 'Setmio Pro · Entrenadores',
    title: 'Entrenadores y Profesores',
    headline: 'Tu agenda profesional, bonos de alumnos y seguimiento técnico en un solo lugar.',
    summary:
      'Para entrenadores independientes o directores técnicos que necesitan ordenar sus clases particulares, bonos de sesiones y progreso de sus jugadores.',
    heroDetail:
      'Opera con una imagen profesional propia sin depender de cuadernos ni chats interminables. Gestiona clases individuales o en parejas, controla bonos consumidos y documenta el progreso de cada jugador.',
    highlights: [
      'Agenda personal con reserva de clases y bonos',
      'Portal web propio del entrenador con marca personal',
      'Ficha técnica individual con objetivos y vídeos/notas',
      'Control de ingresos y sesiones pendientes por alumno',
    ],
    capabilities: [
      {
        title: 'Agenda y reserva de clases particulares',
        desc: 'Publica tus franjas disponibles y deja que tus alumnos reserven o reprogramen respetando tu política de cancelación.',
        bullets: [
          'Sesiones individuales, dúos o grupos reducidos',
          'Bloqueo automático de descansos y desplazamientos entre clubes',
          'Recordatorios automáticos previos a cada clase',
        ],
        specLabel: 'Sincronización con calendario personal del técnico',
      },
      {
        title: 'Bonos de clases y cobro ágil',
        desc: 'Vende bonos de 5, 10 o 20 sesiones con descuento automático de clases asistidas.',
        bullets: [
          'Saldo de clases restantes visible para profesor y alumno',
          'Renovación sencilla con aviso al quedar 1 sesión',
          'Registro claro de ingresos mensuales por tipo de clase',
        ],
        specLabel: 'Sin cobros olvidados ni confusión de sesiones',
      },
      {
        title: 'Cuaderno técnico del jugador',
        desc: 'Anota correcciones de derecha, bandeja, volea y posicionamiento tras cada entrenamiento.',
        bullets: [
          'Objetivos tácticos y ejercicios recomendados por sesión',
          'Evolución comparativa por áreas de juego',
          'Historial accesible para el alumno tras la clase',
        ],
        specLabel: 'Metodología estructurada y profesional',
      },
      {
        title: 'Web personal de marca propia',
        desc: 'Presenta tu metodología, tarifas y sedes donde impartes clase desde tu propio enlace profesional.',
        bullets: [
          'Biografía deportiva, titulaciones y sedes habituales',
          'Formulario directo de prueba de nivel y contacto',
          'Sin necesidad de conocimientos técnicos de diseño web',
        ],
        specLabel: 'Lista para compartir en perfil social o WhatsApp',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Configura tus franjas y tarifas',
        desc: 'Define horarios de clase, precios por sesión o bono y clubes donde impartes entrenamiento.',
      },
      {
        number: '02',
        title: 'Comparte tu enlace de reserva',
        desc: 'Tus alumnos consultan huecos libres en tiempo real y confirman su clase en segundos.',
      },
      {
        number: '03',
        title: 'Imparte y registra progreso',
        desc: 'Al finalizar la hora, marcas asistencia para descontar del bono y añades una nota técnica breve.',
      },
      {
        number: '04',
        title: 'Controla tu facturación mensual',
        desc: 'Consulta sesiones impartidas, bonos activos y liquidación por club o alumno al instante.',
      },
    ],
    deployment: [
      { label: 'Puesta en marcha', value: 'Mismo día', detail: 'Configuración guiada de horario y bonos' },
      { label: 'Infraestructura', value: 'Sin pistas propias', detail: 'Válido trabajando en uno o varios clubes' },
      { label: 'Portal incluido', value: 'App + Web', detail: 'Vista limpia para ti y tus alumnos' },
    ],
    outcomeTitle: 'Ventajas para el entrenador',
    outcomes: [
      'Fin de la gestión manual de cambios de hora por WhatsApp',
      'Transparencia total en el consumo de bonos de clases',
      'Seguimiento técnico diferencial frente a entrenadores informales',
      'Escalabilidad para ampliar alumnos sin más carga administrativa',
    ],
    recommendedPlan: 'Plan Entrenador / Coach',
  },
  {
    id: 'administraciones',
    order: '04',
    pageKey: 'solution_councils',
    path: '/soluciones/administraciones',
    shortTitle: 'Administraciones Públicas',
    badge: 'Setmio Pro · Sector Público',
    title: 'Administraciones Públicas y Ayuntamientos',
    headline: 'Pistas municipales accesibles, trazables y automatizadas sin personal permanente.',
    summary:
      'Digitaliza instalaciones deportivas municipales con validación de empadronamiento, tasas públicas diferenciadas, apertura autónoma por PIN y control contable completo.',
    heroDetail:
      'Permite que cualquier ciudadano reserve una pista municipal de forma transparente y acceda mediante código PIN con encendido automático de iluminación, cumpliendo requisitos de seguridad, auditoría y accesibilidad.',
    highlights: [
      'Tarifas diferenciadas para empadronados y clubes locales',
      'Acceso autónomo por PIN y control energético de focos',
      'Trazabilidad íntegra de reservas, usos y recaudación',
      'Portal ciudadano accesible y conforme a RGPD europeo',
    ],
    capabilities: [
      {
        title: 'Reglas de servicio público y empadronamiento',
        desc: 'Configura precios públicos oficiales, cupos semanales por ciudadano y prioridad para vecinos empadronados.',
        bullets: [
          'Validación de perfil residente o abonado deportivo municipal',
          'Límites de antelación y reservas activas para evitar acaparamiento',
          'Reserva reservada para escuelas municipales y asociaciones',
        ],
        specLabel: 'Adaptable a ordenanzas fiscales municipales',
      },
      {
        title: 'Apertura sin conserje y ahorro energético',
        desc: 'Elimina recogidas de llaves en dependencias municipales y evita que los focos permanezcan encendidos sin uso.',
        bullets: [
          'Código PIN único válido solo durante la franja reservada',
          'Activación automática de iluminación únicamente si hay reserva',
          'Registro auditable de aperturas y consumos eléctricos',
        ],
        specLabel: 'Apto para complejos dispersos y pistas rurales',
      },
      {
        title: 'Transparencia y reporting para intervención',
        desc: 'Informes claros de ocupación por pista, tramos horarios, recaudación y exenciones para auditoría municipal.',
        bullets: [
          'Desglose completo de ingresos por tasa, fecha y canal',
          'Exportación en formatos estándar para contabilidad pública',
          'Registro íntegro de anulaciones y devoluciones autorizadas',
        ],
        specLabel: 'Alojamiento seguro en la Unión Europea',
      },
      {
        title: 'Portal ciudadano multidioma y accesible',
        desc: 'Interfaz limpia con identidad del ayuntamiento o patronato de deportes, optimizada para móvil y lectura clara.',
        bullets: [
          'Soporte multidioma nativo (castellano, gallego, catalán, valenciano, euskera, inglés)',
          'Pago electrónico conforme a pasarelas institucionales',
          'Aviso inmediato ante cierres por meteorología o mantenimiento',
        ],
        specLabel: 'Integrable en la web municipal existente',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Configuración de ordenanza y pistas',
        desc: 'Parametrizamos tasas para empadronados, horarios de apertura y reglas de cesión a clubes locales.',
      },
      {
        number: '02',
        title: 'Reserva ciudadana verificada',
        desc: 'El vecino selecciona instalación y franja horaria desde el portal del ayuntamiento y abona la tasa.',
      },
      {
        number: '03',
        title: 'Acceso autónomo con PIN',
        desc: 'Recibe su código temporal para abrir la puerta peatonal y activa los focos durante su partido.',
      },
      {
        number: '04',
        title: 'Auditoría e informe de uso',
        desc: 'El área de deportes consulta métricas reales de ocupación y liquidación mensual en un clic.',
      },
    ],
    deployment: [
      { label: 'Contratación', value: 'Licitación / Menor', detail: 'Documentación técnica y memoria preparadas' },
      { label: 'Alojamiento', value: 'UE Certificado', detail: 'Cumplimiento estricto RGPD y cifrado' },
      { label: 'Soporte', value: 'Instaladores locales', detail: 'Compatible con electricistas homologados' },
    ],
    outcomeTitle: 'Beneficios para el municipio',
    outcomes: [
      'Ampliación real del horario ciudadano sin ampliar turnos de conserjería',
      'Reparto justo y transparente de instalaciones entre vecinos y escuelas',
      'Reducción comprobable del gasto eléctrico en pistas exteriores e indoor',
      'Eliminación de gestiones presenciales en registros o polideportivos',
    ],
    recommendedPlan: 'Plan Enterprise / Sector Público',
  },
  {
    id: 'federaciones',
    order: '05',
    pageKey: 'solution_federations',
    path: '/soluciones/federaciones',
    shortTitle: 'Federaciones',
    badge: 'Setmio Pro · Organismos',
    title: 'Federaciones Territoriales y Nacionales',
    headline: 'Licencias, circuitos oficiales, ligas interclubes y rankings conectados en tiempo real.',
    summary:
      'Infraestructura centralizada para federaciones que coordinan clubes afiliados, jueces árbitros, pruebas puntuables y selecciones autonómicas o nacionales.',
    heroDetail:
      'Conecta directamente a la federación con los clubes sede sin duplicar inscripciones ni actas en papel. Centraliza licencias activas, calendarios de competición, cuadros oficiales y cálculo automático de puntuación.',
    highlights: [
      'Censo único de licencias federativas y clubes afiliados',
      'Motor de circuitos oficiales, fases previas y cuadros',
      'Actas digitales para jueces árbitros en pista',
      'Rankings autonómicos y por categorías actualizados al instante',
    ],
    capabilities: [
      {
        title: 'Gestión de licencias y clubes afiliados',
        desc: 'Control unificado de altas, renovaciones anuales, categorías de edad y validación de habilitación competitiva.',
        bullets: [
          'Verificación instantánea de licencia vigente al inscribirse',
          'Directorio estructurado de clubes sede y técnicos titulados',
          'Gestión de cuotas federativas y seguros deportivos',
        ],
        specLabel: 'Base de datos centralizada y auditable',
      },
      {
        title: 'Circuitos, torneos y ligas por equipos',
        desc: 'Orquesta pruebas absolutas, de menores, veteranos y ligas federadas multi-sede con cientos de parejas.',
        bullets: [
          'Cálculo automático de cabezas de serie según ranking vigente',
          'Asignación multi-club cuando una prueba usa varias sedes',
          'Gestión de enfrentamientos por equipos y actas de capitanes',
        ],
        specLabel: 'Cuadros eliminatorios, grupos y consolación',
      },
      {
        title: 'Mesa arbitral y publicación en vivo',
        desc: 'Los árbitros introducen resultados desde tablet o móvil y la clasificación y próximos cruces se actualizan al instante.',
        bullets: [
          'Control de órdenes de juego por club, pista y hora',
          'Validación de W.O., incidencias y observaciones arbitrales',
          'Consulta pública limpia de horarios y resultados para jugadores',
        ],
        specLabel: 'Cero PDFs desactualizados o cuadros manuales',
      },
      {
        title: 'Portal institucional de marca blanca',
        desc: 'Despliegue bajo el dominio oficial de la federación con normativa, circulares y estadísticas históricas.',
        bullets: [
          'Histórico deportivo por jugador y temporada',
          'Comunicación segmentada a clubes, técnicos y federados',
          'Exportación de datos para organismos superiores',
        ],
        specLabel: 'Arquitectura multi-delegación territorial',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Publicación del calendario oficial',
        desc: 'La federación abre el calendario de pruebas y vincula los clubes sede encargados de acoger cada jornada.',
      },
      {
        number: '02',
        title: 'Inscripción validada por licencia',
        desc: 'Parejas y equipos formalizan inscripción comprobando automáticamente licencia activa y categoría.',
      },
      {
        number: '03',
        title: 'Sorteo, orden de juego y actas',
        desc: 'Se generan cuadros y horarios respetando restricciones; los jueces actualizan marcadores en directo.',
      },
      {
        number: '04',
        title: 'Actualización de ranking oficial',
        desc: 'Al cerrarse el cuadro, los puntos se suman automáticamente al ranking oficial de la temporada.',
      },
    ],
    deployment: [
      { label: 'Alcance', value: 'Multi-club', detail: 'Sincronización directa con sedes afiliadas' },
      { label: 'Migración', value: 'Histórico + Censo', detail: 'Importación de rankings y licencias previas' },
      { label: 'Gobernanza', value: 'Roles y Árbitros', detail: 'Permisos granulares por comité y juez' },
    ],
    outcomeTitle: 'Solidez institucional y competitiva',
    outcomes: [
      'Fin de errores manuales en cabezas de serie o puntuación',
      'Coordinación fluida entre comité de competición y clubes sede',
      'Transparencia inmediata para jugadores, técnicos y patrocinadores',
      'Reducción drástica de carga operativa en cada fin de semana de prueba',
    ],
    recommendedPlan: 'Plan Enterprise / Federaciones',
  },
  {
    id: 'equipos',
    order: '06',
    pageKey: 'solution_teams',
    path: '/soluciones/equipos',
    shortTitle: 'Equipos',
    badge: 'Setmio Pro · Colectivos y Ligas',
    title: 'Equipos Independientes y Colectivos Competitivos',
    headline: 'Organiza plantillas, convocatorias, alineaciones y cuotas de equipo sin depender de un club.',
    summary:
      'Solución dedicada para equipos de liga interclubes, colectivos corporativos o grupos competitivos que contratan Setmio directamente para gestionar su temporada.',
    heroDetail:
      'Muchos equipos compiten en ligas territoriales o entrenan en diferentes instalaciones sin contar con el software de un único club. Setmio permite al capitán o gestor del equipo profesionalizar su plantilla, convocatorias, tesorería y rendimiento colectivo.',
    highlights: [
      'Gestión de plantilla completa, categorías y capitanía',
      'Encuestas de disponibilidad y convocatorias por jornada',
      'Constructor de parejas y alineaciones según nivel y lado',
      'Bote común del equipo, cuotas de equipación e inscripciones',
    ],
    capabilities: [
      {
        title: 'Plantilla, disponibilidad y convocatorias',
        desc: 'Olvida listas infinitas en grupos de mensajería para saber quién puede jugar el domingo.',
        bullets: [
          'Confirmación de asistencia por jornada en un toque',
          'Control de rotación y partidos jugados por cada integrante',
          'Notificaciones automáticas ante bajas de última hora',
        ],
        specLabel: 'Visibilidad inmediata para capitanes y entrenadores',
      },
      {
        title: 'Alineaciones y parejas óptimas',
        desc: 'Configura las 3, 4 o 5 parejas de cada enfrentamiento combinando posiciones de drive/revés y compatibilidad.',
        bullets: [
          'Histórico de resultados por pareja dentro del equipo',
          'Respeto automático a orden de ranking exigido por la liga',
          'Envío de convocatoria oficial y hora de encuentro al grupo',
        ],
        specLabel: 'Preparado para ligas SNP, federadas o sociales',
      },
      {
        title: 'Tesorería compartida y pagos de equipo',
        desc: 'Centraliza cuotas de inscripción, equipaciones, alquiler de pistas de entrenamiento y desplazamientos.',
        bullets: [
          'Reparto transparente de gastos entre los jugadores convocados',
          'Seguimiento claro de cuotas pagadas y pendientes',
          'Control de talla de equipación y entregas de material',
        ],
        specLabel: 'Cero adelantos de dinero sin control para el capitán',
      },
      {
        title: 'Calendario multi-sede y estadísticas',
        desc: 'Centraliza entrenamientos, partidos de liga como local o visitante y rendimiento de la temporada.',
        bullets: [
          'Historial de enfrentamientos contra equipos rivales',
          'Clasificación, sets a favor y racha del colectivo',
          'Enlace directo a las pistas reservadas para entrenamientos',
        ],
        specLabel: 'Funciona aunque el equipo juegue en varios clubes',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Alta del equipo y plantilla',
        desc: 'El capitán crea el espacio del equipo, invita a sus jugadores y define posición habitual y categoría.',
      },
      {
        number: '02',
        title: 'Publicación del calendario de liga',
        desc: 'Se cargan jornadas, entrenamientos y desplazamientos con fechas y horarios límite de disponibilidad.',
      },
      {
        number: '03',
        title: 'Convocatoria y cierre de parejas',
        desc: 'Con las respuestas confirmadas, el capitán fija la alineación y publica el parte de jornada.',
      },
      {
        number: '04',
        title: 'Actas, estadísticas y balance',
        desc: 'Tras cada eliminatoria se registran resultados para seguir el rendimiento colectivo y ajustar parejas.',
      },
    ],
    deployment: [
      { label: 'Activación', value: 'Inmediata', detail: 'Sin instalación física ni infraestructura de pistas' },
      { label: 'Contratación', value: 'Directa por equipo', detail: 'Independiente de que un club use Setmio' },
      { label: 'Integración', value: 'Setmio Player', detail: 'Los jugadores ven su convocatoria en su app' },
    ],
    outcomeTitle: 'Por qué los equipos eligen Setmio',
    outcomes: [
      'Ahorro de horas semanales al capitán organizando jornadas',
      'Criterios objetivos para formar parejas competitivas',
      'Control limpio de cuotas, inscripciones y equipaciones',
      'Experiencia profesional para ligas amateurs, empresa y federadas',
    ],
    recommendedPlan: 'Plan Equipos / Coach',
  },
  {
    id: 'profesionales',
    order: '07',
    pageKey: 'solution_pro_players',
    path: '/soluciones/jugadores-profesionales',
    shortTitle: 'Jugador Profesional',
    badge: 'Setmio Pro · Atletas',
    title: 'Jugador Profesional',
    headline: 'Tu oficina digital de carrera deportiva, patrocinadores, clinics y presencia propia.',
    summary:
      'Portal profesional para atletas de circuito que centraliza calendario de torneos, acuerdos con marcas, clinics exclusivos y venta de equipación.',
    heroDetail:
      'Construye un activo digital propio al margen de redes sociales cambiantes. Presenta tu temporada, gestiona solicitudes de eventos corporativos o clinics y ofrece a patrocinadores métricas reales de alcance.',
    highlights: [
      'Web oficial de atleta con dominio personalizado',
      'Agenda pública de torneos, exhibiciones y clinics',
      'Escaparate estructurado para marcas patrocinadoras',
      'Gestión de solicitudes de eventos y pro-ams',
    ],
    capabilities: [
      {
        title: 'Presencia oficial de marca blanca',
        desc: 'Sitio web personal limpio con palmarés, ranking actualizado y dossier para patrocinadores.',
        bullets: [
          'Dominio propio del atleta y diseño sobrio de alto nivel',
          'Sección dedicada a partners técnicos y patrocinadores',
          'Dossier de prensa y contacto directo de representación',
        ],
        specLabel: 'Identidad coherente con la imagen del jugador',
      },
      {
        title: 'Clinics y eventos corporativos',
        desc: 'Publica fechas disponibles para clinics en clubes o eventos de empresa con inscripción directa.',
        bullets: [
          'Control de aforo, horarios y requisitos técnicos del evento',
          'Cobro anticipado y gestión de lista de asistentes',
          'Coordinación directa con clubes anfitriones',
        ],
        specLabel: 'Sin intermediarios en la contratación',
      },
      {
        title: 'Calendario competitivo y multimedia',
        desc: 'Comparte próximas citas del circuito, resultados de temporada y galería oficial.',
        bullets: [
          'Sincronización de fechas de circuito internacional',
          'Resúmenes de partido y notas de preparación',
          'Actualización ágil desde el móvil del equipo técnico',
        ],
        specLabel: 'Comunicación ordenada durante toda la gira',
      },
      {
        title: 'Equipación y colecciones oficiales',
        desc: 'Espacio para presentar tu pala oficial, textil técnico o experiencias VIP.',
        bullets: [
          'Enlace limpio a catálogo o reserva de ediciones limitadas',
          'Gestión de tallas y entregas bajo demanda',
          'Seguimiento directo de pedidos o solicitudes',
        ],
        specLabel: 'Canal directo con seguidores y clubes',
      },
    ],
    workflow: [
      {
        number: '01',
        title: 'Definición de identidad del atleta',
        desc: 'Configuramos dominio, paleta y dossier deportivo junto al jugador o su agencia.',
      },
      {
        number: '02',
        title: 'Publicación de calendario y partners',
        desc: 'Actualización de gira competitiva y visibilidad prioritaria para patrocinadores.',
      },
      {
        number: '03',
        title: 'Apertura de clinics y eventos',
        desc: 'Los clubes y empresas solicitan fechas directamente desde el portal oficial.',
      },
      {
        number: '04',
        title: 'Seguimiento continuo de temporada',
        desc: 'Resultados, estadísticas y presencia actualizados durante todo el año.',
      },
    ],
    deployment: [
      { label: 'Dominio', value: 'Atleta propio', detail: 'Web oficial personal bajo tu nombre' },
      { label: 'Idiomas', value: 'Multilingüe', detail: 'Preparado para giras internacionales' },
      { label: 'Gestión', value: 'Autónoma', detail: 'Editado por el atleta o su equipo' },
    ],
    outcomeTitle: 'Valor para el atleta y su equipo',
    outcomes: [
      'Imagen profesional unificada ante marcas y organizadores',
      'Canal directo para monetizar clinics fuera de calendario oficial',
      'Centralización de contactos comerciales y representación',
      'Control total de datos y relación con clubes colaboradores',
    ],
    recommendedPlan: 'Plan Coach / Personal Pro',
  },
];

export const SETMIO_PRO_CORE_SEGMENTS = SETMIO_PRO_SEGMENTS.slice(0, 6);

export interface FeatureModuleDetail {
  id: string;
  category: 'operacion' | 'escuela' | 'ingresos' | 'ia';
  categoryLabel: string;
  order: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  bullets: string[];
  applicableProfiles: string[];
  workflowNotes: string[];
}

export const CORPORATE_MODULES: FeatureModuleDetail[] = [
  {
    id: 'cuadrante-reservas',
    category: 'operacion',
    categoryLabel: 'Operación y Pistas',
    order: '01',
    title: 'Cuadrante Inteligente y Reservas',
    shortDesc: 'Agenda visual multi-sede con tarifas dinámicas, bloqueos rápidos y reglas por perfil de usuario.',
    fullDesc:
      'Motor de reservas diseñado para evitar solapamientos y reducir el trabajo manual en recepción. Permite definir tarifas por horario, duración, tipo de pista y categoría de socio o vecino.',
    bullets: [
      'Tarifas valle/pico, bonos por franja y descuentos de socio o empadronado',
      'Partidos abiertos y gestión rápida de sustituciones antes del encuentro',
      'Vista multi-sede unificada para cadenas y complejos deportivos',
      'Reglas configurables de antelación y cancelación automática',
    ],
    applicableProfiles: ['Clubes de Pádel', 'Administraciones Públicas', 'Academias'],
    workflowNotes: [
      'Reserva web, móvil o en recepción sincronizada al instante',
      'Confirmación automática con código de acceso y recordatorio previo',
    ],
  },
  {
    id: 'escuela-academias',
    category: 'escuela',
    categoryLabel: 'Escuela y Equipos',
    order: '02',
    title: 'Escuelas, Clases y Evaluaciones',
    shortDesc: 'Grupos por nivel y edad, control de asistencia desde pista, recuperaciones y cobro recurrente.',
    fullDesc:
      'Coordina toda la actividad formativa sin hojas de cálculo: asigna pistas y profesores, gestiona recuperaciones ordenadas y automatiza las cuotas mensuales o trimestrales.',
    bullets: [
      'Control de plazas libres y listas de espera por nivel técnico',
      'Pase de lista móvil para monitores en menos de 10 segundos',
      'Gestión automática de ausencias y clases de recuperación',
      'Informes periódicos de evolución para alumnos y familias',
    ],
    applicableProfiles: ['Academias y Escuelas', 'Entrenadores', 'Clubes de Pádel'],
    workflowNotes: [
      'Vinculado directamente al cuadrante para evitar conflictos de pista',
      'Generación mensual de remesas SEPA y recibos sin trabajo manual',
    ],
  },
  {
    id: 'torneos-ligas',
    category: 'escuela',
    categoryLabel: 'Escuela y Equipos',
    order: '03',
    title: 'Torneos, Ligas y Circuitos',
    shortDesc: 'Inscripciones online, cuadros automáticos, consolación, orden de juego y rankings vivos.',
    fullDesc:
      'Automatiza desde un pozo social de fin de semana hasta un circuito federado multi-sede. Publica cuadros, horarios y marcadores en vivo accesibles desde cualquier móvil.',
    bullets: [
      'Cuadros eliminatorios, fases de grupos, americanos y ligas por jornadas',
      'Cierre automático de inscripciones y control de restricciones horarias',
      'Actas digitales en mesa arbitral y actualización inmediata de rankings',
      'Validación de licencias federativas o categorías de juego',
    ],
    applicableProfiles: ['Federaciones', 'Clubes de Pádel', 'Equipos'],
    workflowNotes: [
      'Inscripción y pago por pareja o equipo desde la web del organizador',
      'Notificación automática de pista y hora en cada ronda',
    ],
  },
  {
    id: 'equipos-convocatorias',
    category: 'escuela',
    categoryLabel: 'Escuela y Equipos',
    order: '04',
    title: 'Gestión de Equipos y Alineaciones',
    shortDesc: 'Plantillas, encuestas de disponibilidad, armado de parejas, bote común y estadísticas de equipo.',
    fullDesc:
      'Módulo específico tanto para clubes con varios equipos de liga como para equipos independientes que contratan Setmio para organizar su temporada.',
    bullets: [
      'Disponibilidad de jugadores por jornada y avisos de convocatoria',
      'Constructor de alineaciones con criterio de drive/revés y ranking',
      'Control de cuotas de liga, equipaciones y reparto de gastos',
      'Estadísticas colectivas y rendimiento histórico por pareja',
    ],
    applicableProfiles: ['Equipos', 'Clubes de Pádel', 'Federaciones'],
    workflowNotes: [
      'Operativo independientemente de dónde dispute el equipo sus partidos',
      'Conectado con la vista del jugador en Setmio Player',
    ],
  },
  {
    id: 'pagos-divididos',
    category: 'ingresos',
    categoryLabel: 'Ingresos y TPV',
    order: '05',
    title: 'Pagos Divididos, Monedero y SEPA',
    shortDesc: 'Cobro fraccionado por jugador, monedero de club bonificado y liquidación directa en tu cuenta.',
    fullDesc:
      'Asegura el cobro íntegro de cada pista antes del partido sin intermediarios que retengan tus ingresos. Soporta Bizum, tarjeta, monedero interno y domiciliaciones SEPA.',
    bullets: [
      'Split payment automático para que cada jugador pague su parte',
      'Liquidación directa en el IBAN de la entidad sin comisiones sobre reserva',
      'Bonos prepago y recargas de monedero con saldo incentivado',
      'Remesas bancarias SEPA para cuotas sociales y escuela',
      'Veri*factu para cumplimiento de facturación y registro fiscal (aplica exclusivamente a clientes en España)',
      'Conciliación de cobros por pista y devoluciones automáticas en plazo o por lluvia',
    ],
    applicableProfiles: ['Clubes de Pádel', 'Academias', 'Administraciones Públicas'],
    workflowNotes: [
      'Cero gestión de efectivo pendiente al finalizar el partido',
      'Devoluciones automáticas ante cancelación dentro de plazo o lluvia',
    ],
  },
  {
    id: 'tpv-facturacion',
    category: 'ingresos',
    categoryLabel: 'Ingresos y TPV',
    order: '06',
    title: 'TPV Bar, Tienda y Facturación',
    shortDesc: 'Punto de venta táctil, inventario de tienda pro-shop, test de palas y facturación fiscal certificada.',
    fullDesc:
      'Unifica la caja de recepción, la barra del bar y la tienda de material deportivo en un TPV ágil que permite anotar consumiciones directamente sobre una pista activa.',
    bullets: [
      'Cargo rápido de bebidas, bolas o grips a la cuenta de los jugadores',
      'Control de inventario de tienda y alquiler/prueba de palas',
      'Arqueos diarios de caja por método de pago y turno de personal',
      'Facturación adaptada a normativa vigente en España (Veri*factu / TicketBAI / SII)',
    ],
    applicableProfiles: ['Clubes de Pádel', 'Academias'],
    workflowNotes: [
      'Un único cierre diario unificando reservas, escuela y consumo en bar',
      'Exportación contable limpia para gestoría',
    ],
  },
  {
    id: 'copiloto-ia',
    category: 'ia',
    categoryLabel: 'IA y Marca Blanca',
    order: '07',
    title: 'Asistente IA de Atención y Reservas',
    shortDesc: 'Atención automática 24/7 en web y WhatsApp para consultar disponibilidad y responder dudas.',
    fullDesc:
      'Reduce el volumen de llamadas y mensajes manuales resolviendo consultas sobre horarios, precios, normativa del centro y disponibilidad de pistas en segundos.',
    bullets: [
      'Respuesta instantánea según tarifas, horarios y reglas reales del centro',
      'Canal de atención conectado a WhatsApp oficial y widget web',
      'Derivación ordenada a recepción cuando se requiere gestión humana',
      'Soporte multidioma automático adaptado al perfil del usuario',
    ],
    applicableProfiles: ['Clubes de Pádel', 'Academias', 'Administraciones Públicas'],
    workflowNotes: [
      'Configurado con la información específica de cada sede',
      'Activo 24 horas sin ampliar plantilla de atención telefónica',
    ],
  },
  {
    id: 'marca-blanca',
    category: 'ia',
    categoryLabel: 'IA y Marca Blanca',
    order: '08',
    title: 'Marca Blanca y Dominio Propio',
    shortDesc: 'Web pública, portal de socios y app instalable con tu identidad visual, dominio SSL y cero ruido ajeno.',
    fullDesc:
      'Toda la relación digital sucede bajo el nombre de tu club, federación o ayuntamiento. Tus usuarios nunca ven ofertas de centros competidores ni redirecciones externas.',
    bullets: [
      'Configuración guiada de logotipo, paleta cromática e imágenes propias',
      'Conexión de dominio personalizado con certificado SSL automático',
      'App Web Progresiva (PWA) instalable con tu icono corporativo',
      'Personalización independiente para multi-sedes o marcas afiliadas',
    ],
    applicableProfiles: ['Todos los perfiles Setmio Pro'],
    workflowNotes: [
      'Activación de dominio verificada desde el panel de control',
      'Aislamiento estricto de datos y tráfico para cada organización',
    ],
  },
];
