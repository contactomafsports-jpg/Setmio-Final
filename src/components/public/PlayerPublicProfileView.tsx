import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Trophy,
  Shield,
  Star,
  Activity,
  Calendar,
  Award,
  CheckCircle2,
  TrendingUp,
  Share2,
  Sparkles,
} from 'lucide-react';

interface PlayerPublicProfileViewProps {
  playerId?: string;
  onBack?: () => void;
}

export const PlayerPublicProfileView: React.FC<PlayerPublicProfileViewProps> = ({
  playerId,
  onBack,
}) => {
  const { currentTenant, setPublicPage, triggerDemoToast, currentUser } = useApp();

  // If a specific player is selected or fallback to current user
  const isSelf = !playerId || playerId === currentUser.id;
  const playerName = isSelf ? currentUser.name : 'Mateo Varela';
  const playerAvatar = isSelf
    ? currentUser.avatarUrl
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
  const playerLevel = isSelf ? currentUser.playLevel : 5.5;
  const isCaptain = true;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setPublicPage('teams');
    }
  };

  const handleShare = () => {
    triggerDemoToast(
      'Enlace Copiado',
      `Ficha pública de ${playerName} copiada al portapapeles.`,
      'info'
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP NAVIGATION WITH BACK BUTTON */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs shadow-xs transition"
          aria-label="Volver a la vista anterior"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
          title="Compartir perfil público"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Compartir Perfil</span>
        </button>
      </div>

      {/* 2. PLAYER HERO CARD */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.18),transparent_60%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <img
              src={playerAvatar}
              alt={playerName}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover ring-4 ring-emerald-500/40 shadow-2xl"
            />
            {isCaptain && (
              <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-lg ring-2 ring-slate-900">
                <Star className="w-3 h-3 fill-slate-950" />
                <span>Capitán</span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                Nivel FEP {playerLevel.toFixed(2)}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                {currentTenant.name}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[11px] font-semibold">
                Ficha Federada
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {playerName}
            </h1>

            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Jugador federado en {currentTenant.shortName}. Especialista en posición de revés con juego aéreo agresivo y bloqueo en red.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" /> Mano: <strong>Diestro</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> Posición: <strong>Revés / Ambas</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Pala oficial: <strong>Bullpadel Vertex 04</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PERFORMANCE STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">Partidos Jugados</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">48</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Temporada 2026</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">% Victorias</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">68.7%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">33 triunfos / 15 derrotas</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">Ranking Club</div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">#4</div>
          <div className="text-[11px] text-indigo-500 font-semibold">1ª Categoría Masculina</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">Torneos Disputados</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">6</div>
          <div className="text-[11px] text-amber-500 font-semibold">2 Campeonatos Oro</div>
        </div>
      </div>

      {/* 4. TEAM AFFILIATION & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teams card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Equipos Oficiales</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 text-[10px] font-bold uppercase">
                  Capitán Activo
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                  Pádel San Mateo - Absoluto Masculino A
                </h3>
                <p className="text-xs text-slate-500">1ª Categoría Gallega FGP</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Titular</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase">
                  Jugador Seleccionado
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                  San Mateo Liga Interclubes Oro
                </h3>
                <p className="text-xs text-slate-500">Competición Provincial</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Titular</span>
            </div>
          </div>
        </div>

        {/* Recent Trophies & Milestones */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Palmarés y Títulos</h2>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Campeón I Open Bullpadel San Mateo', date: 'Marzo 2026', category: '1ª Categoría Masculina' },
              { title: 'Subcampeón Máster de Invierno Narón', date: 'Enero 2026', category: 'Cuadro Principal' },
              { title: 'Premio Deportividad Federación Gallega', date: 'Diciembre 2025', category: 'Reconocimiento Comarcal' },
            ].map((trophy, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-xs flex-1">
                  <div className="font-bold text-slate-900 dark:text-white">{trophy.title}</div>
                  <div className="text-slate-500 text-[11px]">{trophy.category} · {trophy.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
