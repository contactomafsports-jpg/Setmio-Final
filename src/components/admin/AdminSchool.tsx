import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Bell,
  Trash2,
  Edit2,
  X,
  Check,
  Search,
  Filter,
  Layers,
  MapPin,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export interface SchoolGroupItem {
  id: string;
  name: string;
  type: 'course_monthly' | 'course_quarterly' | 'single_class';
  durationLabel: string;
  levelCategory: string;
  coachName: string;
  schedule: string;
  days: string[];
  courtName: string;
  courtAvailable: boolean;
  memberFee: number;
  nonMemberFee: number;
  currentStudents: number;
  maxStudents: number;
  waitingList: string[];
  students: string[];
  publishedAsOpen?: boolean;
}

const INITIAL_GROUPS: SchoolGroupItem[] = [
  {
    id: 'grp-1',
    name: 'Iniciación Técnica Adultos — Grupo Martes/Jueves',
    type: 'course_quarterly',
    durationLabel: 'Trimestral (3 meses)',
    levelCategory: 'Nivel 1.5 - 2.5',
    coachName: 'Mateo Varela',
    schedule: '19:00 - 20:00',
    days: ['Martes', 'Jueves'],
    courtName: 'Pista 2 Panorámica',
    courtAvailable: true,
    memberFee: 65.0,
    nonMemberFee: 85.0,
    currentStudents: 4,
    maxStudents: 4,
    waitingList: ['Rodrigo Suárez', 'Marta Carballo'],
    students: ['Lucas Ramos', 'Sonia Gómez', 'Pedro Míguez', 'Beatriz Castro'],
  },
  {
    id: 'grp-2',
    name: 'Perfeccionamiento y Táctica de Paredes',
    type: 'course_monthly',
    durationLabel: 'Mensual (1 mes)',
    levelCategory: 'Nivel 3.0 - 4.0',
    coachName: 'Laura Senra',
    schedule: '18:30 - 19:30',
    days: ['Lunes', 'Miércoles'],
    courtName: 'Pista 1 Central',
    courtAvailable: true,
    memberFee: 55.0,
    nonMemberFee: 75.0,
    currentStudents: 3,
    maxStudents: 4,
    waitingList: [],
    students: ['Carlos Méndez', 'Diego Soto', 'Elena Permuy'],
    publishedAsOpen: true,
  },
  {
    id: 'grp-3',
    name: 'Clase Suelta: Clínica de Salida de Pared & Bajada',
    type: 'single_class',
    durationLabel: 'Clase Suelta (90 min)',
    levelCategory: 'Nivel Abierto (3.5+)',
    coachName: 'Mateo Varela',
    schedule: 'Sábado 11:00 - 12:30',
    days: ['Sábado'],
    courtName: 'Pista 3 Indoor Pro',
    courtAvailable: true,
    memberFee: 18.0,
    nonMemberFee: 24.0,
    currentStudents: 2,
    maxStudents: 4,
    waitingList: [],
    students: ['Javier Fraga', 'Ana Belén Vázquez'],
    publishedAsOpen: true,
  },
  {
    id: 'grp-4',
    name: 'Escuela de Competición Juvenil Sub-16',
    type: 'course_quarterly',
    durationLabel: 'Trimestral (3 meses)',
    levelCategory: 'Competición FEP',
    coachName: 'Mateo Varela',
    schedule: '17:00 - 18:30',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    courtName: 'Pista 4 Cubierta',
    courtAvailable: false,
    memberFee: 95.0,
    nonMemberFee: 120.0,
    currentStudents: 4,
    maxStudents: 4,
    waitingList: ['Pablo Rey Jr.'],
    students: ['Manuel Permuy Jr.', 'Lucas Dopico', 'Sara Fandiño', 'Alejandro Ramos'],
  },
];

