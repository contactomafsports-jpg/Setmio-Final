import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types/database';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import {
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  Share2,
  Bookmark,
  Calendar,
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const BlogView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const {
    blogPosts,
    selectedArticleId,
    setSelectedArticleId,
    triggerDemoToast,
    setPublicPage,
    currentTenant,
    t,
    currentLanguage,
    isCorporateLanding,
  } = useApp();
  void currentLanguage;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', categoryMatch: 'all' },
    { id: 'tecnica', categoryMatch: 'Técnica & Táctica' },
    { id: 'instalaciones', categoryMatch: 'Instalaciones' },
    { id: 'salud', categoryMatch: 'Salud & Rendimiento' },
  ];

  const selectedArticle = blogPosts.find((p) => p.id === selectedArticleId);

  const relatedArticles = selectedArticle
    ? blogPosts.filter((p) => p.id !== selectedArticle.id).slice(0, 3)
    : [];

  const getCategoryFilterId = (cat: string) => {
    if (cat === 'Técnica & Táctica') return 'tecnica';
    if (cat === 'Instalaciones') return 'instalaciones';
    return 'salud';
  };

  const filteredPosts = blogPosts.filter((p) => {
    const activeCat = categories.find((c) => c.id === selectedCategory);
    const matchCat =
      selectedCategory === 'all' ||
      p.category === activeCat?.categoryMatch ||
      getCategoryFilterId(p.category) === selectedCategory;
    const postTitle = t((p as any).titleKey || ('blog.posts.' + p.id + '.title'), p.title);
    const postSummary = t((p as any).excerptKey || (p as any).summaryKey || ('blog.posts.' + p.id + '.summary'), p.summary);
    const postAuthor = t((p as any).authorKey || ('blog.posts.' + p.id + '.author'), p.author);
    const postTags = t((p as any).tagsKey || ('blog.posts.' + p.id + '.tags'), '');
    const matchSearch =
      postTitle.toLowerCase().includes(search.toLowerCase()) ||
      postSummary.toLowerCase().includes(search.toLowerCase()) ||
      postAuthor.toLowerCase().includes(search.toLowerCase()) ||
      postTags.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      triggerDemoToast(t('blog.shareCopied', 'Enlace Copiado'), t('blog.shareCopiedDesc', `Enlace de "${title}" copiado al portapapeles.`), 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <SubpageHeaderNav onBack={onBack} />
      {/* If an article is selected, show Full Article Reader View */}
      {selectedArticle ? (
        <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-150">
          {/* Aesthetic Back Button */}
          <button
            onClick={() => setSelectedArticleId(null)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('blog.back', 'Volver a Todos los Artículos')}</span>
          </button>

          <header className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
              <span>{t('blog.filters.' + getCategoryFilterId(selectedArticle.category), t('blog.categories.' + getCategoryFilterId(selectedArticle.category), selectedArticle.category))}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-normal">
                {selectedArticle.publishedAt.split('T')[0]}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t((selectedArticle as any).titleKey || ('blog.posts.' + selectedArticle.id + '.title'), selectedArticle.title)}
            </h1>

            <div className="flex items-center justify-between border-y border-slate-200 dark:border-slate-800 py-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {t((selectedArticle as any).authorKey || ('blog.posts.' + selectedArticle.id + '.author'), selectedArticle.author)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-mono">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  <span>
                    {t((selectedArticle as any).readingTimeKey || ('blog.posts.' + selectedArticle.id + '.readingTime'), `${selectedArticle.readingTime} ${t('blog.readingTime', 'min de lectura')}`)}
                  </span>
                </div>
                <button
                  onClick={() => handleShare(t((selectedArticle as any).titleKey || ('blog.posts.' + selectedArticle.id + '.title'), selectedArticle.title))}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title={t('blog.share', 'Compartir artículo')}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags Badge List */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-semibold">{t('blog.tags', 'Etiquetas')}:</span>
              {t((selectedArticle as any).tagsKey || ('blog.posts.' + selectedArticle.id + '.tags'), 'Pádel, Técnica, Rendimiento')
                .split(',')
                .map((tag: string) => (
                  <span
                    key={tag.trim()}
                    className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold"
                  >
                    #{tag.trim()}
                  </span>
                ))}
            </div>
          </header>

          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl h-80 sm:h-96">
            <img
              src={selectedArticle.coverImage}
              alt={t((selectedArticle as any).titleKey || ('blog.posts.' + selectedArticle.id + '.title'), selectedArticle.title)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Prose Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-6 text-slate-700 dark:text-slate-300">
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed border-l-4 border-emerald-500 pl-4">
              {t((selectedArticle as any).excerptKey || (selectedArticle as any).summaryKey || ('blog.posts.' + selectedArticle.id + '.summary'), selectedArticle.summary)}
            </p>

            <p>
              El pádel moderno ha evolucionado a una velocidad de juego vertiginosa. En las pistas de última generación como las de Pádel San Mateo en Narón, la combinación de césped texturizado Mondo Supercourt XN con menor fricción y cristal templado de 12 mm exige que el jugador prepare su golpe con medio segundo de anticipación respecto al pádel tradicional.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              1. Posicionamiento del cuerpo y transferencia de peso
            </h2>
            <p>
              El error más recurrente en jugadores de nivel intermedio (3.0 a 4.0) radica en golpear con el peso del cuerpo retrasado hacia el pie trasero. Al ejecutar la víbora o la bandeja profunda, es imprescindible frenar la inercia con pasos de ajuste cortos y llevar el hombro izquierdo (o derecho en zurdos) hacia la trayectoria de la bola antes del punto de impacto.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              2. La lectura del cristal lateral
            </h2>
            <p>
              Aprender a dejar pasar las bolas rápidas para que toquen el cristal de fondo y lateral antes de definirlas reduce en un 60% los errores no forzados. En nuestras clases de la escuela federada insistimos siempre en la paciencia táctica: no busques el tiro ganador en la primera oportunidad si estás a más de dos metros de la red.
            </p>

            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 my-8">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mb-1">
                {t('blog.coachTip', `Consejo del Entrenador en ${currentTenant.name}`)}
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
                "Dedica 15 minutos en el calentamiento a realizar intercambios lentos de bandeja a media pista sin buscar rematar. Calibrarás el bote del césped del club y ganarás confianza en la pala."
              </p>
            </div>
          </div>

          {/* Related Articles Carousel / Section */}
          {relatedArticles.length > 0 && (
            <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <span>{t('blog.related', 'Artículos Relacionados')}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((article) => {
                  const filterId = getCategoryFilterId(article.category);
                  const artTitle = t((article as any).titleKey || ('blog.posts.' + article.id + '.title'), article.title);
                  return (
                    <div
                      key={article.id}
                      onClick={() => {
                        setSelectedArticleId(article.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-36 w-full overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={artTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4 space-y-2">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                            {t('blog.filters.' + filterId, t('blog.categories.' + filterId, article.category))}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors">
                            {artTitle}
                          </h4>
                        </div>
                      </div>
                      <div className="p-4 pt-0 text-[11px] text-slate-400 font-medium">
                        {t((article as any).readingTimeKey || ('blog.posts.' + article.id + '.readingTime'), `${article.readingTime} ${t('blog.readingTimeShort', 'min de lectura')}`)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Back & CTA */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setSelectedArticleId(null)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('blog.backToList', 'Volver al listado')}</span>
            </button>

            <button
              onClick={() => {
                setPublicPage('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
            >
              {t('blog.bookToPractice', 'Reservar Pista para Practicar')}
            </button>
          </div>
        </article>
      ) : (
        /* Blog List View */
        <div className="space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4 max-w-3xl text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('corporateBlog.eyebrow', t('blog.eyebrow', 'Actualidad & Consejos de Pádel'))}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {isCorporateLanding
                  ? t('corporateBlog.title', 'Blog Oficial y Tendencias del Pádel')
                  : t('blog.title', `Blog Oficial ${currentTenant.name}`)}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                {isCorporateLanding
                  ? t('corporateBlog.subtitle', 'Artículos técnicos elaborados por entrenadores titulados, análisis de biomecánica, crónicas de torneos y novedades del club.')
                  : t('blog.description', 'Artículos técnicos elaborados por nuestros entrenadores, análisis de biomecánica, crónicas de torneos y novedades del club en Narón.')}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('blog.searchPlaceholder', 'Buscar artículo o tema...')}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium shadow-xs"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === c.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {t('blog.filters.' + c.id, t('blog.categories.' + c.id, c.id))}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const filterId = getCategoryFilterId(post.category);
              const postTitle = t((post as any).titleKey || ('blog.posts.' + post.id + '.title'), post.title);
              const postSummary = t((post as any).excerptKey || (post as any).summaryKey || ('blog.posts.' + post.id + '.summary'), post.summary);
              const postAuthor = t((post as any).authorKey || ('blog.posts.' + post.id + '.author'), post.author);
              return (
                <div
                  key={post.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between group shadow-sm hover:shadow-md cursor-pointer"
                  onClick={() => setSelectedArticleId(post.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={postTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-slate-200 dark:border-slate-700">
                      {t('blog.filters.' + filterId, t('blog.categories.' + filterId, post.category))}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{post.publishedAt.split('T')[0]}</span>
                        <span>·</span>
                        <span>{t((post as any).readingTimeKey || ('blog.posts.' + post.id + '.readingTime'), `${post.readingTime} ${t('blog.readingTimeShort', 'min de lectura')}`)}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {postTitle}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {postSummary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{t('blog.by', 'Por')} {postAuthor}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {t('blog.readArticle', 'Leer artículo')} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
