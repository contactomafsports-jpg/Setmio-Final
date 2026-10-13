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

  // 3. COACH DASHBOARD
  if (currentTenant.type === 'COACH') {
    const coachStats = currentTenant.coachStats || {
      certifications: ['Entrenador Nacional Nivel 2 FEP'],
      hourlyRate: 45.0,
      activeStudents: 38,
      weeklyLessons: 24,
      rating: 4.96,
    };

    return (
      <div className="space-y-8 text-slate-100 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border border-blue-800/60 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Panel de Entrenador & Academia Personal
            </span>
            <h2 className="text-2xl font-black text-white">{currentTenant.name}</h2>
            <p className="text-xs text-slate-400">
              Agenda de clases privadas, seguimiento de alumnos y balance de honorarios.
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
            <span className="text-xs text-slate-400">Tarifa Media</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">{coachStats.hourlyRate.toFixed(2)} €/h</div>
            <span className="text-[11px] text-slate-400">Pista incluida</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Valoración Alumnos</span>
            <div className="text-3xl font-black text-amber-400 font-mono">{coachStats.rating} / 5.0</div>
            <span className="text-[11px] text-amber-400 font-semibold">Excelente</span>
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

  // 5. TOURNAMENT_ORGANIZER DASHBOARD
  if (currentTenant.type === 'TOURNAMENT_ORGANIZER') {
    return (
      <div className="space-y-8 text-slate-100 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/60 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Panel del Circuito Oficial de Torneos
            </span>
            <h2 className="text-2xl font-black text-white">{currentTenant.name}</h2>
            <p className="text-xs text-slate-400">
              Cuadros eliminatorios, recaudación de inscripciones y gestión de jueces árbitros.
            </p>
          </div>

          <button
            onClick={() => setAdminTab('tournaments')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs shadow-lg transition"
          >
            Generar Cuadros de Torneo
          </button>
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
            <span className="text-xs text-slate-400">Árbitros Asignados</span>
            <div className="text-3xl font-black text-cyan-400 font-mono">8 Jueces</div>
            <span className="text-[11px] text-cyan-400">Titulados FEP</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to club dashboard
  return <ClubDashboard />;
};
