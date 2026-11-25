import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  CheckCircle2,
  Trophy,
  Building2,
  GraduationCap,
  Users,
  Layers,
  Landmark,
  Award,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoleModal?: () => void;
  initialMode?: 'login' | 'register';
}

export type OnboardingRole = 'club_admin' | 'coach' | 'player';
export type EcosystemTrack = 'pro' | 'player';
export type ProProfileId =
  | 'club'
  | 'academy'
  | 'coach'
  | 'team'
  | 'organizer'
  | 'council'
  | 'pro_player';

interface ProProfileOption {
  id: ProProfileId;
  mappedRole: OnboardingRole;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const PRO_PROFILES: ProProfileOption[] = [
  {
    id: 'club',
    mappedRole: 'club_admin',
    icon: Building2,
    title: 'Club de Pádel',
    desc: 'Pistas, reservas, TPV, domótica y marca blanca.',
  },
  {
    id: 'academy',
    mappedRole: 'club_admin',
    icon: Users,
    title: 'Academia / Escuela',
    desc: 'Grupos, matrículas, profesores y evaluaciones.',
  },
  {
    id: 'coach',
    mappedRole: 'coach',
    icon: GraduationCap,
    title: 'Entrenador / Profesor',
    desc: 'Agenda particular, alumnos, bonos y cobros.',
  },
  {
    id: 'team',
    mappedRole: 'club_admin',
    icon: Trophy,
    title: 'Equipos',
    desc: 'Plantillas, convocatorias, actas y alineaciones.',
  },
  {
    id: 'organizer',
    mappedRole: 'club_admin',
    icon: Layers,
    title: 'Organizador / Federación',
    desc: 'Torneos, ligas multi-sede, cuadros y rankings.',
  },
  {
    id: 'council',
    mappedRole: 'club_admin',
    icon: Landmark,
    title: 'Ayuntamiento / Pública',
    desc: 'Instalación municipal, tarifas y empadronados.',
  },
  {
    id: 'pro_player',
    mappedRole: 'coach',
    icon: Award,
    title: 'Jugador Profesional',
    desc: 'Circuito, patrocinadores, clinics y marca propia.',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const {
    currentTenant,
    loginUser,
    switchUserRole,
    triggerDemoToast,
    setCurrentView,
    t,
    currentLanguage,
  } = useApp();
  void currentLanguage;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3 | 4>(1);
  const [ecosystemTrack, setEcosystemTrack] = useState<EcosystemTrack>('pro');
  const [selectedProProfile, setSelectedProProfile] = useState<ProProfileId>('club');
  const [selectedRole, setSelectedRole] = useState<OnboardingRole>('club_admin');
  const [urlPlan, setUrlPlan] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [clubName, setClubName] = useState('Pádel Club Central');
  const [courtCount, setCourtCount] = useState(4);
  const [clubCity, setClubCity] = useState('Madrid');
  const [selectedPlan, setSelectedPlan] = useState<'club_base' | 'profesional' | 'enterprise'>('profesional');
  const [needDomotica, setNeedDomotica] = useState(true);

  const [teamCategory, setTeamCategory] = useState('1ª Categoría / Liga Interclubes');
  const [organizerScope, setOrganizerScope] = useState('Circuito Autonómico / 4+ sedes');
  const [proCircuit, setProCircuit] = useState('Premier Padel / FIP');
  const [proRanking, setProRanking] = useState('Top 100 · Cuadro Final');

  const [coachType, setCoachType] = useState('Independiente / Autónomo');
  const [coachCertification, setCoachCertification] = useState('Monitor Nacional FEP');
  const [coachExperience, setCoachExperience] = useState('3 - 6 años');
  const [coachSpecialty, setCoachSpecialty] = useState('Competición y Perfeccionamiento');

  const [playLevel, setPlayLevel] = useState(3.5);
  const [dominantHand, setDominantHand] = useState<'right' | 'left'>('right');
  const [preferredPosition, setPreferredPosition] = useState<'drive' | 'reves' | 'both'>('reves');
  const [isTeamCaptain, setIsTeamCaptain] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setRegisterStep(1);
    setAuthError(null);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get('plan');
      if (planParam) {
        setUrlPlan(planParam);
        setEcosystemTrack('pro');
        if (planParam === 'coach') {
          setSelectedProProfile('coach');
          setSelectedRole('coach');
        } else {
          setSelectedProProfile('club');
          setSelectedRole('club_admin');
          if (planParam === 'club_base' || planParam === 'club' || planParam === 'esencial') {
            setSelectedPlan('club_base');
          } else if (planParam === 'enterprise' || planParam === 'pro') {
            setSelectedPlan('enterprise');
          } else {
            setSelectedPlan('profesional');
          }
        }
      }
    }
  }, [isOpen, initialMode]);

  const handleSelectTrack = (track: EcosystemTrack) => {
    setEcosystemTrack(track);
    if (track === 'player') {
      setSelectedRole('player');
    } else {
      const profile = PRO_PROFILES.find((p) => p.id === selectedProProfile) || PRO_PROFILES[0];
      setSelectedRole(profile.mappedRole);
    }
  };

  const handleSelectProProfile = (profile: ProProfileOption) => {
    setEcosystemTrack('pro');
    setSelectedProProfile(profile.id);
    setSelectedRole(profile.mappedRole);
  };

  const activeProOption =
    PRO_PROFILES.find((p) => p.id === selectedProProfile) || PRO_PROFILES[0];

  const activeRoleSummaryLabel =
    ecosystemTrack === 'player'
      ? 'Setmio Player · Jugador y Socio'
      : `Setmio Pro · ${activeProOption.title}`;

  const handleClose = () => {
    onClose();
    if (mode === 'register') {
      if (
        typeof window !== 'undefined' &&
        (window.location.pathname === '/registro' || window.location.pathname === '/register')
      ) {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  const handleAutocompleteDemoLogin = () => {
    setFullName('Jugador Demo');
    setEmail('demo.jugador@ejemplo.com');
    setPhone('+34 600 00 00 00');
    setPassword('Setmio2026!');
    setPlayLevel(4.25);
    setDominantHand('right');
    setPreferredPosition('drive');
    setIsTeamCaptain(true);
    triggerDemoToast(
      t('auth.autofill.title', 'Credenciales de prueba cargadas'),
      t('auth.autofill.desc', 'Datos de demostración listos para probar el acceso.'),
      'info'
    );
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    if (mode === 'login') {
      try {
        const result = await loginUser(email, password);
        if (!result.success) {
          setAuthError(result.error || 'Error de autenticación. Verifica tus credenciales.');
          return;
        }
        onClose();
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              tenant_id: currentTenant.id,
              role: selectedRole === 'club_admin' ? 'ADMIN' : selectedRole === 'coach' ? 'COACH' : 'PLAYER',
              ecosystem_track: ecosystemTrack,
              pro_profile: ecosystemTrack === 'pro' ? selectedProProfile : 'player',
              play_level: playLevel,
              dominant_hand: dominantHand,
              preferred_position: preferredPosition,
              phone,
              club_name: clubName,
              court_count: courtCount,
              plan: selectedPlan,
            },
          },
        });
        if (error) throw error;
        triggerDemoToast('Registro completado', 'Cuenta creada con éxito. Perfil vinculado.', 'success');
        handleClose();
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Fallo en el registro.';
        setAuthError(message);
        triggerDemoToast('Error de Autenticación', message, 'warning');
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        if (ecosystemTrack === 'player' || selectedRole === 'player') {
          switchUserRole('PLAYER');
          setCurrentView('player');
          triggerDemoToast(
            t('register.toast.playerTitle', 'Perfil Setmio Player Creado'),
            t('register.toast.playerDesc', `Bienvenido ${fullName}. Ficha deportiva activada para reservas y partidos.`),
            'success'
          );
        } else if (selectedRole === 'coach') {
          switchUserRole('COACH');
          setCurrentView('coach');
          triggerDemoToast(
            t('register.toast.coachTitle', 'Perfil Setmio Pro Activado'),
            t('register.toast.coachDesc', `Bienvenido ${fullName}. Entorno ${activeProOption.title} preparado.`),
            'success'
          );
        } else {
          switchUserRole('TENANT_ADMIN');
          setCurrentView('admin');
          triggerDemoToast(
            t('register.toast.adminTitle', 'Entorno Setmio Pro Activado'),
            t('register.toast.adminDesc', `Bienvenido a Setmio Pro. Has activado ${clubName || activeProOption.title}.`),
            'success'
          );
        }
        handleClose();
      }, 500);
    }
  };

  const getLevelLabel = (level: number) => {
    if (level < 2.5) return t('register.level.beginner', 'Iniciación (1.0 - 2.0)');
    if (level < 3.5) return t('register.level.intermediateLow', 'Intermedio Bajo (2.5 - 3.0)');
    if (level < 4.5) return t('register.level.intermediateHigh', 'Intermedio Avanzado (3.5 - 4.0)');
    if (level < 5.5) return t('register.level.competition', 'Competición (4.5 - 5.0)');
    return t('register.level.pro', 'Alta Competición / Pro (5.5+)');
  };

  const isFacilityProfile =
    selectedProProfile === 'club' ||
    selectedProProfile === 'academy' ||
    selectedProProfile === 'council';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#071220]/80 sm:p-4 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-xl bg-white dark:bg-[#0E2239] border-0 sm:border sm:border-slate-200/90 sm:dark:border-[#1A314D] rounded-none sm:rounded-2xl px-4 py-6 sm:p-7 text-[#0B1A2D] dark:text-white overflow-y-auto overscroll-contain animate-float-in"
      >
        <button
          type="button"
          aria-label={t('common.close', 'Cerrar')}
          onClick={handleClose}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5 pt-1">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] font-extrabold text-base tracking-tight mb-3 font-display">
            SM
          </div>
          <h3 className="text-xl font-extrabold text-[#0B1A2D] dark:text-white font-display">
            {mode === 'login' ? t('auth.titleLogin', 'Acceso Usuarios Setmio') : t('register.title', 'Registro y Alta por Rol')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
            {mode === 'login'
              ? t('auth.subtitleLogin', 'Accede a tus reservas, partidas abiertas, torneos y monedero')
              : t('register.subtitle', 'Configura paso a paso tu cuenta o entorno en Setmio según tu rol.')}
          </p>

          {mode === 'register' && (
            <div className="mt-4 grid grid-cols-4 gap-1.5 w-full">
              {[
                { step: 1, label: t('register.steps.role', '1. Rol') },
                { step: 2, label: t('register.steps.account', '2. Cuenta') },
                { step: 3, label: t('register.steps.profile', '3. Perfil') },
                { step: 4, label: t('register.steps.confirm', '4. Confirmar') },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`min-w-0 truncate text-center px-1.5 py-2 rounded-lg text-[10px] sm:text-[11px] font-mono font-semibold transition-colors motion-reduce:transition-none border ${
                    registerStep === s.step
                      ? 'bg-[#B7F229] text-[#0B1A2D] border-[#B7F229]'
                      : registerStep > s.step
                      ? 'bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] border-[#0B1A2D] dark:border-[#244163]'
                      : 'bg-[#F7F9FC] text-slate-500 border-slate-200/80 dark:bg-[#071220] dark:text-slate-400 dark:border-[#1A314D]'
                  }`}
                >
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-4">
          {authError && (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300"
            >
              {authError}
            </div>
          )}
          {mode === 'login' ? (
            <>
              <div>
                <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  {t('auth.emailLabel', 'Correo Electrónico')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder', 'tu-correo@ejemplo.com')}
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('auth.passwordLabel', 'Contraseña')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                  <input type="checkbox" defaultChecked className="rounded accent-[#0B1A2D]" />
                  <span>{t('auth.rememberMe', 'Recordarme')}</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutocompleteDemoLogin}
                  className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-slate-200 underline-offset-2 hover:underline transition-colors cursor-pointer"
                >
                  {t('auth.demoAutoFill', 'Autocompletar demo')}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] py-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? t('auth.loading', 'Iniciando sesión...') : t('auth.submit', 'Entrar a mi Cuenta')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {registerStep === 1 && (
                <div key="step-1" className="space-y-4 animate-float-in">
                  {urlPlan && (
                    <div className="p-2.5 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] border border-[#8B5CF6]/35 text-xs text-[#0B1A2D] dark:text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#A78BFA] shrink-0" />
                      <span>
                        {t('register.preselectedPlan', 'Plan preseleccionado:')}{' '}
                        <strong className="font-mono">{urlPlan.toUpperCase()}</strong>
                      </span>
                    </div>
                  )}

                  {/* Ecosystem Compact Selector: Setmio Pro vs Setmio Player */}
                  <div className="space-y-1.5 text-left">
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Elige tu ecosistema
                    </span>
                    <div
                      role="tablist"
                      aria-label="Seleccionar ecosistema de Setmio"
                      className="grid grid-cols-2 gap-2"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={ecosystemTrack === 'pro'}
                        onClick={() => handleSelectTrack('pro')}
                        className={`p-3 rounded-xl border text-left transition-colors motion-reduce:transition-none cursor-pointer ${
                          ecosystemTrack === 'pro'
                            ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                            : 'bg-[#F7F9FC] dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-200 border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50'
                        }`}
                      >
                        <div className="text-xs font-extrabold font-display leading-tight">
                          Setmio Pro
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 leading-snug ${
                            ecosystemTrack === 'pro'
                              ? 'text-slate-300 dark:text-[#0B1A2D]/80'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          Organizaciones y profesionales
                        </div>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={ecosystemTrack === 'player'}
                        onClick={() => handleSelectTrack('player')}
                        className={`p-3 rounded-xl border text-left transition-colors motion-reduce:transition-none cursor-pointer ${
                          ecosystemTrack === 'player'
                            ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                            : 'bg-[#F7F9FC] dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-200 border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50'
                        }`}
                      >
                        <div className="text-xs font-extrabold font-display leading-tight">
                          Setmio Player
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 leading-snug ${
                            ecosystemTrack === 'player'
                              ? 'text-slate-300 dark:text-[#0B1A2D]/80'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          Jugadores y socios
                        </div>
                      </button>
                    </div>
                  </div>

                  {ecosystemTrack === 'pro' ? (
                    <div className="space-y-2 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0B1A2D] dark:text-white font-display">
                          Selecciona tu perfil en Setmio Pro
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          7 perfiles
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {PRO_PROFILES.map((profile) => {
                          const Icon = profile.icon;
                          const isSelected = selectedProProfile === profile.id;
                          return (
                            <button
                              key={profile.id}
                              type="button"
                              onClick={() => handleSelectProProfile(profile)}
                              className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition-colors motion-reduce:transition-none flex items-start gap-2.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#F7F9FC] dark:bg-[#132A45] border-[#0B1A2D] dark:border-[#B7F229]'
                                  : 'bg-white dark:bg-[#071220] border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D]'
                                    : 'bg-[#F7F9FC] dark:bg-[#0E2239] text-[#0B1A2D] dark:text-slate-300 border border-slate-200/80 dark:border-[#1A314D]'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-[#0B1A2D] dark:text-white leading-snug truncate">
                                  {profile.title}
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug line-clamp-2">
                                  {profile.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] border border-[#0B1A2D]/25 dark:border-[#B7F229]/40 text-left space-y-2.5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] flex items-center justify-center shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-[#0B1A2D] dark:text-white font-display">
                            Cuenta Personal Setmio Player
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                            Reserva pistas en segundos, únete a partidos abiertos por nivel, consulta tus estadísticas y conéctate con tus clubes.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setRegisterStep(2)}
                    className="w-full min-h-[46px] py-3 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('register.nextAccount', 'Continuar con este Rol')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {registerStep === 2 && (
                <div key="step-2" className="space-y-4 animate-float-in">
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] px-3.5 py-2.5 text-xs font-semibold text-[#0B1A2D] dark:text-slate-200 border border-slate-200/90 dark:border-[#1A314D]">
                    <span className="truncate">
                      {t('register.roleBadge', 'Rol:')}{' '}
                      <strong>{activeRoleSummaryLabel}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="text-[#0B1A2D] dark:text-[#B7F229] font-bold hover:underline cursor-pointer shrink-0"
                    >
                      {t('register.change', 'Cambiar')}
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {t('register.fullName', 'Nombre y Apellidos / Responsable')} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t('register.fullNamePlaceholder', 'Ej. Nombre y apellidos')}
                        className="w-full min-h-[42px] pl-9 pr-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {t('register.email', 'Correo Electrónico (Obligatorio)')} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu-correo@ejemplo.com"
                        className="w-full min-h-[42px] pl-9 pr-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {t('register.phone', 'Teléfono de Contacto (Obligatorio)')} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+34 600 000 000"
                        className="w-full min-h-[42px] pl-9 pr-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {t('auth.passwordLabel', 'Contraseña')} *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('register.passwordMin', 'Mínimo 6 caracteres')}
                        className="w-full min-h-[42px] pl-9 pr-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="w-1/3 min-h-[44px] py-2.5 rounded-xl border border-slate-200/90 dark:border-[#1A314D] font-semibold text-xs text-[#0B1A2D] dark:text-slate-200 hover:bg-[#F7F9FC] dark:hover:bg-[#132A45] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t('register.back', 'Atrás')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
                          triggerDemoToast(
                            t('register.fillFields', 'Campos obligatorios incompletos'),
                            t('register.fillFieldsDesc', 'Por favor introduce tu nombre, correo electrónico, teléfono y contraseña.'),
                            'warning'
                          );
                          return;
                        }
                        setRegisterStep(3);
                      }}
                      className="w-2/3 min-h-[44px] py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t('register.nextProfile', 'Siguiente: Perfil')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {registerStep === 3 && (
                <div key="step-3" className="space-y-4 animate-float-in">
                  {ecosystemTrack === 'pro' && isFacilityProfile && (
                    <div className="space-y-3.5 text-left">
                      <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] text-xs">
                        <span className="font-bold text-[#0B1A2D] dark:text-white block mb-0.5">
                          {selectedProProfile === 'academy'
                            ? 'Datos de la Academia o Escuela'
                            : selectedProProfile === 'council'
                            ? 'Datos de la Instalación Municipal'
                            : t('register.club.headerTitle', 'Datos de la Instalación Deportiva')}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                          {t('register.club.headerDesc', 'Configura tu entorno para reservas, cobros y automatización.')}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          {selectedProProfile === 'academy'
                            ? 'Nombre de la Academia / Escuela'
                            : selectedProProfile === 'council'
                            ? 'Ayuntamiento o Patronato Deportivo'
                            : t('register.club.name', 'Nombre del Club o Centro Deportivo')}{' '}
                          *
                        </label>
                        <input
                          type="text"
                          required
                          value={clubName}
                          onChange={(e) => setClubName(e.target.value)}
                          placeholder="Ej: Pádel Costa Verde"
                          className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            {t('register.club.courts', 'Nº de Pistas')}
                          </label>
                          <select
                            value={courtCount}
                            onChange={(e) => setCourtCount(parseInt(e.target.value))}
                            className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                          >
                            <option value={2}>2 pistas</option>
                            <option value={4}>4 pistas</option>
                            <option value={6}>6 pistas</option>
                            <option value={8}>8 pistas</option>
                            <option value={12}>12+ pistas</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            {t('register.club.city', 'Ciudad')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={clubCity}
                            onChange={(e) => setClubCity(e.target.value)}
                            placeholder="Ej: A Coruña"
                            className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          {t('register.club.plan', 'Plan de Suscripción')}
                        </label>
                        <select
                          value={selectedPlan}
                          onChange={(e) => setSelectedPlan(e.target.value as typeof selectedPlan)}
                          className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                        >
                          <option value="club_base">Plan Esencial (desde 79 €/mes + instalación inicial)</option>
                          <option value="profesional">Plan Club &amp; Academia (desde 149 €/mes + instalación inicial)</option>
                          <option value="enterprise">Plan Pro 360 / A Medida (desde 249 €/mes + instalación inicial)</option>
                        </select>
                      </div>

                      <label className="flex items-start gap-2.5 cursor-pointer text-xs p-3 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D]">
                        <input
                          type="checkbox"
                          checked={needDomotica}
                          onChange={(e) => setNeedDomotica(e.target.checked)}
                          className="mt-0.5 rounded accent-[#0B1A2D]"
                        />
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          <strong className="text-[#0B1A2D] dark:text-white block font-bold">
                            {t('register.club.domoticaTitle', 'Automatización Domótica IoT')}
                          </strong>
                          {t('register.club.domoticaDesc', 'Integrar relés Shelly Pro para focos y cerraduras inteligentes con PIN dinámico.')}
                        </div>
                      </label>
                    </div>
                  )}

                  {ecosystemTrack === 'pro' && (selectedProProfile === 'team' || selectedProProfile === 'organizer') && (
                    <div className="space-y-3.5 text-left">
                      <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] text-xs">
                        <span className="font-bold text-[#0B1A2D] dark:text-white block mb-0.5">
                          {selectedProProfile === 'team'
                            ? 'Configuración de Equipo y Competición'
                            : 'Configuración de Circuito o Federación'}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                          {selectedProProfile === 'team'
                            ? 'Centraliza convocatorias, actas de jornada, alineaciones y cuotas de plantilla.'
                            : 'Gestiona torneos, ligas multi-sede, licencias y cuadros oficiales.'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          {selectedProProfile === 'team' ? 'Nombre del Equipo' : 'Nombre del Circuito / Federación'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={clubName}
                          onChange={(e) => setClubName(e.target.value)}
                          placeholder={selectedProProfile === 'team' ? 'Ej: Equipo Masculino 1ª' : 'Ej: Circuito Regional de Pádel'}
                          className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            {selectedProProfile === 'team' ? 'Categoría' : 'Alcance'}
                          </label>
                          <input
                            type="text"
                            value={selectedProProfile === 'team' ? teamCategory : organizerScope}
                            onChange={(e) =>
                              selectedProProfile === 'team'
                                ? setTeamCategory(e.target.value)
                                : setOrganizerScope(e.target.value)
                            }
                            className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Ciudad / Ámbito *
                          </label>
                          <input
                            type="text"
                            required
                            value={clubCity}
                            onChange={(e) => setClubCity(e.target.value)}
                            className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Plan de Suscripción
                        </label>
                        <select
                          value={selectedPlan}
                          onChange={(e) => setSelectedPlan(e.target.value as typeof selectedPlan)}
                          className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                        >
                          <option value="club_base">Plan Esencial (desde 79 €/mes + instalación inicial)</option>
                          <option value="profesional">Plan Club &amp; Academia (desde 149 €/mes + instalación inicial)</option>
                          <option value="enterprise">Plan Pro 360 / A Medida (desde 249 €/mes + instalación inicial)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {ecosystemTrack === 'pro' && selectedProProfile === 'coach' && (
                    <div className="space-y-3.5 text-left">
                      <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] text-xs">
                        <span className="font-bold text-[#0B1A2D] dark:text-white block mb-0.5">
                          {t('register.coach.headerTitle', 'Perfil Profesional del Entrenador')}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                          {t('register.coach.headerDesc', 'Información docente para tu cuadrante de clases y alumnos.')}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          {t('register.coach.type', 'Modalidad de Trabajo')}
                        </label>
                        <select
                          value={coachType}
                          onChange={(e) => setCoachType(e.target.value)}
                          className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                        >
                          <option>Independiente / Autónomo</option>
                          <option>En Plantilla de Club Deportivo</option>
                          <option>Director de Escuela de Pádel</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            {t('register.coach.certification', 'Titulación Oficial')}
                          </label>
                          <select
                            value={coachCertification}
                            onChange={(e) => setCoachCertification(e.target.value)}
                            className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                          >
                            <option>Monitor Nacional FEP</option>
                            <option>Entrenador Regional FGP</option>
                            <option>Certificación RPT Pádel</option>
                            <option>Graduado en CAFYD / TAFAD</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            {t('register.coach.experience', 'Experiencia')}
                          </label>
                          <select
                            value={coachExperience}
                            onChange={(e) => setCoachExperience(e.target.value)}
                            className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                          >
                            <option>1 - 3 años</option>
                            <option>3 - 6 años</option>
                            <option>Más de 6 años</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          {t('register.coach.specialty', 'Especialidad Principal')}
                        </label>
                        <select
                          value={coachSpecialty}
                          onChange={(e) => setCoachSpecialty(e.target.value)}
                          className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                        >
                          <option>Competición y Perfeccionamiento</option>
                          <option>Iniciación y Adultos</option>
                          <option>Menores y Cantera</option>
                          <option>Preparación Física y Biomecánica</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {ecosystemTrack === 'pro' && selectedProProfile === 'pro_player' && (
                    <div className="space-y-3.5 text-left">
                      <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] text-xs">
                        <span className="font-bold text-[#0B1A2D] dark:text-white block mb-0.5">
                          Entorno Profesional del Jugador
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                          Calendario de circuito, acuerdos comerciales, clinics privados y web de marca personal.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Circuito Principal
                          </label>
                          <select
                            value={proCircuit}
                            onChange={(e) => setProCircuit(e.target.value)}
                            className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                          >
                            <option>Premier Padel / FIP</option>
                            <option>FIP Tour / A1 Padel</option>
                            <option>Circuito Nacional Absoluto</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Categoría / Ranking
                          </label>
                          <input
                            type="text"
                            value={proRanking}
                            onChange={(e) => setProRanking(e.target.value)}
                            className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Ciudad Base
                        </label>
                        <input
                          type="text"
                          value={clubCity}
                          onChange={(e) => setClubCity(e.target.value)}
                          className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                        />
                      </div>
                    </div>
                  )}

                  {ecosystemTrack === 'player' && (
                    <div className="space-y-3.5 text-left">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                            {t('register.levelEstimated', 'Nivel de Juego Estimado')}
                          </label>
                          <span className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229] text-sm">
                            {playLevel.toFixed(2)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="7.0"
                          step="0.25"
                          value={playLevel}
                          onChange={(e) => setPlayLevel(parseFloat(e.target.value))}
                          className="w-full accent-[#0B1A2D] dark:accent-[#B7F229] h-2 bg-slate-200 dark:bg-[#071220] rounded-lg cursor-pointer"
                        />
                        <div className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          {getLevelLabel(playLevel)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            {t('register.dominantHand', 'Mano Dominante')}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setDominantHand('right')}
                              className={`min-h-[40px] py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                dominantHand === 'right'
                                  ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D]'
                                  : 'border-slate-200/90 dark:border-[#1A314D] text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {t('register.rightHanded', 'Diestro')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDominantHand('left')}
                              className={`min-h-[40px] py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                dominantHand === 'left'
                                  ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D]'
                                  : 'border-slate-200/90 dark:border-[#1A314D] text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {t('register.leftHanded', 'Zurdo')}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            {t('register.preferredPosition', 'Posición')}
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {(['drive', 'reves', 'both'] as const).map((pos) => (
                              <button
                                key={pos}
                                type="button"
                                onClick={() => setPreferredPosition(pos)}
                                className={`min-h-[40px] py-2 px-1 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer ${
                                  preferredPosition === pos
                                    ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D]'
                                    : 'border-slate-200/90 dark:border-[#1A314D] text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {pos === 'drive' ? 'Drive' : pos === 'reves' ? 'Revés' : 'Ambas'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D]">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isTeamCaptain}
                            onChange={(e) => setIsTeamCaptain(e.target.checked)}
                            className="mt-1 rounded accent-[#0B1A2D]"
                          />
                          <div className="text-xs">
                            <div className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                              <span>{t('register.captainTitle', 'Habilitar perfil de Capitán de Equipo')}</span>
                            </div>
                            <div className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                              {t('register.captainDesc', 'Te permite inscribir y gestionar convocatorias para equipos del club.')}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(2)}
                      className="w-1/3 min-h-[44px] py-2.5 rounded-xl border border-slate-200/90 dark:border-[#1A314D] font-semibold text-xs text-[#0B1A2D] dark:text-slate-200 hover:bg-[#F7F9FC] dark:hover:bg-[#132A45] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t('register.back', 'Atrás')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterStep(4)}
                      className="w-2/3 min-h-[44px] py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t('register.nextConfirm', 'Siguiente: Confirmación')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {registerStep === 4 && (
                <div key="step-4" className="space-y-4 animate-float-in">
                  <div className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] space-y-2.5 text-xs text-left">
                    <div className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                      <span>{t('register.summaryTitle', 'Resumen de Registro')}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-[11px] pt-1">
                      <div className="truncate">
                        {t('register.roleLabel', 'Perfil:')}{' '}
                        <strong className="text-[#0B1A2D] dark:text-white">{activeRoleSummaryLabel}</strong>
                      </div>
                      <div className="truncate">
                        {t('register.nameLabel', 'Nombre:')} <strong className="text-[#0B1A2D] dark:text-white">{fullName}</strong>
                      </div>
                      <div className="truncate">
                        {t('register.emailLabel', 'Email:')} <strong className="text-[#0B1A2D] dark:text-white">{email}</strong>
                      </div>
                      <div className="truncate">
                        {t('register.phoneLabel', 'Teléfono:')} <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">{phone}</strong>
                      </div>

                      {ecosystemTrack === 'pro' && isFacilityProfile && (
                        <>
                          <div className="truncate">
                            Entidad: <strong className="text-[#0B1A2D] dark:text-white">{clubName}</strong> ({courtCount} pistas)
                          </div>
                          <div className="truncate">
                            {t('register.planLabel', 'Plan:')} <strong className="font-mono text-[#0B1A2D] dark:text-[#B7F229]">{selectedPlan.toUpperCase()}</strong>
                          </div>
                        </>
                      )}

                      {ecosystemTrack === 'pro' && (selectedProProfile === 'team' || selectedProProfile === 'organizer') && (
                        <>
                          <div className="truncate">
                            Entidad: <strong className="text-[#0B1A2D] dark:text-white">{clubName}</strong>
                          </div>
                          <div className="truncate">
                            Ámbito: <strong className="text-[#0B1A2D] dark:text-white">{clubCity}</strong>
                          </div>
                        </>
                      )}

                      {ecosystemTrack === 'pro' && selectedProProfile === 'coach' && (
                        <>
                          <div className="truncate">
                            {t('register.certLabel', 'Titulación:')} <strong className="text-[#0B1A2D] dark:text-white">{coachCertification}</strong>
                          </div>
                          <div className="truncate">
                            {t('register.expLabel', 'Exp:')} <strong className="text-[#0B1A2D] dark:text-white">{coachExperience}</strong>
                          </div>
                        </>
                      )}

                      {ecosystemTrack === 'pro' && selectedProProfile === 'pro_player' && (
                        <>
                          <div className="truncate">
                            Circuito: <strong className="text-[#0B1A2D] dark:text-white">{proCircuit}</strong>
                          </div>
                          <div className="truncate">
                            Categoría: <strong className="text-[#0B1A2D] dark:text-white">{proRanking}</strong>
                          </div>
                        </>
                      )}

                      {ecosystemTrack === 'player' && (
                        <>
                          <div>
                            {t('register.levelLabel', 'Nivel:')} <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">{playLevel.toFixed(2)}</strong>
                          </div>
                          <div>
                            {t('register.posLabel', 'Posición:')} <strong className="font-mono text-[#0B1A2D] dark:text-white">{preferredPosition.toUpperCase()}</strong>
                          </div>
                        </>
                      )}
                    </div>

                    {ecosystemTrack === 'pro' && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-[#1A314D] leading-relaxed">
                        Las suscripciones profesionales incluyen puesta en marcha asistida con coste único de instalación inicial.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-1 text-left">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={notifyWhatsapp}
                        onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                        className="mt-0.5 rounded accent-[#0B1A2D]"
                      />
                      <span>{t('register.notifyWhatsapp', 'Recibir confirmaciones de reservas y alertas operativas por WhatsApp.')}</span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        required
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 rounded accent-[#0B1A2D]"
                      />
                      <span>{t('register.acceptTerms', 'Acepto los términos de servicio y la política de privacidad de Setmio.')}</span>
                    </label>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(3)}
                      className="w-1/3 min-h-[44px] py-2.5 rounded-xl border border-slate-200/90 dark:border-[#1A314D] font-semibold text-xs text-[#0B1A2D] dark:text-slate-200 hover:bg-[#F7F9FC] dark:hover:bg-[#132A45] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t('register.back', 'Atrás')}</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !acceptTerms}
                      className="w-2/3 min-h-[44px] py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {loading ? t('register.submitting', 'Activando Cuenta...') : t('register.submitConfirm', 'Confirmar y Activar Cuenta')}
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-[#1A314D] text-center text-xs text-slate-600 dark:text-slate-300">
          {mode === 'login' ? (
            <p>
              {t('auth.noAccount', '¿No tienes una cuenta aún?')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegisterStep(1);
                }}
                className="font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:underline cursor-pointer"
              >
                {t('auth.registerAction', 'Regístrate')}
              </button>
            </p>
          ) : (
            <p>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:underline cursor-pointer"
              >
                {t('register.already_account', '¿Ya tienes una cuenta? Iniciar Sesión')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
