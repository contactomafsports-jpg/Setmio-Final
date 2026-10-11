import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Smartphone,
  MessageCircle,
  Mail,
  CheckCircle2,
  Save,
  RefreshCw,
  Sparkles,
  Sliders,
  Send,
  Calendar,
  Trophy,
  Wallet,
  Clock,
  Shield,
  AlertTriangle,
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  category: 'booking' | 'match' | 'wallet' | 'level';
  description: string;
  enabled: boolean;
  channels: {
    push: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  subject: string;
  message: string;
  timing: string;
}

export const AdminNotificationSettings: React.FC = () => {
  const { currentTenant, triggerDemoToast } = useApp();

  // Canales Globales
  const [channelsConfig, setChannelsConfig] = useState({
    push: {
      enabled: true,
      provider: 'FCM / Web Push API',
      senderName: currentTenant.name,
      status: 'Activo & En línea',
    },
    whatsapp: {
      enabled: true,
      provider: 'Meta WhatsApp Business API',
      phoneNumber: '+34 981 33 44 55',
      status: 'Conectado (WABA Verificado)',
    },
    email: {
      enabled: true,
      provider: 'SMTP Dedicado / DKIM Válido',
      fromEmail: `avisos@${currentTenant.slug}.setmio.com`,
      status: 'Activo (SPF & DMARC 100%)',
    },
  });

  // Plantillas de Avisos
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'tpl-1',
      name: 'Confirmación Instantánea de Reserva',
      category: 'booking',
      description: 'Se dispara cuando un socio o usuario confirma una pista.',
      enabled: true,
      channels: { push: true, whatsapp: true, email: true },
      timing: 'Inmediato tras reserva',
      subject: `🎾 Reserva Confirmada en ${currentTenant.name}: {pista}`,
      message:
        '¡Hola {nombre_jugador}! Tu reserva en {pista} para el {fecha} a las {hora} ha sido confirmada con éxito. Acceso directo: {enlace_reserva}.',
    },
    {
      id: 'tpl-2',
      name: 'Convocatoria de Partida Abierta Play!',
      category: 'match',
      description: 'Lanza aviso a jugadores de nivel cuando se busca completar una partida.',
      enabled: true,
      channels: { push: true, whatsapp: true, email: false },
      timing: 'Manual o cuando falta 1 plaza a 4h del inicio',
      subject: `🏆 Nueva plaza libre: Partida de nivel {nivel_rango} en {pista}`,
      message:
        '¡Atención {nombre_jugador}! Quedan plazas libres para completar partida en {pista} ({fecha} a las {hora}). Nivel requerido: {nivel_rango}. Únete y paga tu parte a 1/4 aquí: {enlace_partida}',
    },
    {
      id: 'tpl-3',
      name: 'Recordatorio Previo de Partido (2h antes)',
      category: 'booking',
      description: 'Aviso de cortesía con previsión y recordatorio de pista.',
      enabled: true,
      channels: { push: true, whatsapp: true, email: false },
      timing: '2 horas antes del inicio',
      subject: `⏰ Tu partido en ${currentTenant.name} comienza en 2 horas`,
      message:
        'Hola {nombre_jugador}, recuerda que tu pista {pista} está lista para hoy a las {hora}. ¡Te esperamos en el club!',
    },
    {
      id: 'tpl-4',
      name: 'Cancelación y Reembolso a Monedero',
      category: 'wallet',
      description: 'Notifica al socio del reintegro automático en saldo digital.',
      enabled: true,
      channels: { push: true, whatsapp: false, email: true },
      timing: 'Inmediato tras cancelación dentro de plazo',
      subject: `💳 Reembolso aplicado a tu monedero: {importe} €`,
      message:
        'Estimado/a {nombre_jugador}, se ha procesado la cancelación de tu reserva en {pista}. El importe de {importe} € ha sido acreditado inmediatamente en tu saldo monedero del club.',
    },
    {
      id: 'tpl-5',
      name: 'Aprobación de Nivel Deportivo / ELO',
      category: 'level',
      description: 'Avisa al jugador cuando se recalibra su rating deportivo.',
      enabled: true,
      channels: { push: true, whatsapp: false, email: true },
      timing: 'Al validar resultado de partida o cambio por staff',
      subject: `⭐ ¡Nuevo Nivel Play! asignado: {nuevo_nivel}`,
      message:
        '¡Enhorabuena {nombre_jugador}! Tu nivel oficial en {club} se ha actualizado a {nuevo_nivel}. Ya puedes apuntarte a partidas de tu nuevo rango.',
    },
  ]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-1');
  const [testRecipient, setTestRecipient] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const handleToggleChannelInTemplate = (
    templateId: string,
    channel: 'push' | 'whatsapp' | 'email'
  ) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? {
              ...t,
              channels: {
                ...t.channels,
                [channel]: !t.channels[channel],
              },
            }
          : t
      )
    );
  };

  const handleUpdateTemplateField = (
    templateId: string,
    field: 'subject' | 'message' | 'enabled',
    val: any
  ) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, [field]: val } : t))
    );
  };

  const handleInsertVariable = (variable: string) => {
    const updated = activeTemplate.message + ` ${variable}`;
    handleUpdateTemplateField(activeTemplate.id, 'message', updated);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Configuración de Avisos Guardada',
      'Las plantillas, canales y automatizaciones de notificación del club están actualizadas y en producción.',
      'success'
    );
  };

  const handleSendTest = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      triggerDemoToast(
        'Prueba Enviada',
        `Plantilla "${activeTemplate.name}" simulada con éxito vía ${
          activeTemplate.channels.whatsapp
            ? 'WhatsApp'
            : activeTemplate.channels.push
            ? 'Push'
            : 'Email'
        } a ${testRecipient || 'administración'}.`,
        'success'
      );
    }, 600);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
            <Bell className="w-3.5 h-3.5" />
            <span>MÓDULO OFICIAL DE NOTIFICACIONES</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Canales Automáticos & Plantillas del Club
          </h2>
          <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
            Configura las vías de envío (Notificaciones Push In-App, WhatsApp Business API y Email) y personaliza los avisos transaccionales para socios de {currentTenant.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      {/* 1. Canales Globales de Comunicación */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-500" />
          <span>Canales de Envío Habilitados en el Club</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Canal Push */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Push In-App</h4>
                  <span className="text-[10px] text-slate-400">{channelsConfig.push.provider}</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelsConfig.push.enabled}
                  onChange={(e) =>
                    setChannelsConfig({
                      ...channelsConfig,
                      push: { ...channelsConfig.push, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Remitente:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{channelsConfig.push.senderName}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Estado:</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {channelsConfig.push.status}
                </span>
              </div>
            </div>
          </div>

          {/* Canal WhatsApp */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">WhatsApp Business</h4>
                  <span className="text-[10px] text-slate-400">{channelsConfig.whatsapp.provider}</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelsConfig.whatsapp.enabled}
                  onChange={(e) =>
                    setChannelsConfig({
                      ...channelsConfig,
                      whatsapp: { ...channelsConfig.whatsapp, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Línea WABA:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{channelsConfig.whatsapp.phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Estado:</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {channelsConfig.whatsapp.status}
                </span>
              </div>
            </div>
          </div>

          {/* Canal Email */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Email Transaccional</h4>
                  <span className="text-[10px] text-slate-400">{channelsConfig.email.provider}</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelsConfig.email.enabled}
                  onChange={(e) =>
                    setChannelsConfig({
                      ...channelsConfig,
                      email: { ...channelsConfig.email, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Remitente:</span>
                <span className="font-bold font-mono text-[10px] text-slate-800 dark:text-slate-200">{channelsConfig.email.fromEmail}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Estado:</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {channelsConfig.email.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gestor de Plantillas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Selector Izquierdo de Plantillas */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Eventos Automáticos ({templates.length})
            </h3>
          </div>

          <div className="space-y-2">
            {templates.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {tpl.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        tpl.enabled
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {tpl.enabled ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {tpl.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tpl.timing}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <div className="flex items-center gap-1.5 font-bold">
                      {tpl.channels.push && <span className="text-emerald-600 dark:text-emerald-400">Push</span>}
                      {tpl.channels.whatsapp && <span className="text-emerald-600 dark:text-emerald-400">WhatsApp</span>}
                      {tpl.channels.email && <span className="text-indigo-600 dark:text-indigo-400">Email</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Derecho de la Plantilla Seleccionada */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {activeTemplate.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeTemplate.description}
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeTemplate.enabled}
                onChange={(e) =>
                  handleUpdateTemplateField(activeTemplate.id, 'enabled', e.target.checked)
                }
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Plantilla Habilitada
              </span>
            </label>
          </div>

          {/* Canales para esta plantilla */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Canales activos para este evento:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleToggleChannelInTemplate(activeTemplate.id, 'push')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTemplate.channels.push
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Push</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleChannelInTemplate(activeTemplate.id, 'whatsapp')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTemplate.channels.whatsapp
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleChannelInTemplate(activeTemplate.id, 'email')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTemplate.channels.email
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Asunto */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Asunto / Título de la Notificación:
            </label>
            <input
              type="text"
              value={activeTemplate.subject}
              onChange={(e) =>
                handleUpdateTemplateField(activeTemplate.id, 'subject', e.target.value)
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Variables de Inserción Dinámica */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Variables dinámicas disponibles:
              </label>
              <span className="text-[10px] text-slate-400">Haz clic para insertar en el mensaje</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                '{nombre_jugador}',
                '{pista}',
                '{fecha}',
                '{hora}',
                '{nivel_rango}',
                '{importe}',
                '{club}',
                '{enlace_reserva}',
                '{enlace_partida}',
              ].map((variable) => (
                <button
                  key={variable}
                  type="button"
                  onClick={() => handleInsertVariable(variable)}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-bold transition cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                >
                  {variable}
                </button>
              ))}
            </div>
          </div>

          {/* Cuerpo del Mensaje */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Cuerpo del Mensaje:
            </label>
            <textarea
              rows={4}
              value={activeTemplate.message}
              onChange={(e) =>
                handleUpdateTemplateField(activeTemplate.id, 'message', e.target.value)
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Simulador de Envío de Prueba */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            <div className="w-full sm:w-auto flex-1">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Simular Envío de Prueba
              </span>
              <input
                type="text"
                placeholder="Teléfono WhatsApp o Email de prueba..."
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleSendTest}
              disabled={isSendingTest}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingTest ? 'Enviando...' : 'Lanzar Prueba'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationSettings;
