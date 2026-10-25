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
  Megaphone,
  CreditCard,
  RefreshCw,
  UserMinus,
  FileText,
  ShieldCheck,
  CalendarDays,
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
  avatarUrl?: string;
}

export interface SchoolAbsenceNotice {
  id: string;
  studentName: string;
  reason: string;
  notifiedAt: string;
  status: 'pending' | 'accepted';
  notifiedBy: 'student' | 'admin';
}

export interface SchoolClubNotice {
  id: string;
  date: string;
  title: string;
  message: string;
  channel: 'push' | 'whatsapp' | 'email';
}

export interface SchoolGroupSession {
  id: string;
  sessionNumber: number;
  date: string;
  dayOfWeek: string;
  time: string;
  courtName: string;
  coachName: string;
  topic: string;
  status: 'scheduled' | 'completed' | 'in_progress' | 'cancelled';
  attendedCount?: number;
  absences?: SchoolAbsenceNotice[];
  holdClassAnyway?: boolean;
  notes?: string;
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
  classesPerWeek?: number;
  totalWeeks?: number;
  startDate?: string;
  sessions?: SchoolGroupSession[];
  holdClassAnywayGlobal?: boolean;
  clubNotices?: SchoolClubNotice[];
}

export interface CoachPaymentRecord {
  id: string;
  date: string;
  amount: number;
  concept: string;
  method: string;
  reference: string;
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
  paymentStatus?: 'paid' | 'pending';
  accumulatedFees?: number;
  totalHoursTaught?: number;
  paymentHistory?: CoachPaymentRecord[];
}

export const generateSessionsForGroup = (
  groupName: string,
  type: 'course_monthly' | 'course_quarterly' | 'single_class',
  days: string[],
  schedule: string,
  courtName: string,
  coachName: string,
  classesPerWeek = days.length || 2,
  totalWeeks = type === 'course_quarterly' ? 12 : type === 'course_monthly' ? 4 : 1
): SchoolGroupSession[] => {
  const pedagogicalTopics = [
    'Control de empuñadura, derecha plana y armado corto',
    'Revés a dos manos, apoyo de piernas y punto dulce',
    'Lectura y salida de pared de fondo (pared frontal)',
    'Salida de pared lateral y giro de cadera',
    'Voleas de aproximación y bloqueo firme en la red',
    'Bandeja táctica de contención y dirección cruzada',
    'Bajada de pared agresiva y transición a la cinta',
    'El globo defensivo milimétrico y recuperación posicional',
    'Remate por 3: punto de impacto, arqueo y pronación',
    'Chiquita a los pies del rival y definición rápida',
    'Táctica de juego en cruzado y comunicación de pareja',
    'Partido guiado con corrección técnica en tiempo real',
  ];

  const sessions: SchoolGroupSession[] = [];
  const totalSessions = type === 'single_class' ? 1 : totalWeeks * classesPerWeek;
  const baseDate = new Date(2026, 9, 6); // 06/10/2026
  let dayOffset = 0;

  for (let i = 1; i <= totalSessions; i++) {
    const currentDayName = days[(i - 1) % days.length] || 'Martes';
    const sessionDate = new Date(baseDate.getTime() + dayOffset * 86400000);
    dayOffset += 3.5;
    const dateFormatted = sessionDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    sessions.push({
      id: `sess-${groupName.slice(0, 4).toLowerCase().replace(/\s+/g, '')}-${i}`,
      sessionNumber: i,
      date: dateFormatted,
      dayOfWeek: currentDayName,
      time: schedule,
      courtName: courtName,
      coachName: coachName,
      topic: pedagogicalTopics[(i - 1) % pedagogicalTopics.length],
      status: i <= 2 ? 'completed' : i === 3 ? 'in_progress' : 'scheduled',
      attendedCount: i <= 2 ? 4 : undefined,
      absences: i === 3 ? [
        {
          id: `abs-init-1`,
          studentName: 'Lucas Ramos',
          reason: 'Viaje de trabajo fuera de la ciudad',
          notifiedAt: 'Hoy, 09:15',
          status: 'accepted',
          notifiedBy: 'student',
        }
      ] : [],
      holdClassAnyway: true,
    });
  }

  return sessions;
};

