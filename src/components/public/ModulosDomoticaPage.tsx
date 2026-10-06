import React, { useState } from 'react';
import {
  Zap,
  Lightbulb,
  LockKeyhole,
  Wifi,
  Calendar,
  GraduationCap,
  Coffee,
  Trophy,
  Users,
  CreditCard,
  Video,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Sliders,
  Cpu,
  Layers,
  Power,
  KeyRound,
  Eye,
} from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { useApp } from '../../context/AppContext';

interface ModulosDomoticaPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
}

export interface ModuleItem {
  id: string;
  category: 'software' | 'iot';
  title: string;
  roleBadge: string;
  roleColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  benefits: string[];
  kpi: string;
}

const MODULES_DATA: ModuleItem[] = [
  // --- Módulos de Software ---
  {
    id: 'mod-agenda',
    category: 'software',
    title: 'Cuadrante y Reservas Online en Tiempo Real',
    roleBadge: 'Alquiler: Club',
    roleColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: Calendar,
    description:
      'Gestión integral de pistas cubiertas y exteriores con tarifas dinámicas según franja horaria (valle/punta), duración personalizada y reserva en 3 clics.',
    benefits: [
      'Cuadrante táctil multipista ultrarrápido',
      'División de pago automática entre 4 jugadores',
      'Políticas de cancelación y fianza configurables',
    ],
    kpi: '0% reservas duplicadas',
  },
  {
    id: 'mod-escuela',
    category: 'software',
    title: 'Academia, Cursos y Gestión de Alumnos',
    roleBadge: 'Clases: Academia',
    roleColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    icon: GraduationCap,
    description:
      'Organización de cursos mensuales, trimestrales y clínicas sueltas. Asignación de profesores, cuotas diferenciadas socios/no socios y listas de espera automáticas.',
    benefits: [
      'Verificación visual de disponibilidad de pista',
      'Publicación de plazas libres con aviso instantáneo',
      'Control de asistencia y progreso de nivel',
    ],
    kpi: '+35% ocupación en horas valle',
  },
  {
    id: 'mod-tpv',
    category: 'software',
    title: 'TPV Táctil, Bar y Control de Stock',
    roleBadge: 'Bar: Cafetería',
    roleColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Coffee,
    description:
      'Terminal punto de venta con tarjetas visuales, asignación de consumos a reservas o cuenta de socio, arqueo de caja con impresión térmica nativa e inventario.',
    benefits: [
      'Cobro directo con saldo monedero o tarjeta',
      'Arqueo de caja y desglose de formas de pago',
      'Alertas automáticas de bajo stock en pelotas y palas',
    ],
    kpi: 'Tickets impresos al instante',
  },
  {
    id: 'mod-torneos',
    category: 'software',
    title: 'Torneos, Ligas y Rankings del Club',
    roleBadge: 'Competición: Jugador',
    roleColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: Trophy,
    description:
      'Generador automático de cuadros eliminatorios con consolación, fases de grupo, pozo exprés y rankings por puntos federados o internos del club.',
    benefits: [
      'Inscripción online con cobro seguro anticipado',
      'Actualización en vivo de resultados y horarios',
      'Notificaciones automáticas a los rivales del cuadro',
    ],
    kpi: 'Cuadros listos en 1 clic',
  },
  {
    id: 'mod-crm',
    category: 'software',
    title: 'CRM Deportivo y Ficha Técnica de Jugadores',
    roleBadge: 'Socios: Club',
    roleColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Users,
    description:
      'Ficha completa de cada jugador con monedero virtual, historial de partidos con parejas y fotos, nivel dinámico, pala favorita y métricas de rival habitual.',
    benefits: [
      'Monedero prepago con bonificaciones por recarga',
      'Historial de partidos frente a frente (H2H)',
      'Segmentación por cuotas de socio y fidelización',
    ],
    kpi: 'Ficha integral unificada',
  },
  {
    id: 'mod-facturacion',
    category: 'software',
    title: 'Contabilidad, Facturación y Remesas SEPA',
    roleBadge: 'Finanzas: Administración',
    roleColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: CreditCard,
    description:
      'Automatización de cuotas recurrentes de socios, emisión de facturas oficiales con IVA desglosado, remesas bancarias SEPA XML y exportación contable.',
    benefits: [
      'Generación de remesas SEPA B2B y Core',
      'Facturas descargables en PDF para empresas',
      'Control de morosidad y pagos pendientes en un clic',
    ],
    kpi: '100% conciliación bancaria',
  },

  // --- Módulos de Domótica IoT ---
  {
    id: 'iot-luces',
    category: 'iot',
    title: 'Automatización Inteligente de Iluminación LED',
    roleBadge: 'Alquiler: Club',
    roleColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: Lightbulb,
    description:
      'Encendido automático de los focos de pista 5 minutos antes de la hora de la reserva y apagado programado tras finalizar el partido, evitando consumo fantasma.',
    benefits: [
      'Ahorro de hasta un 40% en factura de luz',
      'Encendido progresivo sin deslumbramiento',
      'Anulación remota si la reserva se cancela',
    ],
    kpi: '-40% gasto eléctrico',
  },
  {
    id: 'iot-accesos',
    category: 'iot',
    title: 'Control de Accesos por PIN y Código QR Dinámico',
    roleBadge: 'Acceso: Usuario',
    roleColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    icon: LockKeyhole,
    description:
      'Cerraduras electrónicas y tornos peatonales sincronizados con el software. Cada jugador recibe un PIN temporal de 4 dígitos o QR válido durante su horario reservado.',
    benefits: [
      'Apertura de club autónomo sin personal en recepción',
      'Registro auditor de entrada con fecha y hora exacta',
      'Inhabilitación automática si el partido no está pagado',
    ],
    kpi: 'Aperturas 100% desatendidas',
  },
  {
    id: 'iot-video',
    category: 'iot',
    title: 'Cámaras de Repetición y Streaming con Botón en Pista',
    roleBadge: 'Competición: Jugador',
    roleColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    icon: Video,
    description:
      'Cámara cenital o panorámica en pista con pulsador físico inalámbrico en el poste. Cuando un jugador hace un punto épico, pulsa el botón y el clip se envía a su app.',
    benefits: [
      'Repetición de jugadas destacadas (Vídeo Highlight)',
      'Streaming en directo de finales de torneos en YouTube',
      'Monetización mediante patrocinadores en marca de agua',
    ],
    kpi: 'Viralidad en redes sociales',
  },
  {
    id: 'iot-clima',
    category: 'iot',
    title: 'Climatización, Calefacción y Sensores Ambientales',
    roleBadge: 'Operaciones: Club',
    roleColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Thermometer,
    description:
      'Sensores IoT de temperatura, humedad y calidad del aire en naves indoor. Activación inteligente de deshumidificadores y aerotermia según ocupación real.',
    benefits: [
      'Cristales sin condensación para rebotes perfectos',
      'Confort térmico óptimo en invierno y verano',
      'Telemetría en tiempo real desde el panel del club',
    ],
    kpi: 'Cero condensación en cristal',
  },
  {
    id: 'iot-sensores',
    category: 'iot',
    title: 'Sensores de Pista Ocupada y Detección de Presencia',
    roleBadge: 'Domótica: Setmio IoT',
    roleColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    icon: Wifi,
    description:
      'Detección por radar microondas y visión computacional que confirma si los 4 jugadores han accedido a la pista, liberándola si se produce un "no-show".',
    benefits: [
      'Detección de pistas vacías para reasignación rápida',
      'Control de juego fuera de horario autorizado',
      'Conexión segura vía protocolo MQTT cifrado',
    ],
    kpi: 'Telemetría en milisegundos',
  },
];

