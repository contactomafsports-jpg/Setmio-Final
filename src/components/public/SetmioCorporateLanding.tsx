import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Trophy,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  CreditCard,
  Building2,
  GraduationCap,
  ShoppingBag,
  Bot,
  Globe,
  Sliders,
  Play,
  Check,
  X,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { RoleSelectorModal } from '../common/RoleSelectorModal';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
import playerPadelImg from '../../assets/images/player_padel_action_1794872242959.jpg';

interface SetmioCorporateLandingProps {
  onOpenAuth: () => void;
  onExploreClub: (slug: string) => void;
  onOpenDemoRoleModal?: () => void;
  onOpenOnboarding?: () => void;
  onOpenFeatures?: () => void;
}

export const SetmioCorporateLanding: React.FC<SetmioCorporateLandingProps> = ({
  onOpenAuth,
  onExploreClub,
  onOpenDemoRoleModal,
  onOpenOnboarding,
  onOpenFeatures,
}) => {
  const {
    tenants,
    triggerDemoToast,
    setPublicPage,
    t,
  } = useApp();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [localDemoModalOpen, setLocalDemoModalOpen] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubSlug, setClubSlug] = useState('');
  const [clubCourts, setClubCourts] = useState(4);
  const [clubCity, setClubCity] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const revealRefs = useRef<HTMLElement[]>([]);

  void onOpenAuth;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const reveal = (element: HTMLElement | null) => {
    if (element && !revealRefs.current.includes(element)) revealRefs.current.push(element);
  };

  const navigatePublicRoute = (path: string, page: Parameters<typeof setPublicPage>[0]) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setPublicPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterModalOpen(false);
    triggerDemoToast(
      t('home.registerToast.title'),
      t('home.registerToast.desc'),
      'success'
    );
  };

  const handleOpenDemo = () => {
    if (onOpenDemoRoleModal) {
      onOpenDemoRoleModal();
    } else {
      setLocalDemoModalOpen(true);
    }
  };

  const handleOpenRegister = () => {
    onOpenOnboarding?.();
  };

  const handleOpenFeaturesClick = () => {
    if (onOpenFeatures) {
      onOpenFeatures();
    } else {
      navigatePublicRoute('/funcionalidades', 'features');
    }
  };

  const modulesList = [
    {
      icon: Zap,
      accent: 'lime' as const,
      title: t('home.modules.m1.title', 'Domótica IoT & Automatizaciones'),
      desc: t('home.modules.m1.desc', 'Control de encendido y apagado de luces LED sincronizado con el calendario de partidos y apertura de puertas por código PIN y QR temporal.'),
    },
    {
      icon: CreditCard,
      accent: 'violet' as const,
      title: t('home.modules.m2.title', 'Pagos Divididos (Split Payments)'),
      desc: t('home.modules.m2.desc', 'Cobro fraccionado a 1/4 por jugador mediante Bizum y tarjeta. Monedero recargable de socios con bonificaciones automáticas.'),
    },
    {
      icon: Bot,
      accent: 'violet' as const,
      title: t('home.modules.m3.title', 'Copiloto de Atención 24/7 en WhatsApp'),
      desc: t('home.modules.m3.desc', 'Asistente inteligente conectado a la API oficial de WhatsApp para consultar disponibilidad de pistas, responder dudas frecuentes y formalizar reservas.'),
    },
    {
      icon: Trophy,
      accent: 'lime' as const,
      title: t('home.modules.m4.title', 'Gestor de Torneos, Ligas y Pozos'),
      desc: t('home.modules.m4.desc', 'Cuadros de competición automáticos, pools americanos, fases de grupos y rankings dinámicos por categorías federadas o sociales.'),
    },
    {
      icon: ShoppingBag,
      accent: 'violet' as const,
      title: t('home.modules.m5.title', 'TPV Físico, Bar y Test Center'),
      desc: t('home.modules.m5.desc', 'Terminal punto de venta táctil para cafetería y tienda de material, control de stock en tiempo real, arqueos de caja y prueba de palas en pista.'),
    },
    {
      icon: Globe,
      accent: 'lime' as const,
      title: t('home.modules.m6.title', 'Marca Blanca & Dominio Propio'),
      desc: t('home.modules.m6.desc', 'Web pública personalizada, app móvil corporativa con colores e isotipo propios, sin menciones a intermediarios y con dominio web dedicado.'),
    },
  ];

  const featuredVenues = (tenants || []).slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 w-full max-w-full">
      {/* 1. HERO SECTION */}
      <section ref={reveal} className="scroll-reveal relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-[#0B1A2D] border-b border-[#1A314D] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
          style={{ backgroundImage: `url(${heroPadelImg})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A2D]/85 via-[#0B1A2D]/75 to-[#0B1A2D]" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.28)_0%,transparent_65%)] blur-2xl" />
          <div className="absolute -bottom-40 -right-32 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(183,242,41,0.18)_0%,transparent_65%)] blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
          <div className="mx-auto max-w-4xl text-center space-y-7">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a78bfa]">
              <Sparkles className="w-3.5 h-3.5 text-[#B7F229]" />
              <span>{t('home.corporate.trustBadge', 'Tecnología de Vanguardia para la Industria del Pádel')}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black font-display tracking-tight text-white leading-[1.05] text-balance">
              {t('corporate.heroTitle', 'Software de Marca Blanca integral para profesionales del pádel.')}
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
              {t('home.corporate.heroSubtitle', 'Incluye Web Pública, App de Gestión Interna, App para Personal y Clientes, y Agente de IA para web y redes.')}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={handleOpenRegister}
                className="min-h-[48px] px-7 py-3.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>{t('nav.register', 'Empezar Gratis (30 Días)')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleOpenDemo}
                className="min-h-[48px] px-7 py-3.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4def] text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t('nav.demo', 'Ver demo interactiva')}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenFeaturesClick}
                className="min-h-[48px] px-6 py-3.5 rounded-xl bg-[#0E2239] hover:bg-[#132A45] border border-[#1A314D] text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#B7F229]" />
                <span>{t('home.hero.discover_features', 'Descubrir módulos')}</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs text-slate-300 font-medium pt-2">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B7F229]" /> {t('home.corporate.guarantee1', 'Sin permanencia')}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B7F229]" /> {t('home.corporate.guarantee2', 'Migración de datos en 24h')}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B7F229]" /> {t('home.corporate.guarantee3', 'Soporte personalizado 365 días')}
              </span>
            </div>
          </div>

          {/* Clean Platform Preview Frame */}
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden bg-[#071220] border border-[#1A314D] shadow-xl">
              <div className="px-5 py-3.5 bg-[#0E2239]/80 border-b border-[#1A314D] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span className="font-mono text-[11px] text-slate-300">
                  https://tu-club.setmio.app/gestion
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#B7F229] tabular-nums">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B7F229]" />
                  <span>{t('home.corporate.mockup.active', '8 pistas activas · 94% ocupación hoy')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1A314D] text-left">
                <div className="p-6 space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {t('home.corporate.mockup.revenueLabel', 'Ingresos Reservas Hoy:')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                    1.280,00 €
                  </div>
                  <div className="text-[11px] text-[#B7F229] font-medium">
                    {t('home.corporate.mockup.revenueTrend', '+28% vs semana anterior')}
                  </div>
                </div>

                <div className="p-6 space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {t('home.corporate.mockup.matchesLabel', 'Partidos Abiertos ("Play!"):')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#a78bfa] font-mono tabular-nums">
                    {t('home.corporate.mockup.matchesCreated', '12 creados')}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {t('home.corporate.mockup.playersJoined', '38 jugadores inscritos')}
                  </div>
                </div>

                <div className="p-6 space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {t('home.corporate.mockup.aiLabel', 'Copiloto IA en WhatsApp:')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#B7F229] font-mono tabular-nums">
                    {t('home.corporate.mockup.aiChats', '146 chats')}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {t('home.corporate.mockup.noLostCalls', 'Cero llamadas perdidas')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. METRICS STRIP */}
      <section ref={reveal} className="scroll-reveal py-14 bg-white dark:bg-[#0B1A2D] border-b border-slate-200/80 dark:border-[#1A314D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-[#1A314D] text-center">
            <div className="px-4 py-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums">
                100%
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#0B1A2D] dark:text-white mt-2">
                {t('home.corporate.metric1.title', 'Marca Blanca Integral')}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {t('home.corporate.metric1.desc', 'Tu propio dominio, logo y colores oficiales')}
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1A2D] dark:text-white font-mono tabular-nums">
                -85%
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#0B1A2D] dark:text-white mt-2">
                {t('home.corporate.metric2.title', 'Llamadas a Recepción')}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {t('home.corporate.metric2.desc', 'Reservas y pagos 100% automatizados')}
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#8B5CF6] dark:text-[#a78bfa] font-mono tabular-nums">
                +32%
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#0B1A2D] dark:text-white mt-2">
                {t('home.corporate.metric3.title', 'Ocupación en Horas Valle')}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {t('home.corporate.metric3.desc', 'Con partidos nivelados automáticos')}
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1A2D] dark:text-white font-mono tabular-nums">
                99.98%
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#0B1A2D] dark:text-white mt-2">
                {t('home.corporate.metric4.title', 'Disponibilidad SLA')}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {t('home.corporate.metric4.desc', 'Infraestructura Vercel & Supabase Cloud')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SETMIO PRO: SOLUTIONS */}
      <section ref={reveal} id="soluciones" className="scroll-reveal py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B5CF6] dark:text-[#a78bfa]">
            {t('home.pro.badge', 'Setmio Pro · Software de Gestión Profesional')}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0B1A2D] dark:text-white text-balance">
            {t('home.pro.title', 'Una solución profesional diseñada a medida para cada protagonista del pádel')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('home.pro.subtitle', 'Digitaliza la operación integral de tus instalaciones, profesionaliza la academia de tus entrenadores y gestiona la carrera de atletas de élite en una infraestructura única y sin comisiones.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Clubes */}
          <div className="p-8 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="w-11 h-11 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] dark:text-[#a78bfa]">
                  {t('home.pro.clubsBadge', 'Para Instalaciones Deportivas')}
                </div>
                <h3 className="text-2xl font-black text-[#0B1A2D] dark:text-white">
                  {t('home.pro.clubsTitle', 'Clubes de Pádel')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('home.pro.clubsDesc', 'Control absoluto de instalaciones, socios y facturación con marca blanca completa, automatización domótica y cero comisiones por reserva.')}
                </p>
              </div>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-[#1A314D] pt-5">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF1', 'Cuadrante táctil de pistas con encendido domótico de iluminación LED')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF2', 'Split payments (cobro de 1/4 por jugador vía Bizum y tarjeta de crédito)')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF3', 'TPV Bar / Cafetería, arqueos de caja y tienda pro-shop con palas de test')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF4', 'Gestor de torneos oficiales, ligas sociales, pozos americanos y rankings')}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => navigatePublicRoute('/soluciones/clubes', 'solution_clubs')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:gap-3 transition-all cursor-pointer"
            >
              <span>{t('home.pro.clubsExplore', 'Explorar solución para clubes')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Profesores y Academias */}
          <div className="p-8 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#8B5CF6]/60 transition-colors flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="w-11 h-11 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] dark:text-[#a78bfa]">
                  {t('home.pro.coachesBadge', 'Para Entrenadores & Escuelas')}
                </div>
                <h3 className="text-2xl font-black text-[#0B1A2D] dark:text-white">
                  {t('home.pro.coachesTitle', 'Profesores y Academias')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('home.pro.coachesDesc', 'Herramientas profesionales para impartir clases particulares y grupales, evaluar la evolución técnica del alumno y automatizar cobros recurrentes.')}
                </p>
              </div>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-[#1A314D] pt-5">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF1', 'Cobro recurrente mensual o trimestral de cuotas de escuela por domiciliación o tarjeta')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF2', 'Control de asistencia en pista, asignación docente y lista de espera inteligente')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF3', 'Ficha técnica de nivel deportivo, historial de partidos y notas metodológicas')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF4', 'Portal web propio del profesor para entrenadores individuales y personal trainers')}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => navigatePublicRoute('/soluciones/profesores', 'solution_coaches')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#8B5CF6] dark:text-[#a78bfa] hover:gap-3 transition-all cursor-pointer"
            >
              <span>{t('home.pro.coachesExplore', 'Explorar solución para profesores')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Jugadores Profesionales */}
          <div className="p-8 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="w-11 h-11 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center border border-[#1A314D]">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] dark:text-[#a78bfa]">
                  {t('home.pro.proPlayersBadge', 'Atletas Premier Padel & FIP')}
                </div>
                <h3 className="text-2xl font-black text-[#0B1A2D] dark:text-white">
                  {t('home.pro.proPlayersTitle', 'Jugadores Profesionales')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('home.pro.proPlayersDesc', 'Gestiona tu carrera deportiva de élite, catálogo de patrocinadores, agenda oficial de torneos FIP y relación directa con sponsors y afición.')}
                </p>
              </div>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-[#1A314D] pt-5">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF1', 'Perfil oficial de atleta y presencia web de marca blanca de alta fidelidad')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF2', 'Calendario de torneos internacionales, clinics de fin de semana y patrocinios')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF3', 'Tienda de equipación oficial firmada y venta de entradas VIP a exhibiciones')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF4', 'Estadísticas deportivas, rankings oficiales FIP y difusión multimedia')}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => navigatePublicRoute('/soluciones/jugadores-profesionales', 'solution_pro_players')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:gap-3 transition-all cursor-pointer"
            >
              <span>{t('home.pro.proPlayersExplore', 'Explorar solución profesional')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. SETMIO PLAYER */}
      <section ref={reveal} id="setmio-player" className="scroll-reveal py-20 sm:py-28 bg-[#0B1A2D] text-white border-y border-[#1A314D] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(139,92,246,0.18)_0%,transparent_65%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B7F229]">
                <Users className="w-4 h-4" />
                <span>{t('home.player.badge', 'Setmio Player · Para Jugadores Particulares y Amateurs')}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.08]">
                {t('home.player.title', 'La experiencia definitiva para los apasionados del pádel')}
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                {t('home.player.subtitle', 'Diseñado exclusivamente para que los jugadores particulares reserven pista en menos de 15 segundos, encuentren rivales de su nivel exacto, gestionen su monedero digital y compitan en los torneos de su club.')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-5 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-2">
                  <div className="text-[#B7F229] font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t('home.player.f1Title', 'Reserva en 3 clics')}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('home.player.f1Desc', 'Cuadrante interactivo en tiempo real con selección visual de compañeros y split payment.')}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-2">
                  <div className="text-[#a78bfa] font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t('home.player.f2Title', 'Partidos Abiertos ("Play!")')}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('home.player.f2Desc', 'Únete a partidas niveladas por nivel decimal (ej. 3.75) y posición de revés o drive.')}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-2">
                  <div className="text-[#a78bfa] font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t('home.player.f3Title', 'Monedero Digital & Bonus')}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('home.player.f3Desc', 'Recarga saldo con bonificaciones automáticas del club y paga sin sacar la tarjeta bancaria.')}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0E2239] border border-[#1A314D] space-y-2">
                  <div className="text-[#B7F229] font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t('home.player.f4Title', 'Acceso Domótico QR / PIN')}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('home.player.f4Desc', 'Apertura instantánea de puertas y encendido de focos sin pasar por mostrador.')}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigatePublicRoute('/para-jugadores', 'players_app')}
                  className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  <span>{t('home.player.btn', 'Conocer Setmio Player')}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#1A314D] bg-[#071220] aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={playerPadelImg}
                  alt={t('home.player.imageAlt', 'Jugador de pádel con Setmio Player')}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071220] via-[#071220]/45 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 rounded-xl bg-[#0B1A2D]/95 border border-[#1A314D] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#B7F229] text-[#0B1A2D] flex items-center justify-center font-black text-xs">
                        SP
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{t('home.player.cardTitle', 'Setmio Player App')}</div>
                        <div className="text-[11px] text-slate-400">{t('home.player.cardSubtitle', 'Portal móvil de reservas y competición')}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#B7F229] font-mono">
                      {t('common.active247', 'Activo 24/7')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1A314D] text-[11px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('home.player.nextMatch', 'Próximo Partido')}</div>
                        <div className="text-xs font-bold text-white mt-0.5">{t('home.player.courtInfo', 'Pista 2 Panorámica')}</div>
                      </div>
                      <span className="text-[11px] text-[#a78bfa] font-mono tabular-nums font-bold">19:30h</span>
                    </div>

                    <div className="flex items-center justify-between border-l border-[#1A314D] pl-3">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('home.player.pinLabel', 'PIN Domótica')}</div>
                        <div className="font-mono text-sm font-black text-[#B7F229] tabular-nums">8241</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{t('home.player.levelLabel', 'Nivel')}</span>
                        <div className="font-mono text-xs font-black text-white tabular-nums">3.85</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEDES Y CLUBES CONECTADOS (ECOSISTEMA EN VIVO) */}
      {featuredVenues.length > 0 && (
        <section ref={reveal} id="sedes" className="scroll-reveal py-20 bg-white dark:bg-[#0B1A2D] border-b border-slate-200/80 dark:border-[#1A314D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B5CF6] dark:text-[#a78bfa]">
                  {t('home.venues.eyebrow', 'Sedes & Clubes Conectados')}
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0B1A2D] dark:text-white">
                  {t('home.venues.title', 'Explora webs públicas reales impulsadas por Setmio')}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredVenues.map((venue) => (
                <button
                  key={venue.id}
                  type="button"
                  onClick={() => onExploreClub(venue.slug)}
                  className="text-left p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#8B5CF6] dark:hover:border-[#B7F229] transition-colors flex flex-col justify-between space-y-5 group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#8B5CF6] dark:text-[#a78bfa]">
                      <span className="uppercase tracking-wider">{venue.type.replace('_', ' ')}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
                    </div>
                    <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white group-hover:text-[#8B5CF6] dark:group-hover:text-[#B7F229] transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{venue.city}, {venue.country}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs font-semibold text-[#0B1A2D] dark:text-slate-200">
                    <span>{t('home.venues.openWeb', 'Abrir sede pública')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#B7F229] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. VÍDEO DESTACADO Y BENEFICIOS OPERATIVOS */}
      <section ref={reveal} className="scroll-reveal py-20 sm:py-28 bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[.85fr_1.15fr] gap-12 items-center">
          <div className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B5CF6] dark:text-[#a78bfa]">
              {t('home.corporate.benefitsEyebrow', 'Eficiencia y Automatización Real')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0B1A2D] dark:text-white leading-tight">
              {t('home.corporate.benefitsTitle', 'Beneficios operativos reales para la gestión diaria de tu club')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {t('home.corporate.benefitsDesc', 'Descubre cómo una infraestructura de software moderna ahorra cientos de horas en recepción, elimina las reservas no cobradas mediante pasarelas automatizadas y multiplica la ocupación en horas valle sin intervención manual.')}
            </p>
            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                <span>{t('home.corporate.benefitsList1', 'Hasta 40% de ahorro energético en luz de pistas con control domótico IoT')}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                <span>{t('home.corporate.benefitsList2', 'Cobro garantizado del 100% de la pista antes de que los 4 jugadores pisen el césped')}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                <span>{t('home.corporate.benefitsList3', 'Cero llamadas perdidas gracias al copiloto inteligente en WhatsApp oficial')}</span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-[#1A314D] bg-[#071220] aspect-video">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              poster={heroPadelImg}
              aria-label={t('home.video.ariaLabel', 'Vídeo de demostración operativa en pistas')}
            >
              <source src="https://cdn.coverr.co/videos/coverr-a-padel-match-1573/1080p.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* 7. MÓDULOS DE LA SUSCRIPCIÓN */}
      <section id="modulos" className="py-20 sm:py-28 bg-[#F8FAFC] dark:bg-[#071220] border-y border-slate-200/80 dark:border-[#1A314D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3 text-left max-w-2xl">
              <div className="text-xs font-bold text-[#8B5CF6] dark:text-[#a78bfa] uppercase tracking-[0.18em]">
                {t('home.modules.badge', 'Ecosistema Modular Integral')}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0B1A2D] dark:text-white">
                {t('home.modules.title', 'Todo lo que tu club necesita en una sola suscripción')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.modules.subtitle', 'Herramientas diseñadas para operar de forma unificada: gestión de pistas, escuela, competiciones, domótica, TPV y marca blanca en una sola infraestructura sin fricción.')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigatePublicRoute('/modulos', 'features')}
              className="shrink-0 min-h-[44px] px-6 py-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#c5f64e] dark:text-[#0B1A2D] font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto"
            >
              <Sliders className="w-4 h-4 text-[#B7F229] dark:text-[#0B1A2D]" />
              <span>{t('home.modules.viewAll', 'Ver todo')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modulesList.map((mod, idx) => {
              const Icon = mod.icon;
              const isLime = mod.accent === 'lime';
              return (
                <div
                  key={idx}
                  className="p-7 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-[#8B5CF6]/60 dark:hover:border-[#B7F229]/60 transition-colors space-y-4"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isLime
                        ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229]/15 dark:text-[#B7F229]'
                        : 'bg-[#8B5CF6]/12 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 dark:text-[#a78bfa]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#0B1A2D] dark:text-white">{mod.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{mod.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. PRE-FOOTER CTA */}
      <section ref={reveal} className="scroll-reveal py-24 bg-[#0B1A2D] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(139,92,246,0.22)_0%,transparent_65%)] blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(183,242,41,0.16)_0%,transparent_65%)] blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 relative z-10">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#B7F229]">
            {t('home.prefooter.badge', 'Empieza Hoy Mismo · 30 Días de Prueba Sin Compromiso')}
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.08] text-white">
            {t('home.prefooter.title', '¿Listo para llevar la gestión de tu club al siguiente nivel?')}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('home.prefooter.subtitle', 'Sin permanencias, sin comisiones por pista reservada y con soporte técnico telefónico los 365 días del año. Migramos los datos de tu club en menos de 24 horas.')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={handleOpenRegister}
              className="min-h-[48px] px-8 py-4 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>{t('home.prefooter.startBtn', 'Crear Cuenta de Club Gratis')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenDemoRoleModal) {
                  onOpenDemoRoleModal();
                } else {
                  setLocalDemoModalOpen(true);
                }
              }}
              className="min-h-[48px] px-8 py-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4def] text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t('home.corporate.demoBtn', 'Ver demo interactiva')}</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs text-slate-300 font-medium pt-4">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#B7F229]" aria-hidden="true" /> {t('home.prefooter.trust.setup')}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#B7F229]" aria-hidden="true" /> {t('home.prefooter.trust.noCard')}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#B7F229]" aria-hidden="true" /> {t('home.prefooter.trust.cancel')}
            </span>
          </div>
        </div>
      </section>

      <RoleSelectorModal
        isOpen={localDemoModalOpen}
        onClose={() => setLocalDemoModalOpen(false)}
      />

      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#0B1A2D] dark:text-white max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
              aria-label={t('common.close', 'Cerrar')}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] dark:text-[#a78bfa]">
                {t('home.corporate.modal.badge', 'Alta de Club en Setmio')}
              </div>
              <h3 className="text-2xl font-black text-[#0B1A2D] dark:text-white">
                {t('home.corporate.modal.title', 'Comienza con Setmio')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('home.corporate.modal.subtitle', 'Configura tu club en menos de 2 minutos. Sin tarjeta de crédito requerida.')}
              </p>
            </div>

            <form onSubmit={handleRegisterClubSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                  {t('home.corporate.modal.clubNameLabel', 'Nombre Oficial del Club')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Club Central Padel"
                  value={clubName}
                  onChange={(e) => {
                    setClubName(e.target.value);
                    if (!clubSlug) {
                      setClubSlug(
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9]/g, '')
                      );
                    }
                  }}
                  className="w-full bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                    {t('home.corporate.modal.subdomainLabel', 'Subdominio Setmio')}
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="club-central"
                      value={clubSlug}
                      onChange={(e) => setClubSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      className="w-full bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-l-xl px-3 py-2.5 text-[#0B1A2D] dark:text-white font-mono focus:outline-none focus:border-[#8B5CF6]"
                    />
                    <span className="bg-slate-100 dark:bg-[#132A45] border border-l-0 border-slate-200 dark:border-[#1A314D] rounded-r-xl px-2.5 py-2.5 text-[11px] text-slate-500 dark:text-slate-300 font-mono">
                      .setmio.app
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                    {t('home.corporate.modal.courtsLabel', 'Número de Pistas')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={clubCourts}
                    onChange={(e) => setClubCourts(parseInt(e.target.value) || 4)}
                    className="w-full bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white font-mono tabular-nums focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                  {t('home.corporate.modal.cityLabel', 'Ciudad / Municipio')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('home.corporate.modal.cityPlaceholder')}
                  value={clubCity}
                  onChange={(e) => setClubCity(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                    {t('home.corporate.modal.emailLabel', 'Email de Contacto')}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="gerencia@tuclub.es"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                    {t('home.corporate.modal.phoneLabel', 'Teléfono / WhatsApp')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 00 00 00"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[44px] py-3.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('home.corporate.modal.submitBtn', 'Activar Mi Club en Setmio (30 Días Gratis)')}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-normal">
                {t('home.corporate.modal.termsNotice', 'Al registrarte aceptas las Condiciones de Servicio y la Política de Privacidad de Setmio.')}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
