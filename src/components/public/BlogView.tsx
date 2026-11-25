import React, { useState, useEffect } from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import { CORPORATE_BLOG_POSTS } from '../../data/corporateBlogData';
import { RoleSelectorModal } from '../common/RoleSelectorModal';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  Search,
  Share2,
  User,
  X,
} from 'lucide-react';
import {
  CorporateContainer,
  CorporateCtaBanner,
  CorporateEyebrow,
  CorporatePrimaryButton,
  CorporateSecondaryButton,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';

interface BlogViewProps {
  onBack?: () => void;
  onOpenDemo?: () => void;
  onOpenRegister?: () => void;
}

const BlogCoverImage: React.FC<{
  src: string;
  alt: string;
  aspectClass?: string;
  imgClassName?: string;
}> = ({ src, alt, aspectClass = 'aspect-[16/10]', imgClassName = '' }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`${aspectClass} overflow-hidden bg-[#0B1A2D]`}>
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#071220] via-[#0B1A2D] to-[#132A45] p-6 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
            Publicaciones Setmio
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover object-center ${imgClassName}`}
        />
      )}
    </div>
  );
};

export const BlogView: React.FC<BlogViewProps> = ({
  onBack,
  onOpenDemo,
  onOpenRegister,
}) => {
  const {
    blogPosts,
    selectedArticleId,
    setSelectedArticleId,
    triggerDemoToast,
    setPublicPage,
    currentTenant,
    t,
    isCorporateLanding,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [localDemoModalOpen, setLocalDemoModalOpen] = useState(false);

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
      return <span key={index}>{part}</span>;
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
        { id: 'all', label: 'Todos', categoryMatch: 'all' },
        { id: 'domotica', label: 'Tecnología y Domótica', categoryMatch: 'Tecnología & Domótica' },
        { id: 'gestion', label: 'Gestión de Clubes', categoryMatch: 'Gestión de Clubes' },
        { id: 'finanzas', label: 'Ocupación y Precios', categoryMatch: 'Finanzas & Ocupación' },
        { id: 'escuelas', label: 'Escuelas y Competición', categoryMatch: 'Escuelas & Competición' },
      ]
    : [
        { id: 'all', label: 'Todos', categoryMatch: 'all' },
        { id: 'tecnica', label: 'Técnica y Táctica', categoryMatch: 'Técnica & Táctica' },
        { id: 'instalaciones', label: 'Instalaciones', categoryMatch: 'Instalaciones' },
        { id: 'salud', label: 'Salud y Rendimiento', categoryMatch: 'Salud & Rendimiento' },
      ];

  const getCategoryFilterId = (cat: string) => {
    if (cat === 'Tecnología & Domótica') return 'domotica';
    if (cat === 'Gestión de Clubes') return 'gestion';
    if (cat === 'Finanzas & Ocupación') return 'finanzas';
    if (cat === 'Escuelas & Competición') return 'escuelas';
    if (cat === 'Técnica & Táctica') return 'tecnica';
    if (cat === 'Instalaciones') return 'instalaciones';
    return 'salud';
  };

  const getCategoryCount = (catId: string, categoryMatch: string) => {
    if (catId === 'all') return activeBlogPosts.length;
    return activeBlogPosts.filter(
      (p) => p.category === categoryMatch || getCategoryFilterId(p.category) === catId
    ).length;
  };

  const selectedArticle = activeBlogPosts.find((p) => p.id === selectedArticleId);
  const relatedArticles = selectedArticle
    ? activeBlogPosts.filter((p) => p.id !== selectedArticle.id).slice(0, 3)
    : [];

  const filteredPosts = activeBlogPosts.filter((p) => {
    const activeCat = categories.find((c) => c.id === selectedCategory);
    const matchCat =
      selectedCategory === 'all' ||
      p.category === activeCat?.categoryMatch ||
      getCategoryFilterId(p.category) === selectedCategory;

    const postTitle = t((p as { titleKey?: string }).titleKey || `blog.posts.${p.id}.title`, p.title);
    const postSummary = t(
      (p as { summaryKey?: string }).summaryKey || `blog.posts.${p.id}.summary`,
      p.summary
    );
    const postAuthor = t((p as { authorKey?: string }).authorKey || `blog.posts.${p.id}.author`, p.author);
    const q = search.trim().toLowerCase();

    const matchSearch =
      !q ||
      postTitle.toLowerCase().includes(q) ||
      postSummary.toLowerCase().includes(q) ||
      postAuthor.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q);

    return matchCat && matchSearch;
  });

  const navigate = (path: string, page: PublicPage) => {
    navigateCorporateRoute(path, page, setPublicPage);
  };

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
    if (typeof window !== 'undefined') {
      navigateCorporateRoute('/', 'home', setPublicPage);
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
        t('blog.shareCopied', 'Enlace copiado'),
        t('blog.shareCopiedDesc', `Enlace de "${title}" copiado al portapapeles.`),
        'info'
      );
    }
  };

  const handleRegisterCta = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/registro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    onOpenRegister?.();
  };

  const handleOpenDemoClick = () => {
    if (onOpenDemo) {
      onOpenDemo();
    } else {
      setLocalDemoModalOpen(true);
    }
  };

  const selectedArticleTitle = selectedArticle
    ? t(
        (selectedArticle as { titleKey?: string }).titleKey || `blog.posts.${selectedArticle.id}.title`,
        selectedArticle.title
      )
    : '';

  // CLIENT WHITE-LABEL / DEMO BLOG VIEW (Preserved strictly intact)
  if (!isCorporateLanding) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors duration-200">
        <CorporateContainer className="space-y-12">
          <SubpageHeaderNav
            onBack={selectedArticle ? handleBackToList : handleBackFromBlog}
            label={selectedArticle ? 'Volver a artículos' : 'Volver'}
          />

          {selectedArticle ? (
            <article className="max-w-3xl mx-auto space-y-10">
              <header className="space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                    {selectedArticle.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {selectedArticle.publishedAt.split('T')[0]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedArticle.readingTime} min de lectura
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight leading-[1.1] font-display text-balance">
                  {selectedArticleTitle}
                </h1>

                <div className="flex items-center justify-between py-4 border-y border-slate-200/80 dark:border-[#1A314D] text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2 font-semibold">
                    <User className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229]" />
                    <span>{selectedArticle.author}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleShare(selectedArticleTitle)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartir</span>
                  </button>
                </div>
              </header>

              <div className="rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#1A314D] bg-[#0B1A2D] aspect-[16/9]">
                <img
                  src={selectedArticle.coverImage}
                  alt={selectedArticleTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-5 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                <p className="text-lg font-medium text-[#0B1A2D] dark:text-slate-100 leading-relaxed pb-5 border-b border-slate-200/80 dark:border-[#1A314D]">
                  {selectedArticle.summary}
                </p>

                <div className="space-y-5">
                  <p>{t('blog.article.p1')}</p>
                  <h2 className="text-2xl font-bold text-[#0B1A2D] dark:text-white pt-4 font-display">
                    {t('blog.article.h1')}
                  </h2>
                  <p>{t('blog.article.p2')}</p>
                  <h2 className="text-2xl font-bold text-[#0B1A2D] dark:text-white pt-4 font-display">
                    {t('blog.article.h2')}
                  </h2>
                  <p>{t('blog.article.p3')}</p>
                </div>
              </div>

              {relatedArticles.length > 0 && (
                <section className="pt-10 border-t border-slate-200/80 dark:border-[#1A314D] space-y-6">
                  <h3 className="text-lg font-bold text-[#0B1A2D] dark:text-white">
                    Artículos relacionados
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {relatedArticles.map((article) => (
                      <button
                        key={article.id}
                        type="button"
                        onClick={() => handleSelectArticle(article.id)}
                        className="text-left rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] overflow-hidden hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[16/10] bg-[#0B1A2D] overflow-hidden">
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 space-y-1.5">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {article.category}
                            </div>
                            <h4 className="text-sm font-bold text-[#0B1A2D] dark:text-white line-clamp-2">
                              {article.title}
                            </h4>
                          </div>
                        </div>
                        <div className="px-4 pb-4 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {article.readingTime} min
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <div className="pt-6 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al listado</span>
                </button>
              </div>
            </article>
          ) : (
            <div className="space-y-12">
              <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  <CorporateEyebrow>{`Blog · ${currentTenant.name}`}</CorporateEyebrow>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                    {`Actualidad de ${currentTenant.name}`}
                  </h1>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t('blog.subtitle', 'Noticias, entrenamientos y torneos de nuestro club.')}
                  </p>
                </div>

                <div className="relative w-full lg:w-72 shrink-0">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar artículo..."
                    className="w-full min-h-[42px] pl-10 pr-4 py-2 bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-xl text-sm text-[#0B1A2D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                  />
                </div>
              </section>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-slate-200/80 dark:border-[#1A314D]">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0E2239]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => {
                  const postTitle = t(
                    (post as { titleKey?: string }).titleKey || `blog.posts.${post.id}.title`,
                    post.title
                  );
                  const postSummary = t(
                    (post as { summaryKey?: string }).summaryKey || `blog.posts.${post.id}.summary`,
                    post.summary
                  );
                  const postAuthor = t(
                    (post as { authorKey?: string }).authorKey || `blog.posts.${post.id}.author`,
                    post.author
                  );
                  return (
                    <article
                      key={post.id}
                      onClick={() => handleSelectArticle(post.id)}
                      className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] overflow-hidden hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/60 transition-colors flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="aspect-[16/10] overflow-hidden bg-[#0B1A2D]">
                          <img
                            src={post.coverImage}
                            alt={postTitle}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-[#0B1A2D] dark:text-[#B7F229]">
                              {post.category}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {post.publishedAt.split('T')[0]}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{post.readingTime} min</span>
                          </div>

                          <h2 className="text-lg font-bold text-[#0B1A2D] dark:text-white leading-snug line-clamp-2 font-display group-hover:underline">
                            {postTitle}
                          </h2>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {postSummary}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 py-4 border-t border-slate-200/80 dark:border-[#1A314D] flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[60%]">
                          {postAuthor}
                        </span>
                        <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229] inline-flex items-center gap-1">
                          <span>Leer</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </section>
            </div>
          )}
        </CorporateContainer>
      </main>
    );
  }

  // PUBLIC CORPORATE SETMIO BLOG VIEW (Aligned with Inicio, Funcionalidades, Domótica & Precios)
  if (selectedArticle) {
    return (
      <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
        <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-7 sm:py-11">
          <CorporateContainer className="space-y-6 sm:space-y-8">
            <nav
              aria-label="Ruta de navegación"
              className="flex items-center gap-1.5 text-xs whitespace-nowrap min-w-0"
            >
              <button
                type="button"
                onClick={() => navigate('/', 'home')}
                className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                Inicio
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
              <button
                type="button"
                onClick={handleBackToList}
                className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                Blog
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
              <span className="font-semibold text-[#0B1A2D] dark:text-white truncate min-w-0">
                {selectedArticleTitle}
              </span>
            </nav>

            <header className="max-w-3xl space-y-4 animate-float-in">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                  {selectedArticle.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {selectedArticle.publishedAt.split('T')[0]}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readingTime} min de lectura
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                {selectedArticleTitle}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200/80 dark:border-[#1A314D] text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 font-semibold">
                  <User className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                  <span>{selectedArticle.author}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleShare(selectedArticleTitle)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200/90 dark:border-[#1A314D] bg-[#F7F9FC] dark:bg-[#0E2239] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </button>
              </div>
            </header>
          </CorporateContainer>
        </section>

        <section className="py-10 sm:py-16 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
          <CorporateContainer className="space-y-12">
            <article className="max-w-3xl mx-auto rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] overflow-hidden">
              <BlogCoverImage
                src={selectedArticle.coverImage}
                alt={selectedArticleTitle}
                aspectClass="aspect-[16/9]"
              />

              <div className="p-6 sm:p-10 space-y-5 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                <p className="text-base sm:text-lg font-medium text-[#0B1A2D] dark:text-slate-100 leading-relaxed pb-5 border-b border-slate-100 dark:border-[#1A314D]">
                  {selectedArticle.summary}
                </p>

                {selectedArticle.content.split('\n\n').map((block, pIdx) => {
                  const trimmed = block.trim();
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h2
                        key={pIdx}
                        className="text-xl sm:text-2xl font-bold text-[#0B1A2D] dark:text-white pt-4 tracking-tight font-display"
                      >
                        {trimmed.replace('### ', '')}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2
                        key={pIdx}
                        className="text-2xl sm:text-3xl font-bold text-[#0B1A2D] dark:text-white pt-6 tracking-tight font-display"
                      >
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }
                  const lines = trimmed.split('\n');
                  const isList =
                    lines.length > 1 &&
                    lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));
                  if (isList) {
                    return (
                      <ul
                        key={pIdx}
                        className="space-y-2.5 my-3 pl-5 list-disc marker:text-[#0B1A2D] dark:marker:text-[#B7F229]"
                      >
                        {lines.map((line, lIdx) => (
                          <li key={lIdx} className="leading-relaxed">
                            {renderFormattedInline(line.trim().replace(/^[-*]\s+/, ''))}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={pIdx} className="leading-relaxed">
                      {renderFormattedInline(trimmed)}
                    </p>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#1A314D] flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1A2D] dark:text-[#B7F229] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver a todas las publicaciones</span>
                  </button>

                  <CorporatePrimaryButton
                    onClick={handleRegisterCta}
                    className="text-xs px-4 py-2.5 min-h-[40px]"
                  >
                    Registrarse
                  </CorporatePrimaryButton>
                </div>
              </div>
            </article>

            {relatedArticles.length > 0 && (
              <div className="space-y-5">
                <h3 className="text-lg sm:text-xl font-bold text-[#0B1A2D] dark:text-white font-display">
                  Artículos relacionados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {relatedArticles.map((article) => (
                    <article
                      key={article.id}
                      className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] overflow-hidden hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none group flex flex-col"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectArticle(article.id)}
                        className="w-full h-full text-left flex flex-col justify-between cursor-pointer"
                      >
                        <div className="w-full">
                          <BlogCoverImage
                            src={article.coverImage}
                            alt={article.title}
                            imgClassName="group-hover:scale-[1.02] transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
                          />
                          <div className="p-5 space-y-2">
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                                {article.category}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">{article.readingTime} min</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-[#0B1A2D] dark:text-white leading-snug font-display group-hover:underline">
                              {article.title}
                            </h4>
                          </div>
                        </div>
                        <div className="w-full px-5 py-3.5 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400 truncate">
                            {article.author}
                          </span>
                          <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229] inline-flex items-center gap-1 shrink-0">
                            <span>Leer</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none" />
                          </span>
                        </div>
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </CorporateContainer>
        </section>

        <section className="py-14 sm:py-18">
          <CorporateContainer>
            <CorporateCtaBanner
              eyebrow="Setmio Pro · Suscripción modular con alta guiada"
              title="Lleva estas prácticas operativas a tu organización"
              subtitle="Configuramos tu plataforma bajo dominio propio con puesta en marcha asistida, migración inicial de datos y sin comisiones por pista."
              primaryLabel="Registrarse"
              onPrimary={handleRegisterCta}
              secondaryLabel="Explorar demo"
              onSecondary={handleOpenDemoClick}
            />
          </CorporateContainer>
        </section>

        <RoleSelectorModal
          isOpen={localDemoModalOpen}
          onClose={() => setLocalDemoModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white transition-colors duration-200 overflow-x-clip">
      {/* 1. COMPACT HERO, SEARCH & WRAPPED CATEGORY FILTERS */}
      <section className="border-b border-slate-200/80 dark:border-[#1A314D] py-7 sm:py-11">
        <CorporateContainer className="space-y-5 sm:space-y-6">
          <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-xs whitespace-nowrap">
            <button
              type="button"
              onClick={() => navigate('/', 'home')}
              className="font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-[#0B1A2D] dark:text-white">
              Blog
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 animate-float-in">
            <div className="max-w-2xl space-y-3">
              <CorporateEyebrow accent="lime">Publicaciones Setmio</CorporateEyebrow>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0B1A2D] dark:text-white leading-[1.08] font-display text-balance">
                Guías operativas y criterios de gestión para el pádel.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Análisis prácticos sobre domótica de pistas, estrategia de marca blanca, escuelas, equipos y rentabilidad.
              </p>
            </div>

            <div className="w-full lg:w-80 shrink-0">
              <label htmlFor="corporate-blog-search" className="sr-only">
                Buscar publicaciones
              </label>
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-400" />
                <input
                  id="corporate-blog-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar artículo o tema..."
                  className="w-full min-h-[44px] pl-10 pr-9 py-2.5 bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] rounded-xl text-sm text-[#0B1A2D] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229] transition-colors duration-150 motion-reduce:transition-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Wrapped Multi-line Category Filters — Fully Visible Without Clipping */}
          <div
            role="tablist"
            aria-label="Filtrar artículos por categoría"
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id, cat.categoryMatch);

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 motion-reduce:transition-none cursor-pointer border ${
                    active
                      ? 'bg-[#0B1A2D] text-white border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                      : 'bg-[#F7F9FC] dark:bg-[#0E2239] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 hover:text-[#0B1A2D] dark:hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      active
                        ? 'text-[#B7F229] dark:text-[#0B1A2D]/80'
                        : 'text-slate-400 dark:text-slate-400'
                    }`}
                  >
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </CorporateContainer>
      </section>

      {/* 2. ARTICLES GRID */}
      <section className="py-10 sm:py-16 bg-[#F7F9FC] dark:bg-[#081424] border-b border-slate-200/80 dark:border-[#1A314D]">
        <CorporateContainer>
          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] p-8 sm:p-12 text-center space-y-4 animate-float-in">
              <div className="text-lg font-bold text-[#0B1A2D] dark:text-white font-display">
                No hay publicaciones que coincidan con tu búsqueda.
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Prueba con otro término o restablece el filtro de categoría para consultar todas las guías disponibles.
              </p>
              <div>
                <CorporateSecondaryButton
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs px-4 py-2.5 min-h-[40px]"
                >
                  Restablecer filtros
                </CorporateSecondaryButton>
              </div>
            </div>
          ) : (
            <div
              key={selectedCategory}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch animate-float-in"
            >
              {filteredPosts.map((post) => {
                const postTitle = t(
                  (post as { titleKey?: string }).titleKey || `blog.posts.${post.id}.title`,
                  post.title
                );
                const postSummary = t(
                  (post as { summaryKey?: string }).summaryKey || `blog.posts.${post.id}.summary`,
                  post.summary
                );
                const postAuthor = t(
                  (post as { authorKey?: string }).authorKey || `blog.posts.${post.id}.author`,
                  post.author
                );

                return (
                  <article
                    key={post.id}
                    className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] hover:border-[#0B1A2D]/40 dark:hover:border-[#B7F229]/50 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0B1A2D]/5 dark:hover:shadow-black/25 motion-reduce:transform-none motion-reduce:transition-none overflow-hidden flex flex-col min-w-0 group"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectArticle(post.id)}
                      className="w-full h-full text-left flex flex-col justify-between cursor-pointer"
                    >
                      <div className="w-full min-w-0">
                        <BlogCoverImage
                          src={post.coverImage}
                          alt={postTitle}
                          imgClassName="group-hover:scale-[1.02] transition-transform duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none"
                        />

                        <div className="p-6 sm:p-7 space-y-3 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229]">
                              {post.category}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {post.publishedAt.split('T')[0]}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{post.readingTime} min</span>
                          </div>

                          <h2 className="text-lg sm:text-xl font-bold text-[#0B1A2D] dark:text-white leading-snug font-display group-hover:underline decoration-[#0B1A2D]/40 dark:decoration-[#B7F229]/60 underline-offset-4">
                            {postTitle}
                          </h2>

                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {postSummary}
                          </p>
                        </div>
                      </div>

                      <div className="w-full px-6 sm:px-7 py-4 border-t border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium truncate min-w-0">
                          {postAuthor}
                        </span>
                        <span className="font-bold text-[#0B1A2D] dark:text-[#B7F229] inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                          <span>Leer</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none" />
                        </span>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </CorporateContainer>
      </section>

      {/* 3. CLOSING DARK CTA BANNER */}
      <section className="py-14 sm:py-18">
        <CorporateContainer>
          <CorporateCtaBanner
            eyebrow="Setmio Pro · Suscripción modular con alta guiada"
            title="Lleva estas prácticas operativas a tu organización"
            subtitle="Configuramos tu plataforma bajo dominio propio con puesta en marcha asistida, migración inicial de datos y sin comisiones por pista."
            primaryLabel="Registrarse"
            onPrimary={handleRegisterCta}
            secondaryLabel="Explorar demo"
            onSecondary={handleOpenDemoClick}
          />
        </CorporateContainer>
      </section>

      <RoleSelectorModal
        isOpen={localDemoModalOpen}
        onClose={() => setLocalDemoModalOpen(false)}
      />
    </div>
  );
};

export default BlogView;
