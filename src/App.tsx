import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';
import { RoleSelectorModal } from './components/common/RoleSelectorModal';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DraggableAIAgent } from './components/common/DraggableAIAgent';
import { WhatsAppFloat } from './components/common/WhatsAppFloat';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';
import { OfflineBanner } from './components/common/OfflineBanner';
import { CartDrawer } from './components/public/CartDrawer';
import { AuthModal } from './components/public/AuthModal';

// Public views
import { HomeView } from './components/public/HomeView';
import { AboutClubView } from './components/public/AboutClubView';
import { CourtsView } from './components/public/CourtsView';
import { BookingFlow } from './components/public/BookingFlow';
import { OpenMatchesView } from './components/public/OpenMatchesView';
import { AcademyView } from './components/public/AcademyView';
import { TournamentsView } from './components/public/TournamentsView';
import { ShopView } from './components/public/ShopView';
import { TeamsView } from './components/public/TeamsView';
import { BlogView } from './components/public/BlogView';
import { ContactFAQView } from './components/public/ContactFAQView';
import { ClubContactFAQView } from './components/public/ClubContactFAQView';
import { LegalView } from './components/public/LegalView';
import { SetmioCorporateLanding } from './components/public/SetmioCorporateLanding';
import { FeaturesView } from './components/public/FeaturesView';
import { PricingView } from './components/public/PricingView';
import { ModulosDomoticaPage } from './components/public/ModulosDomoticaPage';
import { SolucionesPage } from './components/public/SolucionesPage';
import { CorporateLayout } from './components/public/CorporateLayout';
import { PlayerPublicProfileView } from './components/public/PlayerPublicProfileView';
import { ParaJugadoresPage } from './components/public/ParaJugadoresPage';

// Admin views
import { AdminLayout } from './components/admin/AdminLayout';
import { ContextualDashboard } from './components/admin/dashboards/ContextualDashboard';
import { AdminAgenda } from './components/admin/AdminAgenda';
import { AdminCourtsManagement } from './components/admin/AdminCourtsManagement';
import { AllBookingsPage } from './components/admin/AllBookingsPage';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminTeams } from './components/admin/AdminTeams';
import { AdminSchool } from './components/admin/AdminSchool';
import { AdminTournaments } from './components/admin/AdminTournaments';
import { AdminMatches } from './components/admin/AdminMatches';
import { AdminShopOrders } from './components/admin/AdminShopOrders';
import { AdminSmartCourts } from './components/admin/AdminSmartCourts';
import { AdminCafePOS } from './components/admin/AdminCafePOS';
import { AdminWebEditor } from './components/admin/AdminWebEditor';
import { AdminDomains } from './components/admin/AdminDomains';
import { AdminSubscription } from './components/admin/AdminSubscription';
import { AdminSettings } from './components/admin/AdminSettings';

// Player & HQ views
import { PlayerPortal } from './components/player/PlayerPortal';
import { SuperadminHQ } from './components/hq/SuperadminHQ';
import { CoachPortal } from './components/coach/CoachPortal';

