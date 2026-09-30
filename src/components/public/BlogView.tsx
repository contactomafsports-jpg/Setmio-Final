import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types/database';
import {
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  Share2,
  Bookmark,
  Calendar,
  Search,
} from 'lucide-react';

export const BlogView: React.FC = () => {
  const {
    blogPosts,
    selectedArticleId,
    setSelectedArticleId,
    triggerDemoToast,
    setPublicPage,
    currentTenant,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Técnica & Táctica', 'Instalaciones', 'Salud & Rendimiento'];

  const selectedArticle = blogPosts.find((p) => p.id === selectedArticleId);

  const filteredPosts = blogPosts.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      triggerDemoToast('Enlace Copiado', `Enlace de "${title}" copiado al portapapeles.`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-100">
      {/* If an article is selected, show Full Article Reader View */}
      {selectedArticle ? (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-150">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Blog</span>
          </button>

          <header className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              <span>{selectedArticle.category}</span>
              <span>·</span>
              <span className="text-slate-400 font-normal">
                {selectedArticle.publishedAt.split('T')[0]}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {selectedArticle.title}
            </h1>

            <div className="flex items-center justify-between border-y border-slate-800 py-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-medium">{selectedArticle.author}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{selectedArticle.readingTime} min de lectura</span>
                </div>
                <button
                  onClick={() => handleShare(selectedArticle.title)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Compartir artículo"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-80 sm:h-96">
            <img
              src={selectedArticle.coverImage}
              alt={selectedArticle.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Markdown content */}
          <div className="prose prose-invert prose-emerald max-w-none text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
            {selectedArticle.content}
          </div>

          {/* Footer Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">¿Te ha parecido útil este artículo?</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Publicado por el equipo técnico de {currentTenant.name} en Narón.
              </div>
            </div>
            <button
              onClick={() => {
                setPublicPage('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-xs shadow transition"
            >
              Reservar Pista y Entrenar
            </button>
          </div>
        </div>
      ) : (
        /* Blog Index View */
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Actualidad, Técnica & Eventos
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Blog de Pádel San Mateo
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Artículos, crónicas de torneos, consejos nutricionales y biomecánica de la mano de nuestros entrenadores titulados en Narón.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs overflow-x-auto">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                    selectedCategory === c ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c === 'all' ? 'Todos' : c}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedArticleId(post.id)}
                className="cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold text-white bg-slate-950/80 backdrop-blur-md border border-slate-800">
                    {post.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>{post.author}</span>
                      <span>{post.readingTime} min</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{post.summary}</p>
                  </div>

                  <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span>Leer Artículo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
