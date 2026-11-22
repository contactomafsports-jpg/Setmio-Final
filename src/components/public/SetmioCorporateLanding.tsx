import React, { useState } from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Play,
  X,
} from 'lucide-react';
import { RoleSelectorModal } from '../common/RoleSelectorModal';
import {
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporatePrimaryButton,
  CorporateSecondaryButton,
  CorporateSectionHeader,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';
import { SETMIO_PRO_CORE_SEGMENTS } from './corporate/corporateData';
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
  onExploreClub,
  onOpenDemoRoleModal,
  onOpenOnboarding,
  onOpenFeatures,
}) => {
  const { tenants, triggerDemoToast, setPublicPage, t } = useApp();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [localDemoModalOpen, setLocalDemoModalOpen] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubSlug, setClubSlug] = useState('');
  const [clubCourts, setClubCourts] = useState(4);
  const [clubCity, setClubCity] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

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

  const featuredVenues = (tenants || []).slice(0, 4);

  const platformPillars = [
    {
      number: '01',
      title: 'Marca blanca completa y dominio propio',
      desc: 'Tu web, reservas y app llevan exclusivamente tu identidad visual, logotipo y dominio corporativo.',
    },
    {
      number: '02',
      title: 'Cobros directos sin comisiones por pista',
      desc: 'Pagos divididos entre jugadores, monedero de club y remesas SEPA con liquidación directa a tu cuenta bancaria.',
    },
    {
      number: '03',
      title: 'Domótica de iluminación y accesos 24/7',
      desc: 'Encendido sincronizado de focos LED y apertura de puertas por PIN temporal sin personal presencial en recepción.',
    },
    {
      number: '04',
      title: 'Asistente IA para web y WhatsApp',
      desc: 'Atención automática a consultas de disponibilidad, tarifas y normativa conectada al cuadrante real de tu centro.',
    },
  ];

  const playerCapabilities = [
    {
      number: '01',
      title: 'Estadísticas de partidos y evolución',
      desc: 'Registro detallado de encuentros, sets ganados, rachas de juego y progresión real de tu nivel por periodo.',
    },
    {
      number: '02',
      title: 'Análisis de rivales y compañeros',
      desc: 'Consulta tu porcentaje de éxito según pareja, historial frente a rivales directos y rendimiento por lado de pista.',
    },
    {
      number: '03',
      title: 'Asistente de entrenador con IA',
      desc: 'Lectura inteligente de tus datos de partido para detectar patrones tácticos y orientar tus entrenamientos.',
    },
    {
      number: '04',
      title: 'Conexión directa con tus clubes',
      desc: 'Enlace directo a la web de reserva de tu club habitual, saldo de monedero y código PIN sin intermediarios.',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200">
      {/* 1. HERO SECTION (Dual Light/Dark Architectural Opening) */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-16 sm:py-20 lg:py-24">
        <CorporateContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-7 animate-float-in">
              <CorporateEyebrow accent="lime">
                Setmio Pro & Setmio Player
              </CorporateEyebrow>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.06] text-balance font-display">
                El sistema operativo de marca blanca para la gestión del pádel.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                Digitaliza reservas, escuelas, torneos, cobros y domótica bajo tu propia marca, sin comisiones por pista y con herramientas dedicadas para cada perfil del sector.
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

              <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  Cero comisiones por reserva
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  Migración asistida en 24h
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                  Sin permanencia
                </span>
              </div>
            </div>

            {/* Clean Architectural Visual Frame */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#1A314D] bg-[#0B1A2D] shadow-lg shadow-[#0B1A2D]/5 dark:shadow-black/30">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={heroCourtImg}
                    alt="Pista de pádel arquitectónica gestionada con Setmio Pro"
                    className="w-full h-full object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D] via-[#0B1A2D]/20 to-transparent"
                    aria-hidden="true"
                  />

                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 text-white">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B7F229]">
                        Infraestructura de marca blanca
                      </div>
                      <div className="text-sm sm:text-base font-bold mt-1">
                        Web pública · Panel de gestión · App de socios · Domótica
                      </div>
                    </div>
                  </div>
                </div>

                {/* Restrained Architectural Capabilities Strip (no fake telemetry) */}
                <div className="grid grid-cols-3 divide-x divide-[#1A314D] bg-[#0B1A2D] text-white">
                  <div className="p-4 sm:p-5">
                    <div className="font-mono text-lg sm:text-xl font-bold text-[#B7F229] tabular-nums">
                      0%
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      Comisión por pista
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="font-mono text-lg sm:text-xl font-bold text-white tabular-nums">
                      24/7
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      Acceso PIN & LED
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="font-mono text-lg sm:text-xl font-bold text-white tabular-nums">
                      100%
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      Dominio propio
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 2. SETMIO PRO — PROFESSIONAL & CORPORATE SEGMENT (FIRST IN HIERARCHY) */}
      <section className="py-20 sm:py-24 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-12">
          <CorporateSectionHeader
            eyebrow="Setmio Pro · Entorno Profesional y Corporativo"
            title="Una solución estructurada para cada organización del pádel"
            subtitle="Desde clubes privados y academias hasta administraciones públicas, federaciones y equipos independientes que contratan el sistema directamente."
            accent="lime"
            action={
              <CorporateSecondaryButton onClick={() => navigate('/soluciones', 'solutions')}>
                Explorar todas las soluciones
              </CorporateSecondaryButton>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SETMIO_PRO_CORE_SEGMENTS.map((segment) => (
              <article
                key={segment.id}
                className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors p-7 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                      {segment.order}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Setmio Pro
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#0B1A2D] dark:text-white tracking-tight font-display">
                      {segment.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {segment.summary}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-[#1A314D] text-xs text-slate-600 dark:text-slate-300">
                    {segment.highlights.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D]">
                  <button
                    type="button"
                    onClick={() => navigate(segment.path, segment.pageKey)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:gap-3 transition-all cursor-pointer"
                  >
                    <span>Ver solución para {segment.shortTitle.toLowerCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </CorporateContainer>
      </section>

      {/* 3. OPERATIONAL ARCHITECTURE & MODULES */}
      <section className="py-20 sm:py-24 border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-6">
              <CorporateEyebrow accent="navy">Arquitectura Modular</CorporateEyebrow>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.12] font-display">
                Todo el control operativo en una sola plataforma sin fricciones.
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Cada módulo trabaja conectado sobre la misma base de socios, pistas y facturación: evita duplicidades administrativas y ofrece a tus usuarios una experiencia coherente de principio a fin.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <CorporatePrimaryButton onClick={handleOpenModules}>
                  Explorar módulos
                </CorporatePrimaryButton>
                <CorporateSecondaryButton onClick={() => navigate('/domotica', 'modules')}>
                  Domótica y accesos
                </CorporateSecondaryButton>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#1A314D] aspect-[16/10] bg-[#0B1A2D]">
                <img
                  src={proFacilityImg}
                  alt="Instalación de pádel contemporánea operando con Setmio"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200/90 dark:border-[#1A314D] rounded-2xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200/90 dark:divide-[#1A314D] bg-white dark:bg-[#0E2239]">
            {platformPillars.map((pillar) => (
              <div key={pillar.number} className="p-6 sm:p-7 space-y-3">
                <span className="font-mono text-xs font-bold text-[#8B5CF6] dark:text-[#B7F229]">
                  {pillar.number}
                </span>
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </CorporateContainer>
      </section>

      {/* 4. SETMIO PLAYER — INDIVIDUAL PLAYER EXPERIENCE (SECOND IN HIERARCHY, NO MARKETPLACE) */}
      <section className="py-20 sm:py-24 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239]">
                <div className="aspect-[4/3] overflow-hidden bg-[#0B1A2D]">
                  <img
                    src={playerFocusImg}
                    alt="Equipación y análisis de rendimiento para jugadores en Setmio Player"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6 sm:p-7 border-t border-slate-200/80 dark:border-[#1A314D] grid grid-cols-3 gap-4 text-left">
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Rendimiento
                    </div>
                    <div className="text-sm font-bold text-[#0B1A2D] dark:text-white mt-0.5">
                      Historial y rachas
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Análisis táctico
                    </div>
                    <div className="text-sm font-bold text-[#0B1A2D] dark:text-white mt-0.5">
                      Pareja y rivales
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Tu club
                    </div>
                    <div className="text-sm font-bold text-[#0B1A2D] dark:text-[#B7F229] mt-0.5">
                      Enlace directo
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-7">
              <CorporateEyebrow accent="violet">
                Setmio Player · Experiencia del Jugador
              </CorporateEyebrow>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.12] font-display">
                Tu evolución en pista, tus rivales y acceso directo a tus clubes.
              </h2>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Un espacio personal centrado exclusivamente en tu juego: registra estadísticas de cada encuentro, analiza cómo rindes con distintos compañeros y recibe orientación de entrenador con IA sin salir del vínculo con tu club habitual.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {playerCapabilities.map((item) => (
                  <div
                    key={item.number}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                        {item.number}
                      </span>
                      <h3 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <CorporatePrimaryButton onClick={() => navigate('/para-jugadores', 'players_app')}>
                  Conocer Setmio Player
                </CorporatePrimaryButton>
              </div>
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 5. REAL WHITE-LABEL VENUES PREVIEW */}
      {featuredVenues.length > 0 && (
        <section className="py-16 sm:py-20 border-b border-slate-200/80 dark:border-[#1A314D]">
          <CorporateContainer className="space-y-10">
            <CorporateSectionHeader
              eyebrow="Entornos de Marca Blanca Activos"
              title="Ejemplos reales de sedes operando con Setmio"
              subtitle="Cada organización dispone de su propio portal independiente con identidad, tarifas y reservas diferenciadas."
              accent="navy"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredVenues.map((venue) => (
                <button
                  key={venue.id}
                  type="button"
                  onClick={() => onExploreClub(venue.slug)}
                  className="text-left p-6 rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors flex flex-col justify-between space-y-5 group cursor-pointer"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <span>{venue.type.replace('_', ' ')}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white group-hover:underline">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {venue.city}, {venue.country}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs font-semibold text-[#0B1A2D] dark:text-[#B7F229]">
                    <span>Abrir portal de ejemplo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </CorporateContainer>
        </section>
      )}

      {/* 6. UNIFIED PRE-FOOTER CTA BANNER */}
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
