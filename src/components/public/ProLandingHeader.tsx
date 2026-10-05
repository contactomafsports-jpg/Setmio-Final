import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Sun, Moon, ArrowLeft, Share2, Mail } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n';
import { OfficialFlag } from '../common/OfficialFlag';

interface ProLandingHeaderProps {
  onBack?: () => void;
  title?: string;
  badge?: string;
}

export const ProLandingHeader: React.FC<ProLandingHeaderProps> = ({
  onBack,
  title,
  badge = 'Pro Athlete',
}) => {
  const { currentTenant, theme, toggleTheme, language, setLanguage, setPublicPage, triggerDemoToast } = useApp();

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentTenant.branding.heroTitle || 'Perfil Oficial Pro',
        url: window.location.href,
      }).catch(() => {});
    } else {
      triggerDemoToast('Enlace Copiado', 'Se ha copiado el enlace al perfil profesional.', 'info');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Brand / Pro info */}
        <div className="flex items-center gap-3 min-w-0">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPublicPage('home')}
              className="flex items-center gap-2 text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
                S
              </div>
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {title || currentTenant.branding.heroTitle || currentTenant.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800/80 hidden sm:inline-flex items-center gap-1">
                <Trophy className="w-3 h-3 text-emerald-500" />
                {badge}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              {currentTenant.branding.badgeText || 'Circuito Profesional Premier Padel · FIP'}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-800"
            title="Compartir perfil profesional"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Contact button */}
          <a
            href={`mailto:${currentTenant.contactEmail || 'contacto@setmio.com'}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contacto Prensa</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default ProLandingHeader;
