import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  ShoppingCart,
} from 'lucide-react';
import { NotificationsPopover } from '../common/NotificationsPopover';
import { UserProfileDropdown } from '../common/UserProfileDropdown';
import { CartDrawer } from '../public/CartDrawer';

interface PlayerHeaderProps {
  onToggleMobileDrawer?: () => void;
  onOpenPublicProfile?: () => void;
  onOpenLegalModal?: () => void;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  onToggleMobileDrawer,
  onOpenPublicProfile,
  onOpenLegalModal,
}) => {
  const {
    currentTenant,
    cart,
    isWhiteLabelPlayerPreview,
    selectedVenue,
    activeDemoAccount,
    switchDemoAccount,
  } = useApp();

  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const clubShortName = selectedVenue && selectedVenue.id !== 'all'
    ? `${currentTenant.shortName} (${selectedVenue.shortName})`
    : currentTenant.shortName;

  const whiteLabelBadge =
    currentTenant.type === 'ACADEMY'
      ? 'App Marca Blanca Escuela · Alumno'
      : currentTenant.type === 'COACH'
      ? 'App Marca Blanca Profesor · Alumno'
      : 'App Marca Blanca Club · Socio';

  return (
    <>
      <header
        className={`sticky ${
          isWhiteLabelPlayerPreview ? 'top-10' : 'top-0'
        } z-50 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 shadow-xs transition-colors`}
      >
        {/* Lado Izquierdo: Logo/Marca Condicional */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleMobileDrawer && (
            <button
              type="button"
              onClick={onToggleMobileDrawer}
              className="lg:hidden p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Menú lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5 min-w-0">
            {isWhiteLabelPlayerPreview ? (
              <>
                {/* Logo / Isotipo de la Entidad Marca Blanca */}
                <div
                  className="w-8 h-8 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 select-none"
                  style={{ backgroundColor: currentTenant.branding?.primaryColor || '#10b981' }}
                >
                  {currentTenant.shortName.slice(0, 3).toUpperCase()}
                </div>
                {/* Texto de la Entidad Marca Blanca */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-none truncate">
                    {currentTenant.name}
                  </span>
                  <span className="hidden sm:inline-flex items-center text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 shrink-0">
                    {whiteLabelBadge}
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Isotipo Oficial Setmio Player */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0 select-none">
                  S
                </div>
                {/* Texto Oficial Setmio Player */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-none">
                    Setmio Player
                  </span>
                  <span className="hidden sm:inline-flex items-center text-[10px] font-extrabold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-200/60 dark:border-cyan-800/60">
                    B2C Multi-Club Neutra
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lado Derecho: 1. Notificaciones, 2. Carrito de Compra (Solo Jugador), 3. Avatar de Usuario */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 1. Icono de Notificaciones (Campanita con badge dinámico) */}
          <NotificationsPopover variant="player" />

          {/* 2. Icono de Carrito de Compra (Solo en Vista Jugador) */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Ver Detalles del Carrito"
            aria-label="Carrito de compra"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center leading-none ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-75 duration-150">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* 3. Avatar del Usuario con Menú Desplegable */}
          <UserProfileDropdown
            variant="player"
            onOpenProfileModal={onOpenPublicProfile}
            onOpenLegalModal={onOpenLegalModal}
          />
        </div>
      </header>

      {/* Pantalla / Modal funcional de Detalles del Carrito lista para producción */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default PlayerHeader;
