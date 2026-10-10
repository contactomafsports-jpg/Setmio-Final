import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenMatch, OpenMatchSlotRequest } from '../../types/database';
import {
  Trophy,
  Users,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  Shield,
  Layers,
  Zap,
  X,
  UserCheck,
  UserPlus,
  Lock,
  Globe,
  Share2,
  MessageCircle,
  Mail,
  Copy,
  Check,
  CreditCard,
  Wallet,
  Building2,
  ExternalLink,
  Trash2,
  Edit3,
} from 'lucide-react';

export const AdminMatches: React.FC = () => {
  const {
    openMatches,
    createOpenMatch,
    updateOpenMatch,
    deleteOpenMatch,
    joinOpenMatch,
    leaveOpenMatch,
    courts,
    currentTenant,
    triggerDemoToast,
    setAdminTab,
    navigateToPlayerProfile,
    t,
  } = useApp();

  // Filters State (Minimalist segmented controls & clean search)
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'full'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'iniciacion' | 'intermedio' | 'avanzado'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'mixed'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private_group'>('all');
  const [showSecondaryFilters, setShowSecondaryFilters] = useState(false);

  // Modals & Action States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMatchForAdd, setSelectedMatchForAdd] = useState<OpenMatch | null>(null);
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<OpenMatch | null>(null);
  const [slotRequestTargetMatch, setSlotRequestTargetMatch] = useState<OpenMatch | null>(null);
  const [editingMatch, setEditingMatch] = useState<OpenMatch | null>(null);
  const [matchToDelete, setMatchToDelete] = useState<OpenMatch | null>(null);
  const [replacingPlayerName, setReplacingPlayerName] = useState<string | null>(null);

  // Edit match form state
  const [editFormData, setEditFormData] = useState<{
    courtId: string;
    date: string;
    time: string;
    durationMinutes: number;
    minLevel: number;
    maxLevel: number;
    pricePerPlayer: number;
    gender: 'male' | 'female' | 'mixed';
    mode: 'competitive' | 'friendly';
  }>({
    courtId: courts[0]?.id || '',
    date: '2026-10-10',
    time: '19:30',
    durationMinutes: 90,
    minLevel: 3.0,
    maxLevel: 4.5,
    pricePerPlayer: 7.5,
    gender: 'male',
    mode: 'competitive',
  });

  // New match form state
  const [isClubCreator, setIsClubCreator] = useState(true);
  const [creatorName, setCreatorName] = useState('Club ' + (currentTenant?.name || 'Pádel San Mateo'));
  const [creatorLevel, setCreatorLevel] = useState(4.0);
  const [creatorPosition, setCreatorPosition] = useState<'drive' | 'reves' | 'both'>('drive');
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || 'court-1');
  const [matchDate, setMatchDate] = useState('2026-10-10');
  const [matchTime, setMatchTime] = useState('19:30');
  const [minLevel, setMinLevel] = useState(3.0);
  const [maxLevel, setMaxLevel] = useState(4.25);
  const [pricePerPlayer, setPricePerPlayer] = useState(7.5);
  const [matchMode, setMatchMode] = useState<'competitive' | 'friendly'>('competitive');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'group'>('public');
  const [restrictedGroupName, setRestrictedGroupName] = useState('Equipo A Masculino');
  const [gender, setGender] = useState<'male' | 'female' | 'mixed'>('male');
  const [paymentMode, setPaymentMode] = useState<'split' | 'single'>('split');
  const [paymentPolicy, setPaymentPolicy] = useState<'online_only' | 'counter_only' | 'both'>('both');

  // Add / Invite player form state
  const [inviteTab, setInviteTab] = useState<'registered' | 'external' | 'guest'>('registered');
  const [selectedMemberOption, setSelectedMemberOption] = useState<string>('Carlos Méndez');
  const [customPlayerFee, setCustomPlayerFee] = useState<string>('');
  const [guestName, setGuestName] = useState('');
  const [guestLevel, setGuestLevel] = useState(3.75);
  const [guestPosition, setGuestPosition] = useState<'drive' | 'reves' | 'both'>('both');
  const [externalChannel, setExternalChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [externalContact, setExternalContact] = useState('+34 654 321 987');
  const [externalPlayerName, setExternalPlayerName] = useState('Invitado Pro');

  // Request slot by level state
  const [reqPlayerName, setReqPlayerName] = useState('Marcos Soto');
  const [reqPlayerLevel, setReqPlayerLevel] = useState(3.4);
  const [reqPlayerPosition, setReqPlayerPosition] = useState<'drive' | 'reves' | 'both'>('drive');
  const [reqPlayerPhone, setReqPlayerPhone] = useState('+34 689 123 456');

  // Registered club members database for searchable select
  interface ClubPlayerOption {
    name: string;
    level: number;
    memberNum: string;
    isMember: boolean;
    label: string;
  }

  const registeredClubMembers: ClubPlayerOption[] = useMemo(() => [
    { name: 'Carlos Méndez', level: 4.85, memberNum: '#108', isMember: true, label: 'Carlos Méndez (Socio #108 · Nivel 4.85)' },
    { name: 'Pablo Vello', level: 4.80, memberNum: '#019', isMember: true, label: 'Pablo Vello (Socio #019 · Nivel 4.80)' },
    { name: 'Laura Senra', level: 5.00, memberNum: 'Pro', isMember: true, label: 'Laura Senra (Socia Pro · Nivel 5.00)' },
    { name: 'Rosa Carballo', level: 3.90, memberNum: '#042', isMember: true, label: 'Rosa Carballo (Socia #042 · Nivel 3.90)' },
    { name: 'Mateo Varela', level: 4.15, memberNum: '#055', isMember: true, label: 'Mateo Varela (Socio #055 · Nivel 4.15)' },
    { name: 'Iván Gómez', level: 3.45, memberNum: '#087', isMember: true, label: 'Iván Gómez (Socio #087 · Nivel 3.45)' },
    { name: 'Lucas Piñeiro', level: 3.85, memberNum: 'Inv', isMember: false, label: 'Lucas Piñeiro (Invitado Frecuente · Nivel 3.85)' },
    { name: 'David Castro', level: 4.10, memberNum: 'Inv', isMember: false, label: 'David Castro (Invitado Regular · Nivel 4.10)' },
    { name: 'Elena Permuy', level: 2.75, memberNum: '#033', isMember: true, label: 'Elena Permuy (Socia #033 · Nivel 2.75)' },
    { name: 'Carla Noche', level: 3.00, memberNum: '#061', isMember: true, label: 'Carla Noche (Socia #061 · Nivel 3.00)' },
  ], []);

  // Filter logic
  const filteredMatches = useMemo(() => {
    return openMatches.filter((m) => {
      const isFull = m.players.length >= 4;

      // Search term
      const searchLower = search.toLowerCase();
      const matchSearch =
        !search ||
        m.courtName.toLowerCase().includes(searchLower) ||
        m.creatorName.toLowerCase().includes(searchLower) ||
        (m.restrictedGroupName && m.restrictedGroupName.toLowerCase().includes(searchLower)) ||
        m.players.some((p) => p.name.toLowerCase().includes(searchLower));

      // Status
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'open' && !isFull) ||
        (statusFilter === 'full' && isFull);

      // Level
      const matchLevel =
        levelFilter === 'all' ||
        (levelFilter === 'iniciacion' && m.maxLevel <= 3.25) ||
        (levelFilter === 'intermedio' && m.minLevel >= 3.0 && m.maxLevel <= 4.25) ||
        (levelFilter === 'avanzado' && m.minLevel >= 4.0);

      // Gender
      const matchGender =
        genderFilter === 'all' ||
        m.gender === genderFilter ||
        (!m.gender && genderFilter === 'male');

      // Visibility
      const matchVis =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'public' && (m.visibility === 'public' || !m.visibility)) ||
        (visibilityFilter === 'private_group' && (m.visibility === 'private' || m.visibility === 'group'));

      return matchSearch && matchStatus && matchLevel && matchGender && matchVis;
    });
  }, [openMatches, search, statusFilter, levelFilter, genderFilter, visibilityFilter]);

  const totalOpenSlots = openMatches.reduce((acc, m) => acc + Math.max(0, 4 - m.players.length), 0);
  const fullMatchesCount = openMatches.filter((m) => m.players.length >= 4).length;
  const activePlayersCount = openMatches.reduce((acc, m) => acc + m.players.length, 0);
  const pendingRequestsTotal = openMatches.reduce(
    (acc, m) => acc + (m.slotRequests ? m.slotRequests.filter((r) => r.status === 'pending').length : 0),
    0
  );

  // Handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === selectedCourtId) || courts[0];
    const startISO = `${matchDate}T${matchTime}:00Z`;
    const finalCreatorName = isClubCreator
      ? `${currentTenant.name} (Club Oficial)`
      : creatorName.trim() || 'Organizador';

    createOpenMatch({
      courtId: court.id,
      courtName: court.name,
      creatorName: finalCreatorName,
      creatorLevel: Number(creatorLevel) || 4.0,
      startTime: startISO,
      durationMinutes: 90,
      minLevel: Number(minLevel),
      maxLevel: Number(maxLevel),
      pricePerPlayer: Number(pricePerPlayer),
      status: 'open',
      mode: matchMode,
      visibility,
      restrictedGroupName: visibility === 'group' ? restrictedGroupName : undefined,
      gender,
      isClubCreated: isClubCreator,
      paymentMode,
      paymentPolicy,
      players: [
        {
          id: `p-${Date.now()}`,
          name: isClubCreator ? `Admin · ${currentTenant.name}` : finalCreatorName,
          level: Number(creatorLevel) || 4.0,
          position: creatorPosition,
          paid: true,
        },
      ],
    });

    setShowCreateModal(false);
    triggerDemoToast(
      t('matches.toastCreatedTitle', 'Partida Publicada con Éxito'),
      `Partida en ${court.name} (${gender === 'male' ? 'Masculina' : gender === 'female' ? 'Femenina' : 'Mixta'}) · ${visibility === 'public' ? 'Pública' : visibility === 'group' ? `Grupo: ${restrictedGroupName}` : 'Privada'} · Cobro: ${paymentMode === 'split' ? 'Split 1/4' : 'Pago Único'}.`,
      'success'
    );
  };

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForAdd) return;

    let finalName = '';
    let finalLevel = guestLevel;
    const customFee = customPlayerFee ? parseFloat(customPlayerFee) : selectedMatchForAdd.pricePerPlayer;

    if (inviteTab === 'registered') {
      const found = registeredClubMembers.find((m) => m.name === selectedMemberOption);
      finalName = found ? found.name : selectedMemberOption;
      if (found) finalLevel = found.level;
    } else if (inviteTab === 'external') {
      finalName = externalPlayerName.trim() || 'Invitado Externo';
      finalLevel = guestLevel;
    } else {
      if (!guestName.trim()) return;
      finalName = guestName.trim();
    }

    if (replacingPlayerName) {
      leaveOpenMatch(selectedMatchForAdd.id, replacingPlayerName);
      setReplacingPlayerName(null);
    }

    joinOpenMatch(selectedMatchForAdd.id, {
      name: finalName,
      level: Number(finalLevel),
      position: guestPosition,
    });

    // If custom price specified, update through updateOpenMatch
    if (customFee !== selectedMatchForAdd.pricePerPlayer) {
      const currentMatch = openMatches.find((m) => m.id === selectedMatchForAdd.id);
      if (currentMatch) {
        const updatedPlayers = currentMatch.players.map((p) =>
          p.name === finalName ? { ...p, customPrice: customFee } : p
        );
        updateOpenMatch(selectedMatchForAdd.id, { players: updatedPlayers });
      }
    }

    if (inviteTab === 'external') {
      const shareUrl = `https://setmio.com/partida/${selectedMatchForAdd.id}`;
      triggerDemoToast(
        'Invitación Enviada',
        `Se ha generado la reserva y enviado invitación por ${externalChannel === 'whatsapp' ? 'WhatsApp' : 'Correo'} a ${finalName} (${externalContact}): ${shareUrl}`,
        'success'
      );
    } else {
      triggerDemoToast(
        t('matches.toastPlayerAddedTitle', 'Jugador Añadido a la Partida'),
        `${finalName} añadido a ${selectedMatchForAdd.courtName} (Cuota: ${customFee.toFixed(2)} €).`,
        'success'
      );
    }

    setSelectedMatchForAdd(null);
    setGuestName('');
    setCustomPlayerFee('');
  };

  const handleOpenEditMatch = (match: OpenMatch) => {
    setEditingMatch(match);
    const datePart = match.startTime.split('T')[0] || '2026-10-10';
    const timePart = match.startTime.includes('T') ? match.startTime.split('T')[1].slice(0, 5) : '19:30';
    setEditFormData({
      courtId: match.courtId,
      date: datePart,
      time: timePart,
      durationMinutes: match.durationMinutes,
      minLevel: match.minLevel,
      maxLevel: match.maxLevel,
      pricePerPlayer: match.pricePerPlayer,
      gender: match.gender || 'male',
      mode: match.mode || 'competitive',
    });
  };

  const handleSaveEditMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;
    const selectedCourt = courts.find((c) => c.id === editFormData.courtId) || courts[0];
    const newStartTime = `${editFormData.date}T${editFormData.time}:00`;
    updateOpenMatch(editingMatch.id, {
      courtId: selectedCourt.id,
      courtName: selectedCourt.name,
      startTime: newStartTime,
      durationMinutes: editFormData.durationMinutes,
      minLevel: editFormData.minLevel,
      maxLevel: editFormData.maxLevel,
      pricePerPlayer: editFormData.pricePerPlayer,
      gender: editFormData.gender,
      mode: editFormData.mode,
    });
    setEditingMatch(null);
    triggerDemoToast('Partida Actualizada', 'Los datos de la partida han sido actualizados con éxito.', 'success');
  };

  // Submit slot request by level
  const handleRequestSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotRequestTargetMatch) return;

    const newRequest: OpenMatchSlotRequest = {
      id: `req-${Date.now()}`,
      playerName: reqPlayerName.trim(),
      playerLevel: Number(reqPlayerLevel),
      playerPhone: reqPlayerPhone.trim(),
      position: reqPlayerPosition,
      status: 'pending',
      requestedAt: 'Ahora mismo',
      paid: false,
    };

    const existingReqs = slotRequestTargetMatch.slotRequests || [];
    updateOpenMatch(slotRequestTargetMatch.id, {
      slotRequests: [...existingReqs, newRequest],
    });

    triggerDemoToast(
      'Solicitud de Plaza Registrada',
      `Solicitud de ${reqPlayerName} (Nivel ${reqPlayerLevel.toFixed(2)}) enviada al organizador para ${slotRequestTargetMatch.courtName}.`,
      'success'
    );

    setSlotRequestTargetMatch(null);
  };

  // Accept a slot request by level
  const handleAcceptSlotRequest = (matchId: string, reqId: string) => {
    const match = openMatches.find((m) => m.id === matchId);
    if (!match) return;

    const request = match.slotRequests?.find((r) => r.id === reqId);
    if (!request) return;

    // Check if slots available
    if (match.players.length >= 4) {
      triggerDemoToast('Partida Completa', 'No hay plazas libres para aceptar esta solicitud.', 'warning');
      return;
    }

    // Add player to match
    const updatedPlayers = [
      ...match.players,
      {
        id: `p-${Date.now()}`,
        name: request.playerName,
        level: request.playerLevel,
        position: request.position || 'drive',
        paid: false,
      },
    ];

    const updatedRequests = (match.slotRequests || []).map((r) =>
      r.id === reqId ? { ...r, status: 'accepted' as const } : r
    );

    updateOpenMatch(matchId, {
      players: updatedPlayers,
      slotRequests: updatedRequests,
      status: updatedPlayers.length >= 4 ? 'full' : 'open',
    });

    triggerDemoToast(
      'Solicitud Aceptada',
      `${request.playerName} ha sido incorporado a la partida. Se le ha notificado con botón "Pagar mi parte".`,
      'success'
    );
  };

  // Reject a slot request by level
  const handleRejectSlotRequest = (matchId: string, reqId: string) => {
    const match = openMatches.find((m) => m.id === matchId);
    if (!match) return;

    const updatedRequests = (match.slotRequests || []).map((r) =>
      r.id === reqId ? { ...r, status: 'rejected' as const } : r
    );

    updateOpenMatch(matchId, { slotRequests: updatedRequests });
    triggerDemoToast('Solicitud Declinada', 'La petición ha sido rechazada.', 'info');
  };

  // Pay player's share
  const handlePayPlayerShare = (matchId: string, playerName: string) => {
    const match = openMatches.find((m) => m.id === matchId);
    if (!match) return;

    const updatedPlayers = match.players.map((p) =>
      p.name === playerName ? { ...p, paid: true } : p
    );

    updateOpenMatch(matchId, { players: updatedPlayers });
    triggerDemoToast(
      'Pago Confirmado',
      `Pago de la plaza de ${playerName} (${match.pricePerPlayer.toFixed(2)} €) procesado con éxito en el monedero/TPV del club.`,
      'success'
    );
  };

  // Copy share match link
  const handleCopyMatchLink = (matchId: string) => {
    const url = `https://setmio.com/partida/${matchId}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        triggerDemoToast(t('matches.linkCopied', 'Enlace copiado al portapapeles'), url, 'success');
      });
    } else {
      triggerDemoToast(t('matches.linkCopied', 'Enlace copiado'), url, 'success');
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16">
      {/* 1. Header Oficial Pro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('matches.eyebrow', 'Matchmaking & Comunidad Play!')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {t('matches.title', 'Gestión de Partidas Abiertas')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t(
              'matches.subtitle',
              `${currentTenant?.name || 'Club'} · Partidas niveladas por rating decimal, división de pago a 1/4 y convocatorias de socios.`
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAdminTab('agenda')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('matches.btnAgenda', 'Agenda')}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('matches.btnNew', 'Nueva partida')}</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs Ejecutivos de Partidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('matches.kpiTotal', 'Total Partidas')}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {openMatches.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{fullMatchesCount} {t('matches.kpiComplete', 'Completas (4/4)')}</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('matches.kpiSlots', 'Plazas Libres')}
          </span>
          <div className="text-2xl font-black text-amber-500 font-mono">
            {totalOpenSlots}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('matches.kpiSlotsDesc', 'Buscando jugadores')}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('matches.kpiPlayers', 'Jugadores Activos')}
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {activePlayersCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('matches.kpiPlayersDesc', 'En convocatoria Play!')}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('matches.pendingRequests', 'Solicitudes de Nivel')}
          </span>
          <div className={`text-2xl font-black font-mono ${pendingRequestsTotal > 0 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
            {pendingRequestsTotal}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {pendingRequestsTotal > 0 ? 'Pendientes de aprobar' : 'Al día'}
          </span>
        </div>
      </div>

      {/* 3. Filtros Simplificados: Solo Filtro de Estado visible + Botón compacto de Filtros secundarios */}
      <div className="space-y-3">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
          {/* Segmented Control de Estado (Visible de forma permanente) */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('matches.filterAll', 'Todas')} ({openMatches.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'open'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('matches.filterOpen', 'Buscando')} ({openMatches.filter((m) => m.players.length < 4).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('full')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'full'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('matches.filterFull', 'Completas')} ({fullMatchesCount})
            </button>
          </div>

          {/* Botón compacto con icono de Filtros para desplegar filtros secundarios */}
          <button
            type="button"
            onClick={() => setShowSecondaryFilters(!showSecondaryFilters)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              showSecondaryFilters || (search || levelFilter !== 'all' || genderFilter !== 'all' || visibilityFilter !== 'all')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80'
            }`}
            title="Desplegar u ocultar filtros secundarios"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {(search || levelFilter !== 'all' || genderFilter !== 'all' || visibilityFilter !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Panel Desplegable de Filtros Secundarios */}
        {showSecondaryFilters && (
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 animate-in fade-in-50 duration-150">
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('matches.searchPlaceholder', 'Buscar por pista, grupo o jugador...')}
                className="w-full pl-8.5 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Píldoras secundarias: Nivel, Género y Tipo */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
              {/* Nivel */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Nivel:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'iniciacion', label: 'Iniciación (≤3.25)' },
                  { id: 'intermedio', label: 'Intermedio (3.0-4.25)' },
                  { id: 'avanzado', label: 'Avanzado (≥4.0)' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevelFilter(lvl.id as any)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      levelFilter === lvl.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-200 dark:border-slate-800 mx-1 hidden sm:block" />

              {/* Género */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Género:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: t('matches.filterGenderAll', 'Todos') },
                  { id: 'male', label: t('matches.filterGenderMale', 'Masculina') },
                  { id: 'female', label: t('matches.filterGenderFemale', 'Femenina') },
                  { id: 'mixed', label: t('matches.filterGenderMixed', 'Mixta') },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGenderFilter(g.id as any)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      genderFilter === g.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-200 dark:border-slate-800 mx-1 hidden sm:block" />

              {/* Visibilidad */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Tipo:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'public', label: 'Públicas' },
                  { id: 'private_group', label: 'Grupos / Privadas' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVisibilityFilter(v.id as any)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      visibilityFilter === v.id
                        ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-2xs'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Listado de Partidas con Tarjetas Estándar Pro */}
      {filteredMatches.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('matches.emptyTitle', 'No se encontraron partidas abiertas')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t(
              'matches.emptyDesc',
              'Crea una nueva partida abierta para dinamizar la ocupación de pistas y fomentar el juego nivelado entre los socios.'
            )}
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('matches.createFirstBtn', 'Crear Primera Partida')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((m) => {
            const isFull = m.players.length >= 4;
            const openSlots = Math.max(0, 4 - m.players.length);
            const startTimeFormatted = m.startTime.includes('T')
              ? m.startTime.replace('Z', '').split('T')[1]?.slice(0, 5) || '19:30'
              : m.startTime;
            const startDateFormatted = m.startTime.includes('T')
              ? m.startTime.split('T')[0]
              : '2026-10-10';

            const pendingReqsCount = (m.slotRequests || []).filter((r) => r.status === 'pending').length;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMatchForDetail(m)}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer group ${
                  isFull
                    ? 'border-emerald-500/30 dark:border-emerald-500/20'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Fila Superior: Fecha, Pista y Badges Pro */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{startDateFormatted} · {startTimeFormatted}</span>
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {m.courtName}
                      </div>

                      {/* Creador: Club o Socio */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {m.isClubCreated ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Shield className="w-3 h-3" />
                            <span>Club Oficial</span>
                          </span>
                        ) : (
                          <span className="truncate">Org: {m.creatorName}</span>
                        )}
                      </div>
                    </div>

                    {/* Badges estilizados */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isFull
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {isFull ? t('matches.statusFull', 'Completa') : `${openSlots} ${t('matches.statusNeedPlayers', 'libres')}`}
                      </span>

                      {/* Género + Visibilidad */}
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            m.gender === 'female'
                              ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800'
                              : m.gender === 'mixed'
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          }`}
                        >
                          {m.gender === 'female' ? 'Femenina' : m.gender === 'mixed' ? 'Mixta' : 'Masculina'}
                        </span>

                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-0.5">
                          {m.visibility === 'group' ? (
                            <>
                              <Users className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[70px]">{m.restrictedGroupName || 'Grupo'}</span>
                            </>
                          ) : m.visibility === 'private' ? (
                            <>
                              <Lock className="w-2.5 h-2.5" />
                              <span>Privada</span>
                            </>
                          ) : (
                            <>
                              <Globe className="w-2.5 h-2.5" />
                              <span>Pública</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nivel ELO & Modalidad de Cobro */}
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Nivel: <strong className="text-slate-800 dark:text-slate-200 font-mono">{m.minLevel.toFixed(2)} - {m.maxLevel.toFixed(2)}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-slate-900 dark:text-white">
                        {m.paymentMode === 'single' ? (m.pricePerPlayer * 4).toFixed(2) : m.pricePerPlayer.toFixed(2)} €
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold">
                        {m.paymentMode === 'single' ? '(Pista)' : '(1/4)'}
                      </span>
                    </div>
                  </div>

                  {/* Avatares de Jugadores Pro (compactos con badges de posición) */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      <span>Plazas ({m.players.length}/4)</span>
                      {pendingReqsCount > 0 ? (
                        <span className="text-amber-500 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{pendingReqsCount} petición{pendingReqsCount > 1 ? 'es' : ''}</span>
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 lowercase font-normal group-hover:underline">
                          Ver detalle →
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Jugadores confirmados con avatar pequeño */}
                      {m.players.map((p, idx) => (
                        <div
                          key={idx}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToPlayerProfile(p.name, 'matches');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              navigateToPlayerProfile(p.name, 'matches');
                            }
                          }}
                          className="relative group/avatar cursor-pointer hover:scale-110 transition-transform"
                          title={`${p.name} · Ver perfil del jugador · Nivel ${p.level.toFixed(2)} (${p.position}) · ${p.paid ? 'Pagado' : 'Pendiente de pago'}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs group-hover/avatar:ring-2 group-hover/avatar:ring-emerald-400">
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          {/* Mini badge de posición */}
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center border border-white dark:border-slate-900 ${
                              p.position === 'drive'
                                ? 'bg-amber-400 text-slate-950'
                                : p.position === 'reves'
                                ? 'bg-indigo-400 text-white'
                                : 'bg-emerald-400 text-slate-950'
                            }`}
                          >
                            {p.position === 'drive' ? 'D' : p.position === 'reves' ? 'R' : 'A'}
                          </span>
                        </div>
                      ))}

                      {/* Plazas libres con placeholder circular */}
                      {Array.from({ length: openSlots }).map((_, emptyIdx) => (
                        <button
                          key={`empty-${emptyIdx}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMatchForAdd(m);
                          }}
                          className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-600 flex items-center justify-center text-xs font-bold transition cursor-pointer"
                          title="Inscribir jugador en esta plaza"
                        >
                          +
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer de Acciones Rápidas */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <CreditCard className="w-3 h-3 text-slate-400" />
                    <span>
                      {m.paymentPolicy === 'online_only'
                        ? 'Online'
                        : m.paymentPolicy === 'counter_only'
                        ? 'Mostrador'
                        : 'Online/Mostrador'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyMatchLink(m.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Copiar enlace directo de la partida"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {!isFull && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMatchForAdd(m);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition cursor-pointer shadow-xs active:scale-95"
                      >
                        + Inscribir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================================
          MODAL 1: DETALLE COMPLETO DE PARTIDA Y GESTIÓN DE SOLICITUDES
          ====================================================================== */}
      {selectedMatchForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      selectedMatchForDetail.mode === 'friendly'
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {selectedMatchForDetail.mode === 'friendly'
                      ? t('matches.modeFriendly', 'Modo Amistoso')
                      : t('matches.modeCompetitive', 'Modo Competitivo (ELO)')}
                  </span>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedMatchForDetail.gender === 'female'
                      ? 'Femenina'
                      : selectedMatchForDetail.gender === 'mixed'
                      ? 'Mixta'
                      : 'Masculina'}
                  </span>

                  {selectedMatchForDetail.isClubCreated && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>Oficial Club</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {selectedMatchForDetail.courtName} · Partida Play!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedMatchForDetail.startTime.split('T')[0]} a las{' '}
                  {selectedMatchForDetail.startTime.includes('T')
                    ? selectedMatchForDetail.startTime.split('T')[1].slice(0, 5)
                    : '19:30'}{' '}
                  · {selectedMatchForDetail.durationMinutes} min · {selectedMatchForDetail.visibility === 'group' ? `Grupo: ${selectedMatchForDetail.restrictedGroupName}` : selectedMatchForDetail.visibility === 'private' ? 'Privada' : 'Pública'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMatchForDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Acciones de Administración si la partida está Abierta */}
            {(selectedMatchForDetail.status === 'open' || selectedMatchForDetail.players.length < 4) && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Acciones Administrador (Partida Abierta)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditMatch(selectedMatchForDetail)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Editar Partida</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchToDelete(selectedMatchForDetail)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-rose-100 transition shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            )}

            {/* KPIs del partido */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nivel ELO</span>
                <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {selectedMatchForDetail.minLevel.toFixed(2)} - {selectedMatchForDetail.maxLevel.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Modalidad Cobro</span>
                <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                  {selectedMatchForDetail.pricePerPlayer.toFixed(2)} € <span className="text-[10px] font-normal text-slate-500">/jug.</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Plazas Libres</span>
                <span className="text-sm font-mono font-black text-amber-500">
                  {Math.max(0, 4 - selectedMatchForDetail.players.length)} / 4
                </span>
              </div>
            </div>

            {/* 1. Lista detallada de jugadores confirmados */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Jugadores Inscritos ({selectedMatchForDetail.players.length}/4):
              </span>

              <div className="space-y-2">
                {selectedMatchForDetail.players.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedMatchForDetail(null);
                        navigateToPlayerProfile(p.name, 'matches');
                      }}
                      className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition group"
                      title={`Ver perfil de ${p.name}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-emerald-500 font-normal opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                          {p.customPrice && (
                            <span className="text-[10px] font-mono text-emerald-600 font-bold whitespace-nowrap">
                              ({p.customPrice.toFixed(2)} €)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Nivel ELO {p.level.toFixed(2)} · Posición: <span className="capitalize">{p.position}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {p.paid ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Pagado</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePayPlayerShare(selectedMatchForDetail.id, p.name)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-2xs transition cursor-pointer flex items-center gap-1"
                          title="Cobrar cuota en TPV o saldo"
                        >
                          <Wallet className="w-3 h-3" />
                          <span>{t('matches.payMyShare', 'Pagar mi parte')}</span>
                        </button>
                      )}

                      {/* Acciones para administrador si la partida está abierta */}
                      {(selectedMatchForDetail.status === 'open' || selectedMatchForDetail.players.length < 4) && (
                        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                          <button
                            type="button"
                            onClick={() => {
                              const m = selectedMatchForDetail;
                              setReplacingPlayerName(p.name);
                              setSelectedMatchForDetail(null);
                              setSelectedMatchForAdd(m);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                            title={`Reemplazar a ${p.name}`}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              leaveOpenMatch(selectedMatchForDetail.id, p.name);
                              setSelectedMatchForDetail((prev) =>
                                prev ? { ...prev, players: prev.players.filter((pl) => pl.name !== p.name), status: 'open' } : null
                              );
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900 text-rose-500 transition cursor-pointer"
                            title={`Quitar a ${p.name} de la partida`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Plazas libres */}
                {Array.from({ length: Math.max(0, 4 - selectedMatchForDetail.players.length) }).map((_, emptyIdx) => (
                  <div
                    key={`slot-${emptyIdx}`}
                    className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400"
                  >
                    <span>Plaza {selectedMatchForDetail.players.length + emptyIdx + 1} Libre</span>
                    <button
                      type="button"
                      onClick={() => {
                        const m = selectedMatchForDetail;
                        setSelectedMatchForDetail(null);
                        setSelectedMatchForAdd(m);
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      + Inscribir
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. SECCIÓN: SOLICITUD DE PLAZA POR NIVEL (SITUADO JUSTO DEBAJO DE LOS JUGADORES) */}
            <div className="rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                    Solicitud de Plaza por Nivel ({selectedMatchForDetail.slotRequests?.length || 0})
                  </span>
                </div>

                {selectedMatchForDetail.players.length < 4 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlotRequestTargetMatch(selectedMatchForDetail);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] shadow-2xs transition cursor-pointer"
                  >
                    + Enviar Solicitud de Nivel
                  </button>
                )}
              </div>

              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                Si un jugador tiene un nivel diferente al requerido ({selectedMatchForDetail.minLevel.toFixed(2)} - {selectedMatchForDetail.maxLevel.toFixed(2)}), puede solicitar plaza y el administrador u organizador evalúa la admisión.
              </p>

              {(!selectedMatchForDetail.slotRequests || selectedMatchForDetail.slotRequests.length === 0) ? (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 italic py-1">
                  No hay solicitudes de nivel pendientes en esta partida.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedMatchForDetail.slotRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{req.playerName}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            Nivel {req.playerLevel.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            · {req.position || 'drive'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {req.requestedAt} · Tel: {req.playerPhone || 'N/A'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        {req.status === 'pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAcceptSlotRequest(selectedMatchForDetail.id, req.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                            >
                              Aceptar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectSlotRequest(selectedMatchForDetail.id, req.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                            >
                              Rechazar
                            </button>
                          </>
                        ) : req.status === 'accepted' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Aceptada (En partida)</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs">
                            Rechazada
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con Enlace Compartir y Cerrar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleCopyMatchLink(selectedMatchForDetail.id)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('matches.copyLink', 'Copiar Enlace de Reserva')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMatchForDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                {t('matches.detailClose', 'Cerrar Detalle')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: CREAR NUEVA PARTIDA ABIERTA CON TODAS LAS CONFIGURACIONES
          ====================================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {t('matches.modalNewTitle', 'Publicar Nueva Partida Abierta')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Convocatoria de juego Play!, división de pagos y asignación de pista.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* 1. Creador: Creado por el Club vs Socio */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Organizador / Creador</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isClubCreator}
                      onChange={(e) => setIsClubCreator(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {t('matches.createdByClub', 'Creado por el Club')}
                    </span>
                  </label>
                </div>

                {!isClubCreator && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Nombre del Socio Organizador:
                    </label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      placeholder="Ej. Carlos Méndez"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                )}
              </div>

              {/* 2. Visibilidad: Pública vs Privada vs Equipo/Grupo */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">
                  Visibilidad de la Partida
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      visibility === 'public'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-500" />
                    <span>Pública</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      visibility === 'private'
                        ? 'bg-slate-800 dark:bg-slate-800 border-slate-700 text-white font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />
                    <span>Privada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility('group')}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      visibility === 'group'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-800 dark:text-indigo-300 font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-500" />
                    <span>Equipo/Grupo</span>
                  </button>
                </div>

                {/* Si es restringida a grupo */}
                {visibility === 'group' && (
                  <div className="mt-2 p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                    <label className="block text-[11px] font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                      Seleccionar Equipo o Grupo del Club (Visible solo para ellos):
                    </label>
                    <select
                      value={restrictedGroupName}
                      onChange={(e) => setRestrictedGroupName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="Equipo A Masculino">Equipo A Masculino (Federado 1ª)</option>
                      <option value="Equipo B Femenino">Equipo B Femenino (Federado 2ª)</option>
                      <option value="Veteranos +45">Veteranos +45 (Liga Social)</option>
                      <option value="Escuela Adultos Nivel 3.5">Escuela Adultos Nivel 3.5</option>
                      <option value="Grupo Ranking Top 10">Grupo Ranking Top 10</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 3. Selector de Género: Masculina, Femenina o Mixta */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">
                  Modalidad por Género
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                      gender === 'male'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Masculina
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                      gender === 'female'
                        ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-500 text-pink-700 dark:text-pink-300 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Femenina
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('mixed')}
                    className={`py-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                      gender === 'mixed'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Mixta
                  </button>
                </div>
              </div>

              {/* 4. Modalidad de Cobro: Pago Único vs Split Payment */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">
                  Modalidad de Cobro & Cuotas
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('split')}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      paymentMode === 'split'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs">Split Payment (1/4)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      Cada jugador paga su parte
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('single')}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      paymentMode === 'single'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs">Pago Único</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      1 jugador abona toda la pista
                    </div>
                  </button>
                </div>

                {/* Política de pago: Online, Mostrador o Ambos */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentPolicy('both')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition cursor-pointer text-[11px] font-bold ${
                      paymentPolicy === 'both'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Online o Mostrador
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentPolicy('online_only')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition cursor-pointer text-[11px] font-bold ${
                      paymentPolicy === 'online_only'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Pago Online Obligatorio
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentPolicy('counter_only')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition cursor-pointer text-[11px] font-bold ${
                      paymentPolicy === 'counter_only'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Pago en Recepción
                  </button>
                </div>
              </div>

              {/* Pista asignada */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                  {t('matches.formCourt', 'Pista Asignada')}
                </label>
                <select
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {courts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.surface})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    {t('matches.formDate', 'Fecha')}
                  </label>
                  <input
                    type="date"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    {t('matches.formTime', 'Hora Inicio')}
                  </label>
                  <input
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Niveles ELO y Precio */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Nivel Mínimo
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={minLevel}
                    onChange={(e) => setMinLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Nivel Máximo
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Precio/Jug. (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    value={pricePerPlayer}
                    onChange={(e) => setPricePerPlayer(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {t('matches.cancelBtn', 'Cancelar')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                >
                  {t('matches.submitCreateBtn', 'Publicar Partida')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: INSCRIBIR O INVITAR JUGADOR (Socio Registrado / WhatsApp / Email)
          ====================================================================== */}
      {selectedMatchForAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Inscribir o Invitar Jugador
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedMatchForAdd.courtName} · Nivel {selectedMatchForAdd.minLevel.toFixed(2)} - {selectedMatchForAdd.maxLevel.toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchForAdd(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas de modo de inscripción */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setInviteTab('registered')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${
                  inviteTab === 'registered'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Socio Registrado
              </button>
              <button
                type="button"
                onClick={() => setInviteTab('external')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${
                  inviteTab === 'external'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                WhatsApp / Email
              </button>
              <button
                type="button"
                onClick={() => setInviteTab('guest')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${
                  inviteTab === 'guest'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Invitado Libre
              </button>
            </div>

            <form onSubmit={handleAddPlayerSubmit} className="space-y-4 text-xs">
              {/* Opción A: Desplegable con buscador de socios registrados */}
              {inviteTab === 'registered' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Seleccionar Socio del Club
                  </label>
                  <select
                    value={selectedMemberOption}
                    onChange={(e) => {
                      setSelectedMemberOption(e.target.value);
                      const found = registeredClubMembers.find((m) => m.name === e.target.value);
                      if (found) setGuestLevel(found.level);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {registeredClubMembers.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Opción B: Enviar invitación externa por WhatsApp o Email */}
              {inviteTab === 'external' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Nombre del Jugador Invitado
                    </label>
                    <input
                      type="text"
                      value={externalPlayerName}
                      onChange={(e) => setExternalPlayerName(e.target.value)}
                      placeholder="Ej. Lucas Rey"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setExternalChannel('whatsapp')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
                        externalChannel === 'whatsapp'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExternalChannel('email')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
                        externalChannel === 'email'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-800 dark:text-indigo-300 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Correo Electrónico</span>
                    </button>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      {externalChannel === 'whatsapp' ? 'Teléfono Móvil (WhatsApp)' : 'Correo Electrónico'}
                    </label>
                    <input
                      type={externalChannel === 'whatsapp' ? 'tel' : 'email'}
                      value={externalContact}
                      onChange={(e) => setExternalContact(e.target.value)}
                      placeholder={externalChannel === 'whatsapp' ? '+34 600 000 000' : 'jugador@email.com'}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Opción C: Invitado Manual */}
              {inviteTab === 'guest' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Nombre del Jugador
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ej. Lucas Rey Domínguez"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
              )}

              {/* Nivel y Posición */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Nivel FEP Decimal
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={guestLevel}
                    onChange={(e) => setGuestLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Posición Preferida
                  </label>
                  <select
                    value={guestPosition}
                    onChange={(e) => setGuestPosition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="both">Indiferente / Ambas</option>
                    <option value="drive">Drive (Derecha)</option>
                    <option value="reves">Revés (Izquierda)</option>
                  </select>
                </div>
              </div>

              {/* Ajuste de cobro específico por jugador (Requisito Bloque 2) */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t('matches.adjustPricePerPlayer', 'Cobro específico para este jugador (€)')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder={`Por defecto (${selectedMatchForAdd.pricePerPlayer.toFixed(2)} €)`}
                    value={customPlayerFee}
                    onChange={(e) => setCustomPlayerFee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <span className="text-xs text-slate-400 font-bold shrink-0">€</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMatchForAdd(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {t('matches.cancelBtn', 'Cancelar')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                >
                  {inviteTab === 'external' ? 'Enviar Invitación' : 'Confirmar Jugador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 4: SOLICITUD DE PLAZA POR NIVEL (Si nivel es diferente)
          ====================================================================== */}
      {slotRequestTargetMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {t('matches.requestSlotModalTitle', 'Solicitud de Plaza por Nivel')}
                </h3>
                <p className="text-xs text-slate-500">
                  {slotRequestTargetMatch.courtName} · Rango {slotRequestTargetMatch.minLevel.toFixed(2)} - {slotRequestTargetMatch.maxLevel.toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSlotRequestTargetMatch(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Si tu nivel actual difiere del rango fijado para la partida, puedes enviar una solicitud formal. El club u organizador recibirá tu propuesta para aceptarla o rechazarla.
            </p>

            <form onSubmit={handleRequestSlotSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Jugador</label>
                <input
                  type="text"
                  required
                  value={reqPlayerName}
                  onChange={(e) => setReqPlayerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nivel ELO Actual</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="7.0"
                    required
                    value={reqPlayerLevel}
                    onChange={(e) => setReqPlayerLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Posición</label>
                  <select
                    value={reqPlayerPosition}
                    onChange={(e) => setReqPlayerPosition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white"
                  >
                    <option value="drive">Drive</option>
                    <option value="reves">Revés</option>
                    <option value="both">Indiferente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono Móvil (Avisos WhatsApp)</label>
                <input
                  type="tel"
                  value={reqPlayerPhone}
                  onChange={(e) => setReqPlayerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSlotRequestTargetMatch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 5: EDICIÓN COMPLETA DE PARTIDA ABIERTA
          ====================================================================== */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Editar Datos de la Partida
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modifica pista, horario, nivel ELO y tarifas de la convocatoria
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMatch(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pista Asignada
                </label>
                <select
                  value={editFormData.courtId}
                  onChange={(e) => setEditFormData({ ...editFormData, courtId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white"
                >
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name} ({court.courtType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duración
                  </label>
                  <select
                    value={editFormData.durationMinutes}
                    onChange={(e) => setEditFormData({ ...editFormData, durationMinutes: parseInt(e.target.value) })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white"
                  >
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                    <option value={120}>120 min</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nivel Mín
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={editFormData.minLevel}
                    onChange={(e) => setEditFormData({ ...editFormData, minLevel: parseFloat(e.target.value) })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nivel Máx
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="1.0"
                    max="7.0"
                    value={editFormData.maxLevel}
                    onChange={(e) => setEditFormData({ ...editFormData, maxLevel: parseFloat(e.target.value) })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Precio/Jug. (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={editFormData.pricePerPlayer}
                    onChange={(e) => setEditFormData({ ...editFormData, pricePerPlayer: parseFloat(e.target.value) })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Género
                  </label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as any })}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white"
                  >
                    <option value="male">Masculina</option>
                    <option value="female">Femenina</option>
                    <option value="mixed">Mixta</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Modo
                  </label>
                  <select
                    value={editFormData.mode}
                    onChange={(e) => setEditFormData({ ...editFormData, mode: e.target.value as any })}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white"
                  >
                    <option value="competitive">Competitivo</option>
                    <option value="friendly">Amistoso</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMatch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 6: CONFIRMACIÓN PREVIA PARA ELIMINAR PARTIDA ABIERTA
          ====================================================================== */}
      {matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  ¿Eliminar Partida Abierta?
                </h3>
                <p className="text-xs text-slate-500">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 space-y-1 leading-relaxed">
              <p>
                Se cancelará la partida programada en <strong>{matchToDelete.courtName}</strong> a las <strong>{matchToDelete.startTime.split('T')[1]?.slice(0, 5) || '19:30'}</strong> ({matchToDelete.startTime.split('T')[0]}).
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                Se liberará el hueco en el cuadrante de reservas y se notificará la cancelación a los {matchToDelete.players.length} jugadores convocados.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMatchToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteOpenMatch(matchToDelete.id);
                  setMatchToDelete(null);
                  setSelectedMatchForDetail(null);
                }}
                className="px-4.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, Eliminar Partida</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatches;
