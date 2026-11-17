import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Palette,
  Eye,
  Smartphone,
  Monitor,
  Save,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Layers,
  Check,
  Edit3,
  X,
  Globe,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { AdminSectionHeader } from './AdminSectionHeader';

export interface PublicPageConfigItem {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  badge: string;
  heroImage: string;
  ctaText: string;
  secondaryText: string;
  isVisible: boolean;
}

const DEFAULT_PUBLIC_PAGES: PublicPageConfigItem[] = [
  {
    id: 'home',
    name: 'Inicio',
    title: 'Tu Club de Pádel de Referencia',
    subtitle: '8 pistas oficiales Mondo Supercourt WPT, escuela de formación federada y dinamización de partidos abiertos.',
    badge: 'PÁDEL DE ALTA COMPETICIÓN',
    heroImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Reservar Pista Ahora',
    secondaryText: 'Reserva online en 3 clics sin llamadas ni esperas.',
    isVisible: true,
  },
  {
    id: 'courts',
    name: 'Pistas e Instalaciones',
    title: 'Instalaciones y Pistas Homologadas',
    subtitle: 'Césped texturizado Mondo Supercourt XN, iluminación LED de competición TV y cerramientos de cristal templado 12mm.',
    badge: 'HOMOLOGADO POR LA FIP',
    heroImage: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Ver Pistas y Reservar',
    secondaryText: 'Pistas cubiertas climatizadas y panorámicas exteriores.',
    isVisible: true,
  },
  {
    id: 'matches',
    name: 'Partidos Abiertos',
    title: 'Partidos Abiertos & Dinamización',
    subtitle: 'Súmate a partidas niveladas automáticamente según tu nivel ELO o crea un nuevo reto invitando a jugadores.',
    badge: 'NIVELES ELO & MATCHMAKING',
    heroImage: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Buscar Partidos Abiertos',
    secondaryText: 'Calculador de nivel automático tras cada resultado subido.',
    isVisible: true,
  },
  {
    id: 'academy',
    name: 'Escuela y Clases',
    title: 'Academia Oficial & Escuela de Pádel',
    subtitle: 'Metodología integral para menores y adultos, desde iniciación técnica hasta alta competición y tecnificación física.',
    badge: 'ENTRENADORES TITULADOS FEP',
    heroImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Solicitar Plaza en Escuela',
    secondaryText: 'Grupos reducidos de máximo 4 alumnos con test de nivel previo.',
    isVisible: true,
  },
  {
    id: 'tournaments',
    name: 'Torneos y Competiciones',
    title: 'Torneos, Ligas y Circuitos Oficiales',
    subtitle: 'Compite en nuestros torneos federados de fin de semana con cuadros eliminatorios en directo y premios en metálico.',
    badge: 'CIRCUITO OFICIAL',
    heroImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Inscribir Pareja a Torneo',
    secondaryText: 'Welcome pack con camiseta técnica oficial y agua para todos los inscritos.',
    isVisible: true,
  },
  {
    id: 'teams',
    name: 'Equipos Federados',
    title: 'Equipos Oficiales del Club',
    subtitle: 'Nuestros equipos masculino, femenino y veteranos compitiendo en la Liga Gallega de Pádel FGP.',
    badge: 'COMPETICIÓN FEDERADA FGP',
    heroImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Ver Plantillas y Fichajes',
    secondaryText: 'Seguimiento de actas, capitanes y desplazamientos oficiales con GPS.',
    isVisible: true,
  },
  {
    id: 'shop',
    name: 'Tienda Oficial',
    title: 'Tienda Especializada & Pro Shop',
    subtitle: 'Las marcas número 1 de palas, calzado técnico, textil y paleteros con asesoramiento y descuentos para socios.',
    badge: 'STOCK 24H & RECOGIDA EN CLUB',
    heroImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Ver Catálogo y Ofertas',
    secondaryText: 'Prueba palas de test oficiales antes de decidir tu compra.',
    isVisible: true,
  },
  {
    id: 'rankings',
    name: 'Rankings del Club',
    title: 'Clasificaciones y Retos del Club',
    subtitle: 'Comprueba tu posición en la tabla general de socios y suma puntos en cada victoria para liderar el ranking.',
    badge: 'ACTUALIZACIÓN TRAS CADA PARTIDO',
    heroImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Consultar Tabla de Puntos',
    secondaryText: 'Clasificaciones desglosadas por 1ª, 2ª categoría, femenino y mixto.',
    isVisible: true,
  },
  {
    id: 'contact',
    name: 'Contacto y Ubicación',
    title: 'Contacto, Instalaciones y Horarios',
    subtitle: 'Encuentra cómo llegar a nuestras instalaciones, horarios de atención, cafetería panorámica y teléfono de reservas.',
    badge: 'ATENCIÓN Y RECEPCIÓN 7 DÍAS',
    heroImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Abrir WhatsApp del Club',
    secondaryText: 'Aparcamiento gratuito, vestuarios adaptados y zona lounge.',
    isVisible: true,
  },
];

