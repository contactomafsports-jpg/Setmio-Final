import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Calendar,
  Users,
  Clock,
  Plus,
  DollarSign,
  TrendingUp,
  Star,
  CheckCircle2,
  Phone,
  MessageCircle,
  Award,
  Search,
  ChevronRight,
  X,
  ExternalLink,
  Sun,
  Moon,
  Home,
  Check,
  User,
  Menu,
} from 'lucide-react';

interface PrivateClass {
  id: string;
  type: 'individual' | 'pair' | 'group_monthly';
  studentName: string;
  studentPhone: string;
  courtName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  status: 'confirmed' | 'completed' | 'canceled';
  focusTopic: string;
}

const INITIAL_CLASSES: PrivateClass[] = [
  {
    id: 'pc-1',
    type: 'individual',
    studentName: 'Carlos Méndez',
    studentPhone: '+34 644 55 66 77',
    courtName: 'Pista 1 — Central Panorámica WPT',
    date: 'Hoy',
    time: '17:00 - 18:00',
    durationMinutes: 60,
    price: 38.0,
    status: 'confirmed',
    focusTopic: 'Transición defensa-ataque y bandeja cruzada con efecto lateral.',
  },
  {
    id: 'pc-2',
    type: 'pair',
    studentName: 'Brais Quintana & Marcos Seijo',
    studentPhone: '+34 622 11 00 99',
    courtName: 'Pista 2 — Panorámica Pro',
    date: 'Hoy',
    time: '18:30 - 19:30',
    durationMinutes: 60,
    price: 48.0,
    status: 'confirmed',
    focusTopic: 'Compenetración en la red y cobertura del centro en juego rápido.',
  },
  {
    id: 'pc-3',
    type: 'group_monthly',
    studentName: 'Grupo Adultos Perfeccionamiento (4 plazas)',
    studentPhone: '+34 600 00 00 00',
    courtName: 'Pista 3 — Panorámica Pro',
    date: 'Mañana',
    time: '19:30 - 20:30',
    durationMinutes: 60,
    price: 65.0,
    status: 'confirmed',
    focusTopic: 'Salida de pared con rebote alto y bajada agresiva.',
  },
  {
    id: 'pc-4',
    type: 'individual',
    studentName: 'Lucía Casal',
    studentPhone: '+34 688 22 33 44',
    courtName: 'Pista 7 — Individual 1 vs 1',
    date: '2026-10-02',
    time: '11:00 - 12:00',
    durationMinutes: 60,
    price: 38.0,
    status: 'confirmed',
    focusTopic: 'Corrección de empuñadura continental y volea de revés profunda.',
  },
];

const STUDENTS = [
  {
    id: 'st-1',
    name: 'Carlos Méndez',
    level: 3.85,
    sessionsCount: 12,
    hand: 'Diestro',
    position: 'Drive',
    phone: '+34 644 55 66 77',
    notes: 'Excelente volea. Debe flexionar más las piernas en salida de pared de fondo.',
  },
  {
    id: 'st-2',
    name: 'Brais Quintana',
    level: 3.6,
    sessionsCount: 8,
    hand: 'Diestro',
    position: 'Revés',
    phone: '+34 622 11 00 99',
    notes: 'Muy rápido en la red. Trabajando la paciencia en los intercambios largos.',
  },
  {
    id: 'st-3',
    name: 'Lucía Casal',
    level: 2.9,
    sessionsCount: 6,
    hand: 'Diestra',
    position: 'Drive',
    phone: '+34 688 22 33 44',
    notes: 'Iniciando juego aéreo (bandeja y remate de colocación). Buena progresión.',
  },
  {
    id: 'st-4',
    name: 'Marcos Seijo',
    level: 3.9,
    sessionsCount: 15,
    hand: 'Zurdo',
    position: 'Drive',
    phone: '+34 611 99 88 77',
    notes: 'Remate por 3 metros muy potente. Ajustando la selección de tiro en situaciones defensivas.',
  },
];

