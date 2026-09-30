import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Court } from '../../types/database';
import { Zap, Calendar, Check, Info, ShieldCheck, ArrowRight } from 'lucide-react';

export const CourtsView: React.FC = () => {
  const { courts, setPublicPage } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'panoramic' | 'single' | 'covered'>('all');

  const filteredCourts = courts.filter((court) => {
    if (filterType === 'panoramic') return court.isPanoramic;
    if (filterType === 'single') return court.isSingle;
    if (filterType === 'covered') return court.courtType === 'covered';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Instalaciones Deportivas
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Nuestras 8 Pistas en Narón
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl">
            Todas nuestras pistas cuentan con césped sintético texturizado de última generación, iluminación LED de alta potencia y cristales templados de 12mm.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas (8)
          </button>
          <button
            onClick={() => setFilterType('panoramic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'panoramic'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Panorámicas
          </button>
          <button
            onClick={() => setFilterType('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'single'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Individual 1vs1
          </button>
          <button
            onClick={() => setFilterType('covered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'covered'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
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
            className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group shadow-xl"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={court.photoUrl}
                alt={court.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-950/90 text-xs font-mono font-bold text-emerald-400 border border-slate-700">
                {court.hourlyRate.toFixed(2)} €/h
              </div>
              <div className="absolute bottom-3 left-3 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{court.courtType === 'indoor' ? 'Indoor Climatizada' : 'Cubierta Exterior'}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {court.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1">{court.surface}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Focos LED TV</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cristal 12mm templado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{court.isSingle ? 'Pista 1 vs 1' : 'Pista Dobles 10x20'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cerradura automática PIN</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Tarifa: <strong className="text-white">{(court.hourlyRate * 1.5).toFixed(2)}€</strong> / 90min
                </span>

                <button
                  onClick={() => {
                    setPublicPage('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
