import React from 'react';
import { useApp } from '../../../context/AppContext';
import { AdminDashboard as ClubDashboard } from '../AdminDashboard';
import { ProAthleteDashboard } from './ProAthleteDashboard';
import {
  Trophy,
  Award,
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  Package,
  ShoppingBag,
  Zap,
  CheckCircle2,
  FileText,
  Video,
  Download,
} from 'lucide-react';

export const ContextualDashboard: React.FC = () => {
  const { currentTenant, setAdminTab, triggerDemoToast } = useApp();

  // 1. PADEL_CLUB: Use the rich club dashboard
  if (currentTenant.type === 'PADEL_CLUB') {
    return <ClubDashboard />;
  }

  // 2. PRO_PLAYER DASHBOARD (Gestión integral del Jugador Profesional)
  if (currentTenant.type === 'PRO_PLAYER') {
    return <ProAthleteDashboard />;
  }

  // 3. COACH DASHBOARD (Datos 100% propios del profesor: clases impartidas, alumnos y cobros directos)
  if (currentTenant.type === 'COACH') {
    const coachStats = currentTenant.coachStats || {
      certifications: ['Entrenador Nacional Nivel 2 FEP'],
      hourlyRate: 45.0,
      activeStudents: 38,
      weeklyLessons: 24,
      rating: 4.96,
    };

    const coachPrivateClasses = [
      {
        id: 'cpc-1',
        student: 'Carlos Méndez',
        type: 'Individual 1 vs 1',
        time: 'Hoy · 17:00 - 18:00',
        fee: 38.0,
        status: 'Cobrado',
        topic: 'Transición defensa-ataque y bandeja cruzada con efecto lateral.',
      },
      {
        id: 'cpc-2',
        student: 'Brais Quintana & Marcos Seijo',
        type: 'Pareja Competición',
        time: 'Hoy · 18:30 - 19:30',
        fee: 48.0,
        status: 'Cobrado',
        topic: 'Compenetración en la red y cobertura del centro en juego rápido.',
      },
      {
        id: 'cpc-3',
        student: 'Lucía Casal',
        type: 'Individual 1 vs 1',
        time: 'Mañana · 11:00 - 12:00',
        fee: 38.0,
        status: 'Pendiente',
        topic: 'Corrección de empuñadura continental y volea profunda.',
      },
    ];

    const coachDirectReceipts = [
      { id: 'rec-1', concept: 'Bono 4 Clases Individuales · Carlos Méndez', amount: 140.0, date: '01/10/2026', method: 'Transferencia Directa' },
      { id: 'rec-2', concept: 'Clase Particular 60 min · Brais Quintana', amount: 48.0, date: '02/10/2026', method: 'Bizum Entrenador' },
      { id: 'rec-3', concept: 'Clinic de Fin de Semana (4 alumnos)', amount: 240.0, date: '04/10/2026', method: 'Stripe Directo' },
    ];

    return (
      <div className="space-y-8 text-slate-100 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border border-blue-800/60 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Panel de Entrenador & Academia Personal
            </span>
            <h2 className="text-2xl font-black text-white">{currentTenant.name}</h2>
            <p className="text-xs text-slate-400">
              Agenda de clases particulares, seguimiento de alumnos y balance de honorarios propios.
            </p>
          </div>

          <button
            onClick={() => triggerDemoToast('Nueva Clase Particular', 'Horario reservado para clase particular en demo.', 'success')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs shadow-lg transition"
          >
            Añadir Clase a la Agenda
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Alumnos Activos</span>
            <div className="text-3xl font-black text-blue-400 font-mono">{coachStats.activeStudents}</div>
            <span className="text-[11px] text-emerald-400 font-semibold">+4 nuevos este mes</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Horas Semanales</span>
            <div className="text-3xl font-black text-white font-mono">{coachStats.weeklyLessons} h</div>
            <span className="text-[11px] text-slate-400">Capacidad al 92%</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Honorarios Directos (Mes)</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">2.150 €</div>
            <span className="text-[11px] text-emerald-400 font-semibold">100% ingreso directo</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Valoración Alumnos</span>
            <div className="text-3xl font-black text-amber-400 font-mono">{coachStats.rating} / 5.0</div>
            <span className="text-[11px] text-amber-400 font-semibold">Excelente · 48 reseñas</span>
          </div>
        </div>

        {/* Sección 1: Clases Impartidas Recientes / Próximas */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Mis Próximas Clases Impartidas</span>
            </h3>
            <button
              onClick={() => setAdminTab('agenda')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition"
            >
              Ver calendario completo →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {coachPrivateClasses.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold text-[10px]">
                    {cls.type}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{cls.fee.toFixed(2)} €</span>
                </div>
                <div>
                  <div className="font-extrabold text-white text-xs">{cls.student}</div>
                  <div className="text-[11px] text-slate-400">{cls.time}</div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {cls.topic}
                </p>
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Estado:</span>
                  <span className={`font-bold ${cls.status === 'Cobrado' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {cls.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección 2: Cobros Directos del Profesor */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Mis Cobros Directos de Alumnos</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-bold">Liquidación sin intermediación</span>
          </div>

          <div className="space-y-2">
            {coachDirectReceipts.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{rec.concept}</div>
                  <div className="text-[10px] text-slate-400">{rec.date} · {rec.method}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-emerald-400 text-sm">+{rec.amount.toFixed(2)} €</span>
                  <div className="text-[9px] text-emerald-400 font-semibold">Directo a cuenta</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. ONLINE STORE DASHBOARD
  if (currentTenant.type === 'ONLINE_STORE') {
    return (
      <div className="space-y-8 text-slate-100 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-orange-950/80 via-slate-900 to-slate-900 border border-orange-800/60 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Panel de Tienda Online & Fulfillment
            </span>
            <h2 className="text-2xl font-black text-white">{currentTenant.name}</h2>
            <p className="text-xs text-slate-400">
              Ventas ecommerce, stock en almacén y envíos 24h a toda la península.
            </p>
          </div>

          <button
            onClick={() => setAdminTab('shop')}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 font-bold text-slate-950 text-xs shadow-lg transition"
          >
            Gestionar Catálogo de Palas
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Ventas este Mes (GMV)</span>
            <div className="text-3xl font-black text-orange-400 font-mono">18.490 €</div>
            <span className="text-[11px] text-emerald-400 font-semibold">+18% ventas</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Pedidos Enviados</span>
            <div className="text-3xl font-black text-white font-mono">112</div>
            <span className="text-[11px] text-slate-400">Ticket medio: 165 €</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Pendientes de Envío</span>
            <div className="text-3xl font-black text-cyan-400 font-mono">6 pedidos</div>
            <span className="text-[11px] text-cyan-400">Recogida GLS 17:00</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Alertas de Bajo Stock</span>
            <div className="text-3xl font-black text-rose-400 font-mono">2 modelos</div>
            <span className="text-[11px] text-rose-400">Bullpadel Vertex 04</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. TOURNAMENT_ORGANIZER DASHBOARD (Competiciones, Ligas, Patrocinadores, Sedes)
  if (currentTenant.type === 'TOURNAMENT_ORGANIZER') {
    return (
      <div className="space-y-8 text-slate-100 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/60 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Panel del Organizador Oficial de Competiciones & Ligas
            </span>
            <h2 className="text-2xl font-black text-white">{currentTenant.name}</h2>
            <p className="text-xs text-slate-400">
              Gestión centralizada de torneos, cuadros eliminatorios, patrocinadores y asignación de sedes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminTab('tournaments')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs shadow-lg transition"
            >
              Gestionar Competiciones
            </button>
            <button
              onClick={() => setAdminTab('matches')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-200 text-xs transition"
            >
              Ligas & Cuadros
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Torneos en Calendario</span>
            <div className="text-3xl font-black text-purple-400 font-mono">14 Pruebas</div>
            <span className="text-[11px] text-slate-400">Circuito Anual 2026</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Parejas Inscritas Total</span>
            <div className="text-3xl font-black text-white font-mono">380 parejas</div>
            <span className="text-[11px] text-emerald-400 font-semibold">+45 esta semana</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Bolsa de Premios Anual</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">25.000 €</div>
            <span className="text-[11px] text-slate-400">Repartidos en premios</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Sedes Vinculadas</span>
            <div className="text-3xl font-black text-cyan-400 font-mono">6 Clubes</div>
            <span className="text-[11px] text-cyan-400">Instalaciones oficiales</span>
          </div>
        </div>

        {/* Módulos de Acceso Rápido del Organizador */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setAdminTab('tournaments')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-left transition space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-white group-hover:text-purple-400 transition">Competiciones</div>
            <div className="text-xs text-slate-400">Inscripciones, categorías y premios oficiales.</div>
          </button>

          <button
            onClick={() => setAdminTab('matches')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-left transition space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-white group-hover:text-indigo-400 transition">Ligas & Cuadros</div>
            <div className="text-xs text-slate-400">Cuadros de eliminatorias y fases de grupos.</div>
          </button>

          <button
            onClick={() => setAdminTab('customers')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left transition space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition">Patrocinadores</div>
            <div className="text-xs text-slate-400">Marcas colaboradoras y acuerdos comerciales.</div>
          </button>

          <button
            onClick={() => setAdminTab('courts_management')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-left transition space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-white group-hover:text-cyan-400 transition">Sedes de Evento</div>
            <div className="text-xs text-slate-400">Clubes colaboradores y asignación de pistas.</div>
          </button>
        </div>
      </div>
    );
  }

  // Fallback to club dashboard
  return <ClubDashboard />;
};
