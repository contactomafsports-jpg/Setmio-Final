import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Smartphone,
  MessageCircle,
  Mail,
  CheckCircle2,
  Save,
  Shield,
  Clock,
  Trophy,
  Users,
  CreditCard,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';

interface PlayerNotificationSettingsProps {
  onBack?: () => void;
}

export const PlayerNotificationSettings: React.FC<PlayerNotificationSettingsProps> = ({ onBack }) => {
  const { currentUser, currentTenant, triggerDemoToast } = useApp();

  const [channels, setChannels] = useState(() => {
    try {
      const saved = localStorage.getItem('setmio_player_notif_channels');
      return saved
        ? JSON.parse(saved)
        : {
            push: true,
            whatsapp: true,
            email: false,
          };
    } catch {
      return { push: true, whatsapp: true, email: false };
    }
  });

  const [alertTypes, setAlertTypes] = useState(() => {
    try {
      const saved = localStorage.getItem('setmio_player_notif_types');
      return saved
        ? JSON.parse(saved)
        : {
            matchEloMatches: true,
            bookingReminders: true,
            splitPaymentRequests: true,
            eloUpdates: true,
            tournamentsAndEvents: true,
          };
    } catch {
      return {
        matchEloMatches: true,
        bookingReminders: true,
        splitPaymentRequests: true,
        eloUpdates: true,
        tournamentsAndEvents: true,
      };
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('setmio_player_notif_channels', JSON.stringify(channels));
      localStorage.setItem('setmio_player_notif_types', JSON.stringify(alertTypes));
    } catch {
      // storage quota or private mode
    }
    setSavedSuccess(true);
    triggerDemoToast(
      'Preferencias Guardadas',
      'Tus canales de notificación han sido actualizados en tu perfil.',
      'success'
    );
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header con botón Volver */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Volver al perfil"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-500" />
              <span>Preferencias de Notificación</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configura por qué vías deseas que {currentTenant.name} te comunique convocatorias, reservas y avisos.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferencias guardadas</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SECCIÓN 1: Canales Preferidos de Recepción */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>Canales Preferidos de Recepción</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Selecciona al menos un canal para no perderte convocatorias de partidos y plazas libres.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Multicanal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Canal 1: App Push */}
            <label
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                channels.push
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <input
                  type="checkbox"
                  checked={channels.push}
                  onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                  Notificación Push (App)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Alertas instantáneas en pantalla en tu móvil y navegador.
                </span>
              </div>
            </label>

            {/* Canal 2: WhatsApp */}
            <label
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                channels.whatsapp
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <input
                  type="checkbox"
                  checked={channels.whatsapp}
                  onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                  WhatsApp Directo
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Avisos con enlace directo al móvil registrado (+34 644 55 66 77).
                </span>
              </div>
            </label>

            {/* Canal 3: Email */}
            <label
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                channels.email
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="checkbox"
                  checked={channels.email}
                  onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                  Correo Electrónico
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Comprobantes oficiales de reserva, recibos y resúmenes de torneo.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* SECCIÓN 2: Tipos de Notificaciones Específicas */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Tipos de Avisos que Deseo Recibir</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
              Personaliza exactamente qué eventos generan alertas automáticas en tus canales.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {/* Alerta 1 */}
            <div className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                    Convocatorias de Partidas Abiertas de mi Nivel ELO
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Avisarme cuando se publique una partida o falten plazas en partidos de mi rango ({currentUser.playLevel.toFixed(2)} ± 0.50).
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={alertTypes.matchEloMatches}
                onChange={(e) =>
                  setAlertTypes({ ...alertTypes, matchEloMatches: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
            </div>

            {/* Alerta 2 */}
            <div className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                    Recordatorios de Reservas y Partidos Programados
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Recibir aviso 24 horas y 2 horas antes de jugar con el PIN domótico de apertura de pista.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={alertTypes.bookingReminders}
                onChange={(e) =>
                  setAlertTypes({ ...alertTypes, bookingReminders: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
            </div>

            {/* Alerta 3 */}
            <div className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                    Solicitudes de Pago Compartido (Split 1/4)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Avisarme al instante si un compañero de pista me añade para abonar mi cuota individual.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={alertTypes.splitPaymentRequests}
                onChange={(e) =>
                  setAlertTypes({ ...alertTypes, splitPaymentRequests: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
            </div>

            {/* Alerta 4 */}
            <div className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                    Actualizaciones de Nivel ELO y Resultados
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Notificarme cuando se valide un partido y se recalculen mis estadísticas deportivas.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={alertTypes.eloUpdates}
                onChange={(e) =>
                  setAlertTypes({ ...alertTypes, eloUpdates: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
            </div>

            {/* Alerta 5 */}
            <div className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                    Torneos, Eventos y Ligas Oficiales del Club
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Apertura de inscripciones para competiciones y eventos sociales de {currentTenant.name}.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={alertTypes.tournamentsAndEvents}
                onChange={(e) =>
                  setAlertTypes({ ...alertTypes, tournamentsAndEvents: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            Tus datos de contacto están protegidos y sólo se usan para la operativa deportiva de {currentTenant.name}.
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Preferencias</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerNotificationSettings;
