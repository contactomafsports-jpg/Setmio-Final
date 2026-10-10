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
  ArrowLeft,
  UserCheck,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Star,
  Award,
  DollarSign,
  ChevronRight,
  UserPlus,
} from 'lucide-react';

export interface SchoolStudent {
  id: string;
  name: string;
  phone: string;
  email: string;
  level: string;
  type: 'regular' | 'single';
  groupName: string;
  paymentStatus: 'paid' | 'pending' | 'scholarship';
  attendancesCount: number;
  joinDate: string;
}

export interface SchoolGroupItem {
  id: string;
  name: string;
  type: 'course_monthly' | 'course_quarterly' | 'single_class';
  durationLabel: string;
  levelCategory: string;
  coachName: string;
  coachId?: string;
  schedule: string;
  days: string[];
  courtName: string;
  courtAvailable: boolean;
  registrationFee?: number;
  memberFee: number;
  nonMemberFee: number;
  currentStudents: number;
  maxStudents: number;
  waitingList: string[];
  students: string[];
  publishedAsOpen?: boolean;
  notes?: string;
}

export interface SchoolCoachItem {
  id: string;
  name: string;
  roleTitle: string;
  certification: string;
  phone: string;
  email: string;
  photoUrl: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  bio: string;
  weeklyHours: number;
  assignedGroupIds: string[];
}

const INITIAL_GROUPS: SchoolGroupItem[] = [
  {
    id: 'grp-1',
    name: 'Iniciación Técnica Adultos — Grupo Martes/Jueves',
    type: 'course_quarterly',
    durationLabel: 'Trimestral (3 meses)',
    levelCategory: 'Nivel 1.5 - 2.5',
    coachName: 'Mateo Varela',
    coachId: 'coach-1',
    schedule: '19:00 - 20:00',
    days: ['Martes', 'Jueves'],
    courtName: 'Pista 2 Panorámica',
    courtAvailable: true,
    registrationFee: 25.0,
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
    coachId: 'coach-2',
    schedule: '18:30 - 19:30',
    days: ['Lunes', 'Miércoles'],
    courtName: 'Pista 1 Central',
    courtAvailable: true,
    registrationFee: 20.0,
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
    coachId: 'coach-1',
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
    coachName: 'Marcos Vello',
    coachId: 'coach-3',
    schedule: '17:00 - 18:30',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    courtName: 'Pista 4 Cubierta',
    courtAvailable: true,
    registrationFee: 35.0,
    memberFee: 95.0,
    nonMemberFee: 120.0,
    currentStudents: 4,
    maxStudents: 4,
    waitingList: ['Pablo Rey Jr.'],
    students: ['Manuel Permuy Jr.', 'Lucas Dopico', 'Sara Fandiño', 'Alejandro Ramos'],
  },
  {
    id: 'grp-5',
    name: 'Clase Suelta: Masterclass de Víbora y Remate por 3',
    type: 'single_class',
    durationLabel: 'Clase Suelta (90 min)',
    levelCategory: 'Nivel Medio-Alto (4.0+)',
    coachName: 'Laura Senra',
    coachId: 'coach-2',
    schedule: 'Domingo 10:30 - 12:00',
    days: ['Domingo'],
    courtName: 'Pista 1 Central',
    courtAvailable: true,
    memberFee: 22.0,
    nonMemberFee: 28.0,
    currentStudents: 3,
    maxStudents: 4,
    waitingList: [],
    students: ['Roberto Loureiro', 'Antón Ferreiro', 'Patricia Seoane'],
    publishedAsOpen: true,
  },
];

const INITIAL_COACHES_DATA: SchoolCoachItem[] = [
  {
    id: 'coach-1',
    name: 'Mateo Varela',
    roleTitle: 'Director Técnico de Escuela',
    certification: 'Entrenador Nacional FEP Nivel 2 · Exjugador WPT Previa',
    phone: '+34 600 11 22 33',
    email: 'mateo.varela@padelsanmateo.es',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 35.0,
    rating: 4.9,
    reviewsCount: 38,
    bio: 'Más de 12 años dedicados a la tecnificación de jugadores federados y dirección de escuelas base en Galicia. Especialista en biomecánica de remate y juego aéreo.',
    weeklyHours: 24,
    assignedGroupIds: ['grp-1', 'grp-3'],
  },
  {
    id: 'coach-2',
    name: 'Laura Senra',
    roleTitle: 'Coordinadora de Adultos e Iniciación',
    certification: 'Monitora Titulada FGP · Licenciada en Ciencias de la Actividad Física',
    phone: '+34 655 44 33 22',
    email: 'laura.senra@padelsanmateo.es',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 30.0,
    rating: 4.8,
    reviewsCount: 29,
    bio: 'Enfoque centrado en la lectura táctica del juego de paredes y control defensivo. Gran dinamismo metodológico para grupos de adultos.',
    weeklyHours: 18,
    assignedGroupIds: ['grp-2', 'grp-5'],
  },
  {
    id: 'coach-3',
    name: 'Marcos Vello',
    roleTitle: 'Entrenador de Menores y Competición',
    certification: 'Técnico Deportivo Nivel 1 · Campeón Gallego por Equipos 2024',
    phone: '+34 644 88 99 00',
    email: 'marcos.vello@padelsanmateo.es',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 32.0,
    rating: 5.0,
    reviewsCount: 21,
    bio: 'Especializado en la preparación técnica y psicológica de menores en circuitos federados autonómicos y nacionales.',
    weeklyHours: 16,
    assignedGroupIds: ['grp-4'],
  },
];

