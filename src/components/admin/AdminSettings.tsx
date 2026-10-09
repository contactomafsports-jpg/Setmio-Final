import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DiscountCoupon, ClassVoucher } from '../../types/database';
import {
  Settings,
  MessageCircle,
  CreditCard,
  Building2,
  Clock,
  Save,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
  Laptop,
  Layers,
  ArrowRight,
  Sparkles,
  Bot,
  Key,
  Globe,
  Share2,
  Instagram,
  Facebook,
  Eye,
  EyeOff,
  Check,
  Send,
  Sliders,
  X,
  Smartphone,
  Banknote,
  Radio,
  Ticket,
  Percent,
  Tag,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Wallet,
  Shield,
  Award,
  Truck,
  Package,
} from 'lucide-react';

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

export const AdminSettings: React.FC = () => {
  const { currentTenant, updateCurrentTenant, triggerDemoToast, theme, setTheme, setAdminTab, courts, language, t } = useApp();

  const [activeSection, setActiveSection] = useState<'general' | 'payments' | 'promos' | 'ai' | 'shipping'>('general');

  // URL route sync for /gestion/ajustes/ia, /admin/ajustes/pagos, /admin/ajustes/envios, etc.
  useEffect(() => {
    const handleUrlSettings = () => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      if (pathname === '/gestion/ajustes/ia' || pathname.endsWith('/ia')) {
        setActiveSection('ai');
      } else if (pathname.includes('/pagos') || pathname.includes('/payments') || pathname.includes('/metodos-pago')) {
        setActiveSection('payments');
      } else if (pathname.includes('/cupones') || pathname.includes('/bonos') || pathname.includes('/promociones')) {
        setActiveSection('promos');
      } else if (pathname.includes('/envios') || pathname.includes('/shipping') || pathname.includes('/logistica')) {
        setActiveSection('shipping');
      } else if (pathname === '/gestion/ajustes' || pathname === '/gestion/configuracion' || pathname === '/admin/ajustes') {
        setActiveSection('general');
      }
    };
    handleUrlSettings();
    window.addEventListener('popstate', handleUrlSettings);
    return () => window.removeEventListener('popstate', handleUrlSettings);
  }, []);

  // 1. Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState({
    cash: currentTenant.settings?.paymentMethods?.cash ?? true,
    manualPos: currentTenant.settings?.paymentMethods?.manualPos ?? true,
    stripeTerminal: currentTenant.settings?.paymentMethods?.stripeTerminal ?? true,
    stripeTerminalReaderCode: currentTenant.settings?.paymentMethods?.stripeTerminalReaderCode ?? 'gold-bear-apple',
    stripeTerminalStatus: currentTenant.settings?.paymentMethods?.stripeTerminalStatus ?? 'connected',
    pushCharge: currentTenant.settings?.paymentMethods?.pushCharge ?? true,
    wallet: currentTenant.settings?.paymentMethods?.wallet ?? true,
    onlineGateway: currentTenant.settings?.paymentMethods?.onlineGateway ?? true,
  });

  // 2. Club Policies State
  const [policies, setPolicies] = useState({
    requireOnlinePayment: currentTenant.settings?.policies?.requireOnlinePayment ?? false,
    allowCounterPayment: currentTenant.settings?.policies?.allowCounterPayment ?? true,
    cancellationRefundType: currentTenant.settings?.policies?.cancellationRefundType ?? 'partial',
    cancellationWindowHours: currentTenant.settings?.policies?.cancellationWindowHours ?? 12,
    cancellationPenaltyPercent: currentTenant.settings?.policies?.cancellationPenaltyPercent ?? 50,
    memberCourtDiscountPercent: currentTenant.settings?.policies?.memberCourtDiscountPercent ?? 20,
    memberShopDiscountPercent: currentTenant.settings?.policies?.memberShopDiscountPercent ?? 10,
  });

  // 3. Discount Coupons State
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

  // 4. Class Vouchers State
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

  const [isPairingTerminal, setIsPairingTerminal] = useState(false);

  const handlePairTerminal = () => {
    setIsPairingTerminal(true);
    triggerDemoToast(
      t('settings.payments.stripeStatusPairing', 'Sincronizando...'),
      `Enviando handshake a lector con código "${paymentMethods.stripeTerminalReaderCode}".`,
      'info'
    );
    setTimeout(() => {
      setIsPairingTerminal(false);
      setPaymentMethods((prev) => ({ ...prev, stripeTerminalStatus: 'connected' }));
      triggerDemoToast(
        t('settings.payments.stripeStatusConnected', 'Lector Vinculado y Activo'),
        'Dispositivo Bwise WisePOS E (IP: 192.168.1.144) listo para cobros en TPV.',
        'success'
      );
    }, 1200);
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
      },
    });
    triggerDemoToast(
      t('settings.saveSuccess', 'Configuración del Club Guardada'),
      t('settings.saveSuccessDesc', 'Las políticas y métodos de pago han sido actualizados.'),
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
    triggerDemoToast('Cupón Creado', `Cupón ${item.code} añadido con éxito.`, 'success');
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
    triggerDemoToast('Bono de Clases Creado', `Bono "${item.title}" disponible para venta.`, 'success');
  };

  // Shipping & Logistics Configuration State
  const [shippingConfig, setShippingConfig] = useState({
    mode: 'flat_rate' as 'flat_rate' | 'custom' | 'api',
    flatRatePrice: 4.90,
    freeShippingThreshold: 60.00,
    enableFreeShipping: true,
    rates: [
      { id: 'r-1', zone: 'Local / Ferrolterra (A Coruña)', price: 2.90, estimatedDays: '24h' },
      { id: 'r-2', zone: 'Península (España y Portugal)', price: 4.90, estimatedDays: '24-48h' },
      { id: 'r-3', zone: 'Baleares y Canarias', price: 8.90, estimatedDays: '48-72h' },
      { id: 'r-4', zone: 'Internacional / UE', price: 14.50, estimatedDays: '3-5 días' },
    ],
    apiIntegration: {
      carrier: 'correos_express' as 'correos_express' | 'seur' | 'gls' | 'dhl' | 'mrw' | 'sendcloud',
      accountNumber: 'SETMIO-CX-8842',
      apiKey: 'cx_live_9f82d1c098e721a',
      connected: true,
      pickupAddress: 'Pistas Centrales San Mateo, Narón',
      autoLabelGeneration: true,
      trackingSms: true,
    },
  });

  const handleSaveShippingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Configuración de Envíos Guardada',
      `Modalidad (${shippingConfig.mode === 'flat_rate' ? 'Precio Único' : shippingConfig.mode === 'custom' ? 'Tarifas Personalizadas' : 'Integración Logística API'}) guardada en los ajustes del club.`,
      'success'
    );
  };

  // Modal: Bloqueo de Pistas por Rangos de Fecha y Hora
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
      'Pistas Bloqueadas',
      `Bloqueo programado para ${created.courtName} del ${created.startDate} (${created.startTime} - ${created.endTime}).`,
      'warning'
    );
  };

  const handleRemoveCourtBlock = (id: string) => {
    setCourtBlocks((prev) => prev.filter((b) => b.id !== id));
    triggerDemoToast('Bloqueo Eliminado', 'El rango horario de la pista vuelve a estar disponible para reservas.', 'info');
  };

  // General Settings State
  const [whatsappEnabled, setWhatsappEnabled] = useState(currentTenant.settings.whatsappWidgetEnabled);
  const [whatsappNumber, setWhatsappNumber] = useState(currentTenant.whatsappNumber);
  const [whatsappGreeting, setWhatsappGreeting] = useState(currentTenant.settings.whatsappGreetingMessage);
  const [chatWidgetMode, setChatWidgetMode] = useState<'whatsapp' | 'ai' | 'both'>(
    currentTenant.settings.chatWidgetMode || 'both'
  );

  const [bookingAdvanceDays, setBookingAdvanceDays] = useState(currentTenant.settings.bookingAdvanceDays);
  const [cancellationHours, setCancellationHours] = useState(currentTenant.settings.cancellationWindowHours);
  const [splitPayment, setSplitPayment] = useState(currentTenant.settings.splitPaymentAllowed);

  const [contactEmail, setContactEmail] = useState(currentTenant.contactEmail);
  const [contactPhone, setContactPhone] = useState(currentTenant.contactPhone);
  const [address, setAddress] = useState(currentTenant.address);

  // Horarios de Apertura y Cierre Semanal
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(() => {
    try {
      const saved = localStorage.getItem('setmio_club_weekly_schedule');
      return saved ? JSON.parse(saved) : DEFAULT_WEEKLY_SCHEDULE;
    } catch {
      return DEFAULT_WEEKLY_SCHEDULE;
    }
  });

  // =========================================================================
  // REQUERIMIENTO 7: CONFIGURACIÓN DE IA & AGENTES MULTICANAL
  // =========================================================================
  // 1. BYOK - Credenciales del Cliente
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai' | 'claude'>('gemini');
  const [aiApiKey, setAiApiKey] = useState('AIzaSyD-SetmioClubPro_Demo_Key_2026');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [showApiKey, setShowApiKey] = useState(false);

  // 2. Canales de Activación
  const [channelWeb, setChannelWeb] = useState(true);
  const [channelWhatsApp, setChannelWhatsApp] = useState(true);
  const [channelInstagram, setChannelInstagram] = useState(false);
  const [channelFacebook, setChannelFacebook] = useState(false);

  // 3. Personalización del Agente
  const [aiTone, setAiTone] = useState<'profesional' | 'cercano' | 'deportivo' | 'formal'>('deportivo');
  const [aiWelcomeMessage, setAiWelcomeMessage] = useState(
    `¡Hola! Soy el asistente inteligente de ${currentTenant.name}. Puedo informarte de disponibilidad de pistas, tarifas, horarios de la escuela o ayudarte a reservar. ¿En qué te asesoro hoy?`
  );
  const [aiSystemPrompt, setAiSystemPrompt] = useState(
    `Actúa como el agente oficial y recepcionista deportivo de ${currentTenant.name}. Eres experto en pádel, normas de reserva, niveles de juego y resolución de dudas de socios. Siempre sé cordial, preciso y orienta al usuario hacia la reserva de pista o inscripción en torneos.`
  );
  const [aiMultiLanguage, setAiMultiLanguage] = useState(true);

  // Live Playground State
  const [testInput, setTestInput] = useState('');
  const [testResponses, setTestResponses] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: `¡Hola! Asistente activo con modelo ${aiModel} (${aiProvider.toUpperCase()}). ¿Qué duda quieres simular?`,
    },
  ]);

  const handleTestSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const query = testInput;
    setTestResponses((prev) => [...prev, { sender: 'user', text: query }]);
    setTestInput('');

    setTimeout(() => {
      let reply = '';
      if (query.toLowerCase().includes('precio') || query.toLowerCase().includes('tarifa') || query.toLowerCase().includes('pista')) {
        reply = `En ${currentTenant.name} disponemos de pistas cubiertas de cristal WPT desde 18€/h hasta 30€/h según hora punta. ¿Quieres ver disponibilidad para hoy?`;
      } else if (query.toLowerCase().includes('clase') || query.toLowerCase().includes('escuela')) {
        reply = `Nuestra escuela cuenta con grupos de iniciación, perfeccionamiento y competición infantil dirigidos por entrenadores titulados FEP desde 55€/mes.`;
      } else {
        reply = `Como asistente con tono ${aiTone} de ${currentTenant.name}, he procesado tu consulta "${query}". Todo está perfectamente configurado con tu clave BYOK (${aiProvider}).`;
      }
      setTestResponses((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('setmio_club_weekly_schedule', JSON.stringify(weeklySchedule));
    } catch {
      // Ignore
    }

    updateCurrentTenant({
      contactEmail,
      contactPhone,
      address,
      whatsappNumber,
      settings: {
        ...currentTenant.settings,
        whatsappWidgetEnabled: whatsappEnabled,
        whatsappGreetingMessage: whatsappGreeting,
        bookingAdvanceDays,
        cancellationWindowHours: cancellationHours,
        splitPaymentAllowed: splitPayment,
        chatWidgetMode,
      },
    });

    triggerDemoToast(
      'Configuración del Club Guardada',
      'Horarios semanales de apertura, políticas de reserva y datos de contacto actualizados.',
      'success'
    );
  };

  const handleSaveAIConfig = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDemoToast(
      'Configuración de IA Guardada',
      `Clave BYOK (${aiProvider}), canales de activación y tono (${aiTone}) sincronizados con el bot multicanal.`,
      'success'
    );
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-5xl transition-colors duration-200 pb-16">
      {/* Encabezado */}
      <div>
        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Ajustes del Sistema
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Configuración de {currentTenant.shortName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Administra las reglas de negocio de pistas, modo visual, datos de contacto, pasarelas de pago y configuración del Agente de IA Multicanal.
        </p>
      </div>

      {/* Selector de Pestañas: General vs Pagos vs Promociones vs IA */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSection('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'general'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configuración General</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'payments'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{t('settings.tabs.payments', 'Métodos de Pago & Políticas')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('promos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'promos'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>{t('settings.tabs.promos', 'Cupones y Bonos')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'ai'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Configuración de IA & Agentes Multicanal</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono text-[9px] font-black">
            NUEVO
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('shipping')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'shipping'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-500" />
          <span>{t('shop.shippingSettings', 'Configuración de Envíos')}</span>
        </button>
      </div>

      {/* ======================================================================
          PESTAÑA 1: CONFIGURACIÓN GENERAL (REGLAS, APARIENCIA, PASARELAS)
          ====================================================================== */}
      {activeSection === 'general' && (
        <form onSubmit={handleSaveGeneral} className="space-y-6 text-xs">
          {/* Appearance & Theme Setting */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Modo Visual & Apariencia</span>
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Selección de Tema
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                  theme === 'light'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Modo Claro</div>
                  <div className="text-[10px] text-slate-500">Recepción / Luz día</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-300 flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Modo Oscuro</div>
                  <div className="text-[10px] text-slate-500">Canónico Slate-900</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                  theme === 'system'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-950 flex items-center justify-center shrink-0">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Automático</div>
                  <div className="text-[10px] text-slate-500">Sigue al sistema</div>
                </div>
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Datos Oficiales de Contacto del Club</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Email de Recepción</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Teléfono de Pistas</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Dirección de las Instalaciones</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Booking Rules & Advance window */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>Políticas de Reserva y Cancelación</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Días de Antelación</label>
                <input
                  type="number"
                  value={bookingAdvanceDays}
                  onChange={(e) => setBookingAdvanceDays(parseInt(e.target.value) || 7)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Días vista en la web</span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Plazo Cancelación Libre</label>
                <input
                  type="number"
                  value={cancellationHours}
                  onChange={(e) => setCancellationHours(parseInt(e.target.value) || 24)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Horas antes del turno</span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Permitir Pago Dividido</label>
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => setSplitPayment(!splitPayment)}
                    className={`px-3 py-2 rounded-xl font-bold transition w-full text-center ${
                      splitPayment
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {splitPayment ? 'Activado (1/4 por jugador)' : 'Desactivado (100% titular)'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Horarios de Apertura y Cierre Semanal del Club (Requerimiento 2.1) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Horarios de Apertura y Cierre Semanal del Club</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Configura la hora de apertura y cierre por cada día de la semana. Las pistas y la web sincronizarán los turnos automáticamente.
                </p>
              </div>

              {/* Botón de acción rápida: aplicar a todos */}
              <button
                type="button"
                onClick={() => {
                  const base = weeklySchedule[0] || { openTime: '08:00', closeTime: '23:30' };
                  setWeeklySchedule(prev => prev.map(d => ({ ...d, openTime: base.openTime, closeTime: base.closeTime })));
                  triggerDemoToast('Horarios Sincronizados', `Aplicado horario de ${base.openTime} a ${base.closeTime} a toda la semana.`, 'info');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition self-start sm:self-auto cursor-pointer"
              >
                Copiar Lunes a Toda la Semana
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
              {weeklySchedule.map((item, idx) => (
                <div
                  key={item.day}
                  className={`p-3 rounded-2xl border transition flex flex-col justify-between ${
                    item.isOpen
                      ? 'bg-slate-50/70 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-black text-xs text-slate-900 dark:text-white">
                      {item.day}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...weeklySchedule];
                        updated[idx].isOpen = !updated[idx].isOpen;
                        setWeeklySchedule(updated);
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                        item.isOpen
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {item.isOpen ? 'Abierto' : 'Cerrado'}
                    </button>
                  </div>

                  {item.isOpen ? (
                    <div className="space-y-1.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Apertura</span>
                        <input
                          type="time"
                          value={item.openTime}
                          onChange={(e) => {
                            const updated = [...weeklySchedule];
                            updated[idx].openTime = e.target.value;
                            setWeeklySchedule(updated);
                          }}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Cierre</span>
                        <input
                          type="time"
                          value={item.closeTime}
                          onChange={(e) => {
                            const updated = [...weeklySchedule];
                            updated[idx].closeTime = e.target.value;
                            setWeeklySchedule(updated);
                          }}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="py-5 text-center text-[11px] font-bold text-rose-500 dark:text-rose-400">
                      Cerrado
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bloqueo de Pistas por Rangos de Fecha y Hora */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Bloqueo de Pistas por Rangos de Fecha y Hora</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Inhabilita reservas en pistas completas o individuales para torneos, mantenimiento, clinics o eventos privados.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLockoutModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <span>+ Programar Bloqueo de Pista</span>
              </button>
            </div>

            {/* Lista de Bloqueos Activos */}
            <div className="space-y-2.5">
              {courtBlocks.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No hay bloqueos programados actualmente. Todas las pistas operan según su horario regular.
                </div>
              ) : (
                courtBlocks.map((blk) => (
                  <div
                    key={blk.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase">
                          {blk.courtName}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {blk.startDate} {blk.startDate !== blk.endDate && `al ${blk.endDate}`} · ({blk.startTime} a {blk.endTime})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Motivo: <strong>{blk.reason}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCourtBlock(blk.id)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
                    >
                      Desbloquear Pista
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment Gateways Config */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Pasarelas de Cobro de Jugadores (Club Gateway)</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                Operativo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Stripe Connect</div>
                <div className="text-[10px] text-slate-500">Tarjetas Visa, Mastercard, Apple Pay</div>
                <div className="text-emerald-600 font-bold text-[10px] pt-1">Conectado</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Redsys TPV Virtual</div>
                <div className="text-[10px] text-slate-500">Pasarela bancaria directa española</div>
                <div className="text-slate-500 text-[10px] pt-1">Listo para producción</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Bizum Pay</div>
                <div className="text-[10px] text-slate-500">Cobro instantáneo por número de móvil</div>
                <div className="text-emerald-600 font-bold text-[10px] pt-1">Habilitado</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración General</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================================
          PESTAÑA: MÉTODOS DE PAGO & POLÍTICAS DEL CLUB
          ====================================================================== */}
      {activeSection === 'payments' && (
        <form onSubmit={handleSavePaymentsAndPolicies} className="space-y-6 text-xs">
          {/* 1. MÉTODOS DE PAGO ACTIVOS */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span>{t('settings.payments.title', 'Configuración de Métodos de Pago')}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('settings.payments.subtitle', 'Activa o desactiva pasarelas y medios de cobro disponibles en el TPV de mostrador y web del club.')}
                </p>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                TPV & Online
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Efectivo */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {t('settings.payments.cash', 'Efectivo (Mostrador)')}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {t('settings.payments.cashDesc', 'Cobro tradicional en efectivo para reservas y compras en recepción o cafetería.')}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={paymentMethods.cash}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, cash: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 2. Datáfono del Banco Manual */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {t('settings.payments.manualPos', 'Datáfono del Banco (Manual)')}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {t('settings.payments.manualPosDesc', 'Cobro mediante datáfono bancario físico convencional (BBVA, Santander, CaixaBank, etc.).')}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={paymentMethods.manualPos}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, manualPos: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 3. Cobro por Notificación Push / App del Socio */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {t('settings.payments.pushCharge', 'Cobro por Notificación Push / App del Socio')}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {t('settings.payments.pushChargeDesc', 'Envía solicitud de cobro instantánea al móvil del cliente registrado para confirmación y pago en 1-clic.')}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={paymentMethods.pushCharge}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, pushCharge: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 4. Monedero / Saldo de Socio y Bonos */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {t('settings.payments.wallet', 'Monedero / Saldo de Socio y Bonos')}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {t('settings.payments.walletDesc', 'Permite debitar consumos, reservas y clases del saldo virtual prepagado del socio.')}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={paymentMethods.wallet}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, wallet: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 5. Pasarela Online Stripe (Web & App) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 md:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {t('settings.payments.onlineGateway', 'Pasarela Online Stripe (Web & App)')}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {t('settings.payments.onlineGatewayDesc', 'Cobros automáticos con tarjeta de crédito/débito y 3D Secure en la web pública.')}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={paymentMethods.onlineGateway}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, onlineGateway: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* 6. Datáfono Integrado (Stripe Terminal) con Formulario de Emparejamiento */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                        {t('settings.payments.stripeTerminal', 'Datáfono Integrado (Stripe Terminal)')}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Hardware TPV
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {t('settings.payments.stripeTerminalDesc', 'Lector físico de tarjetas conectado por red con cobro automatizado en el TPV.')}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={paymentMethods.stripeTerminal}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, stripeTerminal: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {paymentMethods.stripeTerminal && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('settings.payments.stripePairCode', 'Código de Emparejamiento del Lector')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={paymentMethods.stripeTerminalReaderCode}
                        onChange={(e) =>
                          setPaymentMethods({ ...paymentMethods, stripeTerminalReaderCode: e.target.value })
                        }
                        placeholder="ej. gold-bear-apple"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handlePairTerminal}
                        disabled={isPairingTerminal}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                      >
                        {isPairingTerminal ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>{t('settings.payments.stripeStatusPairing', 'Sincronizando...')}</span>
                          </>
                        ) : (
                          <>
                            <Radio className="w-3.5 h-3.5" />
                            <span>{t('settings.payments.stripeBtnPair', 'Vincular / Probar Lector')}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {t('settings.payments.stripePairCodeHelp', 'Código mostrado en la pantalla del lector (ej. gold-bear-apple).')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] flex items-center gap-2">
                    {paymentMethods.stripeTerminalStatus === 'connected' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <div className="font-bold text-emerald-600 dark:text-emerald-400">
                            {t('settings.payments.stripeStatusConnected', 'Lector Vinculado y Activo')}
                          </div>
                          <div className="text-[10px] text-slate-400">WisePOS E · Online</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <div className="font-bold text-amber-600 dark:text-amber-400">
                            {t('settings.payments.stripeStatusDisconnected', 'Sin Lector Vinculado')}
                          </div>
                          <div className="text-[10px] text-slate-400">Introduce código</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. POLÍTICAS DE PAGO Y CANCELACIÓN */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>{t('settings.policies.title', 'Políticas de Pago y Cancelación')}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('settings.policies.subtitle', 'Reglas de exigencia de pago previo, ventanas de anulación y penalizaciones económicas.')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Exigir Pago Online Obligatorio */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    {t('settings.policies.requireOnline', 'Pago Online Obligatorio en Reservas Web')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t('settings.policies.requireOnlineDesc', 'Si está activo, toda reserva realizada por la web o app requiere pago inmediato.')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={policies.requireOnlinePayment}
                    onChange={(e) => setPolicies({ ...policies, requireOnlinePayment: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Permitir Pago en Mostrador / Recepción */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    {t('settings.policies.allowCounter', 'Permitir Pago en Mostrador / Recepción')}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t('settings.policies.allowCounterDesc', 'Permite a los usuarios confirmar su reserva y abonar al llegar al club.')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={policies.allowCounterPayment}
                    onChange={(e) => setPolicies({ ...policies, allowCounterPayment: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Selector Política de Reembolso */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {t('settings.policies.refundType', 'Política de Cancelación y Reembolso')}
                </label>
                <select
                  value={policies.cancellationRefundType}
                  onChange={(e) => setPolicies({ ...policies, cancellationRefundType: e.target.value as any })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="full">{t('settings.policies.refundFull', 'Reembolso 100% (Monedero o Tarjeta)')}</option>
                  <option value="partial">{t('settings.policies.refundPartial', 'Reembolso Parcial (Con Penalización)')}</option>
                  <option value="no_refund">{t('settings.policies.refundNone', 'Sin Reembolso (Penalización Total)')}</option>
                </select>
              </div>

              {/* Antelación mínima de cancelación */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {t('settings.policies.cancellationWindow', 'Antelación Mínima (Horas)')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={policies.cancellationWindowHours}
                    onChange={(e) => setPolicies({ ...policies, cancellationWindowHours: parseInt(e.target.value) || 12 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {t('settings.policies.penaltyPercent', 'Penalización (%)')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={policies.cancellationPenaltyPercent}
                    onChange={(e) => setPolicies({ ...policies, cancellationPenaltyPercent: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. TARIFAS ESPECIALES Y DESCUENTOS A SOCIOS */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-emerald-500" />
                  <span>{t('settings.discounts.title', 'Tarifas Especiales y Descuentos a Socios')}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Beneficios automáticos aplicados en reservas de pistas y consumiciones de mostrador/tienda para socios activos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {t('settings.discounts.courtDiscount', 'Descuento a Socios en Reserva de Pistas (%)')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={policies.memberCourtDiscountPercent}
                    onChange={(e) => setPolicies({ ...policies, memberCourtDiscountPercent: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 pr-8"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {t('settings.discounts.shopDiscount', 'Descuento a Socios en Tienda y Bar (%)')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={policies.memberShopDiscountPercent}
                    onChange={(e) => setPolicies({ ...policies, memberShopDiscountPercent: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 pr-8"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Métodos de Pago y Políticas</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================================
          PESTAÑA: CUPONES Y BONOS DE CLASES
          ====================================================================== */}
      {activeSection === 'promos' && (
        <div className="space-y-6 text-xs">
          {/* CUPONES DE DESCUENTO */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-500" />
                  <span>{t('settings.promos.couponsTitle', 'Cupones de Descuento')}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('settings.promos.couponsSubtitle', 'Crea y administra códigos promocionales para reservas de pistas, tienda o uso global.')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCouponModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('settings.promos.newCouponBtn', 'Nuevo Cupón')}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Descuento</th>
                    <th className="py-2.5 px-3">Ámbito</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {coupons.map((cp) => (
                    <tr key={cp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3">
                        <span className="font-mono font-black text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {cp.code}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {cp.discountType === 'percent' ? `${cp.discountValue}%` : `${cp.discountValue.toFixed(2)} €`}
                      </td>
                      <td className="py-3 px-3">
                        <span className="capitalize text-slate-600 dark:text-slate-300 font-semibold">
                          {cp.scope === 'global' ? 'Global (Todo el club)' : cp.scope === 'courts' ? 'Solo Pistas' : 'Solo Tienda / Bar'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                          cp.active
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {cp.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = coupons.map((c) => (c.id === cp.id ? { ...c, active: !c.active } : c));
                            setCoupons(updated);
                            updateCurrentTenant({ settings: { ...currentTenant.settings, coupons: updated } });
                          }}
                          className="text-[11px] font-bold text-slate-500 hover:text-emerald-600 cursor-pointer"
                        >
                          {cp.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BONOS DE CLASES */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{t('settings.promos.vouchersTitle', 'Bonos de Clases de Pádel')}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('settings.promos.vouchersSubtitle', 'Packs personalizables de clases (4, 5, 8, 10 clases) para venta a alumnos y socios.')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVoucherModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('settings.promos.newVoucherBtn', 'Nuevo Bono de Clases')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Pack {v.classesCount} Clases
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {v.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Validez: {v.validityDays} días tras la compra
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                      {v.price.toFixed(2)} €
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(v.price / v.classesCount).toFixed(2)} €/clase
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MODAL: NUEVO CUPÓN */}
          {showAddCouponModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Crear Cupón de Descuento
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddCouponModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Código del Cupón
                    </label>
                    <input
                      type="text"
                      required
                      value={newCouponForm.code}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                      placeholder="Ej. BIENVENIDA15"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tipo
                      </label>
                      <select
                        value={newCouponForm.discountType}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, discountType: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="percent">Porcentaje (%)</option>
                        <option value="fixed">Fijo (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Valor
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newCouponForm.discountValue}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, discountValue: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ámbito de Aplicación
                    </label>
                    <select
                      value={newCouponForm.scope}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, scope: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="global">Global (Todo el Club)</option>
                      <option value="courts">Solo Reservas de Pistas</option>
                      <option value="shop">Solo Tienda y Cafetería</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCouponModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Crear Cupón
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL: NUEVO BONO DE CLASES */}
          {showAddVoucherModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Crear Bono de Clases
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddVoucherModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre / Título del Bono
                    </label>
                    <input
                      type="text"
                      required
                      value={newVoucherForm.title}
                      onChange={(e) => setNewVoucherForm({ ...newVoucherForm, title: e.target.value })}
                      placeholder="Ej. Bono 5 Clases Particulares"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nº Clases
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={newVoucherForm.classesCount}
                        onChange={(e) => setNewVoucherForm({ ...newVoucherForm, classesCount: parseInt(e.target.value) || 5 })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Precio (€)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newVoucherForm.price}
                        onChange={(e) => setNewVoucherForm({ ...newVoucherForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Validez (días)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newVoucherForm.validityDays}
                        onChange={(e) => setNewVoucherForm({ ...newVoucherForm, validityDays: parseInt(e.target.value) || 60 })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddVoucherModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Crear Bono
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================
          PESTAÑA 2: CONFIGURACIÓN DE IA & AGENTES MULTICANAL (REQUERIMIENTO 7)
          ====================================================================== */}
      {activeSection === 'ai' && (
        <form onSubmit={handleSaveAIConfig} className="space-y-6 text-xs">
          {/* 1. CREDENCIALES DEL CLIENTE (BYOK - Bring Your Own Key) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    1. Credenciales del Club (BYOK - Bring Your Own Key)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configura tu propio proveedor de inteligencia artificial o utiliza el motor oficial de Setmio
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
                Conexión Segura
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Proveedor de IA
                </label>
                <select
                  value={aiProvider}
                  onChange={(e) => {
                    const p = e.target.value as typeof aiProvider;
                    setAiProvider(p);
                    if (p === 'gemini') setAiModel('gemini-2.5-flash');
                    else if (p === 'openai') setAiModel('gpt-4o');
                    else setAiModel('claude-3-5-sonnet');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="gemini">Google Gemini AI (Recomendado)</option>
                  <option value="openai">OpenAI (ChatGPT-4o)</option>
                  <option value="claude">Anthropic Claude</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Modelo de Lenguaje
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                >
                  {aiProvider === 'gemini' && (
                    <>
                      <option value="gemini-2.5-flash">gemini-2.5-flash (Ultra Rápido)</option>
                      <option value="gemini-2.5-pro">gemini-2.5-pro (Máxima Precisión)</option>
                    </>
                  )}
                  {aiProvider === 'openai' && (
                    <>
                      <option value="gpt-4o">gpt-4o (Omni)</option>
                      <option value="gpt-4o-mini">gpt-4o-mini (Económico)</option>
                    </>
                  )}
                  {aiProvider === 'claude' && (
                    <>
                      <option value="claude-3-5-sonnet">claude-3-5-sonnet-20241022</option>
                      <option value="claude-3-haiku">claude-3-haiku-20240307</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  Clave API Privada del Club (API Key)
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-3 pr-9 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CANALES DE ACTIVACIÓN MULTICANAL */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    2. Canales de Activación del Agente
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Habilita o deshabilita la presencia de la IA en cada punto de contacto con jugadores
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Web Pública */}
              <div
                onClick={() => setChannelWeb(!channelWeb)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  channelWeb
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                    channelWeb ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {channelWeb ? 'ACTIVO' : 'PAUSADO'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Web Pública / Landing</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Widget interactivo para visitantes</div>
                </div>
              </div>

              {/* WhatsApp */}
              <div
                onClick={() => setChannelWhatsApp(!channelWhatsApp)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  channelWhatsApp
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                    channelWhatsApp ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {channelWhatsApp ? 'ACTIVO' : 'PAUSADO'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">WhatsApp Business</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Respuestas 24/7 al número oficial</div>
                </div>
              </div>

              {/* Instagram */}
              <div
                onClick={() => setChannelInstagram(!channelInstagram)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  channelInstagram
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                    channelInstagram ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {channelInstagram ? 'ACTIVO' : 'PAUSADO'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Instagram Direct</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">DMs de torneos y reservas</div>
                </div>
              </div>

              {/* Facebook */}
              <div
                onClick={() => setChannelFacebook(!channelFacebook)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  channelFacebook
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                    channelFacebook ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {channelFacebook ? 'ACTIVO' : 'PAUSADO'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Facebook Messenger</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Página de Facebook del Club</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. PERSONALIZACIÓN DEL AGENTE */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    3. Personalización del Agente & Prompt del Club
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ajusta el tono de voz, mensajes de bienvenida e instrucciones maestras de sistema
                  </p>
                </div>
              </div>
            </div>

            {/* Selector de Tono de Voz */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1.5 font-bold">
                Tono de Voz del Agente:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'profesional', label: 'Profesional', desc: 'Respetuoso, corporativo y formal' },
                  { id: 'cercano', label: 'Cercano', desc: 'Amable, cálido y empático con socios' },
                  { id: 'deportivo', label: 'Deportivo', desc: 'Enérgico, dinámico y enfocado en pádel' },
                  { id: 'formal', label: 'Formal', desc: 'Directo, conciso y de alta precisión' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setAiTone(tone.id as typeof aiTone)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      aiTone === tone.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{tone.label}</span>
                      {aiTone === tone.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tone.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mensaje de Bienvenida */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                Mensaje de Bienvenida Inicial
              </label>
              <input
                type="text"
                value={aiWelcomeMessage}
                onChange={(e) => setAiWelcomeMessage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500">Primer mensaje visible al abrir el chat</span>
            </div>

            {/* Prompt del Sistema del Club */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                Instrucciones del Sistema (Prompt Maestro del Club)
              </label>
              <textarea
                rows={4}
                value={aiSystemPrompt}
                onChange={(e) => setAiSystemPrompt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
              />
              <span className="text-[10px] text-slate-500">
                Define aquí las reglas del club, horarios, tarifas especiales y políticas de pistas.
              </span>
            </div>

            {/* Toggle Modo Multiidioma Automático */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Modo Multiidioma Automático
                </span>
                <span className="text-[11px] text-slate-500">
                  Detecta el idioma del jugador (español, gallego, catalán, inglés, etc.) y responde con fluidez nativa.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setAiMultiLanguage(!aiMultiLanguage)}
                className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                  aiMultiLanguage
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {aiMultiLanguage ? 'Activado' : 'Solo Español'}
              </button>
            </div>
          </div>

          {/* 4. SIMULADOR DE PRUEBA EN VIVO */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-500" />
              <span>Simulador de Prueba en Vivo (Playground)</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 max-h-48 overflow-y-auto">
              {testResponses.map((r, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                    r.sender === 'user'
                      ? 'ml-auto bg-emerald-600 text-white font-medium'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
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
                placeholder="Escribe una pregunta para probar el agente (ej: ¿Cuánto cuesta la pista 1?)..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
              <button
                type="button"
                onClick={handleTestSend}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración de IA Multicanal</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================================
          PESTAÑA 5: CONFIGURACIÓN DE ENVÍOS Y LOGÍSTICA (Requisito Bloque 2)
          ====================================================================== */}
      {activeSection === 'shipping' && (
        <form onSubmit={handleSaveShippingConfig} className="space-y-6 text-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-500" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {t('shop.shippingSettings', 'Configuración de Gastos de Envío & Logística')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Define las tarifas aplicadas a las compras de material en la tienda online y envíos a socios: precio único, tarifas personalizadas o sincronización API con transportistas.
              </p>
            </div>

            {/* 1. Modalidad de Envíos */}
            <div className="space-y-3">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Modalidad de Tarifas de Envío
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setShippingConfig({ ...shippingConfig, mode: 'flat_rate' })}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    shippingConfig.mode === 'flat_rate'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-emerald-500" />
                    <span>{t('shop.shippingFlatRate', 'Precio Único / Tarifa Plana')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                    Coste fijo por expedición nacional con umbral para portes gratis.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingConfig({ ...shippingConfig, mode: 'custom' })}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    shippingConfig.mode === 'custom'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span>{t('shop.shippingCustomRates', 'Tarifas Personalizadas')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                    Diferenciación de coste según zona geográfica y destino.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingConfig({ ...shippingConfig, mode: 'api' })}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    shippingConfig.mode === 'api'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>{t('shop.shippingLogisticsApi', 'Integración Plataformas (API)')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                    Conexión directa con Correos Express, SEUR, GLS o Sendcloud.
                  </p>
                </button>
              </div>
            </div>

            {/* Configuración según modalidad */}
            {shippingConfig.mode === 'flat_rate' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tarifa Plana Estándar Península (€)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      min="0"
                      value={shippingConfig.flatRatePrice}
                      onChange={(e) =>
                        setShippingConfig({
                          ...shippingConfig,
                          flatRatePrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-xs text-slate-900 dark:text-white"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Aplicado a todos los pedidos que no alcancen el importe mínimo de portes gratis.
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('shop.freeShippingThreshold', 'Envío gratis a partir de (€)')}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={shippingConfig.freeShippingThreshold}
                      onChange={(e) =>
                        setShippingConfig({
                          ...shippingConfig,
                          freeShippingThreshold: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-xs text-slate-900 dark:text-white"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Pedidos con importe igual o superior viajarán sin coste de envío para el cliente.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {shippingConfig.mode === 'custom' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block">
                  Tarifas por Destino y Zona de Entrega
                </span>

                <div className="space-y-2">
                  {shippingConfig.rates.map((rate, idx) => (
                    <div
                      key={rate.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {rate.zone}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Plazo estimado de entrega: <strong className="text-slate-700 dark:text-slate-300">{rate.estimatedDays}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          step="0.10"
                          min="0"
                          value={rate.price}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const updated = shippingConfig.rates.map((r, i) =>
                              i === idx ? { ...r, price: val } : r
                            );
                            setShippingConfig({ ...shippingConfig, rates: updated });
                          }}
                          className="w-20 px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-right font-mono font-bold text-xs"
                        />
                        <span className="font-bold text-slate-400 text-xs">€</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {shippingConfig.mode === 'api' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Conector de API Logística Activo
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Sincronizado
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('shop.logisticsCarrier', 'Empresa de Transporte Principal')}
                    </label>
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
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="correos_express">Correos Express (Paq 24 / Paq Empresa)</option>
                      <option value="seur">SEUR (SEUR 24 / DPD Group)</option>
                      <option value="gls">GLS Parcel Spain</option>
                      <option value="dhl">DHL Express Spain</option>
                      <option value="mrw">MRW Urgente</option>
                      <option value="sendcloud">Sendcloud Multi-carrier Hub</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Cuenta / Cliente Logístico
                    </label>
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
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('shop.logisticsApiKey', 'Clave API / Token Secreto de Logística')}
                    </label>
                    <input
                      type="password"
                      value={shippingConfig.apiIntegration.apiKey}
                      onChange={(e) =>
                        setShippingConfig({
                          ...shippingConfig,
                          apiIntegration: {
                            ...shippingConfig.apiIntegration,
                            apiKey: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Dirección de Recogida de Almacén (Club)
                    </label>
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
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botón Guardar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{t('shop.saveShipping', 'Guardar Configuración de Envíos')}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =====================================================================
          MODAL: BLOQUEO DE PISTAS POR RANGOS DE FECHA Y HORA
          ===================================================================== */}
      {isLockoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Programar Bloqueo de Pistas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLockoutModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourtBlock} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pistas Afectadas
                </label>
                <select
                  value={newBlockForm.courtName}
                  onChange={(e) => setNewBlockForm({ ...newBlockForm, courtName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
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
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    required
                    value={newBlockForm.startDate}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    required
                    value={newBlockForm.endDate}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={newBlockForm.startTime}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    required
                    value={newBlockForm.endTime}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Motivo del Bloqueo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mantenimiento, Torneo Oficial o Evento Privado"
                  value={newBlockForm.reason}
                  onChange={(e) => setNewBlockForm({ ...newBlockForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900 dark:text-amber-200">
                  <input
                    type="checkbox"
                    checked={newBlockForm.notifyRefund}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, notifyRefund: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Cancelar reservas afectadas y reembolsar saldo al monedero</span>
                </label>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Si un socio ya tenía reserva en este rango, se le notificará por WhatsApp y se le devolverá el 100% a su saldo.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLockoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-xs"
                >
                  Confirmar Bloqueo
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
