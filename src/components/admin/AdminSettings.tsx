import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DiscountCoupon, ClassVoucher } from '../../types/database';
import {
  Save,
  Sun,
  Moon,
  Laptop,
  Send,
  X,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Trash2,
} from 'lucide-react';
import { AdminNotificationSettings } from './AdminNotificationSettings';

export interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const DEFAULT_WEEKLY_SCHEDULE: DaySchedule[] = [
  { day: 'Lunes', isOpen: true, openTime: '08:00', closeTime: '23:30' },
  { day: 'Martes', isOpen: true, openTime: '08:00', closeTime: '23:30' },
  { day: 'Miércoles', isOpen: true, openTime: '08:00', closeTime: '23:30' },
  { day: 'Jueves', isOpen: true, openTime: '08:00', closeTime: '23:30' },
  { day: 'Viernes', isOpen: true, openTime: '08:00', closeTime: '23:30' },
  { day: 'Sábado', isOpen: true, openTime: '09:00', closeTime: '22:00' },
  { day: 'Domingo', isOpen: true, openTime: '09:00', closeTime: '21:30' },
];

const INPUT_CLASS =
  'w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] text-sm sm:text-xs text-[#0B1A2D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition';

const LABEL_CLASS =
  'block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2';

const SUBTEXT_CLASS =
  'text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed';

