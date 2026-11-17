import React from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentTenant, setPublicPage, setCurrentView, t, currentLanguage } = useApp();
  void currentLanguage;

  const handleNav = (page: PublicPage) => {
    setPublicPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1A2D] border-t border-[#1A314D] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B7F229] flex items-center justify-center font-bold text-[#0B1A2D] text-sm tracking-tight shrink-0">
                {currentTenant.shortName.split(/\s+/).map((part) => part[0]).join('').slice(0, 3).toUpperCase() || 'SET'}
              </div>
              <div>
                <div className="font-bold text-base text-white tracking-tight">
                  {currentTenant.name}
                </div>
                <div className="text-xs text-[#B7F229] font-medium">
                  {currentTenant.city}, {currentTenant.region} · España
                </div>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {currentTenant.branding.heroSubtitle || t('footer.description', 'Tu plataforma integral de gestión y reservas de pádel.')}
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B7F229] shrink-0 mt-0.5" />
                <span>{currentTenant.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B7F229] shrink-0" />
                <span className="font-mono tabular-nums">{currentTenant.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B7F229] shrink-0" />
                <span className="font-mono">{currentTenant.contactEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#0E2239] hover:bg-[#132A45] border border-[#1A314D] hover:border-[#B7F229]/50 text-slate-300 hover:text-[#B7F229] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#0E2239] hover:bg-[#132A45] border border-[#1A314D] hover:border-[#B7F229]/50 text-slate-300 hover:text-[#B7F229] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <span className="text-xs text-slate-400">@{currentTenant.slug}</span>
            </div>
          </div>

          {/* Quick Links / Specific Entity Columns */}
          {currentTenant.type === 'COACH' ? (
            <>
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white tracking-wide">Clases & Metodología</h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button type="button" onClick={() => handleNav('home')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Clases Particulares 1 a 1
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('home')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Entrenamiento de Parejas
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('home')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Clinics Intensivos Fin de Semana
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('home')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Bonos con Descuento
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white tracking-wide">Servicios & Contacto</h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button type="button" onClick={() => handleNav('home')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Videoanálisis Biomecánico
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('contact')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Consulta Disponibilidad por WhatsApp
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : currentTenant.type === 'PRO_PLAYER' ? (
            <>
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white tracking-wide">Competición & Circuito</h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button type="button" onClick={() => handleNav('home')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Calendario FIP & Premier Padel
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('home')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Palmarés y Estadísticas
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('contact')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Dossier Comercial y Sponsors
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white tracking-wide">Merchandising & Media</h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button type="button" onClick={() => handleNav('shop')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Material y Equipación Oficial
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('contact')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Prensa y Entrevistas
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : currentTenant.type === 'ACADEMY' ? (
            <>
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white tracking-wide">Programas de Formación</h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button type="button" onClick={() => handleNav('academy')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Escuela de Menores (4 a 16 años)
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('academy')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Adultos Iniciación & Perfeccionamiento
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('academy')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Tecnificación & Competición
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white tracking-wide">Admisiones</h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button type="button" onClick={() => handleNav('academy')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Prueba de Nivel Gratuita
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('contact')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      Secretaría y Horarios
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Instalaciones & Juego (Club) */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white tracking-wide">
                  {t('footer.facilities', 'Instalaciones & Juego')}
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button type="button" onClick={() => handleNav('courts')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.courts', 'Pistas y Tarifas')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('booking')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.booking', 'Reservar Pista Online')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('matches')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.matches', 'Partidos Abiertos Play!')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('club')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.amenities', 'Instalaciones & Vestuarios')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('tournaments')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.tournaments', 'Torneos & Ligas')}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Academy & Services */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white tracking-wide">
                  {t('footer.academy', 'Escuela & Servicios')}
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button type="button" onClick={() => handleNav('academy')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.juniorSchool', 'Escuela de Menores')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('academy')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.privateClasses', 'Clases Particulares & Adultos')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('shop')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.officialShop', 'Tienda Oficial de Pádel')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('blog')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.blogTips', 'Blog & Consejos Técnicos')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleNav('contact')} className="hover:text-[#B7F229] transition-colors cursor-pointer text-left">
                      {t('footer.faq', 'Preguntas Frecuentes (FAQ)')}
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Schedules & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              {t('footer.clubHours', 'Horarios del Club')}
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-[#B7F229]">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold text-slate-200">{t('footer.openingDaily', 'Apertura Diaria:')}</span>
              </div>
              {currentTenant.settings.openingHours.map((h, i) => (
                <div key={i} className="text-xs text-slate-400 font-mono tabular-nums">
                  <span className="text-slate-300 font-sans">{h.days}:</span> {h.hours}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1A314D] space-y-1">
              <div className="text-xs text-slate-400">{t('footer.climatizedArea', 'Zona Climatizada & Cafetería')}</div>
              <div className="text-xs text-slate-400">{t('footer.freeParking', 'Aparcamiento Gratuito Vigilado')}</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Platform white-label credit */}
        <div className="mt-12 pt-6 border-t border-[#1A314D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {currentTenant.name}. {t('footer.allRightsReserved', 'Todos los derechos reservados.')}
          </div>

          <div className="flex items-center gap-4">
            <button type="button" onClick={() => handleNav('legal')} className="hover:text-white transition-colors cursor-pointer">
              {t('footer.legal', 'Aviso Legal')}
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => handleNav('legal')} className="hover:text-white transition-colors cursor-pointer">
              {t('footer.privacy', 'Privacidad & Cookies')}
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => setCurrentView('admin')} className="text-[#a78bfa] hover:text-[#B7F229] transition-colors font-semibold cursor-pointer">
              {t('footer.adminAccess', 'Acceso Gestión')}
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-slate-500">
          {t('footer.whiteLabelCredit', 'Tecnología SaaS impulsada por Setmio Padel Pro · Software de Marca Blanca para Pádel')}
        </div>
      </div>
    </footer>
  );
};