const INITIAL_STUDENTS_DATA: SchoolStudent[] = [
  { id: 'st-1', name: 'Lucas Ramos', phone: '+34 611 11 22 33', email: 'lucas.ramos@email.es', level: '2.2', type: 'regular', groupName: 'Iniciación Técnica Adultos', paymentStatus: 'paid', attendancesCount: 12, joinDate: '15/09/2026' },
  { id: 'st-2', name: 'Sonia Gómez', phone: '+34 622 22 33 44', email: 'sonia.g@email.es', level: '2.4', type: 'regular', groupName: 'Iniciación Técnica Adultos', paymentStatus: 'paid', attendancesCount: 11, joinDate: '15/09/2026' },
  { id: 'st-3', name: 'Pedro Míguez', phone: '+34 633 33 44 55', email: 'pedro.miguez@email.es', level: '2.0', type: 'regular', groupName: 'Iniciación Técnica Adultos', paymentStatus: 'pending', attendancesCount: 9, joinDate: '20/09/2026' },
  { id: 'st-4', name: 'Beatriz Castro', phone: '+34 644 44 55 66', email: 'b.castro@email.es', level: '2.5', type: 'regular', groupName: 'Iniciación Técnica Adultos', paymentStatus: 'paid', attendancesCount: 12, joinDate: '15/09/2026' },
  { id: 'st-5', name: 'Carlos Méndez', phone: '+34 611 22 33 44', email: 'carlos.mendez@galiciapadel.com', level: '3.85', type: 'regular', groupName: 'Perfeccionamiento y Táctica de Paredes', paymentStatus: 'paid', attendancesCount: 14, joinDate: '01/09/2026' },
  { id: 'st-6', name: 'Diego Soto', phone: '+34 622 33 44 55', email: 'diego.soto@email.es', level: '3.90', type: 'regular', groupName: 'Perfeccionamiento y Táctica de Paredes', paymentStatus: 'paid', attendancesCount: 13, joinDate: '01/09/2026' },
  { id: 'st-7', name: 'Elena Permuy', phone: '+34 655 55 66 77', email: 'elena.permuy@email.es', level: '3.50', type: 'regular', groupName: 'Perfeccionamiento y Táctica de Paredes', paymentStatus: 'pending', attendancesCount: 10, joinDate: '05/09/2026' },
  { id: 'st-8', name: 'Javier Fraga', phone: '+34 644 55 66 77', email: 'javi.fraga@email.es', level: '4.10', type: 'single', groupName: 'Clínica de Salida de Pared & Bajada', paymentStatus: 'paid', attendancesCount: 4, joinDate: '03/10/2026' },
  { id: 'st-9', name: 'Ana Belén Vázquez', phone: '+34 677 77 88 99', email: 'anabelen.v@email.es', level: '3.60', type: 'single', groupName: 'Clínica de Salida de Pared & Bajada', paymentStatus: 'paid', attendancesCount: 2, joinDate: '04/10/2026' },
  { id: 'st-10', name: 'Manuel Permuy Jr.', phone: '+34 688 88 99 00', email: 'm.permuy.jr@email.es', level: '4.80', type: 'regular', groupName: 'Escuela de Competición Juvenil Sub-16', paymentStatus: 'scholarship', attendancesCount: 16, joinDate: '01/09/2026' },
  { id: 'st-11', name: 'Sara Fandiño', phone: '+34 699 99 00 11', email: 'sara.fandino@email.es', level: '4.50', type: 'regular', groupName: 'Escuela de Competición Juvenil Sub-16', paymentStatus: 'paid', attendancesCount: 15, joinDate: '01/09/2026' },
];

