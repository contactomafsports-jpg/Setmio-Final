import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  Award,
  Heart,
  Bot,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Shield,
  Sparkles,
  CreditCard,
  User,
  Zap,
} from 'lucide-react';

export const PlayerPortal: React.FC = () => {
  const {
    currentTenant,
    currentUser,
    bookings,
    openMatches,
    favorites,
    products,
    courts,
    coaches,
    tournaments,
    setPublicPage,
    setCurrentView,
    triggerDemoToast,
  } = useApp();

  const [activePlayerTab, setActivePlayerTab] = useState<
    'overview' | 'bookings' | 'matches' | 'stats' | 'favorites' | 'ai_coach'
  >('overview');

  // Player personal bookings
  const myBookings = bookings.slice(0, 2);
  const myMatches = openMatches.slice(0, 2);

  // Favorite items resolved
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const favoriteCourts = courts.filter((c) => favorites.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Player Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-8 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">
                {currentUser.playLevel.toFixed(2)}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  Socio #SM-408
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {currentTenant.name} · Posición preferida: <strong>Revés</strong> · Diestro
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentView('public');
                setPublicPage('booking');
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar Pista</span>
            </button>
            <button
              onClick={() => setActivePlayerTab('ai_coach')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>AI Coach</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-4">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActivePlayerTab('overview')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activePlayerTab === 'overview'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Mi Espacio
          </button>
          <button
            onClick={() => setActivePlayerTab('bookings')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activePlayerTab === 'bookings'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Mis Reservas ({myBookings.length})
          </button>
          <button
            onClick={() => setActivePlayerTab('stats')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activePlayerTab === 'stats'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Nivel & Estadísticas
          </button>
          <button
            onClick={() => setActivePlayerTab('favorites')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activePlayerTab === 'favorites'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Favoritos ({favorites.length})
          </button>
          <button
            onClick={() => setActivePlayerTab('ai_coach')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activePlayerTab === 'ai_coach'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-cyan-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            ✨ Coach Personal IA
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-8">
        {/* OVERVIEW TAB */}
        {activePlayerTab === 'overview' && (
          <div className="space-y-6">
            {/* Next Match Highlight Card */}
            {myBookings[0] && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 shadow-2xl space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Tu Próximo Partido Confirmado</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">
                    Pista 1 Central
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400">Pista:</div>
                    <div className="font-bold text-white text-sm">{myBookings[0].courtName}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Horario:</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      {myBookings[0].startTime.replace('T', ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">PIN Cerradura Pista:</div>
                    <div className="font-mono font-bold text-amber-300 text-lg">
                      {myBookings[0].accessPin || '4821#'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  Las luces se encenderán automáticamente 5 minutos antes del inicio de tu reserva.
                </div>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Nivel FEP:</span>
                <div className="text-2xl font-black text-white font-mono">{currentUser.playLevel.toFixed(2)}</div>
                <div className="text-[10px] text-emerald-400 font-semibold">+0.15 este mes</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Partidos Jugados:</span>
                <div className="text-2xl font-black text-white font-mono">34</div>
                <div className="text-[10px] text-slate-400">22 victorias (64%)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Saldo Monedero:</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">24.50 €</div>
                <div className="text-[10px] text-slate-400">Recarga en recepción</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Escuela San Mateo:</span>
                <div className="text-sm font-bold text-cyan-400 pt-1">Perfeccionamiento</div>
                <div className="text-[10px] text-slate-400">Mateo Varela · M/J</div>
              </div>
            </div>

            {/* Open Matches Community invitations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Partidos Abiertos con Plazas Libres</h3>
                <button
                  onClick={() => {
                    setCurrentView('public');
                    setPublicPage('matches');
                  }}
                  className="text-xs text-emerald-400 font-semibold hover:underline"
                >
                  Ver todos los partidos
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {openMatches.slice(0, 2).map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow text-xs"
                  >
                    <div className="flex justify-between text-slate-400">
                      <span className="text-emerald-400 font-bold">Nivel {m.minLevel} - {m.maxLevel}</span>
                      <span className="font-mono text-white font-bold">{m.pricePerPlayer.toFixed(2)} €</span>
                    </div>

                    <div className="font-bold text-white">{m.courtName}</div>
                    <div className="text-[11px] text-slate-400">{m.startTime.replace('T', ' ')} (90 min)</div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">{m.players.length} / 4 jugadores</span>
                      <button
                        onClick={() => {
                          setCurrentView('public');
                          setPublicPage('matches');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                      >
                        Apuntarme
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activePlayerTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Historial de Reservas y Partidos</h3>
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{b.courtName}</div>
                    <div className="text-slate-400">{b.startTime.replace('T', ' ')}</div>
                    <div className="text-[11px] text-emerald-400">
                      PIN Acceso Pista: <strong className="font-mono font-bold text-amber-300">{b.accessPin}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-white text-sm">{b.totalPrice.toFixed(2)} €</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 font-bold uppercase text-[10px] border border-emerald-800">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATS & PROGRESS TAB */}
        {activePlayerTab === 'stats' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white">Evolución de Rendimiento Deportivo</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="font-bold text-white text-sm">Habilidades Evaluadas por Entrenador</div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Bandeja y Víbora:</span>
                      <span className="font-bold text-emerald-400">8.5 / 10</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Salida de Pared:</span>
                      <span className="font-bold text-cyan-400">7.8 / 10</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Volea de Bloqueo:</span>
                      <span className="font-bold text-purple-400">8.2 / 10</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Remate x3 y Definición:</span>
                      <span className="font-bold text-amber-400">6.9 / 10</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '69%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="font-bold text-white text-sm">Objetivos del Trimestre</div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mejorar el primer saque buscando el cristal lateral.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Reducir errores no forzados en globos defensivos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Alcanzar el nivel 4.0 antes del Torneo de Primavera.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FAVORITES TAB */}
        {activePlayerTab === 'favorites' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white">Tus Elementos Guardados en Favoritos</h3>

            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase">Productos Guardados:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteProducts.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex gap-3 text-xs">
                    <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white truncate">{p.name}</div>
                      <div className="font-mono text-emerald-400 font-bold">{p.price.toFixed(2)} €</div>
                      <button
                        onClick={() => {
                          setCurrentView('public');
                          setPublicPage('shop');
                        }}
                        className="text-[11px] text-cyan-400 hover:underline mt-1"
                      >
                        Ver en tienda
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI COACH TAB (Requirement 23) */}
        {activePlayerTab === 'ai_coach' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Entrenador Personal de IA</h3>
                  <div className="text-xs text-cyan-300">Análisis táctico y preparación personalizada de partidos</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-emerald-400">Recomendación para tu próximo partido:</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  "Como juegas en la posición de revés con una pala de potencia (Bullpadel Vertex), te sugiero fijar al drive rival con voleas profundas al cuerpo antes de intentar la definición por 3. En las pistas de Narón con humedad matinal la bola pesará más: usa la bajada de pared plana en lugar de liftada."
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Función en Acceso Anticipado para Socios de {currentTenant.shortName}</span>
                <button
                  onClick={() => triggerDemoToast('Rutina Táctica Generada', 'Plan de calentamiento de 15 minutos enviado a tu móvil.', 'success')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow"
                >
                  Generar Rutina Táctica
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
