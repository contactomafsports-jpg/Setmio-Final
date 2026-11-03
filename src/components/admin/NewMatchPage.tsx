import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenMatch } from '../../types/database';
import {
  ArrowLeft,
  Users,
  Shield,
  Clock,
  DollarSign,
  Globe,
  Lock,
  Trophy,
  Target,
  Search,
  Check,
  Building2,
  Megaphone,
  Plus,
  X,
  UserCheck,
} from 'lucide-react';

interface NewMatchPageProps {
  onBack?: () => void;
}

export const NewMatchPage: React.FC<NewMatchPageProps> = ({ onBack }) => {
  const {
    courts,
    currentTenant,
    isMultiVenue,
    venues,
    customers,
    playerGroups,
    createOpenMatch,
    sendNotification,
    triggerDemoToast,
    setAdminTab,
  } = useApp();

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setAdminTab('matches');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/gestion/partidas');
      }
    }
  };

  // ELO Scale standard (1.00 - 7.00)
  const ELO_SCALE = useMemo(
    () => [
      1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75,
      4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0,
    ],
    []
  );

  // Today + formatted dates
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Form State
  const [isClubCreator, setIsClubCreator] = useState(true);
  const [creatorName, setCreatorName] = useState('Club ' + (currentTenant?.name || 'Pádel San Mateo'));
  const [creatorLevel, setCreatorLevel] = useState(4.0);
  const [creatorPosition, setCreatorPosition] = useState<'drive' | 'reves' | 'both'>('drive');
  const [selectedCreatorCustomerId, setSelectedCreatorCustomerId] = useState<string>('c-1');
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');
  const [isCreatorDropdownOpen, setIsCreatorDropdownOpen] = useState(false);

  // Sede & Pistas
  const [modalVenueId, setModalVenueId] = useState<string>(
    venues.find((v) => v.id !== 'all')?.id || 'venue-san-mateo'
  );
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || 'court-1');

  // Fecha, Hora & Duración
  const [matchDate, setMatchDate] = useState(todayStr);
  const [matchTime, setMatchTime] = useState('19:30');
  const [matchDuration, setMatchDuration] = useState<60 | 90 | 120>(90);

  // Modalidad de apertura por el administrador
  const [adminCreationMode, setAdminCreationMode] = useState<'empty' | 'assign_titular'>('empty');
  const [titularCustomerId, setTitularCustomerId] = useState<string>('c-1');
  const [titularPaymentChoice, setTitularPaymentChoice] = useState<'split' | 'full'>('split');

  // Posiciones y Parejas
  const [positionAssignmentMode, setPositionAssignmentMode] = useState<'recommended' | 'fixed'>('recommended');
  const [slot1Pos, setSlot1Pos] = useState<'drive' | 'reves'>('drive');
  const [slot2Pos, setSlot2Pos] = useState<'drive' | 'reves'>('reves');
  const [slot3Pos, setSlot3Pos] = useState<'drive' | 'reves'>('drive');
  const [slot4Pos, setSlot4Pos] = useState<'drive' | 'reves'>('reves');

  const [slot2PlayerId, setSlot2PlayerId] = useState<string>('none');
  const [slot3PlayerId, setSlot3PlayerId] = useState<string>('none');
  const [slot4PlayerId, setSlot4PlayerId] = useState<string>('none');

  // Niveles ELO
  const [minLevel, setMinLevel] = useState(3.0);
  const [maxLevel, setMaxLevel] = useState(4.25);

  // Precios
  const [pricePerPlayer, setPricePerPlayer] = useState(7.5);
  const [memberPricePerPlayer, setMemberPricePerPlayer] = useState(6.0);

  // Visibilidad & Segmentación
  const [visibility, setVisibility] = useState<'public' | 'private' | 'group'>('public');
  const [restrictedGroupName, setRestrictedGroupName] = useState('Comunidad Nivel 3.5 - 4.25');
  const [audienceCategory, setAudienceCategory] = useState<'groups' | 'teams'>('groups');

  // Género & Cobro
  const [gender, setGender] = useState<'male' | 'female' | 'mixed'>('male');
  const [paymentMode, setPaymentMode] = useState<'split' | 'single'>('split');
  const [paymentPolicy, setPaymentPolicy] = useState<'online_only' | 'counter_only' | 'both'>('both');

  // Pistas filtradas por la sede seleccionada
  const availableCourts = useMemo(() => {
    if (isMultiVenue && isClubCreator && modalVenueId) {
      const filtered = courts.filter(
        (c) => c.venueId === modalVenueId || (!c.venueId && modalVenueId === 'venue-san-mateo')
      );
      return filtered.length > 0 ? filtered : courts;
    }
    return courts;
  }, [courts, isMultiVenue, isClubCreator, modalVenueId]);

  // Actualizar pista seleccionada si cambia la sede
  useEffect(() => {
    if (availableCourts.length > 0 && !availableCourts.some((c) => c.id === selectedCourtId)) {
      setSelectedCourtId(availableCourts[0].id);
    }
  }, [availableCourts, selectedCourtId]);

  // Construcción de la partida
  const buildMatchData = (): { match: OpenMatch; notifiedPlayerNames: string[]; courtName: string } => {
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
          message: `${finalCreatorName} te ha asignado una plaza en la partida del ${matchDate} a las ${matchTime} h (${matchDuration} min) en ${court.name}. Importe: ${slotPrice.toFixed(2)} €. Entra para confirmar y abonar tu plaza.`,
          type: 'match',
          actionUrl: '/gestion/partidas',
        });
      }
    });

    const chosenVenue = isMultiVenue && isClubCreator
      ? (venues.find((v) => v.id === modalVenueId) || venues[1] || venues[0])
      : (court.venueId ? venues.find((v) => v.id === court.venueId) : venues[1] || venues[0]);

    const newMatchData: OpenMatch = {
      id: `match-${Date.now()}`,
      tenantId: currentTenant.id,
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
      mode: 'competitive',
      visibility,
      restrictedGroupName: visibility === 'group' ? restrictedGroupName : undefined,
      gender,
      isClubCreated: isClubCreator,
      paymentMode: isClubCreator && adminCreationMode === 'assign_titular' && titularPaymentChoice === 'full' ? 'single' : paymentMode,
      paymentPolicy,
      positionMode: positionAssignmentMode,
      players: initialPlayers,
    };

    return { match: newMatchData, notifiedPlayerNames, courtName: court.name };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { match, notifiedPlayerNames, courtName } = buildMatchData();
    createOpenMatch(match);

    triggerDemoToast(
      'Partida Publicada con Éxito',
      notifiedPlayerNames.length > 0
        ? `Partida creada en ${courtName} (${matchDuration} min). Notificación automática remitida a ${notifiedPlayerNames.join(', ')} para confirmar su plaza.`
        : isClubCreator && adminCreationMode === 'empty'
          ? `Partida 100% abierta creada en ${courtName} (${matchDuration} min, 4 plazas disponibles).`
          : `Partida en ${courtName} (${matchDuration} min, ${gender === 'male' ? 'Masculina' : gender === 'female' ? 'Femenina' : 'Mixta'}).`,
      'success'
    );

    handleBack();
  };

  const handleCreateAndNotifyGroup = (e: React.MouseEvent) => {
    e.preventDefault();
    const { match, notifiedPlayerNames, courtName } = buildMatchData();
    createOpenMatch(match);

    triggerDemoToast(
      'Partida Publicada con Éxito',
      notifiedPlayerNames.length > 0
        ? `Partida creada en ${courtName} (${matchDuration} min). Notificación remitida a ${notifiedPlayerNames.join(', ')}.`
        : `Partida creada en ${courtName} (${matchDuration} min). Convocatoria lista para difusión.`,
      'success'
    );

    handleBack();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-7 pb-24 pt-1 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased">
      {/* ======================================================================
          1. CABECERA LIMPIA DE NIVEL 2 (SOLO BOTÓN "←" Y TÍTULO "Nueva Partida")
          ====================================================================== */}
      <section className="pt-2 pb-1" data-purpose="level2-header">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-1 -ml-1 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95"
            title="Volver a Partidas"
            aria-label="Volver a Partidas"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="text-[22px] font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
            Nueva Partida
          </h1>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 text-xs">
        {/* ======================================================================
            2. ORGANIZADOR & APERTURA DEL ADMINISTRADOR (LIMPIA, SIN DESCRIPCIONES REDUNDANTES)
            ====================================================================== */}
        <section className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-[#0B1A2D] dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8B5CF6]" />
              <span>Organizador / Creador</span>
            </span>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isClubCreator}
                onChange={(e) => setIsClubCreator(e.target.checked)}
                className="w-4 h-4 rounded text-[#0B1A2D] dark:text-[#B7F229] focus:ring-[#B7F229] cursor-pointer accent-[#0B1A2D] dark:accent-[#B7F229]"
              />
              <span className="text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                Creado por el Club
              </span>
            </label>
          </div>

          {/* Apertura de Administrador: 100% Abierta vs Asignar Jugador Titular */}
          {isClubCreator ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Opción 1: Partida 100% Abierta */}
                <button
                  type="button"
                  onClick={() => setAdminCreationMode('empty')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    adminCreationMode === 'empty'
                      ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Users className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                    <span>Partida 100% Abierta (0/4)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-1 leading-snug">
                    Sin jugador inicial. 4 plazas libres abiertas a inscripción de la comunidad.
                  </div>
                </button>

                {/* Opción 2: Asignar Jugador Titular */}
                <button
                  type="button"
                  onClick={() => setAdminCreationMode('assign_titular')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    adminCreationMode === 'assign_titular'
                      ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <UserCheck className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                    <span>Asignar Jugador Titular (1/4)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-1 leading-snug">
                    Asigna a un socio o cliente como capitán/titular de la plaza 1.
                  </div>
                </button>
              </div>

              {adminCreationMode === 'assign_titular' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Seleccionar Socio / Jugador Titular (Plaza 1):
                    </label>
                    <select
                      value={titularCustomerId}
                      onChange={(e) => setTitularCustomerId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    >
                      {customers.map((c) => (
                        <option key={`titular-${c.id}`} value={c.id}>
                          {c.name} (Nivel {c.level?.toFixed(2) || '3.50'}) {c.isMember ? '· Socio Oficial' : '· Cliente'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Modalidad de Pago del Titular Asignado:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTitularPaymentChoice('split')}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          titularPaymentChoice === 'split'
                            ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold'
                            : 'bg-white dark:bg-[#0E2239] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="font-bold text-xs">Pago Dividido (1/4)</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                          El titular solo abona su plaza individual
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTitularPaymentChoice('full')}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          titularPaymentChoice === 'full'
                            ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold'
                            : 'bg-white dark:bg-[#0E2239] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="font-bold text-xs">Pago Total (100%)</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                          El titular abona la pista completa (4/4)
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Modo Organizador Socio (Buscador con autocompletado limpio) */
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Socio u Organizador Registrado:
              </label>

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
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                />
                {creatorSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setCreatorSearchQuery('');
                      setIsCreatorDropdownOpen(true);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {isCreatorDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-56 overflow-y-auto rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] shadow-xl p-1 space-y-0.5">
                    {(() => {
                      const filtered = customers.filter(
                        (c) =>
                          !creatorSearchQuery.trim() ||
                          c.name.toLowerCase().includes(creatorSearchQuery.toLowerCase()) ||
                          (c.memberNum && c.memberNum.toLowerCase().includes(creatorSearchQuery.toLowerCase())) ||
                          (c.phone && c.phone.includes(creatorSearchQuery))
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="p-3 text-center text-xs text-slate-400">
                            No se encontraron socios con "{creatorSearchQuery}"
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
                                ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] font-bold'
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
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />}
                          </button>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ======================================================================
            3. VISIBILIDAD & SEGMENTACIÓN DE CONVOCATORIA
            ====================================================================== */}
        <section className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
          <span className="font-extrabold text-[#0B1A2D] dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Globe className="w-4 h-4 text-[#8B5CF6]" />
            <span>Visibilidad y Convocatoria</span>
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setVisibility('public')}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                visibility === 'public'
                  ? 'bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-white font-bold shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Globe className="w-4 h-4 mx-auto mb-1 stroke-[2.2]" />
              <span className="font-bold">Pública</span>
            </button>

            <button
              type="button"
              onClick={() => setVisibility('private')}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                visibility === 'private'
                  ? 'bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-white font-bold shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Lock className="w-4 h-4 mx-auto mb-1 stroke-[2.2]" />
              <span className="font-bold">Privada</span>
            </button>

            <button
              type="button"
              onClick={() => setVisibility('group')}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                visibility === 'group'
                  ? 'bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-white font-bold shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Users className="w-4 h-4 mx-auto mb-1 stroke-[2.2]" />
              <span className="font-bold">Equipo / Grupo</span>
            </button>
          </div>

          {visibility === 'group' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Audiencia de Convocatoria Restringida:
                </label>
                <span className="text-[10px] text-[#0B1A2D] dark:text-[#B7F229] font-bold bg-[#F0FCCF] dark:bg-[#B7F229]/20 px-2 py-0.5 rounded-full border border-[#B7F229]/40">
                  Acceso Restringido
                </span>
              </div>

              {/* Pestañas: Grupos vs Equipos */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setAudienceCategory('groups');
                    setRestrictedGroupName('Comunidad Nivel 3.5 - 4.25');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    audienceCategory === 'groups'
                      ? 'bg-white dark:bg-slate-800 text-[#0B1A2D] dark:text-[#B7F229] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Grupos de Jugadores ({playerGroups.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAudienceCategory('teams');
                    setRestrictedGroupName('Equipo A Masculino (Federado 1ª)');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    audienceCategory === 'teams'
                      ? 'bg-white dark:bg-slate-800 text-[#0B1A2D] dark:text-[#B7F229] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Equipos de Competición (4)</span>
                </button>
              </div>

              {audienceCategory === 'groups' ? (
                <div className="space-y-1">
                  <select
                    value={restrictedGroupName}
                    onChange={(e) => setRestrictedGroupName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {playerGroups.map((g) => (
                      <option key={g.id} value={g.name}>
                        {g.name} ({g.memberCount} socios · {g.category.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <select
                    value={restrictedGroupName}
                    onChange={(e) => setRestrictedGroupName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Equipo A Masculino (Federado 1ª)">Equipo A Masculino (Federado 1ª Gallega · 12 jug.)</option>
                    <option value="Equipo B Femenino (Federado 2ª)">Equipo B Femenino (Federado 2ª Gallega · 10 jug.)</option>
                    <option value="Veteranos +45 (Liga Autonómica)">Veteranos +45 (Liga Autonómica Social · 14 jug.)</option>
                    <option value="Equipo Menores / Júnior">Equipo Menores / Promesas (Júnior · 8 jug.)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ======================================================================
            4. MODALIDAD POR GÉNERO & COBRO
            ====================================================================== */}
        <section className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
          <span className="font-extrabold text-[#0B1A2D] dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <DollarSign className="w-4 h-4 text-[#8B5CF6]" />
            <span>Género & Modalidad de Cobro</span>
          </span>

          {/* Modalidad por Género */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">
              Modalidad por Género
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 rounded-xl border text-center transition cursor-pointer font-bold ${
                  gender === 'male'
                    ? 'bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                Masculina
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 rounded-xl border text-center transition cursor-pointer font-bold ${
                  gender === 'female'
                    ? 'bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                Femenina
              </button>
              <button
                type="button"
                onClick={() => setGender('mixed')}
                className={`py-2.5 rounded-xl border text-center transition cursor-pointer font-bold ${
                  gender === 'mixed'
                    ? 'bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                Mixta
              </button>
            </div>
          </div>

          {/* Modalidad de Cobro */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">
              Modalidad de Cobro
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => setPaymentMode('split')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  paymentMode === 'split'
                    ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Split Payment (1/4)</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  Cada jugador paga su plaza individual
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('single')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  paymentMode === 'single'
                    ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Pago Único</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  1 jugador abona toda la pista
                </div>
              </button>
            </div>

            {/* Política de Pago */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentPolicy('both')}
                className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer text-[11px] font-bold ${
                  paymentPolicy === 'both'
                    ? 'bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                Online o Mostrador
              </button>
              <button
                type="button"
                onClick={() => setPaymentPolicy('online_only')}
                className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer text-[11px] font-bold ${
                  paymentPolicy === 'online_only'
                    ? 'bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                Online Obligatorio
              </button>
              <button
                type="button"
                onClick={() => setPaymentPolicy('counter_only')}
                className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer text-[11px] font-bold ${
                  paymentPolicy === 'counter_only'
                    ? 'bg-[#0B1A2D] dark:bg-white text-white dark:text-[#0B1A2D] border-[#0B1A2D] dark:border-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                En Recepción
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================================
            5. SEDE, PISTA, FECHA Y DURACIÓN
            ====================================================================== */}
        <section className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
          <span className="font-extrabold text-[#0B1A2D] dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Clock className="w-4 h-4 text-[#8B5CF6]" />
            <span>Instalación, Fecha y Duración</span>
          </span>

          {Boolean(isMultiVenue) && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                Sede del Club
              </label>
              <select
                value={modalVenueId}
                onChange={(e) => setModalVenueId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
              Pista Asignada
            </label>
            <select
              value={selectedCourtId}
              onChange={(e) => setSelectedCourtId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
            >
              {availableCourts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.surface})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                Fecha
              </label>
              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                Hora Inicio
              </label>
              <input
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                required
              />
            </div>
          </div>

          {/* Selector de Duración */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Duración de la Partida
              </label>
              <span className="text-[10px] text-[#0B1A2D] dark:text-[#B7F229] font-bold bg-[#F0FCCF] dark:bg-[#B7F229]/20 px-2 py-0.5 rounded-full border border-[#B7F229]/40">
                {matchDuration === 90 ? '90 min · Predeterminada' : `${matchDuration} minutos`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMatchDuration(60)}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  matchDuration === 60
                    ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">60 min</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">1 hora</div>
              </button>

              <button
                type="button"
                onClick={() => setMatchDuration(90)}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  matchDuration === 90
                    ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">90 min</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">1h 30m (Estándar)</div>
              </button>

              <button
                type="button"
                onClick={() => setMatchDuration(120)}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  matchDuration === 120
                    ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">120 min</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">2 horas</div>
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================================
            6. NIVELES ELO Y TARIFAS POR PLAZA
            ====================================================================== */}
        <section className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
          <span className="font-extrabold text-[#0B1A2D] dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Target className="w-4 h-4 text-[#8B5CF6]" />
            <span>Nivel ELO & Tarifas por Plaza</span>
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                Nivel Mínimo (Escala ELO)
              </label>
              <select
                value={minLevel}
                onChange={(e) => setMinLevel(parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
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
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
              >
                {ELO_SCALE.map((lvl) => (
                  <option key={`max-${lvl}`} value={lvl}>
                    Nivel {lvl.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tarifas por Plaza Individual */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Tarifas por Jugador
              </span>
              <span className="text-[10px] text-[#0B1A2D] dark:text-[#B7F229] font-bold bg-[#F0FCCF] dark:bg-[#B7F229]/20 px-2 py-0.5 rounded-full border border-[#B7F229]/40">
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
                    className="w-full px-3 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">€/jug.</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                  Precio Especial Socios
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0.0"
                    value={memberPricePerPlayer}
                    onChange={(e) => setMemberPricePerPlayer(parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">€/jug.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================
            7. ASIGNACIÓN DE PAREJAS Y POSICIONES (DRIVE / REVÉS CON COLORES OFICIALES)
            ====================================================================== */}
        <section className="bg-white dark:bg-[#0E2239] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-[#0B1A2D] dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8B5CF6]" />
              <span>Parejas y Posiciones (Lado de Juego)</span>
            </span>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              positionAssignmentMode === 'fixed'
                ? 'bg-[#EDE9FE] dark:bg-[#8B5CF6]/20 text-[#6D28D9] dark:text-[#C4B5FD] border border-[#8B5CF6]/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}>
              {positionAssignmentMode === 'fixed' ? '🔒 Posiciones Fijas' : 'Modo Recomendado'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPositionAssignmentMode('recommended')}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                positionAssignmentMode === 'recommended'
                  ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold">Modo Recomendado</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                Los jugadores eligen libremente lado (Drive o Revés) al inscribirse.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPositionAssignmentMode('fixed')}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                positionAssignmentMode === 'fixed'
                  ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229] font-bold shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#8B5CF6]" />
                <span>Posiciones Fijas</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                Asignación estricta de lado y parejas bloqueadas.
              </div>
            </button>
          </div>

          {/* Layout de Pista: Pareja 1 vs Pareja 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* PAREJA 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-1.5">
                <span className="text-xs font-black text-[#0B1A2D] dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B7F229]" />
                  <span>PAREJA 1 (Lado A)</span>
                </span>
                {positionAssignmentMode === 'fixed' && (
                  <span className="text-[10px] font-bold text-[#8B5CF6]">🔒 Fijas</span>
                )}
              </div>

              {/* Plaza 1 */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] font-black text-[10px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-[#0B1A2D] dark:text-white truncate block">
                      {isClubCreator
                        ? adminCreationMode === 'empty'
                          ? 'Plaza Libre (0/4)'
                          : `Titular: ${customers.find((c) => c.id === titularCustomerId)?.name || 'Jugador'}`
                        : creatorName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isClubCreator && adminCreationMode === 'empty' ? 'Abierta a inscripción' : 'Capitán Titular'}
                    </span>
                  </div>
                </div>

                {/* Drive vs Revés (Brand palette: #0B1A2D / #B7F229) */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSlot1Pos('drive')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      slot1Pos === 'drive'
                        ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Drive
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlot1Pos('reves')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      slot1Pos === 'reves'
                        ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Revés
                  </button>
                </div>
              </div>

              {/* Plaza 2 */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Compañero Pareja 1:
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSlot2Pos('drive')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        slot2Pos === 'drive'
                          ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlot2Pos('reves')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        slot2Pos === 'reves'
                          ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Revés
                    </button>
                  </div>
                </div>

                <select
                  value={slot2PlayerId}
                  onChange={(e) => setSlot2PlayerId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
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
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-1.5">
                <span className="text-xs font-black text-[#0B1A2D] dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <span>PAREJA 2 (Lado B)</span>
                </span>
                {positionAssignmentMode === 'fixed' && (
                  <span className="text-[10px] font-bold text-[#8B5CF6]">🔒 Fijas</span>
                )}
              </div>

              {/* Plaza 3 */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Jugador Pareja 2:
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSlot3Pos('drive')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        slot3Pos === 'drive'
                          ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlot3Pos('reves')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        slot3Pos === 'reves'
                          ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Revés
                    </button>
                  </div>
                </div>

                <select
                  value={slot3PlayerId}
                  onChange={(e) => setSlot3PlayerId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
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
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] flex items-center justify-center shrink-0">
                      4
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Compañero Pareja 2:
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSlot4Pos('drive')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        slot4Pos === 'drive'
                          ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlot4Pos('reves')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        slot4Pos === 'reves'
                          ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Revés
                    </button>
                  </div>
                </div>

                <select
                  value={slot4PlayerId}
                  onChange={(e) => setSlot4PlayerId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
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
        </section>

        {/* ======================================================================
            8. BOTONERA INFERIOR A ANCHO COMPLETO (FULL WIDTH EN MÓVIL Y RESPONSIVE)
            ====================================================================== */}
        <section className="pt-4 border-t border-slate-200/80 dark:border-[#1A314D] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3" data-purpose="actions-footer">
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-center active:scale-98"
          >
            Cancelar
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCreateAndNotifyGroup}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white dark:bg-[#0E2239] border border-[#8B5CF6]/40 hover:border-[#8B5CF6] text-[#6D28D9] dark:text-[#C4B5FD] font-extrabold text-xs shadow-xs transition cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              <Megaphone className="w-4 h-4 text-[#8B5CF6]" />
              <span>Publicar y Notificar Grupo</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db22] text-white dark:text-[#0B1A2D] font-extrabold text-xs shadow-md transition cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Publicar Partida</span>
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default NewMatchPage;
