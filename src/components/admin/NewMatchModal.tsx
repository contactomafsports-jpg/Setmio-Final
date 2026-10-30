import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenMatch } from '../../types/database';
import {
  X,
  Trophy,
  Users,
  Calendar,
  Clock,
  Building2,
  Shield,
  UserCheck,
  CheckCircle2,
  Search,
  Sparkles,
  DollarSign,
  Tag,
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
    sendNotification,
    t,
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
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');
  const [isCreatorDropdownOpen, setIsCreatorDropdownOpen] = useState(false);

  const [minLevel, setMinLevel] = useState(3.0);
  const [maxLevel, setMaxLevel] = useState(4.5);
  const [pricePerPlayer, setPricePerPlayer] = useState(7.5);
  const [memberPricePerPlayer, setMemberPricePerPlayer] = useState(6.0);
  const [matchMode, setMatchMode] = useState<'competitive' | 'friendly'>('competitive');
  const [gender, setGender] = useState<'male' | 'female' | 'mixed'>('mixed');
  const [visibility, setVisibility] = useState<'public' | 'group'>('public');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera Nivel 4 (Formulario) con Cruz alineada estrictamente arriba a la derecha */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0 bg-white dark:bg-[#0E2239]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B1A2D] text-[#B7F229] flex items-center justify-center font-bold shrink-0">
              <Trophy className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0B1A2D] dark:text-white">
                Nueva Partida Abierta
              </h3>
              <p className="text-xs text-slate-400">
                Convocatoria de juego, cuota por plaza y asignación de pista
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable del formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs overscroll-contain">
          {/* Modalidad de Apertura: Creado por Club vs Socio */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220]/70 border border-slate-200/80 dark:border-[#1A314D] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B1A2D] dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Organizador Oficial</span>
              </span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isClubCreator}
                  onChange={(e) => setIsClubCreator(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B1A2D] focus:ring-[#8B5CF6] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                  Creado por el Club
                </span>
              </label>
            </div>

            {isClubCreator ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAdminCreationMode('empty')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    adminCreationMode === 'empty'
                      ? 'bg-white dark:bg-[#0B1A2D] border-[#8B5CF6] text-[#0B1A2D] dark:text-white font-bold shadow-xs'
                      : 'border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Abierta (0/4)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">4 plazas libres para la comunidad</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminCreationMode('assign_titular')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    adminCreationMode === 'assign_titular'
                      ? 'bg-white dark:bg-[#0B1A2D] border-[#8B5CF6] text-[#0B1A2D] dark:text-white font-bold shadow-xs'
                      : 'border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <UserCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Con Titular (1/4)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Asigna capitán inicial</div>
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
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-white"
                  placeholder="Ej. Carlos Méndez"
                />
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
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

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pista
              </label>
              <select
                value={selectedCourtId}
                onChange={(e) => setSelectedCourtId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
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
                        ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D]'
                        : 'bg-slate-100 dark:bg-[#071220] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {dur}'
                  </button>
                ))}
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-xs font-bold font-mono text-[#0B1A2D] dark:text-white"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="number"
                  step="0.25"
                  min="1"
                  max="7"
                  value={maxLevel}
                  onChange={(e) => setMaxLevel(parseFloat(e.target.value) || 7)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-xs font-bold font-mono text-[#0B1A2D] dark:text-white"
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
                        ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D]'
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Precio / Plaza (€)
              </label>
              <input
                type="number"
                step="0.50"
                value={pricePerPlayer}
                onChange={(e) => setPricePerPlayer(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-[#0B1A2D] dark:text-white"
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-[#0B1A2D] dark:text-white"
              />
            </div>
          </div>

          {/* Botones Estándar Nivel 4 */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#a6e61f] dark:text-[#0B1A2D] font-bold text-xs transition shadow-xs cursor-pointer active:scale-95"
            >
              Publicar Partida
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
