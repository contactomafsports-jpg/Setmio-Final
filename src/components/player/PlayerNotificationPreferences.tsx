import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Smartphone,
  MessageCircle,
  Mail,
  CheckCircle2,
  Save,
  Moon,
  Clock,
  Trophy,
  Calendar,
  Wallet,
  Tag,
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

interface PlayerNotificationPreferencesProps {
  onBack?: () => void;
}

export const PlayerNotificationPreferences: React.FC<PlayerNotificationPreferencesProps> = ({
  onBack,
}) => {
  const { currentUser, currentTenant, triggerDemoToast } = useApp();

  // Canales de Recepción
  const [channels, setChannels] = useState({
    push: true,
    whatsapp: true,
    email: false,
  });

  // Preferencias Granulares
  const [preferences, setPreferences] = useState({
    levelMatches: true,
    bookingReminders: true,
    tournaments: true,
    academyMessages: true,
    walletAlerts: true,
    shopPromos: false,
  });

  // Horario Silencioso
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState('23:00');
  const [quietEnd, setQuietEnd] = useState('08:30');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Preferencias Actualizadas',
      'Tus canales de notificación y filtros de avisos se han guardado con éxito.',
      'success'
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 pb-12 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Volver"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
          )}
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>{currentTenant.name} · Área del Jugador</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Preferencias de Notificaciones
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Guardar</span>
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Elige por qué canales deseas recibir convocatorias de partidas, avisos de reservas y comunicaciones del club. Tus datos se tratan de forma privada bajo normativa europea.
      </p>

      {/* 1. Selector de Canales Principales */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-500" />
          <span>Tus Canales Preferidos de Recepción</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Push App */}
          <div
            onClick={() => setChannels({ ...channels, push: !channels.push })}
            className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
              channels.push
                ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-2xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${channels.push ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Push en App Móvil</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Avisos instantáneos en la app de Setmio y navegador.
              </p>
            </div>
            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {channels.push ? 'Recomendado (Activo)' : 'Desactivado'}
            </div>
          </div>

          {/* WhatsApp */}
          <div
            onClick={() => setChannels({ ...channels, whatsapp: !channels.whatsapp })}
            className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
              channels.whatsapp
                ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-2xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${channels.whatsapp ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">WhatsApp Directo</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Convocatorias oficiales al móvil registrado.
              </p>
            </div>
            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {channels.whatsapp ? '+34 611 22 33 44 (Activo)' : 'Desactivado'}
            </div>
          </div>

          {/* Email */}
          <div
            onClick={() => setChannels({ ...channels, email: !channels.email })}
            className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
              channels.email
                ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-2xs">
                <Mail className="w-4 h-4" />
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${channels.email ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Correo Electrónico</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Recibos de pago y extractos de reservas.
              </p>
            </div>
            <div className="text-[10px] font-bold text-slate-500">
              {channels.email ? `${currentUser.email || 'carlos@padel.es'}` : 'Desactivado'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tipos de Notificaciones a Recibir */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Tipos de Avisos que Deseo Recibir</span>
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {/* Convocatorias de mi nivel */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Partidas abiertas de mi nivel Play!
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Avisos inmediatos cuando se abre una plaza en partidas de nivel afín a tu rating.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.levelMatches}
                onChange={(e) =>
                  setPreferences({ ...preferences, levelMatches: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Recordatorios de reservas */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Recordatorios de reservas (2h antes)
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Aviso con tu pista asignada y previsión meteorológica antes de saltar a la cancha.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.bookingReminders}
                onChange={(e) =>
                  setPreferences({ ...preferences, bookingReminders: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Torneos y competiciones */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Torneos y ligas del club
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Apertura de inscripciones para torneos federados, open y ligas sociales.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.tournaments}
                onChange={(e) =>
                  setPreferences({ ...preferences, tournaments: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Escuela y clases particulares */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Clases y avisos de entrenadores
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Mensajes de tus profesores, cambios de horario o plazas libres en grupos técnicos.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.academyMessages}
                onChange={(e) =>
                  setPreferences({ ...preferences, academyMessages: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Saldo monedero */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Movimientos de saldo monedero
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Avisos de recarga completada, devoluciones y bonificaciones de fidelidad.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.walletAlerts}
                onChange={(e) =>
                  setPreferences({ ...preferences, walletAlerts: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Promociones y tienda */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  Ofertas Pro Shop y descuentos exclusivos
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Promociones en palas oficiales, accesorios y textil con descuento de socio.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.shopPromos}
                onChange={(e) =>
                  setPreferences({ ...preferences, shopPromos: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. Modo Silencioso / No Molestar */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Horario No Molestar
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pausa el envío de avisos y llamadas WhatsApp en horario nocturno.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={quietHoursEnabled}
              onChange={(e) => setQuietHoursEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>

        {quietHoursEnabled && (
          <div className="flex items-center gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">Desde:</span>
              <input
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">Hasta:</span>
              <input
                type="time"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {/* Botón Guardar Inferior */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Mis Preferencias de Notificación</span>
        </button>
      </div>
    </div>
  );
};

export default PlayerNotificationPreferences;
