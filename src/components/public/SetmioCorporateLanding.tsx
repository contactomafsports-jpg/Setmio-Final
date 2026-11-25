import React, { useState } from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  ArrowRight,
  Check,
  Play,
  X,
} from 'lucide-react';
import { RoleSelectorModal } from '../common/RoleSelectorModal';
import {
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporateMediaFrame,
  CorporateNavyButton,
  CorporatePrimaryButton,
  CorporateSecondaryButton,
  CorporateSectionHeader,
  CorporateSurface,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';
import { SETMIO_PRO_CORE_SEGMENTS, SetmioProSegmentId } from './corporate/corporateData';
import heroCourtImg from '../../assets/images/setmio_hero_court_1795368969510.jpg';
import proFacilityImg from '../../assets/images/setmio_pro_facility_1795368970973.jpg';
import playerFocusImg from '../../assets/images/setmio_player_focus_1795368971038.jpg';

interface SetmioCorporateLandingProps {
  onOpenAuth: () => void;
  onExploreClub: (slug: string) => void;
  onOpenDemoRoleModal?: () => void;
  onOpenOnboarding?: () => void;
  onOpenFeatures?: () => void;
}

export const SetmioCorporateLanding: React.FC<SetmioCorporateLandingProps> = ({
  onExploreClub: _onExploreClub,
  onOpenDemoRoleModal,
  onOpenOnboarding,
  onOpenFeatures,
}) => {
  const { triggerDemoToast, setPublicPage, t } = useApp();

  const [selectedSegmentId, setSelectedSegmentId] = useState<SetmioProSegmentId>('clubes');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [localDemoModalOpen, setLocalDemoModalOpen] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubSlug, setClubSlug] = useState('');
  const [clubCourts, setClubCourts] = useState(4);
  const [clubCity, setClubCity] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  void _onExploreClub;

  const activeSegment =
    SETMIO_PRO_CORE_SEGMENTS.find((s) => s.id === selectedSegmentId) ??
    SETMIO_PRO_CORE_SEGMENTS[0];

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleOpenDemo = () => {
    if (onOpenDemoRoleModal) {
      onOpenDemoRoleModal();
    } else {
      setLocalDemoModalOpen(true);
    }
  };

  const handleOpenRegister = () => {
    if (onOpenOnboarding) {
      onOpenOnboarding();
    } else {
      setRegisterModalOpen(true);
    }
  };

  const handleOpenModules = () => {
    if (onOpenFeatures) {
      onOpenFeatures();
    } else {
      navigate('/modulos', 'features');
    }
  };

  const handleRegisterClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterModalOpen(false);
    triggerDemoToast(
      t('home.registerToast.title', 'Solicitud registrada'),
      t('home.registerToast.desc', 'Hemos recibido los datos de tu instalación para iniciar la activación.'),
      'success'
    );
  };

  const platformCapabilities = [
    {
      number: '01',
      title: 'Marca blanca completa y dominio propio',
      desc: 'Tu web pública, reservas y app llevan exclusivamente tu identidad visual, logotipo y dominio corporativo con certificado SSL.',
    },
    {
      number: '02',
      title: 'Cobros directos sin comisiones por pista',
      desc: 'Pagos fraccionados entre jugadores, monedero de club y remesas SEPA con liquidación directa a tu cuenta bancaria.',
    },
    {
      number: '03',
      title: 'Domótica de iluminación y accesos 24/7',
      desc: 'Encendido sincronizado de focos LED y apertura de puertas por código PIN temporal sin personal presencial en recepción.',
    },
    {
      number: '04',
      title: 'Asistente IA conectado al cuadrante real',
      desc: 'Atención automática en web y WhatsApp para resolver disponibilidad, horarios y normativa según las reglas de cada sede.',
    },
  ];

  const playerCapabilities = [
    {
      number: '01',
      title: 'Estadísticas de partidos y evolución',
      desc: 'Historial detallado de encuentros, sets ganados, rachas y evolución real de tu nivel deportivo.',
    },
    {
      number: '02',
      title: 'Análisis de rivales y compañeros',
      desc: 'Consulta tu porcentaje de éxito por pareja, lado de pista y rendimiento frente a rivales habituales.',
    },
    {
      number: '03',
      title: 'Asistente de entrenador con IA',
      desc: 'Lectura táctica de tus datos recientes para orientar entrenamientos y preparar partidos de liga.',
    },
    {
      number: '04',
      title: 'Conexión directa con tus clubes',
      desc: 'Enlace directo al portal de reservas de tus clubes habituales, saldo de monedero y código PIN de acceso.',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200">
      {/* 1. HERO SECTION — Clean Editorial Split */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-16 sm:py-20 lg:py-24">
        <CorporateContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-7 animate-float-in">
              <CorporateEyebrow accent="lime">
                Setmio Pro · Setmio Player
              </CorporateEyebrow>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.06] text-balance font-display">
                Software de marca blanca para la gestión integral del pádel.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                Unifica reservas, escuelas, torneos, cobros directos y domótica bajo tu propia identidad digital, sin comisiones por pista y adaptado a cada perfil del sector.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <CorporatePrimaryButton onClick={handleOpenRegister}>
                  Empezar prueba de 30 días
                </CorporatePrimaryButton>

                <CorporateSecondaryButton
                  onClick={handleOpenDemo}
                  icon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  Ver demo interactiva
                </CorporateSecondaryButton>
              </div>

              <div className="pt-5 border-t border-slate-200/80 dark:border-[#1A314D] flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-300">
                <span>Sin comisiones por reserva</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-[#244163]">·</span>
                <span>Migración asistida en 24 h</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-[#244163]">·</span>
                <span>Sin permanencia</span>
              </div>
            </div>

            <div className="lg:col-span-6 animate-float-in">
              <CorporateMediaFrame
                src={heroCourtImg}
                alt="Pista de pádel contemporánea gestionada con Setmio Pro"
                aspectClass="aspect-[16/10]"
                fallbackLabel="Setmio Pro · Infraestructura Deportiva"
                className="shadow-lg shadow-[#0B1A2D]/5 dark:shadow-black/30"
              />
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 2. SETMIO PRO — INTERACTIVE ARCHITECTURAL SEGMENT DIRECTORY (FIRST IN HIERARCHY) */}
      <section className="py-20 sm:py-24 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-12">
          <CorporateSectionHeader
            eyebrow="Setmio Pro · Entorno Profesional y Corporativo"
            title="Una solución dedicada para cada organización del pádel"
            subtitle="Desde clubes privados y academias hasta administraciones públicas, federaciones y equipos independientes que contratan la plataforma directamente."
            accent="lime"
            action={
              <CorporateSecondaryButton onClick={() => navigate('/soluciones', 'solutions')}>
                Explorar todas las soluciones
              </CorporateSecondaryButton>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Directory Selector (No 6-card grid clone) */}
            <div className="lg:col-span-5 space-y-4">
              <div
                className="border-y border-slate-200 dark:border-[#1A314D] divide-y divide-slate-200 dark:divide-[#1A314D]"
                role="tablist"
                aria-label="Perfiles profesionales Setmio Pro"
              >
                {SETMIO_PRO_CORE_SEGMENTS.map((segment) => {
                  const isActive = segment.id === activeSegment.id;
                  return (
                    <button
                      key={segment.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedSegmentId(segment.id)}
                      className={`w-full flex items-center justify-between gap-4 px-4 py-4 text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-[#0E2239] text-[#0B1A2D] dark:text-white'
                          : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-[#0E2239]/60 hover:text-[#0B1A2D] dark:hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`font-mono text-xs font-bold tabular-nums shrink-0 ${
                            isActive
                              ? 'text-[#0B1A2D] dark:text-[#B7F229]'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {segment.order}
                        </span>
                        <span className={`text-sm sm:text-base truncate ${isActive ? 'font-bold' : 'font-semibold'}`}>
                          {segment.shortTitle}
                        </span>
                      </span>

                      <ArrowRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? 'text-[#0B1A2D] dark:text-[#B7F229] translate-x-0.5'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="px-1 pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  ¿Compites en circuito profesional?
                </span>
                <button
                  type="button"
                  onClick={() =>
                    navigate('/soluciones/jugadores-profesionales', 'solution_pro_players')
                  }
                  className="font-semibold text-[#0B1A2D] dark:text-[#B7F229] hover:underline cursor-pointer whitespace-nowrap"
                >
                  Jugadores Profesionales →
                </button>
              </div>
            </div>

            {/* Right Active Detail Surface */}
            <div className="lg:col-span-7">
              <CorporateSurface className="p-7 sm:p-10 space-y-7">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-[#1A314D]">
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229] tabular-nums">
                      {activeSegment.order}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-[#244163]">·</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {activeSegment.badge}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
                    {activeSegment.recommendedPlan}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white font-display">
                    {activeSegment.title}
                  </h3>
                  <p className="text-base font-semibold text-[#0B1A2D]/90 dark:text-slate-100 leading-snug">
                    {activeSegment.headline}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeSegment.summary}
                  </p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 pt-5 border-t border-slate-200/80 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-200">
                  {activeSegment.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-5 border-t border-slate-200/80 dark:border-[#1A314D] flex flex-wrap items-center gap-4">
                  <CorporateNavyButton
                    onClick={() => navigate(activeSegment.path, activeSegment.pageKey)}
                  >
                    Ver solución para {activeSegment.shortTitle.toLowerCase()}
                  </CorporateNavyButton>

                  <button
                    type="button"
                    onClick={handleOpenDemo}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Explorar entorno demo →
                  </button>
                </div>
              </CorporateSurface>
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 3. OPERATIONAL ARCHITECTURE — ASYMMETRIC SPLIT + HAIRLINE NUMBERED LIST */}
      <section className="py-20 sm:py-24 border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            <div className="lg:col-span-5 space-y-6">
              <CorporateEyebrow accent="navy">Plataforma Modular</CorporateEyebrow>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.12] text-balance font-display">
                Una sola base operativa para pistas, cobros y automatización.
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Cada área trabaja sincronizada sobre el mismo registro de socios, horarios y liquidación bancaria para evitar duplicidades administrativas.
              </p>

              <CorporateMediaFrame
                src={proFacilityImg}
                alt="Instalación deportiva contemporánea gestionada con Setmio Pro"
                aspectClass="aspect-[4/3]"
                fallbackLabel="Instalación Setmio Pro"
              />
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="border-y border-slate-200/90 dark:border-[#1A314D] divide-y divide-slate-200/90 dark:divide-[#1A314D]">
                {platformCapabilities.map((item) => (
                  <div
                    key={item.number}
                    className="py-6 sm:py-7 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
                  >
                    <div className="sm:col-span-5 flex items-baseline gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400 dark:text-[#B7F229] tabular-nums shrink-0">
                        {item.number}
                      </span>
                      <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="sm:col-span-7 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <CorporatePrimaryButton onClick={handleOpenModules}>
                  Explorar módulos
                </CorporatePrimaryButton>
                <CorporateSecondaryButton onClick={() => navigate('/domotica', 'modules')}>
                  Domótica y accesos
                </CorporateSecondaryButton>
              </div>
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 4. SETMIO PLAYER — INDIVIDUAL PLAYER EXPERIENCE (SECOND IN HIERARCHY, ZERO MARKETPLACE) */}
      <section className="py-20 sm:py-24 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-6">
              <CorporateEyebrow accent="violet">
                Setmio Player · Experiencia del Jugador
              </CorporateEyebrow>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.12] text-balance font-display">
                Tu evolución en pista, tus parejas y el enlace directo con tus clubes.
              </h2>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Un espacio personal centrado exclusivamente en tu rendimiento deportivo: sigue tus estadísticas de partido, analiza cómo rindes con cada compañero o rival y accede sin intermediarios al portal de reserva de tus clubes habituales.
              </p>

              <div className="border-y border-slate-200/90 dark:border-[#1A314D] divide-y divide-slate-200/90 dark:divide-[#1A314D]">
                {playerCapabilities.map((item) => (
                  <div key={item.number} className="py-4 flex items-start gap-4">
                    <span className="font-mono text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] tabular-nums pt-0.5 shrink-0">
                      {item.number}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <CorporatePrimaryButton onClick={() => navigate('/para-jugadores', 'players_app')}>
                  Conocer Setmio Player
                </CorporatePrimaryButton>
              </div>
            </div>

            <div className="lg:col-span-6">
              <CorporateMediaFrame
                src={playerFocusImg}
                alt="Pala de pádel y pelotas sobre banco para análisis de rendimiento en Setmio Player"
                aspectClass="aspect-[4/3]"
                fallbackLabel="Setmio Player · Análisis Personal"
              />
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 5. CLOSING CTA BANNER */}
      <section className="py-16 sm:py-20">
        <CorporateContainer>
          <CorporateCtaBanner
            eyebrow="Setmio Pro · 30 días de prueba sin permanencia"
            title="¿Quieres ver cómo encaja Setmio en tu club, academia o equipo?"
            subtitle="Importamos tus datos iniciales en 24 horas y configuramos tu entorno de marca blanca sin comisiones por pista."
            primaryLabel="Crear cuenta gratis"
            onPrimary={handleOpenRegister}
            secondaryLabel="Explorar demo por perfil"
            onSecondary={handleOpenDemo}
          />
        </CorporateContainer>
      </section>

      <RoleSelectorModal
        isOpen={localDemoModalOpen}
        onClose={() => setLocalDemoModalOpen(false)}
      />

      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#0B1A2D] dark:text-white max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition-colors cursor-pointer"
              aria-label={t('common.close', 'Cerrar')}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 mb-6">
              <CorporateEyebrow>Alta en Setmio Pro</CorporateEyebrow>
              <h3 className="text-2xl font-extrabold text-[#0B1A2D] dark:text-white font-display">
                Solicita la activación de tu entorno
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Configuración guiada sin permanencia ni tarjeta de crédito inicial.
              </p>
            </div>

            <form onSubmit={handleRegisterClubSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                  Nombre de la organización o club
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Club Pádel San Mateo"
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
                  className="w-full bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                    Subdominio inicial
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="tuclub"
                      value={clubSlug}
                      onChange={(e) => setClubSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      className="w-full bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-l-xl px-3 py-2.5 text-[#0B1A2D] dark:text-white font-mono focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    />
                    <span className="bg-slate-100 dark:bg-[#132A45] border border-l-0 border-slate-200 dark:border-[#1A314D] rounded-r-xl px-2.5 py-2.5 text-[11px] text-slate-500 dark:text-slate-300 font-mono">
                      .setmio.app
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                    Número de pistas
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={clubCourts}
                    onChange={(e) => setClubCourts(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white font-mono tabular-nums focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                  Ciudad
                </label>
                <input
                  type="text"
                  required
                  placeholder="Madrid, A Coruña, Valencia..."
                  value={clubCity}
                  onChange={(e) => setClubCity(e.target.value)}
                  className="w-full bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                    Email de contacto
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="gerencia@tuclub.es"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>

                <div>
                  <label className="block text-[#0B1A2D] dark:text-slate-200 mb-1.5 font-semibold">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 00 00 00"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl px-3.5 py-2.5 text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <CorporatePrimaryButton type="submit" className="w-full">
                  Activar prueba de 30 días
                </CorporatePrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
