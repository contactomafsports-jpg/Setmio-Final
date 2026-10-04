import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/database';
import {
  X,
  ShieldCheck,
  Building2,
  GraduationCap,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { switchUserRole, setCurrentView, triggerDemoToast, setIsCorporateLanding, t } = useApp();

  if (!isOpen) return null;

  const roles = [
    {
      id: 'superadmin',
      role: 'SUPERADMIN' as UserRole,
      title: 'Superadministrador Setmio HQ',
      subtitle: 'Visión y control global de toda la plataforma SaaS',
      badge: 'Plataforma Global',
      icon: ShieldCheck,
      color: 'from-purple-600 to-indigo-700',
      description: 'Acceso a métricas de todas las sedes, gestión de planes, empresas, pasarela de envíos y dominios.',
      actionView: 'hq' as const,
    },
    {
      id: 'tenant_owner',
      role: 'TENANT_OWNER' as UserRole,
      title: 'Club Admin / Gerente',
      subtitle: 'Gestión integral del Centro de Pádel San Mateo',
      badge: 'Gestión Club',
      icon: Building2,
      color: 'from-emerald-600 to-teal-700',
      description: 'Agenda de pistas, domótica IoT de luces y puertas, torneos, cobros, CRM y configuración del club.',
      actionView: 'admin' as const,
    },
    {
      id: 'coach_independent',
      role: 'COACH' as UserRole,
      title: 'Profesor Independiente / Cliente',
      subtitle: 'Gestiona tu actividad profesional de forma independiente',
      badge: 'Profesor Cliente',
      icon: GraduationCap,
      color: 'from-sky-600 to-cyan-700',
      description: 'Agenda propia, alumnos, clases particulares, cobros y presencia profesional sin depender de un club.',
      actionView: 'coach' as const,
    },
    {
      id: 'coach_club',
      role: 'COACH' as UserRole,
      title: 'Profesor de Club',
      subtitle: 'Escuela de tecnificación, clases particulares y grupos del club',
      badge: 'Profesor de Club',
      icon: GraduationCap,
      color: 'from-indigo-600 to-blue-700',
      description: 'Gestión de alumnos, grupos periódicos, clases sueltas, plazas libres y CRM multisede.',
      actionView: 'coach' as const,
    },
    {
      id: 'player',
      role: 'PLAYER' as UserRole,
      title: 'Jugador / Socio del Club',
      subtitle: 'Experiencia del deportista y cliente en app nativa',
      badge: 'Área Jugador',
      icon: User,
      color: 'from-cyan-600 to-emerald-600',
      description: 'Reservas de pistas, partidas abiertas Play!, torneos inscritos, nivel deportivo y ficha de jugador.',
      actionView: 'player' as const,
    },
  ];

  const handleSelectRole = (r: (typeof roles)[0]) => {
    setIsCorporateLanding(false);
    switchUserRole(r.role);
    setCurrentView(r.actionView);
    onClose();
    triggerDemoToast(
      `${t('demo.title', 'Entorno Demo')}: ${t('register.roles.' + r.id + '.title')}`,
      t(`demo.roles.${r.id}.access`, `Has ingresado al entorno con perfil y permisos de ${r.badge}.`),
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label={t('common.close', 'Cerrar')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('demo.badge', 'Simulador de Roles Setmio')}</span>
          </div>
          <h2 id="role-modal-title" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('demo.heading', 'Selecciona el Rol de Demostración')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('demo.description', 'Explora las interfaces completas y datos reales según cada perfil de usuario en la plataforma.')}
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectRole(item)}
                className="group text-left p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {t(`demo.roles.${item.id}.badge`, item.badge)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {t('register.roles.' + item.id + '.title')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {t('register.roles.' + item.id + '.description')}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>{t('demo.accessAs', 'Acceder como')} {t(`demo.roles.${item.id}.badge`, item.badge)}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {t('demo.note', 'Los usuarios con rol profesional (Admin o Profesor) pueden conmutar a Modo Jugador en cualquier momento con el selector en cabecera.')}
          </span>
        </div>
      </div>
    </div>
  );
};
