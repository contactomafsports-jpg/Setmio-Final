import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { CORPORATE_BLOG_POSTS } from '../../data/corporateBlogData';
import {
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  Share2,
  Search,
  BookOpen,
  Sparkles,
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

  const renderFormattedInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-[#0B1A2D] dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index} className="font-normal">{part}</span>;
    });
  };

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
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
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
          <article className="max-w-4xl mx-auto space-y-10">
            <header className="space-y-5">
              <div className="flex items-center gap-2 text-xs text-[#8B5CF6] dark:text-[#a78bfa] font-semibold">
                <span>
                  {t(
                    'blog.filters.' + getCategoryFilterId(selectedArticle.category),
                    t('blog.categories.' + getCategoryFilterId(selectedArticle.category), selectedArticle.category)
                  )}
                </span>
                <span className="text-slate-400" aria-hidden="true">·</span>
                <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums font-normal">
                  {selectedArticle.publishedAt.split('T')[0]}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-[#0B1A2D] dark:text-white tracking-tight leading-[1.1] text-balance">
                {t((selectedArticle as any).titleKey || ('blog.posts.' + selectedArticle.id + '.title'), selectedArticle.title)}
              </h1>

              <div className="flex items-center justify-between border-y border-slate-200/80 dark:border-[#1A314D] py-3.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa]" />
                  <span className="text-[#0B1A2D] dark:text-slate-200 font-semibold">
                    {t((selectedArticle as any).authorKey || ('blog.posts.' + selectedArticle.id + '.author'), selectedArticle.author)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 font-mono tabular-nums">
                    <Clock className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229]" />
                    <span>
                      {t(
                        (selectedArticle as any).readingTimeKey || ('blog.posts.' + selectedArticle.id + '.readingTime'),
                        `${selectedArticle.readingTime} ${t('blog.readingTime', 'min de lectura')}`
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleShare(t((selectedArticle as any).titleKey || ('blog.posts.' + selectedArticle.id + '.title'), selectedArticle.title))}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132A45] transition-colors cursor-pointer"
                    title={t('blog.share', 'Compartir artículo')}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Unboxed Metadata Tags */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-[#0B1A2D] dark:text-slate-300">
                  {t('blog.tags', 'Etiquetas')}:
                </span>
                {t((selectedArticle as any).tagsKey || ('blog.posts.' + selectedArticle.id + '.tags'), 'Pádel, Técnica, Rendimiento')
                  .split(',')
                  .map((tag: string, idx: number, arr: string[]) => (
                    <React.Fragment key={tag.trim()}>
                      <span className="text-[#8B5CF6] dark:text-[#a78bfa] font-medium">
                        #{tag.trim()}
                      </span>
                      {idx < arr.length - 1 && (
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </header>

            <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#1A314D] bg-[#0B1A2D] h-80 sm:h-96">
              <img
                src={selectedArticle.coverImage}
                alt={t((selectedArticle as any).titleKey || ('blog.posts.' + selectedArticle.id + '.title'), selectedArticle.title)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="max-w-none text-base leading-relaxed space-y-6 text-slate-700 dark:text-slate-300 font-normal">
              <p className="text-lg sm:text-xl font-medium text-[#0B1A2D] dark:text-slate-100 leading-relaxed pb-6 border-b border-slate-200/80 dark:border-[#1A314D]">
                {t((selectedArticle as any).excerptKey || (selectedArticle as any).summaryKey || ('blog.posts.' + selectedArticle.id + '.summary'), selectedArticle.summary)}
              </p>

              {isCorporateLanding ? (
                <div className="space-y-5 text-base leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                  {selectedArticle.content.split('\n\n').map((block, pIdx) => {
                    const trimmed = block.trim();
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h3 key={pIdx} className="text-xl sm:text-2xl font-bold text-[#0B1A2D] dark:text-white pt-4 tracking-tight">
                          {trimmed.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h2 key={pIdx} className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white pt-6 tracking-tight">
                          {trimmed.replace('## ', '')}
                        </h2>
                      );
                    }
                    const lines = trimmed.split('\n');
                    const isList = lines.length > 1 && lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));
                    if (isList) {
                      return (
                        <ul key={pIdx} className="space-y-2.5 my-4 pl-5 list-disc marker:text-[#8B5CF6] dark:marker:text-[#B7F229] font-normal text-slate-700 dark:text-slate-300">
                          {lines.map((line, lIdx) => (
                            <li key={lIdx} className="font-normal leading-relaxed">
                              {renderFormattedInline(line.trim().replace(/^[-*]\s+/, ''))}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={pIdx} className="font-normal leading-relaxed">
                        {renderFormattedInline(trimmed)}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-5 font-normal text-slate-700 dark:text-slate-300">
                  <p className="font-normal leading-relaxed">{t('blog.article.p1')}</p>

                  <h2 className="text-2xl font-bold text-[#0B1A2D] dark:text-white mt-8 mb-4 tracking-tight">
                    {t('blog.article.h1')}
                  </h2>
                  <p className="font-normal leading-relaxed">{t('blog.article.p2')}</p>

                  <h2 className="text-2xl font-bold text-[#0B1A2D] dark:text-white mt-8 mb-4 tracking-tight">
                    {t('blog.article.h2')}
                  </h2>
                  <p className="font-normal leading-relaxed">{t('blog.article.p3')}</p>

                  <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] my-8 space-y-2">
                    <h4 className="font-bold text-[#0B1A2D] dark:text-[#B7F229] text-sm">
                      {t('blog.coachTipTitle', 'Consejo Técnico de {club}').replace('{club}', currentTenant.name)}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {t('blog.article.tip')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="pt-10 border-t border-slate-200/80 dark:border-[#1A314D] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#0B1A2D] dark:text-white flex items-center gap-2 tracking-tight">
                    <Sparkles className="w-5 h-5 text-[#8B5CF6] dark:text-[#B7F229]" />
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
                        className="cursor-pointer rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden hover:border-[#8B5CF6]/50 dark:hover:border-[#B7F229]/40 transition-colors group flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-36 w-full overflow-hidden bg-[#0B1A2D]">
                            <img
                              src={article.coverImage}
                              alt={artTitle}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-5 space-y-2">
                            <span className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa]">
                              {t('blog.filters.' + filterId, t('blog.categories.' + filterId, article.category))}
                            </span>
                            <h4 className="font-bold text-sm text-[#0B1A2D] dark:text-white line-clamp-2 group-hover:text-[#8B5CF6] dark:group-hover:text-[#B7F229] transition-colors">
                              {artTitle}
                            </h4>
                          </div>
                        </div>
                        <div className="px-5 pb-5 pt-0 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                          {t(
                            (article as any).readingTimeKey || ('blog.posts.' + article.id + '.readingTime'),
                            `${article.readingTime} ${t('blog.readingTimeShort', 'min de lectura')}`
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer Back & CTA */}
            <div className="pt-8 border-t border-slate-200/80 dark:border-[#1A314D] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBackToList}
                className="min-h-[40px] flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer"
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
                className="min-h-[42px] px-6 py-2.5 rounded-xl bg-[#B7F229] hover:bg-[#a6de1f] text-[#0B1A2D] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                {isCorporateLanding ? t('corporateBlog.ctaPricing', 'Ver Planes y Precios') : t('blog.bookToPractice', 'Reservar Pista para Practicar')}
              </button>
            </div>
          </article>
        ) : (
          /* Blog List View */
          <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-4 max-w-3xl text-left">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#8B5CF6] dark:text-[#a78bfa]">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{t('corporateBlog.eyebrow', t('blog.eyebrow', 'Actualidad & Consejos de Pádel'))}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#0B1A2D] dark:text-white tracking-tight leading-[1.08] text-balance">
                  {isCorporateLanding
                    ? t('corporateBlog.title', 'Blog Oficial y Tendencias del Pádel')
                    : t('blog.title', `Blog Oficial ${currentTenant.name}`)}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                  {isCorporateLanding
                    ? t('corporateBlog.subtitle', t('blog.subtitle', 'Artículos técnicos elaborados por entrenadores titulados, análisis de biomecánica, crónicas de torneos y novedades del club.'))
                    : t('blog.description', t('blog.subtitle', 'Artículos técnicos elaborados por nuestros entrenadores, análisis de biomecánica, crónicas de torneos y novedades del club.'))}
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('blog.searchPlaceholder', 'Buscar artículo o tema...')}
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-xl text-sm text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6] font-medium transition-colors"
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
                  className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                      : 'bg-[#F8FAFC] dark:bg-[#0E2239] text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white border border-slate-200/80 dark:border-[#1A314D]'
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
                    className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] overflow-hidden hover:border-[#8B5CF6]/50 dark:hover:border-[#B7F229]/40 transition-colors flex flex-col justify-between group cursor-pointer"
                    onClick={() => handleSelectArticle(post.id)}
                  >
                    <div className="relative h-48 overflow-hidden bg-[#0B1A2D]">
                      <img
                        src={post.coverImage}
                        alt={postTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-[#8B5CF6] dark:text-[#a78bfa]">
                            {t('blog.filters.' + filterId, t('blog.categories.' + filterId, post.category))}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{post.publishedAt.split('T')[0]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {t(
                              (post as any).readingTimeKey || ('blog.posts.' + post.id + '.readingTime'),
                              `${post.readingTime} ${t('blog.readingTimeShort', 'min')}`
                            )}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white group-hover:text-[#8B5CF6] dark:group-hover:text-[#B7F229] transition-colors line-clamp-2 tracking-tight">
                          {postTitle}
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {postSummary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          {t('blog.by', 'Por')} {postAuthor}
                        </span>
                        <span className="text-[#0B1A2D] dark:text-[#B7F229] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {t('blog.readArticle', 'Leer artículo')}
                          <ArrowRight className="w-3.5 h-3.5" />
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
    </div>
  );
};

export default BlogView;
