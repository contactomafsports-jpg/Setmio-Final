import React, { useEffect, useRef, useState } from 'react';
import { Building2, CheckCircle2, ChevronDown, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface AdminSectionHeaderProps {
  title: string;
  titleBadge?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  onVenueSelect?: (venueId: string) => void;
}

export const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({
  title,
  titleBadge,
  leftSlot,
  rightSlot,
  onVenueSelect,
}) => {
  const {
    currentTenant,
    venues,
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    isClubOpen,
    toggleClubOpenState,
  } = useApp();

  const [isVenueSelectorOpen, setIsVenueSelectorOpen] = useState(false);
  const venueSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVenueSelectorOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        venueSelectorRef.current &&
        !venueSelectorRef.current.contains(event.target as Node)
      ) {
        setIsVenueSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVenueSelectorOpen]);

  const handleSelectVenue = (venueId: string) => {
    setSelectedVenueId(venueId);
    onVenueSelect?.(venueId);
    setIsVenueSelectorOpen(false);
  };

  return (
    <section className="space-y-3" data-purpose="header-section">
      {/* Cabecera superior unificada: Eyebrow sede/club + Título H1 + Acción derecha */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {leftSlot && <div className="shrink-0">{leftSlot}</div>}
          <div className="min-w-0 flex-1">
            <span className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 tracking-wide block mb-0.5 truncate">
              {currentTenant?.name || 'Centro de Pádel San Mateo'}
            </span>
            <div className="flex items-center gap-2.5 min-w-0">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#0B1A2D] dark:text-white tracking-tight leading-tight truncate">
                {title}
              </h1>
              {titleBadge && <div className="shrink-0">{titleBadge}</div>}
            </div>
          </div>
        </div>

        {rightSlot && (
          <div className="shrink-0 flex items-center gap-2">{rightSlot}</div>
        )}
      </div>

      {/* Selector de Sede Compacto y Uniforme */}
      <div className="relative" ref={venueSelectorRef}>
        <div className="flex items-center justify-between gap-2.5 sm:gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {/* Selector de Sede */}
          <button
            type="button"
            onClick={() => setIsVenueSelectorOpen((prev) => !prev)}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0 flex-1 text-left"
            title="Cambiar sede activa o ver red consolidada"
            aria-expanded={isVenueSelectorOpen}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-100 dark:border-[#1A314D] flex items-center justify-center text-[#0B1A2D] dark:text-slate-200 shrink-0">
              <Building2 className="w-4 h-4 text-[#0B1A2D] dark:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm sm:text-[15px] font-bold text-[#0B1A2D] dark:text-white truncate whitespace-nowrap">
                  {isConsolidatedView
                    ? 'Todas las Sedes'
                    : selectedVenue?.shortName || selectedVenue?.name || 'Sede'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 group-hover:text-[#0B1A2D] dark:text-slate-400 dark:group-hover:text-white transition-transform shrink-0 ${
                    isVenueSelectorOpen ? 'rotate-180 text-[#0B1A2D] dark:text-white' : ''
                  }`}
                />
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 block truncate whitespace-nowrap">
                {venues.length > 1 ? `${venues.length} sedes conectadas` : 'Sede oficial'}
              </span>
            </div>
          </button>

          {/* Badge Dinámico de Apertura / Resumen Multisede */}
          <button
            type="button"
            onClick={
              isConsolidatedView
                ? () => setIsVenueSelectorOpen((prev) => !prev)
                : toggleClubOpenState
            }
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#F0FCCF] dark:bg-[#B7F229]/20 border border-[#B7F229]/50 transition-all cursor-pointer shrink-0 select-none whitespace-nowrap"
            title={
              isConsolidatedView
                ? `Red multisede consolidada (${venues.length} sedes operativas)`
                : 'Haz clic para conmutar estado de apertura de la sede'
            }
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isConsolidatedView || isClubOpen
                  ? 'bg-[#82b805] dark:bg-[#B7F229]'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-[11px] sm:text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] whitespace-nowrap">
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
          <div className="absolute top-full left-0 right-0 mt-1.5 z-30 p-2 bg-white dark:bg-[#0E2239] rounded-2xl border border-slate-200 dark:border-[#1A314D] shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 py-1">
              Red Deportiva · Seleccionar Sede
            </div>

            {venues.length > 1 && (
              <button
                type="button"
                onClick={() => handleSelectVenue('all')}
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
                {isConsolidatedView && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805] shrink-0" />
                )}
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
                    onClick={() => handleSelectVenue(venue.id)}
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
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805] shrink-0" />
                    )}
                  </button>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
};
