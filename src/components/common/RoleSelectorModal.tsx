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

interface DemoRoleConfig {
  id: string;
  role: UserRole;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  actionView: 'hq' | 'admin' | 'coach' | 'player';
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { switchUserRole, setCurrentView, triggerDemoToast, setIsCorporateLanding, t } = useApp();

  if (!isOpen) return null;

  const rolesMeta: DemoRoleConfig[] = [
    {
      id: 'superadmin',
      role: 'SUPERADMIN' as UserRole,
      icon: ShieldCheck,
      color: 'from-purple-600 to-indigo-700',
      actionView: 'hq',
    },
    {
      id: 'tenant_owner',
      role: 'TENANT_OWNER' as UserRole,
      icon: Building2,
      color: 'from-emerald-600 to-teal-700',
      actionView: 'admin',
    },
    {
      id: 'coach_independent',
      role: 'COACH' as UserRole,
      icon: GraduationCap,
      color: 'from-sky-600 to-cyan-700',
      actionView: 'coach',
    },
    {
      id: 'coach_club',
      role: 'COACH' as UserRole,
      icon: GraduationCap,
      color: 'from-indigo-600 to-blue-700',
      actionView: 'coach',
    },
    {
      id: 'player',
      role: 'PLAYER' as UserRole,
      icon: User,
      color: 'from-cyan-600 to-emerald-600',
      actionView: 'player',
    },
  ];

  const handleSelectRole = (r: DemoRoleConfig) => {
    setIsCorporateLanding(false);
    switchUserRole(r.role);
    setCurrentView(r.actionView);
    onClose();
    const roleTitle = t(`register.roles.${r.id}.title`);
    const roleBadge = t(`demo.roles.${r.id}.badge`);
    triggerDemoToast(
      `${t('demo.title', 'Entorno Demo')}: ${roleTitle}`,
      t(`demo.roles.${r.id}.access`, `${t('demo.accessAs', 'Has ingresado como')} ${roleBadge}.`),
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
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label={t('demo.close', 'Cerrar selector de demo')}
          title={t('demo.close', 'Cerrar')}
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
            {t('demo.heading')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('demo.description')}
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rolesMeta.map((item) => {
            const Icon = item.icon;
            const badgeText = t(`demo.roles.${item.id}.badge`);
            const titleText = t(`register.roles.${item.id}.title`);
            const descText = t(`register.roles.${item.id}.description`);
            return (
              <button
                key={item.id}
                onClick={() => handleSelectRole(item)}
                className="group text-left p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {badgeText}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {titleText}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {descText}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>{t('demo.tryAs', 'Probar como')} {badgeText}</span>
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
            {t('demo.note')}
          </span>
        </div>
      </div>
    </div>
  );
};
