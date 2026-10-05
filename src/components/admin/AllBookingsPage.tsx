import React, { useState, useMemo } from 'react';
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
  const { bookings, courts, setAdminTab, triggerDemoToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'canceled'>('all');
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedDrawerBooking, setSelectedDrawerBooking] = useState<ReservationDrawerData | null>(null);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search by player name, court, or PIN
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        b.creatorName.toLowerCase().includes(term) ||
        b.courtName.toLowerCase().includes(term) ||
        (b.accessPin && b.accessPin.toLowerCase().includes(term));

      // Filter by status
      let matchesStatus = true;
      if (statusFilter === 'confirmed') {
        matchesStatus = b.status === 'confirmed' || b.status === 'completed';
      } else if (statusFilter === 'pending') {
        matchesStatus = b.status === 'pending' || b.paymentStatus === 'pending' || b.paymentStatus === 'partially_paid';
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
      {/* HEADER DE PÁGINA (ESTÁNDAR CANÓNICO) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBackToQuadrant && (
              <button
                type="button"
                onClick={onBackToQuadrant}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition mr-1"
                title="Volver al cuadrante"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Todas las Reservas
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Histórico completo, buscador en tiempo real y gestión operativa del club
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onBackToQuadrant && (
            <button
              type="button"
              onClick={onBackToQuadrant}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Ver Cuadrante</span>
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
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>
        </div>
      </div>

      {/* TARJETAS RESUMEN KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Total Registradas
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            {totalCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Confirmadas
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {confirmedCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Pendiente TPV
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Facturación Total
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {totalAmountSum.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
        </div>
      </div>

      {/* BÚSQUEDA Y FILTROS */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Buscador en tiempo real por nombre de jugador, pista o PIN */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por titular, pista o PIN de acceso..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Selector de Pista */}
          <div className="flex items-center gap-2">
            <select
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition font-medium"
            >
              <option value="all">Todas las Pistas</option>
              {courts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>

            {/* Selector de Fecha */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition font-medium"
              title="Filtrar por fecha específica"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="text-[11px] text-slate-500 hover:text-emerald-500 font-bold"
              >
                Todas
              </button>
            )}
          </div>
        </div>

        {/* Selectores de Estado: Confirmada, Pendiente TPV, Cancelada */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Estado:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
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
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs flex items-center gap-1.5 ${
              statusFilter === 'confirmed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-500/20'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmadas ({confirmedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-500/20'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pendiente TPV ({pendingCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('canceled')}
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs flex items-center gap-1.5 ${
              statusFilter === 'canceled'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-500/20'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Canceladas ({bookings.filter((b) => b.status === 'canceled').length})</span>
          </button>
        </div>
      </div>

      {/* LISTADO COMPLETO DE RESERVAS */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Listado de Reservas ({filteredBookings.length})
          </h2>
          <span className="text-[11px] text-slate-400">
            Haz clic en cualquier tarjeta para abrir el Drawer operativo
          </span>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-8 text-center shadow-sm">
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
      </section>

      {/* Bottom Sheet Drawer de Detalle Operativo */}
      <ReservationDrawer
        isOpen={!!selectedDrawerBooking}
        reservation={selectedDrawerBooking}
        onClose={() => setSelectedDrawerBooking(null)}
      />
    </div>
  );
};

export default AllBookingsPage;
