import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenMatch, OpenMatchSlotRequest } from '../../types/database';
import { INITIAL_OPEN_MATCHES } from '../../data/initialData';
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
  Megaphone,
  Send,
  Smartphone,
  Target,
  ChevronDown,
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
    isMultiVenue,
    venues,
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    isClubOpen,
    toggleClubOpenState,
    triggerDemoToast,
    setAdminTab,
    navigateToPlayerProfile,
    playerGroups,
    sendGroupConvocatoria,
    customers,
    sendNotification,
    t,
  } = useApp();

  // Unified Venue Selector Dropdown State
  const [isVenueSelectorOpen, setIsVenueSelectorOpen] = useState(false);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'full'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'iniciacion' | 'intermedio' | 'avanzado'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'mixed'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private_group'>('all');
  const [venueFilter, setVenueFilter] = useState<string>('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Temporary filter states for the Clean Filter Modal
  const [tempSearch, setTempSearch] = useState('');
  const [tempLevelFilter, setTempLevelFilter] = useState<'all' | 'iniciacion' | 'intermedio' | 'avanzado'>('all');
  const [tempGenderFilter, setTempGenderFilter] = useState<'all' | 'male' | 'female' | 'mixed'>('all');
  const [tempVisibilityFilter, setTempVisibilityFilter] = useState<'all' | 'public' | 'private_group'>('all');
  const [tempVenueFilter, setTempVenueFilter] = useState<string>('all');

  const openFilterModal = () => {
    setTempSearch(search);
    setTempLevelFilter(levelFilter);
    setTempGenderFilter(genderFilter);
    setTempVisibilityFilter(visibilityFilter);
    setTempVenueFilter(venueFilter);
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = () => {
    setSearch(tempSearch);
    setLevelFilter(tempLevelFilter);
    setGenderFilter(tempGenderFilter);
    setVisibilityFilter(tempVisibilityFilter);
    setVenueFilter(tempVenueFilter);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setTempSearch('');
    setTempLevelFilter('all');
    setTempGenderFilter('all');
    setTempVisibilityFilter('all');
    setTempVenueFilter('all');
    setSearch('');
    setLevelFilter('all');
    setGenderFilter('all');
    setVisibilityFilter('all');
    setVenueFilter('all');
    setIsFilterModalOpen(false);
  };

  const activeFiltersCount =
    (search ? 1 : 0) +
    (levelFilter !== 'all' ? 1 : 0) +
    (genderFilter !== 'all' ? 1 : 0) +
    (visibilityFilter !== 'all' ? 1 : 0) +
    (venueFilter !== 'all' ? 1 : 0);

  // Modals & Action States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMatchForAdd, setSelectedMatchForAdd] = useState<OpenMatch | null>(null);
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<OpenMatch | null>(null);
  const [slotRequestTargetMatch, setSlotRequestTargetMatch] = useState<OpenMatch | null>(null);
  const [editingMatch, setEditingMatch] = useState<OpenMatch | null>(null);
  const [matchToDelete, setMatchToDelete] = useState<OpenMatch | null>(null);
  const [replacingPlayerName, setReplacingPlayerName] = useState<string | null>(null);

  // Hub Unificado: Compartir / Notificar
  const [shareNotifyMatch, setShareNotifyMatch] = useState<OpenMatch | null>(null);
  const [shareChannel, setShareChannel] = useState<'email' | 'whatsapp' | 'push'>('whatsapp');
  const [segmentType, setSegmentType] = useState<'individual' | 'group' | 'teams' | 'level'>('level');
  const [selectedIndividualPlayer, setSelectedIndividualPlayer] = useState<string>('Carlos Méndez');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedTeamName, setSelectedTeamName] = useState<string>('Equipo A Masculino (Federado 1ª)');
  const [hubSubject, setHubSubject] = useState<string>('');
  const [hubMessage, setHubMessage] = useState<string>('');

  const CLUB_PLAYERS_LIST = [
    { id: 'p-1', name: 'Carlos Méndez', level: 3.85, phone: '+34 611 22 33 44', email: 'carlos.mendez@galiciapadel.com' },
    { id: 'p-2', name: 'Diego Soto', level: 3.90, phone: '+34 622 33 44 55', email: 'diego.soto@email.es' },
    { id: 'p-3', name: 'Brais Quintana', level: 4.20, phone: '+34 633 44 55 66', email: 'brais.padel@email.es' },
    { id: 'p-4', name: 'Lucía Casal', level: 3.65, phone: '+34 644 55 66 77', email: 'lucia.casal@email.es' },
    { id: 'p-5', name: 'Marcos Seijo', level: 4.10, phone: '+34 655 66 77 88', email: 'marcos.seijo@email.es' },
    { id: 'p-6', name: 'Mateo Varela', level: 4.10, phone: '+34 666 77 88 99', email: 'mateo.varela@email.es' },
    { id: 'p-7', name: 'Lucas Piñeiro', level: 3.85, phone: '+34 677 88 99 00', email: 'lucas.pineiro@email.es' },
  ];

  // Deep Link & URL Sync para /admin/partidas/:id
  React.useEffect(() => {
    const handleUrlSync = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path.startsWith('/admin/partidas/') || path.startsWith('/gestion/partidas/')) {
          const id = path.split('/').pop();
          if (id && id !== 'partidas') {
            const found = openMatches.find((m) => m.id === id);
            if (found) {
              setSelectedMatchForDetail(found);
            }
          }
        }
      }
    };
    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, [openMatches]);

  const openMatchDetail = (m: OpenMatch) => {
    setSelectedMatchForDetail(m);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/admin/partidas/${m.id}`);
    }
  };

  const closeMatchDetail = () => {
    setSelectedMatchForDetail(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/admin/partidas');
    }
  };

  // Convocatoria a Grupo de Jugadores (Sustituto de WhatsApp)
  const [notifyGroupMatch, setNotifyGroupMatch] = useState<OpenMatch | null>(null);
  const [selectedGroupIdForNotification, setSelectedGroupIdForNotification] = useState<string>('');
  const [convocatoriaCustomSubject, setConvocatoriaCustomSubject] = useState('');
  const [convocatoriaCustomMessage, setConvocatoriaCustomMessage] = useState('');
  const [convocatoriaChannels, setConvocatoriaChannels] = useState<('push' | 'email' | 'whatsapp')[]>([
    'push',
    'email',
    'whatsapp',
  ]);

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
  const [selectedCreatorCustomerId, setSelectedCreatorCustomerId] = useState<string>('c-1');
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');
  const [isCreatorDropdownOpen, setIsCreatorDropdownOpen] = useState(false);
  const [modalVenueId, setModalVenueId] = useState<string>(
    venues.find((v) => v.id !== 'all')?.id || 'venue-san-mateo'
  );
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || 'court-1');
  const [matchDate, setMatchDate] = useState('2026-10-10');
  const [matchTime, setMatchTime] = useState('19:30');
  const [matchDuration, setMatchDuration] = useState<60 | 90 | 120>(90);
  const [allowPlayerCustomDurations, setAllowPlayerCustomDurations] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('setmio_allow_player_durations') === 'true';
    }
    return false;
  });
  const [adminCreationMode, setAdminCreationMode] = useState<'empty' | 'assign_titular'>('empty');
  const [titularCustomerId, setTitularCustomerId] = useState<string>('c-1');
  const [titularPaymentChoice, setTitularPaymentChoice] = useState<'split' | 'full'>('split');
  const [positionAssignmentMode, setPositionAssignmentMode] = useState<'recommended' | 'fixed'>('recommended');
  const [slot1Pos, setSlot1Pos] = useState<'drive' | 'reves'>('drive');
  const [slot2Pos, setSlot2Pos] = useState<'drive' | 'reves'>('reves');
  const [slot3Pos, setSlot3Pos] = useState<'drive' | 'reves'>('drive');
  const [slot4Pos, setSlot4Pos] = useState<'drive' | 'reves'>('reves');
  const [minLevel, setMinLevel] = useState(3.0);
  const [maxLevel, setMaxLevel] = useState(4.25);
  const [pricePerPlayer, setPricePerPlayer] = useState(7.5);
  const [memberPricePerPlayer, setMemberPricePerPlayer] = useState(6.0);
  const [matchMode, setMatchMode] = useState<'competitive' | 'friendly'>('competitive');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'group'>('public');
  const [restrictedGroupName, setRestrictedGroupName] = useState('Comunidad Nivel 3.5 - 4.25');
  const [audienceCategory, setAudienceCategory] = useState<'groups' | 'teams'>('groups');
  const [convocatoriaAudienceCategory, setConvocatoriaAudienceCategory] = useState<'groups' | 'teams'>('teams');
  const [gender, setGender] = useState<'male' | 'female' | 'mixed'>('male');
  const [paymentMode, setPaymentMode] = useState<'split' | 'single'>('split');
  const [paymentPolicy, setPaymentPolicy] = useState<'online_only' | 'counter_only' | 'both'>('both');

  // Helper minimalista para formateo de hora y duración: "10:00 - 11:30 (1h 30m)"
  const formatMatchTimeWithDuration = (startTimeStr: string, durationMinutes: number = 90) => {
    let timePart = '19:30';
    if (startTimeStr.includes('T')) {
      timePart = startTimeStr.replace('Z', '').split('T')[1]?.slice(0, 5) || '19:30';
    } else if (startTimeStr.includes(':')) {
      timePart = startTimeStr.slice(0, 5);
    }

    const [hStr, mStr] = timePart.split(':');
    const startH = parseInt(hStr || '19', 10);
    const startM = parseInt(mStr || '30', 10);
    const totalStartMinutes = startH * 60 + startM;
    const totalEndMinutes = totalStartMinutes + durationMinutes;

    const endH = Math.floor(totalEndMinutes / 60) % 24;
    const endM = totalEndMinutes % 60;
    const endTimePart = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const durH = Math.floor(durationMinutes / 60);
    const durM = durationMinutes % 60;
    const durationLabel =
      durM > 0
        ? durH > 0
          ? `${durH}h ${durM}m`
          : `${durM}m`
        : `${durH}h`;

    return `${timePart} - ${endTimePart} (${durationLabel})`;
  };

  // Helper simplificado para fechas legibles estilo "Jue, 1 Oct · 19:30"
  const formatSimplifiedMatchDate = (startTimeStr: string) => {
    try {
      let datePart = '2026-10-01';
      let timePart = '19:30';
      if (startTimeStr.includes('T')) {
        const parts = startTimeStr.replace('Z', '').split('T');
        datePart = parts[0];
        timePart = parts[1]?.slice(0, 5) || '19:30';
      } else if (startTimeStr.includes(' ')) {
        const parts = startTimeStr.split(' ');
        datePart = parts[0];
        timePart = parts[1]?.slice(0, 5) || '19:30';
      }
      const [y, m, d] = datePart.split('-').map(Number);
      const dateObj = new Date(y, (m || 10) - 1, d || 1);
      const weekday = dateObj.toLocaleDateString('es-ES', { weekday: 'short' });
      const capWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('.', '');
      const month = dateObj.toLocaleDateString('es-ES', { month: 'short' });
      const capMonth = month.charAt(0).toUpperCase() + month.slice(1).replace('.', '');
      return `${capWeekday}, ${d} ${capMonth} · ${timePart}`;
    } catch {
      return startTimeStr;
    }
  };

  // Pistas filtradas por la sede seleccionada en el formulario de creación
  const availableModalCourts = useMemo(() => {
    if (isMultiVenue && isClubCreator && modalVenueId) {
      const filtered = courts.filter(
        (c) => c.venueId === modalVenueId || (!c.venueId && modalVenueId === 'venue-san-mateo')
      );
      return filtered.length > 0 ? filtered : courts;
    }
    return courts;
  }, [courts, isMultiVenue, isClubCreator, modalVenueId]);

  // Initial slot assignments during match creation
  const [slot2PlayerId, setSlot2PlayerId] = useState<string>('none');
  const [slot3PlayerId, setSlot3PlayerId] = useState<string>('none');
  const [slot4PlayerId, setSlot4PlayerId] = useState<string>('none');

  // ELO Scale standard
  const ELO_SCALE = useMemo(
    () => [
      1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75,
      4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0,
    ],
    []
  );

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

  // Source of matches: if openMatches happens to be empty, always ensure fallback to INITIAL_OPEN_MATCHES
  const effectiveMatches = useMemo(() => {
    return Array.isArray(openMatches) && openMatches.length > 0 ? openMatches : INITIAL_OPEN_MATCHES;
  }, [openMatches]);

  // Venue-filtered matches for KPIs and base list
  const venueFilteredMatches = useMemo(() => {
    const list = effectiveMatches.filter((m) => {
      if (isConsolidatedView || selectedVenueId === 'all' || !isMultiVenue) return true;
      const court = courts.find((c) => c.id === m.courtId);
      const matchVenueId = (m as any).venueId || court?.venueId;
      return !matchVenueId || matchVenueId === selectedVenueId;
    });
    return list.length > 0 ? list : effectiveMatches;
  }, [effectiveMatches, selectedVenueId, isConsolidatedView, isMultiVenue, courts]);

  const totalOpenSlots = venueFilteredMatches.reduce((acc, m) => acc + Math.max(0, 4 - m.players.length), 0);
  const fullMatchesCount = venueFilteredMatches.filter((m) => m.players.length >= 4).length;
  const activePlayersCount = venueFilteredMatches.reduce((acc, m) => acc + m.players.length, 0);
  const pendingRequestsTotal = venueFilteredMatches.reduce(
    (acc, m) => acc + (m.slotRequests ? m.slotRequests.filter((r) => r.status === 'pending').length : 0),
    0
  );

  const matchWithPendingRequest = useMemo(() => {
    return (
      venueFilteredMatches.find((m) => m.slotRequests?.some((r) => r.status === 'pending')) ||
      effectiveMatches.find((m) => m.slotRequests?.some((r) => r.status === 'pending'))
    );
  }, [venueFilteredMatches, effectiveMatches]);

  // Filter logic: uses venueFilteredMatches as base so counters and list are 100% in sync
  const filteredMatches = useMemo(() => {
    return venueFilteredMatches.filter((m) => {
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

      // Venue Filter
      const court = courts.find((c) => c.id === m.courtId);
      const matchVenueId = (m as any).venueId || court?.venueId;
      const matchVenue = venueFilter === 'all' || matchVenueId === venueFilter;

      return matchSearch && matchStatus && matchLevel && matchGender && matchVis && matchVenue;
    });
  }, [venueFilteredMatches, search, statusFilter, levelFilter, genderFilter, visibilityFilter, venueFilter, courts]);

  // Handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === selectedCourtId) || courts[0];
    const startISO = `${matchDate}T${matchTime}:00Z`;
    const finalCreatorName = isClubCreator
      ? `${currentTenant.name} (Club Oficial)`
      : creatorName.trim() || 'Organizador';

    // Build initial players list: Admin NEVER occupies a slot
    const initialPlayers: OpenMatch['players'] = [];

    if (isClubCreator) {
      if (adminCreationMode === 'assign_titular') {
        const titularCust = customers.find((c) => c.id === titularCustomerId) || customers[0];
        const titularPrice = titularCust?.isMember ? memberPricePerPlayer : pricePerPlayer;
        initialPlayers.push({
          id: `p-${Date.now()}-titular`,
          name: titularCust?.name || 'Jugador Titular',
          level: titularCust?.level || 4.0,
          position: slot1Pos,
          paid: true,
          customPrice: titularPaymentChoice === 'full' ? titularPrice * 4 : titularPrice,
          pair: 1,
          isPositionFixed: positionAssignmentMode === 'fixed',
        });
      }
      // If adminCreationMode === 'empty', initialPlayers starts with 0 players!
    } else {
      // Non-club organizer
      initialPlayers.push({
        id: `p-${Date.now()}-creator`,
        name: finalCreatorName,
        level: Number(creatorLevel) || 4.0,
        position: creatorPosition,
        paid: true,
        pair: 1,
        isPositionFixed: positionAssignmentMode === 'fixed',
      });
    }

    const invitedSlotIds = [
      { id: slot2PlayerId, pair: 1 as const, pos: slot2Pos, slotNum: 2 },
      { id: slot3PlayerId, pair: 2 as const, pos: slot3Pos, slotNum: 3 },
      { id: slot4PlayerId, pair: 2 as const, pos: slot4Pos, slotNum: 4 },
    ].filter((s) => s.id && s.id !== 'none');

    const notifiedPlayerNames: string[] = [];

    invitedSlotIds.forEach((slotInfo, idx) => {
      const cust = customers.find((c) => c.id === slotInfo.id);
      if (cust) {
        notifiedPlayerNames.push(cust.name);
        const slotPrice = cust.isMember ? memberPricePerPlayer : pricePerPlayer;
        initialPlayers.push({
          id: `p-${Date.now()}-${idx + 2}`,
          name: cust.name,
          level: cust.level || 3.5,
          position: slotInfo.pos,
          paid: false,
          customPrice: slotPrice,
          pair: slotInfo.pair,
          isPositionFixed: positionAssignmentMode === 'fixed',
        });

        // Enviar automáticamente notificación a cada jugador añadido para aceptar y pagar su plaza
        sendNotification({
          title: 'Convocatoria de Partida: Plaza Asignada',
          message: `${finalCreatorName} te ha asignado una plaza en la partida del ${matchDate} a las ${matchTime} h (${matchDuration} min) en ${court.name}. Importe: ${slotPrice.toFixed(2)} €. Entra para confirmar y abonar tu plaza.`,
          type: 'match',
          actionUrl: '/admin/partidas',
        });
      }
    });

    const chosenVenue = isMultiVenue && isClubCreator
      ? (venues.find((v) => v.id === modalVenueId) || venues[1] || venues[0])
      : (court.venueId ? venues.find((v) => v.id === court.venueId) : venues[1] || venues[0]);

    createOpenMatch({
      courtId: court.id,
      courtName: court.name,
      venueId: isMultiVenue ? chosenVenue?.id : court.venueId,
      venueName: isMultiVenue ? chosenVenue?.name : court.venueName,
      venueShortName: isMultiVenue ? chosenVenue?.shortName : undefined,
      creatorName: finalCreatorName,
      creatorLevel: Number(creatorLevel) || 4.0,
      startTime: startISO,
      durationMinutes: matchDuration,
      minLevel: Number(minLevel),
      maxLevel: Number(maxLevel),
      pricePerPlayer: Number(pricePerPlayer),
      memberPricePerPlayer: Number(memberPricePerPlayer),
      status: initialPlayers.length >= 4 ? 'full' : 'open',
      mode: matchMode,
      visibility,
      restrictedGroupName: visibility === 'group' ? restrictedGroupName : undefined,
      gender,
      isClubCreated: isClubCreator,
      paymentMode: isClubCreator && adminCreationMode === 'assign_titular' && titularPaymentChoice === 'full' ? 'single' : paymentMode,
      paymentPolicy,
      positionMode: positionAssignmentMode,
      players: initialPlayers,
    });

    setShowCreateModal(false);
    setSlot2PlayerId('none');
    setSlot3PlayerId('none');
    setSlot4PlayerId('none');

    triggerDemoToast(
      t('matches.toastCreatedTitle', 'Partida Publicada con Éxito'),
      notifiedPlayerNames.length > 0
        ? `Partida creada en ${court.name} (${matchDuration} min). Notificación automática remitida a ${notifiedPlayerNames.join(', ')} para confirmar su plaza.`
        : isClubCreator && adminCreationMode === 'empty'
          ? `Partida 100% abierta creada en ${court.name} (${matchDuration} min, 4 plazas disponibles). El admin no ocupa plaza.`
          : `Partida en ${court.name} (${matchDuration} min, ${gender === 'male' ? 'Masculina' : gender === 'female' ? 'Femenina' : 'Mixta'}).`,
      'success'
    );
  };

  const handleCreateAndNotifyGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === selectedCourtId) || courts[0];
    const startISO = `${matchDate}T${matchTime}:00Z`;
    const finalCreatorName = isClubCreator
      ? `${currentTenant.name} (Club Oficial)`
      : creatorName.trim() || 'Organizador';

    const initialPlayers: OpenMatch['players'] = [];

    if (isClubCreator) {
      if (adminCreationMode === 'assign_titular') {
        const titularCust = customers.find((c) => c.id === titularCustomerId) || customers[0];
        const titularPrice = titularCust?.isMember ? memberPricePerPlayer : pricePerPlayer;
        initialPlayers.push({
          id: `p-${Date.now()}-titular`,
          name: titularCust?.name || 'Jugador Titular',
          level: titularCust?.level || 4.0,
          position: slot1Pos,
          paid: true,
          customPrice: titularPaymentChoice === 'full' ? titularPrice * 4 : titularPrice,
          pair: 1,
          isPositionFixed: positionAssignmentMode === 'fixed',
        });
      }
    } else {
      initialPlayers.push({
        id: `p-${Date.now()}-creator`,
        name: finalCreatorName,
        level: Number(creatorLevel) || 4.0,
        position: creatorPosition,
        paid: true,
        pair: 1,
        isPositionFixed: positionAssignmentMode === 'fixed',
      });
    }

    const invitedSlotIds = [
      { id: slot2PlayerId, pair: 1 as const, pos: slot2Pos, slotNum: 2 },
      { id: slot3PlayerId, pair: 2 as const, pos: slot3Pos, slotNum: 3 },
      { id: slot4PlayerId, pair: 2 as const, pos: slot4Pos, slotNum: 4 },
    ].filter((s) => s.id && s.id !== 'none');

    const notifiedPlayerNames: string[] = [];

    invitedSlotIds.forEach((slotInfo, idx) => {
      const cust = customers.find((c) => c.id === slotInfo.id);
      if (cust) {
        notifiedPlayerNames.push(cust.name);
        const slotPrice = cust.isMember ? memberPricePerPlayer : pricePerPlayer;
        initialPlayers.push({
          id: `p-${Date.now()}-${idx + 2}`,
          name: cust.name,
          level: cust.level || 3.5,
          position: slotInfo.pos,
          paid: false,
          customPrice: slotPrice,
          pair: slotInfo.pair,
          isPositionFixed: positionAssignmentMode === 'fixed',
        });

        sendNotification({
          title: 'Convocatoria de Partida: Plaza Asignada',
          message: `${finalCreatorName} te ha asignado una plaza en la partida del ${matchDate} a las ${matchTime} h (${matchDuration} min) en ${court.name}. Importe: ${slotPrice.toFixed(2)} €. Entra para aceptar y pagar tu plaza.`,
          type: 'match',
          actionUrl: '/admin/partidas',
        });
      }
    });

    const newMatchData: OpenMatch = {
      id: `match-${Date.now()}`,
      tenantId: currentTenant.id,
      courtId: court.id,
      courtName: court.name,
      creatorName: finalCreatorName,
      creatorLevel: Number(creatorLevel) || 4.0,
      startTime: startISO,
      durationMinutes: matchDuration,
      minLevel: Number(minLevel),
      maxLevel: Number(maxLevel),
      pricePerPlayer: Number(pricePerPlayer),
      memberPricePerPlayer: Number(memberPricePerPlayer),
      status: initialPlayers.length >= 4 ? 'full' : 'open',
      mode: matchMode,
      visibility,
      restrictedGroupName: visibility === 'group' ? restrictedGroupName : undefined,
      gender,
      isClubCreated: isClubCreator,
      paymentMode: isClubCreator && adminCreationMode === 'assign_titular' && titularPaymentChoice === 'full' ? 'single' : paymentMode,
      paymentPolicy,
      positionMode: positionAssignmentMode,
      players: initialPlayers,
    };

    createOpenMatch(newMatchData);
    setShowCreateModal(false);
    setSlot2PlayerId('none');
    setSlot3PlayerId('none');
    setSlot4PlayerId('none');

    triggerDemoToast(
      t('matches.toastCreatedTitle', 'Partida Publicada con Éxito'),
      notifiedPlayerNames.length > 0
        ? `Partida creada en ${court.name} (${matchDuration} min). Notificación automática remitida a ${notifiedPlayerNames.join(', ')}.`
        : `Partida creada en ${court.name} (${matchDuration} min). Configura la convocatoria para el grupo o equipo.`,
      'success'
    );
    handleOpenNotifyGroup(newMatchData);
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

  // Convocatoria a Grupo de Jugadores
  const handleOpenNotifyGroup = (match: OpenMatch) => {
    setNotifyGroupMatch(match);
    const bestMatchingGroup =
      playerGroups.find(
        (g) =>
          g.minLevel !== undefined &&
          g.maxLevel !== undefined &&
          match.minLevel >= g.minLevel - 0.25 &&
          match.maxLevel <= g.maxLevel + 0.25
      ) || playerGroups[0];

    const targetGroupId = bestMatchingGroup ? bestMatchingGroup.id : playerGroups[0]?.id || '';
    setSelectedGroupIdForNotification(targetGroupId);

    const openSlots = Math.max(1, 4 - match.players.length);
    const dateFormatted = match.startTime.split('T')[0] || 'Hoy';
    const timeFormatted = match.startTime.includes('T')
      ? match.startTime.split('T')[1].slice(0, 5)
      : '19:30';

    setConvocatoriaCustomSubject(
      `🏆 Convocatoria de Pádel: ${openSlots} plaza${openSlots > 1 ? 's' : ''} libre${openSlots > 1 ? 's' : ''} en ${match.courtName}`
    );
    setConvocatoriaCustomMessage(
      `Partida abierta nivel ${match.minLevel.toFixed(2)} - ${match.maxLevel.toFixed(2)} el ${dateFormatted} a las ${timeFormatted} h en ${match.courtName}. Quedan ${openSlots} plaza(s) disponible(s). Cuota individual: ${match.pricePerPlayer.toFixed(2)} € (Pago con monedero o tarjeta).`
    );
    setConvocatoriaChannels(['push', 'email', 'whatsapp']);
  };

  const handleSendMatchConvocatoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyGroupMatch) return;
    const targetGroup =
      playerGroups.find((g) => g.id === selectedGroupIdForNotification) || playerGroups[0];
    if (!targetGroup) return;

    const actionUrl = `https://setmio.com/partida/${notifyGroupMatch.id}`;

    sendGroupConvocatoria({
      groupId: targetGroup.id,
      groupName: targetGroup.name,
      type: 'match',
      relatedId: notifyGroupMatch.id,
      title: convocatoriaCustomSubject.trim(),
      message: convocatoriaCustomMessage.trim(),
      actionUrl,
      recipientsCount: targetGroup.memberCount,
      channels: convocatoriaChannels,
    });

    setNotifyGroupMatch(null);
  };

  const handleMatchWhatsAppShare = () => {
    if (!notifyGroupMatch) return;
    const actionUrl = `https://setmio.com/partida/${notifyGroupMatch.id}`;
    const text = `🎾 *CONVOCATORIA OFICIAL DE PARTIDA EN ${currentTenant.name.toUpperCase()}*\n\n📢 *${convocatoriaCustomSubject}*\n${convocatoriaCustomMessage}\n\n👉 *Reserva y paga tu plaza directamente aquí:* ${actionUrl}`;
    const encoded = encodeURIComponent(text);
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  // Hub Unificado: Compartir / Notificar
  const handleOpenShareNotifyHub = (match: OpenMatch) => {
    setShareNotifyMatch(match);
    const bestMatchingGroup =
      playerGroups.find(
        (g) =>
          g.minLevel !== undefined &&
          g.maxLevel !== undefined &&
          match.minLevel >= g.minLevel - 0.25 &&
          match.maxLevel <= g.maxLevel + 0.25
      ) || playerGroups[0];

    setSelectedGroupId(bestMatchingGroup ? bestMatchingGroup.id : playerGroups[0]?.id || '');
    setShareChannel('whatsapp');
    setSegmentType('level');
    setSelectedIndividualPlayer(CLUB_PLAYERS_LIST[0].name);

    const openSlots = Math.max(1, 4 - match.players.length);
    const dateFormatted = match.startTime.split('T')[0] || 'Hoy';
    const timeFormatted = match.startTime.includes('T')
      ? match.startTime.split('T')[1].slice(0, 5)
      : '19:30';

    setHubSubject(
      `🏆 Convocatoria de Pádel: ${openSlots} plaza${openSlots > 1 ? 's' : ''} libre${openSlots > 1 ? 's' : ''} en ${match.courtName}`
    );
    setHubMessage(
      `Partida abierta nivel ${match.minLevel.toFixed(2)} - ${match.maxLevel.toFixed(2)} el ${dateFormatted} a las ${timeFormatted} h en ${match.courtName}. Quedan ${openSlots} plaza(s) disponible(s). Cuota individual: ${match.pricePerPlayer.toFixed(2)} € (Pago con monedero o tarjeta).`
    );
  };

  const handleSendShareNotifyHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareNotifyMatch) return;
    const actionUrl = `https://setmio.com/partida/${shareNotifyMatch.id}`;

    let targetSummary = '';
    let recipientsCount = 1;

    if (segmentType === 'individual') {
      targetSummary = `Jugador: ${selectedIndividualPlayer}`;
      recipientsCount = 1;
    } else if (segmentType === 'group') {
      const grp = playerGroups.find((g) => g.id === selectedGroupId) || playerGroups[0];
      targetSummary = `Grupo: ${grp?.name || 'Grupo de socios'}`;
      recipientsCount = grp?.memberCount || 12;
    } else {
      targetSummary = `Nivel ${shareNotifyMatch.minLevel.toFixed(2)} - ${shareNotifyMatch.maxLevel.toFixed(2)} (ELO ${(shareNotifyMatch.minLevel * 350).toFixed(0)} - ${(shareNotifyMatch.maxLevel * 350).toFixed(0)})`;
      recipientsCount = 18;
    }

    if (shareChannel === 'whatsapp') {
      const text = `🎾 *CONVOCATORIA EN ${currentTenant.name.toUpperCase()}*\n\n📢 *${hubSubject}*\n${hubMessage}\n\n👉 *Reserva y paga tu plaza a 1/4:* ${actionUrl}`;
      const encoded = encodeURIComponent(text);
      if (typeof window !== 'undefined') {
        window.open(`https://wa.me/?text=${encoded}`, '_blank');
      }
      triggerDemoToast(
        'WhatsApp Enviado',
        `Convocatoria enviada vía WhatsApp a ${targetSummary} (${recipientsCount} destinatarios).`,
        'success'
      );
    } else if (shareChannel === 'email') {
      triggerDemoToast(
        'Email Corporativo Enviado',
        `Plantilla oficial del club enviada a ${targetSummary} (${recipientsCount} destinatarios).`,
        'success'
      );
    } else {
      triggerDemoToast(
        'Notificación Push Emitida',
        `Aviso instantáneo push enviado a la app de los socios de ${targetSummary}.`,
        'success'
      );
    }

    sendGroupConvocatoria({
      groupId: selectedGroupId || 'general',
      groupName: targetSummary,
      type: 'match',
      relatedId: shareNotifyMatch.id,
      title: hubSubject.trim(),
      message: hubMessage.trim(),
      actionUrl,
      recipientsCount,
      channels: [shareChannel],
    });

    setShareNotifyMatch(null);
  };

  return (
    <div className="max-w-7xl mx-auto pt-2 pb-16 space-y-4 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased">
      {/* ======================================================================
          1. CABECERA LIMPIA Y SIMÉTRICA (ESTILO INICIO & RESERVAS)
          ====================================================================== */}
      <section className="pt-2 pb-1 space-y-3" data-purpose="header-section">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide block mb-0.5">
              {currentTenant?.name || 'Centro de Pádel San Mateo'}
            </span>
            <h1 className="text-[22px] font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
              Partidas Abiertas
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="p-1 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95"
            title="Nueva partida"
            aria-label="Nueva partida"
          >
            <Plus className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Pill de Sede y Estado Operativo Unificado (colocado antes del Dashboard de Métricas) */}
        <div className="relative">
          <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Selector de Sede */}
            <div
              onClick={() => setIsVenueSelectorOpen(!isVenueSelectorOpen)}
              className="flex items-center gap-2 cursor-pointer group select-none min-w-0"
              title="Cambiar sede activa o ver red consolidada"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-100 dark:border-[#1A314D] flex items-center justify-center text-[#0B1A2D] dark:text-slate-200 shrink-0">
                <Building2 className="w-4 h-4 text-[#0B1A2D] dark:text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
                    {isConsolidatedView ? 'Todas las Sedes' : selectedVenue.shortName || selectedVenue.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B1A2D] dark:group-hover:text-white transition-transform ${
                      isVenueSelectorOpen ? 'rotate-180 text-[#0B1A2D] dark:text-white' : ''
                    }`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400 block truncate">
                  {venues.length > 1 ? `${venues.length} sedes conectadas` : 'Sede oficial'}
                </span>
              </div>
            </div>

            {/* Badge Dinámico de Apertura / Resumen Multisede */}
            <button
              type="button"
              onClick={isConsolidatedView ? () => setIsVenueSelectorOpen((prev) => !prev) : toggleClubOpenState}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 transition-all cursor-pointer hover:scale-102 shrink-0 select-none"
              title={
                isConsolidatedView
                  ? `Red multisede consolidada (${venues.length} sedes operativas)`
                  : 'Haz clic para conmutar estado de apertura de la sede'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConsolidatedView
                    ? 'bg-[#82b805] dark:bg-[#B7F229]'
                    : isClubOpen
                    ? 'bg-[#82b805] animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px] font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                {isConsolidatedView
                  ? `${venues.length} Sedes Activas`
                  : isClubOpen
                  ? 'Abierto · hasta 23:30'
                  : 'Cerrado temporal'}
              </span>
            </button>
          </div>

          {/* Menú Desplegable de Sedes */}
          {isVenueSelectorOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-30 p-2 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200 dark:border-[#1A314D] shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">
                Red Deportiva · Seleccionar Sede
              </div>

              {venues.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVenueId('all');
                    setIsVenueSelectorOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isConsolidatedView
                      ? 'bg-[#B7F229]/20 text-[#0B1A2D] dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Todas las Sedes (Consolidado)</span>
                  </span>
                  {isConsolidatedView && <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805]" />}
                </button>
              )}

              {venues
                .filter((v) => v.id !== 'all')
                .map((venue) => {
                  const isSelected = !isConsolidatedView && selectedVenueId === venue.id;
                  return (
                    <button
                      key={venue.id}
                      type="button"
                      onClick={() => {
                        setSelectedVenueId(venue.id);
                        setIsVenueSelectorOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#B7F229]/20 text-[#0B1A2D] dark:text-white'
                          : 'hover:bg-slate-50 dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{venue.name}</span>
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805] shrink-0" />}
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* 2. KPIs Ejecutivos de Partidas (Bento Grid) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" data-purpose="bento-metrics">
        {/* Total Partidas */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('matches.kpiTotal', 'Total Partidas')}
            </p>
            <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1.5">
            <span className="text-3xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight font-mono">
              {openMatches.length}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {fullMatchesCount} completadas (4/4)
          </p>
        </div>

        {/* Plazas Libres */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-[#B7F229]/60 dark:border-[#B7F229]/40 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('matches.kpiSlots', 'Plazas Libres')}
            </p>
            <span className="px-1.5 py-0.5 rounded-full bg-[#B7F229] text-[#0B1A2D] text-[9px] font-extrabold uppercase tracking-wide">
              Activo
            </span>
          </div>
          <div className="my-1.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight font-mono">
              {totalOpenSlots}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#B7F229]"></span>
          </div>
          <p className="text-[11px] font-semibold text-[#0B1A2D] dark:text-[#B7F229]">
            {t('matches.kpiSlotsDesc', 'Buscando jugadores')}
          </p>
        </div>

        {/* Jugadores Activos */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('matches.kpiPlayers', 'Jugadores Activos')}
            </p>
            <span className="w-6 h-6 rounded-lg bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1.5">
            <span className="text-3xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight font-mono">
              {activePlayersCount}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {t('matches.kpiPlayersDesc', 'En convocatoria')}
          </p>
        </div>

        {/* Solicitudes: Renombrado a 'Solicitudes' con botón interactivo directo a la partida */}
        <div
          onClick={() => {
            if (matchWithPendingRequest) {
              openMatchDetail(matchWithPendingRequest);
            }
          }}
          className={`bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between relative overflow-hidden transition-all ${
            matchWithPendingRequest ? 'cursor-pointer hover:border-[#8B5CF6]/60 hover:shadow-sm' : ''
          }`}
        >
          <div className="flex items-center justify-between gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Solicitudes
            </p>
            {pendingRequestsTotal > 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-200 dark:border-amber-800 whitespace-nowrap shrink-0">
                {pendingRequestsTotal} pend.
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] text-[10px] font-bold border border-[#B7F229]/50 whitespace-nowrap shrink-0">
                Al día
              </span>
            )}
          </div>
          <div className="my-1.5">
            <span className={`text-3xl font-extrabold tracking-tight font-mono ${pendingRequestsTotal > 0 ? 'text-amber-500' : 'text-[#0B1A2D] dark:text-white'}`}>
              {pendingRequestsTotal}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1">
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
              {pendingRequestsTotal > 0 ? 'Pendientes de aprobar' : 'Sin pendientes'}
            </p>
            {matchWithPendingRequest ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openMatchDetail(matchWithPendingRequest);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B5CF6] hover:text-[#7C3AED] hover:underline cursor-pointer shrink-0"
                title="Abrir partida con solicitud pendiente"
              >
                <span>Ver partida</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* 3. Filtros Horizontales Modernos (Dos filas limpias sin contenedores pesados) */}
      <section className="space-y-2.5" data-purpose="filtering-section">
        {/* Fila 1: Barra de búsqueda superior con icono de filtro perfectamente alineado */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por pista, jugador, nivel o fecha..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs font-medium text-[#0B1A2D] dark:text-white placeholder-slate-400 shadow-xs focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={openFilterModal}
            className={`h-9 px-3 bg-white dark:bg-[#0E2239] border rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 text-xs font-semibold ${
              activeFiltersCount > 0
                ? 'border-[#8B5CF6] text-[#8B5CF6]'
                : 'border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white hover:border-slate-300'
            }`}
            title="Más filtros"
            aria-label="Más filtros"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#8B5CF6] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Fila 2: Pestañas de estado planas, modernas y limpias (Fila fija simétrica sin scroll) */}
        <div className="grid grid-cols-3 gap-1.5 w-full py-0.5">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`w-full px-2 py-1.5 rounded-xl text-xs transition cursor-pointer font-bold flex items-center justify-center gap-1 text-center whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                : 'bg-white/80 dark:bg-[#0E2239]/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/70 dark:border-[#1A314D]'
            }`}
          >
            <span>Todas</span>
            <span className="font-mono text-[10px] opacity-75">({venueFilteredMatches.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('open')}
            className={`w-full px-2 py-1.5 rounded-xl text-xs transition cursor-pointer font-bold flex items-center justify-center gap-1 text-center whitespace-nowrap ${
              statusFilter === 'open'
                ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                : 'bg-white/80 dark:bg-[#0E2239]/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/70 dark:border-[#1A314D]'
            }`}
          >
            <span>Buscando</span>
            <span className="font-mono text-[10px] opacity-75">({venueFilteredMatches.filter((m) => m.players.length < 4).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('full')}
            className={`w-full px-2 py-1.5 rounded-xl text-xs transition cursor-pointer font-bold flex items-center justify-center gap-1 text-center whitespace-nowrap ${
              statusFilter === 'full'
                ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                : 'bg-white/80 dark:bg-[#0E2239]/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/70 dark:border-[#1A314D]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7F229] shrink-0" />
            <span>Completa</span>
            <span className="font-mono text-[10px] opacity-75">({fullMatchesCount})</span>
          </button>
        </div>

        {/* Chips de filtros activos para borrado rápido */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Filtros activos:
            </span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-medium">
                "{search}"
                <button type="button" onClick={() => setSearch('')} className="hover:text-rose-500">×</button>
              </span>
            )}
            {venueFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-medium">
                Sede: {venues.find((v) => v.id === venueFilter)?.shortName || venueFilter}
                <button type="button" onClick={() => setVenueFilter('all')} className="hover:text-rose-500">×</button>
              </span>
            )}
            {levelFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-medium">
                {levelFilter === 'iniciacion' ? 'Iniciación' : levelFilter === 'intermedio' ? 'Intermedio' : 'Avanzado'}
                <button type="button" onClick={() => setLevelFilter('all')} className="hover:text-rose-500">×</button>
              </span>
            )}
            {genderFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-medium">
                {genderFilter === 'male' ? 'Masculina' : genderFilter === 'female' ? 'Femenina' : 'Mixta'}
                <button type="button" onClick={() => setGenderFilter('all')} className="hover:text-rose-500">×</button>
              </span>
            )}
            {visibilityFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-medium">
                {visibilityFilter === 'public' ? 'Pública' : 'Grupo/Privada'}
                <button type="button" onClick={() => setVisibilityFilter('all')} className="hover:text-rose-500">×</button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[11px] text-slate-500 hover:text-rose-500 underline ml-1 cursor-pointer"
            >
              Limpiar todos
            </button>
          </div>
        )}
      </section>

      {/* ======================================================================
          MODAL DE FILTROS AVANZADOS LIMPIO
          ====================================================================== */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header del Modal de Filtros */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-none">
                    Filtros de Partidas
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Personaliza los parámetros de búsqueda y visualización
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Opciones Avanzadas */}
            <div className="space-y-4 text-xs">
              {/* Buscador */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Buscar por texto:
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                    placeholder="Buscar por pista, grupo o jugador..."
                    className="w-full pl-8.5 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  {tempSearch && (
                    <button
                      type="button"
                      onClick={() => setTempSearch('')}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Sede del Club (si es multi-sede) */}
              {isMultiVenue && (
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Sede del Club:
                  </label>
                  <select
                    value={tempVenueFilter}
                    onChange={(e) => setTempVenueFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="all">Todas las Sedes</option>
                    {venues
                      .filter((v) => v.id !== 'all')
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.shortName}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Nivel de Juego */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Nivel de Juego:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all', label: 'Todos los niveles' },
                    { id: 'iniciacion', label: 'Iniciación (≤3.25)' },
                    { id: 'intermedio', label: 'Intermedio (3.0 - 4.25)' },
                    { id: 'avanzado', label: 'Avanzado (≥4.0)' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setTempLevelFilter(lvl.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold transition text-left border ${
                        tempLevelFilter === lvl.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categoría de Género */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Categoría de Género:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all', label: 'Todas las categorías' },
                    { id: 'male', label: 'Masculina' },
                    { id: 'female', label: 'Femenina' },
                    { id: 'mixed', label: 'Mixta' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setTempGenderFilter(g.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold transition text-left border ${
                        tempGenderFilter === g.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Partida */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Tipo de Partida:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'all', label: 'Todas' },
                    { id: 'public', label: 'Pública' },
                    { id: 'private_group', label: 'Grupos / Privadas' },
                  ].map((vis) => (
                    <button
                      key={vis.id}
                      type="button"
                      onClick={() => setTempVisibilityFilter(vis.id as any)}
                      className={`p-2 rounded-xl text-[11px] font-bold transition text-center border ${
                        tempVisibilityFilter === vis.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {vis.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Acciones Claras: Limpiar filtros & Aplicar filtros */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                onClick={handleApplyFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}

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
            const socioPrice = (m.memberPricePerPlayer !== undefined && m.memberPricePerPlayer > 0)
              ? m.memberPricePerPlayer
              : Math.max(0, m.pricePerPlayer - 1.5);
            const noSocioPrice = m.pricePerPlayer;
            const organizerDisplay = m.isClubCreated && m.players.length > 0
              ? `Org: ${m.players[0].name}`
              : m.isClubCreated
              ? 'Org: Club Oficial'
              : `Org: ${m.creatorName}`;

            return (
              <article
                key={m.id}
                onClick={() => openMatchDetail(m)}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between cursor-pointer group space-y-3.5 ${
                  isFull
                    ? 'border-slate-300/80 dark:border-slate-700'
                    : 'border-slate-200/80 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                {/* 1. Fila Superior: Fecha y Hora Simplificada + Badges de Plazas y Género */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[#0B1A2D] dark:text-white font-bold">
                      {formatSimplifiedMatchDate(m.startTime)}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {m.durationMinutes || 90} min
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isFull ? (
                      <span className="inline-flex items-center gap-1.5 bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#B7F229]/50 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B7F229]"></span>
                        Completa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B7F229]"></span>
                        {openSlots} {openSlots === 1 ? 'libre' : 'libres'}
                      </span>
                    )}

                    <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-[#a78bfa] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {m.gender === 'female' ? 'Femenina' : m.gender === 'mixed' ? 'Mixta' : 'Masculina'}
                    </span>
                  </div>
                </div>

                {/* 2. Pista y Organizador */}
                <div>
                  <h2 className="text-sm font-extrabold text-[#0B1A2D] dark:text-white tracking-tight truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {m.courtName}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      {organizerDisplay}
                    </p>
                    {isMultiVenue && (m.venueShortName || m.venueName) && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-[#0B1A2D]/5 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] font-bold text-[9px] border border-slate-200/80 dark:border-[#B7F229]/30 shrink-0">
                        <Building2 className="w-2.5 h-2.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                        <span className="truncate max-w-[80px]">{m.venueShortName || m.venueName}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Nivel ELO & Desglose de Precios (Socio / No socio) */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-950/70 rounded-xl text-xs border border-slate-100 dark:border-slate-800/80">
                  <div className="font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Nivel:</span>
                    <span className="text-[#0B1A2D] dark:text-white font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-800 shadow-2xs font-mono">
                      {m.minLevel.toFixed(2)} – {m.maxLevel.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-end leading-tight">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Socio:</span>
                      <span className="text-sm font-extrabold text-[#0B1A2D] dark:text-white font-mono">
                        {socioPrice.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-[9px] font-medium text-slate-400">No socio:</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300 font-mono">
                        {noSocioPrice.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Avatares de Jugadores y Plazas Libres */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-2">
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
                        className="relative group/avatar cursor-pointer hover:scale-105 transition-transform"
                        title={`${p.name} · Ver perfil del jugador · Nivel ${p.level.toFixed(2)} (${p.position}) · ${p.paid ? 'Pagado' : 'Pendiente de pago'}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${
                            idx === 0 ? 'bg-[#0B1A2D]' : 'bg-slate-700 dark:bg-slate-800'
                          } text-white font-bold text-xs flex items-center justify-center shadow-xs border border-white/20`}
                        >
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-slate-700 text-[8px] font-bold text-white w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                          {p.position === 'drive' ? 'D' : p.position === 'reves' ? 'R' : 'A'}
                        </span>
                      </div>
                    ))}

                    {/* Plazas libres con placeholder circular interactivo */}
                    {Array.from({ length: openSlots }).map((_, emptyIdx) => (
                      <button
                        key={`empty-${emptyIdx}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMatchForAdd(m);
                        }}
                        className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-800/40"
                        title="Inscribir jugador en esta plaza"
                      >
                        <Plus className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-[#0B1A2D] dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 inline-flex items-center gap-1 transition-colors group/detail">
                    <span>ver detalle</span>
                    <span aria-hidden="true" className="group-hover/detail:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                </div>

                {/* 5. Footer de Acciones Rápidas */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
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
                      aria-label="Copiar enlace de partida"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyMatchLink(m.id);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer"
                      title="Copiar enlace"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      aria-label="Compartir o notificar"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenShareNotifyHub(m);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer"
                      title="Compartir o notificar"
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
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0B1A2D] hover:bg-[#132A45] text-white rounded-xl text-xs font-extrabold shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        <span>Inscribir</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
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
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Badge 1: Tipo de Partida (Abierta / Pública / Privada) */}
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {selectedMatchForDetail.visibility === 'private'
                      ? 'Partida Privada'
                      : selectedMatchForDetail.visibility === 'group'
                      ? `Grupo: ${selectedMatchForDetail.restrictedGroupName || 'Equipo'}`
                      : selectedMatchForDetail.status === 'open'
                      ? 'Partida Abierta'
                      : 'Partida Pública'}
                  </span>

                  {/* Badge 2: Género (Masculina / Femenina / Mixta) */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      selectedMatchForDetail.gender === 'female'
                        ? 'bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800'
                        : selectedMatchForDetail.gender === 'mixed'
                        ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                        : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    {selectedMatchForDetail.gender === 'female'
                      ? 'Femenina'
                      : selectedMatchForDetail.gender === 'mixed'
                      ? 'Mixta'
                      : 'Masculina'}
                  </span>

                  {/* Badge 3: Modo Competitivo o Amistoso */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      selectedMatchForDetail.mode === 'friendly'
                        ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border-[#B7F229]/40'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {selectedMatchForDetail.mode === 'friendly'
                      ? t('matches.modeFriendly', 'Modo Amistoso')
                      : t('matches.modeCompetitive', 'Modo Competitivo (ELO)')}
                  </span>

                  {/* Badge 4: Sede (en entornos multi-sede) */}
                  {isMultiVenue && (selectedMatchForDetail.venueShortName || selectedMatchForDetail.venueName) && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0B1A2D]/5 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] border border-slate-200/80 dark:border-[#B7F229]/30 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#0B1A2D] dark:text-[#B7F229]" />
                      <span>{selectedMatchForDetail.venueShortName || selectedMatchForDetail.venueName}</span>
                    </span>
                  )}

                  {selectedMatchForDetail.isClubCreated && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>Oficial Club</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {selectedMatchForDetail.courtName} · Partida Play!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>
                    {selectedMatchForDetail.startTime.split('T')[0]} ·{' '}
                    {formatMatchTimeWithDuration(selectedMatchForDetail.startTime, selectedMatchForDetail.durationMinutes)}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeMatchDetail}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Acciones de Administración si la partida está Abierta (Sin título redundante, contenedor sin desborde) */}
            {(selectedMatchForDetail.status === 'open' || selectedMatchForDetail.players.length < 4) && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Convocatoria abierta · {Math.max(0, 4 - selectedMatchForDetail.players.length)} plazas disponibles
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditMatch(selectedMatchForDetail)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Editar Partida</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchToDelete(selectedMatchForDetail)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-2xs shrink-0"
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
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {selectedMatchForDetail.memberPricePerPlayer &&
                  selectedMatchForDetail.memberPricePerPlayer > 0 &&
                  selectedMatchForDetail.memberPricePerPlayer !== selectedMatchForDetail.pricePerPlayer
                    ? 'Tarifas Socio / No Socio'
                    : 'Tarifa por Plaza'}
                </span>
                {selectedMatchForDetail.memberPricePerPlayer &&
                selectedMatchForDetail.memberPricePerPlayer > 0 &&
                selectedMatchForDetail.memberPricePerPlayer !== selectedMatchForDetail.pricePerPlayer ? (
                  <div className="text-[11px] font-mono font-black mt-0.5 leading-tight">
                    <span className="text-emerald-600 dark:text-emerald-400 block">
                      Socio: {selectedMatchForDetail.memberPricePerPlayer.toFixed(2)} €
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 block">
                      No socio: {selectedMatchForDetail.pricePerPlayer.toFixed(2)} €
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                    {selectedMatchForDetail.pricePerPlayer.toFixed(2)} €{' '}
                    <span className="text-[10px] font-normal text-slate-500">/jug.</span>
                  </span>
                )}
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMatchForDetail(null);
                              navigateToPlayerProfile(req.playerName, 'matches');
                            }}
                            className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 cursor-pointer hover:text-emerald-500 transition group text-left"
                            title={`Ver perfil de ${req.playerName}`}
                          >
                            <span className="group-hover:underline">{req.playerName}</span>
                            <span className="text-[10px] text-emerald-500 font-normal">↗</span>
                          </button>
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

            {/* Footer con Copiar enlace, Compartir/Notificar y Notificar a grupo */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleCopyMatchLink(selectedMatchForDetail.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="Copiar enlace"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar enlace</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const m = selectedMatchForDetail;
                    handleOpenShareNotifyHub(m);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir / Notificar</span>
                </button>

                {selectedMatchForDetail.players.length < 4 && (
                  <button
                    type="button"
                    onClick={() => {
                      const m = selectedMatchForDetail;
                      handleOpenNotifyGroup(m);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Megaphone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Notificar a grupo</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={closeMatchDetail}
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

                {/* Si es Creado por el Club (Admin): Admin NO ocupa plaza, permite 0/4 o asignar titular */}
                {isClubCreator ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Modalidad de Apertura por el Administrador</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Admin no ocupa plaza
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Como administrador, tu perfil no consume ninguna de las 4 plazas de juego. Selecciona cómo se iniciará la partida:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAdminCreationMode('empty')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          adminCreationMode === 'empty'
                            ? 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                            : 'bg-emerald-100/30 dark:bg-emerald-950/20 border-emerald-500/20 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Partida 100% Abierta (0/4)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-1 leading-relaxed">
                          Sin ningún jugador inicial. 4 plazas libres abiertas a inscripción de la comunidad.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdminCreationMode('assign_titular')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          adminCreationMode === 'assign_titular'
                            ? 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                            : 'bg-emerald-100/30 dark:bg-emerald-950/20 border-emerald-500/20 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Asignar Jugador Titular (1/4)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-1 leading-relaxed">
                          Asigna a un socio o cliente como capitán/titular de la plaza 1 (pago total o dividido).
                        </div>
                      </button>
                    </div>

                    {adminCreationMode === 'assign_titular' && (
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/20 space-y-2.5">
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Seleccionar Socio / Jugador Titular (Plaza 1):
                        </label>
                        <select
                          value={titularCustomerId}
                          onChange={(e) => setTitularCustomerId(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                        >
                          {customers.map((c) => (
                            <option key={`titular-${c.id}`} value={c.id}>
                              {c.name} (Nivel {c.level?.toFixed(2) || '3.50'}) {c.isMember ? '· Socio Oficial' : '· Cliente'}
                            </option>
                          ))}
                        </select>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Modalidad de Pago del Titular Asignado:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setTitularPaymentChoice('split')}
                              className={`p-2 rounded-lg border text-xs text-left transition cursor-pointer ${
                                titularPaymentChoice === 'split'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <div className="font-bold">Pago Dividido (1/4)</div>
                              <div className="text-[10px] text-slate-400 font-normal">El titular solo abona su plaza individual</div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTitularPaymentChoice('full')}
                              className={`p-2 rounded-lg border text-xs text-left transition cursor-pointer ${
                                titularPaymentChoice === 'full'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <div className="font-bold">Pago Total (100%)</div>
                              <div className="text-[10px] text-slate-400 font-normal">El titular abona la pista completa (4/4)</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Socio u Organizador Registrado:
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {customers.length} socios/clientes disponibles
                      </span>
                    </div>

                    {/* Selector / Combobox con Autocompletado */}
                    <div className="relative">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={creatorSearchQuery}
                          onFocus={() => setIsCreatorDropdownOpen(true)}
                          onChange={(e) => {
                            setCreatorSearchQuery(e.target.value);
                            setIsCreatorDropdownOpen(true);
                          }}
                          placeholder={
                            customers.find((c) => c.id === selectedCreatorCustomerId)
                              ? `${customers.find((c) => c.id === selectedCreatorCustomerId)?.name} (Escribe para buscar otro...)`
                              : 'Buscar socio por nombre, socio # o teléfono...'
                          }
                          className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
                        />
                        {creatorSearchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setCreatorSearchQuery('');
                              setIsCreatorDropdownOpen(true);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Dropdown flotante con autocompletado y scroll */}
                      {isCreatorDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-56 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1 space-y-0.5">
                          {(() => {
                            const filtered = customers.filter(
                              (c) =>
                                !creatorSearchQuery.trim() ||
                                c.name.toLowerCase().includes(creatorSearchQuery.toLowerCase()) ||
                                (c.memberNum && c.memberNum.toLowerCase().includes(creatorSearchQuery.toLowerCase())) ||
                                (c.phone && c.phone.includes(creatorSearchQuery)) ||
                                (c.email && c.email.toLowerCase().includes(creatorSearchQuery.toLowerCase()))
                            );

                            if (filtered.length === 0) {
                              return (
                                <div className="p-3 text-center text-xs text-slate-400">
                                  No se encontraron usuarios con "{creatorSearchQuery}"
                                </div>
                              );
                            }

                            return filtered.map((c) => {
                              const isSelected = c.id === selectedCreatorCustomerId;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCreatorCustomerId(c.id);
                                    setCreatorName(c.name);
                                    setCreatorLevel(c.level || 4.0);
                                    setCreatorPosition(c.position?.toLowerCase() === 'reves' ? 'reves' : 'drive');
                                    setCreatorSearchQuery('');
                                    setIsCreatorDropdownOpen(false);
                                  }}
                                  className={`w-full p-2 rounded-xl flex items-center justify-between gap-2.5 text-left transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold'
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <img
                                      src={c.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                                      alt={c.name}
                                      className="w-7 h-7 rounded-full object-cover shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {c.name}
                                      </div>
                                      <div className="text-[10px] text-slate-400">
                                        Nivel {c.level?.toFixed(2) || '3.50'} · Socio {c.memberNum || `#${c.id}`}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {c.isMember && (
                                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                        Socio
                                      </span>
                                    )}
                                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                                  </div>
                                </button>
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Previsualización del Organizador Seleccionado */}
                    {(() => {
                      const selectedCust = customers.find((c) => c.id === selectedCreatorCustomerId);
                      if (!selectedCust) return null;
                      return (
                        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-xs">
                          <img
                            src={selectedCust.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                            alt={selectedCust.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-bold truncate block">{selectedCust.name}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              Nivel {selectedCust.level?.toFixed(2)} · {selectedCust.position || 'Revés/Drive'} · Socio {selectedCust.memberNum || `#${selectedCust.id}`}
                            </span>
                          </div>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                            {selectedCust.isMember ? 'Socio Oficial' : 'Cliente'}
                          </span>
                        </div>
                      );
                    })()}
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

                {/* Si es restringida a grupo / equipo: Segmentación visual obligatoria */}
                {visibility === 'group' && (
                  <div className="mt-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Seleccionar Audiencia de Convocatoria / Notificación *
                      </label>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        Acceso Restringido
                      </span>
                    </div>

                    {/* Selector de Pestañas Visuales: Grupos vs Equipos */}
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setAudienceCategory('groups');
                          setRestrictedGroupName('Comunidad Nivel 3.5 - 4.25');
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          audienceCategory === 'groups'
                            ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Users className="w-4 h-4 text-emerald-500" />
                        <span>👥 Grupos de Jugadores ({playerGroups.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAudienceCategory('teams');
                          setRestrictedGroupName('Equipo A Masculino (Federado 1ª)');
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          audienceCategory === 'teams'
                            ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>🏆 Equipos de Competición (4)</span>
                      </button>
                    </div>

                    {/* Contenido según categoría seleccionada */}
                    {audienceCategory === 'groups' ? (
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                          Grupos Sociales, de Nivel y Partidas del Club:
                        </label>
                        <select
                          value={restrictedGroupName}
                          onChange={(e) => setRestrictedGroupName(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                        >
                          {playerGroups.map((g) => (
                            <option key={g.id} value={g.name}>
                              👥 {g.name} ({g.memberCount} socios · {g.category.toUpperCase()})
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Se convocará automáticamente a los miembros del grupo social o nivel para completar la partida.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-amber-800 dark:text-amber-300">
                          Equipos Federados, Interclubs y Ligas Oficiales:
                        </label>
                        <select
                          value={restrictedGroupName}
                          onChange={(e) => setRestrictedGroupName(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="Equipo A Masculino (Federado 1ª)">🏆 Equipo A Masculino (Federado 1ª Gallega · 12 jug.)</option>
                          <option value="Equipo B Femenino (Federado 2ª)">🏆 Equipo B Femenino (Federado 2ª Gallega · 10 jug.)</option>
                          <option value="Veteranos +45 (Liga Autonómica)">🏆 Veteranos +45 (Liga Autonómica Social · 14 jug.)</option>
                          <option value="Equipo Menores / Júnior">🏆 Equipo Menores / Promesas (Júnior · 8 jug.)</option>
                        </select>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Convocatoria restringida exclusivamente a la plantilla oficial y federada del equipo.
                        </p>
                      </div>
                    )}
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

              {/* Selector de Sede (Obligatorio en entornos multi-sede si es creado por el club) */}
              {Boolean(isMultiVenue) && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Sede del Club {isClubCreator && <strong className="text-rose-500">*</strong>}</span>
                    </span>
                    {isClubCreator && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        Obligatorio
                      </span>
                    )}
                  </label>
                  <select
                    required={isClubCreator}
                    value={modalVenueId}
                    onChange={(e) => {
                      const vId = e.target.value;
                      setModalVenueId(vId);
                      const venueCourts = courts.filter(
                        (c) => c.venueId === vId || (!c.venueId && vId === 'venue-san-mateo')
                      );
                      if (venueCourts.length > 0) {
                        setSelectedCourtId(venueCourts[0].id);
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {venues
                      .filter((v) => v.id !== 'all')
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.shortName})
                        </option>
                      ))}
                  </select>
                </div>
              )}

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
                  {availableModalCourts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.surface})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha, Hora y Selector de Duración */}
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

              {/* Selector de Duración de Partida: 90 min (default), 60 min y 120 min */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Duración de la Partida</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {matchDuration === 90 ? '90 min · Predeterminada' : `${matchDuration} minutos`}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMatchDuration(60)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      matchDuration === 60
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">60 min</div>
                    <div className="text-[10px] text-slate-400 font-normal">1 hora</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMatchDuration(90)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      matchDuration === 90
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">90 min</div>
                    <div className="text-[10px] text-slate-400 font-normal">1h 30m (Estándar)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMatchDuration(120)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      matchDuration === 120
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">120 min</div>
                    <div className="text-[10px] text-slate-400 font-normal">2 horas</div>
                  </button>
                </div>
              </div>

              {/* Niveles ELO (Escala Estándar 1.0 - 7.0) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Nivel Mínimo (Escala ELO)
                  </label>
                  <select
                    value={minLevel}
                    onChange={(e) => setMinLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ELO_SCALE.map((lvl) => (
                      <option key={`min-${lvl}`} value={lvl}>
                        Nivel {lvl.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Nivel Máximo (Escala ELO)
                  </label>
                  <select
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ELO_SCALE.map((lvl) => (
                      <option key={`max-${lvl}`} value={lvl}>
                        Nivel {lvl.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sistema de Precios Avanzado: Precio General y Precio Especial Socios */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Tarifas por Plaza Individual</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Ahorro Socio: {(pricePerPlayer - memberPricePerPlayer).toFixed(2)} €
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
                      Precio General (No Socios)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="1.0"
                        value={pricePerPlayer}
                        onChange={(e) => setPricePerPlayer(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                        required
                      />
                      <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">€/jug.</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-700 dark:text-emerald-400 mb-1 text-[11px] flex items-center gap-1">
                      <span>Precio Especial Socios</span>
                      <Shield className="w-3 h-3 text-emerald-500" />
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="0.0"
                        value={memberPricePerPlayer}
                        onChange={(e) => setMemberPricePerPlayer(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <span className="absolute right-3 top-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">€/jug.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gestión de Plazas, Posiciones y Parejas */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Asignación de Parejas y Posiciones (Lado de Juego)</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    positionAssignmentMode === 'fixed'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                  }`}>
                    {positionAssignmentMode === 'fixed' ? '🔒 Posiciones Fijas' : '🔄 Modo Recomendado'}
                  </span>
                </div>

                {/* Selector Modo Recomendado vs Posiciones Fijas */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPositionAssignmentMode('recommended')}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      positionAssignmentMode === 'recommended'
                        ? 'bg-white dark:bg-slate-900 border-blue-500 text-blue-900 dark:text-blue-200 font-bold shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Modo Recomendado</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                      Los jugadores eligen libremente lado (Drive o Revés) y pareja al apuntarse.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPositionAssignmentMode('fixed')}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      positionAssignmentMode === 'fixed'
                        ? 'bg-white dark:bg-slate-900 border-purple-500 text-purple-900 dark:text-purple-200 font-bold shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-purple-500" />
                      <span>Posiciones Fijas</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                      Asignación estricta de lado y parejas (bloqueadas sin que los jugadores puedan cambiarlas).
                    </div>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {positionAssignmentMode === 'fixed'
                    ? 'Configuración de posiciones fijas e inmutables (aplicable también a entrenamientos de competición y partidos oficiales de equipo):'
                    : 'Puedes sugerir o pre-asignar jugadores a las plazas antes de publicar:'}
                </p>

                {/* Layout de Pista: Pareja 1 vs Pareja 2 */}
                <div className="space-y-3">
                  {/* PAREJA 1 */}
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                      <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>PAREJA 1 (Lado A)</span>
                      </span>
                      {positionAssignmentMode === 'fixed' && (
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          🔒 Posiciones Fijas
                        </span>
                      )}
                    </div>

                    {/* Plaza 1 */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black text-[10px] flex items-center justify-center shrink-0">
                          1
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white truncate block">
                            {isClubCreator
                              ? adminCreationMode === 'empty'
                                ? 'Plaza Libre (Abierta a inscripción)'
                                : `Titular: ${customers.find((c) => c.id === titularCustomerId)?.name || 'Jugador'}`
                              : creatorName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {isClubCreator && adminCreationMode === 'empty' ? 'Disponible para primer socio' : 'Capitán Titular'}
                          </span>
                        </div>
                      </div>

                      {/* Selector de lado (Drive vs Revés) */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSlot1Pos('drive')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            slot1Pos === 'drive'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Drive
                        </button>
                        <button
                          type="button"
                          onClick={() => setSlot1Pos('reves')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            slot1Pos === 'reves'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Revés
                        </button>
                      </div>
                    </div>

                    {/* Plaza 2 */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] flex items-center justify-center shrink-0">
                            2
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Compañero Pareja 1:
                          </span>
                        </div>

                        {/* Selector de lado */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSlot2Pos('drive')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              slot2Pos === 'drive'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Drive
                          </button>
                          <button
                            type="button"
                            onClick={() => setSlot2Pos('reves')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              slot2Pos === 'reves'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Revés
                          </button>
                        </div>
                      </div>

                      <select
                        value={slot2PlayerId}
                        onChange={(e) => setSlot2PlayerId(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                      >
                        <option value="none">-- Plaza libre (Abierta a inscripción) --</option>
                        {customers
                          .filter((c) => c.name !== creatorName && c.id !== slot3PlayerId && c.id !== slot4PlayerId && (!isClubCreator || adminCreationMode !== 'assign_titular' || c.id !== titularCustomerId))
                          .map((c) => (
                            <option key={`slot2-${c.id}`} value={c.id}>
                              {c.name} (Nivel {c.level?.toFixed(2)}) {c.isMember ? '· Socio' : ''}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* PAREJA 2 */}
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                      <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span>PAREJA 2 (Lado B)</span>
                      </span>
                      {positionAssignmentMode === 'fixed' && (
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          🔒 Posiciones Fijas
                        </span>
                      )}
                    </div>

                    {/* Plaza 3 */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] flex items-center justify-center shrink-0">
                            3
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Jugador Pareja 2:
                          </span>
                        </div>

                        {/* Selector de lado */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSlot3Pos('drive')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              slot3Pos === 'drive'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Drive
                          </button>
                          <button
                            type="button"
                            onClick={() => setSlot3Pos('reves')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              slot3Pos === 'reves'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Revés
                          </button>
                        </div>
                      </div>

                      <select
                        value={slot3PlayerId}
                        onChange={(e) => setSlot3PlayerId(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                      >
                        <option value="none">-- Plaza libre (Abierta a inscripción) --</option>
                        {customers
                          .filter((c) => c.name !== creatorName && c.id !== slot2PlayerId && c.id !== slot4PlayerId && (!isClubCreator || adminCreationMode !== 'assign_titular' || c.id !== titularCustomerId))
                          .map((c) => (
                            <option key={`slot3-${c.id}`} value={c.id}>
                              {c.name} (Nivel {c.level?.toFixed(2)}) {c.isMember ? '· Socio' : ''}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Plaza 4 */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] flex items-center justify-center shrink-0">
                            4
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Compañero Pareja 2:
                          </span>
                        </div>

                        {/* Selector de lado */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSlot4Pos('drive')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              slot4Pos === 'drive'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Drive
                          </button>
                          <button
                            type="button"
                            onClick={() => setSlot4Pos('reves')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                              slot4Pos === 'reves'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            Revés
                          </button>
                        </div>
                      </div>

                      <select
                        value={slot4PlayerId}
                        onChange={(e) => setSlot4PlayerId(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                      >
                        <option value="none">-- Plaza libre (Abierta a inscripción) --</option>
                        {customers
                          .filter((c) => c.name !== creatorName && c.id !== slot2PlayerId && c.id !== slot3PlayerId && (!isClubCreator || adminCreationMode !== 'assign_titular' || c.id !== titularCustomerId))
                          .map((c) => (
                            <option key={`slot4-${c.id}`} value={c.id}>
                              {c.name} (Nivel {c.level?.toFixed(2)}) {c.isMember ? '· Socio' : ''}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {t('matches.cancelBtn', 'Cancelar')}
                </button>
                <button
                  type="button"
                  onClick={handleCreateAndNotifyGroup}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Publicar y Notificar Grupo</span>
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

      {/* ======================================================================
          MODAL 7: CONVOCATORIA INSTANTÁNEA A GRUPO DE JUGADORES (SUSTITUTO WHATSAPP)
          ====================================================================== */}
      {notifyGroupMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Notificar a Grupo de Jugadores
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sustituto oficial de grupos de WhatsApp con reserva y cobro directo a 1/4.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifyGroupMatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha Resumen de la Partida */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{notifyGroupMatch.courtName} · {notifyGroupMatch.startTime.replace('T', ' ')}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                  {4 - notifyGroupMatch.players.length} plazas libres
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-emerald-500/20">
                <span>Rango requerido: <strong>{notifyGroupMatch.minLevel.toFixed(2)} - {notifyGroupMatch.maxLevel.toFixed(2)}</strong></span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {notifyGroupMatch.pricePerPlayer.toFixed(2)} €/jugador
                </span>
              </div>
            </div>

            <form onSubmit={handleSendMatchConvocatoria} className="space-y-4 text-xs">
              {/* Selección de Audiencia: Separación Visual entre Grupos y Equipos */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Audiencia Destinataria de la Convocatoria *
                  </label>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Sustituto Oficial WhatsApp
                  </span>
                </div>

                {/* Tabs de Selección Visual */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setConvocatoriaAudienceCategory('groups');
                      setSelectedGroupIdForNotification(playerGroups[0]?.id || 'g-1');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      convocatoriaAudienceCategory === 'groups'
                        ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>👥 Grupos de Jugadores ({playerGroups.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConvocatoriaAudienceCategory('teams');
                      setSelectedGroupIdForNotification('team-masc-1');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      convocatoriaAudienceCategory === 'teams'
                        ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>🏆 Equipos de Competición (4)</span>
                  </button>
                </div>

                {convocatoriaAudienceCategory === 'groups' ? (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      Grupos Sociales y de Nivel del Club:
                    </label>
                    <select
                      value={selectedGroupIdForNotification}
                      onChange={(e) => setSelectedGroupIdForNotification(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                    >
                      {playerGroups.map((g) => (
                        <option key={g.id} value={g.id}>
                          👥 {g.name} ({g.memberCount} socios · {g.category.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-amber-800 dark:text-amber-300">
                      Equipos Federados e Interclubs:
                    </label>
                    <select
                      value={selectedGroupIdForNotification}
                      onChange={(e) => setSelectedGroupIdForNotification(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                    >
                      <option value="team-masc-1">🏆 Equipo A Masculino (1ª Categoría Federada · 12 jug.)</option>
                      <option value="team-fem-2">🏆 Equipo B Femenino (2ª Categoría Federada · 10 jug.)</option>
                      <option value="team-vet-45">🏆 Equipo Veteranos +45 (Liga Autonómica Social · 14 jug.)</option>
                      <option value="team-promesas">🏆 Equipo Menores / Júnior Promesas (8 jug.)</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    Convocatoria oficial con enlace directo para que los jugadores acepten plaza y paguen su 1/4 parte.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asunto de la Notificación *
                </label>
                <input
                  type="text"
                  required
                  value={convocatoriaCustomSubject}
                  onChange={(e) => setConvocatoriaCustomSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mensaje para los Jugadores *
                </label>
                <textarea
                  rows={3}
                  required
                  value={convocatoriaCustomMessage}
                  onChange={(e) => setConvocatoriaCustomMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enlace Directo de Reserva / Pago de Plaza
                </label>
                <input
                  type="text"
                  readOnly
                  value={`https://setmio.com/partida/${notifyGroupMatch.id}`}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-emerald-600 dark:text-emerald-400 select-all"
                />
              </div>

              {/* Canales Simultáneos */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Canales de Envío Simultáneos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={convocatoriaChannels.includes('push')}
                      onChange={(e) => {
                        if (e.target.checked) setConvocatoriaChannels([...convocatoriaChannels, 'push']);
                        else setConvocatoriaChannels(convocatoriaChannels.filter((c) => c !== 'push'));
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] font-bold">App Push</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={convocatoriaChannels.includes('email')}
                      onChange={(e) => {
                        if (e.target.checked) setConvocatoriaChannels([...convocatoriaChannels, 'email']);
                        else setConvocatoriaChannels(convocatoriaChannels.filter((c) => c !== 'email'));
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] font-bold">Email Club</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={convocatoriaChannels.includes('whatsapp')}
                      onChange={(e) => {
                        if (e.target.checked) setConvocatoriaChannels([...convocatoriaChannels, 'whatsapp']);
                        else setConvocatoriaChannels(convocatoriaChannels.filter((c) => c !== 'whatsapp'));
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] font-bold">WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp opcional */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-bold">
                    ¿Quieres compartirlo también en WhatsApp Web?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleMatchWhatsAppShare}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shrink-0 cursor-pointer"
                >
                  Abrir WhatsApp
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setNotifyGroupMatch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Lanzar Convocatoria a Grupo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 8: HUB UNIFICADO PARA COMPARTIR Y NOTIFICAR
          ====================================================================== */}
      {shareNotifyMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Compartir / Notificar Partida
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Hub centralizado para difusión multicanal y convocatoria segmentada de jugadores
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShareNotifyMatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resumen de la Partida */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{shareNotifyMatch.courtName} · {shareNotifyMatch.startTime.replace('T', ' ')}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                  {4 - shareNotifyMatch.players.length} plazas libres
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <span>Rango requerido: <strong className="text-slate-800 dark:text-slate-200">{shareNotifyMatch.minLevel.toFixed(2)} - {shareNotifyMatch.maxLevel.toFixed(2)}</strong></span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {shareNotifyMatch.pricePerPlayer.toFixed(2)} €/jugador
                </span>
              </div>
            </div>

            {/* Enlace Directo Copiable */}
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate select-all">
                https://setmio.com/partida/{shareNotifyMatch.id}
              </span>
              <button
                type="button"
                onClick={() => handleCopyMatchLink(shareNotifyMatch.id)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
              >
                <Copy className="w-3 h-3 text-emerald-500" />
                <span>Copiar enlace</span>
              </button>
            </div>

            <form onSubmit={handleSendShareNotifyHub} className="space-y-4 text-xs">
              {/* 1. Selector dinámico de canal */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  1. Seleccionar Canal de Difusión:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setShareChannel('whatsapp')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      shareChannel === 'whatsapp'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareChannel('email')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      shareChannel === 'email'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <span>Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareChannel('push')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      shareChannel === 'push'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-amber-500" />
                    <span>Push In-App</span>
                  </button>
                </div>
              </div>

              {/* 2. Segmentación de Destinatarios */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Segmentar Destinatarios por:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-2.5">
                  <button
                    type="button"
                    onClick={() => setSegmentType('level')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      segmentType === 'level'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Nivel ELO
                  </button>
                  <button
                    type="button"
                    onClick={() => setSegmentType('group')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      segmentType === 'group'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    👥 Grupos
                  </button>
                  <button
                    type="button"
                    onClick={() => setSegmentType('teams')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      segmentType === 'teams'
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    🏆 Equipos
                  </button>
                  <button
                    type="button"
                    onClick={() => setSegmentType('individual')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      segmentType === 'individual'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Individual
                  </button>
                </div>

                {/* Sub-selector según Segmentación */}
                {segmentType === 'level' && (
                  <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-500/20 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Rango ELO seleccionado:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">
                        {shareNotifyMatch.minLevel.toFixed(2)} - {shareNotifyMatch.maxLevel.toFixed(2)}
                      </span>
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Se enviará automáticamente a los <strong>18 socios cualificados</strong> del club cuyo nivel Play! o ELO coincide con esta partida.
                    </p>
                  </div>
                )}

                {segmentType === 'group' && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      Grupo Social / Comunidad del Club:
                    </label>
                    <select
                      value={selectedGroupId}
                      onChange={(e) => setSelectedGroupId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      {playerGroups.map((g) => (
                        <option key={g.id} value={g.id}>
                          👥 {g.name} ({g.memberCount} socios · {g.category.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {segmentType === 'teams' && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      Equipo Federado Oficial:
                    </label>
                    <select
                      value={selectedTeamName}
                      onChange={(e) => setSelectedTeamName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Equipo A Masculino (Federado 1ª)">🏆 Equipo A Masculino (Federado 1ª Gallega · 12 jug.)</option>
                      <option value="Equipo B Femenino (Federado 2ª)">🏆 Equipo B Femenino (Federado 2ª Gallega · 10 jug.)</option>
                      <option value="Veteranos +45 (Liga Autonómica)">🏆 Veteranos +45 (Liga Autonómica Social · 14 jug.)</option>
                      <option value="Equipo Menores / Júnior">🏆 Equipo Menores / Promesas (Júnior · 8 jug.)</option>
                    </select>
                  </div>
                )}

                {segmentType === 'individual' && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Socio / Jugador Individual:
                    </label>
                    <select
                      value={selectedIndividualPlayer}
                      onChange={(e) => setSelectedIndividualPlayer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      {CLUB_PLAYERS_LIST.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} (Nivel {p.level.toFixed(2)} · {p.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 3. Mensaje Personalizable */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asunto del aviso:
                </label>
                <input
                  type="text"
                  required
                  value={hubSubject}
                  onChange={(e) => setHubSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Texto del Mensaje:
                </label>
                <textarea
                  rows={3}
                  required
                  value={hubMessage}
                  onChange={(e) => setHubMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Acciones */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShareNotifyMatch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar por {shareChannel === 'whatsapp' ? 'WhatsApp' : shareChannel === 'email' ? 'Email' : 'Push'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatches;