export const AdminSchool: React.FC = () => {
  const { coaches, courts, triggerDemoToast, currentTenant } = useApp();

  const [groups, setGroups] = useState<SchoolGroupItem[]>(INITIAL_GROUPS);
  const [filterType, setFilterType] = useState<'all' | 'courses' | 'single' | 'coaches'>('all');
  const [search, setSearch] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SchoolGroupItem | null>(null);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<SchoolGroupItem | null>(null);
  const [confirmPublishClass, setConfirmPublishClass] = useState<SchoolGroupItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'course_monthly' as 'course_monthly' | 'course_quarterly' | 'single_class',
    durationLabel: 'Mensual (1 mes)',
    levelCategory: 'Nivel 2.5 - 3.5',
    coachName: coaches[0]?.name || 'Mateo Varela',
    schedule: '19:00 - 20:00',
    courtName: courts[0]?.name || 'Pista 1 Central',
    memberFee: 55.0,
    nonMemberFee: 75.0,
    maxStudents: 4,
  });

  const openCreateModal = () => {
    setEditingGroup(null);
    setFormData({
      name: '',
      type: 'course_monthly',
      durationLabel: 'Mensual (1 mes)',
      levelCategory: 'Nivel 2.5 - 3.5',
      coachName: coaches[0]?.name || 'Mateo Varela',
      schedule: '19:00 - 20:00',
      courtName: courts[0]?.name || 'Pista 1 Central',
      memberFee: 55.0,
      nonMemberFee: 75.0,
      maxStudents: 4,
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (grp: SchoolGroupItem) => {
    setEditingGroup(grp);
    setFormData({
      name: grp.name,
      type: grp.type,
      durationLabel: grp.durationLabel,
      levelCategory: grp.levelCategory,
      coachName: grp.coachName,
      schedule: grp.schedule,
      courtName: grp.courtName,
      memberFee: grp.memberFee,
      nonMemberFee: grp.nonMemberFee,
      maxStudents: grp.maxStudents,
    });
    setIsCreateModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? {
                ...g,
                name: formData.name,
                type: formData.type,
                durationLabel:
                  formData.type === 'single_class'
                    ? 'Clase Suelta (90 min)'
                    : formData.type === 'course_quarterly'
                    ? 'Trimestral (3 meses)'
                    : 'Mensual (1 mes)',
                levelCategory: formData.levelCategory,
                coachName: formData.coachName,
                schedule: formData.schedule,
                courtName: formData.courtName,
                memberFee: Number(formData.memberFee),
                nonMemberFee: Number(formData.nonMemberFee),
                maxStudents: Number(formData.maxStudents),
              }
            : g
        )
      );
      triggerDemoToast('Grupo Actualizado', `El grupo "${formData.name}" ha sido actualizado.`, 'success');
    } else {
      const newGrp: SchoolGroupItem = {
        id: `grp-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        durationLabel:
          formData.type === 'single_class'
            ? 'Clase Suelta (90 min)'
            : formData.type === 'course_quarterly'
            ? 'Trimestral (3 meses)'
            : 'Mensual (1 mes)',
        levelCategory: formData.levelCategory,
        coachName: formData.coachName,
        schedule: formData.schedule,
        days: ['Martes', 'Jueves'],
        courtName: formData.courtName,
        courtAvailable: true,
        memberFee: Number(formData.memberFee),
        nonMemberFee: Number(formData.nonMemberFee),
        currentStudents: 0,
        maxStudents: Number(formData.maxStudents),
        waitingList: [],
        students: [],
      };
      setGroups((prev) => [newGrp, ...prev]);
      triggerDemoToast('Grupo Creado', `Nuevo grupo "${formData.name}" registrado en la academia.`, 'success');
    }
    setIsCreateModalOpen(false);
  };

  const executeDelete = () => {
    if (!confirmDeleteGroup) return;
    setGroups((prev) => prev.filter((g) => g.id !== confirmDeleteGroup.id));
    triggerDemoToast(
      'Grupo Eliminado',
      `El grupo "${confirmDeleteGroup.name}" ha sido eliminado y los alumnos notificados.`,
      'info'
    );
    setConfirmDeleteGroup(null);
  };

  const executePublishClass = () => {
    if (!confirmPublishClass) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === confirmPublishClass.id
          ? { ...g, publishedAsOpen: true }
          : g
      )
    );
    triggerDemoToast(
      'Clase Publicada',
      `Plazas libres notificadas a la base de datos de socios y lista de espera.`,
      'success'
    );
    setConfirmPublishClass(null);
  };

  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.coachName.toLowerCase().includes(search.toLowerCase()) ||
      g.levelCategory.toLowerCase().includes(search.toLowerCase());

    if (filterType === 'courses') {
      return matchesSearch && (g.type === 'course_monthly' || g.type === 'course_quarterly');
    }
    if (filterType === 'single') {
      return matchesSearch && g.type === 'single_class';
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16">
      {/* 1. Header con tipografía accesible Setmio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Academia & Cursos Oficiales
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Escuela de Pádel — {currentTenant.name}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Gestión integral de cursos mensuales, trimestrales, clases sueltas, profesores y cuotas de socios.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Grupo / Clase</span>
        </button>
      </div>

      {/* 2. Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por grupo, profesor, nivel o pista..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Todos ({groups.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('courses')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === 'courses'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Cursos (1 mes / Trimestral)
          </button>
          <button
            type="button"
            onClick={() => setFilterType('single')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === 'single'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Clases Sueltas
          </button>
        </div>
      </div>

      {/* 3. Grid de Tarjetas de Grupos / Clases con Paleta Setmio Canónica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGroups.map((group) => {
          const isFull = group.currentStudents >= group.maxStudents;
          const openSpots = group.maxStudents - group.currentStudents;

          return (
            <div
              key={group.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-emerald-500/50 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Cabecera de la tarjeta: Categoría y Cuotas Diferenciadas */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                      {group.durationLabel}
                    </span>
                    <h2 className="text-base font-black text-slate-900 dark:text-white mt-1">
                      {group.name}
                    </h2>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {group.levelCategory}
                    </div>
                  </div>

                  {/* Cuotas Socios vs No Socios */}
                  <div className="text-right shrink-0 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                      Socio: <span className="font-mono text-sm font-black text-slate-900 dark:text-white">{group.memberFee.toFixed(2)} €</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      No Socio: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{group.nonMemberFee.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* Detalles operativos: Profesor, Horario y Verificación Visual de Pista */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold block">Profesor Asignado:</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{group.coachName}</span>
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold block">Horario & Días:</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{group.schedule}</span>
                    </span>
                  </div>
                </div>

                {/* Verificación Visual de Disponibilidad de Pista */}
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] truncate">
                      {group.courtName}
                    </span>
                  </div>

                  {group.courtAvailable ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Pista Verificada
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      Conflicto Turno
                    </span>
                  )}
                </div>

                {/* Ocupación y Lista de Espera */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                      Alumnos: <strong>{group.currentStudents}</strong> de <strong>{group.maxStudents}</strong> plazas
                    </span>
                    {group.waitingList.length > 0 && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                        {group.waitingList.length} en Lista de Espera
                      </span>
                    )}
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-emerald-500' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${(group.currentStudents / group.maxStudents) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Lista de Alumnos inscritos */}
                {group.students.length > 0 && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Inscritos: </span>
                    <span>{group.students.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Acciones de la Tarjeta */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs mt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(group)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    title="Editar grupo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteGroup(group)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition"
                    title="Eliminar grupo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {openSpots > 0 && (
                    <button
                      type="button"
                      onClick={() => setConfirmPublishClass(group)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-500/30 flex items-center gap-1 transition"
                    >
                      <Bell className="w-3 h-3" />
                      <span>{group.publishedAsOpen ? 'Notificado' : 'Publicar Plazas'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      triggerDemoToast(
                        'Control de Asistencia',
                        `Pasar lista de asistencia para ${group.name} en el turno ${group.schedule}.`,
                        'info'
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-[11px] transition"
                  >
                    Pasar Lista
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          MODAL: CREAR / EDITAR GRUPO O CLASE
          ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {editingGroup ? 'Editar Grupo de Escuela' : 'Crear Nuevo Grupo de Escuela'}
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

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Curso / Clase *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Perfeccionamiento Adultos Nivel 3.5"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Duración
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'course_monthly' | 'course_quarterly' | 'single_class',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="course_monthly">Mensual (1 mes)</option>
                    <option value="course_quarterly">Trimestral (3 meses)</option>
                    <option value="single_class">Clase Suelta (1 sesión)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nivel Estimado
                  </label>
                  <input
                    type="text"
                    value={formData.levelCategory}
                    onChange={(e) => setFormData({ ...formData, levelCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Profesor Asignado
                  </label>
                  <select
                    value={formData.coachName}
                    onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {coaches.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.roleTitle || c.certification || 'Entrenador'})
                      </option>
                    ))}
                    <option value="Mateo Varela">Mateo Varela</option>
                    <option value="Laura Senra">Laura Senra</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pista Asignada
                  </label>
                  <select
                    value={formData.courtName}
                    onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {courts.map((court) => (
                      <option key={court.id} value={court.name}>
                        {court.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Horario
                  </label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Máximo Alumnos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Cuotas Diferenciadas Socios vs No Socios */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Tarifas Diferenciadas
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-emerald-600 dark:text-emerald-400 mb-1 text-[11px]">
                      Cuota Socio (€)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.memberFee}
                      onChange={(e) => setFormData({ ...formData, memberFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
                      Cuota No Socio (€)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.nonMemberFee}
                      onChange={(e) => setFormData({ ...formData, nonMemberFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  {editingGroup ? 'Guardar Cambios' : 'Crear Grupo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CONFIRMACIÓN PREVIA ANTES DE ELIMINAR GRUPO
          ===================================================================== */}
      {confirmDeleteGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Confirmar Eliminación de Grupo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Acción irreversible en la academia
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ¿Estás seguro de que deseas eliminar permanentemente el grupo{' '}
              <strong className="text-slate-900 dark:text-white">{confirmDeleteGroup.name}</strong>?
              Se desasignará la pista {confirmDeleteGroup.courtName} y se notificará a los{' '}
              {confirmDeleteGroup.currentStudents} alumnos inscritos.
            </p>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setConfirmDeleteGroup(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition cursor-pointer shadow-xs"
              >
                Sí, Eliminar Grupo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: PUBLICAR CLASE LIBRE Y NOTIFICAR
          ===================================================================== */}
      {confirmPublishClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Publicar Plazas Libres
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Difusión automática de vacantes
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              El grupo <strong className="text-slate-900 dark:text-white">{confirmPublishClass.name}</strong> tiene{' '}
              {confirmPublishClass.maxStudents - confirmPublishClass.currentStudents} plazas libres.
              Se enviará una notificación push a los socios de nivel {confirmPublishClass.levelCategory} y a la lista de espera oficial.
            </p>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setConfirmPublishClass(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executePublishClass}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Difundir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
