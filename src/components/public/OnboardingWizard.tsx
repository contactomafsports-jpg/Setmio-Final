import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Palette,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  ShieldCheck,
  Plus,
  Trash2,
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

  // Step 1: Club Info
  const [clubName, setClubName] = useState('Pádel Costa Verde');
  const [slug, setSlug] = useState('costaverde');
  const [city, setCity] = useState('A Coruña');
  const [address, setAddress] = useState('Rúa Nova 42');
  const [contactEmail, setContactEmail] = useState('contacto@costaverde.es');
  const [phone, setPhone] = useState('+34 699 12 34 56');

  // Step 2: Courts & Facilities
  const [courtCount, setCourtCount] = useState(4);
  const [courtType, setCourtType] = useState<'indoor' | 'outdoor' | 'mixed'>('mixed');
  const [hasLightingAutomation, setHasLightingAutomation] = useState(true);
  const [hasDoorAccessPin, setHasDoorAccessPin] = useState(true);

  // Step 3: Rates & Booking Policies
  const [ratePeak, setRatePeak] = useState(28);
  const [rateOffPeak, setRateOffPeak] = useState(20);
  const [advanceDays, setAdvanceDays] = useState(14);
  const [splitPayment, setSplitPayment] = useState(true);

  // Step 4: White-Label Branding
  const [primaryColor, setPrimaryColor] = useState('#185c43');
  const [customDomain, setCustomDomain] = useState('padelcostaverde.es');

  if (!isOpen) return null;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    setIsCorporateLanding(false);
    setCurrentView('admin');
    triggerDemoToast(
      '¡Club Configurado con Éxito!',
      `Instancia "${clubName}" configurada y lista en ${slug}.setmiofinal2.vercel.app. Has ingresado al panel de administración.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Asistente de Activación · Paso {step} de 4</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {step === 1 && '1. Datos del Club & Ubicación'}
              {step === 2 && '2. Configuración de Pistas e Instalaciones'}
              {step === 3 && '3. Tarifas y Políticas de Reserva'}
              {step === 4 && '4. Personalización de Marca Blanca'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 dark:text-slate-200">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">Nombre Comercial del Club</label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => {
                    setClubName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">Subdominio Setmio</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      className="w-full px-3 py-2.5 rounded-l-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-emerald-600 dark:text-emerald-400 font-bold"
                    />
                    <span className="px-3 py-2.5 rounded-r-xl border border-l-0 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[11px]">
                      .setmio.app
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">Ciudad / Municipio</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">Dirección de la Sede</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">Email de Contacto</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">Configuración Rápida de Instalaciones</h4>
                <p className="text-emerald-800 dark:text-emerald-400 text-[11px]">
                  Generaremos las pistas en tu agenda con numeración y configuración automática.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">Número de Pistas Activas</label>
                <div className="flex items-center gap-3">
                  {[2, 4, 6, 8, 12, 16].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setCourtCount(num)}
                      className={`px-4 py-2.5 rounded-xl font-bold font-mono transition ${
                        courtCount === num
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {num} Pistas
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">Tipo de Instalación</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'indoor', label: '100% Indoor Climatizado' },
                    { id: 'mixed', label: 'Mixto (Indoor + Outdoor)' },
                    { id: 'outdoor', label: '100% Outdoor / Cubiertas' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setCourtType(item.id as typeof courtType)}
                      className={`p-3 rounded-xl border text-left font-semibold transition ${
                        courtType === item.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLightingAutomation}
                    onChange={(e) => setHasLightingAutomation(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Habilitar automatización domótica de luces LED en pista
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDoorAccessPin}
                    onChange={(e) => setHasDoorAccessPin(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Apertura de cerradura electrónica con código PIN temporal para jugadores
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">Tarifa Hora Punta (€/h)</label>
                  <input
                    type="number"
                    value={ratePeak}
                    onChange={(e) => setRatePeak(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">Tarifa Hora Valle (€/h)</label>
                  <input
                    type="number"
                    value={rateOffPeak}
                    onChange={(e) => setRateOffPeak(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">Días de Antelación para Reservas</label>
                <input
                  type="number"
                  value={advanceDays}
                  onChange={(e) => setAdvanceDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">Los socios podrán reservar hasta con {advanceDays} días de antelación.</p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={splitPayment}
                    onChange={(e) => setSplitPayment(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Permitir Pago Fraccionado (Split)</span>
                    <span className="text-[11px] text-slate-400">Cada jugador de la partida abona su parte individual de forma online o en recepción.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">Color Principal de Marca</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-xs w-32"
                  />
                  <div className="flex items-center gap-2">
                    {['#185c43', '#0284c7', '#7c3aed', '#dc2626', '#ea580c'].map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setPrimaryColor(c)}
                        className="w-6 h-6 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">Dominio Personalizado Propio (Opcional)</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="ej. padelsanmateo.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Podrás apuntar tu dominio CNAME a <code className="text-emerald-500">cname.setmio.app</code> en cualquier momento con certificado SSL gratis.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Resumen de tu Nuevo Club</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div>Club: <strong className="text-slate-900 dark:text-white">{clubName}</strong></div>
                  <div>Pistas: <strong className="text-slate-900 dark:text-white">{courtCount}</strong></div>
                  <div>Sede: <strong className="text-slate-900 dark:text-white">{city}</strong></div>
                  <div>Tarifa Punta: <strong className="text-slate-900 dark:text-white">{ratePeak} €/h</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as typeof step)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
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
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition hover:scale-[1.02]"
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
