import React, { useState } from 'react';
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
} from 'lucide-react';

export const AdminWebEditor: React.FC = () => {
  const { currentTenant, updateCurrentTenant, pageBlocks, updatePageBlocks, triggerDemoToast } = useApp();

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [publishStatus, setPublishStatus] = useState<'published' | 'draft_pending'>('published');
  const [activeTab, setActiveTab] = useState<'blocks' | 'branding' | 'pages'>('blocks');
  const [enabledPages, setEnabledPages] = useState<string[]>(
    currentTenant.publicPages ?? ['home', 'courts', 'academy', 'tournaments', 'shop', 'contact']
  );
  const publicPageOptions = [
    { id: 'home', title: 'Inicio', description: 'Presentación del club y acceso a las reservas' },
    { id: 'courts', title: 'Pistas e instalaciones', description: 'Instalaciones, servicios y tarifas' },
    { id: 'academy', title: 'Escuela y academia', description: 'Clases, grupos y entrenadores' },
    { id: 'tournaments', title: 'Torneos y ligas', description: 'Competiciones, cuadros e inscripciones' },
    { id: 'shop', title: 'Tienda', description: 'Catálogo deportivo y pedidos' },
    { id: 'contact', title: 'Contacto y club', description: 'Ubicación, horarios y preguntas frecuentes' },
  ];

  // Local branding edit states
  const [heroTitle, setHeroTitle] = useState(currentTenant.branding.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(currentTenant.branding.heroSubtitle);
  const [primaryColor, setPrimaryColor] = useState(currentTenant.branding.primaryColor);
  const [accentColor, setAccentColor] = useState(currentTenant.branding.accentColor);
  const [badgeText, setBadgeText] = useState(currentTenant.branding.badgeText);

  const predefinedPalettes = [
    { name: 'Esmeralda Pro (Pádel San Mateo)', primary: '#10b981', accent: '#06b6d4' },
    { name: 'Azul WPT Oficial', primary: '#3b82f6', accent: '#10b981' },
    { name: 'Ámbar Sport Tech', primary: '#f59e0b', accent: '#ef4444' },
    { name: 'Violeta Tournament', primary: '#8b5cf6', accent: '#ec4899' },
  ];

  // Block reordering
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
    const newBlocks = pageBlocks.map((b) =>
      b.id === blockId ? { ...b, isVisible: !b.isVisible } : b
    );
    updatePageBlocks(newBlocks);
    setPublishStatus('draft_pending');
  };

  const handleSaveDraft = () => {
    updateCurrentTenant({
      branding: {
        ...currentTenant.branding,
        heroTitle,
        heroSubtitle,
        primaryColor,
        accentColor,
        badgeText,
      },
    });
    setPublishStatus('draft_pending');
    triggerDemoToast('Borrador Guardado', 'Los cambios se han guardado como borrador interno.', 'info');
  };

  const handlePublishLive = () => {
    updateCurrentTenant({
      branding: {
        ...currentTenant.branding,
        heroTitle,
        heroSubtitle,
        primaryColor,
        accentColor,
        badgeText,
      },
    });
    setPublishStatus('published');
    triggerDemoToast(
      '¡Web Pública Actualizada!',
      `Los cambios ya son visibles en vivo en ${currentTenant.domains[0]?.hostname || 'sanmateo.setmio.com'}.`,
      'success'
    );
  };

  return (
    <div className="space-y-8 text-slate-100 max-w-6xl">
      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Editor Visual "Mi Web y Mi App"</h1>
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                publishStatus === 'published'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {publishStatus === 'published' ? 'Publicado en Vivo' : 'Borrador con Cambios Pendientes'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Personaliza la página de inicio, bloques deportivos y paleta visual controlada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                previewDevice === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
              title="Vista de Escritorio"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                previewDevice === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
              title="Vista Móvil"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Borrador</span>
          </button>

          <button
            onClick={handlePublishLive}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publicar Cambios</span>
          </button>
        </div>
      </div>

      {/* Editor Tabs & Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Settings Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-2 text-center font-bold rounded-xl transition ${
                activeTab === 'blocks' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Estructura de Bloques
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`flex-1 py-2 text-center font-bold rounded-xl transition ${
                activeTab === 'branding' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Textos & Paleta
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex-1 py-2 text-center font-bold rounded-xl transition ${
                activeTab === 'pages' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Páginas
            </button>
          </div>

          {activeTab === 'pages' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Páginas de la web pública</h3>
                <p className="text-xs text-slate-400 mt-1">Activa las secciones que se muestran en la navegación del club. Los cambios son locales en esta demostración.</p>
              </div>
              <div className="space-y-2">
                {publicPageOptions.map((page) => {
                  const active = enabledPages.includes(page.id);
                  return (
                    <button
                      key={page.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        if (active && enabledPages.length === 1) return;
                        const next = active ? enabledPages.filter((id) => id !== page.id) : [...enabledPages, page.id];
                        setEnabledPages(next);
                        updateCurrentTenant({ publicPages: next });
                        setPublishStatus('draft_pending');
                      }}
                      className="w-full p-3.5 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between gap-4 text-left"
                    >
                      <span>
                        <span className="block text-xs font-semibold text-white">{page.title}</span>
                        <span className="block mt-1 text-[10px] text-slate-400">{page.description}</span>
                      </span>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${active ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {active ? 'Activa' : 'Oculta'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'blocks' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Orden y Visibilidad de Bloques Públicos</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reordena las secciones de la página de inicio o activa/desactiva módulos según temporada.
                </p>
              </div>

              <div className="space-y-2">
                {pageBlocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                      block.isVisible
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-950/40 border-slate-800/40 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-semibold">{block.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">tipo: {block.type}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                        title="Subir bloque"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveBlock(idx, 'down')}
                        disabled={idx === pageBlocks.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                        title="Bajar bloque"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleBlockVisibility(block.id)}
                        className={`ml-2 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                          block.isVisible
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
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

          {activeTab === 'branding' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>Textos del Hero & Identidad Gráfica</span>
              </h3>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Kicker / Badge Superior</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => {
                    setBadgeText(e.target.value);
                    setPublishStatus('draft_pending');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Título Principal (Hero)</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => {
                    setHeroTitle(e.target.value);
                    setPublishStatus('draft_pending');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Subtítulo Descriptivo</label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => {
                    setHeroSubtitle(e.target.value);
                    setPublishStatus('draft_pending');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Manual Custom HEX Codes */}
              <div className="space-y-3 pt-2">
                <label className="block text-slate-400 font-medium">Personalización Manual de Colores (Códigos HEX)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-300">Color Primario / Marca</span>
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
                        placeholder="#185c43"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 uppercase font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-300">Color de Acento / Botones</span>
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
                        placeholder="#c7f36b"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 uppercase font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Predefined controlled palettes */}
              <div className="space-y-2 pt-2">
                <label className="block text-slate-400 font-medium">Paletas Deportivas Sugeridas</label>
                <div className="grid grid-cols-2 gap-2">
                  {predefinedPalettes.map((pal) => (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(pal.primary);
                        setAccentColor(pal.accent);
                        setPublishStatus('draft_pending');
                      }}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate">{pal.name}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: pal.primary }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: pal.accent }}
                          />
                        </div>
                      </div>
                      {primaryColor === pal.primary && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Live Preview Canvas */}
        <div className="lg:col-span-6 sticky top-28 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-white">Vista Previa Dinámica</span>
            <span>{previewDevice === 'desktop' ? 'Escritorio (1440px)' : 'Móvil (390px)'}</span>
          </div>

          <div
            className={`mx-auto bg-slate-950 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl transition-all duration-300 ${
              previewDevice === 'mobile' ? 'max-w-[340px] h-[580px]' : 'w-full h-[520px]'
            } flex flex-col`}
          >
            {/* Mock browser header */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 text-center font-mono text-[10px] text-slate-400 bg-slate-950 py-0.5 rounded px-2 truncate">
                https://{currentTenant.domains[0]?.hostname || 'sanmateo.setmio.com'}
              </div>
            </div>

            {/* Canvas Preview content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div
                className="p-4 rounded-2xl space-y-2 border"
                style={{
                  background: `linear-gradient(135deg, #090d16 0%, ${primaryColor}22 100%)`,
                  borderColor: `${primaryColor}44`,
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {badgeText}
                </div>
                <h4 className="text-base font-black text-white leading-tight">{heroTitle}</h4>
                <p className="text-[11px] text-slate-300 line-clamp-3">{heroSubtitle}</p>
                <button
                  className="mt-2 px-3 py-1.5 rounded-lg text-slate-950 font-bold text-[10px] shadow"
                  style={{ backgroundColor: primaryColor }}
                >
                  Reservar Pista
                </button>
              </div>

              {/* Page Blocks simulator */}
              {pageBlocks
                .filter((b) => b.isVisible && b.type !== 'hero')
                .map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="font-bold text-white text-[11px]">{b.title}</div>
                    <div className="text-[10px] text-slate-500">Módulo cargado en vivo</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
