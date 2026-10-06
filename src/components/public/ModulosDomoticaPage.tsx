import React, { useState } from 'react';
import {
  Zap,
  Lightbulb,
  LockKeyhole,
  Wifi,
  Video,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Power,
  Sliders,
  DollarSign,
  TrendingDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface ModulosDomoticaPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
}

export interface DomoticaModuleItem {
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  specs: string[];
  savingKpi: string;
}

const DOMOTICA_MODULES: DomoticaModuleItem[] = [
  {
    id: 'dom-luces',
    title: 'Automatización Inteligente de Iluminación LED',
    badge: 'Ahorro Eléctrico',
    icon: Lightbulb,
    description:
      'Encendido automático de los focos de pista 5 minutos antes de la reserva y apagado inmediato tras finalizar el tiempo contratado. Elimina por completo el consumo fantasma de pistas vacías.',
    specs: [
      'Encendido gradual para evitar sobretensiones en la red',
      'Temporizador de cortesía de 3 minutos tras el fin del partido',
      'Cancelación automática si la reserva se anula con antelación',
      'Ahorro comprobado de hasta un 40% en la factura eléctrica mensual',
    ],
    savingKpi: '-40% en consumo de luz',
  },
  {
    id: 'dom-accesos',
    title: 'Control de Accesos por PIN y Código QR Dinámico',
    badge: 'Acceso Autónomo',
    icon: LockKeyhole,
    description:
      'Cerraduras electrónicas y tornos peatonales de alta resistencia conectados a la nube. Cada jugador recibe en su móvil un PIN temporal o QR válido exclusivamente durante su horario reservado.',
    specs: [
      'Apertura de pistas sin necesidad de personal en recepción',
      'Desbloqueo automático 10 minutos antes del inicio del turno',
      'Registro de auditoría con fecha y milisegundo de entrada',
      'Integración nativa con cancelas exteriores y puertas de cristal',
    ],
    savingKpi: 'Operación 24/7 sin personal',
  },
  {
    id: 'dom-video',
    title: 'Cámaras de Repetición y Highlights con Pulsador en Pista',
    badge: 'Experiencia Viral',
    icon: Video,
    description:
      'Sistema de grabación continua en bucle con pulsador físico inalámbrico instalado en el poste de la red. Cuando un jugador hace un punto épico, pulsa el botón y el clip se recorta y se envía a su app.',
    specs: [
      'Grabación en resolución Full HD 60fps con lente gran angular',
      'Generación automática de clip de 30 segundos (20s antes + 10s después)',
      'Marca de agua con logotipo y patrocinadores del club',
      'Opción de retransmisión en directo por streaming en YouTube',
    ],
    savingKpi: '+400% engagement social',
  },
  {
    id: 'dom-clima',
    title: 'Climatización, Aerotermia y Sensores Antihumedad',
    badge: 'Confort en Pista',
    icon: Thermometer,
    description:
      'Sondas IoT de temperatura, humedad relativa y punto de rocío en naves indoor. Activación inteligente de aerotermia y deshumidificadores para evitar cristales empañados.',
    specs: [
      'Prevención total de condensación en vidrios para rebotes limpios',
      'Encendido de calefacción o aire acondicionado según ocupación real',
      'Telemetría continua de calidad del aire y niveles de CO2',
      'Ajuste automático según previsión meteorológica exterior',
    ],
    savingKpi: 'Cristales 100% secos',
  },
  {
    id: 'dom-radar',
    title: 'Radar de Pista Ocupada y Detección de Presencia',
    badge: 'Control en Tiempo Real',
    icon: Wifi,
    description:
      'Sensores volumétricos microondas que monitorizan si los jugadores están efectivamente disputando el partido, liberando la pista o alertando a recepción en caso de "no-show".',
    specs: [
      'Detección no invasiva sin reconocimiento facial ni cámaras invasivas',
      'Aviso a recepción tras 15 minutos de incomparecencia',
      'Control de juego no autorizado fuera de horario reservado',
      'Comunicación por protocolo industrial MQTT cifrado de baja latencia',
    ],
    savingKpi: 'Liberación de pistas libres',
  },
  {
    id: 'dom-cuadro',
    title: 'Cuadros Eléctricos Inteligentes y Relés Industriales',
    badge: 'Hardware Conectado',
    icon: Cpu,
    description:
      'Módulos de carril DIN instalados directamente en el cuadro eléctrico general del club. Fabricados bajo normativa europea para soportar cargas continuas y maniobras exigentes.',
    specs: [
      'Conexión dual Ethernet cableada y respaldo 4G LTE',
      'Medición de consumo eléctrico en kWh en tiempo real por pista',
      'Corte de emergencia y rearme automático desde el panel admin',
      'Compatibles con cualquier instalación eléctrica existente sin obras',
    ],
    savingKpi: 'Telemetría kWh en vivo',
  },
];

