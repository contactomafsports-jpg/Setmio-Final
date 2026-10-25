import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Coach, AcademyGroup, UserRole } from '../../types/database';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  Shield,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  Briefcase,
  Activity,
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  X,
  FileSpreadsheet,
  Check,
  Lock,
  Phone,
  Mail,
  Award,
  Sparkles,
} from 'lucide-react';

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
    venues,
    selectedVenueId,
    setSelectedVenueId,
    isMultiVenue,
    coaches,
    academyGroups,
    auditLogs,
    addAuditLog,
    triggerDemoToast,
    currentUser,
    setAdminTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'directorio' | 'turnos' | 'auditoria' | 'asignaciones'>('directorio');
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [shifts, setShifts] = useState<StaffShift[]>(INITIAL_SHIFTS);
  const [venueFilter, setVenueFilter] = useState<string>(selectedVenueId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modal Nuevo Empleado / Profesor
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('+34 600 00 00 00');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('COACH');
  const [newStaffRoleTitle, setNewStaffRoleTitle] = useState('Profesor de Pádel');
  const [newStaffVenueId, setNewStaffVenueId] = useState(venues[1]?.id || 'venue-san-mateo');
  const [newStaffHourlyRate, setNewStaffHourlyRate] = useState('30');
  const [newStaffContract, setNewStaffContract] = useState<'indefinido' | 'temporal' | 'autonomo' | 'parcial'>('indefinido');
  const [newStaffWeeklyHours, setNewStaffWeeklyHours] = useState('35');

  // Modal Nuevo Turno
  const [isNewShiftModalOpen, setIsNewShiftModalOpen] = useState(false);
  const [shiftStaffId, setShiftStaffId] = useState(staffList[0]?.id || 'staff-1');
  const [shiftDate, setShiftDate] = useState('2026-09-30');
  const [shiftStartTime, setShiftStartTime] = useState('15:30');
  const [shiftEndTime, setShiftEndTime] = useState('22:00');
  const [shiftType, setShiftType] = useState<StaffShift['shiftType']>('clases_pista');
  const [shiftVenueId, setShiftVenueId] = useState(venues[1]?.id || 'venue-san-mateo');
  const [shiftNotes, setShiftNotes] = useState('');

  // Modal Asignar Clases a Profesor
  const [selectedStaffForAssignment, setSelectedStaffForAssignment] = useState<StaffMember | null>(null);
  const [assignedGroupsTemp, setAssignedGroupsTemp] = useState<string[]>([]);

  // Filtros Auditoría
  const [auditActorFilter, setAuditActorFilter] = useState('all');
  const [auditActionFilter, setAuditActionFilter] = useState('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // Filtro de profesor para el calendario de clases
  const [selectedCoachForCalendar, setSelectedCoachForCalendar] = useState<string>('all');

  // Filtrado de Personal
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchesVenue = !isMultiVenue || venueFilter === 'all' || s.venueId === venueFilter;
      const matchesRole = roleFilter === 'all' || s.role === roleFilter;
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.roleTitle.toLowerCase().includes(term);
      return matchesVenue && matchesRole && matchesSearch;
    });
  }, [staffList, venueFilter, roleFilter, searchQuery, isMultiVenue]);

  // Filtrado de Turnos
  const filteredShifts = useMemo(() => {
    return shifts.filter((s) => {
      const matchesVenue = !isMultiVenue || venueFilter === 'all' || s.venueId === venueFilter;
      const matchesStaff = selectedCoachForCalendar === 'all' || s.staffId === selectedCoachForCalendar;
      return matchesVenue && matchesStaff;
    });
  }, [shifts, venueFilter, selectedCoachForCalendar, isMultiVenue]);

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

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = staffList.find((s) => s.id === shiftStaffId) || staffList[0];
    const targetVenue = venues.find((v) => v.id === shiftVenueId) || venues[1] || venues[0];

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
      status: 'scheduled',
      notes: shiftNotes.trim() || undefined,
    };

    setShifts((prev) => [newShift, ...prev]);

    // Registrar en auditoría
    addAuditLog({
      action: 'Creación de Turno Laboral',
      target: `${staff.name} (${shiftDate})`,
      details: `Turno de ${shiftStartTime} a ${shiftEndTime} en ${targetVenue.shortName} · Función: ${shiftType}.`,
    });

    triggerDemoToast(
      'Turno Configurado',
      `Turno asignado a ${staff.name} para el ${shiftDate} (${shiftStartTime} - ${shiftEndTime}).`,
      'success'
    );

    setIsNewShiftModalOpen(false);
    setShiftNotes('');
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

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16">
      {/* ======================================================================
          1. HEADER PRINCIPAL
          ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Módulo de RRHH y Gestión Docente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Personal, Profesores & Turnos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión integral de plantilla, configuración de turnos, asignación de cursos y registro de auditoría de acciones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsNewShiftModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Nuevo Turno</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewStaffModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Personal</span>
          </button>
        </div>
      </div>

      {/* ======================================================================
          2. FILTRO DE SEDE (SI ES CLUB MULTI-SEDE)
          ====================================================================== */}
      {Boolean(isMultiVenue) && Array.isArray(venues) && venues.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Filtrar por Instalación / Sede:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setVenueFilter('all');
                setSelectedVenueId('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                venueFilter === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              Todas las Sedes ({staffList.length})
            </button>
            {venues
              .filter((v) => v.id !== 'all')
              .map((v) => {
                const count = staffList.filter((s) => s.venueId === v.id).length;
                const isSelected = venueFilter === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setVenueFilter(v.id);
                      setSelectedVenueId(v.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {v.shortName || v.name} ({count})
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================================================================
          3. KPIS DE PERSONAL Y AUDITORÍA
          ====================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Plantilla Total
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {staffList.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{activeStaffCount} activos hoy</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Profesores & Monitores
          </span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {coachesCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Docencia y competición
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Turnos Hoy
          </span>
          <div className="text-2xl font-black text-amber-500 font-mono">
            {todayShiftsCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Cuadrante de trabajo activo
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Registro de Acciones
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {totalAuditActionsCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span>Trazabilidad 100% auditable</span>
          </span>
        </div>
      </div>

      {/* ======================================================================
          4. NAVEGACIÓN POR PESTAÑAS DEL MÓDULO
          ====================================================================== */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('directorio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'directorio'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Equipo & Profesores ({filteredStaff.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('turnos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'turnos'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Gestión de Turnos & Horarios</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('auditoria')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'auditoria'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Control de Acciones (Auditoría)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('asignaciones')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'asignaciones'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Asignación de Clases & Calendario</span>
        </button>
      </div>

      {/* ======================================================================
          TAB 1: DIRECTORIO DE PERSONAL Y PROFESORES
          ====================================================================== */}
      {activeTab === 'directorio' && (
        <div className="space-y-4">
          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, cargo, email..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos los Roles</option>
                <option value="HEAD_COACH">Director Deportivo</option>
                <option value="COACH">Profesor / Monitor</option>
                <option value="RECEPTION">Recepción y Caja</option>
                <option value="STORE_MANAGER">Gestión de Tienda</option>
              </select>
            </div>
          </div>

          {/* Grid de Fichas de Empleados / Profesores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((staff) => {
              const assignedGroups = academyGroups.filter((g) =>
                staff.assignedGroupIds?.includes(g.id) || g.coachName === staff.name
              );

              return (
                <div
                  key={staff.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header de la tarjeta */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={staff.avatarUrl}
                          alt={staff.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                            {staff.name}
                          </h3>
                          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                            {staff.roleTitle}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{staff.venueName}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          staff.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : staff.status === 'break'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {staff.status === 'active' ? 'En Turno' : staff.status === 'break' ? 'Descanso' : 'Fuera'}
                      </span>
                    </div>

                    {/* Datos de contacto y contrato */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[160px]">{staff.email}</span>
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {staff.weeklyHours}h / sem.
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Phone className="w-3 h-3" />
                          <span>{staff.phone}</span>
                        </span>
                        {staff.hourlyRate && (
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {staff.hourlyRate} €/h
                          </span>
                        )}
                      </div>

                      {staff.certifications && (
                        <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                          <Award className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{staff.certifications}</span>
                        </div>
                      )}
                    </div>

                    {/* Cursos / Grupos de Escuela Asignados */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Clases / Grupos Asignados ({assignedGroups.length}):
                      </span>
                      {assignedGroups.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Sin grupos vinculados actualmente.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {assignedGroups.map((g) => (
                            <span
                              key={g.id}
                              className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold"
                            >
                              {g.name.split('—')[0]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(staff)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Asignar Grupos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCoachForCalendar(staff.id);
                        setActiveTab('turnos');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Ver Turnos</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 2: GESTIÓN DE TURNOS & HORARIOS LABORALES
          ====================================================================== */}
      {activeTab === 'turnos' && (
        <div className="space-y-4">
          {/* Barra de Filtros de Turnos */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Cuadrante de Turnos Laborales:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">Empleado:</label>
              <select
                value={selectedCoachForCalendar}
                onChange={(e) => setSelectedCoachForCalendar(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
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
                onClick={() => setIsNewShiftModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Planificar Turno</span>
              </button>
            </div>
          </div>

          {/* Tabla de Turnos Programados */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4">Empleado / Cargo</th>
                    <th className="py-3.5 px-4">Fecha</th>
                    <th className="py-3.5 px-4">Horario</th>
                    <th className="py-3.5 px-4">Sede / Ubicación</th>
                    <th className="py-3.5 px-4">Función / Puesto</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Observaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredShifts.map((shift) => (
                    <tr
                      key={shift.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div>{shift.staffName}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{shift.roleTitle}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {shift.date}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                        {shift.startTime} - {shift.endTime}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {shift.venueName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                          {shift.shiftType === 'recepcion'
                            ? 'Recepción & Caja'
                            : shift.shiftType === 'clases_pista'
                            ? 'Clases en Pistas'
                            : shift.shiftType === 'cierre'
                            ? 'Cierre & Domótica'
                            : 'Coordinación'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            shift.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : shift.status === 'completed'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {shift.status === 'active' ? 'En Curso' : shift.status === 'completed' ? 'Completado' : 'Programado'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400 text-[11px]">
                        {shift.notes || '—'}
                      </td>
                    </tr>
                  ))}
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
        <div className="space-y-4">
          {/* Barra de Filtros de Auditoría */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                placeholder="Buscar por usuario, acción, target o detalle..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
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
                className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
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
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Traza Test</span>
              </button>
            </div>
          </div>

          {/* Tabla de Logs de Auditoría */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4">Fecha / Hora</th>
                    <th className="py-3.5 px-4">Responsable (Actor)</th>
                    <th className="py-3.5 px-4">Rol en el Sistema</th>
                    <th className="py-3.5 px-4">Acción Realizada</th>
                    <th className="py-3.5 px-4">Elemento Afectado (Target)</th>
                    <th className="py-3.5 px-4">Detalles de la Operación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
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
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {log.actor}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                            {log.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
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
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-indigo-950 dark:text-indigo-200">
                Distribución de Alumnos y Cursos de Academia
              </h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                Asigna cursos a cada monitor y visualiza el calendario de pistas reservadas para docencia.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAdminTab('academy')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer whitespace-nowrap shadow-xs"
            >
              Ir al Módulo de Escuela
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
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={coach.avatarUrl}
                          alt={coach.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {coach.name}
                          </h4>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                            {coach.roleTitle}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenAssignModal(coach)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                      >
                        Gestionar Asignaciones
                      </button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Cursos Impartidos ({assigned.length}):
                      </span>

                      {assigned.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No tiene grupos asignados.</p>
                      ) : (
                        assigned.map((g) => (
                          <div
                            key={g.id}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{g.name}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {g.schedule || 'Martes y Jueves'} · Máx {g.maxStudents} alumnos
                              </div>
                            </div>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {g.monthlyFee} €/mes
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 1: NUEVO EMPLEADO / PROFESOR
          ====================================================================== */}
      {isNewStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Alta de Empleado / Profesor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewStaffModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer shadow-md"
                >
                  Guardar y Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: NUEVO TURNO LABORAL
          ====================================================================== */}
      {isNewShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Planificar Turno Laboral
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewShiftModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShift} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Empleado / Profesor Asignado
                </label>
                <select
                  value={shiftStaffId}
                  onChange={(e) => setShiftStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
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

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Inicio</label>
                  <input
                    type="time"
                    required
                    value={shiftStartTime}
                    onChange={(e) => setShiftStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fin</label>
                  <input
                    type="time"
                    required
                    value={shiftEndTime}
                    onChange={(e) => setShiftEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Función / Puesto Asignado
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'clases_pista', label: '🎾 Clases en Pista' },
                    { id: 'recepcion', label: '🎟️ Recepción & TPV' },
                    { id: 'coordinacion', label: '📋 Coordinación' },
                    { id: 'cierre', label: '🔒 Cierre & Domótica' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setShiftType(f.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold transition border text-left cursor-pointer ${
                        shiftType === f.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notas / Instrucciones del Turno
                </label>
                <input
                  type="text"
                  placeholder="Ej. Revisar luces pista 4 y arqueo de caja..."
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewShiftModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer shadow-md"
                >
                  Guardar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: ASIGNAR GRUPOS A PROFESOR
          ====================================================================== */}
      {selectedStaffForAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Asignar Cursos a {selectedStaffForAssignment.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStaffForAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
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
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-950 dark:text-indigo-200 font-bold'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
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
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-bold">{g.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {g.schedule || 'Horario oficial'} · Cuota: {g.monthlyFee}€/mes
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {g.currentStudents}/{g.maxStudents} alumnos
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedStaffForAssignment(null)}
                className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAssignments}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition cursor-pointer shadow-md text-xs"
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