export const CoachPortal: React.FC = () => {
  const {
    currentTenant,
    setCurrentView,
    setPublicPage,
    theme,
    toggleTheme,
    currentUser,
    switchUserRole,
    triggerDemoToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'agenda' | 'students' | 'availability' | 'rates'>('agenda');
  const [classList, setClassList] = useState<PrivateClass[]>(INITIAL_CLASSES);
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');

  // Form states for new class
  const [newType, setNewType] = useState<'individual' | 'pair' | 'group_monthly'>('individual');
  const [newStudent, setNewStudent] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newTime, setNewTime] = useState('16:00 - 17:00');
  const [newCourt, setNewCourt] = useState('Pista 1 — Central Panorámica WPT');
  const [newPrice, setNewPrice] = useState(38);
  const [newTopic, setNewTopic] = useState('');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.trim()) return;

    const created: PrivateClass = {
      id: `pc-${Date.now()}`,
      type: newType,
      studentName: newStudent,
      studentPhone: newPhone || '+34 600 00 00 00',
      courtName: newCourt,
      date: newDate,
      time: newTime,
      durationMinutes: 60,
      price: newPrice,
      status: 'confirmed',
      focusTopic: newTopic || 'Tecnificación general y táctica en pista.',
    };

    setClassList([created, ...classList]);
    setShowNewClassModal(false);
    setNewStudent('');
    setNewTopic('');

    triggerDemoToast(
      'Clase Agendada con Éxito',
      `Se ha reservado pista para la clase con ${created.studentName}.`,
      'success'
    );
  };

  const filteredStudents = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.notes.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-28 md:pb-8">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-base shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Portal del Profesor / Entrenador
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  FEP COACH PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentTenant.shortName} · {currentUser.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Switch to Modo Jugador */}
            <button
              onClick={() => {
                switchUserRole('PLAYER');
                setCurrentView('player');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 transition"
              title="Cambiar a Modo Jugador sin cerrar sesión"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo Jugador</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Cambiar tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCurrentView('public')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Web Pública</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Coach Card with KPIs */}
        <section className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400 shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black">{currentUser.name}</h2>
                  <span className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.95 (48 reseñas)
                  </span>
                </div>
                <p className="text-xs text-indigo-200 font-medium">
                  Directora de Tecnificación & Entrenadora Nacional Nivel 2 FEP
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-300 pt-1">
                  <span>Tarifa base: <strong>38,00 € / hora</strong></span>
                  <span>·</span>
                  <span>Pista preferente: Central WPT</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNewClassModal(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Programar Nueva Clase</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-900/60 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Clases Esta Semana</span>
                <Calendar className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-1">14</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">8 particulares · 6 de grupo</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Alumnos en Seguimiento</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-1">38</div>
              <div className="text-[10px] text-indigo-300 mt-0.5">+4 alumnos este mes</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Ingresos Clases (Mes)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-1">2.150 €</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Cobro 100% garantizado</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Ocupación de Agenda</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-1">84%</div>
              <div className="text-[10px] text-amber-300 mt-0.5">Franjas de tarde completas</div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto pb-px">
          {[
            { id: 'agenda', label: 'Agenda de Clases', icon: Calendar },
            { id: 'students', label: 'Mis Alumnos & Fichas', icon: Users },
            { id: 'availability', label: 'Disponibilidad Semanal', icon: Clock },
            { id: 'rates', label: 'Tarifas & Perfil Público', icon: Award },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-bold transition whitespace-nowrap ${
                activeTab === id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Agenda de Clases */}
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Próximas Sesiones Programadas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Diferenciación automática entre sesiones individuales, parejas y grupos recurrentes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Filtrar:</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                  Todas ({classList.length})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classList.map((cls) => (
                <div
                  key={cls.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            cls.type === 'individual'
                              ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                              : cls.type === 'pair'
                              ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {cls.type === 'individual'
                            ? 'Clase Particular 1 vs 1'
                            : cls.type === 'pair'
                            ? 'Pareja Competición'
                            : 'Grupo Escuela Recurrente'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {cls.date} · {cls.time}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5">
                        {cls.studentName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{cls.courtName}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {cls.price.toFixed(2)} €
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Tarifa entrenador</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                      Objetivo de la sesión:
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {cls.focusTopic}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <a
                      href={`https://wa.me/${cls.studentPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Alumno</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => triggerDemoToast('Asistencia confirmada', 'Registro añadido al historial del alumno.', 'success')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 transition"
                      >
                        Pasar Asistencia
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Mis Alumnos */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Directorio & Seguimiento de Alumnos
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ficha técnica biomecánica, evolución de nivel y notas de entrenamiento.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar alumno o nota técnica..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{st.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>Nivel FEP/Playtomic: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{st.level.toFixed(2)}</strong></span>
                        <span>·</span>
                        <span>{st.hand} ({st.position})</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {st.sessionsCount} sesiones completadas
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                      Diagnóstico del entrenador:
                    </span>
                    <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
                      {st.notes}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">{st.phone}</span>
                    <button
                      onClick={() => {
                        setNewStudent(st.name);
                        setNewPhone(st.phone);
                        setShowNewClassModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-100 transition"
                    >
                      + Agendar Clase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Disponibilidad Semanal */}
        {activeTab === 'availability' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Horario de Disponibilidad para Clases
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Define las franjas horarias en las que los alumnos pueden reservar clases contigo desde la app del club o tu enlace directo.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { day: 'Lunes', hours: '09:00 - 13:00 y 16:30 - 21:30', active: true },
                { day: 'Martes', hours: '09:00 - 13:00 y 16:30 - 21:30', active: true },
                { day: 'Miércoles', hours: '09:00 - 13:00 y 16:30 - 21:30', active: true },
                { day: 'Jueves', hours: '09:00 - 13:00 y 16:30 - 21:30', active: true },
                { day: 'Viernes', hours: '09:00 - 14:00 y 16:00 - 20:00', active: true },
                { day: 'Sábados', hours: '09:30 - 14:00 (Clinics intensivos)', active: true },
                { day: 'Domingos', hours: 'Descanso / Competición oficial', active: false },
              ].map((sch) => (
                <div
                  key={sch.day}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{sch.day}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-3">{sch.hours}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${sch.active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                    {sch.active ? 'Disponible' : 'Cerrado'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => triggerDemoToast('Disponibilidad Guardada', 'Tus horarios se han actualizado en el motor de reservas.', 'success')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
            >
              Guardar Cambios de Horario
            </button>
          </div>
        )}

        {/* Tab 4: Tarifas & Perfil Público */}
        {activeTab === 'rates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tarifas de Clases del Profesor
              </h3>
              <p className="text-slate-500">
                Configura los precios por hora para clases individuales, parejas y grupos.
              </p>

              <div>
                <label className="block font-semibold mb-1">Clase Particular Individual (1 alumno)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={38}
                    className="w-28 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold font-mono text-sm"
                  />
                  <span>€ / hora</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Clase en Pareja (2 alumnos)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={48}
                    className="w-28 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold font-mono text-sm"
                  />
                  <span>€ / hora (24 € / alumno)</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Bono 5 Clases Individuales (Descuento 10%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={170}
                    className="w-28 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold font-mono text-sm"
                  />
                  <span>€ total</span>
                </div>
              </div>

              <button
                onClick={() => triggerDemoToast('Tarifas Actualizadas', 'Los nuevos precios se aplican a próximas reservas.', 'success')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Actualizar Tarifas
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Plan Setmio para Profesores Independientes
              </h3>
              <p className="text-slate-500 leading-relaxed">
                ¿Das clases en varios clubes o pistas públicas? Utiliza Setmio Coach para gestionar tus propios alumnos, cobros con tarjeta y reservas sin depender de ningún software de terceros.
              </p>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-indigo-950 dark:text-indigo-200">Setmio Coach Pro</span>
                  <span className="font-black text-base text-indigo-700 dark:text-indigo-400">29 € / mes</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Alumnos y clases ilimitadas
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Pasarela de cobro directo a tu cuenta bancaria
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Enlace web y app propia para compartir en Instagram
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Recordatorios automáticos por WhatsApp a los alumnos
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Enlace de Reserva Directa:</div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                    setmio.com/coach/laurasenra
                  </div>
                </div>
                <button
                  onClick={() => triggerDemoToast('Enlace Copiado', 'Copiado al portapapeles para compartir con alumnos.', 'success')}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border text-xs font-semibold"
                >
                  Copiar Link
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Programar Nueva Clase */}
      {showNewClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Programar Nueva Clase
                </h3>
                <p className="text-slate-500">Añade una sesión a tu calendario oficial.</p>
              </div>
              <button onClick={() => setShowNewClassModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Tipo de Clase</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'individual', label: '1 vs 1' },
                    { id: 'pair', label: 'Pareja' },
                    { id: 'group_monthly', label: 'Grupo Escuela' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewType(t.id as typeof newType)}
                      className={`py-2 px-3 rounded-xl font-bold border transition text-center ${
                        newType === t.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nombre del Alumno / Grupo</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Carlos Méndez o Grupo Iniciación"
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Horario</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="17:00 - 18:00"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Pista Asignada</label>
                  <select
                    value={newCourt}
                    onChange={(e) => setNewCourt(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Pista 1 — Central Panorámica WPT">Pista 1 — Central WPT</option>
                    <option value="Pista 2 — Panorámica Pro">Pista 2 — Panorámica Pro</option>
                    <option value="Pista 3 — Panorámica Pro">Pista 3 — Panorámica Pro</option>
                    <option value="Pista 7 — Individual 1 vs 1">Pista 7 — Individual 1 vs 1</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tarifa (€)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Objetivo Técnico / Biomecánico</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Salida de pared, colocación del codo en volea de revés..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewClassModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Confirmar Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Navegación móvil del profesor"
        className="md:hidden fixed bottom-0 inset-x-0 z-[60] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 px-1 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] text-[10px] shadow-lg"
      >
        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeTab === 'agenda'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Agenda</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeTab === 'students'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Alumnos</span>
        </button>

        <button
          onClick={() => setShowNewClassModal(true)}
          className="flex flex-col items-center justify-center py-1 text-white"
        >
          <div className="w-10 h-10 -mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">Nueva</span>
        </button>

        <button
          onClick={() => setActiveTab('availability')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            activeTab === 'availability'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span>Horarios</span>
        </button>

        <button
          onClick={() => setShowMoreDrawer(true)}
          className="flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Más</span>
        </button>
      </nav>

      {/* MOBILE MORE DRAWER */}
      {showMoreDrawer && (
        <div className="fixed inset-0 z-[70] flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200" onClick={() => setShowMoreDrawer(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-4 max-h-[85vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">Opciones del Profesor</span>
              </div>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('rates');
                  setShowMoreDrawer(false);
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Tarifas y Perfil Público</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Precios por hora, bio y certificaciones</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  switchUserRole('PLAYER');
                  setCurrentView('player');
                  setShowMoreDrawer(false);
                }}
                className="w-full p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Alternar a Modo Jugador</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Accede a tus reservas personales y partidas</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('public');
                  setShowMoreDrawer(false);
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Ver Web Pública del Club</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Pistas, escuela y torneos visibles</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
