import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenMatch } from '../../types/database';
import {
  X,
  Users,
  Shield,
  UserCheck,
  Building2,
  Calendar,
  Clock,
} from 'lucide-react';

export interface NewMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultCourtId?: string;
  defaultVenueId?: string;
}

export const NewMatchModal: React.FC<NewMatchModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
  defaultCourtId,
  defaultVenueId,
}) => {
  const {
    courts,
    venues,
    isMultiVenue,
    selectedVenueId,
    createOpenMatch,
    customers,
    currentTenant,
    triggerDemoToast,
  } = useApp();

  const todayStr = useMemo(() => {
    if (defaultDate) return defaultDate;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [defaultDate]);

  // Form State
  const [modalVenueId, setModalVenueId] = useState<string>(
    defaultVenueId || (selectedVenueId !== 'all' ? selectedVenueId : (venues[1]?.id || venues[0]?.id || 'venue-san-mateo'))
  );
  const [selectedCourtId, setSelectedCourtId] = useState<string>(defaultCourtId || courts[0]?.id || 'court-1');
  const [matchDate, setMatchDate] = useState<string>(todayStr);
  const [matchTime, setMatchTime] = useState<string>('19:30');
  const [matchDuration, setMatchDuration] = useState<60 | 90 | 120>(90);
  const [isClubCreator, setIsClubCreator] = useState(true);
  const [adminCreationMode, setAdminCreationMode] = useState<'empty' | 'assign_titular'>('empty');
  const [titularCustomerId, setTitularCustomerId] = useState<string>(customers[0]?.id || 'c-1');
  const [titularPaymentChoice, setTitularPaymentChoice] = useState<'split' | 'full'>('split');

  const [creatorName, setCreatorName] = useState('Club ' + (currentTenant?.name || 'Pádel'));
  const [creatorLevel, setCreatorLevel] = useState(4.0);
  const [creatorPosition, setCreatorPosition] = useState<'drive' | 'reves' | 'both'>('drive');

  const [minLevel, setMinLevel] = useState(3.0);
  const [maxLevel, setMaxLevel] = useState(4.5);
  const [pricePerPlayer, setPricePerPlayer] = useState(7.5);
  const [memberPricePerPlayer, setMemberPricePerPlayer] = useState(6.0);
  const [matchMode, setMatchMode] = useState<'competitive' | 'friendly'>('competitive');
  const [gender, setGender] = useState<'male' | 'female' | 'mixed'>('mixed');
  const [visibility, setVisibility] = useState<'public' | 'group'>('public');

  // Prevenir scroll de fondo mientras el modal está activo
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Filter courts by venue
  const availableCourts = useMemo(() => {
    if (isMultiVenue && modalVenueId) {
      const filtered = courts.filter((c) => c.venueId === modalVenueId);
      return filtered.length > 0 ? filtered : courts;
    }
    return courts;
  }, [courts, isMultiVenue, modalVenueId]);

  // Synchronize court selection if current is not in available
  React.useEffect(() => {
    if (availableCourts.length > 0 && !availableCourts.some((c) => c.id === selectedCourtId)) {
      setSelectedCourtId(availableCourts[0].id);
    }
  }, [availableCourts, selectedCourtId]);

  // Sync default props when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (defaultDate) setMatchDate(defaultDate);
      if (defaultCourtId) setSelectedCourtId(defaultCourtId);
      if (defaultVenueId && defaultVenueId !== 'all') setModalVenueId(defaultVenueId);
    }
  }, [isOpen, defaultDate, defaultCourtId, defaultVenueId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === selectedCourtId) || availableCourts[0] || courts[0];
    const startISO = `${matchDate}T${matchTime}:00Z`;
    const finalCreatorName = isClubCreator
      ? `${currentTenant?.name || 'Club'} (Oficial)`
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
          position: 'drive',
          paid: true,
          customPrice: titularPaymentChoice === 'full' ? titularPrice * 4 : titularPrice,
          pair: 1,
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
      });
    }

    const chosenVenue = isMultiVenue
      ? (venues.find((v) => v.id === modalVenueId) || venues[1] || venues[0])
      : (court?.venueId ? venues.find((v) => v.id === court.venueId) : venues[0]);

    createOpenMatch({
      courtId: court?.id || 'court-1',
      courtName: court?.name || 'Pista Principal',
      venueId: isMultiVenue ? chosenVenue?.id : court?.venueId,
      venueName: isMultiVenue ? chosenVenue?.name : court?.venueName,
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
      gender,
      isClubCreated: isClubCreator,
      paymentMode: isClubCreator && adminCreationMode === 'assign_titular' && titularPaymentChoice === 'full' ? 'single' : 'split',
      paymentPolicy: 'both',
      players: initialPlayers,
    });

    triggerDemoToast(
      'Partida Creada',
      `Partida programada en ${court?.name || 'Pista'} (${matchDuration} min) para el ${matchDate} a las ${matchTime} h.`,
      'success'
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-full overflow-y-auto bg-white dark:bg-[#071220] sm:bg-slate-950/70 sm:dark:bg-black/80 sm:backdrop-blur-xs sm:p-4 lg:p-6 sm:items-center sm:justify-center animate-in fade-in duration-150">
      <div className="w-full flex-1 sm:flex-initial flex flex-col bg-white dark:bg-[#071220] sm:max-w-2xl lg:max-w-3xl sm:rounded-3xl sm:shadow-2xl border-0 sm:border sm:border-slate-200/90 dark:sm:border-[#1A314D] my-0 sm:my-auto max-h-none sm:max-h-[92vh] overflow-hidden">
        {/* Cabecera Limpia y Exclusiva: solo Título y botón "X" */}
        <div className="sticky top-0 z-20 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between bg-white/95 dark:bg-[#071220]/95 backdrop-blur-md shrink-0">
          <h2 className="text-lg sm:text-xl font-black text-[#0B1A2D] dark:text-white tracking-tight">
            Nueva Partida
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E2239] transition-colors cursor-pointer shrink-0"
            title="Cerrar formulario"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll vertical garantizado */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 text-xs text-slate-900 dark:text-slate-100">
          {/* Modalidad de Apertura: Creado por Club vs Socio */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071220]/70 border border-slate-200/80 dark:border-[#1A314D] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#0B1A2D] dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#8B5CF6]" />
                <span>Organizador Oficial</span>
              </span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isClubCreator}
                  onChange={(e) => setIsClubCreator(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B1A2D] focus:ring-[#8B5CF6] cursor-pointer accent-[#0B1A2D] dark:accent-[#B7F229]"
                />
                <span className="text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                  Creado por el Club
                </span>
              </label>
            </div>

            {isClubCreator ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAdminCreationMode('empty')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    adminCreationMode === 'empty'
                      ? 'bg-white dark:bg-[#0E2239] border-[#8B5CF6] text-[#0B1A2D] dark:text-white font-bold shadow-xs'
                      : 'border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Partida Abierta (0/4)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">4 plazas libres para la comunidad</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminCreationMode('assign_titular')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    adminCreationMode === 'assign_titular'
                      ? 'bg-white dark:bg-[#0E2239] border-[#8B5CF6] text-[#0B1A2D] dark:text-white font-bold shadow-xs'
                      : 'border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <UserCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Con Titular Asignado (1/4)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Asigna capitán inicial con reserva</div>
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Nombre del Socio / Organizador
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#B7F229]"
                  placeholder="Ej. Carlos Méndez"
                />
              </div>
            )}

            {isClubCreator && adminCreationMode === 'assign_titular' && (
              <div className="pt-2 border-t border-slate-200/70 dark:border-[#1A314D] space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Seleccionar Socio Titular:
                </label>
                <select
                  value={titularCustomerId}
                  onChange={(e) => setTitularCustomerId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.isMember ? '(Socio)' : '(Cliente)'} · Nivel {c.level?.toFixed(1) || '4.0'}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Sede y Pista */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isMultiVenue && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sede
                </label>
                <select
                  value={modalVenueId}
                  onChange={(e) => setModalVenueId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
                >
                  {venues
                    .filter((v) => v.id !== 'all')
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className={isMultiVenue ? '' : 'sm:col-span-2'}>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pista
              </label>
              <select
                value={selectedCourtId}
                onChange={(e) => setSelectedCourtId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
              >
                {availableCourts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.courtType || 'indoor'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha, Hora y Duración */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hora de Inicio
              </label>
              <input
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Duración
              </label>
              <div className="grid grid-cols-3 gap-1">
                {([60, 90, 120] as const).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setMatchDuration(dur)}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      matchDuration === dur
                        ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] shadow-xs'
                        : 'bg-slate-100 dark:bg-[#071220] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {dur}'
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modo de Juego & Visibilidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Modo de Juego
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-[#071220] rounded-xl border border-slate-200/80 dark:border-[#1A314D]">
                <button
                  type="button"
                  onClick={() => setMatchMode('competitive')}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                    matchMode === 'competitive'
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Competitiva
                </button>
                <button
                  type="button"
                  onClick={() => setMatchMode('friendly')}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                    matchMode === 'friendly'
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Amistosa
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Visibilidad
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-[#071220] rounded-xl border border-slate-200/80 dark:border-[#1A314D]">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                    visibility === 'public'
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Pública
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('group')}
                  className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                    visibility === 'group'
                      ? 'bg-[#8B5CF6] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Privada / Grupo
                </button>
              </div>
            </div>
          </div>

          {/* Rango de Nivel y Género */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Rango de Nivel (Min - Max)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.25"
                  min="1"
                  max="7"
                  value={minLevel}
                  onChange={(e) => setMinLevel(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold font-mono text-[#0B1A2D] dark:text-white"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="number"
                  step="0.25"
                  min="1"
                  max="7"
                  value={maxLevel}
                  onChange={(e) => setMaxLevel(parseFloat(e.target.value) || 7)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold font-mono text-[#0B1A2D] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Modalidad y Género
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['mixed', 'male', 'female'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                      gender === g
                        ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] shadow-xs'
                        : 'bg-slate-100 dark:bg-[#071220] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {g === 'mixed' ? 'Mixta' : g === 'male' ? 'Masc' : 'Fem'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Precio por jugador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Precio / Plaza (€)
              </label>
              <input
                type="number"
                step="0.50"
                value={pricePerPlayer}
                onChange={(e) => setPricePerPlayer(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-[#0B1A2D] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Precio Socio (€)
              </label>
              <input
                type="number"
                step="0.50"
                value={memberPricePerPlayer}
                onChange={(e) => setMemberPricePerPlayer(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-[#0B1A2D] dark:text-white"
              />
            </div>
          </div>
        </form>
        </div>

        {/* Modal Footer Sólido y Simétrico (Distribución Equitativa 50/50) */}
        <div className="sticky bottom-0 z-20 px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 dark:border-[#1A314D] bg-white/95 dark:bg-[#071220]/95 backdrop-blur-md shrink-0 mt-auto">
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0E2239] dark:hover:bg-[#132A45] text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm border border-slate-200/80 dark:border-[#1A314D] transition cursor-pointer active:scale-[0.99] flex items-center justify-center text-center whitespace-nowrap"
            >
              <span>Cancelar</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 px-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#a6e61f] dark:text-[#0B1A2D] font-bold text-xs sm:text-sm border border-transparent shadow-md transition active:scale-[0.99] cursor-pointer flex items-center justify-center text-center whitespace-nowrap"
            >
              <span>Publicar Partida</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMatchModal;
