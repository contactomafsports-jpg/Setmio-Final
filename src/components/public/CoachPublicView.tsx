import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Video,
  Users,
  Award,
} from 'lucide-react';

export const CoachPublicView: React.FC = () => {
  const { currentTenant, triggerDemoToast, setPublicPage } = useApp();
  const coachStats = currentTenant.coachStats || {
    certifications: ['Entrenador Nacional Nivel 2 FEP', 'Especialista en Biomecánica de Golpeo'],
    hourlyRate: 45.0,
    activeStudents: 38,
    weeklyLessons: 24,
    rating: 4.96,
  };

  const [selectedService, setSelectedService] = useState<'individual' | 'duo' | 'clinic'>('individual');

  const services = [
    {
      id: 'individual',
      title: 'Clase Particular 1 a 1',
      price: `${coachStats.hourlyRate.toFixed(2)} €/h`,
      desc: 'Sesión intensiva con videoanálisis en directo en pista, corrección biomecánica y cuaderno de trabajo personalizado.',
      features: ['Videoanálisis HD con software de trazada', 'Bolas Head Pro nuevas incluidas', 'Pista cubierta climatizada', 'Plan de deberes tácticos'],
    },
    {
      id: 'duo',
      title: 'Entrenamiento Parejas de Competición',
      price: '60.00 €/h (30€/jugador)',
      desc: 'Optimización de juego en pareja, sincronización de transiciones defensa-ataque y patrones tácticos en torneos.',
      features: ['Táctica defensiva y salidas de pared', 'Estrategia de saque y resto', 'Simulación de puntos de presión', 'Seguimiento de torneos'],
    },
    {
      id: 'clinic',
      title: 'Clinic Intensivo de Fin de Semana',
      price: '120.00 € / jugador',
      desc: 'Sábado y domingo (8 horas totales de entrenamiento). Grupos reducidos de 4 jugadores con preparación física y torneo final.',
      features: ['8 horas de pista y preparación física', 'Comida con el entrenador incluida', 'Test de palas de gama alta', 'Certificado y video grabado'],
    },
  ];

  return (
    <div className="space-y-16 pb-16 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider border border-blue-500/20">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{currentTenant.branding.badgeText}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {currentTenant.branding.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed">
                {currentTenant.branding.heroSubtitle}
              </p>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{coachStats.rating}</span>
                  <span className="text-slate-500 font-normal">(+120 valoraciones de alumnos)</span>
                </div>
                <span>·</span>
                <div className="text-blue-600 dark:text-blue-400 font-bold">
                  {coachStats.activeStudents} Alumnos Activos
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => triggerDemoToast('Solicitud de Clase', 'Formulario de reserva de clase con Mateo Varela.', 'success')}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reservar Sesión de Entrenamiento</span>
                </button>
                <button
                  onClick={() => {
                    setPublicPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs border border-slate-300 dark:border-slate-700 transition"
                >
                  Consultar Disponibilidad
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                <img
                  src={currentTenant.branding.heroImageUrl}
                  alt={currentTenant.name}
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white text-xs">
                  <div className="font-bold text-base">{currentTenant.name}</div>
                  <div className="text-blue-300 text-[11px]">Entrenador Nacional Titulado FEP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services and Rates Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Metodología & Formatos</span>
          <h2 className="text-3xl font-black">Programas y Tarifas de Entrenamiento</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{s.price}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  {s.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => triggerDemoToast('Reserva de Clase', `Solicitud enviada para "${s.title}". El entrenador te responderá en menos de 2h.`, 'success')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition"
              >
                Solicitar Reserva
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
