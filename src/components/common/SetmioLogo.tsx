import React from 'react';
import { Tenant } from '../../types/database';

export interface SetmioLogoProps {
  variant?: 'horizontal' | 'vertical' | 'symbol' | 'wordmark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  theme?: 'dark' | 'light' | 'auto';
  showSubtitle?: boolean;
  withAppIcon?: boolean;
  className?: string;
  whiteLabelTenant?: Tenant | null;
  customHeight?: number;
}

/**
 * Isotipo Oficial SETMIO PÁDEL (image_16.png)
 * Doble franja dinámica en ángulo paralelo con punto de pelota verde lima (#87F229)
 */
export const SetmioSymbol: React.FC<{
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  size?: number;
  withAppIcon?: boolean;
  iconBg?: 'dark' | 'violet';
}> = ({
  className = '',
  theme = 'auto',
  size = 40,
  withAppIcon = false,
  iconBg = 'dark',
}) => {
  // Colores según el tema
  const stripeColor =
    theme === 'dark'
      ? '#FFFFFF'
      : theme === 'light'
      ? '#0B1A2D'
      : 'currentColor';

  const limeColor = '#87F229';
  const bgColor = iconBg === 'violet' ? '#8B5CF6' : '#0B1A2D';

  const innerSvg = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Sombra sutil y resplandor para el punto lima */}
        <filter id="limeGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#87F229" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Punto de pelota de pádel Verde Lima (#87F229) */}
      <circle
        cx="76"
        cy="17"
        r="7.5"
        fill={limeColor}
        filter="url(#limeGlow)"
      />

      {/* Franja Superior Dinámica (Inclinada y redondeada) */}
      <path
        d="M 62 25 C 66.5 25 68 29.5 64.5 34 L 43.5 64.5 C 41 68 36.5 69 32.5 66.5 L 26.5 62 C 22.5 59.5 22 55 24.5 51.5 L 45.5 21 C 48.5 17 55 16.5 60 21 L 62 25 Z"
        fill={stripeColor}
      />

      {/* Franja Inferior Dinámica (Paralela a la superior formando la 'S' deportiva) */}
      <path
        d="M 76 37.5 C 80 41 79.5 45.5 77 49 L 56 79.5 C 53 84 46.5 84.5 41.5 81 L 39.5 79.5 C 35.5 76.5 35 72 37.5 68.5 L 58.5 38 C 61 34.5 65.5 33.5 69.5 36 L 76 37.5 Z"
        fill={stripeColor}
      />
    </svg>
  );

  if (withAppIcon) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl shadow-lg transition-transform ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor,
          padding: size * 0.18,
        }}
      >
        {innerSvg}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {innerSvg}
    </div>
  );
};

/**
 * Wordmark Tipográfico Personalizado SETMIO con subtítulo PÁDEL (image_16.png)
 * Incorpora la icónica 'E' futurista de tres barras horizontales redondeadas
 */
export const SetmioWordmark: React.FC<{
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  showSubtitle?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}> = ({
  className = '',
  theme = 'auto',
  showSubtitle = true,
  size = 'md',
}) => {
  const textColor =
    theme === 'dark'
      ? 'text-white'
      : theme === 'light'
      ? 'text-[#0B1A2D]'
      : 'text-slate-900 dark:text-white';

  const subtitleColor =
    theme === 'dark'
      ? 'text-slate-300'
      : theme === 'light'
      ? 'text-[#64748B]'
      : 'text-slate-500 dark:text-slate-300';

  // Tamaños tipográficos proporcionales
  const sizeConfig = {
    xs: { text: 'text-base', sub: 'text-[7px]', tracking: 'tracking-[0.35em]', gap: 'gap-0.5' },
    sm: { text: 'text-lg', sub: 'text-[8px]', tracking: 'tracking-[0.4em]', gap: 'gap-0.5' },
    md: { text: 'text-xl sm:text-2xl', sub: 'text-[9px] sm:text-[10px]', tracking: 'tracking-[0.45em]', gap: 'gap-1' },
    lg: { text: 'text-2xl sm:text-3xl', sub: 'text-[11px] sm:text-xs', tracking: 'tracking-[0.5em]', gap: 'gap-1.5' },
    xl: { text: 'text-3xl sm:text-4xl', sub: 'text-xs sm:text-sm', tracking: 'tracking-[0.55em]', gap: 'gap-2' },
  }[size];

  return (
    <div className={`inline-flex flex-col select-none leading-none ${sizeConfig.gap} ${className}`}>
      {/* Logotipo personalizado: Tipografía geométrica SETMIO */}
      <div className={`font-black font-display tracking-tight flex items-center ${sizeConfig.text} ${textColor}`}>
        <span>S</span>
        {/* Letra E distintiva: 3 barras horizontales paralelas redondeadas de la guía de marca */}
        <span className="inline-flex flex-col justify-between mx-[1.5px] h-[0.62em] w-[0.58em] relative top-[-0.04em] shrink-0" aria-label="E">
          <span className="w-full h-[0.16em] rounded-full bg-current" />
          <span className="w-[85%] h-[0.16em] rounded-full bg-current" />
          <span className="w-full h-[0.16em] rounded-full bg-current" />
        </span>
        <span>TMIO</span>
      </div>

      {/* Subtítulo oficial "P Á D E L" con espaciado amplio */}
      {showSubtitle && (
        <div
          className={`font-extrabold uppercase ${sizeConfig.tracking} ${sizeConfig.sub} ${subtitleColor} text-center pl-[0.45em]`}
        >
          PÁDEL
        </div>
      )}
    </div>
  );
};