export function ModulosDomoticaPage({ onBack, onOpenDemo }: ModulosDomoticaPageProps) {
  const { t, setCurrentView } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'software' | 'iot'>('all');

  // Interactive Live Demo Simulation State
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

  const filteredModules = MODULES_DATA.filter((m) => {
    if (selectedFilter === 'all') return true;
    return m.category === selectedFilter;
  });

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-950 text-white px-4 py-8 sm:px-6 lg:px-8 lg:py-16 transition-colors">
      <div className="mx-auto max-w-6xl space-y-12">
        <SubpageHeaderNav onBack={onBack} />

        {/* Hero Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Ecosistema Setmio · Software SaaS & Domótica IoT</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Pistas de pádel autónomas. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Software y hardware en perfecta sincronía.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Conecta tu cuadrante de reservas directamente con los focos LED, cerraduras electrónicas y cámaras de tus pistas. Automatiza la operativa, reduce un 40% el coste energético y ofrece una experiencia premium sin personal presencial.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
              >
                <span>Probar Demo Interactiva</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('admin');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <span>Acceder a la App de Gestión</span>
              </button>
            </div>
          </div>
        </section>

        {/* Live Playground: Simulador de Domótica IoT en Pista 1 */}
        <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">
                  Simulador en Vivo: Pista 1 Central (Control IoT)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Prueba cómo reacciona la pista inteligente cuando un jugador interactúa con el sistema.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              MQTT Broker Conectado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Control 1: Iluminación LED */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                      simCourtLight
                        ? 'bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Iluminación LED Pista</h4>
                    <span className="text-[11px] text-slate-400">
                      Estado: {simCourtLight ? 'Encendido (400 Lux)' : 'Apagado (Standby)'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSimCourtLight(!simCourtLight)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    simCourtLight
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{simCourtLight ? 'Apagar Focos' : 'Encender Focos'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Programación activa:</span>
                <span className="font-mono text-emerald-400 font-bold">19:25 a 21:05 (Reserva actual)</span>
              </div>
            </div>

            {/* Control 2: Cerradura Electrónica PIN */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                      !simDoorLocked
                        ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <LockKeyhole className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Torno / Puerta de Acceso</h4>
                    <span className="text-[11px] text-slate-400">
                      Estado: {!simDoorLocked ? 'Desbloqueado (Abierto)' : 'Bloqueado con PIN'}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    !simDoorLocked ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
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
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-emerald-500 text-center"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Validar PIN
                </button>
              </form>

              {simAccessSuccess === true && (
                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PIN correcto (#4829). Puerta abierta durante 10 segundos.</span>
                </div>
              )}
              {simAccessSuccess === false && (
                <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5 animate-in fade-in">
                  <span>PIN erróneo. Prueba con #4829 o #1234.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Filter Navigation */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Catálogo de Módulos y Domótica
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explora cada componente con su correspondiente rol beneficiado en el club de pádel.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({MODULES_DATA.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('software')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === 'software'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Software SaaS (6)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('iot')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === 'iot'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Domótica IoT (5)</span>
              </button>
            </div>
          </div>

          {/* Cards Grid con Badges Claros de Rol Beneficiado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition shadow-sm group"
                >
                  <div className="space-y-4">
                    {/* Header: Icon + Role Badge Obligatorio */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-11 h-11 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Badge con el rol beneficiado exigido por requerimiento */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${item.roleColor}`}
                      >
                        {item.roleBadge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Lista de beneficios */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      {item.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer KPI */}
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-400">{item.kpi}</span>
                    <button
                      type="button"
                      onClick={onOpenDemo}
                      className="text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver módulo</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Banner Final */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-8 sm:p-10 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            ¿Quieres modernizar las pistas de tu club?
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo técnico te asesora en la instalación de relés IoT, cerraduras inteligentes y configuración del software en menos de 48 horas, sin interrumpir los partidos.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenDemo}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Solicitar Demostración y Presupuesto
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
