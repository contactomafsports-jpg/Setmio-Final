import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/database';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  CheckCircle2,
  Trophy,
  Activity,
  Award,
  Building2,
  GraduationCap,
  Layers,
  Zap,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoleModal?: () => void;
  initialMode?: 'login' | 'register';
}

export type OnboardingRole = 'club_admin' | 'coach' | 'player';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenRoleModal,
  initialMode = 'login',
}) => {
  const { currentTenant, switchUserRole, triggerDemoToast, setCurrentView, t, currentLanguage } = useApp();
  void currentLanguage;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRole, setSelectedRole] = useState<OnboardingRole>('club_admin');
  const [urlPlan, setUrlPlan] = useState<string | null>(null);

  // Form Fields: Common Mandatory Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Role Specific: Club Admin
  const [clubName, setClubName] = useState('Pádel Club Central');
  const [courtCount, setCourtCount] = useState(4);
  const [clubCity, setClubCity] = useState('Madrid');
  const [selectedPlan, setSelectedPlan] = useState<'club_base' | 'profesional' | 'enterprise'>('profesional');
  const [needDomotica, setNeedDomotica] = useState(true);

  // Role Specific: Coach / Instructor
  const [coachType, setCoachType] = useState('Independiente / Autónomo');
  const [coachCertification, setCoachCertification] = useState('Monitor Nacional FEP');
  const [coachExperience, setCoachExperience] = useState('3 - 6 años');
  const [coachSpecialty, setCoachSpecialty] = useState('Competición y Perfeccionamiento');

  // Role Specific: Player / Member
  const [playLevel, setPlayLevel] = useState(3.5);
  const [dominantHand, setDominantHand] = useState<'right' | 'left'>('right');
  const [preferredPosition, setPreferredPosition] = useState<'drive' | 'reves' | 'both'>('reves');
  const [isTeamCaptain, setIsTeamCaptain] = useState(false);

  // Agreements
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setRegisterStep(1);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get('plan');
      if (planParam) {
        setUrlPlan(planParam);
        if (planParam === 'coach') {
          setSelectedRole('coach');
        } else {
          setSelectedRole('club_admin');
          if (planParam === 'club_base' || planParam === 'club') {
            setSelectedPlan('club_base');
          } else if (planParam === 'enterprise') {
            setSelectedPlan('enterprise');
          } else {
            setSelectedPlan('profesional');
          }
        }
      }
    }
  }, [isOpen, initialMode]);

  const handleClose = () => {
    onClose();
    if (mode === 'register') {
      if (typeof window !== 'undefined' && (window.location.pathname === '/registro' || window.location.pathname === '/register')) {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  const handleDemoLogin = (role: UserRole) => {
    switchUserRole(role);
    onClose();
    if (role === 'PLAYER') {
      setCurrentView('player');
    } else if (role === 'SUPERADMIN') {
      setCurrentView('hq');
    } else if (role === 'COACH') {
      setCurrentView('coach');
    } else {
      setCurrentView('admin');
    }
  };

  const handleAutocompleteSetmioID = () => {
    setFullName('Lucas Rey Domínguez');
    setEmail('lucas.rey@setmio.com');
    setPhone('+34 689 44 22 11');
    setPassword('Setmio2026!');
    setPlayLevel(4.25);
    setDominantHand('right');
    setPreferredPosition('drive');
    setIsTeamCaptain(true);
    triggerDemoToast(
      t('auth.autofill.title', 'Autocompletado con Setmio Global ID'),
      t('auth.autofill.desc', 'Datos deportivos y credenciales federadas cargadas automáticamente.'),
      'info'
    );
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        if (mode === 'login') {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          triggerDemoToast('Inicio de sesión Supabase', 'Sesión iniciada con éxito en el servidor.', 'success');
        } else {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                tenant_id: currentTenant.id,
                role: selectedRole === 'club_admin' ? 'ADMIN' : selectedRole === 'coach' ? 'COACH' : 'PLAYER',
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
          triggerDemoToast('Registro en Supabase', 'Cuenta creada con éxito. Perfil vinculado.', 'success');
        }
        handleClose();
      } catch (err: unknown) {
        triggerDemoToast('Error de Autenticación', (err as Error)?.message || 'Fallo en la autenticación.', 'warning');
      } finally {
        setLoading(false);
      }
    } else {
      // Simulation flow
      setTimeout(() => {
        setLoading(false);
        if (mode === 'login') {
          triggerDemoToast(
            'Bienvenido a Setmio',
            `Has iniciado sesión en ${currentTenant.name}.`,
            'success'
          );
        } else {
          // Assign role according to onboarding selection
          if (selectedRole === 'club_admin') {
            switchUserRole('TENANT_ADMIN');
            setCurrentView('admin');
            triggerDemoToast(
              t('register.toast.adminTitle', '¡Club Registrado con Éxito!'),
              t('register.toast.adminDesc', `Bienvenido a Setmio Pro. Has activado la gestión de ${clubName || 'tu club'}.`),
              'success'
            );
          } else if (selectedRole === 'coach') {
            switchUserRole('COACH');
            setCurrentView('coach');
            triggerDemoToast(
              t('register.toast.coachTitle', '¡Perfil de Entrenador Activado!'),
              t('register.toast.coachDesc', `Bienvenido ${fullName}. Ya puedes gestionar tus clases y alumnos.`),
              'success'
            );
          } else {
            switchUserRole('PLAYER');
            setCurrentView('player');
            triggerDemoToast(
              t('register.toast.playerTitle', '¡Perfil de Jugador Creado!'),
              t('register.toast.playerDesc', `Bienvenido ${fullName}. Ficha deportiva activada para reservas y partidos.`),
              'success'
            );
          }
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

  const roleConfigs = [
    {
      id: 'club_admin' as OnboardingRole,
      icon: Building2,
      title: t('register.roles.club_admin.title', 'Administrador de Club / Profesional'),
      desc: t('register.roles.club_admin.description', 'Gestión integral de pistas, reservas, domótica IoT, cobros y marca blanca.'),
      badge: t('register.roles.club_admin.badge', 'Gestión B2B'),
    },
    {
      id: 'coach' as OnboardingRole,
      icon: GraduationCap,
      title: t('register.roles.coach.title', 'Profesor / Entrenador de Pádel'),
      desc: t('register.roles.coach.description', 'Gestión de clases particulares, alumnos, grupos de academia y cuadrantes docentes.'),
      badge: t('register.roles.coach.badge', 'Docencia'),
    },
    {
      id: 'player' as OnboardingRole,
      icon: User,
      title: t('register.roles.player.title', 'Socio / Jugador / Cliente'),
      desc: t('register.roles.player.description', 'Reserva rápida de pistas, partidos abiertos Play!, monedero y nivel deportivo.'),
      badge: t('register.roles.player.badge', 'Jugador'),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto">
        <button
          aria-label={t('common.close', 'Cerrar')}
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xl mb-3 shadow-lg shadow-emerald-500/20">
            SM
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {mode === 'login' ? t('auth.titleLogin', 'Acceso Usuarios Setmio') : t('register.title', 'Registro y Onboarding por Rol')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {mode === 'login'
              ? t('auth.subtitleLogin', 'Accede a tus reservas, partidas abiertas, torneos y monedero')
              : t('register.subtitle', 'Configura tu cuenta y perfil especializado según tu función en el ecosistema del pádel.')}
          </p>

          {/* Stepper Indicator for Register Mode */}
          {mode === 'register' && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {[
                { step: 1, label: t('register.steps.role', '1. Rol') },
                { step: 2, label: t('register.steps.account', '2. Cuenta') },
                { step: 3, label: t('register.steps.profile', '3. Perfil') },
                { step: 4, label: t('register.steps.confirm', '4. Confirmar') },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                    registerStep === s.step
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : registerStep > s.step
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                  }`}
                >
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          {mode === 'login' ? (
            /* --- LOGIN MODE --- */
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t('auth.passwordLabel', 'Contraseña')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                  <span>{t('auth.rememberMe', 'Recordarme')}</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutocompleteSetmioID}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('auth.demoAutoFill', 'Auto-rellenar')}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {loading ? t('auth.loading', 'Iniciando sesión...') : t('auth.submit', 'Entrar a mi Cuenta')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* --- REGISTER MODE: ROLE-DIRECTED ONBOARDING --- */
            <>
              {/* STEP 1: SOLICITAR PRIMERO EL ROL */}
              {registerStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="text-left space-y-1">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {t('register.step1.title', '¿Cuál es tu rol principal en el pádel?')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('register.step1.desc', 'Adaptaremos el formulario y los permisos de la plataforma a tus necesidades.')}
                    </p>
                  </div>

                  {urlPlan && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>
                        {t('register.preselectedPlan', 'Plan preseleccionado:')} <strong>{urlPlan.toUpperCase()}</strong>
                      </span>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {roleConfigs.map((r) => {
                      const Icon = r.icon;
                      const isSelected = selectedRole === r.id;

                      return (
                        <button
                          type="button"
                          key={r.id}
                          onClick={() => setSelectedRole(r.id)}
                          className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-black text-slate-900 dark:text-white">
                                {r.title}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {r.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {r.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setRegisterStep(2)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>{t('register.nextAccount', 'Continuar con este Rol')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: CAMPOS OBLIGATORIOS SIEMPRE (EMAIL, TELÉFONO, NOMBRE, PASSWORD) */}
              {registerStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20">
                    <span>
                      {t('register.roleBadge', 'Rol seleccionado:')}{' '}
                      <strong>{roleConfigs.find((r) => r.id === selectedRole)?.title}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="underline hover:text-emerald-900 dark:hover:text-emerald-200 cursor-pointer"
                    >
                      {t('register.change', 'Cambiar')}
                    </button>
                  </div>

                  {/* Nombre y Apellidos */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      {t('register.fullName', 'Nombre y Apellidos / Responsable')} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t('register.fullNamePlaceholder', 'Ej. Lucas Rey Domínguez')}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Correo Electrónico (OBLIGATORIO SIEMPRE) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
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
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Teléfono Móvil (OBLIGATORIO SIEMPRE) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
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
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
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
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="w-1/3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer"
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
                      className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>{t('register.nextProfile', 'Siguiente: Perfil')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: DATOS ESPECÍFICOS SEGÚN EL ROL SELECCIONADO */}
              {registerStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {selectedRole === 'club_admin' && (
                    <div className="space-y-3.5 text-left">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                          {t('register.club.headerTitle', 'Datos de la Instalación Deportiva')}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {t('register.club.headerDesc', 'Configura tu centro deportivo para reservas y domótica.')}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          {t('register.club.name', 'Nombre del Club o Centro Deportivo')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={clubName}
                          onChange={(e) => setClubName(e.target.value)}
                          placeholder="Ej: Pádel Costa Verde"
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                            {t('register.club.courts', 'Nº de Pistas')}
                          </label>
                          <select
                            value={courtCount}
                            onChange={(e) => setCourtCount(parseInt(e.target.value))}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value={2}>2 pistas</option>
                            <option value={4}>4 pistas</option>
                            <option value={6}>6 pistas</option>
                            <option value={8}>8 pistas</option>
                            <option value={12}>12+ pistas</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                            {t('register.club.city', 'Ciudad / Ubicación')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={clubCity}
                            onChange={(e) => setClubCity(e.target.value)}
                            placeholder="Ej: A Coruña"
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          {t('register.club.plan', 'Plan de Suscripción Preseleccionado')}
                        </label>
                        <select
                          value={selectedPlan}
                          onChange={(e) => setSelectedPlan(e.target.value as any)}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="club_base">{t('register.plans.base', 'Plan Club Base (79 €/mes)')}</option>
                          <option value="profesional">{t('register.plans.pro', 'Plan Profesional Pro (149 €/mes - Recomendado)')}</option>
                          <option value="enterprise">{t('register.plans.enterprise', 'Plan Enterprise Personalizado')}</option>
                        </select>
                      </div>

                      <label className="flex items-start gap-2.5 cursor-pointer text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <input
                          type="checkbox"
                          checked={needDomotica}
                          onChange={(e) => setNeedDomotica(e.target.checked)}
                          className="mt-0.5 rounded accent-emerald-500"
                        />
                        <div className="text-[11px] text-slate-600 dark:text-slate-400">
                          <strong className="text-slate-900 dark:text-white block font-bold">
                            {t('register.club.domoticaTitle', 'Automatización Domótica IoT')}
                          </strong>
                          {t('register.club.domoticaDesc', 'Deseo integrar relés Shelly Pro para focos y cerraduras inteligentes Salto KS con PIN dinámico.')}
                        </div>
                      </label>
                    </div>
                  )}

                  {selectedRole === 'coach' && (
                    <div className="space-y-3.5 text-left">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                          {t('register.coach.headerTitle', 'Perfil Profesional del Entrenador')}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {t('register.coach.headerDesc', 'Información docente para tu cuadrante de clases y alumnos.')}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          {t('register.coach.type', 'Modalidad de Trabajo')}
                        </label>
                        <select
                          value={coachType}
                          onChange={(e) => setCoachType(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option>Independiente / Autónomo</option>
                          <option>En Plantilla de Club Deportivo</option>
                          <option>Director de Escuela de Pádel</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                            {t('register.coach.certification', 'Titulación Oficial')}
                          </label>
                          <select
                            value={coachCertification}
                            onChange={(e) => setCoachCertification(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option>Monitor Nacional FEP</option>
                            <option>Entrenador Regional FGP</option>
                            <option>Certificación RPT Pádel</option>
                            <option>Graduado en CAFYD / TAFAD</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                            {t('register.coach.experience', 'Experiencia')}
                          </label>
                          <select
                            value={coachExperience}
                            onChange={(e) => setCoachExperience(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option>1 - 3 años</option>
                            <option>3 - 6 años</option>
                            <option>Más de 6 años</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          {t('register.coach.specialty', 'Especialidad Principal')}
                        </label>
                        <select
                          value={coachSpecialty}
                          onChange={(e) => setCoachSpecialty(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option>Competición y Perfeccionamiento</option>
                          <option>Iniciación y Adultos</option>
                          <option>Menores y Cantera</option>
                          <option>Preparación Física y Biomecánica</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedRole === 'player' && (
                    <div className="space-y-3.5 text-left">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            {t('register.levelEstimated', 'Nivel de Juego Estimado')}
                          </label>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
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
                          className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <div className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          {getLevelLabel(playLevel)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            {t('register.dominantHand', 'Mano Dominante')}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setDominantHand('right')}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                dominantHand === 'right'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {t('register.rightHanded', 'Diestro')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDominantHand('left')}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                dominantHand === 'left'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {t('register.leftHanded', 'Zurdo')}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            {t('register.preferredPosition', 'Posición')}
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            <button
                              type="button"
                              onClick={() => setPreferredPosition('drive')}
                              className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                                preferredPosition === 'drive'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              Drive
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreferredPosition('reves')}
                              className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                                preferredPosition === 'reves'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              Revés
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreferredPosition('both')}
                              className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                                preferredPosition === 'both'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              Ambas
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isTeamCaptain}
                            onChange={(e) => setIsTeamCaptain(e.target.checked)}
                            className="mt-1 rounded accent-emerald-500"
                          />
                          <div className="text-xs">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-amber-500" />
                              <span>{t('register.captainTitle', 'Habilitar perfil de Capitán de Equipo')}</span>
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                              {t('register.captainDesc', 'Te permite inscribir y gestionar convocatorias para equipos del club.')}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(2)}
                      className="w-1/3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t('register.back', 'Atrás')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterStep(4)}
                      className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>{t('register.nextConfirm', 'Siguiente: Confirmación')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: RESUMEN DE LA FICHA & ACTIVACIÓN */}
              {registerStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-xs text-left">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{t('register.summaryTitle', 'Resumen de Registro')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px] pt-1">
                      <div>
                        {t('register.roleLabel', 'Rol:')}{' '}
                        <strong>{roleConfigs.find((r) => r.id === selectedRole)?.title}</strong>
                      </div>
                      <div>
                        {t('register.nameLabel', 'Nombre:')} <strong>{fullName}</strong>
                      </div>
                      <div>
                        {t('register.emailLabel', 'Email:')} <strong>{email}</strong>
                      </div>
                      <div>
                        {t('register.phoneLabel', 'Teléfono:')} <strong>{phone}</strong>
                      </div>

                      {selectedRole === 'club_admin' && (
                        <>
                          <div>
                            {t('register.clubLabel', 'Club:')} <strong>{clubName}</strong> ({courtCount} pistas)
                          </div>
                          <div>
                            {t('register.planLabel', 'Plan:')} <strong>{selectedPlan.toUpperCase()}</strong>
                          </div>
                        </>
                      )}

                      {selectedRole === 'coach' && (
                        <>
                          <div>
                            {t('register.certLabel', 'Titulación:')} <strong>{coachCertification}</strong>
                          </div>
                          <div>
                            {t('register.expLabel', 'Exp:')} <strong>{coachExperience}</strong>
                          </div>
                        </>
                      )}

                      {selectedRole === 'player' && (
                        <>
                          <div>
                            {t('register.levelLabel', 'Nivel:')} <strong>{playLevel.toFixed(2)}</strong>
                          </div>
                          <div>
                            {t('register.posLabel', 'Posición:')} <strong>{preferredPosition.toUpperCase()}</strong>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-1 text-left">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={notifyWhatsapp}
                        onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                        className="mt-0.5 rounded accent-emerald-500"
                      />
                      <span>{t('register.notifyWhatsapp', 'Recibir confirmaciones de reservas y alertas operativas por WhatsApp.')}</span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        required
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 rounded accent-emerald-500"
                      />
                      <span>{t('register.acceptTerms', 'Acepto los términos de servicio y la política de privacidad de Setmio.')}</span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(3)}
                      className="w-1/3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t('register.back', 'Atrás')}</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !acceptTerms}
                      className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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

        {/* Toggle Mode */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
          {mode === 'login' ? (
            <p>
              {t('auth.noAccount', '¿No tienes una cuenta aún?')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegisterStep(1);
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {t('auth.registerFree', 'Regístrate gratis')}
              </button>
            </p>
          ) : (
            <p>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
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