/**
 * Componente Principal SetmioLogo
 * Soporta todas las variantes de diseño y adaptación dinámica a marca blanca de clubes
 */
export const SetmioLogo: React.FC<SetmioLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'auto',
  showSubtitle = true,
  withAppIcon = false,
  className = '',
  whiteLabelTenant = null,
  customHeight,
}) => {
  // LÓGICA DE MARCA BLANCA POR CLUB:
  // Si se pasa un tenant con branding propio configurado y logo o iniciales, se renderiza su marca blanca
  if (whiteLabelTenant && whiteLabelTenant.type === 'PADEL_CLUB' && whiteLabelTenant.branding) {
    const { logoUrl, primaryColor } = whiteLabelTenant.branding;
    const name = whiteLabelTenant.name;
    const shortName = whiteLabelTenant.shortName;
    return (
      <div className={`inline-flex items-center gap-2.5 min-w-0 ${className}`}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name || shortName}
            className="h-8 w-8 rounded-xl object-contain bg-white border border-slate-200 p-1 shrink-0"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: primaryColor || '#10b981' }}
          >
            {(shortName || name || 'CLUB').slice(0, 3).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
            {name || shortName}
          </div>
          {showSubtitle && (
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
              Club Oficial
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dimensiones del isotipo según 'size'
  const iconPixelSize =
    customHeight ??
    {
      xs: 22,
      sm: 28,
      md: 36,
      lg: 48,
      xl: 64,
      custom: 36,
    }[size];

  // Variante: SOLO SÍMBOLO / ISOTIPO
  if (variant === 'symbol') {
    return (
      <SetmioSymbol
        size={iconPixelSize}
        theme={theme}
        withAppIcon={withAppIcon}
        className={className}
      />
    );
  }

  // Variante: SOLO WORDMARK TIPOGRÁFICO
  if (variant === 'wordmark') {
    return (
      <SetmioWordmark
        size={size === 'custom' ? 'md' : size}
        theme={theme}
        showSubtitle={showSubtitle}
        className={className}
      />
    );
  }

  // Variante: VERTICAL (Isotipo centrado arriba, texto abajo)
  if (variant === 'vertical') {
    return (
      <div className={`inline-flex flex-col items-center justify-center text-center gap-2.5 ${className}`}>
        <SetmioSymbol
          size={iconPixelSize * 1.3}
          theme={theme}
          withAppIcon={withAppIcon}
        />
        <SetmioWordmark
          size={size === 'custom' ? 'md' : size}
          theme={theme}
          showSubtitle={showSubtitle}
        />
      </div>
    );
  }

  // Variante por defecto: HORIZONTAL (Isotipo a la izquierda, texto a la derecha)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}>
      <SetmioSymbol
        size={iconPixelSize}
        theme={theme}
        withAppIcon={withAppIcon}
      />
      <SetmioWordmark
        size={size === 'custom' ? 'md' : size}
        theme={theme}
        showSubtitle={showSubtitle}
      />
    </div>
  );
};
