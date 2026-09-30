import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Shield,
  Zap,
  Users,
  Coffee,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
} from 'lucide-react';

export const AboutClubView: React.FC = () => {
  const { currentTenant, setPublicPage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Sobre Pádel San Mateo
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          El Complejo de Pádel de Referencia en Galicia
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Nacido en Narón (A Coruña) con el propósito de ofrecer a los apasionados del pádel unas instalaciones de máxima categoría profesional, con el mejor césped del circuito internacional y un club social acogedor.
        </p>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">8 Pistas Panorámicas WPT</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Césped oficial Mondo Supercourt XN azul y negro, cristales templados sin pilares angulares para visión 360° y 11 metros de altura libre sin vigas obstructivas.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Iluminación LED TV</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            8 focos LED asimétricos por pista con más de 650 lux homogéneos, diseñados específicamente para transmisiones de alta definición y juego nocturno sin deslumbramiento.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Coffee className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Club Social & Cafetería</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Zona de descanso climatizada con vistas directas a la pista central, pantallas gigantes para torneos profesionales y zona de terraza exterior.
          </p>
        </div>
      </div>

      {/* Editorial Split Section with Court photos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Compromiso con el Jugador
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Diseñado por y para jugadores de pádel
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            En Pádel San Mateo cuidamos cada detalle: vestuarios amplios climatizados con taquillas individuales y duchas de presión, zona de calentamiento dinámico con gomas y foam rollers, y una tienda pro donde puedes probar cualquier pala en pista antes de comprarla.
          </p>

          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Aparcamiento privado vigilado gratuito con 80 plazas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Desfibrilador semiautomático DESA y personal certificado en primeros auxilios</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Test de palas Bullpadel, Nox, Babolat y Siux en pista</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Cerraduras inteligentes con PIN automatizado para socios</span>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={() => {
                setPublicPage('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar Pista</span>
            </button>
            <button
              onClick={() => {
                setPublicPage('courts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Ver Todas las Pistas
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl h-80 sm:h-96">
          <img
            src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80"
            alt="Pistas panorámicas de Pádel San Mateo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
