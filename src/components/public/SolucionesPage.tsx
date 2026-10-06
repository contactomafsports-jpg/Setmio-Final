import React, { useState, useEffect } from 'react';
import {
  Building2,
  GraduationCap,
  Trophy,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Cpu,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Receipt,
  FileCheck,
  Play,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

export interface SolucionesPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
  onOpenRegister?: () => void;
  roleId?: string;
  onOpenRole?: (roleId: string) => void;
}

export type SolutionRoleKey = 'clubes' | 'profesores' | 'profesionales' | 'jugadores';

interface RoleDetailData {
  id: SolutionRoleKey;
  badge: string;
  productLine: 'Setmio Pro' | 'Setmio Player';
  productLineColor: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  heroDescription: string;
  metrics: Array<{ value: string; label: string; sub: string }>;
  pillars: Array<{
    title: string;
    description: string;
    bullets: string[];
    technicalDetail: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  technicalSpecs: Array<{
    category: string;
    description: string;
    badge: string;
  }>;
  workflowSteps: Array<{
    step: string;
    title: string;
    desc: string;
  }>;
  roiTitle: string;
  roiBullets: string[];
  demoCta: string;
}

const ROLES_DATA: Record<SolutionRoleKey, RoleDetailData> = {
  clubes: {
    id: 'clubes',
    badge: 'Clubes & Complejos Deportivos',
    productLine: 'Setmio Pro',
    productLineColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    icon: Building2,
    title: 'Setmio Pro para Clubes de Pádel y Centros Deportivos',
    subtitle: 'El sistema operativo integral para automatizar cuadrantes, luces LED, cobros e ingresos sin intermediarios.',
    heroDescription:
      'Diseñado específicamente para gerentes, directores deportivos y propietarios de clubes de 2 a 30+ pistas. Elimina el desajuste de llamadas telefónicas, suprime la morosidad mediante split payments directos en tu banco y opera pistas 100% desatendidas con domótica IoT certificada.',
    metrics: [
      { value: '+28%', label: 'Incremento de Ocupación', sub: 'Optimización de horas valle y partidos abiertos' },
      { value: '0 €', label: 'Morosidad en Pistas', sub: 'Cobro garantizado por split payment y tarjeta' },
      { value: '-18h', label: 'Ahorro Administrativo', sub: 'Horas semanales recuperadas en recepción y arqueos' },
      { value: '100%', label: 'Control Domótico IoT', sub: 'Encendido automático de luces LED y apertura de tornos' },
    ],
    pillars: [
      {
        icon: Calendar,
        title: 'Cuadrante Reactivo Multisede & Reservas 24/7',
        description:
          'Motor de reservas en tiempo real con prevención de colisiones por microsegundo, sincronización inmediata con recepción y visualización de pistas cubiertas, panorámicas o individuales.',
        bullets: [
          'Gestión de tarifas dinámicas por franja horaria, día de semana y categoría de socio.',
          'Bloqueo preventivo instantáneo por mantenimiento, lluvia o celebración de torneos oficiales.',
          'Soporte multi-sede con gestión centralizada desde un único panel administrativo.',
        ],
        technicalDetail: 'Arquitectura basada en Server-Sent Events (SSE) y WebSockets con renderizado reactivo a <50ms.',
      },
      {
        icon: Zap,
        title: 'Domótica Industrial IoT: Focos LED y Tornos',
        description:
          'Operación 100% desatendida. Tu móvil o el de tu socio activa la apertura de cerraduras electrónicas y el encendido sincronizado de focos LED durante el horario exacto del partido.',
        bullets: [
          'Encendido gradual de iluminación LED 5 minutos antes del inicio del turno.',
          'Apagado programado con 10 minutos de cortesía para desalojo seguro de pista.',
          'Teclado con código PIN dinámico único por reserva y lectura de QR sin personal presencial.',
        ],
        technicalDetail: 'Compatibilidad nativa con relés industriales IP (Shelly, Sonoff, Modbus TCP) con failover local offline.',
      },
      {
        icon: CreditCard,
        title: 'Split Payment Directo & Pasarela Bancaria Propia',
        description:
          'El club cobra directamente en su propia cuenta bancaria conectada (Stripe, Redsys o Bizum). Cada uno de los 4 jugadores paga su 25% sin comisiones retenidas por terceros.',
        bullets: [
          'Liquidaciones automáticas directas a tu IBAN bancario sin retenciones de capital.',
          'Cobro de suplementos de luz, alquiler de palas y botes de bolas en la misma transacción.',
          'Monedero digital de club con bonificaciones personalizadas para captar liquidez anticipada.',
        ],
        technicalDetail: 'Integración PCI-DSS Level 1 con tokenización segura y soporte nativo de Bizum PRO y Redsys SHA-256.',
      },
      {
        icon: Receipt,
        title: 'TPV Táctil de Bar, Pro Shop y Facturación Oficial',
        description:
          'Terminal punto de venta táctil pensado para la barra del bar y la tienda de pádel, integrado de forma fluida con el cuadrante y las cuentas corrientes de los socios.',
        bullets: [
          'Venta cruzada directa: anota bebidas o grip a la cuenta de la pista con un solo toque.',
          'Control de inventario de palas, zapatillas y consumibles con aviso de rotura de stock.',
          'Facturación electrónica certificada adaptada a la legislación vigente (TicketBAI / SII / VeriFactu).',
        ],
        technicalDetail: 'Exportación contable estandarizada a A3, Contasol, Sage y formatos oficiales en un clic.',
      },
    ],
    technicalSpecs: [
      { category: 'Sincronización Cuadrante', description: 'Motor reactivo multi-usuario con latencia ultrabaja (<50ms)', badge: 'WebSocket / SSE' },
      { category: 'Protocolo Domótico IoT', description: 'Control de relés IP industriales con fallback offline local', badge: 'MQTT / HTTP REST' },
      { category: 'Pasarelas de Pago', description: 'Liquidación directa al IBAN del club sin intermediación', badge: 'Redsys / Stripe / Bizum' },
      { category: 'Seguridad y Privacidad', description: 'Cifrado de grado bancario y estricto cumplimiento RGPD europeo', badge: 'ISO 27001 / RGPD' },
    ],
    workflowSteps: [
      { step: '01', title: 'Reserva Digital Instantánea', desc: 'El jugador o socio reserva pista desde su móvil en 15 segundos con split payment activado.' },
      { step: '02', title: 'Generación de Acceso IoT', desc: 'El sistema emite un código PIN dinámico y QR válido estrictamente para la franja reservada.' },
      { step: '03', title: 'Apertura y Alumbrado Autónomo', desc: 'Tornos se abren y la iluminación de pista se enciende de forma totalmente automatizada.' },
      { step: '04', title: 'Liquidación y Cierre Contable', desc: 'Ingresos consolidados en tiempo real en la cuenta del club con facturación generada.' },
    ],
    roiTitle: 'Impacto Comercial y Rentabilidad Demostrable para Clubes',
    roiBullets: [
      'Recuperación de hasta 32 horas mensuales de personal de mostrador dedicadas a cobros y llamadas.',
      'Aumento directo del 24% al 35% de ingresos por alquiler de pistas en franjas nocturnas o mañanas desatendidas.',
      'Eliminación del 100% de deudas pendientes entre jugadores mediante cobro previo obligatorio de cada cuota.',
      'Mayor fidelización de socios gracias a una experiencia digital moderna con web y app de marca propia.',
    ],
    demoCta: 'Solicitar Demo para Gerentes de Club',
  },

  profesores: {
    id: 'profesores',
    badge: 'Profesores, Monitores & Academias',
    productLine: 'Setmio Pro',
    productLineColor: 'bg-teal-500/10 text-teal-600 dark:text-cyan-400 border-teal-500/30',
    icon: GraduationCap,
    title: 'Setmio Pro para Profesores y Academias de Pádel',
    subtitle: 'Planificación docente, fichas metodológicas de nivel técnico y cobro automatizado de cuotas escolares.',
    heroDescription:
      'La herramienta definitiva para coordinadores de escuela de club y entrenadores profesionales autónomos. Organiza grupos de nivel homogéneo, pasa lista en pista desde tu smartphone con un clic, gestiona listas de espera y domicilia cuotas mensuales SEPA sin errores bancarios.',
    metrics: [
      { value: '99%', label: 'Cobro Puntual de Cuotas', sub: 'Automatización de remesas SEPA y cobros por tarjeta' },
      { value: '+35%', label: 'Retención de Alumnos', sub: 'Seguimiento visible de progreso y feedback técnico' },
      { value: '0 errores', label: 'Conflictos en Pistas', sub: 'Reserva automática vinculada a cuadrante docente' },
      { value: '1 clic', label: 'Control de Asistencia', sub: 'Pase de lista digital en pista desde cualquier móvil' },
    ],
    pillars: [
      {
        icon: Calendar,
        title: 'Planificación Docente & Calendario de Grupos',
        description:
          'Configura temporadas completas, cursos trimestrales y clases particulares individuales o por parejas con asignación visual de pistas y profesores.',
        bullets: [
          'Gestión de grupos homogéneos por edad (menores/adultos) y nivel decimal (ej. 2.5 a 3.0).',
          'Sustituciones automáticas por lluvia o ausencias con lista de espera en tiempo real.',
          'Portal del profesor para consultar horarios semanales y alumnos asignados.',
        ],
        technicalDetail: 'Algoritmo de detección de solapamientos entre pistas docentes y reservas de alquiler libre.',
      },
      {
        icon: CreditCard,
        title: 'Cobro Recurrente de Cuotas & Remesas SEPA',
        description:
          'Olvídate de perseguir a los alumnos para el cobro de la mensualidad. Genera archivos bancarios oficiales o cargos en tarjeta con reintentos automáticos.',
        bullets: [
          'Generación de remesas bancarias SEPA XML (Norma 19 / ISO 20022) en un clic.',
          'Cobro recurrente por tarjeta de crédito con gestión inteligente de tarjetas vencidas.',
          'Desglose automático de liquidaciones de honorarios para cada profesor colaborador.',
        ],
        technicalDetail: 'Validación algorítmica de cuentas bancarias IBAN/BIC conforme a estándares bancarios europeos.',
      },
      {
        icon: TrendingUp,
        title: 'Ficha Técnica Deportiva & Nivelación Decimal',
        description:
          'Evalúa y documenta la evolución técnica y táctica de cada alumno con métricas objetivas reconocidas por federaciones y escuelas de alto rendimiento.',
        bullets: [
          'Evaluación pormenorizada por golpes: bandeja, víbora, remate x3, bajada de pared y volea.',
          'Historial de evolución con notas del entrenador y objetivos personalizados.',
          'Certificado de nivel decimal deportivo para garantizar partidos nivelados.',
        ],
        technicalDetail: 'Matriz técnica adaptable a los estándares metodológicos de la FEP y Premier Padel.',
      },
      {
        icon: Smartphone,
        title: 'Portal de Alumnos y Comunicación con Familias',
        description:
          'Canal de comunicación profesional que centraliza avisos de escuela, recibos descargables y cambios de horario sin saturar grupos de mensajería.',
        bullets: [
          'Avisos urgentes por SMS y notificaciones sobre suspensiones por climatología adversa.',
          'Área privada para padres con seguimiento del alumno menor y descarga de facturas.',
          'Solicitud de recuperaciones de clase sujetas a política configurable por la escuela.',
        ],
        technicalDetail: 'Notificaciones push en web móvil y correo transaccional autenticado SPF/DKIM.',
      },
    ],
    technicalSpecs: [
      { category: 'Gestión Bancaria SEPA', description: 'Generación de cuadernos bancarios estándar ISO 20022', badge: 'Norma 19 SEPA XML' },
      { category: 'Nivelación Deportiva', description: 'Algoritmo ponderado de nivel decimal (1.00 - 7.00)', badge: 'Algoritmo Dinámico' },
      { category: 'Acceso en Pista', description: 'Interfaz táctil optimizada para uso en smartphone al aire libre', badge: 'Mobile-First' },
      { category: 'Liquidación Docente', description: 'Cálculo automático de honorarios por hora y retenciones', badge: 'Módulo Fiscal Pro' },
    ],
    workflowSteps: [
      { step: '01', title: 'Configuración de Cursos', desc: 'Define niveles, ratios de alumnos por monitor y precios de matrícula.' },
      { step: '02', title: 'Asignación de Pistas y Monitores', desc: 'El sistema bloquea pistas docentes y confirma plazas a alumnos inscritos.' },
      { step: '03', title: 'Impartición y Control en Pista', desc: 'Pasa lista desde el móvil en pista y evalúa el progreso técnico del alumno.' },
      { step: '04', title: 'Cobro Automatizado a Fin de Mes', desc: 'Las cuotas se cobran solas y los alumnos reciben sus facturas digitales.' },
    ],
    roiTitle: 'Rentabilidad Operativa para Directores de Academia y Monitores',
    roiBullets: [
      'Reducción drástica del 90% en tiempo dedicado a contabilidad y reclamación de impagados.',
      'Control de aforos que evita pérdidas económicas por clases sobredimensionadas o infrautilizadas.',
      'Mayor prestigio profesional y captación de nuevos alumnos con portal web de marca propia.',
      'Trazabilidad absoluta del rendimiento laboral y de ingresos por cada monitor de la plantilla.',
    ],
    demoCta: 'Solicitar Demo para Profesores y Academias',
  },

  profesionales: {
    id: 'profesionales',
    badge: 'Atletas Profesionales & Jugadores WPT',
    productLine: 'Setmio Pro',
    productLineColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: Trophy,
    title: 'Setmio Pro para Jugadores Profesionales de Pádel',
    subtitle: 'Gestión de carrera de élite, catálogo de sponsors, agenda FIP/Premier Padel y portal oficial de atleta.',
    heroDescription:
      'Diseñado para jugadores del circuito internacional profesional (Premier Padel, FIP Tour, A1Padel). Centraliza tus compromisos contractuales de patrocinio, vende plazas para tus clinics de fin de semana con pasarela propia y ofrece a tus seguidores un portal oficial de máxima categoría.',
    metrics: [
      { value: '100%', label: 'Control de Marca Personal', sub: 'Presencia web de élite con dominio propio sin intermediarios' },
      { value: '+45%', label: 'Ingresos por Clinics & VIP', sub: 'Gestión y cobro directo de eventos privados y exhibiciones' },
      { value: '0 %', label: 'Comisiones de Venta', sub: 'Tienda de material y ropa firmada directa para el atleta' },
      { value: '24/7', label: 'Visibilidad de Patrocinadores', sub: 'Espacio de alta fidelidad para marcas y contratos de sponsor' },
    ],
    pillars: [
      {
        icon: Smartphone,
        title: 'Portal Oficial Web con Dominio Propio',
        description:
          'Una web oficial de máxima resolución con tu identidad corporativa, biografía oficial, palmarés deportivo, ranking FIP actualizado y agenda de torneos.',
        bullets: [
          'Diseño visual exclusivo adaptado a tus colores e isotipo personal.',
          'Prensa, dossier de patrocinio descargable y formulario directo para contrataciones.',
          'Galería multimedia de torneos y sesiones fotográficas oficiales.',
        ],
        technicalDetail: 'Hosting CDN mundial con rendimiento de carga ultra-rápido (<0.8s) y certificado SSL gratuito.',
      },
      {
        icon: ShieldCheck,
        title: 'Gestión y Escaparate de Patrocinadores',
        description:
          'Ofrece a tus marcas de pala, textil, calzado y sponsors corporativos un espacio digital prémium que justifica su inversión publicitaria.',
        bullets: [
          'Espacio destacado de sponsors con enlaces de afiliados y códigos de descuento.',
          'Métricas de visitas e impacto digital para presentar en renovaciones de contrato.',
          'Protección estricta de exclusividades por categoría comercial.',
        ],
        technicalDetail: 'Seguimiento de conversiones y clics mediante analytics respetuosos con la privacidad.',
      },
      {
        icon: Calendar,
        title: 'Booking de Clinics, Exhibiciones & Eventos VIP',
        description:
          'Permite que clubes de cualquier parte del mundo soliciten y contraten fechas para exhibiciones, partidos pro-am y clinics formativos de fin de semana.',
        bullets: [
          'Calendario público de disponibilidad coordinado con tu agenda de torneos FIP.',
          'Reserva de fecha con pago de señal bancaria previo para garantizar el compromiso.',
          'Contrato de prestación de servicios con cláusulas de desplazamiento y alojamiento.',
        ],
        technicalDetail: 'Pasarela internacional multidivisa compatible con tarjetas de todo el mundo y transferencias.',
      },
      {
        icon: Trophy,
        title: 'Tienda Oficial de Merchandising Exclusivo',
        description:
          'Vende directamente a tus fans camisetas firmadas, palas de edición especial y merchandising oficial sin pagar comisiones a plataformas externas.',
        bullets: [
          'Catálogo de productos exclusivos para coleccionistas y seguidores fieles.',
          'Cobro seguro con Stripe Checkout y notificación de pedido a tu equipo logístico.',
          'Venta de entradas VIP para palcos de torneos y sesiones Meet & Greet.',
        ],
        technicalDetail: 'Integración e-commerce ligera con pasarela de pagos directos a la cuenta bancaria del jugador.',
      },
    ],
    technicalSpecs: [
      { category: 'Sincronización de Torneos', description: 'Feed oficial de calendario Premier Padel y FIP Tour', badge: 'API Calendarios FIP' },
      { category: 'Pagos Internacionales', description: 'Cobro en múltiples divisas con liquidación bancaria directa', badge: 'Stripe Connect Global' },
      { category: 'Rendimiento y CDN', description: 'Entrega de imágenes y contenido multimedia de alta fidelidad', badge: 'Edge CDN Global' },
      { category: 'Seguridad de Datos', description: 'Protección estricta de agenda privada y contratos comerciales', badge: 'Cifrado AES-256' },
    ],
    workflowSteps: [
      { step: '01', title: 'Lanzamiento de Portal Oficial', desc: 'Configura tu web de atleta con sponsors, biografía y palmarés.' },
      { step: '02', title: 'Publicación de Agenda y Clinics', desc: 'Indica torneos confirmados y fechas disponibles para eventos VIP.' },
      { step: '03', title: 'Contratación Directa de Clubes', desc: 'Clubes y empresas contratan clinics abonando la señal de reserva.' },
      { step: '04', title: 'Monetización sin Intermediarios', desc: 'Recibe los ingresos directos por sponsors, clinics y merchandising.' },
    ],
    roiTitle: 'Maximización del Valor de Marca para Jugadores de Élite',
    roiBullets: [
      'Independencia comercial absoluta frente a intermediarios para la gestión de exhibiciones.',
      'Herramienta tangible para negociar aumentos en contratos de patrocinio mostrando métricas.',
      'Canal directo de ingresos recurrentes a través de merchandising oficial y masterclasses.',
      'Posicionamiento de imagen profesional y de prestigio en el ecosistema mundial del pádel.',
    ],
    demoCta: 'Solicitar Demo para Jugadores Profesionales',
  },

  jugadores: {
    id: 'jugadores',
    badge: 'Jugadores Particulares & Amateurs',
    productLine: 'Setmio Player',
    productLineColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    icon: Users,
    title: 'Setmio Player para Jugadores Particulares y Amateurs',
    subtitle: 'La app móvil diseñada para reservar en 15 segundos, encontrar compañeros de tu nivel y jugar sin fricción.',
    heroDescription:
      'El producto creado exclusivamente para los jugadores apasionados del pádel. Olvídate de llamar por teléfono para reservar pista, reclamar Bizums a tus amigos o jugar partidos descompensados. Con Setmio Player, tu móvil es tu cuadrante, tu monedero y la llave que enciende las luces de tu pista.',
    metrics: [
      { value: '< 15s', label: 'Tiempo de Reserva', sub: 'Cuadrante en tiempo real con selección visual de pista y horario' },
      { value: '1.0 - 7.0', label: 'Nivel Decimal Dinámico', sub: 'Equilibrio matemático de parejas en partidos abiertos' },
      { value: '1/4 Split', label: 'Pago Dividido por Jugador', sub: 'Cada compañero paga únicamente su parte de la pista' },
      { value: '0 esperas', label: 'Apertura Domótica por PIN', sub: 'Entrada y focos automatizados sin pasar por mostrador' },
    ],
    pillars: [
      {
        icon: Calendar,
        title: 'Reserva Rápida en Tus Clubes Favoritos',
        description:
          'Consulta la disponibilidad en vivo de pistas cubiertas, exteriores o panorámicas con precios claros y confirmación instantánea sin intermediarios.',
        bullets: [
          'Cuadrante interactivo en tiempo real con filtro por horario, club y tipo de pista.',
          'Reserva recurrente fija para tu partida semanal con tus amigos habituales.',
          'Cancelación flexible según la política configurada por tu club de referencia.',
        ],
        technicalDetail: 'Consultas en tiempo real mediante caché ultra-rápida y actualización de slots en milisegundos.',
      },
      {
        icon: Users,
        title: 'Partidos Abiertos con Nivel Dinámico (Play!)',
        description:
          '¿Te falta un cuarto jugador? Únete a partidos abiertos filtrados por tu nivel decimal exacto (ej. 3.75) y tu posición preferida en la pista.',
        bullets: [
          'Filtro por posición: drive, revés o indistinto para partidos siempre nivelados.',
          'Chat integrado del partido para coordinar detalles con los compañeros.',
          'Actualización de tu nivel deportivo al introducir el resultado del partido.',
        ],
        technicalDetail: 'Algoritmo ELO adaptado a pádel por parejas que recalcula el rating tras cada enfrentamiento.',
      },
      {
        icon: CreditCard,
        title: 'Pago Dividido Automático (Split Payment)',
        description:
          'Nunca más tendrás que adelantar el importe total de la pista ni perseguir a tus amigos para que te hagan un Bizum.',
        bullets: [
          'Cada jugador paga su 25% de la pista desde su propio smartphone.',
          'Monedero digital de club recargable con bonos automáticos que regalan saldo.',
          'Múltiples métodos de pago: Bizum, tarjeta de crédito bancaria o monedero.',
        ],
        technicalDetail: 'Cálculo dinámico de importes fraccionados con tolerancia a pagos mixtos por saldo y tarjeta.',
      },
      {
        icon: Zap,
        title: 'Tu Teléfono es la Llave del Club (Domótica IoT)',
        description:
          'Disfruta de la máxima autonomía. Al confirmar tu reserva, tu aplicación genera el código PIN y código QR para acceder al club y activar los focos.',
        bullets: [
          'Apertura de la puerta exterior, tornos y cancela de pista con tu código único.',
          'Los focos LED de tu pista se encienden solos a la hora exacta de tu partido.',
          'Acceso 24/7 sin necesidad de que haya personal presente en la instalación.',
        ],
        technicalDetail: 'Códigos PIN temporales de 4 dígitos sincronizados con los controladores IP de la pista.',
      },
    ],
    technicalSpecs: [
      { category: 'Matchmaking Deportivo', description: 'Emparejamiento por posición y nivel decimal (1.00 - 7.00)', badge: 'Algoritmo Play!' },
      { category: 'Monedero Digital', description: 'Saldo prepago con bonificaciones del club y recarga instantánea', badge: 'Wallet Integrado' },
      { category: 'Acceso Domótico', description: 'Generación de códigos PIN y QR vinculados a la reserva', badge: 'IoT Smart Access' },
      { category: 'Estadísticas Pro', description: 'Historial de partidos, porcentaje de victorias y rivales habituales', badge: 'Ficha de Atleta' },
    ],
    workflowSteps: [
      { step: '01', title: 'Selección de Pista en 15s', desc: 'Elige club, día y hora en el cuadrante interactivo desde tu smartphone.' },
      { step: '02', title: 'Invita a Amigos o Abre Plazas', desc: 'Añade a tus compañeros habituales o permite que se unan jugadores de tu nivel.' },
      { step: '03', title: 'Cada Jugador Paga su Parte', desc: 'El sistema cobra a cada participante su fracción de pista por monedero o tarjeta.' },
      { step: '04', title: 'Abre y Juega con tu PIN', desc: 'Introduce tu código en la puerta de la pista, la luz se enciende sola y ¡a jugar!' },
    ],
    roiTitle: 'Beneficios Reales para Jugadores Particulares y Amateurs',
    roiBullets: [
      'Ahorro total de tiempo en la organización de partidos semanales.',
      'Cero discusiones económicas: cada jugador responde de su pago de forma individual.',
      'Garantía de partidos competitivos gracias a la nivelación decimal sin sorpresas.',
      'Autonomía total para jugar a cualquier hora, incluso en clubes sin personal en mostrador.',
    ],
    demoCta: 'Probar Experiencia Setmio Player',
  },
};

export function SolucionesPage({
  onBack,
  onOpenDemo,
  onOpenRegister,
  roleId,
  onOpenRole,
}: SolucionesPageProps) {
  const { setPublicPage, triggerDemoToast } = useApp();

  const getInitialRole = (): SolutionRoleKey => {
    if (roleId === 'escuelas' || roleId === 'schools') return 'profesores';
    if (roleId && roleId in ROLES_DATA) return roleId as SolutionRoleKey;
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('clubes')) return 'clubes';
      if (path.includes('profesores') || path.includes('escuelas')) return 'profesores';
      if (path.includes('jugadores-profesionales') || path.includes('profesionales')) return 'profesionales';
      if (path.includes('jugadores') || path.includes('para-jugadores')) return 'jugadores';
    }
    return 'clubes';
  };

  const [activeRoleKey, setActiveRoleKey] = useState<SolutionRoleKey>(getInitialRole);

  useEffect(() => {
    if (roleId && roleId in ROLES_DATA) {
      setActiveRoleKey(roleId as SolutionRoleKey);
    }
  }, [roleId]);

  const activeRole = ROLES_DATA[activeRoleKey] || ROLES_DATA.clubes;

  const handleRoleChange = (key: SolutionRoleKey) => {
    setActiveRoleKey(key);
    if (onOpenRole) {
      onOpenRole(key);
    }
    if (typeof window !== 'undefined') {
      const pathMap: Record<SolutionRoleKey, string> = {
        clubes: '/soluciones/clubes',
        profesores: '/soluciones/profesores',
        profesionales: '/soluciones/jugadores-profesionales',
        jugadores: '/para-jugadores',
      };
      window.history.pushState({}, '', pathMap[key]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoClick = () => {
    if (onOpenDemo) {
      onOpenDemo();
    } else {
      triggerDemoToast('Demo Guiada', `Iniciando demostración interactiva para ${activeRole.badge}`, 'info');
    }
  };

  const handleRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Navigation Button alineado a la izquierda */}
        <div className="flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} />
        </div>

        {/* Header Superior y Selector de Roles Tabs */}
        <div className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" />
              <span>Soluciones Especializadas por Perfil</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Una plataforma diseñada para cada protagonista del pádel
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Explora en profundidad la arquitectura técnica, los flujos operativos reales y los beneficios comerciales adaptados específicamente a tu función.
            </p>
          </div>

          {/* Navegación por Pestañas de Roles */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 p-1.5 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800">
            {(Object.keys(ROLES_DATA) as SolutionRoleKey[]).map((key) => {
              const role = ROLES_DATA[key];
              const Icon = role.icon;
              const isActive = activeRoleKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleRoleChange(key)}
                  className={`flex-1 min-w-[150px] sm:min-w-0 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-slate-200/80 dark:border-slate-700 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                  <span className="truncate">{role.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HERO ESPECÍFICO DEL ROL SELECCIONADO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 sm:p-12 lg:p-14 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="space-y-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider backdrop-blur-md bg-white/5 border-white/15">
                <activeRole.icon className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-bold">{activeRole.productLine}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-200">{activeRole.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {activeRole.title}
              </h2>

              <p className="text-base sm:text-lg text-emerald-200 font-semibold leading-relaxed">
                {activeRole.subtitle}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {activeRole.heroDescription}
              </p>
            </div>

            {/* Métricas de Impacto Operativo del Rol */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-slate-800/80">
              {activeRole.metrics.map((m, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {m.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {m.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight">
                    {m.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs del Rol */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleDemoClick}
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{activeRole.demoCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleRegisterClick}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
              >
                <span>Registrarse Ahora</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4 PILARES OPERATIVOS Y TÉCNICOS DETALLADOS */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Pilares Funcionales y Operativos
            </h3>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Capacidades avanzadas diseñadas para tu día a día
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {activeRole.pillars.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-7 sm:p-8 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-5 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <PillarIcon className="w-6 h-6" />
                    </div>

                    <h5 className="text-xl font-black text-slate-900 dark:text-white">
                      {pillar.title}
                    </h5>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                      {pillar.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">{pillar.technicalDetail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ESPECIFICACIONES TÉCNICAS Y ARQUITECTURA */}
        <section className="rounded-3xl p-8 sm:p-10 bg-slate-900 text-white border border-slate-800 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Arquitectura e Integraciones
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-white">
              Especificaciones Técnicas Certificadas
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Infraestructura construida bajo estándares de alta disponibilidad, seguridad bancaria y compatibilidad de hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeRole.technicalSpecs.map((spec, sIdx) => (
              <div key={sIdx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2.5">
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase font-mono">
                  {spec.badge}
                </span>
                <div className="font-bold text-sm text-white">{spec.category}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{spec.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FLUJO OPERATIVO EN EL DÍA A DÍA */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Flujo de Trabajo Operativo
            </h3>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Cómo funciona en tu día a día en 4 sencillos pasos
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeRole.workflowSteps.map((wf, wIdx) => (
              <div
                key={wIdx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="text-3xl font-black font-mono text-emerald-500/40">
                  {wf.step}
                </div>
                <h5 className="font-bold text-base text-slate-900 dark:text-white">
                  {wf.title}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {wf.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RETORNO DE INVERSIÓN Y BENEFICIOS COMERCIALES */}
        <section className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-emerald-900/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 text-white space-y-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <BarChart3 className="w-4 h-4" />
              <span>Retorno de Inversión Comprobado</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-white">
              {activeRole.roiTitle}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRole.roiBullets.map((roi, rIdx) => (
              <div key={rIdx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">{roi}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL DE LA PÁGINA */}
        <section className="text-center py-12 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="max-w-2xl mx-auto space-y-3 px-4">
            <h4 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              ¿Listo para comprobarlo en directo?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Prueba la demo interactiva guiada con datos simulados del perfil de {activeRole.badge} o agenda una llamada con nuestros ingenieros.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleDemoClick}
              className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{activeRole.demoCta}</span>
            </button>

            <button
              type="button"
              onClick={handleRegisterClick}
              className="px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
            >
              <span>Registrarse Sin Permanencia</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