const INITIAL_GROUPS: SchoolGroupItem[] = [
  {
    id: 'grp-1',
    name: 'Iniciación Técnica Adultos — Grupo Martes/Jueves',
    type: 'course_quarterly',
    durationLabel: 'Trimestral (3 meses · 24 clases)',
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
    classesPerWeek: 2,
    totalWeeks: 12,
    holdClassAnywayGlobal: true,
    sessions: generateSessionsForGroup('Iniciación Técnica Adultos', 'course_quarterly', ['Martes', 'Jueves'], '19:00 - 20:00', 'Pista 2 Panorámica', 'Mateo Varela', 2, 12),
    clubNotices: [
      {
        id: 'not-1',
        date: '10/10/2026',
        title: 'Sesión grabada con vídeo-análisis',
        message: 'Este jueves contaremos con cámara HD en pista para analizar la salida de pared de cada alumno.',
        channel: 'whatsapp'
      }
    ]
  },
  {
    id: 'grp-2',
    name: 'Perfeccionamiento y Táctica de Paredes',
    type: 'course_monthly',
    durationLabel: 'Mensual (1 mes · 8 clases)',
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
    classesPerWeek: 2,
    totalWeeks: 4,
    holdClassAnywayGlobal: true,
    sessions: generateSessionsForGroup('Perfeccionamiento y Táctica de Paredes', 'course_monthly', ['Lunes', 'Miércoles'], '18:30 - 19:30', 'Pista 1 Central', 'Laura Senra', 2, 4),
    clubNotices: []
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
    classesPerWeek: 1,
    totalWeeks: 1,
    holdClassAnywayGlobal: true,
    sessions: generateSessionsForGroup('Clínica de Salida de Pared & Bajada', 'single_class', ['Sábado'], 'Sábado 11:00 - 12:30', 'Pista 3 Indoor Pro', 'Mateo Varela', 1, 1),
  },
  {
    id: 'grp-4',
    name: 'Escuela de Competición Juvenil Sub-16',
    type: 'course_quarterly',
    durationLabel: 'Trimestral (3 meses · 36 clases)',
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
    classesPerWeek: 3,
    totalWeeks: 12,
    holdClassAnywayGlobal: true,
    sessions: generateSessionsForGroup('Escuela de Competición Juvenil Sub-16', 'course_quarterly', ['Lunes', 'Miércoles', 'Viernes'], '17:00 - 18:30', 'Pista 4 Cubierta', 'Marcos Vello', 3, 12),
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
    classesPerWeek: 1,
    totalWeeks: 1,
    holdClassAnywayGlobal: true,
    sessions: generateSessionsForGroup('Masterclass de Víbora y Remate por 3', 'single_class', ['Domingo'], 'Domingo 10:30 - 12:00', 'Pista 1 Central', 'Laura Senra', 1, 1),
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
    paymentStatus: 'pending',
    accumulatedFees: 840.0,
    totalHoursTaught: 24,
    paymentHistory: [
      {
        id: 'pay-c1-1',
        date: '30/09/2026',
        amount: 840.0,
        concept: 'Honorarios Escuela Septiembre 2026 (24h)',
        method: 'Transferencia bancaria SEPA',
        reference: 'TR-SEP-2026-04'
      },
      {
        id: 'pay-c1-2',
        date: '31/08/2026',
        amount: 770.0,
        concept: 'Honorarios Escuela Agosto 2026 (22h)',
        method: 'Transferencia bancaria SEPA',
        reference: 'TR-AGO-2026-11'
      }
    ]
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
    paymentStatus: 'paid',
    accumulatedFees: 540.0,
    totalHoursTaught: 18,
    paymentHistory: [
      {
        id: 'pay-c2-1',
        date: '02/10/2026',
        amount: 540.0,
        concept: 'Liquidación Quincenal Docencia',
        method: 'Transferencia bancaria SEPA',
        reference: 'TR-OCT-2026-01'
      }
    ]
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
    paymentStatus: 'pending',
    accumulatedFees: 512.0,
    totalHoursTaught: 16,
    paymentHistory: [
      {
        id: 'pay-c3-1',
        date: '30/09/2026',
        amount: 512.0,
        concept: 'Honorarios Competición Septiembre 2026',
        method: 'Transferencia bancaria SEPA',
        reference: 'TR-SEP-2026-08'
      }
    ]
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
  const {
    coaches,
    courts,
    customers,
    navigateToPlayerProfile,
    triggerDemoToast,
    currentTenant,
    playerGroups,
    sendGroupConvocatoria,
    t,
  } = useApp();

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

  // Group Details Sub-tabs: 'sessions' | 'students' | 'notices' | 'rates'
  const [activeGroupTab, setActiveGroupTab] = useState<'sessions' | 'students' | 'notices' | 'rates'>('sessions');

  // Coach Calendar View & Filter
  const [coachCalendarView, setCoachCalendarView] = useState(false);
  const [selectedCoachFilter, setSelectedCoachFilter] = useState<string>('all');

  // Modals
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SchoolGroupItem | null>(null);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<SchoolGroupItem | null>(null);
  const [confirmPublishClass, setConfirmPublishClass] = useState<SchoolGroupItem | null>(null);
  const [inviteModalGroup, setInviteModalGroup] = useState<SchoolGroupItem | null>(null);
  const [notifyGroupSchoolItem, setNotifyGroupSchoolItem] = useState<SchoolGroupItem | null>(null);

  // New Modals for Sessions, Absences, Club Notices & Coach Payments
  const [isReportAbsenceModalOpen, setIsReportAbsenceModalOpen] = useState(false);
  const [absenceStudentName, setAbsenceStudentName] = useState('');
  const [absenceReason, setAbsenceReason] = useState('Motivos de salud / Lesión muscular');
  const [absenceTargetSessionId, setAbsenceTargetSessionId] = useState<string>('');

  const [isClubNoticeModalOpen, setIsClubNoticeModalOpen] = useState(false);
  const [clubNoticeTitle, setClubNoticeTitle] = useState('');
  const [clubNoticeMessage, setClubNoticeMessage] = useState('');
  const [clubNoticeChannel, setClubNoticeChannel] = useState<'push' | 'whatsapp' | 'email'>('whatsapp');

  const [isCoachPaymentModalOpen, setIsCoachPaymentModalOpen] = useState(false);
  const [coachPaymentCoach, setCoachPaymentCoach] = useState<SchoolCoachItem | null>(null);
  const [coachPaymentAmount, setCoachPaymentAmount] = useState<number>(0);
  const [coachPaymentConcept, setCoachPaymentConcept] = useState('Liquidación honorarios de docencia');
  const [coachPaymentMethod, setCoachPaymentMethod] = useState('Transferencia bancaria SEPA');

  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [sessionFormData, setSessionFormData] = useState({
    topic: 'Clínica táctica de lectura y defensa en cruzado',
    date: '15/10/2026',
    time: '19:00 - 20:00',
    courtName: courts[0]?.name || 'Pista 1 Central',
    coachName: coaches[0]?.name || 'Mateo Varela',
  });

  // Notificar a Grupo Form State
  const [selectedGroupIdForClass, setSelectedGroupIdForClass] = useState<string>('');
  const [classConvocatoriaSubject, setClassConvocatoriaSubject] = useState<string>('');
  const [classConvocatoriaMessage, setClassConvocatoriaMessage] = useState<string>('');
  const [classChannels, setClassChannels] = useState({ push: true, whatsapp: true, email: false });

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
    notes: '',
    classesPerWeek: 2,
    totalWeeks: 4,
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

      if (selectedGroupDetail && selectedGroupDetail.name === studentFormData.groupName) {
        setSelectedGroupDetail((prev) =>
          prev
            ? {
                ...prev,
                currentStudents: Math.min(prev.maxStudents, prev.currentStudents + 1),
                students: [...prev.students, newStudent.name],
              }
            : null
        );
      }
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
      paymentStatus: 'pending',
      accumulatedFees: 0,
      totalHoursTaught: 0,
      paymentHistory: [],
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

  // Submit New or Edited Group
  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormData.name.trim()) return;

    const totalWeeksCalc = groupFormData.totalWeeks || (groupFormData.periodicity === 'course_quarterly' ? 12 : 4);
    const classesPerWeekCalc = groupFormData.classesPerWeek || groupFormData.days.length || 2;
    const totalClassesCount = totalWeeksCalc * classesPerWeekCalc;

    if (editingGroup) {
      const generatedSessions =
        editingGroup.sessions && editingGroup.sessions.length > 0
          ? editingGroup.sessions.map((s) => ({
              ...s,
              time: groupFormData.schedule,
              courtName: groupFormData.courtName,
              coachName: groupFormData.coachName,
            }))
          : generateSessionsForGroup(
              groupFormData.name,
              groupFormData.periodicity,
              groupFormData.days,
              groupFormData.schedule,
              groupFormData.courtName,
              groupFormData.coachName,
              classesPerWeekCalc,
              totalWeeksCalc
            );

      const updatedGroup: SchoolGroupItem = {
        ...editingGroup,
        name: groupFormData.name,
        type: groupFormData.periodicity,
        durationLabel:
          groupFormData.periodicity === 'course_quarterly'
            ? `Trimestral (3 meses · ${totalClassesCount} clases)`
            : `Mensual (1 mes · ${totalClassesCount} clases)`,
        levelCategory: groupFormData.levelCategory,
        coachName: groupFormData.coachName,
        schedule: groupFormData.schedule,
        days: groupFormData.days,
        courtName: groupFormData.courtName,
        registrationFee: Number(groupFormData.registrationFee),
        memberFee: Number(groupFormData.memberFee),
        nonMemberFee: Number(groupFormData.nonMemberFee),
        maxStudents: Number(groupFormData.maxStudents),
        classesPerWeek: classesPerWeekCalc,
        totalWeeks: totalWeeksCalc,
        sessions: generatedSessions,
      };

      setGroups((prev) => prev.map((g) => (g.id === editingGroup.id ? updatedGroup : g)));

      if (selectedGroupDetail && selectedGroupDetail.id === editingGroup.id) {
        setSelectedGroupDetail(updatedGroup);
      }

      triggerDemoToast(
        t('school.groupUpdated', 'Grupo Actualizado'),
        `El grupo "${groupFormData.name}" ha sido actualizado con éxito con su calendario de ${totalClassesCount} clases.`,
        'success'
      );
    } else {
      const generatedSessions = generateSessionsForGroup(
        groupFormData.name,
        groupFormData.periodicity,
        groupFormData.days,
        groupFormData.schedule,
        groupFormData.courtName,
        groupFormData.coachName,
        classesPerWeekCalc,
        totalWeeksCalc
      );

      const newGroup: SchoolGroupItem = {
        id: `grp-${Date.now()}`,
        name: groupFormData.name,
        type: groupFormData.periodicity,
        durationLabel:
          groupFormData.periodicity === 'course_quarterly'
            ? `Trimestral (3 meses · ${totalClassesCount} clases)`
            : `Mensual (1 mes · ${totalClassesCount} clases)`,
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
        classesPerWeek: classesPerWeekCalc,
        totalWeeks: totalWeeksCalc,
        holdClassAnywayGlobal: true,
        sessions: generatedSessions,
        clubNotices: [],
      };

      setGroups((prev) => [newGroup, ...prev]);
      triggerDemoToast(
        t('school.groupCreated', 'Grupo Creado'),
        `Nuevo grupo "${groupFormData.name}" con ${totalClassesCount} clases programadas.`,
        'success'
      );
    }

    setIsNewGroupModalOpen(false);
    setEditingGroup(null);
  };

  // Helper to toggle holdClassAnyway on session
  const handleToggleSessionHold = (sessionId: string) => {
    if (!selectedGroupDetail) return;
    const updatedSessions = (selectedGroupDetail.sessions || []).map((s) => {
      if (s.id === sessionId) {
        const next = !s.holdClassAnyway;
        triggerDemoToast(
          next ? 'Clase Confirmada' : 'Aviso de Ausencias Activo',
          next
            ? 'La sesión se impartirá con normalidad aunque haya alumnos con falta de asistencia.'
            : 'Se notificará al monitor y a secretaría para gestionar las ausencias pendientes.',
          next ? 'success' : 'info'
        );
        return { ...s, holdClassAnyway: next };
      }
      return s;
    });

    const updatedGroup = { ...selectedGroupDetail, sessions: updatedSessions };
    setSelectedGroupDetail(updatedGroup);
    setGroups((prev) => prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
  };

  // Helper to toggle global holdClassAnyway
  const handleToggleGlobalHold = () => {
    if (!selectedGroupDetail) return;
    const next = !selectedGroupDetail.holdClassAnywayGlobal;
    const updatedGroup = {
      ...selectedGroupDetail,
      holdClassAnywayGlobal: next,
      sessions: (selectedGroupDetail.sessions || []).map((s) => ({ ...s, holdClassAnyway: next })),
    };
    setSelectedGroupDetail(updatedGroup);
    setGroups((prev) => prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
    triggerDemoToast(
      'Política de Impartición Actualizada',
      next
        ? 'Todas las clases del grupo se imparten siempre con los alumnos que asistan.'
        : 'Las clases requerirán confirmación si hay más de 2 ausencias.',
      'info'
    );
  };

  // Helper to regenerate course sessions
  const handleRegenerateSessions = () => {
    if (!selectedGroupDetail) return;
    const sessions = generateSessionsForGroup(
      selectedGroupDetail.name,
      selectedGroupDetail.type,
      selectedGroupDetail.days,
      selectedGroupDetail.schedule,
      selectedGroupDetail.courtName,
      selectedGroupDetail.coachName,
      selectedGroupDetail.classesPerWeek || selectedGroupDetail.days.length || 2,
      selectedGroupDetail.totalWeeks || (selectedGroupDetail.type === 'course_quarterly' ? 12 : 4)
    );
    const updated = { ...selectedGroupDetail, sessions };
    setSelectedGroupDetail(updated);
    setGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    triggerDemoToast(
      'Calendario de Clases Regenerado',
      `Se han recalculado automáticamente ${sessions.length} clases con fechas correlativas.`,
      'success'
    );
  };

  // Helper to submit student absence
  const handleSubmitAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupDetail || !absenceStudentName) return;

    const notice: SchoolAbsenceNotice = {
      id: `abs-${Date.now()}`,
      studentName: absenceStudentName,
      reason: absenceReason,
      notifiedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status: 'accepted',
      notifiedBy: 'student',
    };

    const targetId = absenceTargetSessionId || selectedGroupDetail.sessions?.[0]?.id || '';
    const updatedSessions = (selectedGroupDetail.sessions || []).map((s) => {
      if (s.id === targetId || (!targetId && s.status === 'scheduled')) {
        return {
          ...s,
          absences: [...(s.absences || []), notice],
        };
      }
      return s;
    });

    const updatedGroup = { ...selectedGroupDetail, sessions: updatedSessions };
    setSelectedGroupDetail(updatedGroup);
    setGroups((prev) => prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));

    triggerDemoToast(
      'Ausencia Notificada',
      `Falta de ${absenceStudentName} registrada para la sesión. Motivo: ${absenceReason}.`,
      'info'
    );
    setIsReportAbsenceModalOpen(false);
    setAbsenceStudentName('');
  };

  // Helper to submit club notice to students
  const handleSubmitClubNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupDetail || !clubNoticeTitle.trim()) return;

    const newNotice: SchoolClubNotice = {
      id: `notice-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      title: clubNoticeTitle,
      message: clubNoticeMessage,
      channel: clubNoticeChannel,
    };

    const updatedNotices = [newNotice, ...(selectedGroupDetail.clubNotices || [])];
    const updatedGroup = { ...selectedGroupDetail, clubNotices: updatedNotices };
    setSelectedGroupDetail(updatedGroup);
    setGroups((prev) => prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));

    triggerDemoToast(
      'Comunicado Emitido a los Alumnos',
      `Notificación enviada a los ${selectedGroupDetail.students.length} alumnos de ${selectedGroupDetail.name} vía ${clubNoticeChannel.toUpperCase()}.`,
      'success'
    );
    setIsClubNoticeModalOpen(false);
    setClubNoticeTitle('');
    setClubNoticeMessage('');
  };

  // Helper to add manual session
  const handleSubmitAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupDetail) return;

    const nextNumber = (selectedGroupDetail.sessions?.length || 0) + 1;
    const newSession: SchoolGroupSession = {
      id: `sess-${Date.now()}`,
      sessionNumber: nextNumber,
      date: sessionFormData.date,
      dayOfWeek: 'Día Extra',
      time: sessionFormData.time,
      courtName: sessionFormData.courtName,
      coachName: sessionFormData.coachName,
      topic: sessionFormData.topic,
      status: 'scheduled',
      absences: [],
      holdClassAnyway: true,
    };

    const updatedSessions = [...(selectedGroupDetail.sessions || []), newSession];
    const updatedGroup = { ...selectedGroupDetail, sessions: updatedSessions };
    setSelectedGroupDetail(updatedGroup);
    setGroups((prev) => prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));

    triggerDemoToast(
      'Clase Adicional Creada',
      `Sesión #${nextNumber} agregada manualmente al calendario del grupo.`,
      'success'
    );
    setIsAddSessionModalOpen(false);
  };

  // Helper to register payment to coach
  const handleOpenCoachPayment = (coach: SchoolCoachItem) => {
    setCoachPaymentCoach(coach);
    setCoachPaymentAmount(coach.accumulatedFees || (coach.weeklyHours * coach.hourlyRate));
    setCoachPaymentConcept(`Liquidación honorarios docencia (${coach.weeklyHours}h)`);
    setIsCoachPaymentModalOpen(true);
  };

  const handleSubmitCoachPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachPaymentCoach) return;

    const paymentRecord: CoachPaymentRecord = {
      id: `pay-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      amount: Number(coachPaymentAmount),
      concept: coachPaymentConcept,
      method: coachPaymentMethod,
      reference: `LIQ-${Date.now().toString().slice(-6)}`,
    };

    const updatedCoaches = coachesList.map((c) => {
      if (c.id === coachPaymentCoach.id) {
        return {
          ...c,
          paymentStatus: 'paid' as const,
          accumulatedFees: 0,
          paymentHistory: [paymentRecord, ...(c.paymentHistory || [])],
        };
      }
      return c;
    });

    setCoachesList(updatedCoaches);

    if (selectedCoachDetail && selectedCoachDetail.id === coachPaymentCoach.id) {
      setSelectedCoachDetail({
        ...selectedCoachDetail,
        paymentStatus: 'paid',
        accumulatedFees: 0,
        paymentHistory: [paymentRecord, ...(selectedCoachDetail.paymentHistory || [])],
      });
    }

    triggerDemoToast(
      'Liquidación Registrada',
      `Se ha abonado ${coachPaymentAmount.toFixed(2)} € a ${coachPaymentCoach.name} mediante ${coachPaymentMethod}.`,
      'success'
    );
    setIsCoachPaymentModalOpen(false);
    setCoachPaymentCoach(null);
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

  // Open Notification to Player Group for Class with open spots
  const handleOpenNotifyGroupForClass = (group: SchoolGroupItem) => {
    setNotifyGroupSchoolItem(group);
    const vacantCount = Math.max(1, group.maxStudents - group.currentStudents);

    // Auto find best matching player group by category / name
    const bestMatchingGroup =
      playerGroups.find((g) =>
        group.levelCategory.toLowerCase().includes(g.category) ||
        g.name.toLowerCase().includes('escuela') ||
        g.name.toLowerCase().includes(group.levelCategory.toLowerCase())
      ) || playerGroups[0];

    const targetGroupId = bestMatchingGroup ? bestMatchingGroup.id : playerGroups[0]?.id || '';
    setSelectedGroupIdForClass(targetGroupId);
    setClassConvocatoriaSubject(`Plaza disponible en ${group.name} (${group.schedule})`);
    setClassConvocatoriaMessage(
      `¡Hola! Quedan ${vacantCount} plaza(s) disponible(s) en la sesión "${group.name}" impartida por ${group.coachName} en ${group.courtName}. Horario: ${group.schedule} (${group.days.join(', ')}). Reserva tu plaza y gestiona el pago de forma inmediata:`
    );
    setClassChannels({ push: true, whatsapp: true, email: false });
  };

  const handleSendClassConvocatoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyGroupSchoolItem) return;

    const targetGroup =
      playerGroups.find((g) => g.id === selectedGroupIdForClass) || playerGroups[0];
    const vacantCount = Math.max(1, notifyGroupSchoolItem.maxStudents - notifyGroupSchoolItem.currentStudents);

    const activeChannels = (Object.entries(classChannels)
      .filter(([, v]) => v)
      .map(([k]) => k) as ('push' | 'whatsapp' | 'email')[]);

    sendGroupConvocatoria({
      groupId: targetGroup.id,
      groupName: targetGroup.name,
      type: 'class',
      relatedId: notifyGroupSchoolItem.id,
      title: classConvocatoriaSubject.trim(),
      message: classConvocatoriaMessage.trim(),
      actionUrl: `https://setmio.com/clase/${notifyGroupSchoolItem.id}`,
      recipientsCount: targetGroup.memberCount,
      channels: activeChannels.length > 0 ? activeChannels : ['push'],
    });

    setNotifyGroupSchoolItem(null);
    triggerDemoToast(
      'Convocatoria Enviada a Grupo',
      `Notificación enviada a los ${targetGroup.memberCount} socios de "${targetGroup.name}" vía ${activeChannels.map((c) => c.toUpperCase()).join(' + ') || 'Push'}. ${vacantCount} plaza(s) convocada(s).`,
      'success'
    );
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
          {/* Header Superior con Botón Volver Rediseñado y Acciones Principales */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedGroupDetail(null)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-2xs font-bold text-xs transition cursor-pointer active:scale-95 group self-start"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>{t('school.backToSchool', 'Volver al Listado de Escuela')}</span>
            </button>

            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              {/* Botón Notificar Ausencia */}
              <button
                type="button"
                onClick={() => {
                  setAbsenceStudentName(selectedGroupDetail.students[0] || '');
                  setAbsenceTargetSessionId(selectedGroupDetail.sessions?.[0]?.id || '');
                  setIsReportAbsenceModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <UserMinus className="w-4 h-4 text-amber-500" />
                <span>Notificar Ausencia</span>
              </button>

              {/* Botón Aviso del Club a Alumnos */}
              <button
                type="button"
                onClick={() => {
                  setClubNoticeTitle(`Aviso para alumnos de ${selectedGroupDetail.name}`);
                  setClubNoticeMessage(`Recordatorio importante para los alumnos inscritos: `);
                  setIsClubNoticeModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-500/30 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4 text-indigo-500" />
                <span>Aviso Club a Alumnos</span>
              </button>

              {/* Botón Pasar Lista Rápido */}
              <button
                type="button"
                onClick={() =>
                  triggerDemoToast(
                    t('school.attendance', 'Pasar Lista de Asistencia'),
                    `Asistencias y firmas guardadas para ${selectedGroupDetail.name}.`,
                    'success'
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t('school.attendance', 'Pasar Lista')}</span>
              </button>

              {/* Editar Curso/Clase */}
              <button
                type="button"
                onClick={() => {
                  setEditingGroup(selectedGroupDetail);
                  setGroupFormData({
                    name: selectedGroupDetail.name,
                    periodicity: selectedGroupDetail.type === 'single_class' ? 'course_monthly' : selectedGroupDetail.type,
                    levelCategory: selectedGroupDetail.levelCategory,
                    coachName: selectedGroupDetail.coachName,
                    schedule: selectedGroupDetail.schedule,
                    days: selectedGroupDetail.days,
                    courtName: selectedGroupDetail.courtName,
                    registrationFee: selectedGroupDetail.registrationFee || 0,
                    memberFee: selectedGroupDetail.memberFee,
                    nonMemberFee: selectedGroupDetail.nonMemberFee,
                    maxStudents: selectedGroupDetail.maxStudents,
                    notes: selectedGroupDetail.notes || '',
                    classesPerWeek: selectedGroupDetail.classesPerWeek || selectedGroupDetail.days.length || 2,
                    totalWeeks: selectedGroupDetail.totalWeeks || (selectedGroupDetail.type === 'course_quarterly' ? 12 : 4),
                  });
                  setIsNewGroupModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                title="Editar datos del curso"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>
          </div>

          {/* Tarjeta Principal de Información Técnica */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                    {selectedGroupDetail.durationLabel}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                    {selectedGroupDetail.levelCategory}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {selectedGroupDetail.days.join(' · ')}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {selectedGroupDetail.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedGroupDetail.notes || 'Entrenamiento metodológico con monitor titulado y seguimiento de evolución técnica.'}
                </p>
              </div>

              {/* Tarifas */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-4 text-right shrink-0">
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
                  <div className="text-[10px] text-slate-500 uppercase font-bold">No Socio</div>
                  <div className="text-sm font-black font-mono text-slate-700 dark:text-slate-300">
                    {selectedGroupDetail.nonMemberFee.toFixed(2)} €
                  </div>
                </div>
              </div>
            </div>

            {/* Parrilla Operativa: Pista, Horario y Profesor */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              {/* Profesor Clicable */}
              <div
                onClick={() => {
                  const coachFound = coachesList.find((c) => c.name === selectedGroupDetail.coachName);
                  if (coachFound) {
                    setSelectedCoachDetail(coachFound);
                    setSelectedGroupDetail(null);
                    setActiveMainTab('coaches');
                  }
                }}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-500/50 transition group"
                title="Ver perfil completo y honorarios del profesor"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Profesor Asignado</div>
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition flex items-center gap-1">
                      <span>{selectedGroupDetail.coachName}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Monitor Titulado FEP</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Horario y Frecuencia */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Horario & Frecuencia</div>
                  <div className="font-bold text-slate-900 dark:text-white font-mono">{selectedGroupDetail.schedule}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedGroupDetail.days.join(', ')} · {selectedGroupDetail.classesPerWeek || 2} clases/sem
                  </div>
                </div>
              </div>

              {/* Pista y Domótica */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Pista & Control de Acceso</div>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedGroupDetail.courtName}</div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 flex items-center gap-1 font-mono font-bold">
                    <span>PIN: 4821#</span>
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-950/80 px-1.5 rounded-xs">Domótica Activa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-navegador de Pestañas del Grupo */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveGroupTab('sessions')}
              className={`py-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeGroupTab === 'sessions'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Sesiones & Clases del Curso ({selectedGroupDetail.sessions?.length || 0})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGroupTab('students')}
              className={`py-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeGroupTab === 'students'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Alumnos Matriculados ({selectedGroupDetail.students.length}/{selectedGroupDetail.maxStudents})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGroupTab('notices')}
              className={`py-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeGroupTab === 'notices'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Avisos & Comunicados ({selectedGroupDetail.clubNotices?.length || 0})</span>
            </button>
          </div>

          {/* CONTENIDO SUBPESTAÑA 1: SESIONES & CLASES DEL CURSO */}
          {activeGroupTab === 'sessions' && (
            <div className="space-y-4">
              {/* Barra de Gestión de Calendario y Frecuencia */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Programación Semanal Automatizada ({selectedGroupDetail.classesPerWeek || 2} clases por semana)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Frecuencia: {selectedGroupDetail.days.join(' y ')} · Total curso: {selectedGroupDetail.sessions?.length || 0} sesiones
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Toggle para impartir clases aunque falten alumnos */}
                  <button
                    type="button"
                    onClick={handleToggleGlobalHold}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      selectedGroupDetail.holdClassAnywayGlobal
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                    title="Permite que el monitor imparta la sesión con los alumnos que asistan"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Impartir clase aunque falten alumnos: {selectedGroupDetail.holdClassAnywayGlobal ? 'SÍ' : 'NO'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRegenerateSessions}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Regenerar Fechas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddSessionModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Añadir Clase Manual</span>
                  </button>
                </div>
              </div>

              {/* Listado de Todas las Clases del Curso */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Clase / Sesión</th>
                        <th className="py-3 px-4">Fecha & Horario</th>
                        <th className="py-3 px-4">Pista & Acceso</th>
                        <th className="py-3 px-4">Profesor</th>
                        <th className="py-3 px-4">Contenido / Temática</th>
                        <th className="py-3 px-4">Ausencias & Asistencia</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {(selectedGroupDetail.sessions || []).map((session) => {
                        const hasAbsences = (session.absences || []).length > 0;
                        return (
                          <tr
                            key={session.id}
                            className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                              session.status === 'in_progress' ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                                  #{session.sessionNumber}
                                </span>
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white">{session.dayOfWeek}</div>
                                  <span
                                    className={`inline-block px-1.5 py-0.2 rounded-xs text-[9px] font-black uppercase ${
                                      session.status === 'completed'
                                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                        : session.status === 'in_progress'
                                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                                  >
                                    {session.status === 'completed'
                                      ? 'Impartida'
                                      : session.status === 'in_progress'
                                      ? 'En Curso Hoy'
                                      : 'Programada'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-mono font-bold text-slate-900 dark:text-white">{session.date}</div>
                              <div className="text-[11px] text-slate-400">{session.time}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 dark:text-white">{session.courtName}</div>
                              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">PIN: 4821#</span>
                            </td>

                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  const coachFound = coachesList.find((c) => c.name === session.coachName);
                                  if (coachFound) {
                                    setSelectedCoachDetail(coachFound);
                                    setSelectedGroupDetail(null);
                                    setActiveMainTab('coaches');
                                  }
                                }}
                                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <span>{session.coachName}</span>
                              </button>
                            </td>

                            <td className="py-3 px-4 max-w-xs">
                              <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                                {session.topic}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              {hasAbsences ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>{session.absences?.length} ausencia(s) notificada(s)</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {session.absences?.[0]?.studentName}: "{session.absences?.[0]?.reason}"
                                  </div>
                                  <div className="pt-0.5">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                        session.holdClassAnyway
                                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-500/30'
                                          : 'bg-rose-50 dark:bg-rose-950 text-rose-600'
                                      }`}
                                    >
                                      {session.holdClassAnyway ? '✓ Se imparte con los asistentes' : 'Pendiente de quorum'}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Pleno Asistencia ({selectedGroupDetail.students.length} alumnos)</span>
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSessionHold(session.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                                    session.holdClassAnyway
                                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 border-slate-300'
                                  }`}
                                  title="Conmutar impartición de clase si faltan alumnos"
                                >
                                  {session.holdClassAnyway ? 'Clase Confirmada' : 'Confirmar Clase'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    triggerDemoToast(
                                      'Lista Registrada',
                                      `Asistencia pasada para la Sesión #${session.sessionNumber} (${session.date}).`,
                                      'success'
                                    )
                                  }
                                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                                  title="Pasar Lista en esta clase"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO SUBPESTAÑA 2: ALUMNOS MATRICULADOS */}
          {activeGroupTab === 'students' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Alumnos Matriculados ({selectedGroupDetail.students.length} de {selectedGroupDetail.maxStudents})
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAbsenceStudentName(selectedGroupDetail.students[0] || '');
                      setIsReportAbsenceModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Registrar Ausencia de Alumno</span>
                  </button>
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
                    {t('school.attendance', 'Pasar Lista')}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {selectedGroupDetail.students.map((studentName, idx) => {
                  const customerMatch = customers.find(
                    (c) => c.name.toLowerCase() === studentName.toLowerCase()
                  );
                  const avatar =
                    customerMatch?.avatarUrl ||
                    `https://images.unsplash.com/photo-${1534528741775 + idx * 200}?auto=format&fit=crop&w=120&q=80`;

                  return (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 group">
                      <button
                        type="button"
                        onClick={() => navigateToPlayerProfile(studentName, 'academy')}
                        className="flex items-center gap-3 text-left cursor-pointer group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition"
                        title="Ver Perfil de Usuario en CRM"
                      >
                        <img
                          src={avatar}
                          alt={studentName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-emerald-500 transition-all shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition flex items-center gap-1.5">
                            <span>{studentName}</span>
                            <span className="text-[10px] text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              → Perfil CRM
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {customerMatch?.isMember ? '⭐ Socio Oficial' : 'Alumno Regular'} · Nivel {customerMatch?.level?.toFixed(2) || '3.50'}
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          {t('school.studentPaid', 'Al Día')}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAbsenceStudentName(studentName);
                            setIsReportAbsenceModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-500/20 hover:bg-amber-100 transition cursor-pointer"
                        >
                          Avisar Ausencia
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateToPlayerProfile(studentName, 'academy')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>Perfil</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lista de Espera */}
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
          )}

          {/* CONTENIDO SUBPESTAÑA 3: AVISOS Y COMUNICADOS DEL CLUB */}
          {activeGroupTab === 'notices' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Historial de Avisos y Comunicaciones del Club
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mensajes enviados a los alumnos sobre cambios de pista, material o convocatorias
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClubNoticeModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Aviso</span>
                </button>
              </div>

              <div className="space-y-3">
                {(selectedGroupDetail.clubNotices || []).length > 0 ? (
                  (selectedGroupDetail.clubNotices || []).map((notice) => (
                    <div
                      key={notice.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{notice.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{notice.date} · Vía {notice.channel.toUpperCase()}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{notice.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No se han emitido comunicados específicos a este grupo todavía.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : selectedCoachDetail ? (
        /* =====================================================================
           DETALLE / PERFIL DEL PROFESOR (CON CALENDARIO Y CONTROL DE PAGOS)
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

            <button
              type="button"
              onClick={() => handleOpenCoachPayment(selectedCoachDetail)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <DollarSign className="w-4 h-4" />
              <span>Registrar Liquidación / Pago a Profesor</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
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

              {/* Badge de Estado de Pago */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-right self-stretch sm:self-auto">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Estado Liquidación</div>
                <div className="mt-1 flex items-center justify-end gap-1.5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      selectedCoachDetail.paymentStatus === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {selectedCoachDetail.paymentStatus === 'paid' ? '✓ Honorarios al Día' : '⏳ Pendiente de Liquidar'}
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
                <div className="text-[10px] text-slate-400 font-bold uppercase">Honorarios Acumulados</div>
                <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {(selectedCoachDetail.accumulatedFees || (selectedCoachDetail.weeklyHours * selectedCoachDetail.hourlyRate)).toFixed(2)} €
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

            {/* Cursos que imparte con Enlace Directo al Grupo */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Grupos y Cursos a su Cargo (Haz clic para ver la ficha del grupo)
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
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition flex items-center gap-1.5">
                          <span>{grp.name}</span>
                          <span className="text-[10px] text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            → Abrir Curso
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">{grp.schedule} · {grp.courtName} · {grp.students.length} alumnos</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition" />
                    </div>
                  ))}
              </div>
            </div>

            {/* Calendario de Clases Asignadas a este Profesor */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Calendario de Clases Programadas con {selectedCoachDetail.name}
                </h3>
                <span className="text-xs text-slate-400">Total de sesiones asignadas en la academia</span>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3">Horario</th>
                      <th className="py-2.5 px-3">Grupo</th>
                      <th className="py-2.5 px-3">Pista</th>
                      <th className="py-2.5 px-3">Tema Técnico</th>
                      <th className="py-2.5 px-3 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {groups
                      .filter((g) => g.coachName === selectedCoachDetail.name)
                      .flatMap((g) => (g.sessions || []).slice(0, 5))
                      .map((sess, sIdx) => (
                        <tr key={sIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{sess.date}</td>
                          <td className="py-2.5 px-3">{sess.time}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{sess.dayOfWeek}</td>
                          <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{sess.courtName}</td>
                          <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">{sess.topic}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                              Confirmada
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Historial de Liquidaciones y Pagos al Profesor */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Historial de Liquidaciones & Pagos al Monitor
                  </h3>
                  <p className="text-xs text-slate-500">Registro contable de transferencias y pagos devengados</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenCoachPayment(selectedCoachDetail)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Abonar Liquidación</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3">Concepto</th>
                      <th className="py-2.5 px-3">Método</th>
                      <th className="py-2.5 px-3">Referencia</th>
                      <th className="py-2.5 px-3 text-right">Importe Abonado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {(selectedCoachDetail.paymentHistory || []).map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{pay.date}</td>
                        <td className="py-2.5 px-3">{pay.concept}</td>
                        <td className="py-2.5 px-3 text-slate-500">{pay.method}</td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{pay.reference}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {pay.amount.toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                Academia & Cursos
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                Escuela de Pádel — {currentTenant.name}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Gestión de cursos mensuales, trimestrales, clases sueltas, profesores y alumnos.
              </p>
            </div>

            {/* Botonera Superior Alineada (Icono único por botón) */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
              {/* 1. Nuevo Grupo */}
              <button
                type="button"
                onClick={() => {
                  setEditingGroup(null);
                  setIsNewGroupModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="Crear grupo periódico con matrícula y cuota"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Grupo</span>
              </button>

              {/* 2. Nueva Clase */}
              <button
                type="button"
                onClick={() => setIsNewClassModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="Publicar clase suelta o clínica"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
                <span>Nueva Clase</span>
              </button>

              {/* 3. Nuevo Alumno */}
              <button
                type="button"
                onClick={() => setIsNewStudentModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="Matricular alumno directamente"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-500" />
                <span>Nuevo Alumno</span>
              </button>

              {/* 4. Nuevo Profesor */}
              <button
                type="button"
                onClick={() => setIsNewCoachModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="Dar de alta nuevo entrenador"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                <span>Nuevo Profesor</span>
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
                const isSingleClass = group.type === 'single_class';

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

                    {/* Acciones de la Tarjeta Reorganizadas y Protegidas contra Desbordamiento */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs mt-3">
                      {/* Fila de gestión de plazas libres (si aplica) con wrap responsivo */}
                      {openSpots > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/20">
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mr-1">
                            Plazas Libres:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenNotifyGroupForClass(group)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-2xs flex items-center gap-1 transition cursor-pointer active:scale-95"
                            title="Convocatoria instantánea a grupos de jugadores (WhatsApp)"
                          >
                            <Megaphone className="w-3 h-3" />
                            <span>Notificar Grupo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmPublishClass(group)}
                            className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-500/30 flex items-center gap-1 transition cursor-pointer"
                            title="Ofertar hueco a jugadores externos"
                          >
                            <Bell className="w-3 h-3 text-emerald-500" />
                            <span>{group.publishedAsOpen ? t('school.publishedSpots', 'Plaza Publicada') : t('school.publishSpots', 'Publicar Plazas')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setInviteModalGroup(group)}
                            className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/70 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold text-[11px] border border-purple-500/30 flex items-center gap-1 transition cursor-pointer"
                            title="Invitar a socios registrados"
                          >
                            <UserPlus className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            <span>{t('school.inviteToCover', 'Invitar')}</span>
                          </button>
                        </div>
                      )}

                      {/* Barra Principal de Acciones: Edición a la izquierda, Botón Dinámico de Detalles a la derecha garantizado dentro de pantalla */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <div className="flex items-center gap-1.5 shrink-0">
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
                                notes: group.notes || '',
                                classesPerWeek: group.classesPerWeek || group.days.length || 1,
                                totalWeeks: group.totalWeeks || (group.type === 'course_quarterly' ? 12 : 4),
                              });
                              setIsNewGroupModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteGroup(group)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-600 transition cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Botón Dinámico de Detalles: "Ver Clase" si es clase, "Ver Curso" si es curso */}
                        <button
                          type="button"
                          onClick={() => setSelectedGroupDetail(group)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
                          title={`Ver detalles de ${isSingleClass ? 'la clase suelta' : 'este curso'}`}
                        >
                          <span>{isSingleClass ? 'Ver Clase' : 'Ver Curso'}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
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
                      {filteredStudents.map((st, sIdx) => {
                        const studentCustomer = customers.find(
                          (c) =>
                            c.name.toLowerCase() === st.name.toLowerCase() ||
                            c.email.toLowerCase() === st.email.toLowerCase()
                        );
                        const fallbackAvatars = [
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
                          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
                        ];
                        const avatarUrl =
                          st.avatarUrl ||
                          studentCustomer?.avatarUrl ||
                          fallbackAvatars[sIdx % fallbackAvatars.length];

                        return (
                          <tr
                            key={st.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                          >
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => navigateToPlayerProfile(st.name, 'academy')}
                                className="flex items-center gap-3 text-left cursor-pointer group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition"
                                title="Ver Perfil de Usuario"
                              >
                                <img
                                  src={avatarUrl}
                                  alt={st.name}
                                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-emerald-500 transition-all shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition flex items-center gap-1.5">
                                    <span>{st.name}</span>
                                    <span className="text-[10px] text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                      → Perfil
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-400">{st.phone}</div>
                                </div>
                              </button>
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
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => navigateToPlayerProfile(st.name, 'academy')}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200/60 dark:border-slate-700"
                                  title="Ver Perfil de Usuario"
                                >
                                  <span>Perfil</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
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
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Barra superior con selector de vista (Tarjetas vs Calendario por Profesor) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCoachCalendarView(false)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      !coachCalendarView
                        ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Fichas de Profesores ({coachesList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoachCalendarView(true)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      coachCalendarView
                        ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <CalendarDays className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Calendario General por Profesor</span>
                  </button>
                </div>

                {coachCalendarView && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">Filtrar por profesor:</span>
                    <select
                      value={selectedCoachFilter}
                      onChange={(e) => setSelectedCoachFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white"
                    >
                      <option value="all">Todos los Profesores</option>
                      {coachesList.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {!coachCalendarView ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCoachDetail(coach)}
                          className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer text-center"
                        >
                          {t('school.coachProfile', 'Ver Perfil y Cursos')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenCoachPayment(coach)}
                          className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
                          title="Abonar liquidación"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Vista de Calendario de Clases Filtrable por Profesor */
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Agenda de Clases de la Escuela {selectedCoachFilter !== 'all' ? `· ${selectedCoachFilter}` : '· Todos los Profesores'}
                      </h3>
                      <p className="text-xs text-slate-400">Vista consolidada de sesiones asignadas por profesor y pista</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Profesor</th>
                          <th className="py-3 px-4">Fecha & Hora</th>
                          <th className="py-3 px-4">Curso / Grupo</th>
                          <th className="py-3 px-4">Pista</th>
                          <th className="py-3 px-4">Tema Pedagógico</th>
                          <th className="py-3 px-4 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {groups
                          .flatMap((grp) =>
                            (grp.sessions || []).map((s) => ({
                              ...s,
                              groupName: grp.name,
                              groupItem: grp,
                            }))
                          )
                          .filter((sess) =>
                            selectedCoachFilter === 'all' ? true : sess.coachName === selectedCoachFilter
                          )
                          .slice(0, 15)
                          .map((sess, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                              <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>{sess.coachName}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-mono font-bold text-slate-900 dark:text-white">{sess.date}</div>
                                <div className="text-[11px] text-slate-400">{sess.time}</div>
                              </td>
                              <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                                {sess.groupName}
                              </td>
                              <td className="py-3 px-4">{sess.courtName}</td>
                              <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{sess.topic}</td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedGroupDetail(sess.groupItem);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-[11px] font-bold transition cursor-pointer"
                                >
                                  Ver Grupo
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
          MODAL: NOTIFICAR A GRUPO DE JUGADORES (CONVOCATORIA PARA CLASE / CURSO)
          ===================================================================== */}
      {notifyGroupSchoolItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Notificar a Grupo de Jugadores
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sustituto oficial de WhatsApp con enlace directo a la inscripción y cobro.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifyGroupSchoolItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha Resumen de la Clase / Sesión */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{notifyGroupSchoolItem.name} · {notifyGroupSchoolItem.schedule}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                  {notifyGroupSchoolItem.maxStudents - notifyGroupSchoolItem.currentStudents} plazas libres
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-emerald-500/20">
                <span>Profesor: <strong>{notifyGroupSchoolItem.coachName}</strong> ({notifyGroupSchoolItem.courtName})</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {notifyGroupSchoolItem.memberFee.toFixed(2)} €/sesión
                </span>
              </div>
            </div>

            <form onSubmit={handleSendClassConvocatoria} className="space-y-4 text-xs">
              {/* Selección del Grupo Registrado */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Seleccionar Grupo de Jugadores Destinatario *
                </label>
                <select
                  value={selectedGroupIdForClass}
                  onChange={(e) => setSelectedGroupIdForClass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                >
                  {playerGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.memberCount} socios · {g.category.toUpperCase()})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  El sistema pre-selecciona automáticamente la lista más afín a la escuela o nivel de la clase.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asunto de la Notificación *
                </label>
                <input
                  type="text"
                  required
                  value={classConvocatoriaSubject}
                  onChange={(e) => setClassConvocatoriaSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mensaje para los Alumnos / Socios *
                </label>
                <textarea
                  rows={3}
                  required
                  value={classConvocatoriaMessage}
                  onChange={(e) => setClassConvocatoriaMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enlace Directo de Inscripción / Pago
                </label>
                <input
                  type="text"
                  readOnly
                  value={`https://setmio.com/clase/${notifyGroupSchoolItem.id}`}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-emerald-600 dark:text-emerald-400 select-all"
                />
              </div>

              {/* Canales Simultáneos */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Canales de Envío Simultáneos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer text-[11px] font-bold">
                    <input
                      type="checkbox"
                      checked={classChannels.push}
                      onChange={(e) => setClassChannels({ ...classChannels, push: e.target.checked })}
                      className="rounded accent-emerald-600"
                    />
                    <span>Notificación Push</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer text-[11px] font-bold">
                    <input
                      type="checkbox"
                      checked={classChannels.whatsapp}
                      onChange={(e) => setClassChannels({ ...classChannels, whatsapp: e.target.checked })}
                      className="rounded accent-emerald-600"
                    />
                    <span>WhatsApp SMS</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer text-[11px] font-bold">
                    <input
                      type="checkbox"
                      checked={classChannels.email}
                      onChange={(e) => setClassChannels({ ...classChannels, email: e.target.checked })}
                      className="rounded accent-emerald-600"
                    />
                    <span>Email Club</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setNotifyGroupSchoolItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Enviar Convocatoria a Grupo</span>
                </button>
              </div>
            </form>
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

      {/* =====================================================================
          MODAL: NUEVO ALUMNO / MATRICULACIÓN
          ===================================================================== */}
      {isNewStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Matricular Nuevo Alumno
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Inscripción de alumno en grupos regulares o clases sueltas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewStudentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Martínez Alarcón"
                  value={studentFormData.name}
                  onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="+34 600 000 000"
                    value={studentFormData.phone}
                    onChange={(e) => setStudentFormData({ ...studentFormData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="carlos@email.com"
                    value={studentFormData.email}
                    onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Nivel de Juego (Escala ELO)
                  </label>
                  <select
                    value={studentFormData.level}
                    onChange={(e) => setStudentFormData({ ...studentFormData, level: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {[1.0, 1.5, 2.0, 2.5, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 5.0, 5.5, 6.0].map((lvl) => (
                      <option key={lvl} value={lvl.toFixed(1)}>
                        Nivel {lvl.toFixed(1)} {lvl <= 2.5 ? '· Iniciación' : lvl <= 4.0 ? '· Intermedio' : '· Avanzado / Competición'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Modalidad
                  </label>
                  <select
                    value={studentFormData.type}
                    onChange={(e) =>
                      setStudentFormData({
                        ...studentFormData,
                        type: e.target.value as 'regular' | 'single',
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="regular">Grupo Regular (Cuota Mensual / Trimestral)</option>
                    <option value="single">Clase Suelta / Sesión Individual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Grupo Asignado
                  </label>
                  <select
                    value={studentFormData.groupName}
                    onChange={(e) => setStudentFormData({ ...studentFormData, groupName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.name}>
                        {g.name} ({g.students.length}/{g.maxStudents} plazas)
                      </option>
                    ))}
                    <option value="Clases Particulares">Clases Particulares (Sin grupo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Estado de Cuota
                  </label>
                  <select
                    value={studentFormData.paymentStatus}
                    onChange={(e) =>
                      setStudentFormData({
                        ...studentFormData,
                        paymentStatus: e.target.value as 'paid' | 'pending' | 'scholarship',
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="paid">Al Día / Pagado</option>
                    <option value="pending">Cuota Pendiente</option>
                    <option value="scholarship">Beca Deportiva Club (0€)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Matricular Alumno</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: NUEVO PROFESOR / ENTRENADOR
          ===================================================================== */}
      {isNewCoachModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Alta de Nuevo Profesor
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Registrar nuevo monitor o entrenador oficial en la academia
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewCoachModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCoachSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Nombre Completo del Profesor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Lucas Domínguez"
                  value={coachFormData.name}
                  onChange={(e) => setCoachFormData({ ...coachFormData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Cargo / Especialidad
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Monitor de Tecnificación"
                    value={coachFormData.roleTitle}
                    onChange={(e) => setCoachFormData({ ...coachFormData, roleTitle: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Titulación Oficial
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Monitor Nacional Nivel 2 FEP"
                    value={coachFormData.certification}
                    onChange={(e) => setCoachFormData({ ...coachFormData, certification: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="+34 655 000 000"
                    value={coachFormData.phone}
                    onChange={(e) => setCoachFormData({ ...coachFormData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="lucas@padelsanmateo.es"
                    value={coachFormData.email}
                    onChange={(e) => setCoachFormData({ ...coachFormData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Tarifa Horaria (€/hora)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="10"
                    value={coachFormData.hourlyRate}
                    onChange={(e) => setCoachFormData({ ...coachFormData, hourlyRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    Horas Semanales Asignadas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={coachFormData.weeklyHours}
                    onChange={(e) => setCoachFormData({ ...coachFormData, weeklyHours: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Biografía & Trayectoria
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve reseña sobre experiencia docente y torneos..."
                  value={coachFormData.bio}
                  onChange={(e) => setCoachFormData({ ...coachFormData, bio: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCoachModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Dar de Alta Profesor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: NOTIFICAR AUSENCIA DE ALUMNO
          ===================================================================== */}
      {isReportAbsenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserMinus className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Notificar Ausencia de Alumno
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReportAbsenceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Registra la falta de asistencia con antelación para que el profesor organice la sesión y la secretaría pueda convocar suplentes si procede.
            </p>

            <form onSubmit={handleSubmitAbsence} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alumno que no asistirá *
                </label>
                <select
                  value={absenceStudentName}
                  onChange={(e) => setAbsenceStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                >
                  {selectedGroupDetail?.students.map((st, sIdx) => (
                    <option key={sIdx} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sesión afectada *
                </label>
                <select
                  value={absenceTargetSessionId}
                  onChange={(e) => setAbsenceTargetSessionId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                >
                  {(selectedGroupDetail?.sessions || []).slice(0, 8).map((sess) => (
                    <option key={sess.id} value={sess.id}>
                      Clase #{sess.sessionNumber} · {sess.date} ({sess.dayOfWeek} {sess.time})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Motivo de la Ausencia *
                </label>
                <select
                  value={absenceReason}
                  onChange={(e) => setAbsenceReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white mb-2"
                >
                  <option value="Motivos de salud / Lesión muscular">Motivos de salud / Lesión muscular</option>
                  <option value="Compromiso laboral / Viaje de empresa">Compromiso laboral / Viaje de empresa</option>
                  <option value="Cuestiones familiares / Personales">Cuestiones familiares / Personales</option>
                  <option value="Aviso preventivo con más de 24h">Aviso preventivo con más de 24h</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
                💡 Al registrar la ausencia, la clase permanecerá activa y el monitor podrá dictar la clase con los alumnos restantes.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportAbsenceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Registrar Notificación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: AVISO DEL CLUB A ALUMNOS
          ===================================================================== */}
      {isClubNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Emitir Comunicado a Alumnos
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsClubNoticeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitClubNotice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título del Comunicado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cambio de pista para la sesión de mañana"
                  value={clubNoticeTitle}
                  onChange={(e) => setClubNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mensaje *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Escribe el mensaje que recibirán los alumnos matriculados..."
                  value={clubNoticeMessage}
                  onChange={(e) => setClubNoticeMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Canal de Notificación
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setClubNoticeChannel('whatsapp')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                      clubNoticeChannel === 'whatsapp'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    WhatsApp SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setClubNoticeChannel('push')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                      clubNoticeChannel === 'push'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    App Push
                  </button>
                  <button
                    type="button"
                    onClick={() => setClubNoticeChannel('email')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                      clubNoticeChannel === 'email'
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
                  onClick={() => setIsClubNoticeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Comunicado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: REGISTRAR LIQUIDACIÓN / PAGO A PROFESOR
          ===================================================================== */}
      {isCoachPaymentModalOpen && coachPaymentCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Liquidar Honorarios a Profesor
                  </h3>
                  <p className="text-[11px] text-slate-500">{coachPaymentCoach.name} · {coachPaymentCoach.hourlyRate.toFixed(2)} €/h</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCoachPaymentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCoachPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Importe a Liquidar (€) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={coachPaymentAmount}
                  onChange={(e) => setCoachPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-black font-mono text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Concepto Contable *
                </label>
                <input
                  type="text"
                  required
                  value={coachPaymentConcept}
                  onChange={(e) => setCoachPaymentConcept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Método de Pago *
                </label>
                <select
                  value={coachPaymentMethod}
                  onChange={(e) => setCoachPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                >
                  <option value="Transferencia bancaria SEPA">Transferencia bancaria SEPA</option>
                  <option value="Remesa Nómina / Proveedores">Remesa Nómina / Proveedores</option>
                  <option value="Efectivo en Caja Club">Efectivo en Caja Club</option>
                  <option value="Cheque / Pagaré">Cheque / Pagaré</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCoachPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirmar y Abonar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: AÑADIR CLASE MANUAL AL GRUPO
          ===================================================================== */}
      {isAddSessionModalOpen && selectedGroupDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Añadir Clase Manual al Grupo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSessionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAddSession} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Temática de la Sesión *
                </label>
                <input
                  type="text"
                  required
                  value={sessionFormData.topic}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, topic: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha (DD/MM/YYYY) *
                  </label>
                  <input
                    type="text"
                    required
                    value={sessionFormData.date}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Horario *
                  </label>
                  <input
                    type="text"
                    required
                    value={sessionFormData.time}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pista Asignada *
                  </label>
                  <select
                    value={sessionFormData.courtName}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, courtName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    {courts.map((court) => (
                      <option key={court.id} value={court.name}>
                        {court.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Profesor / Sustituto *
                  </label>
                  <select
                    value={sessionFormData.coachName}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, coachName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    {coachesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Clase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
