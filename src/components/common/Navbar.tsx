import React, { useState } from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  Calendar,
  Phone,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAuth }) => {
  const {
    currentTenant,
    publicPage,
    setPublicPage,
    cart,
    favorites,
    setCurrentView,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks: { id: PublicPage; label: string }[] = [
    { id: 'home', label: 'Inicio' },
    { id: 'club', label: 'El Club' },
    { id: 'courts', label: 'Pistas' },
    { id: 'booking', label: 'Reservar' },
    { id: 'matches', label: 'Partidos Abiertos' },
    { id: 'academy', label: 'Escuela' },
    { id: 'tournaments', label: 'Torneos' },
    { id: 'shop', label: 'Tienda' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contacto' },
  ];

  const handleNavClick = (pageId: PublicPage) => {
    setPublicPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-9 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
              SM
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                {currentTenant.shortName}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {currentTenant.city} · {currentTenant.region}
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = publicPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors relative ${
                    isActive
                      ? 'text-emerald-400 font-semibold bg-emerald-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favorites Icon */}
            <button
              onClick={() => {
                setPublicPage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Ver favoritos"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Ver cesta de compra"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Login Button */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-white transition"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mi Cuenta</span>
            </button>

            {/* Quick Booking CTA */}
            <button
              onClick={() => handleNavClick('booking')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-900/30 transition hover:shadow-emerald-900/50"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reservar Pista</span>
              <span className="sm:hidden">Reservar</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-150">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => {
              const isActive = publicPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 font-semibold border border-emerald-500/30'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>Acceso Socios & Jugadores</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView('admin');
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800/40 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2"
            >
              <span>Acceso Administración Club</span>
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{currentTenant.contactPhone}</span>
              <span>·</span>
              <span>{currentTenant.city}, Galicia</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
