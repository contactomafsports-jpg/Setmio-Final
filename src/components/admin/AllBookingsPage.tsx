import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types/database';
import { BookingListItem, BookingListItemData } from './BookingListItem';
import { ReservationDrawer, ReservationDrawerData } from './ReservationDrawer';
import {
  Calendar,
  Search,
  Filter,
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface AllBookingsPageProps {
  onBackToQuadrant?: () => void;
  onOpenNewBookingModal?: () => void;
}

export const AllBookingsPage: React.FC<AllBookingsPageProps> = ({
  onBackToQuadrant,
  onOpenNewBookingModal,
}) => {
  const { bookings, courts, setAdminTab, triggerDemoToast, navigateToPlayerProfile, t } = useApp();

  // Scroll to top on enter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'canceled'>('all');
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedDrawerBooking, setSelectedDrawerBooking] = useState<ReservationDrawerData | null>(null);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search by player name, court, PIN or date string
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        b.creatorName.toLowerCase().includes(term) ||
        b.courtName.toLowerCase().includes(term) ||
        (b.accessPin && b.accessPin.toLowerCase().includes(term)) ||
        b.startTime.toLowerCase().includes(term);

      // Filter by payment status
      let matchesStatus = true;
      if (statusFilter === 'confirmed') {
        matchesStatus = b.paymentStatus === 'paid' || (b.status === 'confirmed' && b.paymentStatus !== 'pending' && b.paymentStatus !== 'partially_paid');
      } else if (statusFilter === 'pending') {
        matchesStatus = b.paymentStatus === 'pending' || b.paymentStatus === 'partially_paid' || b.status === 'pending';
      } else if (statusFilter === 'canceled') {
        matchesStatus = b.status === 'canceled';
      }

      // Filter by court
      const matchesCourt = courtFilter === 'all' || b.courtId === courtFilter;

      // Filter by date
      const matchesDate = !dateFilter || b.startTime.startsWith(dateFilter);

      return matchesSearch && matchesStatus && matchesCourt && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, courtFilter, dateFilter]);

  // Convert Booking to Drawer & ListItem data
  const mapBookingToItemData = (b: Booking): BookingListItemData => {
    const timeSlot = `${b.startTime.split('T')[1]?.slice(0, 5) || ''} - ${b.endTime.split('T')[1]?.slice(0, 5) || ''}`;
    let statusText: string = b.status === 'canceled' ? 'Cancelada' : 'Confirmada';
    if (b.paymentStatus === 'pending' || b.paymentStatus === 'partially_paid') {
      statusText = 'Pendiente TPV';
    } else if (b.paymentStatus === 'paid') {
      statusText = 'Pagado';
    }

    return {
      id: b.id,
      courtId: b.courtId,
      courtName: b.courtName,
      startTime: b.startTime,
      endTime: b.endTime,
      timeSlot,
      creatorName: b.creatorName,
      totalPrice: b.totalPrice,
      status: statusText,
      paymentStatus: b.paymentStatus,
      accessPin: b.accessPin || '4821#',
      category: b.isSplitPayment ? 'match' : 'private',
      title: b.isSplitPayment ? 'Pádel Abierto 4.0' : `Reserva ${b.courtName}`,
      sport: 'Pádel Indoor',
      participants: b.participants?.map((p) => ({
        name: p.name,
        paid: p.paid,
        amount: p.amount,
        statusText: p.paid ? 'Pagado' : 'Pendiente TPV',
      })),
      notes: b.notes,
    };
  };

  const handleOpenBookingDetail = (b: Booking) => {
    const itemData = mapBookingToItemData(b);
    setSelectedDrawerBooking({
      ...itemData,
      courtType: 'Indoor Cristal Pro',
      creatorPhone: '+34 611 22 33 44',
      creatorMemberNum: 'Socio #SM-408',
      lightsStatus: 'auto',
      doorStatus: 'auto',
    });
  };

  // KPIs
  const totalCount = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').length;
  const pendingCount = bookings.filter((b) => b.paymentStatus === 'pending' || b.status === 'pending').length;
  const totalAmountSum = bookings
    .filter((b) => b.status !== 'canceled')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto">
      {/* HEADER DE PÁGINA (ESTÁNDAR CANÓNICO UNIFICADO) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('bookings.all_eyebrow', 'Auditoría & Archivo de Reservas')}</span>
          </div>
          <div className="flex items-center gap-2">
            {onBackToQuadrant && (
              <button
                type="button"
                onClick={onBackToQuadrant}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition mr-0.5 cursor-pointer"
                title={t('allBookings.backBtn', 'Ir a Cuadrante de Reservas')}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
              {t('allBookings.title', 'Todas las Reservas')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {t('allBookings.subtitle', 'Histórico completo, auditoría de pagos y gestión operativa del club')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {onBackToQuadrant && (
            <button
              type="button"
              onClick={onBackToQuadrant}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs border border-slate-200 dark:border-slate-700"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('allBookings.backBtn', 'Ir a Cuadrante')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onOpenNewBookingModal) {
                onOpenNewBookingModal();
              } else {
                triggerDemoToast('Nueva Reserva', 'Abriendo formulario de creación de reserva.', 'info');
              }
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('bookings.newBtn', 'Nueva Reserva')}</span>
          </button>
        </div>
      </div>

      {/* TARJETAS RESUMEN KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
            Total Registradas
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            {totalCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
            Confirmadas
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {confirmedCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
            Pendiente TPV
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
            Facturación Total
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {totalAmountSum.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
        </div>
      </div>

      {/* CONTENEDOR UNIFICADO: BUSCADOR, FILTROS Y LISTA DE RESERVAS */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* Fila de Filtros y Buscador */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Buscador en tiempo real por nombre de jugador, pista o PIN */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por titular, pista o PIN de acceso..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Selector de Pista y Selector de Fecha Móvil (Flex-wrap anti-overflow) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <select
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition font-medium min-w-[130px]"
            >
              <option value="all">Todas las Pistas</option>
              {courts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>

            {/* Selector de Fecha Responsivo Móvil */}
            <div className="flex items-center gap-1 flex-1 sm:flex-none min-w-0">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition font-medium max-w-[145px]"
                title="Filtrar por fecha específica"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter('')}
                  className="text-[11px] text-slate-500 hover:text-emerald-500 font-bold px-1.5 py-1 rounded cursor-pointer shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Selectores de Estado: Cuadrícula fija sin scroll horizontal y centrada */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
            Filtrar por Estado
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`py-2 px-2.5 rounded-xl font-bold transition text-xs flex items-center justify-center text-center cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todas ({bookings.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('confirmed')}
              className={`py-2 px-2.5 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 text-center cursor-pointer ${
                statusFilter === 'confirmed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Pagadas ({confirmedCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`py-2 px-2.5 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 text-center cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-500/20'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Pendientes ({pendingCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('canceled')}
              className={`py-2 px-2.5 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 text-center cursor-pointer ${
                statusFilter === 'canceled'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-500/20'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Canceladas ({bookings.filter((b) => b.status === 'canceled').length})</span>
            </button>
          </div>
        </div>

        {/* LISTADO DE RESERVAS INTEGRADO EN EL MISMO CONTENEDOR */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'Reserva' : 'Reservas'} encontradas
            </span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                No se encontraron reservas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No hay reservas que coincidan con los criterios de búsqueda o filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredBookings.map((b) => {
                const itemData = mapBookingToItemData(b);
                return (
                  <BookingListItem
                    key={b.id}
                    booking={itemData}
                    onClick={() => handleOpenBookingDetail(b)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet Drawer de Detalle Operativo */}
      <ReservationDrawer
        isOpen={!!selectedDrawerBooking}
        reservation={selectedDrawerBooking}
        onClose={() => setSelectedDrawerBooking(null)}
        onOpenPlayerProfile={(playerName) => {
          setSelectedDrawerBooking(null);
          navigateToPlayerProfile(playerName);
        }}
      />
    </div>
  );
};

export default AllBookingsPage;
