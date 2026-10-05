import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Court } from '../../types/database';
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
  Eye,
  EyeOff,
  Clock,
  Layers,
  Search,
  Filter,
  X,
  Sliders,
  Check,
} from 'lucide-react';

export const AdminCourtsManagement: React.FC = () => {
  const {
    courts,
    addCourt,
    updateCourt,
    deleteCourt,
    toggleCourtLight,
    openCourtDoor,
    triggerDemoToast,
    setAdminTab,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'indoor' | 'outdoor' | 'covered'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [deletingCourtId, setDeletingCourtId] = useState<string | null>(null);

  // Form state for Create / Edit
  const [formData, setFormData] = useState({
    name: '',
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

  const openCreateModal = () => {
    setFormData({
      name: `Pista ${courts.length + 1} (Indoor Pro)`,
      courtType: 'indoor',
      surface: 'Mondo Supercourt WPT',
      hourlyRate: 24,
      isPanoramic: true,
      hasLights: true,
      displayOrder: courts.length + 1,
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
    if (!formData.surface.trim()) errors.surface = 'La superficie es obligatoria.';
    if (formData.hourlyRate <= 0) errors.hourlyRate = 'La tarifa horaria debe ser mayor a 0 €/h.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCourt) {
      updateCourt(editingCourt.id, {
        name: formData.name,
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
        `Parámetros y tarifas de "${formData.name}" guardados correctamente.`,
        'success'
      );
    } else {
      addCourt({
        name: formData.name,
        sport: 'padel',
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
        `Pista "${formData.name}" dada de alta en el cuadrante con tarifa ${formData.hourlyRate}€/h.`,
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

  const filteredCourts = courts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.surface.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || c.courtType === filterType;
    return matchesSearch && matchesType;
  });

  const activeLightsCount = courts.filter((c) => c.isLightOn).length;
  const avgRate = courts.length > 0 ? courts.reduce((acc, c) => acc + c.hourlyRate, 0) / courts.length : 0;

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-12">
      {/* 1. Header con Estilo Canónico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Infraestructura Deportiva
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Gestión de Pistas & Domótica IoT
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Alta, edición de parámetros, tipos de pista (Indoor/Outdoor), tarifas y automatización de focos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAdminTab('agenda')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Ver Cuadrante
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Pista</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs de Infraestructura */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Pistas</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{courts.length}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operativas
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tarifa Media</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{avgRate.toFixed(2)} €/h</div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Rango: 18€ - 30€/h</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Iluminación IoT Activa</span>
          <div className="text-2xl font-black text-amber-500 font-mono flex items-center gap-2">
            <span>{activeLightsCount} / {courts.length}</span>
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Relés Shelly Cloud</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Control Accesos</span>
          <div className="text-2xl font-black text-emerald-500 font-mono flex items-center gap-2">
            <span>PIN Online</span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Tornos Sincronizados</span>
        </div>
      </div>

      {/* 3. Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pista o superficie..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'indoor', 'outdoor', 'covered'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === t
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === 'all' ? 'Todas' : t === 'indoor' ? 'Indoor' : t === 'outdoor' ? 'Outdoor' : 'Cubierta'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Grid de Pistas con Control IoT y CRUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredCourts.map((court) => (
          <div
            key={court.id}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition overflow-hidden shadow-sm flex flex-col justify-between group"
          >
            {/* Foto & Badges Superiores */}
            <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
              <img
                src={court.photoUrl}
                alt={court.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Badges superiores */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold border border-slate-700/80 uppercase">
                  {court.courtType === 'indoor' ? 'Indoor Cristal' : court.courtType === 'outdoor' ? 'Outdoor Exterior' : 'Cubierta'}
                </span>
                {court.isPanoramic && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" /> Panorámica WPT
                  </span>
                )}
              </div>

              {/* Tarifa destacada abajo a la derecha de la foto */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-right">
                <div className="text-[9px] text-slate-400 font-bold uppercase">Tarifa</div>
                <div className="text-base font-black font-mono text-emerald-400">
                  {court.hourlyRate.toFixed(2)} €<span className="text-[10px] font-normal text-slate-400">/h</span>
                </div>
              </div>

              {/* Nombre de la pista */}
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="text-base font-black tracking-tight">{court.name}</h3>
                <div className="text-[11px] text-slate-300">{court.surface}</div>
              </div>
            </div>

            {/* Controles IoT y Parámetros */}
            <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
              {/* Telemetría IoT */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Zap className={`w-3.5 h-3.5 ${court.isLightOn ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
                    <span>Focos e Iluminación IoT</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleCourtLight(court.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 ${
                      court.isLightOn
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{court.isLightOn ? 'ENCENDIDA' : 'APAGADA'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
                    <span>PIN de Torno: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{court.accessPin || '4821#'}</strong></span>
                  </span>
                  <button
                    type="button"
                    onClick={() => openCourtDoor(court.id)}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Abrir Puerta
                  </button>
                </div>
              </div>

              {/* Acciones CRUD */}
              <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => openEditModal(court)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Editar Parámetros</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingCourtId(court.id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                  title="Desactivar o Eliminar Pista"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. MODAL DE CREACIÓN / EDICIÓN DE PISTA */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black">
                  {editingCourt ? `Editar ${editingCourt.name}` : 'Crear Nueva Pista'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Pista *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Pista 9 (Central Panorámica)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                {formErrors.name && <span className="text-rose-500 text-[11px] mt-0.5 block">{formErrors.name}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Pista
                  </label>
                  <select
                    value={formData.courtType}
                    onChange={(e) => setFormData({ ...formData, courtType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="indoor">Indoor (Cubierta)</option>
                    <option value="outdoor">Outdoor (Exterior)</option>
                    <option value="covered">Semi-Cubierta</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tarifa Horaria (€/hora) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  {formErrors.hourlyRate && <span className="text-rose-500 text-[11px] mt-0.5 block">{formErrors.hourlyRate}</span>}
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  {formErrors.surface && <span className="text-rose-500 text-[11px] mt-0.5 block">{formErrors.surface}</span>}
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Fotografía Oficial
                </label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Checkboxes de características */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPanoramic}
                    onChange={(e) => setFormData({ ...formData, isPanoramic: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Estructura Panorámica Pro (Sin postes intermedios en fondos)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasLights}
                    onChange={(e) => setFormData({ ...formData, hasLights: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Focos LED y Relé Shelly IoT conectado
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCourt ? 'Guardar Cambios' : 'Crear Pista'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {deletingCourtId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">¿Desactivar Pista?</h3>
                <p className="text-xs text-slate-500">Se retirará del cuadrante de reservas.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              La pista dejará de aparecer en la cuadrícula de reservas para socios y recepción. Las reservas pasadas se conservarán para el histórico contable.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCourtId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => confirmDeleteCourt(deletingCourtId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm"
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
