import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Lightbulb,
  LockKeyhole,
  Power,
  Sliders,
  Thermometer,
  Video,
  Wifi,
} from 'lucide-react';
import { useApp, PublicPage } from '../../context/AppContext';
import { RoleSelectorModal } from '../common/RoleSelectorModal';
import {
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporatePrimaryButton,
  CorporateSecondaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';

interface ModulosDomoticaPageProps {
  onBack?: () => void;
  onOpenDemo?: () => void;
  onOpenRegister?: () => void;
}

type HardwareCategory = 'all' | 'energy' | 'access' | 'media';

interface DomoticaItem {
  id: string;
  order: string;
  category: Exclude<HardwareCategory, 'all'>;
  categoryLabel: string;
  title: string;
  desc: string;
  specs: string[];
  benefit: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DOMOTICA_ITEMS: DomoticaItem[] = [
  {
    id: 'iluminacion-led',
    order: '01',
    category: 'energy',
    categoryLabel: 'Iluminación y Energía',
    title: 'Control de Iluminación LED por Pista',
    desc: 'Encendido y apagado sincronizado automáticamente con cada reserva confirmada, clase o torneo.',
    specs: [
      'Encendido de cortesía 5 minutos antes del partido',
      'Apagado retardado configurable para salida segura',
      'Memoria horaria local ante cortes puntuales de red',
      'Activación manual puntual desde el cuadrante en recepción',
    ],
    benefit: 'Evita focos encendidos sin partido',
    icon: Lightbulb,
  },
  {
    id: 'accesos-pin',
    order: '02',
    category: 'access',
    categoryLabel: 'Control de Accesos',
    title: 'Cerraduras y Tornos con PIN Dinámico',
    desc: 'Cada jugador recibe un código único válido únicamente durante la franja reservada.',
    specs: [
      'Generación automática al confirmar la reserva o pago dividido',
      'Ventana temporal estricta de acceso previo y salida',
      'Compatible con puertas peatonales, portones y tornos de entrada',
      'Registro auditable de accesos para clubes y ayuntamientos',
    ],
    benefit: 'Operación 24/7 sin entrega de llaves',
    icon: LockKeyhole,
  },
  {
    id: 'climatizacion-indoor',
    order: '03',
    category: 'energy',
    categoryLabel: 'Iluminación y Energía',
    title: 'Climatización y Deshumidificación Indoor',
    desc: 'Programación inteligente de extracción y clima en naves cubiertas según ocupación real de pistas.',
    specs: [
      'Arranque vinculado al porcentaje de ocupación de franja',
      'Apagado automático al finalizar la última reserva del día',
      'Prevención de condensación en cristales y moqueta',
      'Control por zonas de pista o vestuarios',
    ],
    benefit: 'Eficiencia térmica en naves indoor',
    icon: Thermometer,
  },
  {
    id: 'lectura-qr',
    order: '04',
    category: 'access',
    categoryLabel: 'Control de Accesos',
    title: 'Lectores QR y Acceso desde Móvil',
    desc: 'Validación instantánea en entrada o recepción mediante el pase de reserva de Setmio Player.',
    specs: [
      'Lectura rápida desde pantalla móvil sin aplicaciones adicionales',
      'Validación de bonos de socio y reservas confirmadas',
      'Control diferenciado para socios, abonados o alumnos',
      'Integración directa con el cuadrante del club',
    ],
    benefit: 'Entrada ágil sin colas en horas punta',
    icon: Wifi,
  },
  {
    id: 'grabacion-puntos',
    order: '05',
    category: 'media',
    categoryLabel: 'Pistas y Señalización',
    title: 'Cámaras de Repetición y Marcadores',
    desc: 'Botón en pista o app para guardar mejores puntos y mostrar el marcador en pantalla.',
    specs: [
      'Inicio y cierre automático vinculados al horario del partido',
      'Descarga directa del vídeo para los jugadores participantes',
      'Marcador visible en pantalla de pista sincronizado desde móvil',
      'Sin grabación de sesiones no autorizadas',
    ],
    benefit: 'Valor añadido diferencial para socios',
    icon: Video,
  },
  {
    id: 'pantallas-sede',
    order: '06',
    category: 'media',
    categoryLabel: 'Pistas y Señalización',
    title: 'Pantallas Informativas de Sede',
    desc: 'Monitores en recepción o zona social mostrando próximas pistas, partidos abiertos y cuadros de torneo.',
    specs: [
      'Actualización automática del orden de juego y pistas asignadas',
      'Vista limpia de horarios para torneos y ligas de fin de semana',
      'Modo día y noche acorde a la identidad del club',
      'Funciona en cualquier navegador de Smart TV o monitor',
    ],
    benefit: 'Orientación inmediata en el club',
    icon: Sliders,
  },
];

export function ModulosDomoticaPage({
  onBack: _onBack,
  onOpenDemo,
  onOpenRegister,
}: ModulosDomoticaPageProps) {
  const { setPublicPage } = useApp();

  const [simCourtLight, setSimCourtLight] = useState<boolean>(true);
  const [simDoorLocked, setSimDoorLocked] = useState<boolean>(true);
  const [simKeyInput, setSimKeyInput] = useState<string>('');
  const [simAccessStatus, setSimAccessStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [selectedCategory, setSelectedCategory] = useState<HardwareCategory>('all');
  const [localDemoModalOpen, setLocalDemoModalOpen] = useState(false);

  void _onBack;

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleOpenRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleOpenDemoClick = () => {
    if (onOpenDemo) {
      onOpenDemo();
    } else {
      setLocalDemoModalOpen(true);
    }
  };

  const handleTestPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (simKeyInput.trim() === '4829' || simKeyInput.trim() === '1234') {
      setSimAccessStatus('granted');
      setSimDoorLocked(false);
      setTimeout(() => {
        setSimDoorLocked(true);
        setSimAccessStatus('idle');
        setSimKeyInput('');
      }, 3000);
    } else {
      setSimAccessStatus('denied');
      setTimeout(() => setSimAccessStatus('idle'), 2500);
    }
  };

  const categories: { id: HardwareCategory; label: string; count: number }[] = [
    { id: 'all', label: 'Todos los sistemas', count: DOMOTICA_ITEMS.length },
    {
      id: 'energy',
      label: 'Iluminación y Energía',
      count: DOMOTICA_ITEMS.filter((i) => i.category === 'energy').length,
    },
    {
      id: 'access',
      label: 'Control de Accesos',
      count: DOMOTICA_ITEMS.filter((i) => i.category === 'access').length,
    },
    {
      id: 'media',
      label: 'Pistas y Señalización',
      count: DOMOTICA_ITEMS.filter((i) => i.category === 'media').length,
    },
  ];

  const visibleItems =
    selectedCategory === 'all'
      ? DOMOTICA_ITEMS
      : DOMOTICA_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
      {/* 1. COMPACT HERO & INTERACTIVE CONTROLLER PREVIEW */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-7 sm:py-11">
        <CorporateContainer className="space-y-8 sm:space-y-10">
          <div className="space-y-5 sm:space-y-6">
            <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => navigate('/', 'home')}
                className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer"
              >
                Inicio
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
              <span className="font-semibold text-[#0B1A2D] dark:text-white">
                Domótica
              </span>
            </nav>

            <div className="max-w-3xl space-y-3.5 animate-float-in">
              <CorporateEyebrow accent="lime">Setmio IoT · Pistas Desatendidas</CorporateEyebrow>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                Automatiza la iluminación LED y el acceso por PIN de cada pista.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Conecta tus cuadros eléctricos y cerraduras directamente al motor de reservas para abrir horarios de mañana y noche sin presencia continua en recepción.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1.5">
                <CorporatePrimaryButton onClick={handleOpenRegisterClick}>
                  Registrarse
                </CorporatePrimaryButton>
                <CorporateSecondaryButton onClick={() => navigate('/funcionalidades', 'features')}>
                  Ver funcionalidades
                </CorporateSecondaryButton>
              </div>
            </div>
          </div>

          {/* Interactive Minimalist Controller Preview */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-[#F7F9FC] dark:bg-[#0E2239] p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80 dark:border-[#1A314D]">
              <div className="space-y-1 min-w-0">
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0B1A2D] dark:text-[#B7F229]">
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>Simulación operativa de pista</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Prueba cómo responde el encendido eléctrico y el teclado PIN temporal ante una reserva confirmada.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSimKeyInput('4829')}
                className="self-start sm:self-auto text-[11px] font-mono font-semibold text-[#0B1A2D] dark:text-slate-200 bg-white dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 rounded-lg px-2.5 py-1 transition-colors cursor-pointer shrink-0 tabular-nums"
                title="Rellenar PIN de prueba 4829"
              >
                PIN de prueba: 4829
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* LED Lighting Panel */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] flex flex-col justify-between space-y-5 min-w-0">
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-150 motion-reduce:transition-none shrink-0 ${
                        simCourtLight
                          ? 'bg-[#B7F229] text-[#0B1A2D]'
                          : 'bg-[#0B1A2D] dark:bg-[#132A45] text-slate-300'
                      }`}
                    >
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white leading-snug">
                        Circuito Focos LED · Pista 1
                      </h2>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Estado: {simCourtLight ? 'Encendido automático' : 'Apagado'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSimCourtLight((v) => !v)}
                    className={`min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors duration-150 motion-reduce:transition-none inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                      simCourtLight
                        ? 'bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#132A45] dark:hover:bg-[#1B385C] dark:border dark:border-[#2A4A70]'
                        : 'bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5 shrink-0" />
                    <span>{simCourtLight ? 'Apagar' : 'Encender'}</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                  <span>Franja programada</span>
                  <span className="font-mono font-semibold text-[#0B1A2D] dark:text-white tabular-nums">
                    19:25 — 21:10
                  </span>
                </div>
              </div>

              {/* PIN Lock Panel */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] flex flex-col justify-between space-y-4 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-150 motion-reduce:transition-none shrink-0 ${
                      !simDoorLocked
                        ? 'bg-[#B7F229] text-[#0B1A2D]'
                        : 'bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229]'
                    }`}
                  >
                    <LockKeyhole className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white leading-snug">
                      Cerradura de Acceso · Puerta Sur
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Estado: {!simDoorLocked ? 'Puerta abierta' : 'Cerrada'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <form onSubmit={handleTestPin} className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="PIN (4829)"
                      value={simKeyInput}
                      onChange={(e) => setSimKeyInput(e.target.value)}
                      className="flex-1 min-w-0 min-h-[40px] px-3 py-2 rounded-xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white placeholder-slate-400 font-mono tabular-nums text-xs focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] text-center"
                    />
                    <button
                      type="submit"
                      className="min-h-[40px] px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition-colors duration-150 motion-reduce:transition-none cursor-pointer shrink-0"
                    >
                      Validar
                    </button>
                  </form>

                  {simAccessStatus === 'granted' && (
                    <div className="text-xs font-semibold text-[#0B1A2D] dark:text-[#B7F229] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#B7F229] text-[#0B1A2D] inline-flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                      <span>Acceso concedido. Puerta desbloqueada temporalmente.</span>
                    </div>
                  )}
                  {simAccessStatus === 'denied' && (
                    <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      PIN no válido para esta franja. Prueba con 4829.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CorporateContainer>
      </section>

      {/* 2. HARDWARE CATALOG WITH WRAPPED FILTERS & NUMBERED CARDS */}
      <section className="py-12 sm:py-16 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer className="space-y-8">
          <div className="space-y-5">
            <div className="space-y-2 max-w-2xl">
              <CorporateEyebrow accent="navy">Equipamiento compatible</CorporateEyebrow>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight font-display">
                Sistemas y módulos conectables por pista y acceso
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Instalación limpia mediante cuadros eléctricos estándar y electricista autorizado.
              </p>
            </div>

            {/* Wrapped Multi-line Category Filters — Zero Horizontal Clipping on Mobile */}
            <div
              role="tablist"
              aria-label="Filtrar sistemas de domótica por categoría"
              className="flex flex-wrap items-center gap-1.5 sm:gap-2"
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 motion-reduce:transition-none cursor-pointer border ${
                      active
                        ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                        : 'bg-white dark:bg-[#0E2239] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 hover:text-[#0B1A2D] dark:hover:text-white'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        active
                          ? 'text-[#B7F229] dark:text-[#0B1A2D]/80'
                          : 'text-slate-400 dark:text-slate-400'
                      }`}
                    >
                      {String(cat.count).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch animate-float-in"
          >
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-white dark:bg-[#0E2239] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none min-w-0"
                >
                  <div className="space-y-4 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#132A45] text-[#B7F229] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right">
                        <span className="font-mono font-bold tabular-nums mr-1.5 text-[#0B1A2D] dark:text-[#B7F229]">
                          {item.order}
                        </span>
                        · {item.categoryLabel}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white leading-snug font-display">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                      {item.specs.map((spec) => (
                        <li key={spec} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0B1A2D] dark:text-[#B7F229]">
                      {item.benefit}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </CorporateContainer>
      </section>

      {/* 3. CLOSING DARK CTA BANNER */}
      <section className="py-14 sm:py-18">
        <CorporateContainer>
          <CorporateCtaBanner
            eyebrow="Setmio Pro · Suscripción modular con alta guiada"
            title="Convierte tus pistas en instalaciones autónomas y eficientes"
            subtitle="Preparamos un esquema técnico adaptado al número de pistas, puertas y cuadros eléctricos de tu club o ayuntamiento con implantación asistida y sin comisiones por reserva."
            primaryLabel="Registrarse"
            onPrimary={handleOpenRegisterClick}
            secondaryLabel="Explorar demo por perfil"
            onSecondary={handleOpenDemoClick}
          />
        </CorporateContainer>
      </section>

      <RoleSelectorModal
        isOpen={localDemoModalOpen}
        onClose={() => setLocalDemoModalOpen(false)}
      />
    </div>
  );
}

export default ModulosDomoticaPage;
