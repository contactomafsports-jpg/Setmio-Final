import React, { useState, useEffect } from 'react';
import {
  Building2,
  GraduationCap,
  Trophy,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
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
  Check,
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

export type ProfessionalRoleKey = 'clubes' | 'profesores' | 'profesionales';

interface RoleDetailData {
  id: ProfessionalRoleKey;
  badge: string;
  productLine: string;
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

const PROFESSIONAL_ROLES_DATA: Record<ProfessionalRoleKey, RoleDetailData> = {
  clubes: {
    id: 'clubes',
    badge: 'Clubes & Complejos Deportivos',
    productLine: 'Setmio Pro',
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
        technicalDetail: 'Arquitectura reactiva basada en Server-Sent Events (SSE) y WebSockets con renderizado a <50ms.',
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
    badge: 'Escuelas & Academias de Pádel',
    productLine: 'Setmio Pro',
    icon: GraduationCap,
    title: 'Setmio Pro para Profesores, Entrenadores y Escuelas',
    subtitle: 'Gestión académica, cobros recurrentes de cuotas mensuales y control técnico del progreso deportivo.',
    heroDescription:
      'Creado para coordinadores de escuela, academias de menores y profesores particulares de pádel. Automatiza la domiciliación de mensualidades, gestiona sustituciones docentes y evalúa el nivel de juego con evaluaciones técnicas que fidelizan a tus alumnos.',
    metrics: [
      { value: '100%', label: 'Cobro Puntual de Cuotas', sub: 'Remesas automáticas por tarjeta o recibo bancario' },
      { value: '-90%', label: 'Tiempo en Organización', sub: 'Grupos nivelados y calendarios trimestrales automáticos' },
      { value: '+45%', label: 'Retención de Alumnos', sub: 'Fichas técnicas con objetivos pedagógicos visibles' },
      { value: '0 €', label: 'Comisiones de Gestión', sub: 'Todo el ingreso va directo a la cuenta de la escuela' },
    ],
    pillars: [
      {
        icon: Calendar,
        title: 'Gestión de Grupos, Niveles y Horarios Docentes',
        description:
          'Planifica cursos trimestrales, mensuales o clinics intensivos. Asigna pistas, fija ratios de 3 o 4 alumnos por monitor y gestiona recuperaciones por lluvia en un clic.',
        bullets: [
          'Filtro de grupos por edades (menores, iniciación, perfeccionamiento y competición).',
          'Control de asistencia en pista desde la app del profesor con pase de lista táctil.',
          'Lista de espera automática que cubre vacantes libres en cuanto un alumno se da de baja.',
        ],
        technicalDetail: 'Motor de emparejamiento por nivel decimal que garantiza homogeneidad técnica en cada grupo.',
      },
      {
        icon: CreditCard,
        title: 'Cobro Recurrente de Mensualidades sin Esfuerzo',
        description:
          'Despídete de perseguir a los alumnos en la pista. El sistema domicilia la cuota el día 1 de cada mes por tarjeta o remesa bancaria SEPA.',
        bullets: [
          'Facturación automática con envío de recibo digital por email al tutor o alumno.',
          'Cobro prorrateado para incorporaciones a mitad de mes.',
          'Descuentos automáticos para hermanos o socios del club.',
        ],
        technicalDetail: 'Emisión automática de ficheros SEPA XML (norma 19) e integración con pasarela de suscripciones recurrentes.',
      },
      {
        icon: BarChart3,
        title: 'Ficha Técnica Deportiva y Evaluación Continua',
        description:
          'Aporta valor real a tus clases. Registra el progreso técnico (bandeja, víbora, salida de pared, táctica) y compártelo con el alumno desde su perfil privado.',
        bullets: [
          'Notas metodológicas y asignación de tareas técnicas para el próximo entrenamiento.',
          'Historial de partidos de entrenamiento y evolución de nivel decimal.',
          'Informe de rendimiento semestral descargable en PDF para padres de menores.',
        ],
        technicalDetail: 'Gráficos de radar de habilidades y seguimiento de objetivos con cálculo estadístico de progresión.',
      },
      {
        icon: Smartphone,
        title: 'Portal Web Propio para Entrenadores Independientes',
        description:
          'Si eres entrenador particular sin club fijo, Setmio te ofrece tu propio portal web de marca blanca para que tus clientes reserven tus clases particulares.',
        bullets: [
          'Agenda pública con tus horas disponibles para clases particulares.',
          'Cobro anticipado obligatorio de la clase particular para evitar cancelaciones de última hora.',
          'Sincronización bidireccional con tu calendario personal de Google Calendar o Apple Calendar.',
        ],
        technicalDetail: 'Integración iCal con feeds en tiempo real para evitar solapamientos con tu agenda privada.',
      },
    ],
    technicalSpecs: [
      { category: 'Motor de Facturación', description: 'Cobro recurrente mensual/trimestral con reintentos inteligentes', badge: 'SEPA / Stripe Billing' },
      { category: 'Sincronización Docente', description: 'Agenda sincronizada con calendarios externos mediante protocolo iCal', badge: 'iCal / Google Sync' },
      { category: 'App del Profesor', description: 'Control de asistencia táctil y fichas técnicas accesible desde smartphone', badge: 'Mobile Web App' },
      { category: 'Gestión de Menores', description: 'Vinculación de tutores legales con consentimiento RGPD de menores', badge: 'Cumplimiento Legal' },
    ],
    workflowSteps: [
      { step: '01', title: 'Inscripción y Nivelación', desc: 'El alumno o tutor se inscribe online y el sistema lo ubica en el grupo pedagógico adecuado.' },
      { step: '02', title: 'Automatización de Cobro', desc: 'La cuota mensual se cobra automáticamente sin necesidad de transferencias manuales.' },
      { step: '03', title: 'Entrenamiento y Asistencia', desc: 'El profesor pasa lista en pista y registra observaciones técnicas en 30 segundos.' },
      { step: '04', title: 'Informe de Evolución', desc: 'El alumno consulta su informe de progreso deportivo en su perfil móvil privado.' },
    ],
    roiTitle: 'Ventajas Competitivas para Escuelas y Profesores',
    roiBullets: [
      'Eliminación total de bajas por impago y cobro garantizado el primer día de cada mes.',
      'Ahorro de más de 12 horas mensuales en confección de horarios y cuadre de grupos.',
      'Profesionalización de la imagen docente frente a alumnos y padres de familia.',
      'Incremento de ingresos por captación de nuevos alumnos mediante lista de espera automatizada.',
    ],
    demoCta: 'Solicitar Demo para Escuelas y Entrenadores',
  },

  profesionales: {
    id: 'profesionales',
    badge: 'Jugadores Profesionales & WPT / Premier',
    productLine: 'Setmio Pro',
    icon: Trophy,
    title: 'Setmio Pro para Jugadores Profesionales de Pádel',
    subtitle: 'Tu plataforma digital oficial de marca propia para gestionar patrocinios, calendarios FIP y clinics.',
    heroDescription:
      'Orientado a atletas profesionales de circuitos Premier Padel, A1 Padel y FIP. Centraliza tu presencia digital de élite, ofrece a tus sponsors una vitrina tecnológica con métricas de visibilidad y comercializa clinics y exhibiciones directamente sin agencias intermediarias.',
    metrics: [
      { value: '100%', label: 'Marca Personal Exclusiva', sub: 'Dominio propio y estética oficial de atleta de élite' },
      { value: '0%', label: 'Comisiones a Intermediarios', sub: 'Venta directa de clinics y productos oficiales' },
      { value: '+60%', label: 'Retorno a Patrocinadores', sub: 'Espacios dinámicos y métricas de impacto comercial' },
      { value: '24/7', label: 'Agenda y Torneos en Vivo', sub: 'Resultados y retransmisiones accesibles para tu afición' },
    ],
    pillars: [
      {
        icon: Trophy,
        title: 'Presencia Digital Oficial de Marca Blanca',
        description:
          'Una web oficial de alto impacto estético con tu propio nombre de dominio, biografías deportivas, palmarés oficial y galería multimedia de torneos.',
        bullets: [
          'Diseño responsive premium adaptado a los estándares de las grandes marcas internacionales.',
          'Sección interactiva con tu pala oficial, zapatillas, patrocinadores de indumentaria y partners.',
          'Canal de comunicación directo con tu club de fans y aficionados de todo el mundo.',
        ],
        technicalDetail: 'Despliegue sobre CDN global de baja latencia con optimización SEO para indexación en Google.',
      },
      {
        icon: Calendar,
        title: 'Calendario Oficial de Torneos FIP y Premier Padel',
        description:
          'Mantén a tus seguidores y patrocinadores al día de tu agenda competitiva internacional con fechas, sedes, cuadros de juego y retransmisiones.',
        bullets: [
          'Cuenta atrás interactiva para el próximo torneo del circuito.',
          'Enlaces directos a streaming de partidos y marcadores en directo.',
          'Historial de victorias, ranking mundial FIP y puntos acumulados en la temporada.',
        ],
        technicalDetail: 'Módulo de torneos con soporte para streaming embebido de YouTube y marcadores en vivo.',
      },
      {
        icon: CreditCard,
        title: 'Venta de Clinics, Exhibiciones y Masterclasses',
        description:
          'Monetiza tus días libres entre torneos. Organiza clinics exclusivos para clubes, masterclasses VIP para empresas y gestiona la venta de plazas online.',
        bullets: [
          'Pasarela de cobro directa a tu cuenta bancaria sin comisiones abusivas de agencias.',
          'Límite de plazas por evento con confirmación automática y código QR de acceso.',
          'Gestión de contratos y facturación para clubes anfitriones de tus exhibiciones.',
        ],
        technicalDetail: 'Pasarela PCI-DSS con soporte multidivisa para eventos en España, Europa y Latinoamérica.',
      },
      {
        icon: Smartphone,
        title: 'Tienda Oficial de Merchandising y Palas Firmadas',
        description:
          'Vende directamente tu equipación oficial, camisetas de juego firmadas y palas de edición especial con envío internacional.',
        bullets: [
          'Catálogo de productos exclusivos con autentificación de firma.',
          'Control de inventario y cálculo de gastos de envío internacional.',
          'Integración con pasarelas de pago seguro con tarjeta y Apple Pay.',
        ],
        technicalDetail: 'Motor e-commerce ligero integrado con pasarela de pago segura y trazabilidad de envíos.',
      },
    ],
    technicalSpecs: [
      { category: 'Rendimiento Web', description: 'Puntuación 100/100 en Google Core Web Vitals para máxima velocidad', badge: 'Edge CDN' },
      { category: 'Pasarela Global', description: 'Cobro multidivisa (EUR, USD, GBP) con liquidación directa', badge: 'Stripe International' },
      { category: 'Métricas de Sponsors', description: 'Analítica de clics y visualizaciones de logotipos de patrocinadores', badge: 'Analytics Pro' },
      { category: 'Streaming en Directo', description: 'Integración nativa con señales de streaming de YouTube y Twitch', badge: 'Live Video' },
    ],
    workflowSteps: [
      { step: '01', title: 'Configuración de Marca Oficial', desc: 'Activamos tu web con tus colores oficiales, biografía y logotipos de sponsors.' },
      { step: '02', title: 'Publicación de Agenda y Torneos', desc: 'Tu equipo o mánager actualiza el calendario de competición en 2 minutos.' },
      { step: '03', title: 'Lanzamiento de Clinics y Eventos', desc: 'Publica fechas de masterclasses y recibe los pagos de plazas en tu banco.' },
      { step: '04', title: 'Reportes para Patrocinadores', desc: 'Genera informes de impacto y visibilidad para presentar en renovaciones de contratos.' },
    ],
    roiTitle: 'Beneficios Comerciales para Atletas Profesionales',
    roiBullets: [
      'Independencia total de intermediarios en la comercialización de eventos y clinics.',
      'Justificación demostrable del valor publicitario ofrecido a las marcas patrocinadoras.',
      'Canal de venta directo de merchandising de alta rentabilidad.',
      'Consolidación de tu imagen de marca personal en el ecosistema mundial del pádel.',
    ],
    demoCta: 'Solicitar Demo para Jugadores Profesionales',
  },
};

export function SolucionesPage({
  onBack,
  onOpenDemo,
  onOpenRegister,
  roleId,
  onOpenRole,
}: SolucionesPageProps) {
  const { setPublicPage, triggerDemoToast, t } = useApp();

  const resolveSelectedRole = (): ProfessionalRoleKey | null => {
    if (roleId === 'clubes') return 'clubes';
    if (roleId === 'profesores' || roleId === 'escuelas' || roleId === 'schools') return 'profesores';
    if (roleId === 'profesionales' || roleId === 'pro_players') return 'profesionales';
    return null;
  };

  const [selectedRoleKey, setSelectedRoleKey] = useState<ProfessionalRoleKey | null>(resolveSelectedRole);

  useEffect(() => {
    const resolved = resolveSelectedRole();
    setSelectedRoleKey(resolved);
  }, [roleId]);

  const handleSelectRole = (key: ProfessionalRoleKey) => {
    setSelectedRoleKey(key);
    if (onOpenRole) {
      onOpenRole(key);
    }
    if (typeof window !== 'undefined') {
      const pathMap: Record<ProfessionalRoleKey, string> = {
        clubes: '/soluciones/clubes',
        profesores: '/soluciones/profesores',
        profesionales: '/soluciones/jugadores-profesionales',
      };
      window.history.pushState({}, '', pathMap[key]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setSelectedRoleKey(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/soluciones');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoClick = (roleBadge?: string) => {
    if (onOpenDemo) {
      onOpenDemo();
    } else {
      triggerDemoToast('Demo Guiada', `Iniciando demostración interactiva para ${roleBadge || 'profesionales'}`, 'info');
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

  const navigateToPlayerDetails = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/para-jugadores');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setPublicPage('players_app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- VISTA DETALLADA DEL ROL SELECCIONADO ---
  if (selectedRoleKey) {
    const activeRole = PROFESSIONAL_ROLES_DATA[selectedRoleKey];
    const Icon = activeRole.icon;

    return (
      <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Navigation Button alineado a la izquierda */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackToGrid}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-emerald-400 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('common.back', 'Volver a Soluciones')}</span>
            </button>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Setmio Pro · {activeRole.badge}
            </span>
          </div>

          {/* Hero Header Detallado (Alineado limpiamente a la izquierda) */}
          <section className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-sm dark:shadow-2xl">
            <div className="relative z-10 max-w-4xl space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/20">
                <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t(`solutions.${activeRole.id}.badge`, activeRole.badge)}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {t(`solutions.${activeRole.id}.detailTitle`, activeRole.title)}
              </h1>

              <p className="text-lg sm:text-xl font-medium text-emerald-600 dark:text-emerald-400 leading-snug">
                {t(`solutions.${activeRole.id}.detailSubtitle`, activeRole.subtitle)}
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {t(`solutions.${activeRole.id}.heroDesc`, activeRole.heroDescription)}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDemoClick(activeRole.badge)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{t(`solutions.${activeRole.id}.demoCta`, activeRole.demoCta)}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition active:scale-95 cursor-pointer"
                >
                  <span>{t('nav.register', 'Dar de Alta Directa')}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            </div>
          </section>

          {/* Métricas y KPIs de Impacto */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeRole.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs"
              >
                <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {t(`solutions.${activeRole.id}.metrics.${idx}.label`, m.label)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {t(`solutions.${activeRole.id}.metrics.${idx}.sub`, m.sub)}
                </div>
              </div>
            ))}
          </section>

          {/* 4 Pilares de la Solución con Profundidad Técnica */}
          <section className="space-y-6">
            <div className="space-y-1 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('solutions.detail.pillarsEyebrow', 'Arquitectura Funcional')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('solutions.detail.pillarsTitle', 'Pilares Tecnológicos y Operativos')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeRole.pillars.map((pillar, idx) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <PillarIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {t(`solutions.${activeRole.id}.pillars.${idx}.title`, pillar.title)}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t(`solutions.${activeRole.id}.pillars.${idx}.desc`, pillar.description)}
                      </p>
                      <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {pillar.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{t(`solutions.${activeRole.id}.pillars.${idx}.b.${bIdx}`, b)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-800 dark:text-slate-200">{t('solutions.detail.techSpec', 'Especificación técnica:')} </strong>
                      {t(`solutions.${activeRole.id}.pillars.${idx}.tech`, pillar.technicalDetail)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Workflow Operativo Paso a Paso */}
          <section className="space-y-6">
            <div className="space-y-1 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('solutions.detail.workflowEyebrow', 'Flujo de Trabajo')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('solutions.detail.workflowTitle', '¿Cómo opera el sistema en el día a día?')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeRole.workflowSteps.map((wf, wfIdx) => (
                <div
                  key={wf.step}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 relative shadow-xs"
                >
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {wf.step}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t(`solutions.${activeRole.id}.workflow.${wfIdx}.title`, wf.title)}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t(`solutions.${activeRole.id}.workflow.${wfIdx}.desc`, wf.desc)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Especificaciones Técnicas y Cumplimiento */}
          <section className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t('solutions.detail.complianceTitle', 'Ficha Técnica de Integración y Cumplimiento')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeRole.technicalSpecs.map((spec, sIdx) => (
                <div key={sIdx} className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {t(`solutions.${activeRole.id}.specs.${sIdx}.category`, spec.category)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20">
                      {spec.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {t(`solutions.${activeRole.id}.specs.${sIdx}.desc`, spec.description)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ROI y Retorno Comercial */}
          <section className="p-8 sm:p-10 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {t('solutions.detail.roiEyebrow', 'Rentabilidad Demostrable')}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {t(`solutions.${activeRole.id}.roiTitle`, activeRole.roiTitle)}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeRole.roiBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {t(`solutions.${activeRole.id}.roi.${idx}`, bullet)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleDemoClick(activeRole.badge)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md active:scale-95"
              >
                {t('solutions.detail.demoBtn', 'Solicitar Demostración Guiada')}
              </button>
              <button
                type="button"
                onClick={handleBackToGrid}
                className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer active:scale-95"
              >
                {t('solutions.detail.otherSolutionsBtn', 'Ver Otras Soluciones')}
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // --- VISTA PRINCIPAL: CUADRÍCULA DE TARJETAS RESUMEN DE SOLUCIONES ---
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation Button alineado a la izquierda */}
        <div className="flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} />
        </div>

        {/* Header Superior (Alineado limpiamente a la izquierda) */}
        <div className="space-y-4 max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>{t('solutions.eyebrowBadge', 'Soluciones Especializadas por Perfil Profesional')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {t('solutions.mainTitle', 'Una plataforma diseñada para cada protagonista del pádel')}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {t('solutions.mainSubtitle', 'Descubre las soluciones de software de gestión integral y marca blanca diseñadas a medida para instalaciones deportivas, academias docentes y atletas profesionales de élite.')}
          </p>
        </div>

        {/* Cuadrícula de Tarjetas Resumen para cada rol profesional (Setmio Pro) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tarjeta 1: Clubes de Pádel */}
          <article className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Setmio Pro
                </span>
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {t('solutions.cardClubsBadge', 'Instalaciones & Complejos')}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t('solutions.cardClubsTitle', 'Clubes de Pádel')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {t('solutions.cardClubsDesc', 'Control absoluto de cuadrante de pistas, socios y facturación con marca blanca completa, automatización domótica de luces LED y cero comisiones por reserva.')}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF1', 'Cuadrante táctil de pistas con encendido domótico de iluminación LED')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF2', 'Split payments (cobro de 1/4 por jugador vía Bizum y tarjeta)')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF3', 'TPV Bar / Cafetería, arqueos de caja y tienda pro-shop con palas de test')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectRole('clubes')}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t('solutions.cardClubsBtn', 'Ver Solución Detallada para Clubes')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>

          {/* Tarjeta 2: Profesores y Academias */}
          <article className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-teal-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-cyan-400 border border-teal-500/20">
                  Setmio Pro
                </span>
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                  {t('solutions.cardSchoolsBadge', 'Escuelas & Entrenadores')}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t('solutions.cardSchoolsTitle', 'Profesores y Academias')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {t('solutions.cardSchoolsDesc', 'Herramientas profesionales para impartir clases particulares y grupales, evaluar la evolución técnica del alumno y automatizar cobros recurrentes de cuotas.')}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF1', 'Cobro recurrente mensual de cuotas de escuela por domiciliación o tarjeta')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF2', 'Control de asistencia en pista, asignación docente y lista de espera')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF4', 'Portal web propio para entrenadores particulares y personal trainers')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectRole('profesores')}
                className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t('solutions.cardSchoolsBtn', 'Ver Solución Detallada para Profesores')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>

          {/* Tarjeta 3: Jugadores Profesionales */}
          <article className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Setmio Pro
                </span>
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {t('solutions.cardProBadge', 'Atletas Premier Padel & FIP')}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t('solutions.cardProTitle', 'Jugadores Profesionales')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {t('solutions.cardProDesc', 'Gestiona tu carrera deportiva de élite, catálogo de patrocinadores, agenda oficial de torneos FIP y relación directa con sponsors y afición.')}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF1', 'Perfil oficial de atleta y presencia web de marca blanca de alta fidelidad')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF2', 'Calendario de torneos internacionales, clinics de fin de semana y patrocinios')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF3', 'Tienda de equipación oficial firmada y venta de entradas VIP a exhibiciones')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectRole('profesionales')}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t('solutions.cardProBtn', 'Ver Solución para Jugadores Pro')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        </div>

        {/* CTA Destacado hacia Setmio Player (Amateurs y Jugadores Particulares) */}
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-cyan-500/30 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs uppercase tracking-wider border border-cyan-500/30">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{t('solutions.playerBannerBadge', 'Setmio Player · Para Jugadores Particulares y Amateurs')}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {t('solutions.playerBannerTitle', '¿Buscas la experiencia como jugador para reservar y jugar?')}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t('solutions.playerBannerDesc', 'Setmio Player es el portal móvil creado para que los aficionados al pádel reserven pista en segundos, se unan a partidos abiertos nivelados por rating decimal, dividan el pago con amigos y abran la pista con el móvil.')}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={navigateToPlayerDetails}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t('solutions.playerBannerBtn', 'Conocer Setmio Player')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('Jugadores')}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{t('solutions.playerBannerDemo', 'Ver Demo Player')}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SolucionesPage;
