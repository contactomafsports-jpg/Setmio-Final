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
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoleModal?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onOpenRoleModal, initialMode = 'login' }) => {
  const { currentTenant, switchUserRole, triggerDemoToast, setCurrentView, t } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  useEffect(() => { if (isOpen) setMode(initialMode); }, [initialMode, isOpen]);
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [registrationRole, setRegistrationRole] = useState<'club' | 'school' | 'coach' | 'pro' | 'amateur' | null>(null);
  const registrationRoles = [
    { id: 'club', label: t('register.role.club', 'Club'), description: t('register.role.clubDescription', 'Gestiona pistas, socios y operaciones.') },
    { id: 'school', label: t('register.role.school', 'Escuela'), description: t('register.role.schoolDescription', 'Organiza clases, grupos y alumnos.') },
    { id: 'coach', label: t('register.role.coach', 'Profesor'), description: t('register.role.coachDescription', 'Impulsa tus clases y cobros.') },
    { id: 'pro', label: t('register.role.pro', 'Jugador Profesional'), description: t('register.role.proDescription', 'Centraliza calendario y oportunidades.') },
    { id: 'amateur', label: t('register.role.amateur', 'Jugador Amateur'), description: t('register.role.amateurDescription', 'Reserva, juega y mejora.') },
  ] as const;

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [playLevel, setPlayLevel] = useState(3.5);
  const [dominantHand, setDominantHand] = useState<'right' | 'left'>('right');
  const [preferredPosition, setPreferredPosition] = useState<'drive' | 'reves' | 'both'>('reves');
  const [isTeamCaptain, setIsTeamCaptain] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  const [loading, setLoading] = useState(false);

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
      'Autocompletado con Setmio Global ID',
      'Datos deportivos y credenciales federadas cargadas automáticamente.',
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
                play_level: playLevel,
                dominant_hand: dominantHand,
                preferred_position: preferredPosition,
                phone,
              },
            },
          });
          if (error) throw error;
          triggerDemoToast('Registro en Supabase', 'Cuenta creada con éxito. Perfil deportivo vinculado.', 'success');
        }
        onClose();
      } catch (err: unknown) {
        triggerDemoToast('Error de Autenticación', (err as Error)?.message || 'Fallo en la autenticación.', 'warning');
      } finally {
        setLoading(false);
      }
    } else {
      // Demo simulated login
      setTimeout(() => {
        setLoading(false);
        triggerDemoToast(
          mode === 'login' ? 'Bienvenido a Setmio' : 'Cuenta Creada Exitosamente',
          `Bienvenido a ${currentTenant.name}. Se ha iniciado sesión con tu perfil deportivo multirrol.`,
          'success'
        );
        switchUserRole('PLAYER');
        setCurrentView('player');
        onClose();
      }, 500);
    }
  };

  const getLevelLabel = (level: number) => {
    if (level < 2.5) return 'Iniciación (1.0 - 2.0)';
    if (level < 3.5) return 'Intermedio Bajo (2.5 - 3.0)';
    if (level < 4.5) return 'Intermedio Avanzado (3.5 - 4.0)';
    if (level < 5.5) return 'Competición (4.5 - 5.0)';
    return 'Alta Competición / Pro (5.5+)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xl mb-3 shadow-lg shadow-emerald-500/20">
            SM
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {mode === 'login' ? t('auth.titleLogin', 'Acceso Usuarios Setmio') : t('register.title', 'Crear cuenta Setmio')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {mode === 'login'
              ? t('auth.subtitleLogin', 'Accede a tus reservas, partidas abiertas, torneos y monedero')
              : t('register.subtitle', 'Asistente personalizado paso a paso para configurar tu perfil de juego')}
          </p>
        </div>

        {/* Quick Demo Logins Section */}
        {false && mode === 'login' && (
          <div className="mb-6 space-y-3">
            {/* Requirement 2: En /login, añade un botón "Entrar a la Demo" que abre un modal selector de roles */}
            <button
              type="button"
              onClick={() => {
                if (onOpenRoleModal) {
                  onClose();
                  onOpenRoleModal();
                } else {
                  triggerDemoToast('Selector de Roles', 'Selecciona el rol con el que deseas ingresar a la demo.', 'info');
                }
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Entrar a la Demo</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span>O entra directamente con un clic:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Demo 1-Clic</span>
              </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('PLAYER')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left font-semibold transition hover:scale-[1.02] shadow-sm flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <div className="text-slate-900 dark:text-white font-bold">Carlos (Socio)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Rol Jugador #SM-408</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('TENANT_ADMIN')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left font-semibold transition hover:scale-[1.02] shadow-sm flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <div>
                  <div className="text-slate-900 dark:text-white font-bold">Rosa (Gerente)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Administrador Club</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('COACH')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left font-semibold transition hover:scale-[1.02] shadow-sm flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <div>
                  <div className="text-slate-900 dark:text-white font-bold">Laura (Coach)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Entrenadora Pro</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('SUPERADMIN')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left font-semibold transition hover:scale-[1.02] shadow-sm flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div>
                  <div className="text-slate-900 dark:text-white font-bold">Superadmin HQ</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Control Global de Plataforma</div>
                </div>
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Step Indicator for Register Wizard */}
        {mode === 'register' && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className={registerStep >= 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                1. Cuenta
              </span>
              <span className={registerStep >= 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                2. Perfil Deportivo
              </span>
              <span className={registerStep >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                3. Preferencias
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className={`h-1.5 rounded-full ${registerStep >= 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
              <div className={`h-1.5 rounded-full ${registerStep >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
              <div className={`h-1.5 rounded-full ${registerStep >= 3 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
            </div>

            {/* Quick Autocomplete button */}
            {registerStep === 1 && (
              <button
                type="button"
                onClick={handleAutocompleteSetmioID}
                className="w-full mt-4 p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Autocompletar con Setmio Global ID</span>
              </button>
            )}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          {mode === 'login' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email o Usuario
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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Contraseña
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                {loading ? 'Iniciando sesión...' : 'Entrar a mi Cuenta'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {/* REGISTER STEP 1 */}
              {registerStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {!registrationRole ? <div className="space-y-3"><p className="text-sm font-black text-slate-900 dark:text-white">¿Cómo vas a usar Setmio?</p><p className="text-xs text-slate-500">Elige tu perfil para personalizar tu experiencia.</p><div className="grid gap-2 sm:grid-cols-2">{registrationRoles.map((role) => <button type="button" key={role.id} onClick={() => setRegistrationRole(role.id)} className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-800 dark:hover:bg-emerald-950/30"><span className="block text-sm font-black">{role.label}</span><span className="mt-1 block text-xs text-slate-500">{role.description}</span></button>)}</div></div> : (<div className="space-y-4"><div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">Perfil: {registrationRoles.find((role) => role.id === registrationRole)?.label}<button type="button" onClick={() => setRegistrationRole(null)} className="underline">Cambiar</button></div><div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Nombre y Apellidos
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Lucas Rey"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Correo Electrónico
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Teléfono Móvil
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!fullName || !email || !password) {
                        triggerDemoToast('Completa los campos', 'Por favor introduce nombre, email y contraseña.', 'warning');
                        return;
                      }
                      setRegisterStep(2);
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <span>Siguiente: Perfil Deportivo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  </div>)}
                </div>
              )}

              {/* REGISTER STEP 2: SPORTS PROFILE */}
              {registerStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Nivel de Juego Estimado
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
                        Mano Dominante
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDominantHand('right')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            dominantHand === 'right'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Diestro
                        </button>
                        <button
                          type="button"
                          onClick={() => setDominantHand('left')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            dominantHand === 'left'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Zurdo
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Posición Preferida
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => setPreferredPosition('drive')}
                          className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition ${
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
                          className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition ${
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
                          className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition ${
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

                  {/* Multi-role Option */}
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
                          <span>Habilitar perfil de Capitán de Equipo</span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                          Te permite inscribir y gestionar convocatorias para equipos del club.
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="w-1/3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterStep(3)}
                      className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <span>Siguiente: Confirmación</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* REGISTER STEP 3: PREFERENCES & CONFIRM */}
              {registerStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-xs">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Resumen de tu Ficha en {currentTenant.shortName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                      <div>Jugador: <strong>{fullName}</strong></div>
                      <div>Nivel: <strong>{playLevel.toFixed(2)}</strong></div>
                      <div>Posición: <strong>{preferredPosition.toUpperCase()}</strong></div>
                      <div>Mano: <strong>{dominantHand === 'right' ? 'Diestro' : 'Zurdo'}</strong></div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={notifyWhatsapp}
                        onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                        className="mt-0.5 rounded accent-emerald-500"
                      />
                      <span>Recibir alertas automáticas de partidos abiertos y convocatorias por WhatsApp.</span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        required
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 rounded accent-emerald-500"
                      />
                      <span>Acepto las políticas de uso de instalaciones y protección de datos del club.</span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(2)}
                      className="w-1/3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atr��s</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !acceptTerms}
                      className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                    >
                      {loading ? 'Creando Perfil...' : 'Confirmar y Activar Cuenta'}
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
              {t('auth.noAccount', '¿No tienes una cuenta aún?')} {' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegisterStep(1);
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {t('auth.registerFree', 'Regístrate gratis')}
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta creada?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