import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export function App() {
  const {
    currentView,
    setCurrentView,
    currentTenant,
    publicPage,
    setPublicPage,
    adminTab,
    setAdminTab,
    demoToast,
    clearDemoToast,
    isCorporateLanding,
    navigateToClub,
    currentUser,
    navigateToCorporate,
  } = useApp();

  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [roleSelectorOpen, setRoleSelectorOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const navigatePublic = (path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const closeRegistration = () => {
    setAuthOpen(false);
    setRegistrationOpen(false);
    navigatePublic('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const routeToPage: Record<string, typeof publicPage> = {
      '/': 'home',
      '/funcionalidades': 'features',
      '/registro': 'home',
      '/login': 'home',
      '/soluciones': 'solutions',
      '/soluciones/clubes': 'solution_clubs',
      '/soluciones/escuelas': 'solution_schools',
      '/soluciones/profesores': 'solution_coaches',
      '/soluciones/jugadores': 'players_app',
      '/soluciones/jugadores-profesionales': 'solution_pro_players',
      '/para-jugadores': 'players_app',
      '/jugadores': 'players_app',
      '/modulos': 'features',
      '/domotica': 'modules',
      '/modulos-domotica': 'modules',
      '/demo': 'demo',
      '/blog': 'blog',
      '/contacto': 'contact',
      '/precios': 'pricing',
    };
    const syncRoute = () => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

      // URLs de gestión interna
      if (pathname === '/admin' || pathname === '/gestion') {
        setCurrentView('admin');
        setAdminTab('dashboard');
        return;
      }
      if (pathname === '/admin/partidas' || pathname === '/gestion/partidas') {
        setCurrentView('admin');
        setAdminTab('matches');
        return;
      }
      if (
        pathname === '/admin/reservas/todas' ||
        pathname === '/gestion/todas-las-reservas' ||
        pathname === '/admin/todas-las-reservas'
      ) {
        setCurrentView('admin');
        setAdminTab('all_bookings');
        return;
      }
      if (pathname === '/admin/reservas' || pathname === '/gestion/reservas') {
        setCurrentView('admin');
        setAdminTab('agenda');
        return;
      }
      if (pathname === '/admin/pistas' || pathname === '/gestion/pistas') {
        setCurrentView('admin');
        setAdminTab('courts_management');
        return;
      }
      if (pathname === '/admin/domotica' || pathname === '/gestion/domotica' || pathname === '/gestion/pistas-inteligentes') {
        setCurrentView('admin');
        setAdminTab('courts_management');
        return;
      }
      if (pathname === '/gestion/ajustes/ia' || pathname.endsWith('/ia')) {
        setCurrentView('admin');
        setAdminTab('settings');
        return;
      }
      if (
        pathname === '/admin/socios' ||
        pathname === '/admin/crm' ||
        pathname === '/gestion/socios' ||
        pathname === '/gestion/crm'
      ) {
        setCurrentView('admin');
        setAdminTab('customers');
        return;
      }
      if (pathname.startsWith('/gestion/jugadores/')) {
        setCurrentView('admin');
        setAdminTab('customers');
        return;
      }
      if (
        pathname === '/admin/competiciones' ||
        pathname === '/gestion/competiciones' ||
        pathname.startsWith('/admin/competiciones/') ||
        pathname.startsWith('/gestion/competiciones/') ||
        pathname === '/admin/torneos' ||
        pathname.startsWith('/admin/torneos/') ||
        pathname.startsWith('/gestion/torneos/')
      ) {
        setCurrentView('admin');
        setAdminTab('tournaments');
        return;
      }
      if (pathname === '/gestion/escuela' || pathname === '/admin/escuela') {
        setCurrentView('admin');
        setAdminTab('academy');
        return;
      }
      if (pathname === '/gestion/tpv' || pathname === '/admin/tpv') {
        setCurrentView('admin');
        setAdminTab('pos_cafe');
        return;
      }
      if (
        pathname === '/gestion/tienda' ||
        pathname === '/admin/tienda' ||
        pathname.startsWith('/admin/tienda/') ||
        pathname.startsWith('/gestion/tienda/')
      ) {
        setCurrentView('admin');
        setAdminTab('shop');
        return;
      }
      if (pathname === '/gestion/equipos' || pathname === '/admin/equipos') {
        setCurrentView('admin');
        setAdminTab('teams');
        return;
      }
      if (pathname === '/gestion/ajustes' || pathname === '/admin/ajustes') {
        setCurrentView('admin');
        setAdminTab('settings');
        return;
      }

      const page = routeToPage[pathname];
      if (page === 'demo') {
        setPublicPage('home');
        setRoleSelectorOpen(true);
      } else if (page) {
        setPublicPage(page);
        if (pathname === '/registro') {
          setRegistrationOpen(true);
          setAuthOpen(true);
        } else if (pathname === '/login') {
          setRegistrationOpen(false);
          setAuthOpen(true);
        }
      }
    };
    syncRoute();
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [setPublicPage, setCurrentView, setAdminTab]);

  // Scroll Reset Obligatorio: Al cambiar de página, vista o pestaña, forzar scroll arriba
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView, publicPage, adminTab]);

  useEffect(() => {
    if (isCorporateLanding) return;
    const enabled = currentTenant.publicPages ?? ['home', 'courts', 'academy', 'tournaments', 'shop', 'contact'];
    if (
      ['home', 'courts', 'academy', 'tournaments', 'shop', 'contact'].includes(publicPage) &&
      !enabled.includes(publicPage) &&
      enabled.length > 0
    ) {
      setPublicPage(enabled[0] as typeof publicPage);
    }
  }, [isCorporateLanding, currentTenant.publicPages, publicPage, setPublicPage]);

  const goHome = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setPublicPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Public Page Switcher
  const renderPublicPage = () => {
    switch (publicPage) {
      case 'home':
        return <HomeView />;
      case 'features':
        return <FeaturesView onBack={goHome} />;
      case 'solutions':
      case 'solution_clubs':
      case 'solution_schools':
      case 'solution_coaches':
      case 'solution_players':
      case 'solution_pro_players':
        return <SolucionesPage onOpenRegister={() => { setRegistrationOpen(true); setAuthOpen(true); }} roleId={publicPage === 'solution_clubs' ? 'clubes' : publicPage === 'solution_schools' ? 'escuelas' : publicPage === 'solution_coaches' ? 'profesores' : publicPage === 'solution_players' ? 'jugadores' : publicPage === 'solution_pro_players' ? 'profesionales' : undefined} onOpenRole={(roleId) => setPublicPage(`solution_${roleId === 'clubes' ? 'clubs' : roleId === 'escuelas' ? 'schools' : roleId === 'profesores' ? 'coaches' : roleId === 'jugadores' ? 'players' : 'pro_players'}` as typeof publicPage)} onBack={goHome} onOpenDemo={() => setRoleSelectorOpen(true)} />;
      case 'players_app':
        return <ParaJugadoresPage onBack={goHome} onOpenDemo={() => setRoleSelectorOpen(true)} onOpenRegister={() => { setRegistrationOpen(true); setAuthOpen(true); }} />;
      case 'modules':
        return <ModulosDomoticaPage onBack={goHome} onOpenDemo={() => setRoleSelectorOpen(true)} />;
      case 'demo':
        return <HomeView />;
      case 'pricing':
        return <PricingView onBack={goHome} onOpenDemo={() => setRoleSelectorOpen(true)} onOpenRegister={() => { setRegistrationOpen(true); setAuthOpen(true); }} />;
      case 'player_profile':
        return <PlayerPublicProfileView onBack={() => setPublicPage('teams')} />;
      case 'club':
        return <AboutClubView />;
      case 'courts':
        return <CourtsView />;
      case 'booking':
        return <BookingFlow />;
      case 'matches':
        return <OpenMatchesView />;
      case 'academy':
        return <AcademyView />;
      case 'tournaments':
        return <TournamentsView />;
      case 'teams':
        return <TeamsView />;
      case 'shop':
      case 'product_detail':
        return <ShopView />;
      case 'blog':
      case 'article':
        return <BlogView onBack={goHome} />;
      case 'contact':
        return isCorporateLanding ? <ContactFAQView onBack={goHome} /> : <ClubContactFAQView onBack={goHome} />;
      case 'legal':
        return <LegalView onBack={goHome} />;
      default:
        return <HomeView />;
    }
  };

  // Render Admin Tab Switcher
  const renderAdminTab = () => {
    switch (adminTab) {
      case 'dashboard':
        return <ContextualDashboard />;
      case 'agenda':
        return <AdminAgenda />;
      case 'courts_management':
        return <AdminCourtsManagement />;
      case 'all_bookings':
      case 'bookings':
        return <AllBookingsPage onBackToQuadrant={() => setAdminTab('agenda')} />;
      case 'matches':
        return <AdminMatches />;
      case 'customers':
        return <AdminCustomers />;
      case 'teams':
        return <AdminTeams />;
      case 'academy':
        return <AdminSchool />;
      case 'tournaments':
        return <AdminTournaments />;
      case 'shop':
        return <AdminShopOrders />;
      case 'smart_courts':
        return <AdminCourtsManagement initialTab="iot" />;
      case 'pos_cafe':
        return <AdminCafePOS />;
      case 'web_editor':
        return <AdminWebEditor />;
      case 'domains':
        return <AdminDomains />;
      case 'subscription':
        return <AdminSubscription />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <ContextualDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-foreground antialiased transition-colors duration-200">
      {/* Main view renderer: Corporate SaaS Landing OR Club View */}
      {currentView === 'public' && (isCorporateLanding ? (
        <CorporateLayout onOpenDemo={() => setRoleSelectorOpen(true)} onOpenAuth={() => setAuthOpen(true)} onOpenRegister={() => { window.history.pushState({}, '', '/registro'); setRegistrationOpen(true); setAuthOpen(true); }}>
          {publicPage === 'home' ? (
            <SetmioCorporateLanding
              onOpenAuth={() => setAuthOpen(true)}
              onExploreClub={navigateToClub}
              onOpenDemoRoleModal={() => setRoleSelectorOpen(true)}
              onOpenFeatures={() => { window.history.pushState({}, '', '/funcionalidades'); setPublicPage('features'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onOpenOnboarding={() => { window.history.pushState({}, '', '/registro'); window.dispatchEvent(new PopStateEvent('popstate')); setRegistrationOpen(true); setAuthOpen(true); }}
            />
          ) : renderPublicPage()}
        </CorporateLayout>
      ) : (
        <div className="flex min-h-screen flex-col">
          <Navbar onOpenCart={() => setCartOpen(true)} onOpenAuth={() => setAuthOpen(true)} onOpenDemo={() => setRoleSelectorOpen(true)} />
          <main className="flex-1">{renderPublicPage()}</main>
          <Footer />
        </div>
      ))}

          {currentView === 'admin' && (
            <AdminLayout>{renderAdminTab()}</AdminLayout>
          )}

  {currentView === 'player' && <PlayerPortal />}

  {currentView === 'coach' && <CoachPortal />}

  {currentView === 'hq' && <SuperadminHQ />}

      {/* 3. Floating AI Agent (Draggable, session memory, tenant branded) */}
      {currentView !== 'admin' && <DraggableAIAgent />}

      {/* 4. WhatsApp Floating CTA button */}
      <WhatsAppFloat />

      {/* 5. PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* 6. Offline Connectivity Toast */}
      <OfflineBanner />

      {/* 7. Drawers and Modals */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal
        isOpen={authOpen}
        initialMode={registrationOpen ? 'register' : 'login'}
        onClose={registrationOpen ? closeRegistration : () => setAuthOpen(false)}
        onOpenRoleModal={() => setRoleSelectorOpen(true)}
      />
      <RoleSelectorModal
        isOpen={roleSelectorOpen}
        onClose={() => setRoleSelectorOpen(false)}
      />

      {/* 8. Demo Action Notification Toast */}
      {demoToast && (
        <aside
          aria-label="Notificación del sistema"
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-4 shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-150"
        >
          {demoToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : demoToast.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0 text-xs">
            <div className="font-bold text-foreground">{demoToast.title}</div>
            <div className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{demoToast.description}</div>
          </div>

          <button
            onClick={clearDemoToast}
            className="p-1 rounded-lg text-slate-500 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}
    </div>
  );
}

export default App;