export const AdminSchool: React.FC = () => {
  const { coaches, courts, triggerDemoToast, currentTenant, t } = useApp();

  const [groups, setGroups] = useState<SchoolGroupItem[]>(INITIAL_GROUPS);
  const [coachesList, setCoachesList] = useState<SchoolCoachItem[]>(INITIAL_COACHES_DATA);
  const [studentsList, setStudentsList] = useState<SchoolStudent[]>(INITIAL_STUDENTS_DATA);

  // Main Tabs: Cursos | Clases | Alumnos | Profesores
  const [activeMainTab, setActiveMainTab] = useState<'courses' | 'classes' | 'students' | 'coaches'>('courses');
  const [studentFilter, setStudentFilter] = useState<'all' | 'regular' | 'single'>('all');
  const [search, setSearch] = useState('');

  // Selected Detail Views
  const [selectedGroupDetail, setSelectedGroupDetail] = useState<SchoolGroupItem | null>(null);
  const [selectedCoachDetail, setSelectedCoachDetail] = useState<SchoolCoachItem | null>(null);

  // Modals
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SchoolGroupItem | null>(null);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<SchoolGroupItem | null>(null);
  const [confirmPublishClass, setConfirmPublishClass] = useState<SchoolGroupItem | null>(null);
  const [inviteModalGroup, setInviteModalGroup] = useState<SchoolGroupItem | null>(null);

  // Invitation Modal Form State
  const [inviteSelectedUser, setInviteSelectedUser] = useState('Carlos Méndez');
  const [inviteChannel, setInviteChannel] = useState<'push' | 'whatsapp' | 'email'>('push');
  const [inviteCustomNote, setInviteCustomNote] = useState('');

  // Group Form State (para Grupos mensuales / trimestrales)
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    periodicity: 'course_monthly' as 'course_monthly' | 'course_quarterly',
    levelCategory: 'Nivel 2.5 - 3.5',
    coachName: coaches[0]?.name || 'Mateo Varela',
    schedule: '19:00 - 20:00',
    days: ['Martes', 'Jueves'],
    courtName: courts[0]?.name || 'Pista 1 Central',
    registrationFee: 20.0,
    memberFee: 55.0,
    nonMemberFee: 75.0,
    maxStudents: 4,
  });

  // Class Form State (para Clases sueltas / clínicas puntuales)
  const [classFormData, setClassFormData] = useState({
    name: '',
    date: 'Sábado 18 Octubre',
    schedule: '11:00 - 12:30',
    levelCategory: 'Nivel Abierto (3.0+)',
    coachName: coaches[0]?.name || 'Mateo Varela',
    courtName: courts[1]?.name || 'Pista 2 Panorámica',
    memberFee: 18.0,
    nonMemberFee: 24.0,
    maxStudents: 4,
    publishedAsOpen: true,
  });

  // Modals para Añadir Alumno y Añadir Profesor (Acciones Tarea 6)
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isNewCoachModalOpen, setIsNewCoachModalOpen] = useState(false);

  const [studentFormData, setStudentFormData] = useState({
    name: '',
    phone: '',
    email: '',
    level: '3.0',
    type: 'regular' as 'regular' | 'single',
    groupName: groups[0]?.name || 'Iniciación Técnica Adultos',
    paymentStatus: 'paid' as 'paid' | 'pending' | 'scholarship',
  });

  const [coachFormData, setCoachFormData] = useState({
    name: '',
    roleTitle: 'Monitor de Pistas & Tecnificación',
    certification: 'Monitor Titulado FEP / FGP',
    phone: '+34 600 00 00 00',
    email: '',
    hourlyRate: 30.0,
    weeklyHours: 20,
    bio: 'Entrenador oficial con experiencia en iniciación y competición escolar.',
  });

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormData.name.trim()) return;
    const newStudent: SchoolStudent = {
      id: `st-${Date.now()}`,
      name: studentFormData.name.trim(),
      phone: studentFormData.phone || '+34 600 00 00 00',
      email: studentFormData.email || `${studentFormData.name.toLowerCase().replace(/\s+/g, '.')}@email.es`,
      level: studentFormData.level || '3.0',
      type: studentFormData.type,
      groupName: studentFormData.groupName,
      paymentStatus: studentFormData.paymentStatus,
      attendancesCount: 0,
      joinDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    };

    setStudentsList((prev) => [newStudent, ...prev]);

    // Si se asigna a un grupo regular, actualizar los alumnos inscritos
    if (studentFormData.type === 'regular' && studentFormData.groupName) {
      setGroups((prev) =>
        prev.map((g) =>
          g.name === studentFormData.groupName
            ? {
                ...g,
                currentStudents: Math.min(g.maxStudents, g.currentStudents + 1),
                students: [...g.students, newStudent.name],
              }
            : g
        )
      );
    }

    triggerDemoToast(
      'Alumno Matriculado',
      `${newStudent.name} ha sido inscrito en ${studentFormData.groupName || 'la escuela'}.`,
      'success'
    );
    setStudentFormData({
      name: '',
      phone: '',
      email: '',
      level: '3.0',
      type: 'regular',
      groupName: groups[0]?.name || 'Iniciación Técnica Adultos',
      paymentStatus: 'paid',
    });
    setIsNewStudentModalOpen(false);
  };

  const handleCoachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachFormData.name.trim()) return;
    const newCoach: SchoolCoachItem = {
      id: `coach-${Date.now()}`,
      name: coachFormData.name.trim(),
      roleTitle: coachFormData.roleTitle,
      certification: coachFormData.certification,
      phone: coachFormData.phone,
      email: coachFormData.email || `${coachFormData.name.toLowerCase().replace(/\s+/g, '.')}@padelsanmateo.es`,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      hourlyRate: Number(coachFormData.hourlyRate) || 30.0,
      rating: 5.0,
      reviewsCount: 1,
      bio: coachFormData.bio,
      weeklyHours: Number(coachFormData.weeklyHours) || 20,
      assignedGroupIds: [],
    };

    setCoachesList((prev) => [...prev, newCoach]);
    triggerDemoToast(
      'Profesor Dado de Alta',
      `${newCoach.name} ha sido registrado como ${newCoach.roleTitle} en el club.`,
      'success'
    );
    setCoachFormData({
      name: '',
      roleTitle: 'Monitor de Pistas & Tecnificación',
      certification: 'Monitor Titulado FEP / FGP',
      phone: '+34 600 00 00 00',
      email: '',
      hourlyRate: 30.0,
      weeklyHours: 20,
      bio: 'Entrenador oficial con experiencia en iniciación y competición escolar.',
    });
    setIsNewCoachModalOpen(false);
  };

  // Submit New Group
  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormData.name.trim()) return;

    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? {
                ...g,
                name: groupFormData.name,
                type: groupFormData.periodicity,
                durationLabel:
                  groupFormData.periodicity === 'course_quarterly'
                    ? 'Trimestral (3 meses)'
                    : 'Mensual (1 mes)',
                levelCategory: groupFormData.levelCategory,
                coachName: groupFormData.coachName,
                schedule: groupFormData.schedule,
                days: groupFormData.days,
                courtName: groupFormData.courtName,
                registrationFee: Number(groupFormData.registrationFee),
                memberFee: Number(groupFormData.memberFee),
                nonMemberFee: Number(groupFormData.nonMemberFee),
                maxStudents: Number(groupFormData.maxStudents),
              }
            : g
        )
      );
      triggerDemoToast(
        t('school.groupUpdated', 'Grupo Actualizado'),
        `El grupo "${groupFormData.name}" ha sido actualizado con éxito.`,
        'success'
      );
    } else {
      const newGroup: SchoolGroupItem = {
        id: `grp-${Date.now()}`,
        name: groupFormData.name,
        type: groupFormData.periodicity,
        durationLabel:
          groupFormData.periodicity === 'course_quarterly'
            ? 'Trimestral (3 meses)'
            : 'Mensual (1 mes)',
        levelCategory: groupFormData.levelCategory,
        coachName: groupFormData.coachName,
        schedule: groupFormData.schedule,
        days: groupFormData.days,
        courtName: groupFormData.courtName,
        courtAvailable: true,
        registrationFee: Number(groupFormData.registrationFee),
        memberFee: Number(groupFormData.memberFee),
        nonMemberFee: Number(groupFormData.nonMemberFee),
        currentStudents: 0,
        maxStudents: Number(groupFormData.maxStudents),
        waitingList: [],
        students: [],
      };
      setGroups((prev) => [newGroup, ...prev]);
      triggerDemoToast(
        t('school.groupCreated', 'Grupo Creado'),
        `Nuevo grupo "${groupFormData.name}" añadido a la escuela.`,
        'success'
      );
    }

    setIsNewGroupModalOpen(false);
    setEditingGroup(null);
  };

  // Submit New Single Class
  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classFormData.name.trim()) return;

    const newClass: SchoolGroupItem = {
      id: `cls-${Date.now()}`,
      name: classFormData.name,
      type: 'single_class',
      durationLabel: `Clase Suelta (${classFormData.date})`,
      levelCategory: classFormData.levelCategory,
      coachName: classFormData.coachName,
      schedule: `${classFormData.date} ${classFormData.schedule}`,
      days: ['Sesión Única'],
      courtName: classFormData.courtName,
      courtAvailable: true,
      memberFee: Number(classFormData.memberFee),
      nonMemberFee: Number(classFormData.nonMemberFee),
      currentStudents: 0,
      maxStudents: Number(classFormData.maxStudents),
      waitingList: [],
      students: [],
      publishedAsOpen: classFormData.publishedAsOpen,
    };

    setGroups((prev) => [newClass, ...prev]);
    setIsNewClassModalOpen(false);
    triggerDemoToast(
      t('school.classCreated', 'Clase Suelta Creada'),
      `La sesión "${classFormData.name}" está disponible para reservas.`,
      'success'
    );
  };

  // Execute Direct Invitation
  const handleSendDirectInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteModalGroup) return;

    const channelName =
      inviteChannel === 'whatsapp'
        ? t('school.inviteChannelWhatsApp', 'WhatsApp')
        : inviteChannel === 'email'
        ? t('school.inviteChannelEmail', 'Correo Electrónico')
        : t('school.inviteChannelPush', 'Notificación Push');

    triggerDemoToast(
      t('school.inviteSent', 'Invitación Enviada'),
      `Invitación enviada a ${inviteSelectedUser} mediante ${channelName} para el grupo "${inviteModalGroup.name}".`,
      'success'
    );
    setInviteModalGroup(null);
  };

  // Execute Public Spot Publishing
  const executePublishClass = () => {
    if (!confirmPublishClass) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === confirmPublishClass.id ? { ...g, publishedAsOpen: true } : g
      )
    );
    triggerDemoToast(
      t('school.publishedSpots', 'Plazas Publicadas'),
      `Hueco libre ofertado en la app para jugadores externos y notificado a la lista de espera.`,
      'success'
    );
    setConfirmPublishClass(null);
  };

  // Execute Delete Group
  const executeDelete = () => {
    if (!confirmDeleteGroup) return;
    setGroups((prev) => prev.filter((g) => g.id !== confirmDeleteGroup.id));
    if (selectedGroupDetail?.id === confirmDeleteGroup.id) {
      setSelectedGroupDetail(null);
    }
    triggerDemoToast(
      t('school.groupDeleted', 'Grupo Eliminado'),
      `El grupo "${confirmDeleteGroup.name}" ha sido eliminado.`,
      'info'
    );
    setConfirmDeleteGroup(null);
  };

  // Filter groups / classes
  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.coachName.toLowerCase().includes(search.toLowerCase()) ||
      g.levelCategory.toLowerCase().includes(search.toLowerCase()) ||
      g.courtName.toLowerCase().includes(search.toLowerCase());

    if (activeMainTab === 'courses') {
      return matchesSearch && (g.type === 'course_monthly' || g.type === 'course_quarterly');
    }
    if (activeMainTab === 'classes') {
      return matchesSearch && g.type === 'single_class';
    }
    return matchesSearch;
  });

  // Filter students
  const filteredStudents = studentsList.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.phone.includes(search) ||
      st.email.toLowerCase().includes(search.toLowerCase()) ||
      st.groupName.toLowerCase().includes(search.toLowerCase());

    if (studentFilter === 'regular') return matchesSearch && st.type === 'regular';
    if (studentFilter === 'single') return matchesSearch && st.type === 'single';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-7xl mx-auto pb-16">
      {/* =====================================================================
          DETALLE DE CURSO / CLASE (SUBVISTA INDEPENDIENTE)
          ===================================================================== */}
      {selectedGroupDetail ? (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header con botón dinámico inteligente de volver */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedGroupDetail(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('school.backToSchool', 'Ir a la Escuela')}</span>
            </button>

            <div className="flex items-center gap-2">
              {selectedGroupDetail.maxStudents - selectedGroupDetail.currentStudents > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => setConfirmPublishClass(selectedGroupDetail)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{t('school.publishSpots', 'Publicar Plazas')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteModalGroup(selectedGroupDetail)}
                    className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t('school.inviteToCover', 'Invitar Alumnos')}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tarjeta Principal de Información Técnica */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  {selectedGroupDetail.durationLabel}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedGroupDetail.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedGroupDetail.levelCategory} · {selectedGroupDetail.days.join(', ')}
                </p>
              </div>

              {/* Tarifas */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-4 text-right">
                {selectedGroupDetail.registrationFee !== undefined && (
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">
                      {t('school.registrationFee', 'Matrícula')}
                    </div>
                    <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                      {selectedGroupDetail.registrationFee.toFixed(2)} €
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                    {t('school.monthlyFee', 'Cuota Socio')}
                  </div>
                  <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {selectedGroupDetail.memberFee.toFixed(2)} €
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">
                    No Socio
                  </div>
                  <div className="text-sm font-black font-mono text-slate-700 dark:text-slate-300">
                    {selectedGroupDetail.nonMemberFee.toFixed(2)} €
                  </div>
                </div>
              </div>
            </div>

            {/* Parrilla de datos operativos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    {t('school.assignedCoach', 'Profesor')}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const coachFound = coachesList.find((c) => c.name === selectedGroupDetail.coachName);
                      if (coachFound) {
                        setSelectedCoachDetail(coachFound);
                        setSelectedGroupDetail(null);
                        setActiveMainTab('coaches');
                      }
                    }}
                    className="font-bold text-slate-900 dark:text-white hover:text-emerald-500 transition cursor-pointer text-left"
                  >
                    {selectedGroupDetail.coachName} →
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    {t('school.scheduleDays', 'Horario')}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedGroupDetail.schedule}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    {t('school.assignedCourt', 'Pista')}
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{selectedGroupDetail.courtName}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-sm">
                      PIN Activo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Alumnos del Grupo */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Alumnos Matriculados ({selectedGroupDetail.students.length} de {selectedGroupDetail.maxStudents})
                </h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  triggerDemoToast(
                    t('school.attendance', 'Pasar Lista'),
                    `Asistencias registradas para ${selectedGroupDetail.name}.`,
                    'success'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
              >
                {t('school.attendance', 'Pasar Lista de Hoy')}
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {selectedGroupDetail.students.map((studentName, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{studentName}</div>
                      <div className="text-[11px] text-slate-400">Alumno regular · Pago domiciliado</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {t('school.studentPaid', 'Al Día')}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        triggerDemoToast(
                          'Ficha del Alumno',
                          `Abriendo historial de ${studentName}.`,
                          'info'
                        )
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                      title="Ver Ficha"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedGroupDetail.waitingList.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                  {t('school.waitingListCount', 'en Lista de Espera')} ({selectedGroupDetail.waitingList.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedGroupDetail.waitingList.map((waitStudent, wIdx) => (
                    <div
                      key={wIdx}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2"
                    >
                      <span>{waitStudent}</span>
                      <button
                        type="button"
                        onClick={() =>
                          triggerDemoToast(
                            'Alumno Admitido',
                            `${waitStudent} ha sido incorporado al grupo.`,
                            'success'
                          )
                        }
                        className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
                      >
                        Admitir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : selectedCoachDetail ? (
        /* =====================================================================
           DETALLE / PERFIL DEL PROFESOR
           ===================================================================== */
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedCoachDetail(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('school.backToCoaches', 'Ir a Profesores')}</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={selectedCoachDetail.photoUrl}
                alt={selectedCoachDetail.name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  {selectedCoachDetail.roleTitle}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {selectedCoachDetail.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedCoachDetail.certification}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCoachDetail.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCoachDetail.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Métricas del Profesor */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Tarifa Hora</div>
                <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedCoachDetail.hourlyRate.toFixed(2)} €
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Horas Semanales</div>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">
                  {selectedCoachDetail.weeklyHours}h
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Cursos Asignados</div>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">
                  {selectedCoachDetail.assignedGroupIds.length}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Valoración Media</div>
                <div className="text-lg font-black font-mono text-amber-500 mt-0.5 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{selectedCoachDetail.rating}</span>
                </div>
              </div>
            </div>

            {/* Biografía */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block">Perfil y Metodología:</span>
              <p className="leading-relaxed">{selectedCoachDetail.bio}</p>
            </div>

            {/* Cursos que imparte */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Grupos y Clases a su Cargo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groups
                  .filter((g) => g.coachName === selectedCoachDetail.name)
                  .map((grp) => (
                    <div
                      key={grp.id}
                      onClick={() => {
                        setSelectedGroupDetail(grp);
                        setSelectedCoachDetail(null);
                      }}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{grp.name}</div>
                        <div className="text-[11px] text-slate-500">{grp.schedule} · {grp.courtName}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================================
           VISTA PRINCIPAL: CURSOS, CLASES, ALUMNOS Y PROFESORES
           ===================================================================== */
        <>
          {/* Header con dos botones separados (sin icono duplicado) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Academia & Cursos Oficiales
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                Escuela de Pádel — {currentTenant.name}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Gestión de cursos mensuales, trimestrales, clases sueltas, profesores y alumnos.
              </p>
            </div>

            {/* Botonera Superior Alineada (4 Acciones Diferenciadas - Tarea 6) */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
              {/* 1. + Nuevo Grupo */}
              <button
                type="button"
                onClick={() => {
                  setEditingGroup(null);
                  setIsNewGroupModalOpen(true);
                }}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="Crear grupo periódico con matrícula y cuota"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nuevo Grupo</span>
              </button>

              {/* 2. + Nueva Clase */}
              <button
                type="button"
                onClick={() => setIsNewClassModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="Publicar clase suelta o clínica"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
                <span>+ Nueva Clase</span>
              </button>

              {/* 3. + Añadir Alumno */}
              <button
                type="button"
                onClick={() => setIsNewStudentModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="Matricular alumno directamente"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-500" />
                <span>+ Añadir Alumno</span>
              </button>

              {/* 4. + Añadir Profesor */}
              <button
                type="button"
                onClick={() => setIsNewCoachModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="Dar de alta nuevo entrenador"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                <span>+ Añadir Profesor</span>
              </button>
            </div>
          </div>

          {/* Filtros por Pestañas Minimalistas (Segmented controls) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Buscador minimalista */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, profesor o pista..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Conmutador de Pestañas Estilizado (Segmented Control) */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveMainTab('courses')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeMainTab === 'courses'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('school.tabs.courses', 'Cursos')}
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab('classes')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeMainTab === 'classes'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('school.tabs.classes', 'Clases')}
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab('students')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeMainTab === 'students'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('school.tabs.students', 'Alumnos')}
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab('coaches')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeMainTab === 'coaches'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('school.tabs.coaches', 'Profesores')}
              </button>
            </div>
          </div>

          {/* =====================================================================
              PESTAÑA: CURSOS Y CLASES (GRID)
              ===================================================================== */}
          {(activeMainTab === 'courses' || activeMainTab === 'classes') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-150">
              {filteredGroups.map((group) => {
                const isFull = group.currentStudents >= group.maxStudents;
                const openSpots = group.maxStudents - group.currentStudents;

                return (
                  <div
                    key={group.id}
                    className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-emerald-500/50 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Cabecera de la tarjeta */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                            {group.durationLabel}
                          </span>
                          <h2
                            onClick={() => setSelectedGroupDetail(group)}
                            className="text-base font-black text-slate-900 dark:text-white mt-1 hover:text-emerald-500 cursor-pointer transition"
                          >
                            {group.name}
                          </h2>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {group.levelCategory}
                          </div>
                        </div>

                        {/* Cuotas */}
                        <div className="text-right shrink-0 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                            Socio: <span className="font-mono text-sm font-black text-slate-900 dark:text-white">{group.memberFee.toFixed(2)} €</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            No Socio: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{group.nonMemberFee.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>

                      {/* Detalles operativos */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-bold block">{t('school.assignedCoach', 'Profesor')}:</span>
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{group.coachName}</span>
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-bold block">{t('school.scheduleDays', 'Horario')}:</span>
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{group.schedule}</span>
                          </span>
                        </div>
                      </div>

                      {/* Pista Asignada */}
                      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] truncate">
                            {group.courtName}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Pista Verificada
                        </span>
                      </div>

                      {/* Barra de Plazas */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                            Alumnos: <strong>{group.currentStudents}</strong> de <strong>{group.maxStudents}</strong> plazas
                          </span>
                          {openSpots > 0 ? (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              {openSpots} {t('school.vacantSpots', 'Plazas Libres')}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">Completo</span>
                          )}
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isFull ? 'bg-emerald-500' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${(group.currentStudents / group.maxStudents) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Acciones de la Tarjeta */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs mt-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGroup(group);
                            setGroupFormData({
                              name: group.name,
                              periodicity: group.type === 'course_quarterly' ? 'course_quarterly' : 'course_monthly',
                              levelCategory: group.levelCategory,
                              coachName: group.coachName,
                              schedule: group.schedule,
                              days: group.days,
                              courtName: group.courtName,
                              registrationFee: group.registrationFee || 20.0,
                              memberFee: group.memberFee,
                              nonMemberFee: group.nonMemberFee,
                              maxStudents: group.maxStudents,
                            });
                            setIsNewGroupModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteGroup(group)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-600 transition cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {openSpots > 0 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setConfirmPublishClass(group)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-500/30 flex items-center gap-1 transition cursor-pointer"
                              title="Ofertar hueco a jugadores externos"
                            >
                              <Bell className="w-3 h-3" />
                              <span>{group.publishedAsOpen ? t('school.publishedSpots', 'Plaza Publicada') : t('school.publishSpots', 'Publicar Plazas')}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setInviteModalGroup(group)}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/70 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold text-[11px] border border-purple-500/30 flex items-center gap-1 transition cursor-pointer"
                              title="Invitar a socios registrados"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>{t('school.inviteToCover', 'Invitar')}</span>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedGroupDetail(group)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-[11px] transition cursor-pointer"
                        >
                          {t('school.detailTitle', 'Ver Detalle')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* =====================================================================
              PESTAÑA: LISTA DE ALUMNOS (FILTRABLE GRUPO VS SUELTOS)
              ===================================================================== */}
          {activeMainTab === 'students' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Filtro específico de Alumnos */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setStudentFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    studentFilter === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {t('school.filterAllStudents', 'Todos los Alumnos')} ({studentsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStudentFilter('regular')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    studentFilter === 'regular'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {t('school.filterGroupStudents', 'Alumnos en Grupos')}
                </button>
                <button
                  type="button"
                  onClick={() => setStudentFilter('single')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    studentFilter === 'single'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {t('school.filterSingleStudents', 'Alumnos Clases Sueltas')}
                </button>
              </div>

              {/* Tabla de Alumnos */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Alumno</th>
                        <th className="py-3 px-4">Nivel</th>
                        <th className="py-3 px-4">Modalidad & Grupo</th>
                        <th className="py-3 px-4">Estado Cuota</th>
                        <th className="py-3 px-4">Asistencias</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {filteredStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                                {st.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                                <div className="text-[11px] text-slate-400">{st.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {st.level}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-900 dark:text-white font-medium">{st.groupName}</div>
                            <div className="text-[10px] text-slate-400">
                              {st.type === 'regular' ? 'Grupo Regular' : 'Sesión Suelta'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {st.paymentStatus === 'paid' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {t('school.studentPaid', 'Al Día')}
                              </span>
                            ) : st.paymentStatus === 'pending' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                {t('school.studentPending', 'Cuota Pendiente')}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                {t('school.studentScholarship', 'Becado')}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                            {st.attendancesCount} sesiones
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                triggerDemoToast(
                                  'Contacto WhatsApp',
                                  `Enviando mensaje a ${st.name} (${st.phone}).`,
                                  'info'
                                )
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 transition cursor-pointer"
                              title="Contactar"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              PESTAÑA: GESTIÓN DE PROFESORES / ENTRENADORES
              ===================================================================== */}
          {activeMainTab === 'coaches' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-150">
              {coachesList.map((coach) => (
                <div
                  key={coach.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={coach.photoUrl}
                        alt={coach.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{coach.name}</h3>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          {coach.roleTitle}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{coach.rating}</span>
                          <span className="text-slate-400 font-normal">({coach.reviewsCount})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {coach.certification}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Tarifa</span>
                        <span className="font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {coach.hourlyRate.toFixed(2)} €/h
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Carga Semanal</span>
                        <span className="font-black font-mono text-slate-900 dark:text-white">
                          {coach.weeklyHours}h
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCoachDetail(coach);
                      }}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer text-center"
                    >
                      {t('school.coachProfile', 'Ver Perfil y Cursos')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* =====================================================================
          MODAL: NUEVO GRUPO (MATRÍCULA, CUOTA PERIODICA, DIAS)
          ===================================================================== */}
      {isNewGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {editingGroup ? t('school.modals.editGroupTitle', 'Editar Grupo de Escuela') : t('school.modals.newGroupTitle', 'Crear Nuevo Grupo de Escuela')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsNewGroupModalOpen(false);
                  setEditingGroup(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGroupSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Grupo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Iniciación Técnica Adultos Nivel 2.5"
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Periodicidad del Curso
                  </label>
                  <select
                    value={groupFormData.periodicity}
                    onChange={(e) =>
                      setGroupFormData({
                        ...groupFormData,
                        periodicity: e.target.value as 'course_monthly' | 'course_quarterly',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="course_monthly">Mensual (1 mes)</option>
                    <option value="course_quarterly">Trimestral (3 meses)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nivel Recomendado
                  </label>
                  <input
                    type="text"
                    value={groupFormData.levelCategory}
                    onChange={(e) => setGroupFormData({ ...groupFormData, levelCategory: e.target.value })}
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
                    value={groupFormData.coachName}
                    onChange={(e) => setGroupFormData({ ...groupFormData, coachName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {coachesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.roleTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pista Asignada
                  </label>
                  <select
                    value={groupFormData.courtName}
                    onChange={(e) => setGroupFormData({ ...groupFormData, courtName: e.target.value })}
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
                    Horario de Clase
                  </label>
                  <input
                    type="text"
                    placeholder="19:00 - 20:00"
                    value={groupFormData.schedule}
                    onChange={(e) => setGroupFormData({ ...groupFormData, schedule: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cupo Máximo Alumnos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={groupFormData.maxStudents}
                    onChange={(e) => setGroupFormData({ ...groupFormData, maxStudents: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Matrícula y Cuotas */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Matrícula y Cuotas Periódicas
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 text-[10px]">
                      Matrícula (€)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={groupFormData.registrationFee}
                      onChange={(e) => setGroupFormData({ ...groupFormData, registrationFee: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-emerald-600 dark:text-emerald-400 mb-1 text-[10px]">
                      Cuota Socio (€)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={groupFormData.memberFee}
                      onChange={(e) => setGroupFormData({ ...groupFormData, memberFee: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 text-[10px]">
                      Cuota No Socio (€)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={groupFormData.nonMemberFee}
                      onChange={(e) => setGroupFormData({ ...groupFormData, nonMemberFee: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
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
          MODAL: NUEVA CLASE SUELTA (SESIÓN PUNTUAL, PLAZAS LIBRES, PRECIO SESIÓN)
          ===================================================================== */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {t('school.modals.newClassTitle', 'Crear Nueva Clase Suelta')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewClassModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClassSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Temática o Título de la Clase *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Clínica Intensiva de Víbora y Remate por 3"
                  value={classFormData.name}
                  onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de la Sesión
                  </label>
                  <input
                    type="text"
                    value={classFormData.date}
                    onChange={(e) => setClassFormData({ ...classFormData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Horario de Sesión (minutos)
                  </label>
                  <input
                    type="text"
                    value={classFormData.schedule}
                    onChange={(e) => setClassFormData({ ...classFormData, schedule: e.target.value })}
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
                    value={classFormData.coachName}
                    onChange={(e) => setClassFormData({ ...classFormData, coachName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {coachesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pista Asignada
                  </label>
                  <select
                    value={classFormData.courtName}
                    onChange={(e) => setClassFormData({ ...classFormData, courtName: e.target.value })}
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

              {/* Precios de la Sesión Suelta */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-600 dark:text-emerald-400 mb-1 text-[11px]">
                    Precio Sesión Socio (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={classFormData.memberFee}
                    onChange={(e) => setClassFormData({ ...classFormData, memberFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
                    Precio Sesión No Socio (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={classFormData.nonMemberFee}
                    onChange={(e) => setClassFormData({ ...classFormData, nonMemberFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={classFormData.publishedAsOpen}
                    onChange={(e) => setClassFormData({ ...classFormData, publishedAsOpen: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold">Publicar plazas abiertas en la app para jugadores externos</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Publicar Clase Suelta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ENVIAR INVITACIÓN DIRECTA PARA CUBRIR HUECOS
          ===================================================================== */}
      {inviteModalGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {t('school.inviteModalTitle', 'Enviar Invitación para Cubrir Plaza')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInviteModalGroup(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              El grupo <strong className="text-slate-900 dark:text-white">{inviteModalGroup.name}</strong> tiene{' '}
              {inviteModalGroup.maxStudents - inviteModalGroup.currentStudents} huecos libres ({inviteModalGroup.schedule}).
            </p>

            <form onSubmit={handleSendDirectInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Seleccionar Socio / Cliente Registrado
                </label>
                <select
                  value={inviteSelectedUser}
                  onChange={(e) => setInviteSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Carlos Méndez">Carlos Méndez (Nivel 3.85 · Socio)</option>
                  <option value="Diego Soto">Diego Soto (Nivel 3.90 · Socio)</option>
                  <option value="Javier Fraga">Javier Fraga (Nivel 4.10 · No Socio)</option>
                  <option value="Elena Permuy">Elena Permuy (Nivel 3.50 · Socia)</option>
                  <option value="Rodrigo Suárez">Rodrigo Suárez (En Lista de Espera)</option>
                  <option value="Marta Carballo">Marta Carballo (En Lista de Espera)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Canal de Envío
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteChannel('push')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                      inviteChannel === 'push'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    App Push
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteChannel('whatsapp')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                      inviteChannel === 'whatsapp'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteChannel('email')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                      inviteChannel === 'email'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Email
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteModalGroup(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('school.sendDirectInvite', 'Enviar Invitación')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: PUBLICAR PLAZA ABIERTA A EXTERNOS
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
                  {t('school.publishSpots', 'Publicar Plazas Libres')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Difusión a jugadores externos y lista de espera
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              El grupo <strong className="text-slate-900 dark:text-white">{confirmPublishClass.name}</strong> tiene{' '}
              {confirmPublishClass.maxStudents - confirmPublishClass.currentStudents} huecos libres.
              Al publicarlo, cualquier jugador registrado o externo podrá contratar la plaza suelta desde la app de reservas.
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
                <span>Confirmar y Publicar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CONFIRMACIÓN ANTES DE ELIMINAR GRUPO
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
                  Acción irreversible
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ¿Estás seguro de que deseas eliminar permanentemente el grupo{' '}
              <strong className="text-slate-900 dark:text-white">{confirmDeleteGroup.name}</strong>?
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
    </div>
  );
};
