import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
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
import {
  CorporateBreadcrumb,
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporatePrimaryButton,
  CorporateSecondaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';

interface ModulosDomoticaPageProps {
  onBack: () => void;
  onOpenDemo: () => void;
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

export function ModulosDomoticaPage({ onBack, onOpenDemo }: ModulosDomoticaPageProps) {
  const { setPublicPage } = useApp();

  const [simCourtLight, setSimCourtLight] = useState<boolean>(true);
  const [simDoorLocked, setSimDoorLocked] = useState<boolean>(true);
  const [simKeyInput, setSimKeyInput] = useState<string>('');
  const [simAccessStatus, setSimAccessStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [selectedCategory, setSelectedCategory] = useState<HardwareCategory>('all');

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

  const handleTestPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (simKeyInput === '4829' || simKeyInput === '1234') {
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

  const categories: { id: HardwareCategory; label: string }[] = [
    { id: 'all', label: 'Todos los sistemas' },
    { id: 'energy', label: 'Iluminación y Energía' },
    { id: 'access', label: 'Control de Accesos' },
    { id: 'media', label: 'Pistas y Señalización' },
  ];

  const visibleItems =
    selectedCategory === 'all'
      ? DOMOTICA_ITEMS
      : DOMOTICA_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors duration-200">
      <CorporateContainer className="space-y-14">
        <CorporateBreadcrumb
          items={[
            { label: 'Inicio', onClick: () => navigate('/', 'home') },
            { label: 'Domótica y Automatizaciones' },
          ]}
          onBack={onBack}
          backLabel="Volver al inicio"
        />

        {/* Hero */}
        <section className="max-w-3xl space-y-5">
          <CorporateEyebrow>Setmio IoT · Pistas Desatendidas</CorporateEyebrow>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
            Automatiza la iluminación LED y el acceso por PIN de cada pista.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Conecta tus cuadros eléctricos y cerraduras directamente al motor de reservas para abrir horarios de mañana y noche sin presencia continua en recepción.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <CorporatePrimaryButton onClick={onOpenDemo}>
              Solicitar estudio de domótica
            </CorporatePrimaryButton>
            <CorporateSecondaryButton onClick={() => navigate('/modulos', 'features')}>
              Ver todos los módulos
            </CorporateSecondaryButton>
          </div>
        </section>

        {/* Interactive Minimalist Controller Preview */}
        <section className="rounded-3xl border border-slate-200/90 dark:border-[#1A314D] bg-[#F7F9FC] dark:bg-[#0E2239] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-[#1A314D]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0B1A2D] dark:text-[#B7F229]">
                <Cpu className="w-4 h-4" />
                <span>Simulación operativa de pista</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Prueba cómo responde el encendido eléctrico y el teclado PIN temporal ante una reserva confirmada.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              PIN de prueba: 4829
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LED Lighting Panel */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] flex flex-col justify-between space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      simCourtLight
                        ? 'bg-[#B7F229] text-[#0B1A2D]'
                        : 'bg-slate-100 dark:bg-[#0E2239] text-slate-400 border border-slate-200 dark:border-[#1A314D]'
                    }`}
                  >
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                      Circuito Focos LED · Pista 1
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Estado actual: {simCourtLight ? 'Encendido automático' : 'Apagado'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSimCourtLight(!simCourtLight)}
                  className={`min-h-[38px] px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    simCourtLight
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{simCourtLight ? 'Apagar' : 'Encender'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Franja programada</span>
                <span className="font-mono font-semibold text-[#0B1A2D] dark:text-white tabular-nums">
                  19:25 — 21:10
                </span>
              </div>
            </div>

            {/* PIN Lock Panel */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1A2D] border border-slate-200/90 dark:border-[#1A314D] space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      !simDoorLocked
                        ? 'bg-[#B7F229] text-[#0B1A2D]'
                        : 'bg-slate-100 dark:bg-[#0E2239] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#1A314D]'
                    }`}
                  >
                    <LockKeyhole className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                      Cerradura de Acceso · Puerta Sur
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Estado actual: {!simDoorLocked ? 'Puerta abierta' : 'Cerrada'}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleTestPin} className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Introduce PIN (4829)"
                  value={simKeyInput}
                  onChange={(e) => setSimKeyInput(e.target.value)}
                  className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white placeholder-slate-400 font-mono tabular-nums text-xs focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] text-center"
                />
                <button
                  type="submit"
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition-colors cursor-pointer"
                >
                  Validar
                </button>
              </form>

              {simAccessStatus === 'granted' && (
                <div className="text-xs font-semibold text-emerald-700 dark:text-[#B7F229] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
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
        </section>

        {/* Hardware Catalog with L2/L3 Filter */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight font-display">
                Equipamiento y módulos compatibles
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Instalación limpia mediante cuadros eléctricos estándar y electricista autorizado.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'bg-[#F7F9FC] dark:bg-[#0E2239] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-[#1A314D]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200/90 dark:border-[#1A314D] bg-[#F7F9FC] dark:bg-[#0E2239] p-6 sm:p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229]/15 text-[#B7F229] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {item.order} · {item.categoryLabel}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-[#1A314D] text-xs text-slate-700 dark:text-slate-300">
                      {item.specs.map((spec) => (
                        <li key={spec} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0B1A2D] dark:text-[#B7F229]">
                      {item.benefit}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <CorporateCtaBanner
          eyebrow="Clubes y Administraciones Públicas"
          title="Convierte tus pistas en instalaciones autónomas y eficientes"
          subtitle="Preparamos un esquema técnico adaptado al número de pistas, puertas y cuadros eléctricos de tu centro."
          primaryLabel="Solicitar asesoramiento"
          onPrimary={() => navigate('/contacto', 'contact')}
          secondaryLabel="Ver demo interactiva"
          onSecondary={onOpenDemo}
        />
      </CorporateContainer>
    </main>
  );
}

export default ModulosDomoticaPage;
