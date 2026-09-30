import React, { useState } from 'react';
import { usePWA } from '../../lib/pwa';
import { useApp } from '../../context/AppContext';
import { Download, Share, X, Smartphone, Check } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, installPWA } = usePWA();
  const { currentTenant } = useApp();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Subtle install bar on bottom or top banner */}
      {(isInstallable || isIOS) && (
        <aside
          aria-label="Instalación de la aplicación"
          className="fixed bottom-[4.75rem] left-3 right-3 sm:bottom-5 sm:left-auto sm:right-5 sm:w-[320px] z-40 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-2.5 text-slate-100 ring-1 ring-black/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white shrink-0 text-sm shadow">
              SM
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Instalar App de {currentTenant.shortName}</span>
                <span className="text-[10px] text-emerald-400 font-normal">PWA</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Acceso rápido a reservas directas sin descargas pesadas
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isInstallable && (
              <button
                onClick={installPWA}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar</span>
              </button>
            )}

            {isIOS && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instalar en iOS</span>
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* iOS Safari Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white">Instalar en iPhone o iPad</h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Apple Safari no permite instalación automática directa. Sigue estos 2 sencillos pasos:
            </p>

            <div className="space-y-3 text-xs mb-5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  Pulsa el botón <strong className="text-white">Compartir</strong> (icono con la flecha hacia arriba <Share className="inline w-3.5 h-3.5 text-cyan-400 mb-0.5" />) en la barra inferior de Safari.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  Desliza hacia abajo y selecciona <strong className="text-white">"Añadir a la pantalla de inicio"</strong>.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
