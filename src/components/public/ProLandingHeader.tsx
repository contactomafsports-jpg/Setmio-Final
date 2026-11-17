import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Sun, Moon, ArrowLeft, Share2, Mail } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n';
import { OfficialFlag } from '../common/OfficialFlag';
import { i18n } from '../../i18n';

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
  const [langOpen, setLangOpen] = React.useState(false);

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
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden bg-white/95 dark:bg-[#0B1A2D]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132A45] transition flex items-center justify-center cursor-pointer"
              title="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPublicPage('home')}
              className="flex items-center gap-2 text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0B1A2D] dark:bg-[#B7F229] text-[#B7F229] dark:text-[#0B1A2D] font-extrabold text-sm flex items-center justify-center">
                S
              </div>
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-[#0B1A2D] dark:text-white truncate">
                {title || currentTenant.branding.heroTitle || currentTenant.name}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#B7F229] text-[#0B1A2D] hidden sm:inline-flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {badge}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              {currentTenant.branding.badgeText || 'Circuito Profesional Premier Padel · FIP'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="min-h-[40px] flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#0B1A2D] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132A45] transition border border-slate-200/80 dark:border-[#1A314D] cursor-pointer"
              aria-label="Seleccionar idioma"
            >
              <OfficialFlag code={currentLangObj.code} />
              <span className="hidden sm:inline uppercase text-[11px] font-mono">{currentLangObj.code}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] p-1 z-50 animate-in fade-in-50 duration-100 text-xs">
                {SUPPORTED_LANGUAGES.map((langOpt) => (
                  <button
                    key={langOpt.code}
                    type="button"
                    onClick={() => {
                      i18n.changeLanguage(langOpt.code);
                      setLanguage(langOpt.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition text-left cursor-pointer ${
                      language === langOpt.code
                        ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D] font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132A45]'
                    }`}
                  >
                    <OfficialFlag code={langOpt.code} />
                    <span className="truncate">{langOpt.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-center cursor-pointer"
            title="Compartir perfil profesional"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition flex items-center justify-center cursor-pointer"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#B7F229]" /> : <Moon className="w-4 h-4 text-[#0B1A2D]" />}
          </button>

          <a
            href={`mailto:${currentTenant.contactEmail || 'contacto@setmio.com'}`}
            className="hidden sm:inline-flex min-h-[40px] items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs transition"
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
