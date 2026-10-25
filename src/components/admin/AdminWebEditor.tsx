import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PageBlock } from '../../types/database';
import {
  Palette,
  Eye,
  Smartphone,
  Monitor,
  Save,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Type,
  Image as ImageIcon,
  Check,
  Edit3,
  X,
  Globe,
  Sliders,
  ChevronRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Trophy,
  GraduationCap,
  Store,
  Shield,
  Phone,
  Calendar,
} from 'lucide-react';

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
    badge: 'PLAYTOMIC READY & NIVELES ELO',
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
    badge: 'CIRCUITO OFICIAL SETMIO',
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
    name: 'Tienda Oficial (Pro Shop)',
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

export const AdminWebEditor: React.FC = () => {
  const { currentTenant, updateCurrentTenant, pageBlocks, updatePageBlocks, triggerDemoToast } = useApp();

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [publishStatus, setPublishStatus] = useState<'published' | 'draft_pending'>('published');
  const [activeTab, setActiveTab] = useState<'pages' | 'branding' | 'blocks'>('pages');

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

  // Selected page for in-depth section modal editor
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  // Selected page for live canvas simulator
  const [previewPageId, setPreviewPageId] = useState<string>('home');

  // Local branding edit states
  const [primaryColor, setPrimaryColor] = useState(currentTenant.branding.primaryColor || '#10b981');
  const [accentColor, setAccentColor] = useState(currentTenant.branding.accentColor || '#06b6d4');

  const predefinedPalettes = [
    { name: 'Esmeralda Pro (Pádel San Mateo)', primary: '#10b981', accent: '#06b6d4' },
    { name: 'Azul WPT Oficial', primary: '#3b82f6', accent: '#10b981' },
    { name: 'Ámbar Sport Tech', primary: '#f59e0b', accent: '#ef4444' },
    { name: 'Violeta Tournament', primary: '#8b5cf6', accent: '#ec4899' },
  ];

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('setmio_demo_web_pages_v3', JSON.stringify(pagesList));
    } catch {
      // Ignore local storage error
    }
  }, [pagesList]);

  // Page reordering (Up / Down)
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

  // Toggle page visibility
  const togglePageVisibility = (pageId: string) => {
    const updated = pagesList.map((p) => (p.id === pageId ? { ...p, isVisible: !p.isVisible } : p));
    setPagesList(updated);
    setPublishStatus('draft_pending');

    const visibleIds = updated.filter((p) => p.isVisible).map((p) => p.id);
    updateCurrentTenant({ publicPages: visibleIds });
  };

  // Update specific page content
  const handleUpdatePageField = (pageId: string, field: keyof PublicPageConfigItem, value: string | boolean) => {
    const updated = pagesList.map((p) => (p.id === pageId ? { ...p, [field]: value } : p));
    setPagesList(updated);
    setPublishStatus('draft_pending');

    // If home page is updated, sync branding hero fields
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

  // Block reordering for home page
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

  const handleSaveDraft = () => {
    const homePage = pagesList.find((p) => p.id === 'home');
    updateCurrentTenant({
      branding: {
        ...currentTenant.branding,
        heroTitle: homePage?.title ?? currentTenant.branding.heroTitle,
        heroSubtitle: homePage?.subtitle ?? currentTenant.branding.heroSubtitle,
        badgeText: homePage?.badge ?? currentTenant.branding.badgeText,
        heroImageUrl: homePage?.heroImage ?? currentTenant.branding.heroImageUrl,
        primaryColor,
        accentColor,
      },
      publicPages: pagesList.filter((p) => p.isVisible).map((p) => p.id),
    });
    setPublishStatus('draft_pending');
    triggerDemoToast('Borrador Guardado', 'Los textos, fotos de sección y orden de páginas se han guardado.', 'info');
  };

  const handlePublishLive = () => {
    const homePage = pagesList.find((p) => p.id === 'home');
    updateCurrentTenant({
      branding: {
        ...currentTenant.branding,
        heroTitle: homePage?.title ?? currentTenant.branding.heroTitle,
        heroSubtitle: homePage?.subtitle ?? currentTenant.branding.heroSubtitle,
        badgeText: homePage?.badge ?? currentTenant.branding.badgeText,
        heroImageUrl: homePage?.heroImage ?? currentTenant.branding.heroImageUrl,
        primaryColor,
        accentColor,
      },
      publicPages: pagesList.filter((p) => p.isVisible).map((p) => p.id),
    });
    setPublishStatus('published');
    triggerDemoToast(
      '¡Web Pública Actualizada!',
      `Cambios publicados en vivo para todas las páginas en ${currentTenant.domains[0]?.hostname || 'sanmateo.setmio.com'}.`,
      'success'
    );
  };

  const editingPage = pagesList.find((p) => p.id === editingPageId);
  const previewPage = pagesList.find((p) => p.id === previewPageId) || pagesList[0];

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100 max-w-7xl pb-16 transition-colors duration-200">
      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Editor Total de la Web Pública & Marca Blanca
            </h1>
            <span
              className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                publishStatus === 'published'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}
            >
              {publishStatus === 'published' ? 'Publicado en Vivo' : 'Borrador Pendiente'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Personaliza absolutamente todas las páginas de la web pública (textos, fotos, orden y visibilidad) de tu club o perfil profesional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Device viewport toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                previewDevice === 'desktop'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
              title="Vista de Escritorio"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                previewDevice === 'mobile'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
              title="Vista Móvil"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Borrador</span>
          </button>

          <button
            type="button"
            onClick={handlePublishLive}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-sm shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publicar en Vivo</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Segmented Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('pages')}
              className={`flex-1 py-2.5 text-center rounded-xl transition cursor-pointer ${
                activeTab === 'pages'
                  ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todas las Páginas ({pagesList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('branding')}
              className={`flex-1 py-2.5 text-center rounded-xl transition cursor-pointer ${
                activeTab === 'branding'
                  ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Colores & Marca
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-2.5 text-center rounded-xl transition cursor-pointer ${
                activeTab === 'blocks'
                  ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bloques de Inicio
            </button>
          </div>

          {/* =================================================================
              TAB 1: TODAS LAS PÁGINAS DE LA WEB PÚBLICA (TEXTOS, FOTOS, ORDEN)
              ================================================================= */}
          {activeTab === 'pages' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Páginas de la Web Pública</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Reordena, activa/oculta o edita textos e imágenes de portada para cada página.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {pagesList.filter((p) => p.isVisible).length} / {pagesList.length} activas
                </span>
              </div>

              <div className="space-y-3">
                {pagesList.map((page, idx) => (
                  <div
                    key={page.id}
                    className={`p-4 rounded-2xl border transition space-y-3 ${
                      page.isVisible
                        ? 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white'
                        : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-800/40 text-slate-400 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Order pill */}
                        <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-slate-900 dark:text-white truncate">
                              {page.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">/{page.id}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {page.title} — {page.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Reorder and visibility controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => movePage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Subir página"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePage(idx, 'down')}
                          disabled={idx === pagesList.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Bajar página"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => togglePageVisibility(page.id)}
                          className={`ml-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                            page.isVisible
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {page.isVisible ? 'Visible' : 'Oculta'}
                        </button>
                      </div>
                    </div>

                    {/* Section image and quick edit triggers */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        {page.heroImage && (
                          <img
                            src={page.heroImage}
                            alt=""
                            className="w-10 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {page.badge || 'Sin badge'} · CTA: "{page.ctaText}"
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewPageId(page.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                            previewPageId === page.id
                              ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800'
                              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Previsualizar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingPageId(page.id)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Editar Textos & Fotos</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 2: PALETA VISUAL & IDENTIDAD GRÁFICA
              ================================================================= */}
          {activeTab === 'branding' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-sm text-xs">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Colores de Marca & Identidad Deportiva</span>
              </h3>

              {/* Manual Custom HEX Codes */}
              <div className="space-y-3">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">Personalización Manual de Colores (Códigos HEX)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Color Primario / Marca</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => {
                          setPrimaryColor(e.target.value);
                          setPublishStatus('draft_pending');
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => {
                          setPrimaryColor(e.target.value);
                          setPublishStatus('draft_pending');
                        }}
                        placeholder="#10b981"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-emerald-500 uppercase font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Color de Acento / Botones</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => {
                          setAccentColor(e.target.value);
                          setPublishStatus('draft_pending');
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => {
                          setAccentColor(e.target.value);
                          setPublishStatus('draft_pending');
                        }}
                        placeholder="#06b6d4"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-emerald-500 uppercase font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Predefined controlled palettes */}
              <div className="space-y-2 pt-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">Paletas Deportivas Sugeridas</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {predefinedPalettes.map((pal) => (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(pal.primary);
                        setAccentColor(pal.accent);
                        setPublishStatus('draft_pending');
                      }}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{pal.name}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: pal.primary }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: pal.accent }} />
                        </div>
                      </div>
                      {primaryColor === pal.primary && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: BLOQUES MODULARES DE LA PÁGINA DE INICIO
              ================================================================= */}
          {activeTab === 'blocks' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Orden y Visibilidad de Bloques de Inicio</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Reordena los módulos verticales de la página de portada según prioridad de temporada.
                </p>
              </div>

              <div className="space-y-2.5">
                {pageBlocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                      block.isVisible
                        ? 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white'
                        : 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold">{block.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">tipo: {block.type}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Subir bloque"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'down')}
                        disabled={idx === pageBlocks.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Bajar bloque"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBlockVisibility(block.id)}
                        className={`ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                          block.isVisible
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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

        {/* Right Live Preview Canvas */}
        <div className="lg:col-span-6 sticky top-28 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span>Vista Previa Dinámica: <strong className="text-emerald-600 dark:text-emerald-400">{previewPage?.name}</strong></span>
            </span>
            <span>{previewDevice === 'desktop' ? 'Escritorio (1440px)' : 'Móvil (390px)'}</span>
          </div>

          {/* Quick Page Preview Selector Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-xs">
            {pagesList.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreviewPageId(p.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  previewPageId === p.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Canvas Viewport Simulator */}
          <div
            className={`mx-auto bg-slate-950 rounded-3xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-2xl transition-all duration-300 ${
              previewDevice === 'mobile' ? 'max-w-[340px] h-[580px]' : 'w-full h-[540px]'
            } flex flex-col`}
          >
            {/* Mock browser header */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 text-center font-mono text-[10px] text-slate-400 bg-slate-950 py-0.5 rounded px-2 truncate">
                https://{currentTenant.domains[0]?.hostname || 'sanmateo.setmio.com'}/{previewPage.id === 'home' ? '' : previewPage.id}
              </div>
            </div>

            {/* Canvas Preview content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Dynamic Page Hero Banner */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg min-h-[190px] flex flex-col justify-end p-5">
                {previewPage.heroImage && (
                  <img
                    src={previewPage.heroImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(9,13,22,0.4) 0%, rgba(9,13,22,0.85) 100%)`,
                  }}
                />

                <div className="relative z-10 space-y-2">
                  <div
                    className="text-[10px] font-black uppercase tracking-wider inline-block px-2.5 py-0.5 rounded-full border"
                    style={{
                      color: primaryColor,
                      backgroundColor: `${primaryColor}22`,
                      borderColor: `${primaryColor}44`,
                    }}
                  >
                    {previewPage.badge || 'SETMIO CLUB'}
                  </div>

                  <h4 className="text-lg font-black text-white leading-tight">
                    {previewPage.title}
                  </h4>

                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {previewPage.subtitle}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg text-slate-950 font-bold text-[11px] shadow"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {previewPage.ctaText || 'Acceder'}
                    </button>
                    {previewPage.secondaryText && (
                      <span className="text-[10px] text-slate-400 line-clamp-1">
                        {previewPage.secondaryText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Page-Specific Mock Content */}
              {previewPage.id === 'home' && (
                <div className="space-y-3">
                  {pageBlocks
                    .filter((b) => b.isVisible && b.type !== 'hero')
                    .map((b) => (
                      <div key={b.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-bold text-white text-[11px] flex items-center justify-between">
                          <span>{b.title}</span>
                          <span className="text-[9px] font-mono text-emerald-400">activo</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Módulo cargado dinámicamente en portada</div>
                      </div>
                    ))}
                </div>
              )}

              {previewPage.id === 'courts' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white text-[11px]">Pistas 1 - 4 Centrales</div>
                    <div className="text-[10px] text-slate-400">Césped Mondo Supercourt WPT</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white text-[11px]">Pistas 5 - 8 Panorámicas</div>
                    <div className="text-[10px] text-slate-400">Cristal templado 12mm</div>
                  </div>
                </div>
              )}

              {previewPage.id === 'tournaments' && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-[11px] flex items-center justify-between">
                    <span>Torneo Primavera Open 2026</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">Inscripción Abierta</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Premios: 1.500 € + Material Deportivo</div>
                </div>
              )}

              {previewPage.id === 'academy' && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-[11px]">Grupos de Adultos y Menores</div>
                  <div className="text-[10px] text-slate-400">Turnos de tarde de lunes a viernes con entrenadores federados</div>
                </div>
              )}

              {previewPage.id === 'teams' && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-[11px]">Pádel San Mateo 1ª Categoría</div>
                  <div className="text-[10px] text-slate-400">Capitán: Carlos Méndez · Entrenador: Mateo Varela</div>
                </div>
              )}

              {previewPage.id === 'shop' && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white text-[11px]">Colección Oficial Bullpadel & Siux</div>
                  <div className="text-[10px] text-slate-400">Descuento del 15% para socios del club</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL COMPLETO DE EDICIÓN DE SECCIÓN / PÁGINA (TEXTOS E IMÁGENES)
          ===================================================================== */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-500" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Editar Página: {editingPage.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Ruta: /{editingPage.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPageId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Título Principal */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título Principal de la Sección *
                </label>
                <input
                  type="text"
                  required
                  value={editingPage.title}
                  onChange={(e) => handleUpdatePageField(editingPage.id, 'title', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              {/* Subtítulo Descriptivo */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subtítulo / Texto Descriptivo
                </label>
                <textarea
                  rows={2}
                  value={editingPage.subtitle}
                  onChange={(e) => handleUpdatePageField(editingPage.id, 'subtitle', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {/* Kicker / Badge Superior */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kicker / Badge Superior
                  </label>
                  <input
                    type="text"
                    value={editingPage.badge}
                    onChange={(e) => handleUpdatePageField(editingPage.id, 'badge', e.target.value)}
                    placeholder="PÁDEL SAN MATEO"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Texto del Botón de Acción (CTA)
                  </label>
                  <input
                    type="text"
                    value={editingPage.ctaText}
                    onChange={(e) => handleUpdatePageField(editingPage.id, 'ctaText', e.target.value)}
                    placeholder="Reservar / Inscribirse"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Texto Secundario / Destacado */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Texto Secundario / Característica Destacada
                </label>
                <input
                  type="text"
                  value={editingPage.secondaryText || ''}
                  onChange={(e) => handleUpdatePageField(editingPage.id, 'secondaryText', e.target.value)}
                  placeholder="Ej: Césped texturizado Mondo WPT y cristales 12mm"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {/* Imagen de Cabecera / Portada Representativa */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Foto de Cabecera / Banner Representativo
                </label>

                <div className="flex items-center gap-3">
                  {editingPage.heroImage && (
                    <img
                      src={editingPage.heroImage}
                      alt="Vista previa"
                      className="w-24 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                    />
                  )}
                  <input
                    type="url"
                    value={editingPage.heroImage}
                    onChange={(e) => handleUpdatePageField(editingPage.id, 'heroImage', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>

                {/* Quick Sports Image Presets */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 block">O elige una foto sugerida de alta resolución:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_SPORTS_IMAGES.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => handleUpdatePageField(editingPage.id, 'heroImage', img.url)}
                        className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                          editingPage.heroImage === img.url
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <span className="text-[10px] font-bold truncate">{img.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setPreviewPageId(editingPage.id);
                  setEditingPageId(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Previsualizar en Canvas</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingPageId(null);
                  triggerDemoToast('Sección Actualizada', `Cambios aplicados a la página "${editingPage.name}".`, 'success');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
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
