import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SmartCourtDevice } from '../../types/database';
import {
  Zap,
  Lock,
  Plus,
  RefreshCw,
  Power,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';

export const AdminSmartCourts: React.FC = () => {
  const {
    currentTenant,
    courts,
    smartDevices,
    toggleSmartRelay,
    generateAccessPin,
    auditLogs,
    triggerDemoToast,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'light_relay' | 'pin_pad_lock'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New adapter form
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newProvider, setNewProvider] = useState<'Shelly Cloud Pro' | 'Salto KS Cloud' | 'Sonoff IoT' | 'Tuya Pro'>('Shelly Cloud Pro');
  const [newCourtId, setNewCourtId] = useState(courts[0]?.id || 'court-1');

  const filteredDevices = smartDevices.filter((d) => {
    if (filterType === 'light_relay') return d.deviceType === 'light_relay';
    if (filterType === 'pin_pad_lock') return d.deviceType === 'pin_pad_lock';
    return true;
  });

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Adaptador IoT Registrado',
      `Dispositivo "${newDeviceName}" vinculado a la pista mediante el gateway de ${newProvider}.`,
      'success'
    );
    setShowAddModal(false);
    setNewDeviceName('');
  };

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Automatización de Instalaciones · Arquitectura IoT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Pistas Inteligentes & Control de Acceso
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Sincronización automatizada entre las reservas del club y el encendido de iluminación LED, generación de códigos PIN temporales y climatización.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Adaptador IoT</span>
        </button>
      </div>

      {/* Integration Info Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 text-xs text-amber-950 dark:text-slate-300 space-y-1.5 shadow-sm">
        <div className="font-bold text-amber-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Seguridad Fail-Safe y Protocolo de Iluminación</span>
        </div>
        <p className="text-amber-900/80 dark:text-slate-400 leading-relaxed text-[11px]">
          Los relés Shelly Pro y las cerraduras Salto KS operan en modo local autónomo si se interrumpe la conexión a internet. Los focos se encienden 5 minutos antes de la hora fijada y se apagan con 10 minutos de cortesía tras concluir el partido.
        </p>
      </div>

      {/* Devices Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Dispositivos Vinculados a Pistas</h3>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterType === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos ({smartDevices.length})
            </button>
            <button
              onClick={() => setFilterType('light_relay')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterType === 'light_relay'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Luces
            </button>
            <button
              onClick={() => setFilterType('pin_pad_lock')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterType === 'pin_pad_lock'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cerraduras PIN
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((dev) => (
            <div
              key={dev.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between space-y-4 shadow-sm transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{dev.courtName}</span>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {dev.status === 'connected_demo' ? 'Conectado Demo' : 'Online'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {dev.deviceType === 'light_relay' ? (
                      <Zap className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-cyan-500" />
                    )}
                    <span className="truncate">{dev.name}</span>
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Proveedor: <span className="text-slate-800 dark:text-slate-200 font-semibold">{dev.provider}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: {dev.ipOrCloudId}</div>
                </div>

                {dev.deviceType === 'pin_pad_lock' && dev.currentAccessPin && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">PIN Activo Actual:</span>
                    <span className="font-mono text-base font-black text-cyan-600 dark:text-cyan-400">
                      {dev.currentAccessPin}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{dev.lastSync}</span>

                {dev.deviceType === 'light_relay' ? (
                  <button
                    onClick={() => toggleSmartRelay(dev.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 ${
                      dev.relayState
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{dev.relayState ? 'Encendido (ON)' : 'Apagado (OFF)'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => generateAccessPin(dev.id)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm shadow-cyan-600/20"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Regenerar PIN</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IoT Events Log */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Registro de Eventos de Automatización</span>
        </h3>

        <div className="space-y-2 text-xs">
          {auditLogs
            .filter((l) => l.action.includes('Luces') || l.action.includes('PIN') || l.action.includes('Automatización'))
            .slice(0, 4)
            .map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px]"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{log.action}: </span>
                  <span className="text-slate-700 dark:text-slate-300">{log.details}</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-mono shrink-0 pl-3">{log.timestamp}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">Añadir Nuevo Adaptador de Pista</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Configuración de hardware IoT para {currentTenant.shortName}</p>

            <form onSubmit={handleAddDeviceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Nombre del Dispositivo</label>
                <input
                  type="text"
                  required
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="Relé Iluminación Pista 5"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Proveedor / Protocolo</label>
                <select
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value as unknown as 'Shelly Cloud Pro')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Shelly Cloud Pro">Shelly Cloud Pro (Relé DIN)</option>
                  <option value="Salto KS Cloud">Salto KS Cloud (Cerradura PIN)</option>
                  <option value="Sonoff IoT">Sonoff IoT WiFi / Zigbee</option>
                  <option value="Tuya Pro">Tuya Pro / Smart Life API</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Pista Asignada</label>
                <select
                  value={newCourtId}
                  onChange={(e) => setNewCourtId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  {courts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition shadow"
                >
                  Vincular Dispositivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
