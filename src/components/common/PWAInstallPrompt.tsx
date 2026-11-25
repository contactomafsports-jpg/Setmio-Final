import React, { useState } from 'react';
import { usePWA } from '../../lib/pwa';
import { useApp } from '../../context/AppContext';
import { Download, Share, X, Smartphone } from 'lucide-react';
import { SetmioSymbol } from './SetmioLogo';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, installPWA } = usePWA();
  const { currentTenant, isCorporateLanding, currentView } = useApp();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  const isPublicCorporate = isCorporateLanding && currentView === 'public';
  const positionClass =
    currentView === 'public'
      ? 'bottom-4 left-3 right-3 sm:bottom-5 sm:left-auto sm:right-5 sm:w-[360px]'
      : 'bottom-[4.75rem] left-3 right-3 sm:bottom-5 sm:left-auto sm:right-5 sm:w-[340px]';

  const brandName = isPublicCorporate ? 'Setmio' : currentTenant.shortName;
  const titleText = isPublicCorporate
    ? 'Instalar Setmio Web App'
    : `Instalar App de ${brandName}`;
  const subtitleText = isPublicCorporate
    ? 'Acceso directo desde tu pantalla de inicio sin descargas'
    : 'Acceso rápido a reservas directas sin descargas pesadas';

  return (
    <>
      {(isInstallable || isIOS) && (
        <aside
          aria-label="Instalación de la aplicación web"
          className={`fixed ${positionClass} z-30 rounded-2xl border border-[#1A314D] bg-[#0B1A2D]/95 backdrop-blur-xl p-3.5 shadow-2xl shadow-[#040B14]/40 flex items-center justify-between gap-3 text-white`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#071220] border border-[#1A314D] flex items-center justify-center shrink-0">
              <SetmioSymbol size={22} theme="dark" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {titleText}
              </div>
              <div className="text-[11px] text-slate-300 leading-snug mt-0.5 line-clamp-2">
                {subtitleText}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isInstallable && (
              <button
                type="button"
                onClick={installPWA}
                className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>Instalar</span>
              </button>
            )}

            {isIOS && (
              <button
                type="button"
                onClick={() => setShowIOSModal(true)}
                className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span>Instalar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#132A45] transition-colors cursor-pointer"
              title="Cerrar aviso"
              aria-label="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* iOS Safari Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0B1A2D] border border-[#1A314D] p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <SetmioSymbol size={20} theme="dark" />
                <h3 className="text-base font-bold text-white">
                  Instalar {brandName} en iPhone o iPad
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#132A45] transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Para añadir la Web App a tu pantalla de inicio desde Safari, sigue estos dos pasos:
            </p>

            <div className="space-y-3 text-xs mb-5">
              <div className="p-3.5 rounded-xl bg-[#071220] border border-[#1A314D] flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#B7F229] text-[#0B1A2D] flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div className="text-slate-200 leading-relaxed">
                  Pulsa el botón <strong className="text-white">Compartir</strong> (<Share className="inline w-3.5 h-3.5 text-[#B7F229] mb-0.5" />) en la barra de Safari.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#071220] border border-[#1A314D] flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#B7F229] text-[#0B1A2D] flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div className="text-slate-200 leading-relaxed">
                  Desliza hacia abajo y selecciona <strong className="text-white">«Añadir a la pantalla de inicio»</strong>.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full min-h-[42px] py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#c5f64e] text-[#0B1A2D] font-bold text-xs transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
