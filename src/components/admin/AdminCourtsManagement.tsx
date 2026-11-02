import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Court, SmartCourtDevice } from '../../types/database';
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  Power,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  KeyRound,
  Lock,
  Key,
  Clock,
  Layers,
  Search,
  Filter,
  X,
  Sliders,
  Check,
  Upload,
  Image as ImageIcon,
  Calendar,
  Activity,
  Radio,
  Server,
  ArrowRight,
  Building2,
  ChevronDown,
} from 'lucide-react';

interface AdminCourtsManagementProps {
  initialTab?: 'inventory' | 'iot' | 'logs' | 'courts_iot' | 'courts';
}

export const AdminCourtsManagement: React.FC<AdminCourtsManagementProps> = ({
  initialTab = 'courts',
}) => {
  const {
    currentTenant,
    courts,
    addCourt,
    updateCourt,
    deleteCourt,
    toggleCourtLight,
    openCourtDoor,
    smartDevices,
    toggleSmartRelay,
    generateAccessPin,
    auditLogs,
    triggerDemoToast,
    setAdminTab,
    t,
    isMultiVenue,
    venues,
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    isClubOpen,
    toggleClubOpenState,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'courts' | 'logs'>(
    initialTab === 'logs' ? 'logs' : 'courts'
  );
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [isVenueSelectorOpen, setIsVenueSelectorOpen] = useState(false);
  const venueSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTab === 'logs') {
      setActiveTab('logs');
    } else {
      setActiveTab('courts');
    }
  }, [initialTab]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setIsActionMenuOpen(false);
      }
      if (venueSelectorRef.current && !venueSelectorRef.current.contains(e.target as Node)) {
        setIsVenueSelectorOpen(false);
      }
    };
    if (isActionMenuOpen || isVenueSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionMenuOpen, isVenueSelectorOpen]);

  // Multi-venue segmenting: In multi-venue mode, the entire section is obligatorily segmented by venue
  const realVenues = (venues || []).filter((v) => v.id !== 'all');
  const isMultiVenueActive = Boolean(isMultiVenue) && realVenues.length > 1;
  const isAllVenuesSelected = selectedVenueId === 'all';
  const effectiveVenueId =
    selectedVenueId && selectedVenueId !== 'all'
      ? selectedVenueId
      : realVenues[0]?.id || 'venue-san-mateo';
  const activeVenueObj = realVenues.find((v) => v.id === effectiveVenueId) || realVenues[0];

  // Inventory Filters & State (Segmented Controls Minimalistas)
  const [formatFilter, setFormatFilter] = useState<'all' | 'double' | 'single'>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [deletingCourtId, setDeletingCourtId] = useState<string | null>(null);

  // Courts segmented by venue in multi-venue mode
  const venueCourts = courts.filter((c) => {
    if (!isMultiVenueActive) return true;
    if (isConsolidatedView || isAllVenuesSelected) return true;
    return c.venueId ? c.venueId === effectiveVenueId : effectiveVenueId === realVenues[0]?.id;
  });

  // Form state for Create / Edit Court
  const [formData, setFormData] = useState({
    name: '',
    venueId: effectiveVenueId,
    courtType: 'indoor' as 'indoor' | 'outdoor' | 'covered',
    surface: 'Mondo Supercourt WPT',
    hourlyRate: 24,
    isPanoramic: true,
    hasLights: true,
    displayOrder: 1,
    photoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
    accessPin: '4821#',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // IoT Devices Form & Filters (segmented by venue)
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'light_relay' | 'pin_pad_lock'>('all');
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newProvider, setNewProvider] = useState<'Shelly Cloud Pro' | 'Salto KS Cloud' | 'Sonoff IoT' | 'Tuya Pro'>('Shelly Cloud Pro');
  const [newCourtId, setNewCourtId] = useState(venueCourts[0]?.id || courts[0]?.id || 'court-1');

  // Keep newCourtId in sync when venue changes
  useEffect(() => {
    if (venueCourts.length > 0 && !venueCourts.some((c) => c.id === newCourtId)) {
      setNewCourtId(venueCourts[0].id);
    }
  }, [effectiveVenueId, venueCourts, newCourtId]);

  const openCreateModal = () => {
    setFormData({
      name: `Pista ${venueCourts.length + 1} (${activeVenueObj?.shortName || 'Pro'})`,
      venueId: effectiveVenueId,
      courtType: 'indoor',
      surface: 'Mondo Supercourt WPT',
      hourlyRate: 24,
      isPanoramic: true,
      hasLights: true,
      displayOrder: venueCourts.length + 1,
      photoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
      accessPin: `${Math.floor(1000 + Math.random() * 9000)}#`,
    });
    setFormErrors({});
    setEditingCourt(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (court: Court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      venueId: court.venueId || effectiveVenueId,
      courtType: court.courtType || 'indoor',
      surface: court.surface || 'Mondo Supercourt WPT',
      hourlyRate: court.hourlyRate || 24,
      isPanoramic: court.isPanoramic ?? true,
      hasLights: court.hasLights ?? true,
      displayOrder: court.displayOrder || 1,
      photoUrl: court.photoUrl || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
      accessPin: court.accessPin || '4821#',
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'El nombre de la pista es obligatorio.';
    if (isMultiVenueActive && !formData.venueId) errors.venueId = 'La sede es obligatoria en entornos multi-sede.';
    if (!formData.surface.trim()) errors.surface = 'La superficie es obligatoria.';
    if (formData.hourlyRate <= 0) errors.hourlyRate = 'La tarifa horaria debe ser mayor a 0 €/h.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const chosenVenue = realVenues.find((v) => v.id === formData.venueId);
    const chosenVenueName = chosenVenue?.name || (formData.venueId === 'venue-norte' ? 'Sede Norte - Las Palmas' : 'Sede Principal - San Mateo');

    if (editingCourt) {
      updateCourt(editingCourt.id, {
        name: formData.name,
        venueId: formData.venueId,
        venueName: chosenVenueName,
        courtType: formData.courtType,
        surface: formData.surface,
        hourlyRate: Number(formData.hourlyRate),
        isPanoramic: formData.isPanoramic,
        hasLights: formData.hasLights,
        displayOrder: Number(formData.displayOrder),
        photoUrl: formData.photoUrl,
        accessPin: formData.accessPin,
      });
      triggerDemoToast(
        'Pista Actualizada',
        `Parámetros y tarifas de "${formData.name}" guardados correctamente para ${chosenVenueName}.`,
        'success'
      );
    } else {
      addCourt({
        name: formData.name,
        sport: 'padel',
        venueId: formData.venueId,
        venueName: chosenVenueName,
        courtType: formData.courtType,
        surface: formData.surface,
        hourlyRate: Number(formData.hourlyRate),
        isPanoramic: formData.isPanoramic,
        isSingle: false,
        hasLights: formData.hasLights,
        displayOrder: Number(formData.displayOrder),
        photoUrl: formData.photoUrl,
        accessPin: formData.accessPin,
        isLightOn: false,
        isDoorOpen: false,
        isDeviceOnline: true,
      });
      triggerDemoToast(
        'Nueva Pista Creada',
        `Pista "${formData.name}" dada de alta en ${chosenVenueName} con tarifa ${formData.hourlyRate}€/h.`,
        'success'
      );
    }

    setIsCreateModalOpen(false);
  };

  const confirmDeleteCourt = (courtId: string) => {
    const court = courts.find((c) => c.id === courtId);
    deleteCourt(courtId);
    setDeletingCourtId(null);
    triggerDemoToast(
      'Pista Desactivada/Eliminada',
      `La pista "${court?.name || courtId}" ha sido retirada del cuadrante activo.`,
      'info'
    );
  };

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedCourt = courts.find((c) => c.id === newCourtId);
    triggerDemoToast(
      'Adaptador IoT Vinculado',
      `Dispositivo "${newDeviceName}" vinculado a "${assignedCourt?.name || 'Pista'}" (${assignedCourt?.venueName || activeVenueObj?.shortName || 'Sede'}) mediante ${newProvider}.`,
      'success'
    );
    setShowAddDeviceModal(false);
    setNewDeviceName('');
  };

  const filteredCourts = venueCourts.filter((c) => {
    // Formato: Doble vs Individual
    if (formatFilter === 'double' && c.isSingle) return false;
    if (formatFilter === 'single' && !c.isSingle) return false;

    // Ubicación: Indoor vs Outdoor (sin opciones obsoletas)
    if (locationFilter === 'indoor' && c.courtType !== 'indoor' && c.courtType !== 'covered') return false;
    if (locationFilter === 'outdoor' && c.courtType !== 'outdoor') return false;

    return true;
  });

  const venueSmartDevices = smartDevices.filter((d) => {
    if (!isMultiVenueActive) return true;
    if (isAllVenuesSelected) return true;
    const assignedCourt = courts.find((c) => c.id === d.courtId);
    const courtVenueId = assignedCourt?.venueId || realVenues[0]?.id;
    return courtVenueId === effectiveVenueId;
  });

  const filteredDevices = venueSmartDevices.filter((d) => {
    if (deviceFilter === 'light_relay') return d.deviceType === 'light_relay';
    if (deviceFilter === 'pin_pad_lock') return d.deviceType === 'pin_pad_lock';
    return true;
  });

  const activeLightsCount = venueCourts.filter((c) => c.isLightOn).length;
  const avgRate = venueCourts.length > 0 ? venueCourts.reduce((acc, c) => acc + c.hourlyRate, 0) / venueCourts.length : 0;

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!isMultiVenueActive) return true;
    const targetLower = (log.target || '').toLowerCase();
    const detailsLower = (log.details || '').toLowerCase();
    const actionLower = (log.action || '').toLowerCase();
    const venueNameLower = (activeVenueObj?.name || '').toLowerCase();
    return (
      venueCourts.some(
        (c) =>
          targetLower.includes(c.name.toLowerCase()) ||
          detailsLower.includes(c.name.toLowerCase())
      ) ||
      detailsLower.includes(venueNameLower) ||
      actionLower.includes('sede') ||
      targetLower.includes('san mateo') ||
      targetLower.includes('norte')
    );
  });

  return (
    <div className="space-y-4 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12 font-sans antialiased">
      {/* 1. CABECERA LIMPIA Y SIMÉTRICA CON MENÚ RÁPIDO DE ACCIÓN "+" */}
      <div className="flex items-center justify-between pt-2 pb-1" data-purpose="header-section">
        <h1 className="text-[22px] font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
          Pistas y Domótica
        </h1>

        <div className="relative" ref={actionMenuRef}>
          <button
            type="button"
            onClick={() => setIsActionMenuOpen((prev) => !prev)}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95 flex items-center justify-center rounded-lg"
            title="Añadir Pista o Adaptador IoT"
            aria-label="Añadir Pista o Adaptador IoT"
          >
            <Plus className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Menú Contextual Desplegable */}
          {isActionMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] shadow-xl py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                type="button"
                onClick={() => {
                  setIsActionMenuOpen(false);
                  openCreateModal();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] hover:text-[#0B1A2D] dark:hover:text-[#B7F229] flex items-center gap-2.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.2] text-[#8B5CF6]" />
                <span>Nueva Pista</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsActionMenuOpen(false);
                  setShowAddDeviceModal(true);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] hover:text-[#0B1A2D] dark:hover:text-[#B7F229] flex items-center gap-2.5 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Adaptador IoT</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 1.1 SELECTOR DE SEDE Y ESTADO OPERATIVO UNIFICADO (IDÉNTICO A RESERVAS) */}
      <div className="relative" ref={venueSelectorRef}>
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
                  {isConsolidatedView ? 'Todas las Sedes' : selectedVenue?.shortName || selectedVenue?.name || 'Sede'}
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

      {/* 2. DASHBOARD DE MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Pistas Activas
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-[#0B1A2D] dark:text-white">
            {venueCourts.length}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#82b805] dark:text-[#B7F229]" /> 100% Operativas
          </span>
        </div>

        <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Tarifa Media
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-[#0B1A2D] dark:text-white">
            {avgRate.toFixed(2)} €/h
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Por sesión de juego</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Iluminación IoT
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-500 flex items-center gap-1.5">
            <span>{activeLightsCount} / {venueCourts.length}</span>
            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Focos Shelly Cloud</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Cerraduras & Tornos
          </span>
          <div className="text-base sm:text-lg font-black font-mono text-[#0B1A2D] dark:text-[#B7F229] flex items-center gap-1.5 pt-0.5">
            <span>Salto KS Online</span>
            <ShieldCheck className="w-4 h-4 text-[#82b805] dark:text-[#B7F229] shrink-0" />
          </div>
          <span className="text-[10px] text-slate-400 font-medium">PIN Dinámico Auto</span>
        </div>
      </div>

      {/* 3. REESTRUCTURACIÓN DE PESTAÑAS (MINIMALISTA PLANO: "Pistas" y "Registros") */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-[#1A314D] pb-3 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('courts')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'courts'
              ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] font-bold shadow-xs'
              : 'bg-white dark:bg-[#0E2239] text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white border border-slate-200/80 dark:border-[#1A314D]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#8B5CF6]" />
          <span>Pistas</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold">
            {venueCourts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] font-bold shadow-xs'
              : 'bg-white dark:bg-[#0E2239] text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white border border-slate-200/80 dark:border-[#1A314D]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#82b805] dark:text-[#B7F229]" />
          <span>Registros</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold">
            {filteredAuditLogs.length}
          </span>
        </button>
      </div>

      {/* ======================================================================
          PESTAÑA 1: PISTAS
          ====================================================================== */}
      {activeTab === 'courts' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filtros Planos y Minimalistas (Sin contenedores pesados ni etiquetas de texto estáticas) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            {/* 1. Botones de Formato */}
            <div className="flex items-center gap-1.5">
              {(['all', 'double', 'single'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormatFilter(fmt)}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer ${
                    formatFilter === fmt
                      ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                      : 'bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {fmt === 'all'
                    ? 'Todos los formatos'
                    : fmt === 'double'
                    ? 'Doble'
                    : 'Individual'}
                </button>
              ))}
            </div>

            {/* 2. Botones de Ubicación */}
            <div className="flex items-center gap-1.5">
              {(['all', 'indoor', 'outdoor'] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocationFilter(loc)}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer ${
                    locationFilter === loc
                      ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                      : 'bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {loc === 'all'
                    ? 'Todas las ubicaciones'
                    : loc === 'indoor'
                    ? 'Indoor'
                    : 'Outdoor'}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Pistas Homologadas con Control IoT y CRUD */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredCourts.map((court) => (
              <div
                key={court.id}
                className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-slate-300 dark:hover:border-slate-700 transition overflow-hidden shadow-2xs flex flex-col justify-between group"
              >
                {/* Foto & Badges Superiores */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={court.photoUrl}
                    alt={court.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Badges superiores */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {isMultiVenueActive && (
                      <span className="px-2 py-0.5 rounded-md bg-[#0B1A2D]/85 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 uppercase flex items-center gap-1 shadow-xs">
                        <Building2 className="w-3 h-3 text-[#B7F229]" />
                        {court.venueName || activeVenueObj?.shortName || 'Sede'}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-[#0B1A2D]/85 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 uppercase">
                      {court.courtType === 'indoor'
                        ? 'Indoor Cristal'
                        : court.courtType === 'outdoor'
                        ? 'Outdoor Exterior'
                        : 'Cubierta'}
                    </span>
                    {court.isPanoramic && (
                      <span className="px-2 py-0.5 rounded-md bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/50 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3 text-[#82b805] dark:text-[#B7F229]" /> Panorámica WPT
                      </span>
                    )}
                  </div>

                  {/* Tarifa destacada abajo a la derecha de la foto */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-[#0B1A2D]/85 backdrop-blur-md border border-white/10 text-right">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Tarifa</div>
                    <div className="text-base font-black font-mono text-[#B7F229]">
                      {court.hourlyRate.toFixed(2)} €<span className="text-[10px] font-normal text-slate-300">/h</span>
                    </div>
                  </div>

                  {/* Nombre de la pista */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-base font-black tracking-tight">{court.name}</h3>
                    <div className="text-[11px] text-slate-300">{court.surface}</div>
                  </div>
                </div>

                {/* Controles IoT y Parámetros (Sin cajas internas innecesarias) */}
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                  {/* Fila Focos LED Shelly */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${court.isLightOn ? 'text-[#82b805] dark:text-[#B7F229]' : 'text-slate-400'}`} />
                      <span>Iluminación LED</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCourtLight(court.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                        court.isLightOn
                          ? 'bg-[#F0FCCF] text-[#0B1A2D] dark:bg-[#B7F229]/20 dark:text-[#B7F229] border border-[#B7F229]/50'
                          : 'bg-slate-100 dark:bg-[#071220] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-[#1A314D]'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{court.isLightOn ? 'ENCENDIDA' : 'APAGADA'}</span>
                    </button>
                  </div>

                  {/* Fila PIN y Acceso Salto KS */}
                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100 dark:border-[#1A314D]">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                      <KeyRound className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>PIN:</span>
                      <span className="font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229]">{court.accessPin || '4821#'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCourtDoor(court.id)}
                      className="text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] dark:text-[#C4B5FD] transition cursor-pointer"
                    >
                      Abrir Torno
                    </button>
                  </div>

                  {/* Acciones CRUD */}
                  <div className="pt-2.5 flex items-center gap-2 border-t border-slate-100 dark:border-[#1A314D]">
                    <button
                      type="button"
                      onClick={() => openEditModal(court)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#0B1A2D] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar Parámetros</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingCourtId(court.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                      title="Desactivar o Eliminar Pista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCourts.length === 0 && (
              <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-3">
                <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No hay pistas registradas para los filtros en esta sede
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {isMultiVenueActive
                    ? `No se encontraron pistas en la sede "${activeVenueObj?.name}". Puedes cambiar los filtros o crear una nueva pista para esta sede.`
                    : 'Prueba a cambiar los filtros de formato o ubicación para ver más pistas.'}
                </p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="px-4 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#B7F229]" />
                  <span>Crear Pista en {activeVenueObj?.shortName || 'esta Sede'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Subsección: Hardware IoT y Pasarelas de Control */}
          <div className="pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dispositivos IoT & Pasarelas ({filteredDevices.length})
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Relés Shelly Pro DIN y cerraduras autónomas Salto KS vinculadas
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setDeviceFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    deviceFilter === 'all'
                      ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Todos ({venueSmartDevices.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceFilter('light_relay')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    deviceFilter === 'light_relay'
                      ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Relés Shelly Pro
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceFilter('pin_pad_lock')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    deviceFilter === 'pin_pad_lock'
                      ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Cerraduras Salto KS
                </button>
              </div>
            </div>

            {/* Grid de Dispositivos IoT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between space-y-3.5 shadow-2xs transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[#0B1A2D] dark:text-white">{dev.courtName}</span>
                        {isMultiVenueActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-[#1A314D] flex items-center gap-1">
                            <Building2 className="w-2.5 h-2.5" />
                            {activeVenueObj?.shortName}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/50">
                        {dev.status === 'connected_demo' ? 'Conectado' : 'Online'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                        {dev.deviceType === 'light_relay' ? (
                          <Zap className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-[#8B5CF6]" />
                        )}
                        <span className="truncate">{dev.name}</span>
                      </h4>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Gateway: <span className="text-slate-800 dark:text-slate-200 font-semibold">{dev.provider}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">ID / MAC: {dev.ipOrCloudId}</div>
                    </div>

                    {dev.deviceType === 'pin_pad_lock' && dev.currentAccessPin && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">PIN Activo:</span>
                        <span className="font-mono text-base font-black text-[#0B1A2D] dark:text-[#B7F229]">
                          {dev.currentAccessPin}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botones de Acción IoT */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">{dev.lastSync}</span>

                    {dev.deviceType === 'light_relay' ? (
                      <button
                        type="button"
                        onClick={() => toggleSmartRelay(dev.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                          dev.relayState
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{dev.relayState ? 'Encendido (ON)' : 'Apagado (OFF)'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => generateAccessPin(dev.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-[#B7F229]" />
                        <span>Regenerar PIN</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredDevices.length === 0 && (
                <div className="col-span-full p-8 text-center rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-2">
                  <Zap className="w-7 h-7 text-amber-500 mx-auto" />
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    No hay adaptadores IoT vinculados en esta sede
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddDeviceModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#B7F229]" />
                    <span>Vincular Adaptador</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          PESTAÑA 2: REGISTROS Y LOGS DE AUTOMATIZACIÓN (REDISEÑO ANTISOLAPAMIENTO)
          ====================================================================== */}
      {activeTab === 'logs' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1A314D] gap-2">
              <div className="space-y-0.5">
                <h2 className="text-sm font-extrabold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#82b805] dark:text-[#B7F229]" />
                  <span>Historial de Actividad Domótica & Tornos</span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Trazabilidad de iluminación Shelly, sensores y apertura remota de accesos
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {isMultiVenueActive && (
                  <span className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold border border-slate-200/80 dark:border-[#1A314D] flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#B7F229]" />
                    <span>{isConsolidatedView ? 'Todas las Sedes' : activeVenueObj?.shortName || activeVenueObj?.name}</span>
                  </span>
                )}
                <span className="text-[10px] px-2.5 py-1 rounded-xl bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229] font-mono font-bold border border-[#B7F229]/50">
                  {filteredAuditLogs.length} eventos
                </span>
              </div>
            </div>

            {/* Listado Estructurado de Eventos */}
            <div className="space-y-2.5">
              {filteredAuditLogs.map((log) => {
                const actionLower = log.action.toLowerCase();
                const isLight = actionLower.includes('ilumin') || actionLower.includes('foco') || actionLower.includes('shelly');
                const isAccess = actionLower.includes('torno') || actionLower.includes('puerta') || actionLower.includes('pin') || actionLower.includes('cerrad');
                const isBooking = actionLower.includes('reserva');

                return (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/70 dark:border-[#1A314D] hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    {/* Icono + Contenido */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isLight
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                            : isAccess
                            ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/20 text-[#0B1A2D] dark:text-[#B7F229]'
                            : isBooking
                            ? 'bg-[#8B5CF6]/15 text-[#8B5CF6]'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isLight ? (
                          <Zap className="w-4 h-4 animate-pulse" />
                        ) : isAccess ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : isBooking ? (
                          <Calendar className="w-4 h-4" />
                        ) : (
                          <Activity className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-[#0B1A2D] dark:text-white">
                            {log.action}
                          </span>
                          {log.target && (
                            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                              {log.target}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Ejecutado</span>
                          </span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed break-words">
                          {log.details}
                        </p>

                        <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <span>Operador:</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-400">
                            {log.actor || 'IoT Cloud Pro'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fecha y Marca de Tiempo (Alineada a la derecha, sin colisión) */}
                    <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 border-slate-200/60 dark:border-[#1A314D]">
                      <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0E2239] px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-[#1A314D] whitespace-nowrap shadow-2xs">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredAuditLogs.length === 0 && (
                <div className="p-10 text-center text-slate-400 text-xs space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    No hay registros domóticos recientes
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Los eventos de encendido y códigos PIN se registrarán automáticamente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ALTA / EDICIÓN DE PISTA (HOMOLOGADO A NIVEL 3) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header Fijo con X correctamente alineada */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between shrink-0">
              <h3 className="text-lg font-black text-[#0B1A2D] dark:text-white">
                {editingCourt ? `Editar ${editingCourt.name}` : 'Crear Nueva Pista'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario Organizado sin Cajas Pesadas Innecesarias */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain text-xs">
              {isMultiVenueActive && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sede Asignada *
                  </label>
                  <select
                    required
                    value={formData.venueId}
                    onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    {realVenues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.venueId && (
                    <span className="text-rose-500 text-[11px] font-bold mt-1 block">{formErrors.venueId}</span>
                  )}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Pista *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Pista 9 (Central Panorámica)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
                {formErrors.name && <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.name}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Pista
                  </label>
                  <select
                    value={formData.courtType}
                    onChange={(e) => setFormData({ ...formData, courtType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="indoor">Indoor (Cubierta)</option>
                    <option value="outdoor">Outdoor (Exterior)</option>
                    <option value="covered">Semi-Cubierta</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tarifa Horaria (€/h) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                  {formErrors.hourlyRate && <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.hourlyRate}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Superficie de Juego *
                  </label>
                  <input
                    type="text"
                    value={formData.surface}
                    onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                    placeholder="Mondo Supercourt WPT"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                  {formErrors.surface && <span className="text-rose-500 text-[11px] mt-1 block">{formErrors.surface}</span>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Código PIN Torno / Acceso
                  </label>
                  <input
                    type="text"
                    value={formData.accessPin}
                    onChange={(e) => setFormData({ ...formData, accessPin: e.target.value })}
                    placeholder="5821#"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Fotografía de la Pista (URL o Archivo)
                </label>
                {formData.photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#1A314D] bg-slate-100 dark:bg-slate-950 mb-2">
                    <img
                      src={formData.photoUrl}
                      alt="Vista previa de pista"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-between p-3">
                      <span className="text-[11px] text-white font-medium truncate">
                        Imagen seleccionada
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photoUrl: '' })}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/90 text-white font-bold text-[10px] hover:bg-rose-500 transition cursor-pointer"
                      >
                        Cambiar / Quitar
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 dark:border-[#1A314D] hover:border-[#8B5CF6] rounded-2xl cursor-pointer bg-slate-50 dark:bg-[#071220] transition text-center">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Seleccionar imagen para la pista
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setFormData({ ...formData, photoUrl: String(event.target.result) });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-[#1A314D] space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPanoramic}
                    onChange={(e) => setFormData({ ...formData, isPanoramic: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Estructura Panorámica WPT Pro (Sin marcos intermedios)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasLights}
                    onChange={(e) => setFormData({ ...formData, hasLights: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Focos LED y Relé Shelly IoT conectado
                  </span>
                </label>
              </div>

              {/* Footer de Acciones del Modal */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#a6e61f] text-[#0B1A2D] font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingCourt ? 'Guardar Cambios' : 'Crear Pista'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR ADAPTADOR HARDWARE IOT */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div>
                <h3 className="text-base font-black text-[#0B1A2D] dark:text-white">
                  Vincular Adaptador Hardware IoT
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Integración con gateways Shelly Pro DIN y cerraduras Salto KS
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDeviceModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isMultiVenueActive && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Sede Asignada:</span>
                </span>
                <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                  {activeVenueObj?.name}
                </span>
              </div>
            )}

            <form onSubmit={handleAddDeviceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Nombre del Dispositivo / Canal
                </label>
                <input
                  type="text"
                  required
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="Ej: Relé Focos Pista 6 (Canal A)"
                  className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Proveedor / Protocolo
                </label>
                <select
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="Shelly Cloud Pro">Shelly Cloud Pro (Relé DIN)</option>
                  <option value="Salto KS Cloud">Salto KS Cloud (Cerradura PIN)</option>
                  <option value="Sonoff IoT">Sonoff IoT WiFi / Zigbee</option>
                  <option value="Tuya Pro">Tuya Pro / Smart Life API</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Pista Asignada {isMultiVenueActive ? `(${activeVenueObj?.shortName || 'Sede'}) *` : '*'}
                </label>
                <select
                  value={newCourtId}
                  onChange={(e) => setNewCourtId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  {venueCourts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {isMultiVenueActive ? `— ${c.venueName || activeVenueObj?.shortName || ''}` : ''}
                    </option>
                  ))}
                </select>
                {venueCourts.length === 0 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                    No hay pistas dadas de alta en esta sede. Da de alta una pista primero.
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-[#1A314D]">
                <button
                  type="button"
                  onClick={() => setShowAddDeviceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6e61f] text-[#0B1A2D] font-black transition shadow-sm active:scale-95 cursor-pointer"
                >
                  Vincular Dispositivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMACIÓN DE ELIMINACIÓN */}
      {deletingCourtId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1A2D]/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B1A2D] dark:text-white">¿Desactivar Pista?</h3>
                <p className="text-xs text-slate-400">Se retirará del cuadrante de reservas.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              La pista dejará de aparecer en la cuadrícula de reservas para socios y recepción. Las reservas pasadas se conservarán para el histórico contable.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1A314D]">
              <button
                type="button"
                onClick={() => setDeletingCourtId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => confirmDeleteCourt(deletingCourtId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourtsManagement;
