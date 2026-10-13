import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/database';
import {
  X,
  ShieldCheck,
  Building2,
  GraduationCap,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Trophy,
  Users,
  Compass,
  Briefcase,
  Layers,
} from 'lucide-react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    switchUserRole,
    setCurrentView,
    triggerDemoToast,
    setIsCorporateLanding,
    tenants,
    switchTenant,
    setIsWhiteLabelPlayerPreview,
  } = useApp();

  const [activeEcosystem, setActiveEcosystem] = useState<'all' | 'club' | 'independent' | 'player'>('all');

  if (!isOpen) return null;

  const handleSelectDemo = (config: {
    id: string;
    role: UserRole;
    tenantType?: string;
    tenantId?: string;
    actionView: 'hq' | 'admin' | 'coach' | 'player';
    isWhiteLabelPlayer?: boolean;
    title: string;
    badge: string;
    desc: string;
  }) => {
    setIsCorporateLanding(false);

    // Switch tenant if specified
    if (config.tenantId) {
      switchTenant(config.tenantId);
    } else if (config.tenantType) {
      const match = tenants.find((t) => t.type === config.tenantType);
      if (match) switchTenant(match.id);
    }

    // Set white label preview flag for player
    setIsWhiteLabelPlayerPreview(Boolean(config.isWhiteLabelPlayer));

    // Switch role and view
    switchUserRole(config.role);
    setCurrentView(config.actionView);
    onClose();

    triggerDemoToast(
      `Entorno Demo: ${config.title}`,
      `Has ingresado como ${config.badge}. ${config.desc}`,
      'success'
    );
  };

  const clubEcosystem = [
    {
      id: 'club_admin',
      role: 'TENANT_OWNER' as UserRole,
      tenantId: 'tenant-san-mateo-01',
      tenantType: 'PADEL_CLUB',
      actionView: 'admin' as const,
      isWhiteLabelPlayer: false,
      title: 'Admin Profesional / Club',
      badge: 'Gerente Centro Pádel San Mateo',
      desc: 'Gestiona la instalación completa: pistas, agenda de reservas, TPV mostrador, partidos y facturación.',
      icon: Building2,
      color: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'coach_club',
      role: 'COACH' as UserRole,
      tenantId: 'tenant-san-mateo-01',
      tenantType: 'PADEL_CLUB',
      actionView: 'coach' as const,
      isWhiteLabelPlayer: false,
      title: 'Profesor de Club',
      badge: 'Profesor Oficial San Mateo',
      desc: 'Ve la marca y colores del club demo, con acceso restringido a sus clases, alumnos y cuadrante asignado.',
      icon: GraduationCap,
      color: 'from-emerald-600 to-cyan-700',
    },
    {
      id: 'player_club',
      role: 'PLAYER' as UserRole,
      tenantId: 'tenant-san-mateo-01',
      tenantType: 'PADEL_CLUB',
      actionView: 'player' as const,
      isWhiteLabelPlayer: true,
      title: 'Jugador Socio / Club (Marca Blanca)',
      badge: 'Socio San Mateo',
      desc: 'App de marca blanca del club con logo, colores oficiales, tienda TPV y reservas de pistas del club.',
      icon: User,
      color: 'from-teal-600 to-emerald-600',
    },
  ];

  const independentEcosystem = [
    {
      id: 'coach_independent',
      role: 'COACH' as UserRole,
      tenantId: 'tenant-varela-coach',
      tenantType: 'COACH',
      actionView: 'coach' as const,
      isWhiteLabelPlayer: false,
      title: 'Profesor Independiente (Marca Blanca)',
      badge: 'Carlos Varela Pádel Pro',
      desc: 'Vista enfocada en un único profesional: perfil personal, bonos, particulares y servicios (sin alquiler de pistas).',
      icon: GraduationCap,
      color: 'from-sky-600 to-cyan-700',
    },
    {
      id: 'academy',
      role: 'ACADEMY_MANAGER' as UserRole,
      tenantId: 'tenant-academia-elite',
      tenantType: 'ACADEMY',
      actionView: 'admin' as const,
      isWhiteLabelPlayer: false,
      title: 'Escuela de Pádel (Marca Blanca)',
      badge: 'Academia Élite Pádel',
      desc: 'Vista de colectivo/equipo: múltiples profesores, grupos de alumnos, niveles, matrículas y cursos.',
      icon: Users,
      color: 'from-indigo-600 to-blue-700',
    },
    {
      id: 'pro_player',
      role: 'PROFESSIONAL_PLAYER' as UserRole,
      tenantId: 'tenant-martin-pro',
      tenantType: 'PRO_PLAYER',
      actionView: 'admin' as const,
      isWhiteLabelPlayer: false,
      title: 'Jugador Profesional (Marca Blanca)',
      badge: 'Martín Diestro (FIP Pro)',
      desc: 'Portfolio de marca personal: gestión de patrocinios, calendario de torneos FIP, exhibiciones y contacto.',
      icon: Trophy,
      color: 'from-rose-600 to-red-700',
    },
  ];

  const neutralPlayerEcosystem = [
    {
      id: 'player_neutral',
      role: 'PLAYER' as UserRole,
      actionView: 'player' as const,
      isWhiteLabelPlayer: false,
      title: 'Jugador Setmio Player (App Neutra B2C)',
      badge: 'Jugador Multi-Club',
      desc: 'Vista neutra oficial de Setmio (sin logos de clubes terceros): ELO global, ranking, reservas en red y partidos abiertos.',
      icon: User,
      color: 'from-cyan-600 to-emerald-600',
    },
  ];

  const platformEcosystem = [
    {
      id: 'superadmin',
      role: 'SUPERADMIN' as UserRole,
      actionView: 'hq' as const,
      isWhiteLabelPlayer: false,
      title: 'Superadministrador Setmio HQ',
      badge: 'Plataforma SaaS Global',
      desc: 'Facturación de la plataforma, suscripciones de clubes, aprovisionamiento de tenants y métricas globales.',
      icon: ShieldCheck,
      color: 'from-purple-600 to-indigo-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Cerrar simulador de roles"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matriz Oficial de Demos, Marcas y Roles</span>
          </div>
          <h2 id="role-modal-title" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Selecciona el Ecosistema y Rol a Probar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Experimenta el comportamiento dinámico de marcas blancas, accesos restringidos y la app neutra Setmio Player.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'all', label: 'Todos los Ecosistemas' },
            { id: 'club', label: 'Ecosistema Club Demo' },
            { id: 'independent', label: 'Marca Blanca Independiente' },
            { id: 'player', label: 'Setmio Player Neutra' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEcosystem(tab.id as typeof activeEcosystem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeEcosystem === tab.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECCIÓN 1: Ecosistema Club (Marca Blanca) */}
        {(activeEcosystem === 'all' || activeEcosystem === 'club') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-4 h-4" />
              <span>1. Ecosistema Club (Marca Blanca · Centro de Pádel San Mateo)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {clubEcosystem.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectDemo(item)}
                    className="group text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xs`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span>Entrar al demo</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SECCIÓN 2: Ecosistema Marca Blanca Profesional / Independiente */}
        {(activeEcosystem === 'all' || activeEcosystem === 'independent') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              <Layers className="w-4 h-4" />
              <span>2. Ecosistema Marca Blanca Profesional / Independiente</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {independentEcosystem.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectDemo(item)}
                    className="group text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xs`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                      <span>Entrar al demo</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SECCIÓN 3: Ecosistema Setmio Player (Neutra B2C) & Superadmin */}
        {(activeEcosystem === 'all' || activeEcosystem === 'player') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <Compass className="w-4 h-4" />
              <span>3. Ecosistema Setmio Player (B2C) & Superadministrador SaaS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {neutralPlayerEcosystem.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectDemo(item)}
                    className="group text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xs`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      <span>Probar App Neutra B2C</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}

              {platformEcosystem.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectDemo(item)}
                    className="group text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xs`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                      <span>Entrar al Superadmin HQ</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info note */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Cada perfil incluye datos precargados, navegación móvil con barra inferior native-like, módulo de pagos y preparación Veri*factu.
          </span>
        </div>
      </div>
    </div>
  );
};
