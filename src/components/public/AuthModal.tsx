import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/database';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentTenant, switchUserRole, triggerDemoToast, setCurrentView } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = (role: UserRole) => {
    switchUserRole(role);
    onClose();
    if (role === 'PLAYER') {
      setCurrentView('player');
    } else if (role === 'SUPERADMIN') {
      setCurrentView('hq');
    } else {
      setCurrentView('admin');
    }
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
            options: { data: { full_name: fullName, tenant_id: currentTenant.id } },
          });
          if (error) throw error;
          triggerDemoToast('Registro en Supabase', 'Cuenta creada. Revisa tu correo de confirmación.', 'success');
        }
        onClose();
      } catch (err: unknown) {
        triggerDemoToast('Error de Autenticación', (err as Error)?.message || 'Fallo en la autenticación con Supabase.', 'warning');
      } finally {
        setLoading(false);
      }
    } else {
      // Demo simulated login
      setTimeout(() => {
        setLoading(false);
        triggerDemoToast(
          'Autenticación en Modo Demostración',
          `Bienvenido a ${currentTenant.name}. Se ha iniciado sesión como socio jugador simulado.`,
          'success'
        );
        switchUserRole('PLAYER');
        setCurrentView('player');
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xl mb-3 shadow-lg shadow-emerald-950/60">
            SM
          </div>
          <h3 className="text-lg font-bold text-white">
            {mode === 'login' ? `Acceso a ${currentTenant.shortName}` : 'Crear Cuenta de Jugador'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Gestiona tus reservas, consulta tus partidos y progreso'
              : 'Únete al club y reserva pistas con tarifas preferentes'}
          </p>
        </div>

        {/* Demo Fast Logins Pills */}
        <div className="mb-5 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acceso Rápido por Perfil (Modo Demo):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('PLAYER')}
              className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-medium text-left transition truncate"
            >
              🎾 Jugador Socio
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('TENANT_OWNER')}
              className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-medium text-left transition truncate"
            >
              👑 Propietario Club
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('RECEPTION')}
              className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 font-medium text-left transition truncate"
            >
              📋 Recepción & Pistas
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('SUPERADMIN')}
              className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-400 font-medium text-left transition truncate"
            >
              ⚡ Superadmin HQ
            </button>
          </div>
        </div>

        {/* Custom Email Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Carlos Méndez"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jugador@email.es"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 flex items-center justify-center gap-2 shadow-lg transition"
          >
            <span>{loading ? 'Procesando...' : mode === 'login' ? 'Entrar a Mi Espacio' : 'Registrarme'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <div>
              ¿Aún no tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Regístrate gratis
              </button>
            </div>
          ) : (
            <div>
              ¿Ya estás registrado?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Inicia sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
