import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/database';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  Shield,
  Plus,
  Search,
  CheckCircle2,
  Building2,
  GraduationCap,
  Activity,
  ChevronRight,
  ArrowLeft,
  Edit3,
  Trash2,
  X,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { AdminSectionHeader } from './AdminSectionHeader';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roleTitle: string;
  venueId: string;
  venueName: string;
  status: 'active' | 'break' | 'vacation' | 'off';
  avatarUrl: string;
  hourlyRate?: number;
  contractType: 'indefinido' | 'temporal' | 'autonomo' | 'parcial';
  weeklyHours: number;
  assignedGroupIds: string[];
  certifications?: string;
}

export interface StaffShift {
  id: string;
  staffId: string;
  staffName: string;
  roleTitle: string;
  venueId: string;
  venueName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  shiftType: 'recepcion' | 'clases_pista' | 'coordinacion' | 'mantenimiento' | 'cierre';
  status: 'active' | 'scheduled' | 'completed';
  notes?: string;
}

const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Mateo Varela',
    email: 'mateo.varela@padelsanmateo.es',
    phone: '+34 611 44 55 66',
    role: 'HEAD_COACH' as any,
    roleTitle: 'Director Deportivo & Head Coach',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Narón (Central)',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 42.0,
    contractType: 'indefinido',
    weeklyHours: 38,
    assignedGroupIds: ['group-1'],
    certifications: 'Entrenador Nacional Nivel 2 FEP / Master Pro',
  },
  {
    id: 'staff-2',
    name: 'Laura Senra',
    email: 'laura.senra@padelsanmateo.es',
    phone: '+34 622 55 66 77',
    role: 'COACH',
    roleTitle: 'Entrenadora de Competición & Menores',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Narón (Central)',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 38.0,
    contractType: 'indefinido',
    weeklyHours: 32,
    assignedGroupIds: ['group-2'],
    certifications: 'Monitora Nacional FEP / Grado CCAFYD',
  },
  {
    id: 'staff-3',
    name: 'David Freire',
    email: 'david.freire@padelsanmateo.es',
    phone: '+34 633 66 77 88',
    role: 'COACH',
    roleTitle: 'Instructor de Iniciación y Adultos',
    venueId: 'venue-coruna',
    venueName: 'Sede A Coruña (Matogrande)',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 32.0,
    contractType: 'autonomo',
    weeklyHours: 25,
    assignedGroupIds: ['group-3'],
    certifications: 'Monitor Autonómico FGP',
  },
  {
    id: 'staff-4',
    name: 'Marcos Soto',
    email: 'recepcion@padelsanmateo.es',
    phone: '+34 644 77 88 99',
    role: 'RECEPTION',
    roleTitle: 'Responsable Recepción & Caja TPV',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Narón (Central)',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 14.5,
    contractType: 'indefinido',
    weeklyHours: 40,
    assignedGroupIds: [],
    certifications: 'Gestión Deportiva y Atención al Cliente',
  },
  {
    id: 'staff-5',
    name: 'Carmen Lago',
    email: 'tienda@padelsanmateo.es',
    phone: '+34 655 88 99 00',
    role: 'STORE_MANAGER',
    roleTitle: 'Gestora Tienda Pro & Logística',
    venueId: 'venue-santiago',
    venueName: 'Sede Santiago',
    status: 'break',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 15.0,
    contractType: 'indefinido',
    weeklyHours: 35,
    assignedGroupIds: [],
    certifications: 'Retail & Merchandising Deportivo',
  },
  {
    id: 'staff-6',
    name: 'Gonzalo Barreiro',
    email: 'gonzalo.barreiro@setmio.es',
    phone: '+34 666 99 00 11',
    role: 'COACH',
    roleTitle: 'Profesor y Coordinador Sede Vigo',
    venueId: 'venue-vigo',
    venueName: 'Sede Vigo (Rías Baixas)',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 35.0,
    contractType: 'indefinido',
    weeklyHours: 30,
    assignedGroupIds: [],
    certifications: 'Nivel 1 FEP / Especialista Táctica',
  },
];

const INITIAL_SHIFTS: StaffShift[] = [
  {
    id: 'shift-1',
    staffId: 'staff-4',
    staffName: 'Marcos Soto',
    roleTitle: 'Recepción & Caja TPV',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Narón (Central)',
    date: '2026-09-30',
    startTime: '08:30',
    endTime: '15:30',
    shiftType: 'recepcion',
    status: 'completed',
    notes: 'Apertura de centro, caja de inicio 150€ y test domótico.',
  },
  {
    id: 'shift-2',
    staffId: 'staff-1',
    staffName: 'Mateo Varela',
    roleTitle: 'Head Coach',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Narón (Central)',
    date: '2026-09-30',
    startTime: '10:00',
    endTime: '14:00',
    shiftType: 'clases_pista',
    status: 'completed',
    notes: '2 clases particulares y 1 grupo de perfeccionamiento.',
  },
  {
    id: 'shift-3',
    staffId: 'staff-2',
    staffName: 'Laura Senra',
    roleTitle: 'Entrenadora Competición',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Narón (Central)',
    date: '2026-09-30',
    startTime: '16:00',
    endTime: '21:30',
    shiftType: 'clases_pista',
    status: 'active',
    notes: 'Entrenamiento Equipo Femenino B y Escuela Menores.',
  },
  {
    id: 'shift-4',
    staffId: 'staff-3',
    staffName: 'David Freire',
    roleTitle: 'Instructor Adultos',
    venueId: 'venue-coruna',
    venueName: 'Sede A Coruña',
    date: '2026-09-30',
    startTime: '17:00',
    endTime: '21:30',
    shiftType: 'clases_pista',
    status: 'active',
    notes: 'Iniciación Adultos en Pista 6 y 7.',
  },
  {
    id: 'shift-5',
    staffId: 'staff-6',
    staffName: 'Gonzalo Barreiro',
    roleTitle: 'Coordinador Vigo',
    venueId: 'venue-vigo',
    venueName: 'Sede Vigo',
    date: '2026-09-30',
    startTime: '16:30',
    endTime: '22:00',
    shiftType: 'coordinacion',
    status: 'active',
    notes: 'Coordinación reservas y partidos abiertos nocturnos.',
  },
  {
    id: 'shift-6',
    staffId: 'staff-4',
    staffName: 'Marcos Soto',
    roleTitle: 'Recepción & Cierre',
    venueId: 'venue-san-mateo',
    venueName: 'Sede Narón (Central)',
    date: '2026-10-01',
    startTime: '15:30',
    endTime: '23:00',
    shiftType: 'cierre',
    status: 'scheduled',
    notes: 'Cierre de pistas, arqueo de TPV y apagado domótico.',
  },
];

