import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { i18n } from '../../i18n';
import {
  Sparkles,
  Trophy,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  CreditCard,
  Home,
  BookOpen,
  Building2,
  GraduationCap,
  ShoppingBag,
  Bot,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Star,
  Globe,
  Sliders,
  Sun,
  Moon,
  Lock,
  Layers,
  Phone,
  Mail,
  X,
  Play,
  Check,
  Menu,
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../../lib/i18n';
import { OfficialFlag } from '../common/OfficialFlag';
import { RoleSelectorModal } from '../common/RoleSelectorModal';
import { SetmioLogo } from '../common/SetmioLogo';

interface SetmioCorporateLandingProps {
  onOpenAuth: () => void;
  onExploreClub: (slug: string) => void;
  onOpenDemoRoleModal?: () => void;
  onOpenOnboarding?: () => void;
  onOpenFeatures?: () => void;
}

export const SetmioCorporateLanding: React.FC<SetmioCorporateLandingProps> = ({
  onOpenAuth,
  onExploreClub,
  onOpenDemoRoleModal,
  onOpenOnboarding,
  onOpenFeatures,
}) => {
  const {
    currentTenant,
    tenants,
    plans,
    corporateTheme,
    toggleCorporateTheme,
    language,
    setLanguage,
    switchUserRole,
    setCurrentView,
    triggerDemoToast,
    setIsCorporateLanding,
    setPublicPage,
    t,
  } = useApp();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [localDemoModalOpen, setLocalDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileLanguageOpen, setMobileLanguageOpen] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubSlug, setClubSlug] = useState('');
  const [clubCourts, setClubCourts] = useState(4);
  const [clubCity, setClubCity] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const langRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const reveal = (element: HTMLElement | null) => {
    if (element && !revealRefs.current.includes(element)) revealRefs.current.push(element);
  };

  const navigatePublicRoute = (path: string, page: Parameters<typeof setPublicPage>[0]) => {
    window.history.pushState({}, '', path);
    setPublicPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : previousOverflow;
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleRegisterClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterModalOpen(false);
    triggerDemoToast(
      t('home.registerToast.title'),
      t('home.registerToast.desc'),
      'success'
    );
  };

  const handleOpenDemo = () => {
    if (onOpenDemoRoleModal) {
      onOpenDemoRoleModal();
    } else {
      triggerDemoToast(t('demo.selectorToastTitle', 'Demo selector'), t('demo.selectorToastDescription', 'Opening role selector...'), 'info');
    }
  };

  const handleOpenRegister = () => {
    onOpenOnboarding?.();
  };

  const handleQuickDemoRole = (role: 'SUPERADMIN' | 'TENANT_OWNER' | 'COACH' | 'PLAYER') => {
    switchUserRole(role);
    const view = role === 'SUPERADMIN' ? 'hq' : role === 'TENANT_OWNER' ? 'admin' : role === 'COACH' ? 'coach' : 'player';
    setCurrentView(view);
    triggerDemoToast(t('demo.experienceToastTitle', 'Setmio Demo'), `${t('demo.experienceToastDescription', 'Opening the')} ${view} ${t('demo.experienceToastSuffix', 'experience...')}`, 'info');
  };

  const handleOpenFeaturesClick = () => {
    if (onOpenFeatures) {
      onOpenFeatures();
    } else {
      setPublicPage('features');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 w-full max-w-full">
      {/* 1. TOP HEADER / NAVBAR CORPORATIVA */}
      <header aria-hidden="true" className="hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo Oficial SETMIO PÁDEL */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <SetmioLogo variant="horizontal" size="md" showSubtitle={true} />
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => navigatePublicRoute('/funcionalidades', 'features')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              {t('home.hero.discover_features', 'Descubrir funcionalidades')}
            </button>
            <button onClick={() => navigatePublicRoute('/soluciones', 'solutions')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              {t('nav.solutions', 'Soluciones')}
            </button>
            <button onClick={() => navigatePublicRoute('/precios', 'pricing')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              {t('nav.pricing', 'Precios')}
            </button>
            <button onClick={() => navigatePublicRoute('/contacto', 'contact')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              {t('nav.contact', 'Contacto')}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Selector with Official Regional Flags */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-bold"
                title={t('nav.language')}
                aria-label={t('nav.language')}
              >
                <OfficialFlag code={language} className="w-4 h-3 sm:w-5 sm:h-3.5" />
                {/* On mobile show only 2 initials */}
                <span className="font-mono text-[11px] uppercase tracking-wider">
                  {language.toUpperCase()}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Idiomas & Banderas Oficiales
                  </div>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        i18n.changeLanguage(l.code);
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                        language === l.code
                          ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/60 dark:bg-emerald-950/40'
                          : 'text-slate-700 dark:text-slate-300 font-medium'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <OfficialFlag code={l.code} className="w-4 h-3" />
                        <span>{l.name}</span>
                      </span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleCorporateTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={corporateTheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {corporateTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Button: Registrarse (Lleva al onboarding asistido) */}
            <button
              onClick={handleOpenRegister}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition items-center gap-1.5"
            >
              <span>{t('nav.register', 'Registrarse')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Global Login */}
            <button
              onClick={onOpenAuth}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition flex items-center gap-1.5"
              title={t('nav.accessTitle')}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">{t('nav.access')}</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-800"
              aria-label={t('nav.openMenu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with perfect viewport boundary */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[9999] overscroll-none bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-label={t('nav.mobileMenu')} data-modal="true" onWheel={(event) => event.stopPropagation()} onTouchMove={(event) => event.stopPropagation()}>
            <div className="fixed inset-y-0 right-0 flex h-dvh w-full max-w-sm flex-col overscroll-contain overflow-y-auto border-l border-slate-200 bg-white p-4 text-slate-900 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-200">
              <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <span className="text-sm font-black tracking-tight">SETMIO</span>
                <button type="button" onClick={() => setMobileMenuOpen(false)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white" aria-label={t('nav.closeMenu')}>
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {[
                { label: t('nav.home', 'Inicio'), icon: Home, action: () => navigatePublicRoute('/', 'home') },
                { label: t('nav.solutions', 'Soluciones'), icon: Layers, action: () => navigatePublicRoute('/soluciones', 'solutions') },
                { label: t('home.hero.discover_features', 'Descubrir funcionalidades'), icon: Sparkles, action: () => navigatePublicRoute('/funcionalidades', 'features') },
                { label: t('nav.modules', 'Módulos y domótica'), icon: Sliders, action: () => navigatePublicRoute('/modulos-domotica', 'modules') },
                { label: t('nav.blog', 'Blog'), icon: BookOpen, action: () => navigatePublicRoute('/blog', 'blog') },
                { label: t('nav.demo', 'Ver demo'), icon: Play, action: handleOpenDemo },
                { label: t('nav.pricing', 'Precios'), icon: CreditCard, action: () => navigatePublicRoute('/precios', 'pricing') },
                { label: t('nav.contact', 'Contacto'), icon: Mail, action: () => navigatePublicRoute('/contacto', 'contact') },
              ].map(({ label, icon: Icon, action }) => (
                <button key={label} onClick={action} className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition">
                  <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} aria-hidden="true" />
                  <span>{label}</span>
                  <ArrowRight className="ml-auto w-4 h-4 text-slate-400" strokeWidth={1.5} aria-hidden="true" />
                </button>
              ))}

            </nav>

            <div className="mt-3 border-t border-slate-200/70 pt-3 dark:border-slate-800">
              <button type="button" onClick={() => setMobileLanguageOpen((open) => !open)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-expanded={mobileLanguageOpen}>
                <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-emerald-600" strokeWidth={1.5} /> {t('nav.languageLabel')} {SUPPORTED_LANGUAGES.find((item) => item.code === language)?.name ?? 'Español'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileLanguageOpen && (
                <div className="mt-1 space-y-1 rounded-xl bg-slate-50 p-2 dark:bg-slate-900">
                  {SUPPORTED_LANGUAGES.map((item) => (
                    <button key={item.code} type="button" onClick={() => { i18n.changeLanguage(item.code); setLanguage(item.code); setMobileLanguageOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition ${language === item.code ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800'}`} aria-pressed={language === item.code}>
                      <span className="flex items-center gap-2"><span>{item.flag}</span>{item.name}</span><span className="font-mono uppercase text-[10px] text-slate-400">{item.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200/70 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenRegister();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-2"
              >
                <span>{t('nav.signUp')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('nav.userAccess')}</span>
              </button>
            </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION CORPORATIVO SETMIO PÁDEL (image_16.png) */}
      <section ref={reveal} className="scroll-reveal relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-[#0B1A2D] border-b border-[#1A314D] text-white">
        {/* Padel Court Background Image with Deep Navy tint */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=2000&q=85')" }}
          aria-hidden="true"
        />
        {/* Destellos de Luz Geométricos en Violeta (#8B5CF6) y Verde Lima (#87F229) de image_16.png */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A2D]/90 via-[#0B1A2D]/70 to-[#0B1A2D]" aria-hidden="true" />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Haz angular superior violeta */}
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.35)_0%,transparent_65%)] blur-2xl" />
          {/* Haz angular inferior verde lima */}
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(135,242,41,0.22)_0%,transparent_65%)] blur-2xl" />
          {/* Rayo de luz diagonal geométrico */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-36 bg-gradient-to-r from-transparent via-[#8B5CF6]/15 to-transparent rotate-[-15deg] blur-xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[#0B1A2D]/80 px-5 py-8 sm:px-8 sm:py-10 backdrop-blur-xl shadow-2xl space-y-6 text-white relative">
            {/* Trust Badge con acento violeta */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1A2D]/90 text-[#c4b5fd] border border-[#8B5CF6]/40 text-xs font-bold shadow-lg shadow-[#8B5CF6]/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#87F229]" />
              <span>{t('home.corporate.trustBadge', 'Tecnología de Vanguardia para la Industria del Pádel')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white max-w-4xl mx-auto leading-[1.08] text-balance drop-shadow-sm">
              {t('corporate.heroTitle', 'Software de Marca Blanca integral para profesionales del pádel.')}
            </h1>

            {/* Subtitle en Inter */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal font-sans leading-relaxed text-balance">
              {t('home.corporate.heroSubtitle', 'Incluye Web Pública, App de Gestión Interna, App para Personal y Clientes, y Agente de IA para web y redes.')}
            </p>

            {/* CTAs Group con Verde Lima (#87F229) y Violeta (#8B5CF6) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {/* Botón de Conversión Principal: Verde Lima (#87F229) con texto oscuro */}
              <button
                type="button"
                onClick={handleOpenRegister}
                className="px-8 py-4 rounded-2xl bg-[#87F229] hover:bg-[#99f846] text-[#0B1A2D] font-black text-sm shadow-xl shadow-[#87F229]/25 hover:shadow-2xl hover:shadow-[#87F229]/40 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t('nav.register', 'Empezar Gratis (30 Días)')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Botón Secundario SaaS: Violeta corporativo (#8B5CF6) */}
              <button
                type="button"
                onClick={handleOpenDemo}
                className="px-7 py-4 rounded-2xl bg-[#8B5CF6] hover:bg-[#7c4def] text-white font-bold text-sm shadow-xl shadow-[#8B5CF6]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t('nav.demo', 'Ver demo interactiva')}</span>
              </button>

              {/* Botón Explorar Funcionalidades */}
              <button
                type="button"
                onClick={handleOpenFeaturesClick}
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm shadow-md backdrop-blur-md transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#87F229]" />
                <span>{t('home.hero.discover_features', 'Descubrir módulos')}</span>
              </button>
            </div>

            {/* Micro-guarantees */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-300 font-semibold pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#87F229]" /> {t('home.corporate.guarantee1', 'Sin permanencia')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#87F229]" /> {t('home.corporate.guarantee2', 'Migración de datos en 24h')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#87F229]" /> {t('home.corporate.guarantee3', 'Soporte personalizado 365 días')}
              </span>
            </div>
          </div>

          {/* Live Platform Preview Mockup */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900 p-2 sm:p-4">
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[11px] ml-2 text-slate-300">
                      https://tu-club.setmio.app/gestion
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{t('home.corporate.mockup.active', '8 pistas activas · 94% ocupación hoy')}</span>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-semibold">{t('home.corporate.mockup.revenueLabel', 'Ingresos Reservas Hoy:')}</div>
                    <div className="text-2xl font-black text-white font-mono">1.280,00 €</div>
                    <div className="text-[10px] text-emerald-400">{t('home.corporate.mockup.revenueTrend', '+28% vs semana anterior')}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-semibold">{t('home.corporate.mockup.matchesLabel', 'Partidos Abiertos ("Play!"):')}</div>
                    <div className="text-2xl font-black text-cyan-400 font-mono">{t('home.corporate.mockup.matchesCreated', '12 creados')}</div>
                    <div className="text-[10px] text-slate-300">{t('home.corporate.mockup.playersJoined', '38 jugadores inscritos')}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-semibold">{t('home.corporate.mockup.aiLabel', 'Copiloto IA en WhatsApp:')}</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{t('home.corporate.mockup.aiChats', '146 chats')}</div>
                    <div className="text-[10px] text-slate-300">{t('home.corporate.mockup.noLostCalls', 'Cero llamadas perdidas')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. METRICAS DE IMPACTO (Sin cifras inventadas como 450 clubes) */}
      <section ref={reveal} className="scroll-reveal py-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                100%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                {t('home.corporate.metric1.title', 'Marca Blanca Integral')}
              </div>
              <div className="text-[11px] text-slate-500">
                {t('home.corporate.metric1.desc', 'Tu propio dominio, logo y colores oficiales')}
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono">
                -85%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                {t('home.corporate.metric2.title', 'Llamadas a Recepción')}
              </div>
              <div className="text-[11px] text-slate-500">
                {t('home.corporate.metric2.desc', 'Reservas y pagos 100% automatizados')}
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-teal-600 dark:text-cyan-400 font-mono">
                +32%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                {t('home.corporate.metric3.title', 'Ocupación en Horas Valle')}
              </div>
              <div className="text-[11px] text-slate-500">
                {t('home.corporate.metric3.desc', 'Con partidos nivelados automáticos')}
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono">
                99.98%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                {t('home.corporate.metric4.title', 'Disponibilidad SLA')}
              </div>
              <div className="text-[11px] text-slate-500">
                {t('home.corporate.metric4.desc', 'Infraestructura Vercel & Supabase Cloud')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SETMIO PRO: SOLUCIONES PROFESIONALES */}
      <section ref={reveal} id="soluciones" className="scroll-reveal py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('home.pro.badge', 'Setmio Pro · Software de Gestión Profesional')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('home.pro.title', 'Una solución profesional diseñada a medida para cada protagonista del pádel')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t('home.pro.subtitle', 'Digitaliza la operación integral de tus instalaciones, profesionaliza la academia de tus entrenadores y gestiona la carrera de atletas de élite en una infraestructura única y sin comisiones.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Clubes */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {t('home.pro.clubsBadge', 'Para Instalaciones Deportivas')}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t('home.pro.clubsTitle', 'Clubes de Pádel')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {t('home.pro.clubsDesc', 'Control absoluto de instalaciones, socios y facturación con marca blanca completa, automatización domótica y cero comisiones por reserva.')}
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/70 dark:border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF1', 'Cuadrante táctil de pistas con encendido domótico de iluminación LED')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF2', 'Split payments (cobro de 1/4 por jugador vía Bizum y tarjeta de crédito)')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF3', 'TPV Bar / Cafetería, arqueos de caja y tienda pro-shop con palas de test')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.clubsF4', 'Gestor de torneos oficiales, ligas sociales, pozos americanos y rankings')}</span>
                </li>
              </ul>
            </div>
            <button onClick={() => navigatePublicRoute('/soluciones/clubes', 'solution_clubs')} className="inline-flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-400 hover:gap-3 transition-all pt-4">
              <span>{t('home.pro.clubsExplore', 'Explorar solución para clubes')}</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Profesores y Academias */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-teal-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                  {t('home.pro.coachesBadge', 'Para Entrenadores & Escuelas')}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t('home.pro.coachesTitle', 'Profesores y Academias')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {t('home.pro.coachesDesc', 'Herramientas profesionales para impartir clases particulares y grupales, evaluar la evolución técnica del alumno y automatizar cobros recurrentes.')}
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/70 dark:border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF1', 'Cobro recurrente mensual o trimestral de cuotas de escuela por domiciliación o tarjeta')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF2', 'Control de asistencia en pista, asignación docente y lista de espera inteligente')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF3', 'Ficha técnica de nivel deportivo, historial de partidos y notas metodológicas')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.coachesF4', 'Portal web propio del profesor para entrenadores individuales y personal trainers')}</span>
                </li>
              </ul>
            </div>
            <button onClick={() => navigatePublicRoute('/soluciones/profesores', 'solution_coaches')} className="inline-flex items-center gap-2 text-xs font-black text-teal-700 dark:text-cyan-400 hover:gap-3 transition-all pt-4">
              <span>{t('home.pro.coachesExplore', 'Explorar solución para profesores')}</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Jugadores Profesionales (Corregido a paleta canónica Setmio: emerald/teal sin tonos naranjas) */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {t('home.pro.proPlayersBadge', 'Atletas Premier Padel & FIP')}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t('home.pro.proPlayersTitle', 'Jugadores Profesionales')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {t('home.pro.proPlayersDesc', 'Gestiona tu carrera deportiva de élite, catálogo de patrocinadores, agenda oficial de torneos FIP y relación directa con sponsors y afición.')}
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/70 dark:border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF1', 'Perfil oficial de atleta y presencia web de marca blanca de alta fidelidad')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF2', 'Calendario de torneos internacionales, clinics de fin de semana y patrocinios')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF3', 'Tienda de equipación oficial firmada y venta de entradas VIP a exhibiciones')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('home.pro.proPlayersF4', 'Estadísticas deportivas, rankings oficiales FIP y difusión multimedia')}</span>
                </li>
              </ul>
            </div>
            <button onClick={() => navigatePublicRoute('/soluciones/jugadores-profesionales', 'solution_pro_players')} className="inline-flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-400 hover:gap-3 transition-all pt-4">
              <span>{t('home.pro.proPlayersExplore', 'Explorar solución profesional')}</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN INDEPENDIENTE: SETMIO PLAYER (JUGADORES PARTICULARES / AMATEURS) CON IMAGEN REAL DE PÁDEL */}
      <section ref={reveal} id="setmio-player" className="scroll-reveal py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-widest">
                <Users className="w-3.5 h-3.5" />
                <span>{t('home.player.badge', 'Setmio Player · Para Jugadores Particulares y Amateurs')}</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t('home.player.title', 'La experiencia definitiva para los apasionados del pádel')}
              </h2>
              
              <p className="text-slate-300 text-base leading-relaxed">
                {t('home.player.subtitle', 'Diseñado exclusivamente para que los jugadores particulares reserven pista en menos de 15 segundos, encuentren rivales de su nivel exacto, gestionen su monedero digital y compitan en los torneos de su club.')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>{t('home.player.f1Title', 'Reserva en 3 clics')}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {t('home.player.f1Desc', 'Cuadrante interactivo en tiempo real con selección visual de compañeros y split payment.')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>{t('home.player.f2Title', 'Partidos Abiertos ("Play!")')}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {t('home.player.f2Desc', 'Únete a partidas niveladas por nivel decimal (ej. 3.75) y posición de revés o drive.')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>{t('home.player.f3Title', 'Monedero Digital & Bonus')}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {t('home.player.f3Desc', 'Recarga saldo con bonificaciones automáticas del club y paga sin sacar la tarjeta bancaria.')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>{t('home.player.f4Title', 'Acceso Domótico QR / PIN')}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {t('home.player.f4Desc', 'Apertura instantánea de puertas y encendido de focos sin pasar por mostrador.')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigatePublicRoute('/para-jugadores', 'players_app')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-200 hover:scale-[1.02] cursor-pointer text-center"
                >
                  <span>{t('home.player.btn', 'Conocer Setmio Player')}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* Recurso visual de alta fidelidad: Jugador real de pádel en pista interactuando con Setmio Player */}
            <div className="relative group">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=1200&q=80"
                  alt={t('home.player.imageAlt')}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Overlay Card: App Setmio Player en tiempo real */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-slate-950 flex items-center justify-center font-black text-xs">
                        SP
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">{t('home.player.cardTitle', 'Setmio Player App')}</div>
                        <div className="text-[10px] text-slate-400">{t('home.player.cardSubtitle', 'Portal móvil de reservas y competición')}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase">
                      {t('common.active247', 'Activo 24/7')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">{t('home.player.nextMatch', 'Próximo Partido')}</div>
                        <div className="text-xs font-bold text-white mt-0.5">{t('home.player.courtInfo', 'Pista 2 Panorámica')}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-cyan-400 font-mono font-bold">19:30h</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">{t('home.player.pinLabel', 'PIN Domótica')}</div>
                        <div className="font-mono text-sm font-black text-emerald-400">8241</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">{t('home.player.levelLabel', 'Nivel')}</span>
                        <div className="font-mono text-xs font-black text-white">3.85</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VÍDEO DESTACADO DE PÁDEL - BENEFICIOS OPERATIVOS (100% Adaptado a Modo Claro y Modo Oscuro) */}
      <section ref={reveal} className="scroll-reveal py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-y border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[.8fr_1.2fr] gap-10 items-center">
          <div className="space-y-5">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              {t('home.corporate.benefitsEyebrow', 'Eficiencia y Automatización Real')}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('home.corporate.benefitsTitle', 'Beneficios operativos reales para la gestión diaria de tu club')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {t('home.corporate.benefitsDesc', 'Descubre cómo una infraestructura de software moderna ahorra cientos de horas en recepción, elimina las reservas no cobradas mediante pasarelas automatizadas y multiplica la ocupación en horas valle sin intervención manual.')}
            </p>
            <div className="space-y-2.5 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('home.corporate.benefitsList1', 'Hasta 40% de ahorro energético en luz de pistas con control domótico IoT')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('home.corporate.benefitsList2', 'Cobro garantizado del 100% de la pista antes de que los 4 jugadores pisen el césped')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('home.corporate.benefitsList3', 'Cero llamadas perdidas gracias al copiloto inteligente en WhatsApp oficial')}</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl aspect-video">
            <video className="h-full w-full object-cover" autoPlay muted loop playsInline controls preload="metadata" poster="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1600&q=80" aria-label={t('home.video.ariaLabel')}>
              <source src="https://cdn.coverr.co/videos/coverr-a-padel-match-1573/1080p.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* 6. MÓDULOS DE LA SUSCRIPCIÓN (Enfoque neutro + Botón a Módulos) */}
      <section id="modulos" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-2">
            <div className="space-y-2 text-center sm:text-left">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {t('home.modules.badge', 'Ecosistema Modular Integral')}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                {t('home.modules.title', 'Todo lo que tu club necesita en una sola suscripción')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                {t('home.modules.subtitle', 'Herramientas diseñadas para operar de forma unificada: gestión de pistas, escuela, competiciones, domótica, TPV y marca blanca en una sola infraestructura sin fricción.')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigatePublicRoute('/modulos', 'features')}
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-bold text-xs shadow-md transition-all flex items-center gap-2 hover:gap-3 cursor-pointer active:scale-95"
            >
              <Sliders className="w-4 h-4 text-emerald-400 dark:text-white" />
              <span>{t('home.modules.viewAll', 'Ver todo')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('home.modules.m1.title', 'Domótica IoT & Automatizaciones')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.modules.m1.desc', 'Control de encendido y apagado de luces LED sincronizado con el calendario de partidos y apertura de puertas por código PIN y QR temporal.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-teal-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('home.modules.m2.title', 'Pagos Divididos (Split Payments)')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.modules.m2.desc', 'Cobro fraccionado a 1/4 por jugador mediante Bizum y tarjeta. Monedero recargable de socios con bonificaciones automáticas.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-purple-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('home.modules.m3.title', 'Copiloto de Atención 24/7 en WhatsApp')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.modules.m3.desc', 'Asistente inteligente conectado a la API oficial de WhatsApp para consultar disponibilidad de pistas, responder dudas frecuentes y formalizar reservas.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-amber-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('home.modules.m4.title', 'Gestor de Torneos, Ligas y Pozos')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.modules.m4.desc', 'Cuadros de competición automáticos, pools americanos, fases de grupos y rankings dinámicos por categorías federadas o sociales.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-rose-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('home.modules.m5.title', 'TPV Físico, Bar y Test Center')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.modules.m5.desc', 'Terminal punto de venta táctil para cafetería y tienda de material, control de stock en tiempo real, arqueos de caja y prueba de palas en pista.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-cyan-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('home.modules.m6.title', 'Marca Blanca & Dominio Propio')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.modules.m6.desc', 'Web pública personalizada, app móvil corporativa con colores e isotipo propios, sin menciones a intermediarios y con dominio web dedicado.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LLAMADA A LA ACCIÓN FINAL PRE-FOOTER (REGISTRO DIRECTO) */}
      <section ref={reveal} className="scroll-reveal py-20 bg-[#0B1A2D] text-white relative overflow-hidden border-t border-[#1A314D]">
        {/* Destellos de luz angulares geométricos en violeta y verde lima */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.22)_0%,transparent_65%)] blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(135,242,41,0.18)_0%,transparent_65%)] blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1A2D]/90 border border-[#8B5CF6]/40 text-[#c4b5fd] text-xs font-black uppercase tracking-widest backdrop-blur-sm shadow-lg shadow-[#8B5CF6]/10">
            <CheckCircle2 className="w-4 h-4 text-[#87F229]" />
            <span>{t('home.prefooter.badge', 'Empieza Hoy Mismo · 30 Días de Prueba Sin Compromiso')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight text-white">
            {t('home.prefooter.title', '¿Listo para llevar la gestión de tu club al siguiente nivel?')}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            {t('home.prefooter.subtitle', 'Sin permanencias, sin comisiones por pista reservada y con soporte técnico telefónico los 365 días del año. Migramos los datos de tu club en menos de 24 horas.')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {/* CTA Principal de Conversión: Verde Lima (#87F229) con texto oscuro */}
            <button
              type="button"
              onClick={handleOpenRegister}
              className="px-9 py-4 rounded-2xl bg-[#87F229] hover:bg-[#97f842] text-[#0B1A2D] font-black text-sm shadow-2xl shadow-[#87F229]/30 hover:shadow-[#87F229]/45 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              <span>{t('home.prefooter.startBtn', 'Crear Cuenta de Club Gratis')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* CTA Secundario: Violeta Tecnológico (#8B5CF6) */}
            <button
              type="button"
              onClick={() => {
                if (onOpenDemoRoleModal) {
                  onOpenDemoRoleModal();
                } else {
                  setLocalDemoModalOpen(true);
                }
              }}
              className="px-8 py-4 rounded-2xl bg-[#8B5CF6] hover:bg-[#7c4def] text-white border border-[#8B5CF6]/40 font-bold text-sm shadow-xl shadow-[#8B5CF6]/25 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t('home.corporate.demoBtn', 'Ver demo interactiva')}</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-emerald-100 font-semibold pt-4">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-white" aria-hidden="true" /> {t('home.prefooter.trust.setup')}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-white" aria-hidden="true" /> {t('home.prefooter.trust.noCard')}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-white" aria-hidden="true" /> {t('home.prefooter.trust.cancel')}
            </span>
          </div>
        </div>
      </section>

      {/* MODAL INTERACTIVO DE DEMO POR ROL */}
      <RoleSelectorModal
        isOpen={localDemoModalOpen}
        onClose={() => setLocalDemoModalOpen(false)}
      />

      {/* 9. MODAL REGISTRO DE NUEVO CLUB */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setRegisterModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label={t('common.close', 'Cerrar')}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>{t('home.corporate.modal.badge', 'Alta de Club en Setmio')}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {t('home.corporate.modal.title', 'Comienza con Setmio')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('home.corporate.modal.subtitle', 'Configura tu club en menos de 2 minutos. Sin tarjeta de crédito requerida.')}
              </p>
            </div>

            <form onSubmit={handleRegisterClubSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">{t('home.corporate.modal.clubNameLabel', 'Nombre Oficial del Club')}</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Club Central Padel"
                  value={clubName}
                  onChange={(e) => {
                    setClubName(e.target.value);
                    if (!clubSlug) {
                      setClubSlug(
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9]/g, '')
                      );
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">{t('home.corporate.modal.subdomainLabel', 'Subdominio Setmio')}</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="club-central"
                      value={clubSlug}
                      onChange={(e) => setClubSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-l-xl px-3 py-2.5 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="bg-slate-200 dark:bg-slate-800 border border-l-0 border-slate-300 dark:border-slate-700 rounded-r-xl px-2.5 py-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      .setmio.app
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">{t('home.corporate.modal.courtsLabel', 'Número de Pistas')}</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={clubCourts}
                    onChange={(e) => setClubCourts(parseInt(e.target.value) || 4)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">{t('home.corporate.modal.cityLabel', 'Ciudad / Municipio')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('home.corporate.modal.cityPlaceholder')}
                  value={clubCity}
                  onChange={(e) => setClubCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">{t('home.corporate.modal.emailLabel', 'Email de Contacto')}</label>
                  <input
                    type="email"
                    required
                    placeholder="gerencia@tuclub.es"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">{t('home.corporate.modal.phoneLabel', 'Teléfono / WhatsApp')}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 00 00 00"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('home.corporate.modal.submitBtn', 'Activar Mi Club en Setmio (30 Días Gratis)')}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-normal">
                {t('home.corporate.modal.termsNotice', 'Al registrarte aceptas las Condiciones de Servicio y la Política de Privacidad de Setmio.')}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
