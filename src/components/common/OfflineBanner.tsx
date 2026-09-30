import React from 'react';
import { usePWA } from '../../lib/pwa';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-4 py-2 text-xs font-semibold text-slate-950 shadow-xl border border-amber-400">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Modo sin conexión activo — Visualizando datos en caché local.</span>
    </div>
  );
};