export const AdminSettings: React.FC = () => {
  const { currentTenant, updateCurrentTenant, triggerDemoToast, theme, setTheme, courts, t } = useApp();

  const [activeSection, setActiveSection] = useState<
    'general' | 'payments' | 'promos' | 'ai' | 'shipping' | 'notifications'
  >('general');

  // Sync URL subroutes
  useEffect(() => {
    const handleUrlSettings = () => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      if (
        pathname === '/admin/ajustes/notificaciones' ||
        pathname === '/gestion/ajustes/notificaciones' ||
        pathname.includes('/notificaciones') ||
        pathname.includes('/notifications') ||
        pathname.includes('/avisos')
      ) {
        setActiveSection('notifications');
      } else if (pathname === '/gestion/ajustes/ia' || pathname.endsWith('/ia')) {
        setActiveSection('ai');
      } else if (
        pathname.includes('/pagos') ||
        pathname.includes('/payments') ||
        pathname.includes('/metodos-pago')
      ) {
        setActiveSection('payments');
      } else if (
        pathname.includes('/cupones') ||
        pathname.includes('/bonos') ||
        pathname.includes('/promociones')
      ) {
        setActiveSection('promos');
      } else if (
        pathname.includes('/envios') ||
        pathname.includes('/shipping') ||
        pathname.includes('/logistica')
      ) {
        setActiveSection('shipping');
      } else if (
        pathname === '/gestion/ajustes' ||
        pathname === '/gestion/configuracion' ||
        pathname === '/admin/ajustes'
      ) {
        setActiveSection('general');
      }
    };
    handleUrlSettings();
    window.addEventListener('popstate', handleUrlSettings);
    return () => window.removeEventListener('popstate', handleUrlSettings);
  }, []);

  // General Club Identity & Fiscal Fields
  const [clubName, setClubName] = useState(currentTenant.name || 'Centro de Pádel San Mateo');
  const [address, setAddress] = useState(currentTenant.address || '');
  const [contactPhone, setContactPhone] = useState(currentTenant.contactPhone || '');
  const [contactEmail, setContactEmail] = useState(currentTenant.contactEmail || '');
  const [currency, setCurrency] = useState(currentTenant.currency || 'EUR');
  const [defaultVat, setDefaultVat] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('setmio_club_default_vat');
      return saved !== null ? Number(saved) : 21;
    } catch {
      return 21;
    }
  });

  // Booking & Operational Policies
  const [bookingAdvanceDays, setBookingAdvanceDays] = useState(
    currentTenant.settings?.bookingAdvanceDays ?? 14
  );
  const [cancellationHours, setCancellationHours] = useState(
    currentTenant.settings?.cancellationWindowHours ?? 12
  );
  const [splitPayment, setSplitPayment] = useState(
    currentTenant.settings?.splitPaymentAllowed ?? true
  );
  const [allowPlayerCustomDurations, setAllowPlayerCustomDurations] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('setmio_allow_player_durations');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Weekly Opening Schedule
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(() => {
    try {
      const saved = localStorage.getItem('setmio_club_weekly_schedule');
      return saved ? JSON.parse(saved) : DEFAULT_WEEKLY_SCHEDULE;
    } catch {
      return DEFAULT_WEEKLY_SCHEDULE;
    }
  });

  // Court Lockouts
  const [isLockoutModalOpen, setIsLockoutModalOpen] = useState(false);
  const [courtBlocks, setCourtBlocks] = useState([
    {
      id: 'blk-1',
      courtName: 'Todas las Pistas',
      startDate: '2026-10-15',
      endDate: '2026-10-15',
      startTime: '08:00',
      endTime: '14:00',
      reason: 'Mantenimiento: Cepillado y reposición de arena sílice WPT',
      notifyRefund: true,
    },
    {
      id: 'blk-2',
      courtName: 'Pista 1 Central',
      startDate: '2026-10-24',
      endDate: '2026-10-25',
      startTime: '09:00',
      endTime: '21:00',
      reason: 'Torneo Oficial: I Open Primavera Pádel San Mateo',
      notifyRefund: true,
    },
  ]);

  const [newBlockForm, setNewBlockForm] = useState({
    courtName: 'Todas las Pistas',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '14:00',
    reason: 'Mantenimiento Preventivo',
    notifyRefund: true,
  });

  // Payment Methods & Policies
  const [paymentMethods, setPaymentMethods] = useState({
    cash: currentTenant.settings?.paymentMethods?.cash ?? true,
    manualPos: currentTenant.settings?.paymentMethods?.manualPos ?? true,
    stripeTerminal: currentTenant.settings?.paymentMethods?.stripeTerminal ?? true,
    stripeTerminalReaderCode:
      currentTenant.settings?.paymentMethods?.stripeTerminalReaderCode ?? 'gold-bear-apple',
    stripeTerminalStatus: currentTenant.settings?.paymentMethods?.stripeTerminalStatus ?? 'connected',
    pushCharge: currentTenant.settings?.paymentMethods?.pushCharge ?? true,
    wallet: currentTenant.settings?.paymentMethods?.wallet ?? true,
    onlineGateway: currentTenant.settings?.paymentMethods?.onlineGateway ?? true,
  });

  const [policies, setPolicies] = useState({
    requireOnlinePayment: currentTenant.settings?.policies?.requireOnlinePayment ?? false,
    allowCounterPayment: currentTenant.settings?.policies?.allowCounterPayment ?? true,
    cancellationRefundType: currentTenant.settings?.policies?.cancellationRefundType ?? 'partial',
    cancellationWindowHours: currentTenant.settings?.policies?.cancellationWindowHours ?? 12,
    cancellationPenaltyPercent: currentTenant.settings?.policies?.cancellationPenaltyPercent ?? 50,
    memberCourtDiscountPercent: currentTenant.settings?.policies?.memberCourtDiscountPercent ?? 20,
    memberShopDiscountPercent: currentTenant.settings?.policies?.memberShopDiscountPercent ?? 10,
  });

  const [globalPaymentOption, setGlobalPaymentOption] = useState<
    'both' | 'online_only' | 'counter_only'
  >(currentTenant.settings?.globalPaymentOption ?? 'both');

  const [categoryPaymentRules, setCategoryPaymentRules] = useState({
    membersAllowedMethods: currentTenant.settings?.categoryPaymentRules?.membersAllowedMethods ?? [
      'online',
      'counter',
      'wallet',
    ],
    nonMembersAllowedMethods: currentTenant.settings?.categoryPaymentRules
      ?.nonMembersAllowedMethods ?? ['online', 'counter'],
    requireOnlineForNonMembers:
      currentTenant.settings?.categoryPaymentRules?.requireOnlineForNonMembers ?? false,
  });

  const [discountRules, setDiscountRules] = useState({
    memberCourtDiscountPercent:
      currentTenant.settings?.discountRules?.memberCourtDiscountPercent ?? 20,
    memberMatchDiscountPercent:
      currentTenant.settings?.discountRules?.memberMatchDiscountPercent ?? 20,
    memberAcademyDiscountPercent:
      currentTenant.settings?.discountRules?.memberAcademyDiscountPercent ?? 15,
    memberTournamentDiscountPercent:
      currentTenant.settings?.discountRules?.memberTournamentDiscountPercent ?? 25,
    staffDiscountPercent: currentTenant.settings?.discountRules?.staffDiscountPercent ?? 100,
    coachDiscountPercent: currentTenant.settings?.discountRules?.coachDiscountPercent ?? 100,
  });

  const [isPairingTerminal, setIsPairingTerminal] = useState(false);

  // Coupons & Vouchers
  const [coupons, setCoupons] = useState<DiscountCoupon[]>(
    currentTenant.settings?.coupons || [
      { id: 'cp-1', code: 'SETMIO10', discountType: 'percent', discountValue: 10, scope: 'global', active: true },
      { id: 'cp-2', code: 'PROMOPISTA', discountType: 'fixed', discountValue: 5, scope: 'courts', active: true },
      { id: 'cp-3', code: 'TIENDA15', discountType: 'percent', discountValue: 15, scope: 'shop', active: true },
    ]
  );
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    discountType: 'percent' as 'percent' | 'fixed',
    discountValue: 10,
    scope: 'global' as 'global' | 'shop' | 'courts',
  });

  const [vouchers, setVouchers] = useState<ClassVoucher[]>(
    currentTenant.settings?.classVouchers || [
      { id: 'v-1', title: 'Bono 4 Clases Individuales', classesCount: 4, price: 90, validityDays: 60, active: true },
      { id: 'v-2', title: 'Bono 8 Clases Grupo Reducido', classesCount: 8, price: 150, validityDays: 90, active: true },
      { id: 'v-3', title: 'Bono 10 Clases Intensivo WPT', classesCount: 10, price: 195, validityDays: 120, active: true },
    ]
  );
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [newVoucherForm, setNewVoucherForm] = useState({
    title: '',
    classesCount: 5,
    price: 110,
    validityDays: 60,
  });

  // AI & Multichannel Agent
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai' | 'claude'>('gemini');
  const [aiApiKey, setAiApiKey] = useState('AIzaSyD-SetmioClubPro_Demo_Key_2026');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [showApiKey, setShowApiKey] = useState(false);

  const [channelWeb, setChannelWeb] = useState(true);
  const [channelWhatsApp, setChannelWhatsApp] = useState(true);
  const [channelInstagram, setChannelInstagram] = useState(false);
  const [channelFacebook, setChannelFacebook] = useState(false);

  const [aiTone, setAiTone] = useState<'profesional' | 'cercano' | 'deportivo' | 'formal'>('deportivo');
  const [aiWelcomeMessage, setAiWelcomeMessage] = useState(
    `¡Hola! Soy el asistente de ${currentTenant.name}. Puedo informarte sobre pistas, tarifas o ayudarte a reservar.`
  );
  const [aiSystemPrompt, setAiSystemPrompt] = useState(
    `Actúa como el asistente oficial de ${currentTenant.name}. Resuelve dudas de horarios, normas de reserva, escuela y torneos con precisión.`
  );
  const [aiMultiLanguage, setAiMultiLanguage] = useState(true);

  const [testInput, setTestInput] = useState('');
  const [testResponses, setTestResponses] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: `Asistente listo con ${aiModel} (${aiProvider.toUpperCase()}). Escribe una consulta de prueba.`,
    },
  ]);

  // Shipping & Logistics
  const [shippingConfig, setShippingConfig] = useState({
    mode: 'flat_rate' as 'flat_rate' | 'custom' | 'api',
    flatRatePrice: 4.9,
    freeShippingThreshold: 60.0,
    enableFreeShipping: true,
    rates: [
      { id: 'r-1', zone: 'Local / Ferrolterra (A Coruña)', price: 2.9, estimatedDays: '24h' },
      { id: 'r-2', zone: 'Península (España y Portugal)', price: 4.9, estimatedDays: '24-48h' },
      { id: 'r-3', zone: 'Baleares y Canarias', price: 8.9, estimatedDays: '48-72h' },
      { id: 'r-4', zone: 'Internacional / UE', price: 14.5, estimatedDays: '3-5 días' },
    ],
    apiIntegration: {
      carrier: 'correos_express' as
        | 'correos_express'
        | 'seur'
        | 'gls'
        | 'dhl'
        | 'mrw'
        | 'sendcloud',
      accountNumber: 'SETMIO-CX-8842',
      apiKey: 'cx_live_9f82d1c098e721a',
      connected: true,
      pickupAddress: 'Pistas Centrales San Mateo, Narón',
      autoLabelGeneration: true,
      trackingSms: true,
    },
  });

  // Handlers
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('setmio_club_weekly_schedule', JSON.stringify(weeklySchedule));
      localStorage.setItem(
        'setmio_allow_player_durations',
        JSON.stringify(allowPlayerCustomDurations)
      );
      localStorage.setItem('setmio_club_default_vat', String(defaultVat));
    } catch {
      // ignore storage errors
    }

    updateCurrentTenant({
      name: clubName.trim() || currentTenant.name,
      address: address.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      currency,
      settings: {
        ...currentTenant.settings,
        bookingAdvanceDays,
        cancellationWindowHours: cancellationHours,
        splitPaymentAllowed: splitPayment,
      },
    });

    triggerDemoToast(
      'Configuración guardada',
      `Datos generales, moneda (${currency}), IVA (${defaultVat}%) y horarios actualizados.`,
      'success'
    );
  };

  const handleCreateCourtBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `blk-${Date.now()}`,
      courtName: newBlockForm.courtName,
      startDate: newBlockForm.startDate,
      endDate: newBlockForm.endDate,
      startTime: newBlockForm.startTime,
      endTime: newBlockForm.endTime,
      reason: newBlockForm.reason,
      notifyRefund: newBlockForm.notifyRefund,
    };
    setCourtBlocks((prev) => [created, ...prev]);
    setIsLockoutModalOpen(false);
    triggerDemoToast(
      'Bloqueo programado',
      `${created.courtName} bloqueada del ${created.startDate} (${created.startTime} - ${created.endTime}).`,
      'warning'
    );
  };

  const handleRemoveCourtBlock = (id: string) => {
    setCourtBlocks((prev) => prev.filter((b) => b.id !== id));
    triggerDemoToast('Bloqueo eliminado', 'La pista vuelve a estar disponible.', 'info');
  };

  const handlePairTerminal = () => {
    setIsPairingTerminal(true);
    triggerDemoToast(
      t('settings.payments.stripeStatusPairing', 'Sincronizando...'),
      `Conectando lector "${paymentMethods.stripeTerminalReaderCode}".`,
      'info'
    );
    setTimeout(() => {
      setIsPairingTerminal(false);
      const updated = { ...paymentMethods, stripeTerminalStatus: 'connected' as const };
      setPaymentMethods(updated);
      updateCurrentTenant({
        settings: {
          ...currentTenant.settings,
          paymentMethods: updated,
        },
      });
      triggerDemoToast(
        t('settings.payments.stripeStatusConnected', 'Lector conectado'),
        'Dispositivo WisePOS E listo para cobros en TPV.',
        'success'
      );
    }, 1000);
  };

  const handleTogglePaymentMethod = (key: keyof typeof paymentMethods, checked: boolean) => {
    const updated = { ...paymentMethods, [key]: checked };
    setPaymentMethods(updated);
    updateCurrentTenant({
      settings: {
        ...currentTenant.settings,
        paymentMethods: updated,
      },
    });
    triggerDemoToast(
      t('settings.payments.activeMethods', 'Métodos de pago'),
      t('settings.payments.autoSynced', 'Sincronizado con el TPV.'),
      'info'
    );
  };

  const handleSavePaymentsAndPolicies = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentTenant({
      settings: {
        ...currentTenant.settings,
        paymentMethods,
        policies,
        coupons,
        classVouchers: vouchers,
        globalPaymentOption,
        categoryPaymentRules,
        discountRules,
      },
    });
    triggerDemoToast(
      t('settings.saveSuccess', 'Pagos y políticas guardados'),
      'Reglas de cobro y descuentos actualizadas correctamente.',
      'success'
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code.trim()) return;
    const item: DiscountCoupon = {
      id: `cp-${Date.now()}`,
      code: newCouponForm.code.trim().toUpperCase(),
      discountType: newCouponForm.discountType,
      discountValue: Number(newCouponForm.discountValue) || 10,
      scope: newCouponForm.scope,
      active: true,
    };
    const updated = [item, ...coupons];
    setCoupons(updated);
    updateCurrentTenant({
      settings: {
        ...currentTenant.settings,
        coupons: updated,
      },
    });
    setNewCouponForm({ code: '', discountType: 'percent', discountValue: 10, scope: 'global' });
    setShowAddCouponModal(false);
    triggerDemoToast('Cupón creado', `Código ${item.code} disponible.`, 'success');
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherForm.title.trim()) return;
    const item: ClassVoucher = {
      id: `v-${Date.now()}`,
      title: newVoucherForm.title.trim(),
      classesCount: Number(newVoucherForm.classesCount) || 5,
      price: Number(newVoucherForm.price) || 100,
      validityDays: Number(newVoucherForm.validityDays) || 60,
      active: true,
    };
    const updated = [item, ...vouchers];
    setVouchers(updated);
    updateCurrentTenant({
      settings: {
        ...currentTenant.settings,
        classVouchers: updated,
      },
    });
    setNewVoucherForm({ title: '', classesCount: 5, price: 110, validityDays: 60 });
    setShowAddVoucherModal(false);
    triggerDemoToast('Bono creado', `"${item.title}" publicado.`, 'success');
  };

  const handleTestSend = () => {
    if (!testInput.trim()) return;
    const query = testInput;
    setTestResponses((prev) => [...prev, { sender: 'user', text: query }]);
    setTestInput('');

    setTimeout(() => {
      let reply = '';
      if (
        query.toLowerCase().includes('precio') ||
        query.toLowerCase().includes('tarifa') ||
        query.toLowerCase().includes('pista')
      ) {
        reply = `En ${clubName} disponemos de pistas desde 18€/h según franja horaria.`;
      } else if (
        query.toLowerCase().includes('clase') ||
        query.toLowerCase().includes('escuela')
      ) {
        reply = `Contamos con grupos de iniciación, perfeccionamiento y competición desde 55€/mes.`;
      } else {
        reply = `Consulta procesada con tono ${aiTone} mediante ${aiProvider.toUpperCase()} (${aiModel}).`;
      }
      setTestResponses((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 350);
  };

  const handleSaveAIConfig = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Configuración IA guardada',
      `Proveedor ${aiProvider.toUpperCase()} y canales sincronizados.`,
      'success'
    );
  };

  const handleSaveShippingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Configuración de envíos guardada',
      'Tarifas y logística actualizadas en la tienda.',
      'success'
    );
  };

  const tabs: { id: typeof activeSection; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'payments', label: 'Pagos y Políticas' },
    { id: 'promos', label: 'Cupones y Bonos' },
    { id: 'ai', label: 'IA Multicanal' },
    { id: 'shipping', label: 'Envíos' },
    { id: 'notifications', label: 'Notificaciones' },
  ];

  return (
    <div className="max-w-5xl mx-auto pt-3 pb-28 sm:pb-20 space-y-7 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased animate-in fade-in duration-150">
      {/* =====================================================================
          1. CABECERA LIMPIA Y MÍNIMALISTA
          ===================================================================== */}
      <section className="pt-2 pb-1 space-y-5">
        <div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide block mb-1">
            {currentTenant?.name || 'Centro de Pádel San Mateo'}
          </span>
          <h1 className="text-[26px] sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
            Configuración
          </h1>
        </div>

        {/* Pestañas limpias con desplazamiento horizontal en móvil */}
        <div className="overflow-x-auto no-scrollbar border-b border-slate-200/80 dark:border-[#1A314D]">
          <div className="flex items-center gap-1 sm:gap-2 pb-3 min-w-max">
            {tabs.map((tab) => {
              const active = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                    active
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-[#0E2239]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          PESTAÑA 1: GENERAL (SIN GRANDES CONTENEDORES EN BLOQUE)
          ===================================================================== */}
      {activeSection === 'general' && (
        <form onSubmit={handleSaveGeneral} className="divide-y divide-slate-200/80 dark:divide-[#1A314D]">
          {/* Sección 1: Datos Generales y Fiscales del Club */}
          <section className="pb-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Datos Generales del Club
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Información principal, datos fiscales, divisa operativa e impuesto por defecto.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div className="sm:col-span-2">
                <label htmlFor="club-name" className={LABEL_CLASS}>
                  Nombre del Club
                </label>
                <input
                  id="club-name"
                  type="text"
                  required
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="club-address" className={LABEL_CLASS}>
                  Dirección Fiscal
                </label>
                <input
                  id="club-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, código postal y ciudad"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="club-phone" className={LABEL_CLASS}>
                  Teléfono de Contacto
                </label>
                <input
                  id="club-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="club-email" className={LABEL_CLASS}>
                  Email de Recepción
                </label>
                <input
                  id="club-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="club-currency" className={LABEL_CLASS}>
                  Moneda
                </label>
                <select
                  id="club-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="USD">USD ($) — Dólar estadounidense</option>
                  <option value="GBP">GBP (£) — Libra esterlina</option>
                  <option value="MXN">MXN ($) — Peso mexicano</option>
                  <option value="ARS">ARS ($) — Peso argentino</option>
                </select>
              </div>

              <div>
                <label htmlFor="club-vat" className={LABEL_CLASS}>
                  IVA por Defecto (%)
                </label>
                <select
                  id="club-vat"
                  value={defaultVat}
                  onChange={(e) => setDefaultVat(Number(e.target.value))}
                  className={`${INPUT_CLASS} font-mono tabular-nums`}
                >
                  <option value={21}>21% · General</option>
                  <option value={10}>10% · Reducido</option>
                  <option value={4}>4% · Superreducido</option>
                  <option value={0}>0% · Exento</option>
                </select>
              </div>
            </div>
          </section>

          {/* Sección 2: Modo Visual */}
          <section className="py-8 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Apariencia del Panel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Elige el contraste preferido para el equipo de gestión y recepción.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'light' as const, label: 'Modo Claro', desc: 'Recepción y luz día', Icon: Sun },
                { id: 'dark' as const, label: 'Modo Oscuro', desc: 'Azul profundo nocturno', Icon: Moon },
                { id: 'system' as const, label: 'Automático', desc: 'Sincronizado con sistema', Icon: Laptop },
              ].map(({ id, label, desc, Icon }) => {
                const selected = theme === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTheme(id)}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                      selected
                        ? 'border-[#0B1A2D] dark:border-[#B7F229] bg-white dark:bg-[#0E2239]'
                        : 'border-slate-200/80 dark:border-[#1A314D] hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        selected ? 'text-[#0B1A2D] dark:text-[#B7F229]' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">{label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Sección 3: Políticas de Reserva */}
          <section className="py-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Políticas de Reserva y Turnos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Reglas de antelación, cancelaciones gratuitas y duración permitida en pistas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <label htmlFor="advance-days" className={LABEL_CLASS}>
                  Días de Antelación
                </label>
                <input
                  id="advance-days"
                  type="number"
                  min={1}
                  max={90}
                  value={bookingAdvanceDays}
                  onChange={(e) => setBookingAdvanceDays(parseInt(e.target.value, 10) || 7)}
                  className={`${INPUT_CLASS} font-mono tabular-nums`}
                />
                <p className={SUBTEXT_CLASS}>Días visibles en calendario público.</p>
              </div>

              <div>
                <label htmlFor="cancel-hours" className={LABEL_CLASS}>
                  Cancelación Libre (Horas)
                </label>
                <input
                  id="cancel-hours"
                  type="number"
                  min={0}
                  max={72}
                  value={cancellationHours}
                  onChange={(e) => setCancellationHours(parseInt(e.target.value, 10) || 12)}
                  className={`${INPUT_CLASS} font-mono tabular-nums`}
                />
                <p className={SUBTEXT_CLASS}>Antelación mínima sin penalización.</p>
              </div>

              <div>
                <span className={LABEL_CLASS}>Pago Dividido entre Jugadores</span>
                <button
                  type="button"
                  onClick={() => setSplitPayment(!splitPayment)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold transition text-left flex items-center justify-between cursor-pointer ${
                    splitPayment
                      ? 'border-[#0B1A2D] dark:border-[#B7F229] bg-white dark:bg-[#0E2239] text-[#0B1A2D] dark:text-white'
                      : 'border-slate-200/90 dark:border-[#1A314D] text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span>{splitPayment ? 'Activado (1/4 por plaza)' : 'Desactivado (titular)'}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      splitPayment ? 'bg-[#B7F229] ring-2 ring-[#0B1A2D]/20' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                </button>
                <p className={SUBTEXT_CLASS}>Permite abonar la parte proporcional en partidas.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">
                  Duración Permitida en Reservas
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  El estándar oficial es 90 min. Puedes habilitar también 60 y 120 min.
                </p>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAllowPlayerCustomDurations(false);
                    try {
                      localStorage.setItem('setmio_allow_player_durations', JSON.stringify(false));
                    } catch {
                      // ignore
                    }
                    triggerDemoToast('Duración actualizada', 'Solo turnos estándar de 90 min.', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    !allowPlayerCustomDurations
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  Solo 90 min
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAllowPlayerCustomDurations(true);
                    try {
                      localStorage.setItem('setmio_allow_player_durations', JSON.stringify(true));
                    } catch {
                      // ignore
                    }
                    triggerDemoToast('Duración actualizada', 'Turnos de 60, 90 y 120 min activos.', 'success');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    allowPlayerCustomDurations
                      ? 'bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  60, 90 y 120 min
                </button>
              </div>
            </div>
          </section>

          {/* Sección 4: Horarios Semanales */}
          <section className="py-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Horarios de Apertura Semanal
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Franja horaria general aplicada al cuadrante de pistas y reservas online.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const base = weeklySchedule[0] || { openTime: '08:00', closeTime: '23:30' };
                  setWeeklySchedule((prev) =>
                    prev.map((d) => ({ ...d, openTime: base.openTime, closeTime: base.closeTime }))
                  );
                  triggerDemoToast(
                    'Horarios copiados',
                    `Aplicado ${base.openTime} - ${base.closeTime} a toda la semana.`,
                    'info'
                  );
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-200/90 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0E2239] transition self-start sm:self-auto cursor-pointer whitespace-nowrap"
              >
                Copiar lunes a toda la semana
              </button>
            </div>

            <div className="divide-y divide-slate-200/70 dark:divide-[#1A314D] border-t border-b border-slate-200/70 dark:border-[#1A314D]">
              {weeklySchedule.map((item, idx) => (
                <div
                  key={item.day}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center justify-between sm:justify-start gap-4 sm:w-44">
                    <span className="text-xs font-bold text-[#0B1A2D] dark:text-white">
                      {item.day}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...weeklySchedule];
                        updated[idx] = { ...updated[idx], isOpen: !updated[idx].isOpen };
                        setWeeklySchedule(updated);
                      }}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        item.isOpen
                          ? 'border-[#0B1A2D]/20 dark:border-[#B7F229]/40 text-[#0B1A2D] dark:text-[#B7F229]'
                          : 'border-slate-200 dark:border-[#1A314D] text-slate-400'
                      }`}
                    >
                      {item.isOpen ? 'Abierto' : 'Cerrado'}
                    </button>
                  </div>

                  {item.isOpen ? (
                    <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 shrink-0">De</span>
                        <input
                          type="time"
                          aria-label={`Apertura ${item.day}`}
                          value={item.openTime}
                          onChange={(e) => {
                            const updated = [...weeklySchedule];
                            updated[idx] = { ...updated[idx], openTime: e.target.value };
                            setWeeklySchedule(updated);
                          }}
                          className="w-full sm:w-28 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] text-xs font-mono tabular-nums text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 shrink-0">a</span>
                        <input
                          type="time"
                          aria-label={`Cierre ${item.day}`}
                          value={item.closeTime}
                          onChange={(e) => {
                            const updated = [...weeklySchedule];
                            updated[idx] = { ...updated[idx], closeTime: e.target.value };
                            setWeeklySchedule(updated);
                          }}
                          className="w-full sm:w-28 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] text-xs font-mono tabular-nums text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Sin actividad programada</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Sección 5: Bloqueos de Pistas */}
          <section className="py-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Bloqueos de Pistas
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Inhabilita pistas temporalmente por mantenimiento, torneos o eventos privados.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLockoutModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-200/90 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#0E2239] transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Programar bloqueo</span>
              </button>
            </div>

            {courtBlocks.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">
                No hay bloqueos programados. Todas las pistas operan en horario regular.
              </p>
            ) : (
              <div className="divide-y divide-slate-200/70 dark:divide-[#1A314D] border-t border-b border-slate-200/70 dark:border-[#1A314D]">
                {courtBlocks.map((blk) => (
                  <div
                    key={blk.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[#0B1A2D] dark:text-white font-semibold">
                        <span>{blk.courtName}</span>
                        <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {blk.startDate}
                          {blk.startDate !== blk.endDate && ` - ${blk.endDate}`} ({blk.startTime}–{blk.endTime})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {blk.reason}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCourtBlock(blk.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200/90 dark:border-[#1A314D] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition self-start sm:self-auto cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Desbloquear</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sección 6: Pasarelas Activas */}
          <section className="py-8 space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Pasarelas de Cobro Conectadas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Proveedores habilitados para reservas online y cobros móviles.
              </p>
            </div>

            <div className="divide-y divide-slate-200/70 dark:divide-[#1A314D] border-t border-b border-slate-200/70 dark:border-[#1A314D] text-xs">
              {[
                { name: 'Stripe Connect', detail: 'Visa, Mastercard y Apple Pay', state: 'Conectado' },
                { name: 'Redsys TPV Virtual', detail: 'Pasarela bancaria española', state: 'Disponible' },
                { name: 'Bizum Pay', detail: 'Cobro instantáneo por móvil', state: 'Habilitado' },
              ].map((gw) => (
                <div key={gw.name} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-[#0B1A2D] dark:text-white">{gw.name}</span>
                    <span className="text-slate-400 mx-2" aria-hidden="true">·</span>
                    <span className="text-slate-500 dark:text-slate-400">{gw.detail}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#6e9e02] dark:text-[#B7F229] shrink-0">
                    {gw.state}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Botón Guardar Cambios con margen inferior holgado */}
          <div className="pt-6 pb-2 mb-8 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
          PESTAÑA 2: PAGOS Y POLÍTICAS
          ===================================================================== */}
      {activeSection === 'payments' && (
        <form onSubmit={handleSavePaymentsAndPolicies} className="divide-y divide-slate-200/80 dark:divide-[#1A314D]">
          {/* Política Global de Cobro */}
          <section className="pb-8 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Opciones de Pago Globales
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Define cómo liquidan los jugadores sus reservas y partidas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'both' as const,
                  title: 'Ambos (Online y En Club)',
                  desc: 'Pago por app o en mostrador al llegar.',
                },
                {
                  id: 'online_only' as const,
                  title: 'Solo Pago Online',
                  desc: 'Tarjeta o monedero obligatorio al reservar.',
                },
                {
                  id: 'counter_only' as const,
                  title: 'Solo En Club',
                  desc: 'Liquidación exclusiva en el TPV físico.',
                },
              ].map((opt) => {
                const selected = globalPaymentOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGlobalPaymentOption(opt.id)}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      selected
                        ? 'border-[#0B1A2D] dark:border-[#B7F229] bg-white dark:bg-[#0E2239]'
                        : 'border-slate-200/80 dark:border-[#1A314D] hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">{opt.title}</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">
                  Pago online obligatorio para No Socios
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Exige pago previo con tarjeta a usuarios externos para evitar no-shows.
                </p>
              </div>
              <input
                type="checkbox"
                checked={categoryPaymentRules.requireOnlineForNonMembers}
                onChange={(e) =>
                  setCategoryPaymentRules({
                    ...categoryPaymentRules,
                    requireOnlineForNonMembers: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[#0B1A2D] dark:accent-[#B7F229] cursor-pointer"
              />
            </div>
          </section>

          {/* Métodos de Pago Activos */}
          <section className="py-8 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                {t('settings.payments.title', 'Métodos de Pago en TPV y Web')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Activa o desactiva los canales de cobro disponibles.
              </p>
            </div>

            <div className="divide-y divide-slate-200/70 dark:divide-[#1A314D] border-t border-b border-slate-200/70 dark:border-[#1A314D]">
              {[
                {
                  key: 'cash' as const,
                  title: 'Efectivo (Mostrador)',
                  desc: 'Cobros directos en caja y recepción.',
                  checked: paymentMethods.cash,
                },
                {
                  key: 'manualPos' as const,
                  title: 'Datáfono del Banco (Manual)',
                  desc: 'Terminal bancario convencional.',
                  checked: paymentMethods.manualPos,
                },
                {
                  key: 'pushCharge' as const,
                  title: 'Cobro por Notificación Push',
                  desc: 'Solicitud de cobro en 1 clic a la app del socio.',
                  checked: paymentMethods.pushCharge,
                },
                {
                  key: 'wallet' as const,
                  title: 'Monedero / Saldo de Socio',
                  desc: 'Débito automático desde el saldo prepagado.',
                  checked: paymentMethods.wallet,
                },
                {
                  key: 'onlineGateway' as const,
                  title: 'Pasarela Online Stripe',
                  desc: 'Pagos con tarjeta y 3D Secure en web pública.',
                  checked: paymentMethods.onlineGateway,
                },
                {
                  key: 'stripeTerminal' as const,
                  title: 'Datáfono Integrado (Stripe Terminal)',
                  desc: 'Lector físico conectado por red al TPV.',
                  checked: paymentMethods.stripeTerminal,
                },
              ].map((m) => (
                <div key={m.key} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">{m.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{m.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePaymentMethod(m.key, !m.checked)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer shrink-0 ${
                      m.checked
                        ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                        : 'border-slate-200 dark:border-[#1A314D] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {m.checked ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              ))}
            </div>

            {paymentMethods.stripeTerminal && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className={LABEL_CLASS}>Código de Emparejamiento Stripe Terminal</label>
                  <input
                    type="text"
                    value={paymentMethods.stripeTerminalReaderCode}
                    onChange={(e) =>
                      setPaymentMethods({
                        ...paymentMethods,
                        stripeTerminalReaderCode: e.target.value,
                      })
                    }
                    className={`${INPUT_CLASS} font-mono`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePairTerminal}
                  disabled={isPairingTerminal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#0E2239] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPairingTerminal ? 'animate-spin' : ''}`} />
                  <span>{isPairingTerminal ? 'Sincronizando...' : 'Vincular Lector'}</span>
                </button>
              </div>
            )}
          </section>

          {/* Políticas de Cancelación y Descuentos */}
          <section className="py-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Cancelaciones y Descuentos a Socios
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Reembolsos por anulación y ventajas automáticas por categoría.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <label className={LABEL_CLASS}>Política de Reembolso</label>
                <select
                  value={policies.cancellationRefundType}
                  onChange={(e) =>
                    setPolicies({ ...policies, cancellationRefundType: e.target.value as any })
                  }
                  className={INPUT_CLASS}
                >
                  <option value="full">Reembolso 100%</option>
                  <option value="partial">Reembolso parcial</option>
                  <option value="no_refund">Sin reembolso</option>
                </select>
              </div>

              <div>
                <label className={LABEL_CLASS}>Antelación Mínima (Horas)</label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={policies.cancellationWindowHours}
                  onChange={(e) =>
                    setPolicies({
                      ...policies,
                      cancellationWindowHours: parseInt(e.target.value, 10) || 12,
                    })
                  }
                  className={`${INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Penalización (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={policies.cancellationPenaltyPercent}
                  onChange={(e) =>
                    setPolicies({
                      ...policies,
                      cancellationPenaltyPercent: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className={`${INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Descuento Socios Pistas (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountRules.memberCourtDiscountPercent}
                  onChange={(e) =>
                    setDiscountRules({
                      ...discountRules,
                      memberCourtDiscountPercent: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className={`${INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Descuento Socios Partidas (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountRules.memberMatchDiscountPercent}
                  onChange={(e) =>
                    setDiscountRules({
                      ...discountRules,
                      memberMatchDiscountPercent: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className={`${INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Descuento Socios Tienda (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={policies.memberShopDiscountPercent}
                  onChange={(e) =>
                    setPolicies({
                      ...policies,
                      memberShopDiscountPercent: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className={`${INPUT_CLASS} font-mono tabular-nums`}
                />
              </div>
            </div>
          </section>

          <div className="pt-6 pb-2 mb-8 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
          PESTAÑA 3: CUPONES Y BONOS
          ===================================================================== */}
      {activeSection === 'promos' && (
        <div className="divide-y divide-slate-200/80 dark:divide-[#1A314D] pb-4 mb-8">
          <section className="pb-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Cupones de Descuento
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Códigos promocionales para reservas y tienda online.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCouponModal(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-200/90 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#0E2239] transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Cupón</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-[#1A314D] text-[11px] font-semibold text-slate-400">
                    <th className="py-2.5 pr-4">Código</th>
                    <th className="py-2.5 px-4">Descuento</th>
                    <th className="py-2.5 px-4">Ámbito</th>
                    <th className="py-2.5 px-4">Estado</th>
                    <th className="py-2.5 pl-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1A314D]">
                  {coupons.map((cp) => (
                    <tr key={cp.id}>
                      <td className="py-3 pr-4 font-mono font-bold text-[#0B1A2D] dark:text-white">
                        {cp.code}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold tabular-nums text-[#0B1A2D] dark:text-[#B7F229]">
                        {cp.discountType === 'percent'
                          ? `${cp.discountValue}%`
                          : `${cp.discountValue.toFixed(2)} €`}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {cp.scope === 'global'
                          ? 'Global'
                          : cp.scope === 'courts'
                          ? 'Pistas'
                          : 'Tienda'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {cp.active ? 'Activo' : 'Inactivo'}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = coupons.map((c) =>
                              c.id === cp.id ? { ...c, active: !c.active } : c
                            );
                            setCoupons(updated);
                            updateCurrentTenant({
                              settings: { ...currentTenant.settings, coupons: updated },
                            });
                          }}
                          className="font-semibold text-[#0B1A2D] dark:text-[#B7F229] hover:underline cursor-pointer"
                        >
                          {cp.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="py-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Bonos de Clases
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Paquetes prepagados de sesiones para alumnos de escuela.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVoucherModal(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-200/90 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#0E2239] transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Bono</span>
              </button>
            </div>

            <div className="divide-y divide-slate-200/70 dark:divide-[#1A314D] border-t border-b border-slate-200/70 dark:border-[#1A314D]">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-[#0B1A2D] dark:text-white">{v.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {v.classesCount} clases · Validez {v.validityDays} días
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums">
                    <span className="font-bold text-[#0B1A2D] dark:text-white">
                      {v.price.toFixed(2)} €
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({(v.price / v.classesCount).toFixed(2)} €/clase)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          PESTAÑA 4: IA MULTICANAL
          ===================================================================== */}
      {activeSection === 'ai' && (
        <form onSubmit={handleSaveAIConfig} className="divide-y divide-slate-200/80 dark:divide-[#1A314D]">
          <section className="pb-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Credenciales y Modelo (BYOK)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Conecta tu clave privada y elige el modelo del asistente del club.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <label className={LABEL_CLASS}>Proveedor</label>
                <select
                  value={aiProvider}
                  onChange={(e) => {
                    const p = e.target.value as typeof aiProvider;
                    setAiProvider(p);
                    if (p === 'gemini') setAiModel('gemini-2.5-flash');
                    else if (p === 'openai') setAiModel('gpt-4o');
                    else setAiModel('claude-3-5-sonnet');
                  }}
                  className={INPUT_CLASS}
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="claude">Anthropic Claude</option>
                </select>
              </div>

              <div>
                <label className={LABEL_CLASS}>Modelo</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className={`${INPUT_CLASS} font-mono`}
                >
                  {aiProvider === 'gemini' && (
                    <>
                      <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                      <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                    </>
                  )}
                  {aiProvider === 'openai' && (
                    <>
                      <option value="gpt-4o">gpt-4o</option>
                      <option value="gpt-4o-mini">gpt-4o-mini</option>
                    </>
                  )}
                  {aiProvider === 'claude' && (
                    <>
                      <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                      <option value="claude-3-haiku">claude-3-haiku</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className={LABEL_CLASS}>API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    className={`${INPUT_CLASS} font-mono pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                    aria-label="Mostrar u ocultar clave"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Canales y Comportamiento
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Activa canales conectados, tono de comunicación e instrucciones maestras.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Web Pública', active: channelWeb, toggle: () => setChannelWeb(!channelWeb) },
                { label: 'WhatsApp', active: channelWhatsApp, toggle: () => setChannelWhatsApp(!channelWhatsApp) },
                { label: 'Instagram', active: channelInstagram, toggle: () => setChannelInstagram(!channelInstagram) },
                { label: 'Facebook', active: channelFacebook, toggle: () => setChannelFacebook(!channelFacebook) },
              ].map((ch) => (
                <button
                  key={ch.label}
                  type="button"
                  onClick={ch.toggle}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    ch.active
                      ? 'border-[#0B1A2D] dark:border-[#B7F229] bg-white dark:bg-[#0E2239]'
                      : 'border-slate-200/80 dark:border-[#1A314D] opacity-65'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B1A2D] dark:text-white">
                    <span>{ch.label}</span>
                    {ch.active && <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {ch.active ? 'Activo' : 'Pausado'}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2">
              <div>
                <label className={LABEL_CLASS}>Tono de Voz</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value as typeof aiTone)}
                  className={INPUT_CLASS}
                >
                  <option value="profesional">Profesional</option>
                  <option value="cercano">Cercano</option>
                  <option value="deportivo">Deportivo</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div>
                <span className={LABEL_CLASS}>Idioma Automático</span>
                <button
                  type="button"
                  onClick={() => setAiMultiLanguage(!aiMultiLanguage)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                    aiMultiLanguage
                      ? 'border-[#0B1A2D] dark:border-[#B7F229] text-[#0B1A2D] dark:text-white'
                      : 'border-slate-200/90 dark:border-[#1A314D] text-slate-500'
                  }`}
                >
                  {aiMultiLanguage ? 'Multiidioma automático activado' : 'Solo español'}
                </button>
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL_CLASS}>Mensaje de Bienvenida</label>
                <input
                  type="text"
                  value={aiWelcomeMessage}
                  onChange={(e) => setAiWelcomeMessage(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL_CLASS}>Instrucciones del Sistema</label>
                <textarea
                  rows={3}
                  value={aiSystemPrompt}
                  onChange={(e) => setAiSystemPrompt(e.target.value)}
                  className={`${INPUT_CLASS} leading-relaxed`}
                />
              </div>
            </div>
          </section>

          <section className="py-8 space-y-4">
            <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
              Prueba Rápida del Agente
            </h2>
            <div className="space-y-2.5 max-h-44 overflow-y-auto py-2">
              {testResponses.map((r, i) => (
                <div
                  key={i}
                  className={`px-3.5 py-2.5 rounded-xl text-xs max-w-[85%] ${
                    r.sender === 'user'
                      ? 'ml-auto bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] font-medium'
                      : 'bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-slate-200'
                  }`}
                >
                  {r.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTestSend();
                  }
                }}
                placeholder="Escribe una pregunta de prueba..."
                className={INPUT_CLASS}
              />
              <button
                type="button"
                onClick={handleTestSend}
                className="px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#0E2239] transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </section>

          <div className="pt-6 pb-2 mb-8 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
          PESTAÑA 5: ENVÍOS Y LOGÍSTICA
          ===================================================================== */}
      {activeSection === 'shipping' && (
        <form onSubmit={handleSaveShippingConfig} className="divide-y divide-slate-200/80 dark:divide-[#1A314D]">
          <section className="pb-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Tarifas de Envío y Logística
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configura los portes de pedidos realizados en la tienda del club.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'flat_rate' as const, title: 'Tarifa Plana', desc: 'Coste único con portes gratis.' },
                { id: 'custom' as const, title: 'Por Zonas', desc: 'Precio diferenciado por destino.' },
                { id: 'api' as const, title: 'Integración API', desc: 'Conexión con mensajería.' },
              ].map((m) => {
                const selected = shippingConfig.mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setShippingConfig({ ...shippingConfig, mode: m.id })}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      selected
                        ? 'border-[#0B1A2D] dark:border-[#B7F229] bg-white dark:bg-[#0E2239]'
                        : 'border-slate-200/80 dark:border-[#1A314D]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">{m.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{m.desc}</div>
                  </button>
                );
              })}
            </div>

            {shippingConfig.mode === 'flat_rate' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className={LABEL_CLASS}>Tarifa Plana Estándar (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    min={0}
                    value={shippingConfig.flatRatePrice}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        flatRatePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={`${INPUT_CLASS} font-mono tabular-nums`}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Envío Gratis desde (€)</label>
                  <input
                    type="number"
                    step="1"
                    min={0}
                    value={shippingConfig.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        freeShippingThreshold: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={`${INPUT_CLASS} font-mono tabular-nums`}
                  />
                </div>
              </div>
            )}

            {shippingConfig.mode === 'custom' && (
              <div className="divide-y divide-slate-200/70 dark:divide-[#1A314D] border-t border-b border-slate-200/70 dark:border-[#1A314D]">
                {shippingConfig.rates.map((rate, idx) => (
                  <div key={rate.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-[#0B1A2D] dark:text-white">{rate.zone}</div>
                      <div className="text-[11px] text-slate-400">{rate.estimatedDays}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        step="0.10"
                        min={0}
                        value={rate.price}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const updated = shippingConfig.rates.map((r, i) =>
                            i === idx ? { ...r, price: val } : r
                          );
                          setShippingConfig({ ...shippingConfig, rates: updated });
                        }}
                        className="w-24 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#071220] border border-slate-200/90 dark:border-[#1A314D] text-right font-mono tabular-nums text-xs text-[#0B1A2D] dark:text-white"
                      />
                      <span className="text-slate-400 font-bold">€</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {shippingConfig.mode === 'api' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className={LABEL_CLASS}>Transportista</label>
                  <select
                    value={shippingConfig.apiIntegration.carrier}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        apiIntegration: {
                          ...shippingConfig.apiIntegration,
                          carrier: e.target.value as any,
                        },
                      })
                    }
                    className={INPUT_CLASS}
                  >
                    <option value="correos_express">Correos Express</option>
                    <option value="seur">SEUR</option>
                    <option value="gls">GLS</option>
                    <option value="dhl">DHL</option>
                    <option value="mrw">MRW</option>
                    <option value="sendcloud">Sendcloud</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Cuenta de Cliente</label>
                  <input
                    type="text"
                    value={shippingConfig.apiIntegration.accountNumber}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        apiIntegration: {
                          ...shippingConfig.apiIntegration,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    className={`${INPUT_CLASS} font-mono`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL_CLASS}>Dirección de Recogida</label>
                  <input
                    type="text"
                    value={shippingConfig.apiIntegration.pickupAddress}
                    onChange={(e) =>
                      setShippingConfig({
                        ...shippingConfig,
                        apiIntegration: {
                          ...shippingConfig.apiIntegration,
                          pickupAddress: e.target.value,
                        },
                      })
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            )}
          </section>

          <div className="pt-6 pb-2 mb-8 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
          PESTAÑA 6: NOTIFICACIONES
          ===================================================================== */}
      {activeSection === 'notifications' && (
        <div className="mb-8">
          <AdminNotificationSettings />
        </div>
      )}

      {/* =====================================================================
          MODAL: BLOQUEO DE PISTAS
          ===================================================================== */}
      {isLockoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Programar Bloqueo de Pistas
              </h3>
              <button
                type="button"
                onClick={() => setIsLockoutModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourtBlock} className="space-y-4 text-xs">
              <div>
                <label className={LABEL_CLASS}>Pistas Afectadas</label>
                <select
                  value={newBlockForm.courtName}
                  onChange={(e) => setNewBlockForm({ ...newBlockForm, courtName: e.target.value })}
                  className={INPUT_CLASS}
                >
                  <option value="Todas las Pistas">Todas las Pistas del Club</option>
                  {courts.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.courtType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={newBlockForm.startDate}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, startDate: e.target.value })}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Fecha Fin</label>
                  <input
                    type="date"
                    required
                    value={newBlockForm.endDate}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, endDate: e.target.value })}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={newBlockForm.startTime}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, startTime: e.target.value })}
                    className={`${INPUT_CLASS} font-mono`}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Hora Fin</label>
                  <input
                    type="time"
                    required
                    value={newBlockForm.endTime}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, endTime: e.target.value })}
                    className={`${INPUT_CLASS} font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>Motivo</label>
                <input
                  type="text"
                  required
                  value={newBlockForm.reason}
                  onChange={(e) => setNewBlockForm({ ...newBlockForm, reason: e.target.value })}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLockoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] font-bold cursor-pointer"
                >
                  Confirmar Bloqueo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: NUEVO CUPÓN
          ===================================================================== */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Nuevo Cupón de Descuento
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCouponModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className={LABEL_CLASS}>Código</label>
                <input
                  type="text"
                  required
                  value={newCouponForm.code}
                  onChange={(e) =>
                    setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })
                  }
                  placeholder="BIENVENIDA15"
                  className={`${INPUT_CLASS} font-mono`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>Tipo</label>
                  <select
                    value={newCouponForm.discountType}
                    onChange={(e) =>
                      setNewCouponForm({ ...newCouponForm, discountType: e.target.value as any })
                    }
                    className={INPUT_CLASS}
                  >
                    <option value="percent">Porcentaje (%)</option>
                    <option value="fixed">Importe fijo (€)</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Valor</label>
                  <input
                    type="number"
                    min={1}
                    value={newCouponForm.discountValue}
                    onChange={(e) =>
                      setNewCouponForm({
                        ...newCouponForm,
                        discountValue: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={`${INPUT_CLASS} font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>Ámbito</label>
                <select
                  value={newCouponForm.scope}
                  onChange={(e) =>
                    setNewCouponForm({ ...newCouponForm, scope: e.target.value as any })
                  }
                  className={INPUT_CLASS}
                >
                  <option value="global">Global</option>
                  <option value="courts">Solo Pistas</option>
                  <option value="shop">Solo Tienda</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] font-bold cursor-pointer"
                >
                  Crear Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: NUEVO BONO DE CLASES
          ===================================================================== */}
      {showAddVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                Nuevo Bono de Clases
              </h3>
              <button
                type="button"
                onClick={() => setShowAddVoucherModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-4 text-xs">
              <div>
                <label className={LABEL_CLASS}>Título del Bono</label>
                <input
                  type="text"
                  required
                  value={newVoucherForm.title}
                  onChange={(e) => setNewVoucherForm({ ...newVoucherForm, title: e.target.value })}
                  placeholder="Bono 5 Clases Particulares"
                  className={INPUT_CLASS}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={LABEL_CLASS}>Clases</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newVoucherForm.classesCount}
                    onChange={(e) =>
                      setNewVoucherForm({
                        ...newVoucherForm,
                        classesCount: parseInt(e.target.value, 10) || 5,
                      })
                    }
                    className={`${INPUT_CLASS} font-mono`}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Precio (€)</label>
                  <input
                    type="number"
                    min={1}
                    value={newVoucherForm.price}
                    onChange={(e) =>
                      setNewVoucherForm({
                        ...newVoucherForm,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={`${INPUT_CLASS} font-mono`}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Validez (días)</label>
                  <input
                    type="number"
                    min={1}
                    value={newVoucherForm.validityDays}
                    onChange={(e) =>
                      setNewVoucherForm({
                        ...newVoucherForm,
                        validityDays: parseInt(e.target.value, 10) || 60,
                      })
                    }
                    className={`${INPUT_CLASS} font-mono`}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVoucherModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1A2D] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] font-bold cursor-pointer"
                >
                  Crear Bono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
