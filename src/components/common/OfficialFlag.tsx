import React from 'react';
import { SupportedLanguage } from '../../lib/i18n';

interface OfficialFlagProps {
  code: SupportedLanguage;
  className?: string;
  showCode?: boolean;
}

export const OfficialFlag: React.FC<OfficialFlagProps> = ({
  code,
  className = 'w-5 h-3.5',
  showCode = false,
}) => {
  const renderFlagSvg = () => {
    switch (code) {
      case 'gl':
        // Bandera Oficial de Galicia: Fondo blanco con banda diagonal celeste
        return (
          <svg viewBox="0 0 750 500" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="Bandera Oficial de Galicia">
            <rect width="750" height="500" fill="#ffffff" />
            <polygon points="0,500 0,333 750,0 750,167" fill="#0099ff" />
          </svg>
        );

      case 'ca':
        // Bandera Oficial de Cataluña (La Senyera): Cuatro barras rojas sobre fondo amarillo
        return (
          <svg viewBox="0 0 750 500" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="Bandera Oficial de Cataluña">
            <rect width="750" height="500" fill="#fcd116" />
            <rect y="55.5" width="750" height="55.5" fill="#d91023" />
            <rect y="166.5" width="750" height="55.5" fill="#d91023" />
            <rect y="277.5" width="750" height="55.5" fill="#d91023" />
            <rect y="388.5" width="750" height="55.5" fill="#d91023" />
          </svg>
        );

      case 'va':
        // Real Senyera Valenciana: Barras catalanas con franja azul coronada al asta
        return (
          <svg viewBox="0 0 750 500" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="Bandera Oficial de la Comunidad Valenciana">
            <rect width="750" height="500" fill="#fcd116" />
            <rect y="55.5" width="750" height="55.5" fill="#d91023" />
            <rect y="166.5" width="750" height="55.5" fill="#d91023" />
            <rect y="277.5" width="750" height="55.5" fill="#d91023" />
            <rect y="388.5" width="750" height="55.5" fill="#d91023" />
            <rect width="180" height="500" fill="#0055a5" />
            <path d="M40,200 L90,140 L140,200 L120,260 L60,260 Z" fill="#fcd116" />
          </svg>
        );

      case 'eu':
        // Bandera Oficial del País Vasco (Ikurriña): Fondo rojo, aspa verde y cruz blanca
        return (
          <svg viewBox="0 0 750 500" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="Bandera Oficial de Euskadi (Ikurriña)">
            <rect width="750" height="500" fill="#d91023" />
            {/* Aspa de San Andrés Verde */}
            <polygon points="0,0 75,0 750,450 750,500 675,500 0,50" fill="#008833" />
            <polygon points="750,0 675,0 0,450 0,500 75,500 750,50" fill="#008833" />
            {/* Cruz Blanca horizontal y vertical */}
            <rect x="335" width="80" height="500" fill="#ffffff" />
            <rect y="210" width="750" height="80" fill="#ffffff" />
          </svg>
        );

      case 'es':
        return (
          <svg viewBox="0 0 750 500" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="Bandera de España">
            <rect width="750" height="125" fill="#aa151b" />
            <rect y="125" width="750" height="250" fill="#f1bf00" />
            <rect y="375" width="750" height="125" fill="#aa151b" />
          </svg>
        );

      case 'en':
        return (
          <svg viewBox="0 0 60 30" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="United Kingdom Flag">
            <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
            <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
            <g clipPath="url(#s)">
              <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
              <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
            </g>
          </svg>
        );

      case 'pt':
        return (
          <svg viewBox="0 0 600 400" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="Bandeira de Portugal">
            <rect width="240" height="400" fill="#006600" />
            <rect x="240" width="360" height="400" fill="#ff0000" />
            <circle cx="240" cy="200" r="80" fill="#ffff00" />
          </svg>
        );

      case 'fr':
        return (
          <svg viewBox="0 0 900 600" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="Drapeau Français">
            <rect width="300" height="600" fill="#0055a5" />
            <rect x="300" width="300" height="600" fill="#ffffff" />
            <rect x="600" width="300" height="600" fill="#ed2939" />
          </svg>
        );

      case 'de':
        return (
          <svg viewBox="0 0 500 300" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="Flagge Deutschlands">
            <rect width="500" height="100" fill="#000000" />
            <rect y="100" width="500" height="100" fill="#dd0000" />
            <rect y="200" width="500" height="100" fill="#ffce00" />
          </svg>
        );

      case 'it':
        return (
          <svg viewBox="0 0 900 600" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="Bandiera d'Italia">
            <rect width="300" height="600" fill="#009246" />
            <rect x="300" width="300" height="600" fill="#ffffff" />
            <rect x="600" width="300" height="600" fill="#ce2b37" />
          </svg>
        );

      case 'ar':
        return (
          <svg viewBox="0 0 600 300" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`} aria-label="علم الإمارات / اللغة العربية">
            <rect width="600" height="100" fill="#00732f" />
            <rect y="100" width="600" height="100" fill="#ffffff" />
            <rect y="200" width="600" height="100" fill="#000000" />
            <rect width="150" height="300" fill="#ff0000" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 750 500" className={`${className} rounded-sm shadow-xs border border-slate-300 dark:border-slate-700 inline-block shrink-0`}>
            <rect width="750" height="500" fill="#0055a5" />
          </svg>
        );
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      {renderFlagSvg()}
      {showCode && (
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
          {code.toUpperCase()}
        </span>
      )}
    </span>
  );
};
