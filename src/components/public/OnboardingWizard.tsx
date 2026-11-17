import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
}) => {
  const { triggerDemoToast, setCurrentView, setIsCorporateLanding } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [clubName, setClubName] = useState('Pádel Costa Verde');
  const [slug, setSlug] = useState('costaverde');
  const [city, setCity] = useState('A Coruña');
  const [address, setAddress] = useState('Rúa Nova 42');
  const [contactEmail, setContactEmail] = useState('contacto@costaverde.es');
  const [phone, setPhone] = useState('+34 699 12 34 56');

  const [courtCount, setCourtCount] = useState(4);
  const [courtType, setCourtType] = useState<'indoor' | 'outdoor' | 'mixed'>('mixed');
  const [hasLightingAutomation, setHasLightingAutomation] = useState(true);
  const [hasDoorAccessPin, setHasDoorAccessPin] = useState(true);

  const [ratePeak, setRatePeak] = useState(28);
  const [rateOffPeak, setRateOffPeak] = useState(20);
  const [advanceDays, setAdvanceDays] = useState(14);
  const [splitPayment, setSplitPayment] = useState(true);

  const [primaryColor, setPrimaryColor] = useState('#0B1A2D');
  const [customDomain, setCustomDomain] = useState('padelcostaverde.es');

  if (!isOpen) return null;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    setIsCorporateLanding(false);
    setCurrentView('admin');
    triggerDemoToast(
      'Club Configurado con Éxito',
      `Instancia "${clubName}" configurada y lista en ${slug}.setmio.app.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071220]/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between bg-slate-50 dark:bg-[#071220]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#8B5CF6] dark:text-[#a78bfa]">
              Asistente de Activación · Paso {step} de 4
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1A2D] dark:text-white mt-1">
              {step === 1 && '1. Datos del Club y Ubicación'}
              {step === 2 && '2. Pistas e Instalaciones'}
              {step === 3 && '3. Tarifas y Políticas de Reserva'}
              {step === 4 && '4. Personalización de Marca Blanca'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-[#132A45] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-[#071220] h-1">
          <div
            className="bg-[#B7F229] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5 text-xs text-[#0B1A2D] dark:text-slate-200">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Nombre Comercial del Club</label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => {
                    setClubName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                  }}
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-medium focus:outline-none focus:border-[#8B5CF6]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Subdominio Setmio</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      className="w-full min-h-[40px] px-3 py-2 rounded-l-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-mono text-[#8B5CF6] dark:text-[#a78bfa] font-bold focus:outline-none"
                    />
                    <span className="min-h-[40px] flex items-center px-3 py-2 rounded-r-xl border border-l-0 border-slate-200/80 dark:border-[#1A314D] bg-slate-100 dark:bg-[#0B1A2D] text-slate-500 font-mono text-[11px]">
                      .setmio.app
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Ciudad / Municipio</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-medium focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Dirección de la Sede</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-medium focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Email de Contacto</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-medium focus:outline-none focus:border-[#8B5CF6]"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Teléfono</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-mono tabular-nums font-medium focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#071220] text-slate-600 dark:text-slate-300">
                <h4 className="font-bold text-[#0B1A2D] dark:text-white mb-1">Configuración Rápida de Instalaciones</h4>
                <p className="text-[11px]">
                  Generaremos las pistas en tu agenda con numeración y configuración automática.
                </p>
              </div>

              <div>
                <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Número de Pistas Activas</label>
                <div className="flex flex-wrap items-center gap-2">
                  {[2, 4, 6, 8, 12, 16].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setCourtCount(num)}
                      className={`min-h-[40px] px-3.5 py-2 rounded-xl font-bold font-mono tabular-nums transition cursor-pointer ${
                        courtCount === num
                          ? 'bg-[#0B1A2D] dark:bg-[#B7F229] text-white dark:text-[#0B1A2D]'
                          : 'bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-[#1A314D]'
                      }`}
                    >
                      {num} Pistas
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Tipo de Instalación</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'indoor', label: '100% Indoor Climatizado' },
                    { id: 'mixed', label: 'Mixto (Indoor + Outdoor)' },
                    { id: 'outdoor', label: '100% Outdoor / Cubiertas' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setCourtType(item.id as typeof courtType)}
                      className={`min-h-[44px] p-3 rounded-xl border text-left font-semibold transition cursor-pointer ${
                        courtType === item.id
                          ? 'border-[#0B1A2D] dark:border-[#B7F229] bg-slate-50 dark:bg-[#132A45] text-[#0B1A2D] dark:text-[#B7F229]'
                          : 'border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLightingAutomation}
                    onChange={(e) => setHasLightingAutomation(e.target.checked)}
                    className="w-4 h-4 accent-[#0B1A2D] rounded"
                  />
                  <span className="font-semibold text-[#0B1A2D] dark:text-slate-200">
                    Habilitar automatización domótica de luces LED en pista
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDoorAccessPin}
                    onChange={(e) => setHasDoorAccessPin(e.target.checked)}
                    className="w-4 h-4 accent-[#0B1A2D] rounded"
                  />
                  <span className="font-semibold text-[#0B1A2D] dark:text-slate-200">
                    Apertura electrónica con PIN temporal para jugadores
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Tarifa Hora Punta (€/h)</label>
                  <input
                    type="number"
                    value={ratePeak}
                    onChange={(e) => setRatePeak(Number(e.target.value))}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-mono tabular-nums font-bold focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Tarifa Hora Valle (€/h)</label>
                  <input
                    type="number"
                    value={rateOffPeak}
                    onChange={(e) => setRateOffPeak(Number(e.target.value))}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-mono tabular-nums font-bold focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Días de Antelación para Reservas</label>
                <input
                  type="number"
                  value={advanceDays}
                  onChange={(e) => setAdvanceDays(Number(e.target.value))}
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-mono tabular-nums focus:outline-none focus:border-[#8B5CF6]"
                />
                <p className="text-[11px] text-slate-500 mt-1.5 font-mono tabular-nums">
                  Los socios podrán reservar hasta con {advanceDays} días de antelación.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={splitPayment}
                    onChange={(e) => setSplitPayment(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#0B1A2D] rounded"
                  />
                  <div>
                    <span className="font-semibold text-[#0B1A2D] dark:text-white block">Permitir Pago Fraccionado (Split 1/4)</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Cada jugador abona su parte individual online o en recepción.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Color Principal de Marca</label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="min-h-[40px] px-3 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-mono text-xs w-32"
                  />
                  <div className="flex items-center gap-2">
                    {['#0B1A2D', '#B7F229', '#8B5CF6'].map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setPrimaryColor(c)}
                        className="w-7 h-7 rounded-full border border-slate-300 dark:border-[#1A314D] cursor-pointer"
                        style={{ backgroundColor: c }}
                        aria-label={`Color ${c}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#0B1A2D] dark:text-white block mb-1.5">Dominio Personalizado (Opcional)</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="ej. padelsanmateo.com"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] bg-slate-50 dark:bg-[#071220] font-mono focus:outline-none focus:border-[#8B5CF6]"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Apunta tu CNAME a <code className="text-[#8B5CF6] dark:text-[#a78bfa]">cname.setmio.app</code> con SSL automático.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] space-y-2">
                <div className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                  <span>Resumen de tu Nuevo Club</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div>Club: <strong className="text-[#0B1A2D] dark:text-white">{clubName}</strong></div>
                  <div>Pistas: <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">{courtCount}</strong></div>
                  <div>Sede: <strong className="text-[#0B1A2D] dark:text-white">{city}</strong></div>
                  <div>Tarifa Punta: <strong className="font-mono tabular-nums text-[#0B1A2D] dark:text-white">{ratePeak} €/h</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between bg-slate-50 dark:bg-[#071220]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as typeof step)}
              className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-white dark:hover:bg-[#132A45] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as typeof step)}
              className="min-h-[40px] px-5 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="min-h-[40px] px-6 py-2 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalizar y Entrar al Club</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