export function ModulosDomoticaPage({ onBack, onOpenDemo }: ModulosDomoticaPageProps) {
  const { t } = useApp();

  // Live Playground State
  const [simCourtLight, setSimCourtLight] = useState(true);
  const [simDoorLocked, setSimDoorLocked] = useState(true);
  const [simKeyInput, setSimKeyInput] = useState('');
  const [simAccessSuccess, setSimAccessSuccess] = useState<boolean | null>(null);

  const handleTestPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (simKeyInput === '4829' || simKeyInput === '1234') {
      setSimAccessSuccess(true);
      setSimDoorLocked(false);
      setTimeout(() => {
        setSimDoorLocked(true);
        setSimAccessSuccess(null);
        setSimKeyInput('');
      }, 3500);
    } else {
      setSimAccessSuccess(false);
      setTimeout(() => setSimAccessSuccess(null), 2500);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-8 sm:px-6 lg:px-8 lg:py-16 transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Navigation Button alineado a la izquierda */}
        <div className="flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} />
        </div>

        {/* Hero Header de Domótica & Automatizaciones (Alineado limpiamente a la izquierda) */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-sm dark:shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Domótica & Pistas Autónomas Setmio IoT</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Pistas de pádel autónomas. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                Abre las 24 horas sin costes de recepción.
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Conecta tu software de gestión directamente con las luces LED, tornos de acceso, cámaras de repetición y sistemas de climatización de tus pistas. Automatización industrial llave en mano instalable en menos de 48 horas.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <span>Solicitar Demo de Domótica</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Compatible con relés Schneider, Finder y Shelly</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Playground: Simulador de Domótica IoT en Pista 1 (100% compatible claro/oscuro) */}
        <section className="rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Simulador en Vivo: Pista 1 Central (Control IoT)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Comprueba cómo reacciona la pista inteligente cuando un jugador interactúa con el sistema de acceso y luces.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-2 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              MQTT Broker Conectado (Ping: 14ms)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Control 1: Iluminación LED */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                      simCourtLight
                        ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Iluminación LED Pista</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Estado: {simCourtLight ? 'Encendido (400 Lux)' : 'Apagado (Standby 0W)'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSimCourtLight(!simCourtLight)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    simCourtLight
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{simCourtLight ? 'Apagar Focos' : 'Encender Focos'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Horario programado:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">19:25 a 21:05 (Reserva actual)</span>
              </div>
            </div>

            {/* Control 2: Cerradura Electrónica PIN */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                      !simDoorLocked
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <LockKeyhole className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Torno / Puerta de Pista</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Estado: {!simDoorLocked ? 'Desbloqueado (Abierto)' : 'Bloqueado con PIN'}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    !simDoorLocked
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {!simDoorLocked ? 'Pase Autorizado' : 'Cerrado'}
                </span>
              </div>

              <form onSubmit={handleTestPin} className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Introduce PIN (ej: 4829)"
                  value={simKeyInput}
                  onChange={(e) => setSimKeyInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-emerald-500 text-center"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer active:scale-95"
                >
                  Validar PIN
                </button>
              </form>

              {simAccessSuccess === true && (
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PIN correcto (#4829). Puerta abierta durante 10 segundos.</span>
                </div>
              )}
              {simAccessSuccess === false && (
                <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 animate-in fade-in">
                  <span>PIN incorrecto. Prueba con #4829 o #1234.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Catálogo Exclusivo de Módulos de Domótica */}
        <section className="space-y-6">
          <div className="space-y-1 text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Hardware y Automatizaciones IoT Disponibles
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dispositivos certificados e integrados de forma nativa con el motor de reservas de Setmio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOMOTICA_MODULES.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-lg dark:hover:shadow-2xl transition duration-200 group shadow-xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      {item.specs.map((spec, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{item.savingKpi}</span>
                    <button
                      type="button"
                      onClick={onOpenDemo}
                      className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Auditar mi club</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Banner de Auditoría Técnica de Domótica */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 border border-emerald-500/30 p-8 sm:p-10 text-center space-y-4 shadow-xl text-white">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            ¿Quieres automatizar las pistas de tu club?
          </h3>
          <p className="text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Nuestros ingenieros evalúan la instalación eléctrica de tu club y preparan los cuadros de mando preconfigurados para conectar y funcionar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenDemo}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Solicitar Estudio de Domótica Gratuito
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ModulosDomoticaPage;
