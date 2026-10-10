import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types/database';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { CORPORATE_BLOG_POSTS } from '../../data/corporateBlogData';
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

  const activeBlogPosts = isCorporateLanding ? CORPORATE_BLOG_POSTS : blogPosts;

  // Helper para renderizar texto enriquecido con font-weight normal y negrita únicamente en títulos y <strong>
  const renderFormattedInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index} className="font-normal">{part}</span>;
    });
  };

  // Sincronizar navegación con el historial del navegador (soporte completo de /blog/[slug] y ?id=)
  useEffect(() => {
    const syncArticleFromUrl = () => {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const articleIdFromParam = params.get('id');

      if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
        const slug = pathname.replace(/^\/blog\//, '').trim();
        const found = activeBlogPosts.find((p) => p.slug === slug || p.id === slug);
        if (found) {
          setSelectedArticleId(found.id);
          return;
        }
      }

      if (articleIdFromParam) {
        setSelectedArticleId(articleIdFromParam);
      } else if (pathname === '/blog') {
        setSelectedArticleId(null);
      }
    };

    syncArticleFromUrl();

    window.addEventListener('popstate', syncArticleFromUrl);
    return () => {
      window.removeEventListener('popstate', syncArticleFromUrl);
      setSelectedArticleId(null);
    };
  }, [setSelectedArticleId, activeBlogPosts]);

  const categories = isCorporateLanding
    ? [
        { id: 'all', categoryMatch: 'all' },
        { id: 'domotica', categoryMatch: 'Tecnología & Domótica' },
        { id: 'gestion', categoryMatch: 'Gestión de Clubes' },
        { id: 'finanzas', categoryMatch: 'Finanzas & Ocupación' },
        { id: 'escuelas', categoryMatch: 'Escuelas & Competición' },
      ]
    : [
        { id: 'all', categoryMatch: 'all' },
        { id: 'tecnica', categoryMatch: 'Técnica & Táctica' },
        { id: 'instalaciones', categoryMatch: 'Instalaciones' },
        { id: 'salud', categoryMatch: 'Salud & Rendimiento' },
      ];

  const selectedArticle = activeBlogPosts.find((p) => p.id === selectedArticleId);

  const relatedArticles = selectedArticle
    ? activeBlogPosts.filter((p) => p.id !== selectedArticle.id).slice(0, 3)
    : [];

  const getCategoryFilterId = (cat: string) => {
    if (cat === 'Tecnología & Domótica') return 'domotica';
    if (cat === 'Gestión de Clubes') return 'gestion';
    if (cat === 'Finanzas & Ocupación') return 'finanzas';
    if (cat === 'Escuelas & Competición') return 'escuelas';
    if (cat === 'Técnica & Táctica') return 'tecnica';
    if (cat === 'Instalaciones') return 'instalaciones';
    return 'salud';
  };

  const filteredPosts = activeBlogPosts.filter((p) => {
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

  const handleBackToList = () => {
    setSelectedArticleId(null);
    setPublicPage('blog');
    if (typeof window !== 'undefined' && (window.location.pathname !== '/blog' || window.location.search)) {
      window.history.pushState({}, '', '/blog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromBlog = () => {
    if (selectedArticleId) {
      handleBackToList();
      return;
    }
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1 && window.location.pathname !== '/') {
      window.history.back();
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      setPublicPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectArticle = (id: string) => {
    const post = activeBlogPosts.find((p) => p.id === id);
    setSelectedArticleId(id);
    if (typeof window !== 'undefined') {
      const url = post?.slug ? `/blog/${post.slug}` : `/blog?id=${id}`;
      window.history.pushState({ articleId: id }, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      triggerDemoToast(
        t('blog.shareCopied', 'Enlace Copiado'),
        t('blog.shareCopiedDesc', `Enlace de "${title}" copiado al portapapeles.`),
        'info'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Botón superior de retorno siempre conectado a la navegación correcta */}
      {selectedArticle ? (
        <SubpageHeaderNav
          onBack={handleBackToList}
          label={t('blog.back', 'Volver a Todos los Artículos')}
        />
      ) : (
        <SubpageHeaderNav onBack={handleBackFromBlog} />
      )}

      {/* If an article is selected, show Full Article Reader View */}
      {selectedArticle ? (
        <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-150">
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
                  type="button"
                  onClick={() => handleShare(t((selectedArticle as any).titleKey || ('blog.posts.' + selectedArticle.id + '.title'), selectedArticle.title))}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
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

          {/* Article Content with regular reading font-weight */}
          <div className="max-w-none text-base leading-relaxed space-y-6 text-slate-700 dark:text-slate-300 font-normal">
            <p className="text-lg font-normal text-slate-800 dark:text-slate-200 leading-relaxed border-l-4 border-emerald-500 pl-4 py-0.5">
              {t((selectedArticle as any).excerptKey || (selectedArticle as any).summaryKey || ('blog.posts.' + selectedArticle.id + '.summary'), selectedArticle.summary)}
            </p>

            {isCorporateLanding ? (
              <div className="space-y-5 text-base leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                {selectedArticle.content.split('\n\n').map((block, pIdx) => {
                  const trimmed = block.trim();
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-3 tracking-tight">
                        {trimmed.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={pIdx} className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white pt-4 tracking-tight">
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }
                  const lines = trimmed.split('\n');
                  const isList = lines.length > 1 && lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));
                  if (isList) {
                    return (
                      <ul key={pIdx} className="space-y-2.5 my-3 pl-5 list-disc marker:text-emerald-500 font-normal text-slate-700 dark:text-slate-300">
                        {lines.map((line, lIdx) => (
                          <li key={lIdx} className="font-normal leading-relaxed text-slate-700 dark:text-slate-300">
                            {renderFormattedInline(line.trim().replace(/^[-*]\s+/, ''))}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={pIdx} className="font-normal leading-relaxed text-slate-700 dark:text-slate-300">
                      {renderFormattedInline(trimmed)}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-5 font-normal text-slate-700 dark:text-slate-300">
                <p className="font-normal leading-relaxed">{t('blog.article.p1')}</p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                  {t('blog.article.h1')}
                </h2>
                <p className="font-normal leading-relaxed">{t('blog.article.p2')}</p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                  {t('blog.article.h2')}
                </h2>
                <p className="font-normal leading-relaxed">{t('blog.article.p3')}</p>

                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 my-8">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mb-1">
                    {t('blog.coachTipTitle').replace('{club}', currentTenant.name)}
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed font-normal">
                    {t('blog.article.tip')}
                  </p>
                </div>
              </div>
            )}
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
                      onClick={() => handleSelectArticle(article.id)}
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
              type="button"
              onClick={handleBackToList}
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('blog.backToList', 'Volver al listado')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isCorporateLanding) {
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/precios');
                  }
                  setPublicPage('pricing');
                } else {
                  setPublicPage('booking');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer active:scale-95"
            >
              {isCorporateLanding ? t('corporateBlog.ctaPricing', 'Ver Planes y Precios') : t('blog.bookToPractice', 'Reservar Pista para Practicar')}
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
                  ? t('corporateBlog.subtitle', t('blog.subtitle', 'Artículos técnicos elaborados por entrenadores titulados, análisis de biomecánica, crónicas de torneos y novedades del club.'))
                  : t('blog.description', t('blog.subtitle', 'Artículos técnicos elaborados por nuestros entrenadores, análisis de biomecánica, crónicas de torneos y novedades del club en Narón.'))}
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
                type="button"
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
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
                  onClick={() => handleSelectArticle(post.id)}
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

export default BlogView;
