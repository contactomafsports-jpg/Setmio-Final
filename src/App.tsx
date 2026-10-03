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
import { LegalView } from './components/public/LegalView';
import { BrandSplashScreen } from './components/common/BrandSplashScreen';
import { SetmioCorporateLanding } from './components/public/SetmioCorporateLanding';
import { SetmioCorporateLoader } from './components/common/SetmioCorporateLoader';

// Admin views
import { AdminLayout } from './components/admin/AdminLayout';
import { ContextualDashboard } from './components/admin/dashboards/ContextualDashboard';
import { AdminAgenda } from './components/admin/AdminAgenda';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminTeams } from './components/admin/AdminTeams';
import { AdminSchool } from './components/admin/AdminSchool';
import { AdminTournaments } from './components/admin/AdminTournaments';
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
    currentTenant,
    publicPage,
    setPublicPage,
    adminTab,
    demoToast,
    clearDemoToast,
    isCorporateLanding,
    navigateToClub,
  } = useApp();

  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [roleSelectorOpen, setRoleSelectorOpen] = useState(false);

  // Corporate loader animation (ONLY for the main SaaS corporate landing, NEVER for clubs)
  const [corporateLoaderDone, setCorporateLoaderDone] = useState(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('setmio_corporate_loader_seen') === 'true';
  });

  const handleCorporateLoaderComplete = () => {
    setCorporateLoaderDone(true);
    try {
      sessionStorage.setItem('setmio_corporate_loader_seen', 'true');
    } catch {
      // Ignore
    }
  };

  // PWA Brand splash screen (Only for installed private app sessions)
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Do not show on public club web (clean fluid instant load)
    if (isCorporateLanding) return false;
    return sessionStorage.getItem('setmio_splash_seen') !== 'true';
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('setmio_splash_seen', 'true');
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    const enabled = currentTenant.publicPages ?? ['home', 'courts', 'academy', 'tournaments', 'shop', 'contact'];
    if (['home', 'courts', 'academy', 'tournaments', 'shop', 'contact'].includes(publicPage) && !enabled.includes(publicPage)) {
      setPublicPage(enabled[0] as typeof publicPage);
    }
  }, [currentTenant.publicPages, publicPage, setPublicPage]);

  // Render Public Page Switcher
  const renderPublicPage = () => {
    switch (publicPage) {
      case 'home':
        return <HomeView />;
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
        return <BlogView />;
      case 'contact':
        return <ContactFAQView />;
      case 'legal':
        return <LegalView />;
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
        return <AdminSmartCourts />;
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white antialiased transition-colors duration-200">
      {/* PWA & Brand Splash Screen */}
      {showSplash && <BrandSplashScreen onComplete={handleSplashComplete} />}

      {/* Main view renderer: Corporate SaaS Landing OR Club View */}
      {isCorporateLanding && currentView === 'public' ? (
        <>
          {!corporateLoaderDone && (
            <SetmioCorporateLoader onComplete={handleCorporateLoaderComplete} />
          )}
          <SetmioCorporateLanding
            onOpenAuth={() => setAuthOpen(true)}
            onExploreClub={navigateToClub}
            onOpenDemoRoleModal={() => setRoleSelectorOpen(true)}
          />
        </>
      ) : (
        <>
          {currentView === 'public' && (
            <div className="flex flex-col min-h-screen">
              <Navbar
                onOpenCart={() => setCartOpen(true)}
                onOpenAuth={() => setAuthOpen(true)}
                onOpenDemo={() => setRoleSelectorOpen(true)}
              />
              <main className="flex-1">{renderPublicPage()}</main>
              {/* Public Footer ONLY in public view (Requirement 8: No footer in app) */}
              <Footer />
            </div>
          )}

          {currentView === 'admin' && (
            <AdminLayout>{renderAdminTab()}</AdminLayout>
          )}

          {currentView === 'player' && (
            <PlayerPortal />
          )}

          {currentView === 'coach' && (
            <CoachPortal />
          )}

          {currentView === 'hq' && (
            <SuperadminHQ />
          )}
        </>
      )}

      {/* 3. Floating AI Agent (Draggable, session memory, tenant branded) */}
      <DraggableAIAgent />

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
        onClose={() => setAuthOpen(false)}
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
            <div className="font-bold text-white">{demoToast.title}</div>
            <div className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{demoToast.description}</div>
          </div>

          <button
            onClick={clearDemoToast}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}
    </div>
  );
}

export default App;