const PRESET_SPORTS_IMAGES = [
  { name: 'Pista Panorámica WPT', url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Partido en Acción', url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Entrenador & Jugadora', url: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Trofeos & Competición', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Instalaciones Premium', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Plantilla de Jugadores', url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80' },
];

const PREDEFINED_PALETTES = [
  { name: 'Setmio Oficial', primary: '#0B1A2D', accent: '#B7F229' },
  { name: 'Azul Noche & Lima', primary: '#0E2239', accent: '#B7F229' },
  { name: 'Grafito & Lima Suave', primary: '#111827', accent: '#D9F99D' },
  { name: 'Azul Profundo Monocromo', primary: '#0B1A2D', accent: '#E2E8F0' },
];

const normalizeHex = (value: string, fallback: string) => {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed;
  return fallback;
};

export const AdminWebEditor: React.FC = () => {
  const { currentTenant, updateCurrentTenant, pageBlocks, updatePageBlocks, triggerDemoToast } = useApp();

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [publishStatus, setPublishStatus] = useState<'published' | 'draft_pending'>('published');
  const [activeTab, setActiveTab] = useState<'branding' | 'pages' | 'blocks'>('branding');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Multi-page editable state with persistence
  const [pagesList, setPagesList] = useState<PublicPageConfigItem[]>(() => {
    try {
      const saved = localStorage.getItem('setmio_demo_web_pages_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PUBLIC_PAGES.map((p) => {
      if (p.id === 'home' && currentTenant.branding) {
        return {
          ...p,
          title: currentTenant.branding.heroTitle || p.title,
          subtitle: currentTenant.branding.heroSubtitle || p.subtitle,
          badge: currentTenant.branding.badgeText || p.badge,
          heroImage: currentTenant.branding.heroImageUrl || p.heroImage,
        };
      }
      return p;
    });
  });

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [previewPageId, setPreviewPageId] = useState<string>('home');

  // Identidad & Marca Blanca (Logo, Favicon y Colores)
  const [logoUrl, setLogoUrl] = useState<string>(currentTenant.branding.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState<string>(currentTenant.branding.iconUrl || '');
  const [primaryColor, setPrimaryColor] = useState<string>(currentTenant.branding.primaryColor || '#0B1A2D');
  const [accentColor, setAccentColor] = useState<string>(currentTenant.branding.accentColor || '#B7F229');

  useEffect(() => {
    setLogoUrl(currentTenant.branding.logoUrl || '');
    setFaviconUrl(currentTenant.branding.iconUrl || '');
    setPrimaryColor(currentTenant.branding.primaryColor || '#0B1A2D');
    setAccentColor(currentTenant.branding.accentColor || '#B7F229');
  }, [currentTenant.id]);

  useEffect(() => {
    try {
      localStorage.setItem('setmio_demo_web_pages_v3', JSON.stringify(pagesList));
    } catch {
      // Ignore local storage error
    }
  }, [pagesList]);

  const handleImageFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'logo' | 'favicon'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      triggerDemoToast('Archivo demasiado grande', 'Selecciona una imagen de máximo 2 MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      if (target === 'logo') {
        setLogoUrl(result);
        updateCurrentTenant({
          branding: { ...currentTenant.branding, logoUrl: result },
        });
        triggerDemoToast('Logotipo actualizado', 'Se ha cargado la vista previa del logotipo.', 'success');
      } else {
        setFaviconUrl(result);
        updateCurrentTenant({
          branding: { ...currentTenant.branding, iconUrl: result },
        });
        triggerDemoToast('Favicon actualizado', 'Se ha cargado el icono de pestaña y PWA.', 'success');
      }
      setPublishStatus('draft_pending');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pagesList.length) return;

    const copy = [...pagesList];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setPagesList(copy);
    setPublishStatus('draft_pending');
  };

  const togglePageVisibility = (pageId: string) => {
    const updated = pagesList.map((p) => (p.id === pageId ? { ...p, isVisible: !p.isVisible } : p));
    setPagesList(updated);
    setPublishStatus('draft_pending');

    const visibleIds = updated.filter((p) => p.isVisible).map((p) => p.id);
    updateCurrentTenant({ publicPages: visibleIds });
  };

  const handleUpdatePageField = (pageId: string, field: keyof PublicPageConfigItem, value: string | boolean) => {
    const updated = pagesList.map((p) => (p.id === pageId ? { ...p, [field]: value } : p));
    setPagesList(updated);
    setPublishStatus('draft_pending');

    if (pageId === 'home') {
      const target = updated.find((p) => p.id === 'home');
      if (target) {
        updateCurrentTenant({
          branding: {
            ...currentTenant.branding,
            heroTitle: target.title,
            heroSubtitle: target.subtitle,
            badgeText: target.badge,
            heroImageUrl: target.heroImage,
          },
        });
      }
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...pageBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    updatePageBlocks(newBlocks);
    setPublishStatus('draft_pending');
  };

  const toggleBlockVisibility = (blockId: string) => {
    const newBlocks = pageBlocks.map((b) => (b.id === blockId ? { ...b, isVisible: !b.isVisible } : b));
    updatePageBlocks(newBlocks);
    setPublishStatus('draft_pending');
  };

  const syncBrandingPayload = () => {
    const homePage = pagesList.find((p) => p.id === 'home');
    return {
      branding: {
        ...currentTenant.branding,
        logoUrl: logoUrl.trim() || undefined,
        iconUrl: faviconUrl.trim() || undefined,
        heroTitle: homePage?.title ?? currentTenant.branding.heroTitle,
        heroSubtitle: homePage?.subtitle ?? currentTenant.branding.heroSubtitle,
        badgeText: homePage?.badge ?? currentTenant.branding.badgeText,
        heroImageUrl: homePage?.heroImage ?? currentTenant.branding.heroImageUrl,
        primaryColor: normalizeHex(primaryColor, '#0B1A2D'),
        accentColor: normalizeHex(accentColor, '#B7F229'),
      },
      publicPages: pagesList.filter((p) => p.isVisible).map((p) => p.id),
    };
  };

  const handleSaveDraft = () => {
    updateCurrentTenant(syncBrandingPayload());
    setPublishStatus('draft_pending');
    triggerDemoToast('Borrador guardado', 'Los ajustes de identidad, colores y páginas se han guardado.', 'info');
  };

  const handlePublishLive = () => {
    updateCurrentTenant(syncBrandingPayload());
    setPublishStatus('published');
    triggerDemoToast(
      'Marca Blanca publicada',
      `Cambios aplicados en vivo en ${currentTenant.domains[0]?.hostname || 'sanmateo.setmio.com'}.`,
      'success'
    );
  };

  const editingPage = pagesList.find((p) => p.id === editingPageId);
  const previewPage = pagesList.find((p) => p.id === previewPageId) || pagesList[0];
  const safePrimaryHex = normalizeHex(primaryColor, '#0B1A2D');
  const safeAccentHex = normalizeHex(accentColor, '#B7F229');

  return (
    <div className="max-w-7xl mx-auto pb-24 sm:pb-16 space-y-5 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased animate-in fade-in duration-150">
      {/* =====================================================================
          1. CABECERA ESTÁNDAR + SELECTOR DE SEDE UNIFICADO
          ===================================================================== */}
      <AdminSectionHeader
        title="Marca Blanca"
        titleBadge={
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              publishStatus === 'published'
                ? 'bg-[#B7F229]/20 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] border-[#B7F229]/50'
                : 'bg-slate-100 dark:bg-[#0E2239] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1A314D]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                publishStatus === 'published' ? 'bg-[#6e9e02] dark:bg-[#B7F229]' : 'bg-slate-400'
              }`}
            />
            <span>{publishStatus === 'published' ? 'Publicado' : 'Borrador'}</span>
          </span>
        }
        rightSlot={
          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            {/* Selector Dispositivo */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-[#071220] p-1 rounded-xl border border-slate-200/80 dark:border-[#1A314D]">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-white dark:bg-[#0E2239] text-[#0B1A2D] dark:text-[#B7F229] shadow-2xs'
                    : 'text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Vista de Escritorio"
                aria-label="Vista de Escritorio"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-white dark:bg-[#0E2239] text-[#0B1A2D] dark:text-[#B7F229] shadow-2xs'
                    : 'text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Vista Móvil"
                aria-label="Vista Móvil"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-50 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-[#1A314D] flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
              title="Guardar borrador"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guardar</span>
            </button>

            <button
              type="button"
              onClick={handlePublishLive}
              className="px-3.5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#c8fa48] dark:text-[#0B1A2D] font-bold text-xs shadow-2xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publicar</span>
            </button>
          </div>
        }
      />

      {/* =====================================================================
          2. ÁREA DE CONFIGURACIÓN + VISTA PREVIA DINÁMICA
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start mb-8">
        {/* Columna Izquierda: Configuración */}
        <div className="lg:col-span-6 space-y-5">
          {/* Selector de Pestañas */}
          <div className="p-1 bg-slate-100 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] rounded-2xl grid grid-cols-3 gap-1 w-full text-xs select-none shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('branding')}
              className={`py-2.5 px-2 text-center rounded-xl font-bold transition cursor-pointer truncate ${
                activeTab === 'branding'
                  ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              Identidad & Colores
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pages')}
              className={`py-2.5 px-2 text-center rounded-xl font-bold transition cursor-pointer truncate ${
                activeTab === 'pages'
                  ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              Páginas ({pagesList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('blocks')}
              className={`py-2.5 px-2 text-center rounded-xl font-bold transition cursor-pointer truncate ${
                activeTab === 'blocks'
                  ? 'bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
              }`}
            >
              Bloques Inicio
            </button>
          </div>

          {/* =================================================================
              TAB 1: TARJETAS DE CONFIGURACIÓN (LOGO, FAVICON Y COLORES)
              ================================================================= */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              {/* Tarjeta 1: Logotipo Oficial */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                      Logotipo del Club
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Visible en la cabecera web y portales de socios.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    SVG · PNG
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#071220] border border-slate-200/80 dark:border-[#1A314D] flex items-center justify-center overflow-hidden shrink-0">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo del club"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        onChange={(e) => handleImageFileSelect(e, 'logo')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir logotipo</span>
                      </button>

                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setLogoUrl('');
                            setPublishStatus('draft_pending');
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-[#071220] transition cursor-pointer"
                          title="Quitar logotipo"
                          aria-label="Quitar logotipo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => {
                        setLogoUrl(e.target.value);
                        setPublishStatus('draft_pending');
                      }}
                      placeholder="https://tuclub.com/logo.svg"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-xs font-mono text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Favicon / Isotipo */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                      Favicon e Isotipo App
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Icono cuadrado para pestañas del navegador y acceso móvil.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    64 × 64 px
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-[#0B1A2D] text-[#B7F229] border border-[#1A314D] flex items-center justify-center overflow-hidden shrink-0">
                    {faviconUrl ? (
                      <img
                        src={faviconUrl}
                        alt="Favicon"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        ref={faviconInputRef}
                        type="file"
                        accept="image/png,image/svg+xml,image/x-icon,image/webp"
                        onChange={(e) => handleImageFileSelect(e, 'favicon')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => faviconInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071220] dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 border border-slate-200/80 dark:border-[#1A314D] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir favicon</span>
                      </button>

                      {faviconUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setFaviconUrl('');
                            setPublishStatus('draft_pending');
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-[#071220] transition cursor-pointer"
                          title="Restablecer favicon"
                          aria-label="Restablecer favicon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <input
                      type="url"
                      value={faviconUrl}
                      onChange={(e) => {
                        setFaviconUrl(e.target.value);
                        setPublishStatus('draft_pending');
                      }}
                      placeholder="https://tuclub.com/favicon.png"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-xs font-mono text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Tarjeta 3: Personalización de Colores (HEX) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                    <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
                      Colores de Marca
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">CSS / HEX</span>
                </div>

                {/* Lista limpia de tokens de color */}
                <div className="divide-y divide-slate-100 dark:divide-[#1A314D] border-y border-slate-100 dark:border-[#1A314D]">
                  {/* Color Principal */}
                  <div className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">
                        Color Principal
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Cabeceras, tipografía destacada y fondos clave
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label
                        className="w-8 h-8 rounded-xl border border-slate-200 dark:border-[#1A314D] cursor-pointer overflow-hidden shrink-0 shadow-2xs"
                        style={{ backgroundColor: safePrimaryHex }}
                        title="Seleccionar color principal"
                      >
                        <input
                          type="color"
                          value={safePrimaryHex}
                          onChange={(e) => {
                            setPrimaryColor(e.target.value.toUpperCase());
                            setPublishStatus('draft_pending');
                          }}
                          className="opacity-0 w-full h-full cursor-pointer"
                        />
                      </label>
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => {
                          setPrimaryColor(e.target.value);
                          setPublishStatus('draft_pending');
                        }}
                        placeholder="#0B1A2D"
                        className="w-24 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white font-mono text-xs uppercase font-bold focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                      />
                    </div>
                  </div>

                  {/* Color de Acento */}
                  <div className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">
                        Color de Acento
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Botones de acción, detalles e indicadores
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label
                        className="w-8 h-8 rounded-xl border border-slate-200 dark:border-[#1A314D] cursor-pointer overflow-hidden shrink-0 shadow-2xs"
                        style={{ backgroundColor: safeAccentHex }}
                        title="Seleccionar color de acento"
                      >
                        <input
                          type="color"
                          value={safeAccentHex}
                          onChange={(e) => {
                            setAccentColor(e.target.value.toUpperCase());
                            setPublishStatus('draft_pending');
                          }}
                          className="opacity-0 w-full h-full cursor-pointer"
                        />
                      </label>
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => {
                          setAccentColor(e.target.value);
                          setPublishStatus('draft_pending');
                        }}
                        placeholder="#B7F229"
                        className="w-24 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white font-mono text-xs uppercase font-bold focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                      />
                    </div>
                  </div>
                </div>

                {/* Combinaciones Recomendadas (Sobrias / Paleta Oficial) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Combinaciones recomendadas
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PREDEFINED_PALETTES.map((pal) => {
                      const isSelected =
                        primaryColor.toUpperCase() === pal.primary &&
                        accentColor.toUpperCase() === pal.accent;
                      return (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() => {
                            setPrimaryColor(pal.primary);
                            setAccentColor(pal.accent);
                            setPublishStatus('draft_pending');
                          }}
                          className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-[#0B1A2D]/5 dark:bg-[#B7F229]/10 border-[#0B1A2D] dark:border-[#B7F229]'
                              : 'bg-slate-50 dark:bg-[#071220] border-slate-200/80 dark:border-[#1A314D] hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex items-center -space-x-1 shrink-0">
                              <span
                                className="w-4 h-4 rounded-full border border-white dark:border-[#0E2239]"
                                style={{ backgroundColor: pal.primary }}
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-white dark:border-[#0E2239]"
                                style={{ backgroundColor: pal.accent }}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#0B1A2D] dark:text-white truncate">
                              {pal.name}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 2: TODAS LAS PÁGINAS DE LA WEB PÚBLICA
              ================================================================= */}
          {activeTab === 'pages' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                    <span>Páginas de la Web Pública</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Reordena, oculta o edita textos e imágenes de cada sección.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#0B1A2D] dark:text-[#B7F229] bg-[#B7F229]/20 dark:bg-[#B7F229]/15 px-2.5 py-1 rounded-full border border-[#B7F229]/40 shrink-0">
                  {pagesList.filter((p) => p.isVisible).length} / {pagesList.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {pagesList.map((page, idx) => (
                  <div
                    key={page.id}
                    className={`p-4 rounded-2xl border transition space-y-3 ${
                      page.isVisible
                        ? 'bg-slate-50/80 dark:bg-[#071220] border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white'
                        : 'bg-slate-100/40 dark:bg-[#071220]/40 border-slate-200/50 dark:border-[#1A314D]/50 text-slate-400 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#0B1A2D] dark:text-white truncate">
                              {page.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">/{page.id}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {page.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => movePage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white disabled:opacity-25 cursor-pointer"
                          title="Subir página"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePage(idx, 'down')}
                          disabled={idx === pagesList.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white disabled:opacity-25 cursor-pointer"
                          title="Bajar página"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => togglePageVisibility(page.id)}
                          className={`ml-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                            page.isVisible
                              ? 'bg-[#B7F229]/25 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/50'
                              : 'bg-slate-200 dark:bg-[#1A314D] text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {page.isVisible ? 'Visible' : 'Oculta'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-[#1A314D] text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        {page.heroImage && (
                          <img
                            src={page.heroImage}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-10 h-7 rounded-lg object-cover border border-slate-200 dark:border-[#1A314D] shrink-0"
                          />
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                          CTA: "{page.ctaText}"
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewPageId(page.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                            previewPageId === page.id
                              ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                              : 'text-slate-500 hover:text-[#0B1A2D] dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Vista previa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingPageId(page.id)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E2239] hover:bg-slate-100 dark:hover:bg-[#132A45] text-[#0B1A2D] dark:text-slate-200 border border-slate-200 dark:border-[#1A314D] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#0B1A2D] dark:text-[#B7F229]" />
                          <span>Editar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: BLOQUES MODULARES DE LA PÁGINA DE INICIO
              ================================================================= */}
          {activeTab === 'blocks' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] space-y-4 shadow-2xs">
              <div>
                <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                  <span>Orden y Visibilidad de Bloques</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Organiza los módulos visibles de la portada según prioridad.
                </p>
              </div>

              <div className="space-y-2.5">
                {pageBlocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 transition ${
                      block.isVisible
                        ? 'bg-slate-50/80 dark:bg-[#071220] border-slate-200/80 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white'
                        : 'bg-slate-100/50 dark:bg-[#071220]/40 border-slate-200/50 dark:border-[#1A314D]/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] text-slate-600 dark:text-slate-400 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{block.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">tipo: {block.type}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Subir bloque"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'down')}
                        disabled={idx === pageBlocks.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Bajar bloque"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBlockVisibility(block.id)}
                        className={`ml-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                          block.isVisible
                            ? 'bg-[#B7F229]/25 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229] border border-[#B7F229]/50'
                            : 'bg-slate-200 dark:bg-[#1A314D] text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {block.isVisible ? 'Visible' : 'Oculto'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Vista Previa Dinámica */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
              <span>
                Vista Previa: <strong className="text-[#0B1A2D] dark:text-[#B7F229]">{previewPage?.name}</strong>
              </span>
            </span>
            <span className="font-mono text-[11px]">
              {previewDevice === 'desktop' ? '1440 px' : '390 px'}
            </span>
          </div>

          {/* Selector rápido de página en vista previa */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {pagesList.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreviewPageId(p.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  previewPageId === p.id
                    ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D] shadow-2xs'
                    : 'bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Simulador de Navegador */}
          <div
            className={`mx-auto bg-[#071220] rounded-3xl border border-slate-200 dark:border-[#1A314D] overflow-hidden shadow-xl transition-all duration-300 ${
              previewDevice === 'mobile' ? 'max-w-[340px] h-[580px]' : 'w-full h-[540px]'
            } flex flex-col`}
          >
            {/* Barra superior del navegador simulado con favicon */}
            <div className="p-3 bg-[#0B1A2D] border-b border-[#1A314D] flex items-center gap-2.5 shrink-0">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#B7F229]/80" />
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 font-mono text-[10px] text-slate-300 bg-[#071220] py-1 rounded-lg px-2.5 truncate border border-[#1A314D]">
                {faviconUrl && (
                  <img
                    src={faviconUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-3.5 h-3.5 rounded-xs object-contain shrink-0"
                  />
                )}
                <span className="truncate">
                  https://{currentTenant.domains[0]?.hostname || 'sanmateo.setmio.com'}/{previewPage.id === 'home' ? '' : previewPage.id}
                </span>
              </div>
            </div>

            {/* Cabecera pública simulada con logotipo */}
            <div
              className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between gap-2 shrink-0"
              style={{ backgroundColor: safePrimaryHex }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={currentTenant.name}
                    referrerPolicy="no-referrer"
                    className="h-6 w-auto max-w-[110px] object-contain shrink-0"
                  />
                ) : (
                  <span className="text-xs font-extrabold text-white tracking-tight truncate">
                    {currentTenant.name}
                  </span>
                )}
              </div>
              <span
                className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-[#0B1A2D] shrink-0"
                style={{ backgroundColor: safeAccentHex }}
              >
                Reservar
              </span>
            </div>

            {/* Contenido del canvas */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="relative rounded-2xl overflow-hidden border border-[#1A314D] shadow-lg min-h-[190px] flex flex-col justify-end p-5">
                {previewPage.heroImage && (
                  <img
                    src={previewPage.heroImage}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(11,26,45,0.45) 0%, rgba(7,18,32,0.92) 100%)`,
                  }}
                />

                <div className="relative z-10 space-y-2">
                  <div
                    className="text-[10px] font-extrabold uppercase tracking-wider inline-block px-2.5 py-0.5 rounded-full border"
                    style={{
                      color: safeAccentHex,
                      backgroundColor: `${safePrimaryHex}CC`,
                      borderColor: `${safeAccentHex}55`,
                    }}
                  >
                    {previewPage.badge || 'CLUB OFICIAL'}
                  </div>

                  <h3 className="text-lg font-extrabold text-white leading-tight">
                    {previewPage.title}
                  </h3>

                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {previewPage.subtitle}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg text-[#0B1A2D] font-bold text-[11px] shadow"
                      style={{ backgroundColor: safeAccentHex }}
                    >
                      {previewPage.ctaText || 'Acceder'}
                    </button>
                    {previewPage.secondaryText && (
                      <span className="text-[10px] text-slate-300 line-clamp-1">
                        {previewPage.secondaryText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {previewPage.id === 'home' && (
                <div className="space-y-2.5">
                  {pageBlocks
                    .filter((b) => b.isVisible && b.type !== 'hero')
                    .map((b) => (
                      <div key={b.id} className="p-3 rounded-xl bg-[#0E2239] border border-[#1A314D] space-y-1">
                        <div className="font-bold text-white text-[11px] flex items-center justify-between">
                          <span>{b.title}</span>
                          <span className="text-[9px] font-mono" style={{ color: safeAccentHex }}>
                            activo
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">Módulo cargado en portada</div>
                      </div>
                    ))}
                </div>
              )}

              {previewPage.id === 'courts' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-[#0E2239] border border-[#1A314D] space-y-1">
                    <div className="font-bold text-white text-[11px]">Pistas 1 - 4 Centrales</div>
                    <div className="text-[10px] text-slate-400">Césped Mondo Supercourt WPT</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0E2239] border border-[#1A314D] space-y-1">
                    <div className="font-bold text-white text-[11px]">Pistas 5 - 8 Panorámicas</div>
                    <div className="text-[10px] text-slate-400">Cristal templado 12mm</div>
                  </div>
                </div>
              )}

              {previewPage.id === 'tournaments' && (
                <div className="p-3 rounded-xl bg-[#0E2239] border border-[#1A314D] space-y-1">
                  <div className="font-bold text-white text-[11px] flex items-center justify-between">
                    <span>Torneo Primavera Open 2026</span>
                    <span
                      className="text-[9px] px-2 py-0.5 rounded font-bold text-[#0B1A2D]"
                      style={{ backgroundColor: safeAccentHex }}
                    >
                      Inscripción Abierta
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">Premios: 1.500 € + Material Deportivo</div>
                </div>
              )}

              {previewPage.id === 'academy' && (
                <div className="p-3 rounded-xl bg-[#0E2239] border border-[#1A314D] space-y-1">
                  <div className="font-bold text-white text-[11px]">Grupos de Adultos y Menores</div>
                  <div className="text-[10px] text-slate-400">Turnos de tarde con entrenadores federados</div>
                </div>
              )}

              {previewPage.id === 'teams' && (
                <div className="p-3 rounded-xl bg-[#0E2239] border border-[#1A314D] space-y-1">
                  <div className="font-bold text-white text-[11px]">Pádel San Mateo 1ª Categoría</div>
                  <div className="text-[10px] text-slate-400">Capitán: Carlos Méndez · Entrenador: Mateo Varela</div>
                </div>
              )}

              {previewPage.id === 'shop' && (
                <div className="p-3 rounded-xl bg-[#0E2239] border border-[#1A314D] space-y-1">
                  <div className="font-bold text-white text-[11px]">Colección Oficial Bullpadel & Nox</div>
                  <div className="text-[10px] text-slate-400">Descuento del 15% para socios del club</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL DE EDICIÓN DE PÁGINA (TEXTOS E IMÁGENES)
          ===================================================================== */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 sm:p-7 shadow-2xl text-[#0B1A2D] dark:text-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <div>
                  <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                    Editar Página: {editingPage.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Ruta: /{editingPage.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPageId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título Principal *
                </label>
                <input
                  type="text"
                  required
                  value={editingPage.title}
                  onChange={(e) => handleUpdatePageField(editingPage.id, 'title', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subtítulo Descriptivo
                </label>
                <textarea
                  rows={2}
                  value={editingPage.subtitle}
                  onChange={(e) => handleUpdatePageField(editingPage.id, 'subtitle', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Etiqueta Superior
                  </label>
                  <input
                    type="text"
                    value={editingPage.badge}
                    onChange={(e) => handleUpdatePageField(editingPage.id, 'badge', e.target.value)}
                    placeholder="PÁDEL SAN MATEO"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-mono text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Texto del Botón (CTA)
                  </label>
                  <input
                    type="text"
                    value={editingPage.ctaText}
                    onChange={(e) => handleUpdatePageField(editingPage.id, 'ctaText', e.target.value)}
                    placeholder="Reservar / Inscribirse"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Texto Secundario
                </label>
                <input
                  type="text"
                  value={editingPage.secondaryText || ''}
                  onChange={(e) => handleUpdatePageField(editingPage.id, 'secondaryText', e.target.value)}
                  placeholder="Ej: Césped texturizado Mondo WPT y cristales 12mm"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] text-xs"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1A314D]">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Imagen de Cabecera
                </label>

                <div className="flex items-center gap-3">
                  {editingPage.heroImage && (
                    <img
                      src={editingPage.heroImage}
                      alt="Vista previa"
                      referrerPolicy="no-referrer"
                      className="w-24 h-16 rounded-xl object-cover border border-slate-200 dark:border-[#1A314D] shrink-0 shadow-2xs"
                    />
                  )}
                  <input
                    type="url"
                    value={editingPage.heroImage}
                    onChange={(e) => handleUpdatePageField(editingPage.id, 'heroImage', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] rounded-xl text-[#0B1A2D] dark:text-white focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 block">
                    Imágenes recomendadas:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_SPORTS_IMAGES.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => handleUpdatePageField(editingPage.id, 'heroImage', img.url)}
                        className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                          editingPage.heroImage === img.url
                            ? 'bg-[#0B1A2D]/5 dark:bg-[#B7F229]/10 border-[#0B1A2D] dark:border-[#B7F229] text-[#0B1A2D] dark:text-[#B7F229]'
                            : 'bg-slate-50 dark:bg-[#071220] border-slate-200 dark:border-[#1A314D] hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <span className="text-[10px] font-bold truncate">{img.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setPreviewPageId(editingPage.id);
                  setEditingPageId(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-[#0B1A2D] dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-[#132A45] transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Previsualizar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingPageId(null);
                  triggerDemoToast('Sección actualizada', `Cambios aplicados a "${editingPage.name}".`, 'success');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold text-xs shadow-2xs transition cursor-pointer active:scale-95"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWebEditor;