export const AdminStaff: React.FC = () => {
  const {
    currentTenant,
    venues,
    selectedVenueId,
    selectedVenue,
    setSelectedVenueId,
    isConsolidatedView,
    isClubOpen,
    toggleClubOpenState,
    isMultiVenue,
    academyGroups,
    auditLogs,
    addAuditLog,
    triggerDemoToast,
    setAdminTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'directorio' | 'turnos' | 'asignaciones' | 'auditoria'>('directorio');
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [shifts, setShifts] = useState<StaffShift[]>(INITIAL_SHIFTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Vista de detalle de segundo nivel para un empleado
  const [selectedStaffDetailId, setSelectedStaffDetailId] = useState<string | null>(null);

  // Menú contextual '+'
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };
    if (isActionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionMenuOpen]);

  const realVenues = (venues || []).filter((v) => v.id !== 'all');
  const isMultiVenueActive = Boolean(isMultiVenue) && realVenues.length > 1;
  const effectiveVenueId =
    selectedVenueId && selectedVenueId !== 'all'
      ? selectedVenueId
      : realVenues[0]?.id || 'venue-san-mateo';

  // Modal Nuevo Empleado / Profesor
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('+34 600 00 00 00');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('COACH');
  const [newStaffRoleTitle, setNewStaffRoleTitle] = useState('Profesor de Pádel');
  const [newStaffVenueId, setNewStaffVenueId] = useState(realVenues[0]?.id || 'venue-san-mateo');
  const [newStaffHourlyRate, setNewStaffHourlyRate] = useState('30');
  const [newStaffContract, setNewStaffContract] = useState<'indefinido' | 'temporal' | 'autonomo' | 'parcial'>('indefinido');
  const [newStaffWeeklyHours, setNewStaffWeeklyHours] = useState('35');

  // Modal Nuevo / Editar Turno
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [shiftStaffId, setShiftStaffId] = useState(staffList[0]?.id || 'staff-1');
  const [shiftDate, setShiftDate] = useState('2026-09-30');
  const [shiftStartTime, setShiftStartTime] = useState('15:30');
  const [shiftEndTime, setShiftEndTime] = useState('22:00');
  const [shiftType, setShiftType] = useState<StaffShift['shiftType']>('clases_pista');
  const [shiftStatus, setShiftStatus] = useState<StaffShift['status']>('scheduled');
  const [shiftVenueId, setShiftVenueId] = useState(realVenues[0]?.id || 'venue-san-mateo');
  const [shiftNotes, setShiftNotes] = useState('');

  // Confirmación de eliminación de turno
  const [shiftToDelete, setShiftToDelete] = useState<StaffShift | null>(null);

  // Modal Asignar Clases a Profesor
  const [selectedStaffForAssignment, setSelectedStaffForAssignment] = useState<StaffMember | null>(null);
  const [assignedGroupsTemp, setAssignedGroupsTemp] = useState<string[]>([]);

  // Filtros Auditoría
  const [auditActorFilter] = useState('all');
  const [auditActionFilter, setAuditActionFilter] = useState('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // Filtro de empleado para turnos
  const [selectedCoachForCalendar, setSelectedCoachForCalendar] = useState<string>('all');

  // Empleado seleccionado para vista de detalle
  const selectedStaffDetail = useMemo(
    () => staffList.find((s) => s.id === selectedStaffDetailId) || null,
    [staffList, selectedStaffDetailId]
  );

  // Filtrado de Personal sincronizado con selector estándar de sede
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchesVenue =
        !isMultiVenueActive || isConsolidatedView || selectedVenueId === 'all' || s.venueId === selectedVenueId;
      const matchesRole = roleFilter === 'all' || s.role === roleFilter;
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.roleTitle.toLowerCase().includes(term);
      return matchesVenue && matchesRole && matchesSearch;
    });
  }, [staffList, isMultiVenueActive, isConsolidatedView, selectedVenueId, roleFilter, searchQuery]);

  // Filtrado de Turnos sincronizado con selector estándar de sede
  const filteredShifts = useMemo(() => {
    return shifts.filter((s) => {
      const matchesVenue =
        !isMultiVenueActive || isConsolidatedView || selectedVenueId === 'all' || s.venueId === selectedVenueId;
      const matchesStaff = selectedCoachForCalendar === 'all' || s.staffId === selectedCoachForCalendar;
      return matchesVenue && matchesStaff;
    });
  }, [shifts, isMultiVenueActive, isConsolidatedView, selectedVenueId, selectedCoachForCalendar]);

  // Filtrado de Logs de Auditoría
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const term = auditSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !term ||
        log.actor.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.target.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term);
      const matchesActor = auditActorFilter === 'all' || log.actor === auditActorFilter;
      const matchesAction =
        auditActionFilter === 'all' ||
        log.action.toLowerCase().includes(auditActionFilter.toLowerCase());
      return matchesSearch && matchesActor && matchesAction;
    });
  }, [auditLogs, auditSearchQuery, auditActorFilter, auditActionFilter]);

  // KPIs
  const activeStaffCount = staffList.filter((s) => s.status === 'active').length;
  const coachesCount = staffList.filter((s) => s.role === 'COACH' || s.role === ('HEAD_COACH' as any)).length;
  const todayShiftsCount = shifts.filter((s) => s.date === '2026-09-30').length;
  const totalAuditActionsCount = auditLogs.length;

  // Handlers
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVenue = venues.find((v) => v.id === newStaffVenueId) || venues[1] || venues[0];
    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffName.trim() || 'Nuevo Empleado',
      email: newStaffEmail.trim() || `empleado.${Date.now()}@setmio.com`,
      phone: newStaffPhone.trim() || '+34 600 000 000',
      role: newStaffRole,
      roleTitle: newStaffRoleTitle.trim() || 'Personal Club',
      venueId: targetVenue.id,
      venueName: targetVenue.shortName || targetVenue.name,
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      hourlyRate: parseFloat(newStaffHourlyRate) || 20,
      contractType: newStaffContract,
      weeklyHours: parseInt(newStaffWeeklyHours, 10) || 35,
      assignedGroupIds: [],
    };

    setStaffList((prev) => [newMember, ...prev]);

    // Registrar en auditoría
    addAuditLog({
      action: 'Alta de Empleado / Profesor',
      target: newMember.name,
      details: `Rol asignado: ${newMember.roleTitle} en ${newMember.venueName} · Horas: ${newMember.weeklyHours}h/sem.`,
    });

    triggerDemoToast(
      'Empleado Registrado con Éxito',
      `${newMember.name} ha sido dado de alta como ${newMember.roleTitle}.`,
      'success'
    );

    setIsNewStaffModalOpen(false);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  const handleOpenCreateShiftModal = (preselectedStaffId?: string) => {
    setEditingShiftId(null);
    const targetStaffId = preselectedStaffId || staffList[0]?.id || 'staff-1';
    const targetStaff = staffList.find((s) => s.id === targetStaffId);
    setShiftStaffId(targetStaffId);
    setShiftVenueId(targetStaff?.venueId || effectiveVenueId);
    setShiftDate('2026-09-30');
    setShiftStartTime('15:30');
    setShiftEndTime('22:00');
    setShiftType('clases_pista');
    setShiftStatus('scheduled');
    setShiftNotes('');
    setIsShiftModalOpen(true);
  };

  const handleOpenEditShiftModal = (shift: StaffShift) => {
    setEditingShiftId(shift.id);
    setShiftStaffId(shift.staffId);
    setShiftVenueId(shift.venueId);
    setShiftDate(shift.date);
    setShiftStartTime(shift.startTime);
    setShiftEndTime(shift.endTime);
    setShiftType(shift.shiftType);
    setShiftStatus(shift.status);
    setShiftNotes(shift.notes || '');
    setIsShiftModalOpen(true);
  };

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = staffList.find((s) => s.id === shiftStaffId) || staffList[0];
    const targetVenue = venues.find((v) => v.id === shiftVenueId) || realVenues[0] || venues[0];

    if (editingShiftId) {
      setShifts((prev) =>
        prev.map((sh) =>
          sh.id === editingShiftId
            ? {
                ...sh,
                staffId: staff.id,
                staffName: staff.name,
                roleTitle: staff.roleTitle,
                venueId: targetVenue.id,
                venueName: targetVenue.shortName || targetVenue.name,
                date: shiftDate,
                startTime: shiftStartTime,
                endTime: shiftEndTime,
                shiftType,
                status: shiftStatus,
                notes: shiftNotes.trim() || undefined,
              }
            : sh
        )
      );

      addAuditLog({
        action: 'Edición de Turno Laboral',
        target: `${staff.name} (${shiftDate})`,
        details: `Turno actualizado de ${shiftStartTime} a ${shiftEndTime} en ${targetVenue.shortName || targetVenue.name}.`,
      });

      triggerDemoToast(
        'Turno Actualizado',
        `Cambios guardados para el turno de ${staff.name} (${shiftStartTime} - ${shiftEndTime}).`,
        'success'
      );
    } else {
      const newShift: StaffShift = {
        id: `shift-${Date.now()}`,
        staffId: staff.id,
        staffName: staff.name,
        roleTitle: staff.roleTitle,
        venueId: targetVenue.id,
        venueName: targetVenue.shortName || targetVenue.name,
        date: shiftDate,
        startTime: shiftStartTime,
        endTime: shiftEndTime,
        shiftType,
        status: shiftStatus,
        notes: shiftNotes.trim() || undefined,
      };

      setShifts((prev) => [newShift, ...prev]);

      addAuditLog({
        action: 'Creación de Turno Laboral',
        target: `${staff.name} (${shiftDate})`,
        details: `Turno de ${shiftStartTime} a ${shiftEndTime} en ${targetVenue.shortName || targetVenue.name} · Función: ${shiftType}.`,
      });

      triggerDemoToast(
        'Turno Configurado',
        `Turno asignado a ${staff.name} para el ${shiftDate} (${shiftStartTime} - ${shiftEndTime}).`,
        'success'
      );
    }

    setIsShiftModalOpen(false);
    setEditingShiftId(null);
    setShiftNotes('');
  };

  const handleConfirmDeleteShift = () => {
    if (!shiftToDelete) return;
    setShifts((prev) => prev.filter((sh) => sh.id !== shiftToDelete.id));

    addAuditLog({
      action: 'Eliminación de Turno Laboral',
      target: `${shiftToDelete.staffName} (${shiftToDelete.date})`,
      details: `Turno eliminado (${shiftToDelete.startTime} - ${shiftToDelete.endTime}) en ${shiftToDelete.venueName}.`,
    });

    triggerDemoToast(
      'Turno Eliminado',
      `Se ha eliminado el turno de ${shiftToDelete.staffName} del ${shiftToDelete.date}.`,
      'info'
    );
    setShiftToDelete(null);
  };

  const handleToggleStaffStatus = (staff: StaffMember, nextStatus: StaffMember['status']) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, status: nextStatus } : s))
    );
    const statusLabel = nextStatus === 'active' ? 'En Turno' : nextStatus === 'break' ? 'Descanso' : 'Fuera';
    addAuditLog({
      action: 'Cambio de Estado de Personal',
      target: staff.name,
      details: `Estado actualizado a "${statusLabel}".`,
    });
    triggerDemoToast('Estado Actualizado', `${staff.name} ahora figura como "${statusLabel}".`, 'success');
  };

  const handleOpenAssignModal = (staff: StaffMember) => {
    setSelectedStaffForAssignment(staff);
    setAssignedGroupsTemp(staff.assignedGroupIds || []);
  };

  const handleSaveAssignments = () => {
    if (!selectedStaffForAssignment) return;
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === selectedStaffForAssignment.id
          ? { ...s, assignedGroupIds: assignedGroupsTemp }
          : s
      )
    );

    addAuditLog({
      action: 'Reasignación de Grupos / Clases',
      target: selectedStaffForAssignment.name,
      details: `Se han vinculado ${assignedGroupsTemp.length} grupos de academia a su perfil docente.`,
    });

    triggerDemoToast(
      'Grupos Asignados',
      `Se han actualizado los grupos y clases asignados a ${selectedStaffForAssignment.name}.`,
      'success'
    );

    setSelectedStaffForAssignment(null);
  };

  const contractLabels: Record<StaffMember['contractType'], string> = {
    indefinido: 'Indefinido',
    temporal: 'Temporal',
    autonomo: 'Autónomo',
    parcial: 'Tiempo Parcial',
  };

  const shiftTypeLabels: Record<StaffShift['shiftType'], string> = {
    recepcion: 'Recepción & Caja',
    clases_pista: 'Clases en Pista',
    coordinacion: 'Coordinación',
    mantenimiento: 'Mantenimiento',
    cierre: 'Cierre & Domótica',
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 sm:pb-16 space-y-5 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased">
      {/* ======================================================================
          VISTA DE DETALLE DE SEGUNDO NIVEL (EMPLEADO SELECCIONADO)
          ====================================================================== */}
      {selectedStaffDetail ? (
        (() => {
          const detailGroups = academyGroups.filter(
            (g) => selectedStaffDetail.assignedGroupIds?.includes(g.id) || g.coachName === selectedStaffDetail.name
          );
          const detailShifts = shifts.filter((sh) => sh.staffId === selectedStaffDetail.id);

          return (
            <div className="space-y-6 sm:space-y-7 mb-8 animate-in fade-in duration-150">
              {/* Barra superior de retorno y acciones */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStaffDetailId(null)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs sm:text-sm font-bold text-[#0B1A2D] dark:text-white hover:bg-slate-50 dark:hover:bg-[#132A45] transition cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Personal</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenAssignModal(selectedStaffDetail)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-4 h-4 text-slate-500 dark:text-[#B7F229]" />
                    <span>Asignar Grupos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenCreateShiftModal(selectedStaffDetail.id)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Turno</span>
                  </button>
                </div>
              </div>

              {/* Cabecera del Perfil */}
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={selectedStaffDetail.avatarUrl}
                    alt={selectedStaffDetail.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-slate-200 dark:border-[#1A314D] shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0B1A2D] dark:text-white tracking-tight truncate">
                      {selectedStaffDetail.name}
                    </h1>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
                      {selectedStaffDetail.roleTitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {selectedStaffDetail.venueName}
                      </span>
                      {selectedStaffDetail.certifications && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-[#82b805] dark:text-[#B7F229]" />
                            {selectedStaffDetail.certifications}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selector rápido de estado operativo */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl self-start sm:self-center shrink-0">
                  {[
                    { id: 'active', label: 'En Turno' },
                    { id: 'break', label: 'Descanso' },
                    { id: 'off', label: 'Fuera' },
                  ].map((st) => {
                    const isCurrent = selectedStaffDetail.status === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleToggleStaffStatus(selectedStaffDetail, st.id as StaffMember['status'])}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                          isCurrent
                            ? st.id === 'active'
                              ? 'bg-[#B7F229] text-[#0B1A2D] shadow-xs'
                              : st.id === 'break'
                              ? 'bg-amber-400 text-[#0B1A2D] shadow-xs'
                              : 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detalles contractuales y grupos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* Información profesional y contacto */}
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
                  <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                    Información Profesional y Contacto
                  </h2>
                  <div className="divide-y divide-slate-100 dark:divide-[#1A314D] text-xs sm:text-sm">
                    <div className="py-3 flex items-center justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 shrink-0">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </span>
                      <span className="font-medium text-[#0B1A2D] dark:text-slate-200 truncate">
                        {selectedStaffDetail.email}
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 shrink-0">
                        <Phone className="w-3.5 h-3.5" /> Teléfono
                      </span>
                      <span className="font-mono tabular-nums font-medium text-[#0B1A2D] dark:text-slate-200">
                        {selectedStaffDetail.phone}
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400 shrink-0">Contrato</span>
                      <span className="font-bold text-[#0B1A2D] dark:text-white">
                        {contractLabels[selectedStaffDetail.contractType]}
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400 shrink-0">Jornada & Tarifa</span>
                      <span className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                        {selectedStaffDetail.weeklyHours}h/sem
                        {selectedStaffDetail.hourlyRate !== undefined && ` · ${selectedStaffDetail.hourlyRate.toFixed(0)} €/h`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grupos asignados */}
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                      Grupos de Escuela ({detailGroups.length})
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(selectedStaffDetail)}
                      className="text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:underline cursor-pointer"
                    >
                      Editar asignaciones
                    </button>
                  </div>

                  {detailGroups.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                      Sin grupos de academia asignados actualmente.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-[#1A314D]">
                      {detailGroups.map((g) => (
                        <div key={g.id} className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                          <div className="min-w-0">
                            <div className="font-bold text-[#0B1A2D] dark:text-white truncate">{g.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {g.schedule || 'Horario oficial'} · {g.currentStudents}/{g.maxStudents} alumnos
                            </div>
                          </div>
                          <span className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229] shrink-0">
                            {g.monthlyFee} €/mes
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Turnos asignados del empleado */}
              <div className="bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs mb-8">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                    Turnos Programados ({detailShifts.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleOpenCreateShiftModal(selectedStaffDetail.id)}
                    className="text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir turno</span>
                  </button>
                </div>

                {detailShifts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    Este miembro no tiene turnos programados todavía.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-[#1A314D] bg-slate-50/70 dark:bg-[#071220] text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          <th className="py-3.5 px-4">Fecha</th>
                          <th className="py-3.5 px-4">Horario</th>
                          <th className="py-3.5 px-4">Sede</th>
                          <th className="py-3.5 px-4">Función</th>
                          <th className="py-3.5 px-4">Estado</th>
                          <th className="py-3.5 px-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-[#1A314D]">
                        {detailShifts.map((shift) => (
                          <tr key={shift.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition">
                            <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {shift.date}
                            </td>
                            <td className="py-3.5 px-4 font-mono tabular-nums font-extrabold text-[#0B1A2D] dark:text-[#B7F229] whitespace-nowrap">
                              {shift.startTime} - {shift.endTime}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {shift.venueName}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-300 text-[10px] font-bold">
                                {shiftTypeLabels[shift.shiftType]}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
                                  shift.status === 'active'
                                    ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229]'
                                    : shift.status === 'completed'
                                    ? 'bg-slate-100 dark:bg-[#071220] text-slate-600 dark:text-slate-400'
                                    : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                                }`}
                              >
                                {shift.status === 'active' ? 'En Curso' : shift.status === 'completed' ? 'Completado' : 'Programado'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditShiftModal(shift)}
                                  className="p-2 rounded-lg text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
                                  title="Editar turno"
                                  aria-label="Editar turno"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShiftToDelete(shift)}
                                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                  title="Eliminar turno"
                                  aria-label="Eliminar turno"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()
      ) : (
        <>
          {/* ======================================================================
              1. CABECERA LIMPIA CON BOTÓN DESPLEGABLE "+" Y SELECTOR DE SEDE UNIFICADO
              ====================================================================== */}
          <AdminSectionHeader
            title="Personal"
            rightSlot={
              <div className="relative shrink-0" ref={actionMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsActionMenuOpen((prev) => !prev)}
                  className="p-2 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95"
                  title="Añadir Personal o Nuevo Turno"
                  aria-label="Añadir Personal o Nuevo Turno"
                >
                  <Plus className="w-6 h-6 stroke-[2.2]" />
                </button>

                {isActionMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] shadow-xl py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsActionMenuOpen(false);
                        setIsNewStaffModalOpen(true);
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] hover:text-[#0B1A2D] dark:hover:text-[#B7F229] flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <span>Añadir Personal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsActionMenuOpen(false);
                        handleOpenCreateShiftModal();
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132A45] hover:text-[#0B1A2D] dark:hover:text-[#B7F229] flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <span>Nuevo Turno</span>
                    </button>
                  </div>
                )}
              </div>
            }
          />

          {/* ======================================================================
              2. KPIS DE PERSONAL Y AUDITORÍA
              ====================================================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                Plantilla Total
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight">
                {staffList.length}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#82b805] dark:text-[#B7F229] shrink-0" />
                <span>{activeStaffCount} activos hoy</span>
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                Profesores
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight">
                {coachesCount}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Docencia y competición
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                Turnos Hoy
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-white font-mono tabular-nums tracking-tight">
                {todayShiftsCount}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Cuadrante activo
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs flex flex-col justify-between gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                Auditoría
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2D] dark:text-[#B7F229] font-mono tabular-nums tracking-tight">
                {totalAuditActionsCount}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                <Activity className="w-3.5 h-3.5 text-[#82b805] dark:text-[#B7F229] shrink-0" />
                <span>Trazabilidad activa</span>
              </span>
            </div>
          </div>

          {/* ======================================================================
              3. NAVEGACIÓN POR PESTAÑAS DEL MÓDULO (DESLIZABLE TÁCTIL)
              ====================================================================== */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#071220] rounded-2xl border border-slate-200/80 dark:border-[#1A314D] overflow-x-auto no-scrollbar shadow-2xs touch-pan-x snap-x">
            <button
              type="button"
              onClick={() => setActiveTab('directorio')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 snap-start ${
                activeTab === 'directorio'
                  ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>Equipo ({filteredStaff.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('turnos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 snap-start ${
                activeTab === 'turnos'
                  ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Turnos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('asignaciones')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 snap-start ${
                activeTab === 'asignaciones'
                  ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span>Asignaciones</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('auditoria')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 snap-start ${
                activeTab === 'auditoria'
                  ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Auditoría</span>
            </button>
          </div>

      {/* ======================================================================
          TAB 1: DIRECTORIO DE PERSONAL (TARJETAS LIGERAS + ACCESO A DETALLE)
          ====================================================================== */}
      {activeTab === 'directorio' && (
        <div className="space-y-4 mb-8">
          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, cargo, email..."
                className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl text-xs font-bold text-[#0B1A2D] dark:text-slate-200 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] shadow-2xs"
              >
                <option value="all">Todos los Roles</option>
                <option value="HEAD_COACH">Director Deportivo</option>
                <option value="COACH">Profesor / Monitor</option>
                <option value="RECEPTION">Recepción y Caja</option>
                <option value="STORE_MANAGER">Gestión de Tienda</option>
              </select>
            </div>
          </div>

          {/* Grid de Fichas Ligeras (Avatar, Nombre, Cargo, Sede, Estado) */}
          {filteredStaff.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-center text-xs text-slate-500 dark:text-slate-400 mb-8">
              No se encontraron miembros del equipo con los filtros actuales.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
              {filteredStaff.map((staff) => (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => setSelectedStaffDetailId(staff.id)}
                  className="w-full text-left p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-between gap-3.5 cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={staff.avatarUrl}
                      alt={staff.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-[#1A314D] shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-[15px] text-[#0B1A2D] dark:text-white truncate">
                        {staff.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                        {staff.roleTitle}
                      </p>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {staff.venueName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide whitespace-nowrap ${
                        staff.status === 'active'
                          ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229]'
                          : staff.status === 'break'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-[#071220] text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {staff.status === 'active' ? 'En Turno' : staff.status === 'break' ? 'Descanso' : 'Fuera'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B1A2D] dark:group-hover:text-[#B7F229] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================
          TAB 2: GESTIÓN DE TURNOS & HORARIOS LABORALES
          ====================================================================== */}
      {activeTab === 'turnos' && (
        <div className="space-y-4 mb-8">
          {/* Barra de Filtros de Turnos */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
              <span className="text-xs font-bold text-[#0B1A2D] dark:text-slate-200">
                Cuadrante de Turnos Laborales
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">Empleado:</label>
              <select
                value={selectedCoachForCalendar}
                onChange={(e) => setSelectedCoachForCalendar(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-slate-200"
              >
                <option value="all">Todo el Personal</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.roleTitle})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleOpenCreateShiftModal()}
                className="px-3 py-1.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 text-[#B7F229] dark:text-[#0B1A2D]" />
                <span>Planificar Turno</span>
              </button>
            </div>
          </div>

          {/* Tabla de Turnos Programados con Edición y Eliminación */}
          <div className="bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl overflow-hidden shadow-2xs mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#1A314D] bg-slate-50/70 dark:bg-[#071220] text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4">Empleado / Cargo</th>
                    <th className="py-3.5 px-4">Fecha</th>
                    <th className="py-3.5 px-4">Horario</th>
                    <th className="py-3.5 px-4">Sede / Ubicación</th>
                    <th className="py-3.5 px-4">Función / Puesto</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4">Observaciones</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1A314D]">
                  {filteredShifts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        No hay turnos programados para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredShifts.map((shift) => (
                      <tr
                        key={shift.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition"
                      >
                        <td className="py-3.5 px-4 font-bold text-[#0B1A2D] dark:text-white whitespace-nowrap">
                          <div>{shift.staffName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{shift.roleTitle}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {shift.date}
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums font-extrabold text-[#0B1A2D] dark:text-[#B7F229] whitespace-nowrap">
                          {shift.startTime} - {shift.endTime}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {shift.venueName}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-300 text-[10px] font-bold">
                            {shiftTypeLabels[shift.shiftType]}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
                              shift.status === 'active'
                                ? 'bg-[#F0FCCF] dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229]'
                                : shift.status === 'completed'
                                ? 'bg-slate-100 dark:bg-[#071220] text-slate-600 dark:text-slate-400'
                                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {shift.status === 'active' ? 'En Curso' : shift.status === 'completed' ? 'Completado' : 'Programado'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-[220px] truncate">
                          {shift.notes || '—'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditShiftModal(shift)}
                              className="p-2 rounded-lg text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
                              title="Editar turno"
                              aria-label="Editar turno"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setShiftToDelete(shift)}
                              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                              title="Eliminar turno"
                              aria-label="Eliminar turno"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 3: CONTROL DE ACCIONES & AUDITORÍA EN TIEMPO REAL
          ====================================================================== */}
      {activeTab === 'auditoria' && (
        <div className="space-y-4 mb-8">
          {/* Barra de Filtros de Auditoría */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                placeholder="Buscar por usuario, acción, target o detalle..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
              />
              {auditSearchQuery && (
                <button
                  type="button"
                  onClick={() => setAuditSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-slate-200 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
              >
                <option value="all">Todas las Acciones</option>
                <option value="Tarifas">Tarifas y Precios</option>
                <option value="Reserva">Reservas y Cancelaciones</option>
                <option value="Iluminación">Domótica & Luces</option>
                <option value="Empleado">Altas de Empleados</option>
                <option value="Turno">Turnos Laborales</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  addAuditLog({
                    action: 'Verificación de Seguridad',
                    target: 'Consola de Administración',
                    details: 'Auditoría del sistema validada satisfactoriamente por el administrador.',
                  });
                  triggerDemoToast('Entrada de Auditoría Registrada', 'Nueva traza de auditoría generada.', 'info');
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] hover:bg-slate-200 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <span>Traza Test</span>
              </button>
            </div>
          </div>

          {/* Tabla de Logs de Auditoría */}
          <div className="bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#1A314D] bg-slate-50/70 dark:bg-[#071220] text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4">Fecha / Hora</th>
                    <th className="py-3.5 px-4">Responsable (Actor)</th>
                    <th className="py-3.5 px-4">Rol en el Sistema</th>
                    <th className="py-3.5 px-4">Acción Realizada</th>
                    <th className="py-3.5 px-4">Elemento Afectado</th>
                    <th className="py-3.5 px-4">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1A314D] font-medium">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        No hay registros de auditoría que coincidan con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition"
                      >
                        <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#0B1A2D] dark:text-white whitespace-nowrap">
                          {log.actor}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                            {log.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#0B1A2D] dark:text-[#B7F229] whitespace-nowrap">
                          {log.action}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {log.target}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 4: ASIGNACIÓN DE CLASES Y CALENDARIO FILTRADO POR PROFESOR
          ====================================================================== */}
      {activeTab === 'asignaciones' && (
        <div className="space-y-4 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <h3 className="font-bold text-sm text-[#0B1A2D] dark:text-white">
                Distribución de Alumnos y Cursos de Escuela
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Asigna cursos a cada monitor y visualiza el calendario de pistas reservadas para docencia.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAdminTab('academy')}
              className="px-4 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] dark:bg-[#B7F229] dark:hover:bg-[#a3db20] text-white dark:text-[#0B1A2D] font-bold text-xs transition cursor-pointer whitespace-nowrap shadow-2xs"
            >
              Ir a Escuela
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffList
              .filter((s) => s.role === 'COACH' || s.role === ('HEAD_COACH' as any))
              .map((coach) => {
                const assigned = academyGroups.filter((g) =>
                  coach.assignedGroupIds?.includes(g.id) || g.coachName === coach.name
                );

                return (
                  <div
                    key={coach.id}
                    className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={coach.avatarUrl}
                          alt={coach.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-[#1A314D] shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-[#0B1A2D] dark:text-white truncate">
                            {coach.name}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block truncate">
                            {coach.roleTitle}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenAssignModal(coach)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-[#071220] hover:bg-slate-200 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs transition cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Gestionar Asignaciones
                      </button>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-[#1A314D]">
                      <span className="text-[11px] font-semibold text-slate-400 block">
                        Cursos Impartidos ({assigned.length})
                      </span>

                      {assigned.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No tiene grupos asignados.</p>
                      ) : (
                        <div className="divide-y divide-slate-100 dark:divide-[#1A314D]">
                          {assigned.map((g) => (
                            <div
                              key={g.id}
                              className="py-2.5 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-[#0B1A2D] dark:text-white truncate">{g.name}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {g.schedule || 'Martes y Jueves'} · Máx {g.maxStudents} alumnos
                                </div>
                              </div>
                              <span className="font-mono tabular-nums font-bold text-[#0B1A2D] dark:text-[#B7F229] shrink-0">
                                {g.monthlyFee} €/mes
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
        </>
      )}

      {/* ======================================================================
          MODAL 1: NUEVO EMPLEADO / PROFESOR
          ====================================================================== */}
      {isNewStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-[#B7F229]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#0B1A2D] dark:text-white">
                  Alta de Empleado / Profesor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewStaffModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Rodrigo Álvarez"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Corporativo
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@padelsanmateo.es"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono Móvil
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rol / Departamento
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      setNewStaffRole(r);
                      if (r === 'COACH') setNewStaffRoleTitle('Profesor de Pádel');
                      else if (r === 'RECEPTION') setNewStaffRoleTitle('Recepción y Atención');
                      else if (r === 'STORE_MANAGER') setNewStaffRoleTitle('Responsable de Tienda');
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="COACH">Profesor / Monitor</option>
                    <option value="RECEPTION">Recepción y Caja</option>
                    <option value="STORE_MANAGER">Responsable de Tienda</option>
                    <option value="ACADEMY_MANAGER">Coordinador Escuela</option>
                    <option value="STAFF">Personal General</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cargo Visible
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaffRoleTitle}
                    onChange={(e) => setNewStaffRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {isMultiVenue && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sede Asignada
                  </label>
                  <select
                    value={newStaffVenueId}
                    onChange={(e) => setNewStaffVenueId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tarifa Hora (€)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={newStaffHourlyRate}
                    onChange={(e) => setNewStaffHourlyRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contrato
                  </label>
                  <select
                    value={newStaffContract}
                    onChange={(e) => setNewStaffContract(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="indefinido">Indefinido</option>
                    <option value="temporal">Temporal</option>
                    <option value="autonomo">Autónomo</option>
                    <option value="parcial">T. Parcial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Horas / Sem.
                  </label>
                  <input
                    type="number"
                    value={newStaffWeeklyHours}
                    onChange={(e) => setNewStaffWeeklyHours(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a3db20] text-[#0B1A2D] font-bold transition cursor-pointer shadow-2xs"
                >
                  Guardar y Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: CREAR / EDITAR TURNO LABORAL
          ====================================================================== */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-[#B7F229]">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#0B1A2D] dark:text-white">
                  {editingShiftId ? 'Editar Turno Laboral' : 'Planificar Turno Laboral'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsShiftModalOpen(false);
                  setEditingShiftId(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Empleado / Profesor Asignado
                </label>
                <select
                  value={shiftStaffId}
                  onChange={(e) => setShiftStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.roleTitle}
                    </option>
                  ))}
                </select>
              </div>

              {isMultiVenue && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sede del Turno
                  </label>
                  <select
                    value={shiftVenueId}
                    onChange={(e) => setShiftVenueId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
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

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Inicio</label>
                  <input
                    type="time"
                    required
                    value={shiftStartTime}
                    onChange={(e) => setShiftStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-[#0B1A2D] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fin</label>
                  <input
                    type="time"
                    required
                    value={shiftEndTime}
                    onChange={(e) => setShiftEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-mono font-bold text-[#0B1A2D] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Función / Puesto Asignado
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'clases_pista', label: 'Clases en Pista' },
                    { id: 'recepcion', label: 'Recepción & TPV' },
                    { id: 'coordinacion', label: 'Coordinación' },
                    { id: 'cierre', label: 'Cierre & Domótica' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setShiftType(f.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition border text-left cursor-pointer ${
                        shiftType === f.id
                          ? 'bg-[#0B1A2D] dark:bg-[#B7F229] border-[#0B1A2D] dark:border-[#B7F229] text-white dark:text-[#0B1A2D]'
                          : 'bg-slate-50 dark:bg-[#071220] border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {editingShiftId && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estado del Turno
                  </label>
                  <select
                    value={shiftStatus}
                    onChange={(e) => setShiftStatus(e.target.value as StaffShift['status'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs font-bold text-[#0B1A2D] dark:text-white"
                  >
                    <option value="scheduled">Programado</option>
                    <option value="active">En Curso</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notas / Instrucciones del Turno
                </label>
                <input
                  type="text"
                  placeholder="Ej. Revisar luces pista 4 y arqueo de caja..."
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-xl text-xs text-[#0B1A2D] dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsShiftModalOpen(false);
                    setEditingShiftId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a3db20] text-[#0B1A2D] font-bold transition cursor-pointer shadow-2xs"
                >
                  {editingShiftId ? 'Actualizar Turno' : 'Guardar Turno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL CONFIRMACIÓN ELIMINAR TURNO
          ====================================================================== */}
      {shiftToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <h3 className="font-bold text-base text-[#0B1A2D] dark:text-white">
                Eliminar Turno
              </h3>
              <button
                type="button"
                onClick={() => setShiftToDelete(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ¿Confirmas que deseas eliminar el turno de{' '}
              <strong className="text-[#0B1A2D] dark:text-white">{shiftToDelete.staffName}</strong> para el{' '}
              <span className="font-mono font-bold">{shiftToDelete.date}</span> ({shiftToDelete.startTime} -{' '}
              {shiftToDelete.endTime})?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShiftToDelete(null)}
                className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteShift}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer shadow-2xs text-xs"
              >
                Eliminar Turno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: ASIGNAR GRUPOS A PROFESOR
          ====================================================================== */}
      {selectedStaffForAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                <h3 className="font-bold text-base text-[#0B1A2D] dark:text-white">
                  Asignar Cursos a {selectedStaffForAssignment.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStaffForAssignment(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Selecciona los grupos y cursos de la escuela que serán impartidos por este profesor:
              </p>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {academyGroups.map((g) => {
                  const isChecked = assignedGroupsTemp.includes(g.id);
                  return (
                    <label
                      key={g.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none ${
                        isChecked
                          ? 'bg-[#F0FCCF]/60 dark:bg-[#B7F229]/15 border-[#B7F229] text-[#0B1A2D] dark:text-white font-bold'
                          : 'bg-slate-50 dark:bg-[#071220] border-slate-200/80 dark:border-[#1A314D] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignedGroupsTemp((prev) => [...prev, g.id]);
                            } else {
                              setAssignedGroupsTemp((prev) => prev.filter((id) => id !== g.id));
                            }
                          }}
                          className="w-4 h-4 rounded accent-[#0B1A2D] dark:accent-[#B7F229]"
                        />
                        <div>
                          <div className="font-bold">{g.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {g.schedule || 'Horario oficial'} · Cuota: {g.monthlyFee}€/mes
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono tabular-nums font-bold text-slate-400">
                        {g.currentStudents}/{g.maxStudents} alumnos
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedStaffForAssignment(null)}
                className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-[#132A45] transition cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAssignments}
                className="px-4 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a3db20] text-[#0B1A2D] font-bold transition cursor-pointer shadow-2xs text-xs"
              >
                Guardar Asignaciones
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
