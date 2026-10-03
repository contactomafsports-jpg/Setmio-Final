import React, { useState, useEffect, useRef } from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  Calendar,
  Phone,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  MapPin,
  Trophy,
  GraduationCap,
  Store,
  BookOpen,
  Info,
  Check,
  Globe,
  ChevronDown,
  Building2,
  Briefcase,
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAuth, onOpenDemo }) => {
  const {
    currentTenant,
    currentUser,
    publicPage,
    setPublicPage,
    cart,
    favorites,
    theme,
    toggleTheme,
    setTheme,
    language,
    setLanguage,
    navigateToCorporate,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const currentLangOption = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const mainNavLinks: { id: PublicPage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Inicio', icon: null },
    { id: 'courts', label: 'Pistas', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'academy', label: 'Escuela', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'tournaments', label: 'Torneos', icon: <Trophy className="w-4 h-4" /> },
    { id: 'shop', label: 'Tienda', icon: <Store className="w-4 h-4" /> },
    { id: 'contact', label: 'Contacto', icon: <MapPin className="w-4 h-4" /> },
  ];
  const enabledPublicPages = currentTenant.publicPages ?? ['home', 'courts', 'academy', 'tournaments', 'shop', 'contact'];
  const visibleMainNavLinks = mainNavLinks.filter((link) => enabledPublicPages.includes(link.id));

  const handleNavClick = (pageId: PublicPage) => {
    setPublicPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full max-w-full overflow-x-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo & Name */}
            <button
              onClick={() => handleNavClick('home')}
              className="min-w-0 flex items-center gap-2 text-left focus:outline-none group"
            >
              {currentTenant.branding.logoUrl ? (
                <img src={currentTenant.branding.logoUrl} alt="" className="h-8 w-8 shrink-0 rounded-lg object-contain bg-white border border-slate-200 p-1 group-hover:scale-105 transition-transform" />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-sm shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  {currentTenant.shortName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="max-w-[160px] truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:max-w-none sm:text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {currentTenant.name}
                </div>
              </div>
            </button>

            <button
              onClick={navigateToCorporate}
              className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition border border-slate-200 dark:border-slate-700"
              title="Volver a la plataforma corporativa de Setmio SaaS"
            >
              <span>← Setmio SaaS</span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Navegación principal">
              {visibleMainNavLinks.map((link) => {
                const isActive = publicPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors relative ${
                      isActive
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons & CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Language Selector Dropdown */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-semibold"
                  title="Cambiar idioma de la plataforma"
                  aria-label="Seleccionar idioma"
                >
                  <span className="text-sm leading-none">{currentLangOption?.flag || '🌐'}</span>
                  <span className="hidden sm:inline font-mono uppercase text-[11px] font-bold">
                    {language.toUpperCase()}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      Idioma de la Plataforma
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
                        <span className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <span>{l.name}</span>
                        </span>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="hidden lg:block p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* Favorites Icon: if not logged in -> Auth modal; if logged in -> Cart */}
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                  } else {
                    onOpenCart();
                  }
                }}
                className="relative hidden lg:block p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={!currentUser ? 'Inicia sesión para ver tus favoritos' : 'Ver carrito'}
                aria-label="Favoritos o carrito"
              >
                <Heart className="w-4 h-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={onOpenCart}
                className="relative hidden lg:block p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Ver cesta de compra"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow">
                    {cartItemsCount}
                  </span>
                )}
              </button>



              {/* User Account / Login Button */}
              <button
                onClick={onOpenAuth}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Mi Cuenta</span>
              </button>

              {/* Quick Booking CTA */}
              <button
                onClick={() => handleNavClick('booking')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm shadow-emerald-600/30 transition hover:scale-[1.02]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reservar Pista</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Abrir menú de navegación"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ULTRA-PRO MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden animate-in fade-in duration-200">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 z-[10000] h-dvh w-full max-w-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-250 border-l border-slate-200 dark:border-slate-800">
            {/* Top Bar inside Drawer */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
              {currentTenant.branding.logoUrl ? (
                <img src={currentTenant.branding.logoUrl} alt="" className="w-9 h-9 rounded-xl object-contain bg-white border border-slate-200 p-1" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-sm shadow">
                  {currentTenant.shortName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {currentTenant.shortName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentTenant.city}, {currentTenant.region}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 p-4 sm:p-5 space-y-6">
              <nav aria-label="Navegación del club" className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Club</div>
                {[
                  { id: 'booking' as PublicPage, label: 'Reservar Pista' },
                  { id: 'matches' as PublicPage, label: 'Partidos Abiertos' },
                  { id: 'academy' as PublicPage, label: 'Escuela' },
                  { id: 'tournaments' as PublicPage, label: 'Competición' },
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-[0.98]"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition active:scale-[0.98]"
                >
                  <User className="w-4 h-4" />
                  Registro / Acceso
                </button>
              </nav>

              {/* Highlighted Booking Card */}
              <button
                onClick={() => handleNavClick('booking')}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/20">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-extrabold">Reservar Pista</div>
                    <div className="text-[10px] text-emerald-100 font-normal">
                      8 pistas · Disponibilidad inmediata
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-100" />
              </button>

              {/* Category 1: Instalaciones & Padel */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Instalaciones & Club
                </div>
                {[
                  { id: 'home', label: 'Inicio', desc: 'Resumen y bienvenida al club' },
                  { id: 'club', label: 'El Club', desc: 'Historia, servicios e instalaciones' },
                  { id: 'courts', label: 'Pistas & Tarifas', desc: '8 pistas WPT panorámicas' },
                ].map((item) => {
                  const isActive = publicPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id as PublicPage)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                  );
                })}
              </div>

              {/* Category 2: Partidos & Formación */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Comunidad & Competición
                </div>
                {[
                  { id: 'matches', label: 'Partidos Abiertos "Play!"', desc: 'Únete por nivel o crea tu partida' },
                  { id: 'academy', label: 'Escuela de Pádel', desc: 'Entrenadores FEP, grupos y particulares' },
                  { id: 'tournaments', label: 'Torneos & Ligas', desc: 'Cuadros, brackets e inscripciones' },
                ].map((item) => {
                  const isActive = publicPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id as PublicPage)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                  );
                })}
              </div>

              {/* Category 3: Tienda & Más */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Servicios Oficiales
                </div>
                {[
                  { id: 'shop', label: 'Pro Shop Oficial', desc: 'Palas con test en pista, calzado y textil', count: cartItemsCount },
                  { id: 'blog', label: 'Blog & Consejos', desc: 'Técnica, táctica y torneos' },
                  { id: 'demo', label: 'Ver Demo', desc: 'Conoce la experiencia Setmio' },
                  { id: 'contact', label: 'Contacto & Ubicación', desc: 'Horarios, teléfono y WhatsApp' },
                ].map((item) => {
                  const isActive = publicPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id as PublicPage)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{item.label}</span>
                          {item.count && item.count > 0 ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                              {item.count}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions & Theme Switcher in Mobile Drawer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 space-y-3">
              {/* Theme Mode Selector Switch */}
              <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center gap-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    theme === 'light'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Modo Claro</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Modo Oscuro</span>
                </button>
              </div>

              {/* Commercial Actions: Registrarse vs Contratar Club */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Registrarse / Cuenta</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setPublicPage('club');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Activar Club / Pro</span>
                  </button>
                </div>

              </div>

              {/* Footer info */}
              <div className="text-center text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                <Phone className="w-3 h-3 text-emerald-500" />
                <span>{currentTenant.contactPhone}</span>
                <span>·</span>
                <span>{currentTenant.city}, Galicia</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
