import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Court } from '../../types/database';
import {
  Zap,
  Calendar,
  Check,
  Info,
  ShieldCheck,
  ArrowRight,
  X,
  Clock,
  Sparkles,
  Maximize2,
  Camera,
  KeyRound,
  Layers,
} from 'lucide-react';

export const CourtsView: React.FC = () => {
  const { courts, setPublicPage } = useApp();
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
    setPublicPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Instalaciones Deportivas Oficiales
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Nuestras 8 Pistas en Narón
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
            Todas nuestras pistas cuentan con césped texturizado Mondo Supercourt XN, iluminación LED de competición TV y cristales templados de 12 mm homologados por la Federación Internacional de Pádel.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Todas (8)
          </button>
          <button
            onClick={() => setFilterType('panoramic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'panoramic'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Panorámicas
          </button>
          <button
            onClick={() => setFilterType('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'single'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Individual 1vs1
          </button>
          <button
            onClick={() => setFilterType('covered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'covered'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Cubierta Exterior
          </button>
        </div>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourts.map((court) => (
          <div
            key={court.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between group shadow-sm hover:shadow-lg"
          >
            <div
              className="relative h-52 overflow-hidden cursor-pointer"
              onClick={() => setSelectedCourt(court)}
            >
              <img
                src={court.photoUrl}
                alt={court.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/90 text-xs font-mono font-bold text-emerald-400 border border-slate-700">
                {court.hourlyRate.toFixed(2)} €/h
              </div>
              <div className="absolute bottom-3 left-3 text-[11px] font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{court.courtType === 'indoor' ? 'Indoor Climatizada' : 'Cubierta Exterior'}</span>
              </div>
              <div className="absolute bottom-3 right-3 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-700">
                <Maximize2 className="w-3 h-3" />
                <span>Detalle</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3
                  onClick={() => setSelectedCourt(court)}
                  className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {court.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{court.surface}</p>

                <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Focos LED TV</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Cristal 12mm templado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{court.isSingle ? 'Pista 1 vs 1' : 'Pista Dobles 10x20'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Cerradura PIN domótica</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Tarifa 90min: <strong className="text-slate-900 dark:text-white">{(court.hourlyRate * 1.5).toFixed(2)}€</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCourt(court)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Ficha
                  </button>

                  <button
                    onClick={() => handleBookCourt(court)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedCourt(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Cerrar ficha"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Ficha Técnica Detallada de Pista</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedCourt.name}
            </h2>

            {/* Image Preview */}
            <div className="relative rounded-2xl overflow-hidden mt-4 h-64 sm:h-72 border border-slate-200 dark:border-slate-800">
              <img
                src={selectedCourt.photoUrl}
                alt={selectedCourt.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-white border border-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedCourt.isPanoramic ? 'Panorámica Visión Total 360°' : 'Pista Estándar Reglamentaria'}</span>
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Especificaciones Técnicas & Normativa FIP
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Layers className="w-4 h-4" />
                    <span>Césped Artificial</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">{selectedCourt.surface}</div>
                  <div className="text-[11px] text-slate-500">Mondo Supercourt XN texturizado azul con arena de sílice micronizada.</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-600 dark:text-cyan-400 font-bold">
                    <Zap className="w-4 h-4" />
                    <span>Iluminación Oficial</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">8 Proyectores LED TV</div>
                  <div className="text-[11px] text-slate-500">&gt;650 lux homogéneos, cero deslumbramiento cenital.</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cristales Homologados</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">Vidrio Templado 12 mm</div>
                  <div className="text-[11px] text-slate-500">Sin pilares angulares para juego continuo exterior.</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Dimensiones & Altura</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">{selectedCourt.isSingle ? '6 x 20 metros (Individual)' : '10 x 20 metros (Dobles)'}</div>
                  <div className="text-[11px] text-slate-500">11 metros de altura libre sin obstáculos.</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <KeyRound className="w-4 h-4" />
                    <span>Acceso Domótico</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">Cerradura con Código PIN</div>
                  <div className="text-[11px] text-slate-500">El PIN se activa 10 min antes y enciende la luz automáticamente.</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                    <Camera className="w-4 h-4" />
                    <span>Grabación en Pista</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">Cámara HD Integrada</div>
                  <div className="text-[11px] text-slate-500">Pulsador en red para guardar los mejores puntos del partido.</div>
                </div>
              </div>
            </div>

            {/* Rates Table */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Tarifas de Alquiler</div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {(selectedCourt.hourlyRate * 1.5).toFixed(2)} € <span className="text-xs font-normal text-slate-500">/ 90 min (Hora Punta)</span>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {selectedCourt.hourlyRate.toFixed(2)} € / 60 min · { (selectedCourt.hourlyRate * 2).toFixed(2) } € / 120 min
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCourt(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleBookCourt(selectedCourt)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Esta Pista Ahora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
