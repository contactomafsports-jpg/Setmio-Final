import React, { useEffect, useState } from 'react';
import { CorporateHeader, CorporateFooter } from './CorporateHeader';

interface CorporateLayoutProps {
  children: React.ReactNode;
  onOpenDemo?: () => void;
  onOpenAuth?: () => void;
  onOpenRegister?: () => void;
  minimizedFooter?: boolean;
}

export function CorporateLayout({
  children,
  onOpenDemo,
  onOpenAuth,
  onOpenRegister,
  minimizedFooter,
}: CorporateLayoutProps) {
  const [isAuthRoute, setIsAuthRoute] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === '/login' || window.location.pathname === '/registro';
  });

  useEffect(() => {
    const handleRouteChange = () => {
      setIsAuthRoute(window.location.pathname === '/login' || window.location.pathname === '/registro');
    };
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const shouldMinimize = minimizedFooter ?? isAuthRoute;

  return (
    <div className="min-h-screen bg-white text-[#0B1A2D] dark:bg-[#0B1A2D] dark:text-white flex flex-col justify-between transition-colors duration-200">
      <CorporateHeader onOpenDemo={onOpenDemo} onOpenAuth={onOpenAuth} onOpenRegister={onOpenRegister} />
      <main className="flex-1 pt-16">{children}</main>
      <CorporateFooter minimized={shouldMinimize} />
    </div>
  );
}
