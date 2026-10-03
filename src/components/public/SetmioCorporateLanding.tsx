import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
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
    theme,
    toggleTheme,
    language,
    setLanguage,
    switchUserRole,
    setCurrentView,
    triggerDemoToast,
    setIsCorporateLanding,
    setPublicPage,
  } = useApp();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
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

  const navigatePublicRoute = (path: string, page: 'home' | 'features' | 'pricing' | 'blog' | 'contact') => {
    window.history.pushState({}, '', path);
    setPublicPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      '¡Solicitud de Club Recibida!',
      'Hemos preparado la instancia para tu club. Te hemos enviado las credenciales de acceso.',
      'success'
    );
  };

  const handleOpenDemo = () => {
    if (onOpenDemoRoleModal) {
      onOpenDemoRoleModal();
    } else {
      triggerDemoToast('Selector de Demo', 'Abriendo selector de roles...', 'info');
    }
  };

  const handleOpenRegister = () => {
    if (onOpenOnboarding) {
      onOpenOnboarding();
    } else {
      setRegisterModalOpen(true);
    }
  };

  const handleQuickDemoRole = (role: 'SUPERADMIN' | 'TENANT_OWNER' | 'COACH' | 'PLAYER') => {
    switchUserRole(role);
    const view = role === 'SUPERADMIN' ? 'hq' : role === 'TENANT_OWNER' ? 'admin' : role === 'COACH' ? 'coach' : 'player';
    setCurrentView(view);
    triggerDemoToast('Demo Setmio', `Abriendo experiencia de ${view}...`, 'info');
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
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo - Mobile Clean Rule: Only Icon + Setmio Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20 shrink-0">
              S
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate">
                SETMIO
              </div>
              {/* Hidden on mobile, only visible on md+ screens */}
              <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Software de Marca Blanca para Profesionales del Pádel
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => navigatePublicRoute('/funcionalidades', 'features')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              Descubrir funcionalidades
            </button>
            <a href="#soluciones" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Soluciones
            </a>
            <button onClick={() => setPublicPage('pricing')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Precios
            </button>
            <button
              onClick={() => onExploreClub('sanmateo')}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-extrabold flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Demo Club · San Mateo</span>
            </button>
            <button onClick={() => navigatePublicRoute('/contacto', 'contact')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Contacto
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Selector with Official Regional Flags */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-bold"
                title="Cambiar idioma con banderas oficiales"
                aria-label="Seleccionar idioma"
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
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Button: Registrarse (Lleva al onboarding asistido) */}
            <button
              onClick={handleOpenRegister}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition items-center gap-1.5"
            >
              <span>Registrarse</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Global Login */}
            <button
              onClick={onOpenAuth}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition flex items-center gap-1.5"
              title="Acceso de usuarios registrados"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Acceso</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-800"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with perfect viewport boundary */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[9999] bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-label="Menú de Setmio">
            <div className="fixed inset-y-0 right-0 flex h-dvh w-full max-w-sm flex-col overflow-y-auto border-l border-slate-200 !bg-white p-4 text-slate-900 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100 animate-in slide-in-from-right duration-200">
              <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <span className="text-sm font-black tracking-tight">SETMIO</span>
                <button type="button" onClick={() => setMobileMenuOpen(false)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white" aria-label="Cerrar menú">
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {[
                { label: 'Inicio', icon: Home, action: () => navigatePublicRoute('/', 'home') },
                { label: 'Funcionalidades', icon: Sparkles, action: () => navigatePublicRoute('/funcionalidades', 'features') },
                { label: 'Precios', icon: CreditCard, action: () => navigatePublicRoute('/precios', 'pricing') },
                { label: 'Blog', icon: BookOpen, action: () => navigatePublicRoute('/blog', 'blog') },
                { label: 'Contacto', icon: Mail, action: () => navigatePublicRoute('/contacto', 'contact') },
                { label: 'Ver demo', icon: Play, action: handleOpenDemo },
                { label: 'Soluciones', icon: Layers, href: '#soluciones' },
                { label: 'Módulos y domótica', icon: Sliders, href: '#modulos' },
                { label: 'Planes y precios', icon: CreditCard, href: '#precios' },
              ].map(({ label, icon: Icon, action, href }) => (
                <button key={label} onClick={action || (() => { window.location.hash = href!.slice(1); setMobileMenuOpen(false); })} className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition">
                  <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} aria-hidden="true" />
                  <span>{label}</span>
                  <ArrowRight className="ml-auto w-4 h-4 text-slate-400" strokeWidth={1.5} aria-hidden="true" />
                </button>
              ))}
              <button onClick={() => { setMobileMenuOpen(false); onExploreClub('sanmateo'); }} className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition">
                <Building2 className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                <span>Demo Club · San Mateo</span>
                <ArrowRight className="ml-auto w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </nav>

            <div className="mt-3 border-t border-slate-200/70 pt-3 dark:border-slate-800">
              <div className="mb-2 flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Globe className="h-3.5 w-3.5" strokeWidth={1.5} /> Idioma
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button key={item.code} type="button" onClick={() => setLanguage(item.code as SupportedLanguage)} className={`rounded-xl border px-1 py-2 text-[10px] font-bold uppercase transition ${language === item.code ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-300' : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'}`} aria-pressed={language === item.code}>
                    {item.code}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200/70 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenRegister();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-2"
              >
                <span>Registrarse (Onboarding 30 Días)</span>
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
                <span>Acceso Clientes / Socios</span>
              </button>
            </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION CORPORATIVO */}
      <section ref={reveal} className="scroll-reveal relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=2000&q=85')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,20,16,.94),rgba(7,20,16,.78)_48%,rgba(7,20,16,.92))]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(circle_at_50%_20%,rgba(199,243,107,0.18),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-8 backdrop-blur-[2px]">
          {/* Trust Badge - Updated positioning */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Tecnología de Vanguardia para la Industria del Pádel</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] text-balance">
            Software de{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Marca Blanca
            </span>{' '}
            integral para profesionales del pádel.
          </h1>

          {/* Subtitle - Exact copy requirement */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed text-balance">
            Incluye Web Pública, App de Gestión Interna, App para Personal y Clientes, y Agente de IA para web y redes.
          </p>

          {/* CTAs Group */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleOpenFeaturesClick}
              className="px-7 py-4 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-sm shadow-xl shadow-slate-900/20 transition hover:scale-[1.02] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Descubrir funcionalidades</span>
            </button>

            <button
              onClick={handleOpenDemo}
              className="px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition hover:scale-[1.02] flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Ver demo</span>
            </button>

            <button
              onClick={handleOpenRegister}
              className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm border border-slate-300 dark:border-slate-700 shadow-md transition flex items-center gap-2"
            >
              <span>Registrarse</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onExploreClub('sanmateo')}
              className="px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-800 transition flex items-center gap-1.5"
            >
              <><Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" /><span>Ver Web Demo Club · San Mateo</span></>
            </button>
          </div>

          {/* Micro-guarantees */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sin permanencia
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Migración de datos en 24h
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Soporte personalizado 365 días
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
                      https://sanmateo.setmiofinal2.vercel.app/gestion
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>8 pistas activas · 94% ocupación hoy</span>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-semibold">Ingresos Reservas Hoy:</div>
                    <div className="text-2xl font-black text-white font-mono">1.280,00 €</div>
                    <div className="text-[10px] text-emerald-400">+28% vs semana anterior</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-semibold">Partidos Abiertos ("Play!"):</div>
                    <div className="text-2xl font-black text-cyan-400 font-mono">12 creados</div>
                    <div className="text-[10px] text-slate-300">38 jugadores inscritos</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-semibold">Copiloto IA en WhatsApp:</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">146 chats</div>
                    <div className="text-[10px] text-slate-300">Cero llamadas perdidas</div>
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
                Marca Blanca Integral
              </div>
              <div className="text-[11px] text-slate-500">Tu propio dominio, logo y colores oficiales</div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono">
                -85%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                Llamadas a Recepción
              </div>
              <div className="text-[11px] text-slate-500">Reservas y pagos 100% automatizados</div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-teal-600 dark:text-cyan-400 font-mono">
                +32%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                Ocupación en Horas Valle
              </div>
              <div className="text-[11px] text-slate-500">Con partidos nivelados automáticos</div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono">
                99.98%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                Disponibilidad SLA
              </div>
              <div className="text-[11px] text-slate-500">Infraestructura Vercel & Supabase Cloud</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUCIONES POR PERFIL (Clubes, Profesores, Jugadores) */}
      <section ref={reveal} id="soluciones" className="scroll-reveal py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Arquitectura 360°
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Una solución diseñada a medida para cada protagonista del pádel
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Conecta la gestión de tus instalaciones, el negocio de tus entrenadores y la pasión de tus jugadores en un único ecosistema sincronizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Clubes */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-emerald-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Clubes de Pádel</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Control absoluto de instalaciones, socios y facturación con marca blanca completa.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Cuadrante táctil de pistas con encendido domótico de iluminación LED</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Split payments (cobro de 1/4 por jugador vía Bizum y tarjeta)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>TPV Bar / Cafetería y Tienda oficial con servicio de test de palas</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Gestor de torneos con cuadros automáticos y rankings sociales</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Profesores */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-emerald-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Profesores & Academias</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Herramientas profesionales para impartir clases, evaluar alumnos y cobrar sin retrasos.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Cobro recurrente mensual de cuotas de escuela por tarjeta o domiciliación</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Control de asistencia y recuperación de clases canceladas por lluvia</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Ficha técnica y seguimiento de nivel de juego por alumno</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Portal web privado propio para entrenadores independientes</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Jugadores */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:border-emerald-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Jugadores Particulares</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                App PWA instalable sin descargas pesadas para jugar más, competir y mejorar.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span>Reserva en 3 clics con selección visual de pistas y compañeros</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span>Partidos abiertos ("Play!") con filtro por nivel exacto y posición</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span>Inscripción a torneos con búsqueda de pareja en base de socios</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span>Monedero digital recargable y perfil deportivo público compartible</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. VÍDEO DESTACADO DE PÁDEL */}
      <section ref={reveal} className="scroll-reveal py-20 bg-slate-950 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[.8fr_1.2fr] gap-10 items-center">
          <div className="space-y-5">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Tecnología que se siente en pista</div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">El juego profesional, dentro de tu operación.</h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">Descubre cómo una experiencia digital premium convierte cada reserva, clase y competición en una relación más sólida con tus jugadores.</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl aspect-video">
            <video className="h-full w-full object-cover" autoPlay muted loop playsInline controls preload="metadata" poster="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1600&q=80" aria-label="Partido profesional de pádel">
              <source src="https://cdn.coverr.co/videos/coverr-a-padel-match-1573/1080p.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* 6. MÓDULOS TECNOLÓGICOS DIFERENCIALES */}
      <section id="modulos" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Tecnología de Vanguardia
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Todo lo que tu club necesita en una sola suscripción
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Zap className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Domótica IoT Inteligente</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enciende las luces de pista 5 minutos antes y apágalas al terminar. Ahorra hasta un 40% en tu factura eléctrica mensual.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <CreditCard className="w-6 h-6 text-teal-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Split Payments 1/4</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El organizador no tiene que adelantar el dinero. La app envía enlaces de pago a los 4 jugadores por Bizum o tarjeta.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Bot className="w-6 h-6 text-purple-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Copiloto IA en WhatsApp</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Atiende a tus clientes las 24 horas del día por WhatsApp oficial. Informa de pistas libres, tarifas y resuelve dudas automáticamente.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Gestor de Torneos & Rankings</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cuadros de eliminación, liguillas, pozos y rankings sociales con suma de puntos automática y cartelería descargable.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <ShoppingBag className="w-6 h-6 text-rose-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Tienda & Test Center</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Catálogo con reserva de palas de test para que los jugadores prueben el material en pista antes de comprar en recepción.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Globe className="w-6 h-6 text-cyan-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Marca Blanca & Dominio Propio</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Conecta tu dominio personalizado (ej: padelsanmateo.com) y adapta los colores, logotipos y textos sin menciones técnicas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLANES Y PRECIOS TRANSPARENTES (60-80€/mes Base) */}
      <section id="precios" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Tarifas Claras Sin Comisiones Ocultas
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Planes adaptados a la dimensión real de tu club
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Todos los planes incluyen actualizaciones gratuitas, soporte telefónico y app móvil PWA.
          </p>

          {/* Billing selector */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Facturación Mensual
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-12 h-6 rounded-full bg-emerald-600 transition p-0.5"
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Facturación Anual <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">(Ahorra 2 meses)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* Plan 1: Coach */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase">Entrenadores</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Coach / Academia</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {billingCycle === 'yearly' ? '32 €' : '39 €'}
                </span>
                <span className="text-xs text-slate-500">/mes</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Para entrenadores individuales y pequeñas escuelas sin instalaciones propias.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Hasta 40 alumnos activos</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Cobro recurrente de cuotas</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Cuadrante de clases particulares</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setSelectedPlanId('starter');
                setRegisterModalOpen(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Elegir Coach
            </button>
          </div>

          {/* Plan 2: Club Base (Requisito 60-80€/mes) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 flex flex-col justify-between shadow-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider">
              Más Demandado
            </div>
            <div className="space-y-4">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Club Base</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Plan Club Base</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {billingCycle === 'yearly' ? '65 €' : '79 €'}
                </span>
                <span className="text-xs text-slate-500">/mes</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Ideal para clubes de hasta 4 pistas que desean informatizar sus reservas y cobros.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Hasta 4 pistas</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Reservas ilimitadas online</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Web y App de marca blanca</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Split payments y Bizum</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Partidos abiertos "Play!"</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setSelectedPlanId('starter');
                setRegisterModalOpen(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              Empezar Club Base
            </button>
          </div>

          {/* Plan 3: Club Pro */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-bold text-teal-600 dark:text-cyan-400 uppercase">Club Pro</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Plan Club Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {billingCycle === 'yearly' ? '119 €' : '139 €'}
                </span>
                <span className="text-xs text-slate-500">/mes</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Para clubes medianos y grandes que organizan competiciones, escuela y tienda.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Hasta 10 pistas</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Gestor de torneos y rankings</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Módulo de escuela y academia</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Tienda oficial & test center</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Domótica IoT de pistas</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setSelectedPlanId('pro');
                setRegisterModalOpen(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Elegir Club Pro
            </button>
          </div>

          {/* Plan 4: Elite / Cadenas */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Instalación Élite</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Plan Élite / Cadena</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {billingCycle === 'yearly' ? '219 €' : '249 €'}
                </span>
                <span className="text-xs text-slate-500">/mes</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pistas ilimitadas, Copiloto IA 24/7 y soporte de ingeniería prioritario.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Pistas ilimitadas</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Copiloto IA 24/7 en WhatsApp</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Dominio propio SSL gratuito</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> TPV Cafetería y POS físico</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Integración ERP & API REST</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setSelectedPlanId('elite');
                setRegisterModalOpen(true);
              }}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Contactar Élite
            </button>
          </div>
        </div>
      </section>

      {/* 7. DEMO CLUBES & SWITCHER DE ROLES */}
      <section id="demos" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Casos Reales & Demos Interactivas
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Explora cómo funciona en clubes reales
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Accede a la web pública de nuestros clubes clientes o inicia sesión en modo simulación para auditar cada perfil.
            </p>
          </div>

          {/* Club Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80"
                  alt="Centro de Pádel San Mateo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="font-bold text-sm">Centro de Pádel San Mateo</div>
                  <div className="text-xs text-emerald-400">Narón, Galicia · 8 pistas (4 indoor, 3 outdoor)</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Club oficial con escuela federada de adultos y menores, torneos de fin de semana, tienda pro shop con palas de test y cafetería.
              </p>
              <button
                onClick={() => onExploreClub('sanmateo')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Explorar Web Pública del Club</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                  alt="Martín Sánchez Pro"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="font-bold text-sm">Martín Sánchez (WPT Pro Player)</div>
                  <div className="text-xs text-amber-400">FIP Top 20 · Academia de Competición</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Ficha deportiva para atletas de élite, clinics de fin de semana, sponsors oficiales y venta de equipación oficial.
              </p>
              <button
                onClick={() => onExploreClub('martinsanchez')}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <span>Explorar Web del Atleta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Role Simulation Bar */}
          <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 max-w-4xl mx-auto space-y-4 text-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              <span>Simulador de Roles Setmio (Prueba en Vivo)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Haz clic en cualquiera de los perfiles para entrar directamente al software con sus permisos y vistas operativas completas:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <button
                onClick={() => handleQuickDemoRole('SUPERADMIN')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 font-bold text-xs text-slate-900 dark:text-white transition"
              >
                🏢 Superadmin HQ
              </button>
              <button
                onClick={() => handleQuickDemoRole('TENANT_OWNER')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 font-bold text-xs text-slate-900 dark:text-white transition"
              >
                🎾 Gerente Club
              </button>
              <button
                onClick={() => handleQuickDemoRole('COACH')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 font-bold text-xs text-slate-900 dark:text-white transition"
              >
                🎓 Entrenador / Coach
              </button>
              <button
                onClick={() => handleQuickDemoRole('PLAYER')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 font-bold text-xs text-slate-900 dark:text-white transition"
              >
                👤 Jugador / Socio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER CORPORATIVO DE SETMIO */}
      <footer id="contacto" className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">
                S
              </div>
              <span className="text-base font-black text-white">SETMIO PADEL PRO</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Software de Marca Blanca integral para profesionales del pádel. Incluye Web Pública, App de Gestión Interna, App para Personal y Clientes, y Agente de IA para web y redes.
            </p>
            <div className="text-[11px] text-slate-500">
              Desplegado en producción sobre Vercel Edge & Supabase PostgreSQL.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Soluciones</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#soluciones" className="hover:text-white transition">Para Clubes de Pádel</a></li>
              <li><a href="#soluciones" className="hover:text-white transition">Para Escuelas & Profesores</a></li>
              <li><a href="#soluciones" className="hover:text-white transition">Para Jugadores (App PWA)</a></li>
              <li><a href="#modulos" className="hover:text-white transition">Domótica IoT de Pistas</a></li>
              <li><a href="#modulos" className="hover:text-white transition">Copiloto IA 24/7 en WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Plataforma</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#precios" className="hover:text-white transition">Planes & Tarifas</a></li>
              <li><button onClick={() => onExploreClub('sanmateo')} className="hover:text-white transition text-left">Demo Pádel San Mateo</button></li>
              <li><button onClick={onOpenAuth} className="hover:text-white transition text-left">Login Global de Socios</button></li>
              <li><button onClick={() => setRegisterModalOpen(true)} className="hover:text-white transition text-left">Alta de Nuevo Club</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Contacto & Soporte</h4>
            <p className="text-[11px] text-slate-400 mb-2">
              Atención directa al director del club:
            </p>
            <div className="space-y-1.5 text-[11px]">
              <div className="text-white font-medium">contacto@setmio.com</div>
              <div>+34 981 38 00 00</div>
              <div className="text-emerald-400">Soporte técnico 24/7 activo</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} SETMIO PADEL PRO SaaS. Todos los derechos reservados. Cumplimiento RGPD & Certificación SSL.
        </div>
      </footer>

      {/* 9. MODAL REGISTRO DE NUEVO CLUB */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setRegisterModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Alta de Club en Setmio</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Comienza tus 30 días de prueba gratis
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Configura tu club en menos de 2 minutos. Sin tarjeta de crédito requerida.
              </p>
            </div>

            <form onSubmit={handleRegisterClubSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Nombre Oficial del Club</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Pádel San Mateo"
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
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Subdominio Setmio</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="sanmateo"
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
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Número de Pistas</label>
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
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Ciudad / Municipio</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Narón (A Coruña)"
                  value={clubCity}
                  onChange={(e) => setClubCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Email de Contacto</label>
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
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Teléfono / WhatsApp</label>
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
                  <span>Activar Mi Club en Setmio (30 Días Gratis)</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-normal">
                Al registrarte aceptas las Condiciones de Servicio y la Política de Privacidad de Setmio.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
