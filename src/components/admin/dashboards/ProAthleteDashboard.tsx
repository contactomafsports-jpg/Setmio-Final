import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Trophy,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  ShoppingBag,
  Zap,
  CheckCircle2,
  FileText,
  Download,
  Plus,
  Star,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Share2,
  Instagram,
  Phone,
  ArrowRight,
  Eye,
  Briefcase,
  Users,
  DollarSign,
  AlertCircle,
  Package,
} from 'lucide-react';

export const ProAthleteDashboard: React.FC = () => {
  const { currentTenant, viewEntityWeb, triggerDemoToast, setAdminTab } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'branding' | 'matches' | 'sponsors' | 'agenda' | 'services'>('all');

  const stats = currentTenant.proPlayerStats || {
    fipRanking: 18,
    premierRanking: 14,
    titlesCount: 4,
    matchesWon: 142,
    matchesPlayed: 186,
    partnerName: 'Juan Tello Jr.',
    dominantHand: 'Diestro',
    position: 'Revés',
    racketModel: 'Bullpadel Vertex 04 Custom',
  };

  const [sponsorsList, setSponsorsList] = useState([
    {
      id: 'sp-1',
      brand: 'Bullpadel',
      category: 'Pala oficial, textil y calzado',
      annualValue: 45000,
      contractEnd: 'Diciembre 2027',
      deliverables: [
        { text: '2 publicaciones / reels mensuales en Instagram con pala Vertex 04', completed: true },
        { text: 'Logo oficial visible en manga derecha y pecho en partidos oficiales', completed: true },
      ],
      logoBg: 'from-orange-500 to-red-600',
    },
    {
      id: 'sp-2',
      brand: 'Red Bull',
      category: 'Bebida energética oficial y rendimiento',
      annualValue: 30000,
      contractEnd: 'Diciembre 2026',
      deliverables: [
        { text: 'Clinic de tecnificación anual con jóvenes promesas (24 Octubre 2026)', completed: false },
        { text: 'Gorra oficial Red Bull en ruedas de prensa y entrevistas post-partido', completed: true },
      ],
      logoBg: 'from-blue-600 to-indigo-800',
    },
    {
      id: 'sp-3',
      brand: 'Audi España',
      category: 'Vehículo oficial de alta gama (Cesión Q8 e-tron)',
      annualValue: 20000,
      contractEnd: 'Junio 2027',
      deliverables: [
        { text: 'Presencia en evento anual de embajadores de marca en Madrid', completed: true },
        { text: 'Mención en redes sociales durante desplazamientos a torneos', completed: false },
      ],
      logoBg: 'from-slate-700 to-slate-900',
    },
    {
      id: 'sp-4',
      brand: 'Sanitas Deporte',
      category: 'Servicio médico oficial y cobertura fisioterapia',
      annualValue: 15000,
      contractEnd: 'Diciembre 2026',
      deliverables: [
        { text: 'Reconocimiento médico semestral en centro de alto rendimiento', completed: true },
      ],
      logoBg: 'from-cyan-600 to-teal-700',
    },
  ]);

  const [exhibitionsList, setExhibitionsList] = useState([
    {
      id: 'ex-1',
      title: 'Gran Exhibición Solidaria Vigo Padel Master',
      host: 'Pabellón Municipal As Travesas, Vigo',
      date: '22 Noviembre 2026 · 18:30',
      fee: 3500,
      format: 'Partido a 3 sets vs Paquito Navarro & Juan Lebrón + Clinic infantil',
      status: 'Confirmado',
      statusColor: 'emerald',
    },
    {
      id: 'ex-2',
      title: 'Clinic VIP & Masterclass Bullpadel Experience',
      host: 'Club Deportivo La Finca, Madrid',
      date: '24 Octubre 2026 · 10:00 - 13:00',
      fee: 1800,
      format: 'Masterclass de bandeja y remate por tres para 16 clientes VIP',
      status: 'En Agenda',
      statusColor: 'blue',
    },
    {
      id: 'ex-3',
      title: 'Desafío Pro All-Stars Barcelona',
      host: 'Palau Sant Jordi, Barcelona',
      date: '15 Diciembre 2026 · 19:00',
      fee: 4000,
      format: 'Reto de exhibición previo al Master Final',
      status: 'Pendiente Confirmación',
      statusColor: 'amber',
    },
  ]);

  const [agendaEvents, setAgendaEvents] = useState([
    {
      id: 'ag-1',
      title: 'Madrid Premier Padel P1',
      category: 'Torneo Oficial Premier Padel',
      date: '14 - 20 Octubre 2026',
      location: 'WiZink Center, Madrid',
      stage: 'Cuadro Principal (R32)',
      travelStatus: 'Vuelos y hotel 5* confirmados',
      badge: 'FIP Oficial',
    },
    {
      id: 'ag-2',
      title: 'Clinic Tecnificación Red Bull',
      category: 'Compromiso Patrocinador',
      date: '24 Octubre 2026',
      location: 'Madrid',
      stage: 'Masterclass formativa',
      travelStatus: 'Traslados locales coordinados',
      badge: 'Sponsor',
    },
    {
      id: 'ag-3',
      title: 'Milano Premier Padel P1',
      category: 'Torneo Oficial Premier Padel',
      date: '04 - 10 Noviembre 2026',
      location: 'Allianz Cloud, Milán (Italia)',
      stage: 'Cuadro Principal (Pareja: Juan Tello Jr.)',
      travelStatus: 'Logística internacional confirmada',
      badge: 'FIP Oficial',
    },
    {
      id: 'ag-4',
      title: 'Partido Exhibición Vigo Master',
      category: 'Exhibición Profesional',
      date: '22 Noviembre 2026',
      location: 'Vigo, Galicia',
      stage: 'Partido estelar con afición local',
      travelStatus: 'Alojamiento en hotel oficial',
      badge: 'Exhibición',
    },
    {
      id: 'ag-5',
      title: 'Tour Finals Barcelona 2026',
      category: 'Torneo Oficial Fin de Temporada',
      date: '12 - 17 Diciembre 2026',
      location: 'Palau Sant Jordi, Barcelona',
      stage: 'Clasificado Top 16 Parejas Mundiales',
      travelStatus: 'Reserva hotel organización',
      badge: 'FIP Final',
    },
  ]);

  const [servicesList, setServicesList] = useState([
    {
      id: 'srv-1',
      name: 'Clinic Magistral de Tecnificación (2h)',
      description: 'Sesión técnica en pista para grupos reducidos (máx 8 jugadores). Corrección en vídeo y patrones de juego.',
      price: 1200,
      activeBookingsCount: 3,
      status: 'Disponible',
    },
    {
      id: 'srv-2',
      name: 'Partido de Exhibición Pro + Meet & Greet',
      description: 'Presencia en evento o torneo privado, partido de exhibición a 3 sets y firma de autógrafos.',
      price: 3500,
      activeBookingsCount: 1,
      status: 'Disponible',
    },
    {
      id: 'srv-3',
      name: 'Conferencia Motivacional & Team Building',
      description: 'Charla de 60 min para empresas sobre alta competición, resiliencia y trabajo en pareja.',
      price: 2000,
      activeBookingsCount: 2,
      status: 'Disponible',
    },
    {
      id: 'srv-4',
      name: 'Pala Bullpadel Vertex 04 Custom (Firmada)',
      description: 'Edición exclusiva con balance y peso oficial de competición de Martín Sánchez, numerada y dedicada.',
      price: 380,
      activeBookingsCount: 18,
      status: 'En Catálogo',
    },
  ]);

  const toggleDeliverable = (sponsorId: string, index: number) => {
    setSponsorsList((prev) =>
      prev.map((sp) => {
        if (sp.id !== sponsorId) return sp;
        const updated = [...sp.deliverables];
        updated[index] = { ...updated[index], completed: !updated[index].completed };
        return { ...sp, deliverables: updated };
      })
    );
    triggerDemoToast('Entregable de Patrocinio', 'Estado de la activación publicitaria actualizado correctamente.', 'success');
  };

  const handleDownloadMediaKit = () => {
    triggerDemoToast(
      'Media Kit Oficial 2026',
      'Generando dossier comercial actualizado con métricas de audiencia e impacto para marcas.',
      'info'
    );
  };

  const handleNewExhibition = () => {
    triggerDemoToast(
      'Nueva Solicitud de Exhibición',
      'Formulario de cotización de partido de exhibición registrado en la agenda del atleta.',
      'success'
    );
  };

  const handleAddSponsor = () => {
    triggerDemoToast(
      'Gestión de Patrocinios',
      'Añadida propuesta de acuerdo comercial al panel de negociación.',
      'info'
    );
  };

  const handleAddAgendaEvent = () => {
    triggerDemoToast(
      'Agenda de Competición',
      'Nuevo evento / torneo añadido al calendario de temporada.',
      'success'
    );
  };

  const handleAddService = () => {
    triggerDemoToast(
      'Servicios Profesionales',
      'Nuevo servicio publicado en la web de marca blanca del atleta.',
      'success'
    );
  };

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100 max-w-6xl transition-colors">
      {/* 1. ATHLETE BANNER HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-800/60 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <img
                src={currentTenant.branding.heroImageUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'}
                alt={currentTenant.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-red-500 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-red-600 text-white font-mono font-black text-xs shadow-md border border-red-400">
                #{stats.fipRanking} FIP
              </span>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-red-500/20 text-red-300 font-extrabold text-[11px] uppercase tracking-wider border border-red-500/30">
                  Panel de Atleta Profesional
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200 text-[11px] font-bold">
                  Premier Padel Tour
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                {currentTenant.name}
              </h1>
              <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
                {currentTenant.branding.heroSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => viewEntityWeb(currentTenant.slug)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Previsualizar web pública del jugador"
            >
              <Eye className="w-4 h-4 text-red-400" />
              <span>Ver Web Marca Blanca</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={handleDownloadMediaKit}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Media Kit 2026</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap gap-2 text-xs font-bold">
          {[
            { id: 'all', label: 'Vista General Completa' },
            { id: 'branding', label: '1. Marca Personal & Media Kit' },
            { id: 'matches', label: '2. Exhibiciones & Clínics' },
            { id: 'sponsors', label: '3. Patrocinadores & Contratos' },
            { id: 'agenda', label: '4. Agenda & Calendario FIP' },
            { id: 'services', label: '5. Servicios & Merchandising' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TOP METRICS & KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>FIP World Ranking</span>
            <Trophy className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-black text-red-600 dark:text-red-400 font-mono">#{stats.fipRanking}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +2 posiciones este mes
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>Puntos Oficiales 2026</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">3.480 pts</div>
          <div className="text-[11px] text-slate-500">Circuito Premier Padel FIP</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>Patrocinios Activos</span>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">4 Marcas</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">110.000 € / año contratado</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>Exhibiciones & Citas</span>
            <Calendar className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">5 Eventos</div>
          <div className="text-[11px] text-slate-500">Próximos 60 días</div>
        </div>
      </div>

      {/* 3. SECCIÓN 1: GESTIÓN DE MARCA PERSONAL & MEDIA KIT */}
      {(activeTab === 'all' || activeTab === 'branding') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-red-500" />
                <span>1. Gestión de Marca Personal & Palmarés</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identidad digital de atleta, palmarés deportivo, estadísticas de circuito y dossier de patrocinio.
              </p>
            </div>
            <button
              onClick={handleDownloadMediaKit}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar PDF Media Kit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Palmarés deportivo */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Palmarés & Perfil</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Títulos Internacionales:</span>
                  <span className="font-black text-slate-900 dark:text-white">{stats.titlesCount} trofeos FIP</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Partidos Ganados:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{stats.matchesWon} / {stats.matchesPlayed} (76.3%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Pareja Oficial:</span>
                  <span className="font-black text-slate-900 dark:text-white">{stats.partnerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Posición & Mano:</span>
                  <span className="font-black text-slate-900 dark:text-white">{stats.position} · {stats.dominantHand}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Pala Oficial:</span>
                  <span className="font-black text-red-600 dark:text-red-400 truncate max-w-[140px]">{stats.racketModel}</span>
                </div>
              </div>
            </div>

            {/* Audiencia digital */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audiencia & Redes Digitales</span>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-purple-600 text-white flex items-center justify-center">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">@martinsanchezpadel</div>
                      <div className="text-[10px] text-slate-500">Instagram Oficial</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900 dark:text-white">145K</div>
                    <div className="text-[10px] text-emerald-500 font-bold">8.4% engagement</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs">
                      TT
                    </div>
                    <div>
                      <div className="font-bold">@martinsanchezpro</div>
                      <div className="text-[10px] text-slate-500">TikTok Highlights</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900 dark:text-white">88K</div>
                    <div className="text-[10px] text-emerald-500 font-bold">1.2M visualizaciones</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Web Marca Blanca */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Web Marca Blanca del Atleta</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1">martinsanchez.com</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tu portal personal con palmarés, venta de servicios, media kit y formulario para patrocinadores.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => viewEntityWeb(currentTenant.slug)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Portal Web Público</span>
                </button>
                <button
                  onClick={() => setAdminTab('web_editor')}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Personalizar Diseño & Colores</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SECCIÓN 2: PARTIDOS DE EXHIBICIÓN & RETOS */}
      {(activeTab === 'all' || activeTab === 'matches') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>2. Partidos de Exhibición & Clínics VIP</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Agenda de partidos de exhibición, eventos con marcas y clinics magistrales para clubes.
              </p>
            </div>
            <button
              onClick={handleNewExhibition}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Proponer Exhibición</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exhibitionsList.map((ex) => (
              <div
                key={ex.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      ex.statusColor === 'emerald'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        : ex.statusColor === 'blue'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                    }`}>
                      {ex.status}
                    </span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs">
                      {ex.fee.toLocaleString()} € caché
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    {ex.title}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{ex.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{ex.host}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {ex.format}
                  </p>
                </div>

                <button
                  onClick={() => triggerDemoToast('Exhibición Seleccionada', `Detalles y contrato de ${ex.title} consultados en demo.`, 'info')}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Gestionar Detalles & Logística
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. SECCIÓN 3: PATROCINADORES & CONTRATOS */}
      {(activeTab === 'all' || activeTab === 'sponsors') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span>3. Patrocinadores & Contratos de Marca</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Marcas comerciales, compromisos publicitarios del mes y estado de contratos de esponsorización.
              </p>
            </div>
            <button
              onClick={handleAddSponsor}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Patrocinador</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sponsorsList.map((sponsor) => (
              <div
                key={sponsor.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sponsor.logoBg} text-white font-black text-sm flex items-center justify-center shadow-xs`}>
                      {sponsor.brand.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">{sponsor.brand}</h3>
                      <p className="text-[11px] text-slate-500">{sponsor.category}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {sponsor.annualValue.toLocaleString()} € / año
                    </div>
                    <div className="text-[10px] text-slate-400">Hasta {sponsor.contractEnd}</div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Compromisos y Entregables Publicitarios:
                  </div>
                  {sponsor.deliverables.map((deliv, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleDeliverable(sponsor.id, idx)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          deliv.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                      <span className={deliv.completed ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'}>
                        {deliv.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. SECCIÓN 4: AGENDA & CALENDARIO FIP */}
      {(activeTab === 'all' || activeTab === 'agenda') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <span>4. Agenda & Calendario de Competición</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calendario de torneos Premier Padel, cuadros oficiales, vuelos, hoteles y clinics.
              </p>
            </div>
            <button
              onClick={handleAddAgendaEvent}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir a la Agenda</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs overflow-hidden">
            {agendaEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 text-slate-800 dark:text-slate-200">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {evt.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{evt.date}</span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                      {evt.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.location}</span>
                      <span>·</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{evt.stage}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {evt.travelStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. SECCIÓN 5: SERVICIOS PROFESIONALES & MERCHANDISING */}
      {(activeTab === 'all' || activeTab === 'services') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-500" />
                <span>5. Servicios Profesionales & Tienda Oficial</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Catálogo de clinics magistrales, partidos de exhibición y productos oficiales ofrecidos al público.
              </p>
            </div>
            <button
              onClick={handleAddService}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Servicio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicesList.map((srv) => (
              <div
                key={srv.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {srv.status}
                    </span>
                    <span className="font-mono font-black text-slate-900 dark:text-white text-base">
                      {srv.price} €
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                    {srv.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{srv.activeBookingsCount} contrataciones</span>
                  <button
                    onClick={() => triggerDemoToast('Gestión de Servicio', `Modificando disponibilidad y tarifas de ${srv.name}.`, 'info')}
                    className="font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Editar Tarifa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
