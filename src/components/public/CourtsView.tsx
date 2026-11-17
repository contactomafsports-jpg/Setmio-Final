import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Court } from '../../types/database';
import heroPadelImg from '../../assets/images/hero_padel_club_1794872242820.jpg';
import {
  Zap,
  Calendar,
  Check,
  ShieldCheck,
  X,
  Clock,
  Sparkles,
  Maximize2,
  Camera,
  KeyRound,
  Layers,
} from 'lucide-react';

export const CourtsView: React.FC = () => {
  const { courts, setPublicPage, setSelectedCourtsForBooking } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'panoramic' | 'single' | 'covered'>('all');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const filteredCourts = courts.filter((court) => {
    if (filterType === 'panoramic') return court.isPanoramic;
    if (filterType === 'single') return court.isSingle;
    if (filterType === 'covered') return court.courtType === 'covered';
    return true;
  });

  const handleBookCourt = (court: Court) => {
    setSelectedCourt(null);
    setSelectedCourtsForBooking([court.id]);
    setPublicPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
              Instalaciones Deportivas Oficiales
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#0B1A2D] dark:text-white tracking-tight text-balance">
              Nuestras 8 Pistas
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Todas nuestras pistas cuentan con césped texturizado Mondo Supercourt XN, iluminación LED de competición TV y cristales templados de 12 mm homologados por la Federación Internacional de Pádel.
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl self-start md:self-auto">
            {[
              { id: 'all', label: 'Todas (8)' },
              { id: 'panoramic', label: 'Panorámicas' },
              { id: 'single', label: 'Individual 1vs1' },
              { id: 'covered', label: 'Cubierta Exterior' },
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <div
              key={court.id}
              className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden hover:border-[#8B5CF6]/50 dark:hover:border-[#B7F229]/40 transition-colors flex flex-col justify-between group"
            >
              <div
                className="relative h-52 overflow-hidden cursor-pointer bg-[#0B1A2D]"
                onClick={() => setSelectedCourt(court)}
              >
                <img
                  src={court.photoUrl || heroPadelImg}
                  alt={court.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D]/85 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#0B1A2D]/90 text-xs font-mono tabular-nums font-bold text-[#B7F229] border border-[#1A314D]">
                  {court.hourlyRate.toFixed(2)} €/h
                </div>
                <div className="absolute bottom-3 left-3 text-xs font-semibold text-white">
                  {court.courtType === 'indoor' ? 'Indoor Climatizada' : 'Cubierta Exterior'}
                </div>
                <div className="absolute bottom-3 right-3 text-slate-200 flex items-center gap-1 text-xs bg-[#0B1A2D]/85 px-2.5 py-1 rounded-lg border border-[#1A314D]">
                  <Maximize2 className="w-3 h-3" />
                  <span>Detalle</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3
                    onClick={() => setSelectedCourt(court)}
                    className="text-lg font-bold text-[#0B1A2D] dark:text-white group-hover:text-[#8B5CF6] dark:group-hover:text-[#B7F229] transition-colors cursor-pointer tracking-tight"
                  >
                    {court.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{court.surface}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                      <span>Focos LED TV</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                      <span>Cristal 12mm templado</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                      <span>{court.isSingle ? 'Pista 1 vs 1' : 'Pista Dobles 10x20'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                      <span>Cerradura PIN domótica</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    90 min:{' '}
                    <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">
                      {(court.hourlyRate * 1.5).toFixed(2)} €
                    </strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCourt(court)}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1A314D] text-xs font-semibold text-[#0B1A2D] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-[#132A45] transition-colors cursor-pointer"
                    >
                      Ficha
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBookCourt(court)}
                      className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Reservar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FULL COURT DETAIL MODAL */}
        {selectedCourt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/80 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#0B1A2D] dark:text-slate-100 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setSelectedCourt(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Cerrar ficha"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] mb-1">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Ficha Técnica Detallada de Pista</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight">
                {selectedCourt.name}
              </h2>

              <div className="relative rounded-2xl overflow-hidden mt-5 h-64 sm:h-72 border border-slate-200/80 dark:border-[#1A314D] bg-[#0B1A2D]">
                <img
                  src={selectedCourt.photoUrl || heroPadelImg}
                  alt={selectedCourt.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-[#0B1A2D]/90 text-xs font-semibold text-[#B7F229] border border-[#1A314D]">
                  {selectedCourt.isPanoramic ? 'Panorámica Visión Total 360°' : 'Pista Estándar Reglamentaria'}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
                  Especificaciones Técnicas & Normativa FIP
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#8B5CF6] dark:text-[#B7F229] font-bold">
                      <Layers className="w-4 h-4 shrink-0" />
                      <span>Césped Artificial</span>
                    </div>
                    <div className="text-[#0B1A2D] dark:text-white font-semibold">{selectedCourt.surface}</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Mondo Supercourt XN texturizado azul con arena de sílice micronizada.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#8B5CF6] dark:text-[#a78bfa] font-bold">
                      <Zap className="w-4 h-4 shrink-0" />
                      <span>Iluminación Oficial</span>
                    </div>
                    <div className="text-[#0B1A2D] dark:text-white font-semibold">8 Proyectores LED TV</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      &gt;650 lux homogéneos, cero deslumbramiento cenital.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#8B5CF6] dark:text-[#B7F229] font-bold">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Cristales Homologados</span>
                    </div>
                    <div className="text-[#0B1A2D] dark:text-white font-semibold">Vidrio Templado 12 mm</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Sin pilares angulares para juego continuo exterior.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#8B5CF6] dark:text-[#a78bfa] font-bold">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Dimensiones & Altura</span>
                    </div>
                    <div className="text-[#0B1A2D] dark:text-white font-semibold">
                      {selectedCourt.isSingle ? '6 × 20 m (Individual)' : '10 × 20 m (Dobles)'}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      11 metros de altura libre sin obstáculos.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#8B5CF6] dark:text-[#B7F229] font-bold">
                      <KeyRound className="w-4 h-4 shrink-0" />
                      <span>Acceso Domótico</span>
                    </div>
                    <div className="text-[#0B1A2D] dark:text-white font-semibold">Cerradura con Código PIN</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      El PIN se activa 10 min antes y enciende la luz automáticamente.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#8B5CF6] dark:text-[#a78bfa] font-bold">
                      <Camera className="w-4 h-4 shrink-0" />
                      <span>Grabación en Pista</span>
                    </div>
                    <div className="text-[#0B1A2D] dark:text-white font-semibold">Cámara HD Integrada</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Pulsador en red para guardar los mejores puntos del partido.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-[#1A314D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Tarifas de Alquiler</div>
                  <div className="text-lg font-bold text-[#0B1A2D] dark:text-white mt-0.5 font-mono tabular-nums">
                    {(selectedCourt.hourlyRate * 1.5).toFixed(2)} €{' '}
                    <span className="text-xs font-sans font-normal text-slate-500">/ 90 min (Hora Punta)</span>
                  </div>
                  <div className="text-xs text-[#8B5CF6] dark:text-[#B7F229] font-mono tabular-nums font-medium">
                    {selectedCourt.hourlyRate.toFixed(2)} € / 60 min · {(selectedCourt.hourlyRate * 2).toFixed(2)} € / 120 min
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCourt(null)}
                    className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] text-xs font-semibold text-[#0B1A2D] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-[#132A45] transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBookCourt(selectedCourt)}
                    className="min-h-[42px] px-6 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Reservar Esta Pista Ahora</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
