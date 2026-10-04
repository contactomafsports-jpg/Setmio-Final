import React from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Shield,
  Award,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentTenant, courts, setPublicPage, setCurrentView, t, currentLanguage } = useApp();
  void currentLanguage;

  const handleNav = (page: PublicPage) => {
    setPublicPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-base">
                SM
              </div>
              <div>
                <div className="font-black text-base text-white tracking-tight">
                  {currentTenant.name}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  {currentTenant.city}, {currentTenant.region} · España
                </div>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {t('footer.description', 'Tu centro deportivo de referencia en Ferrolterra y comarca de Narón. Pistas panorámicas cubiertas, climatización, club social, tienda oficial y la academia más activa de Galicia.')}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{currentTenant.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{currentTenant.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{currentTenant.contactEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-slate-400">@padelsanmateonaron</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footer.facilities', 'Instalaciones & Juego')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('courts')} className="hover:text-emerald-400 transition">
                  {t('footer.courts', 'Pistas y Tarifas')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('booking')} className="hover:text-emerald-400 transition">
                  {t('footer.booking', 'Reservar Pista Online')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('matches')} className="hover:text-emerald-400 transition">
                  Partidos Abiertos Play!
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('club')} className="hover:text-emerald-400 transition">
                  Instalaciones & Vestuarios
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tournaments')} className="hover:text-emerald-400 transition">
                  Torneos & Ligas
                </button>
              </li>
            </ul>
          </div>

          {/* Academy & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footer.academy', 'Escuela & Servicios')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('academy')} className="hover:text-emerald-400 transition">
                  Escuela de Menores
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('academy')} className="hover:text-emerald-400 transition">
                  Clases Particulares & Adultos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-emerald-400 transition">
                  Tienda Oficial de Pádel
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog')} className="hover:text-emerald-400 transition">
                  Blog & Consejos Técnicos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-emerald-400 transition">
                  Preguntas Frecuentes (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Schedules & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Horarios del Club</h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-semibold text-slate-200">Apertura Diaria:</span>
              </div>
              {currentTenant.settings.openingHours.map((h, i) => (
                <div key={i} className="text-[11px] text-slate-400">
                  <span className="text-slate-300">{h.days}:</span> {h.hours}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-900 space-y-1">
              <div className="text-[11px] text-slate-400">Zona Climatizada & Cafetería</div>
              <div className="text-[11px] text-slate-400">Aparcamiento Gratuito Vigilado</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Platform white-label credit */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} {currentTenant.name}. Todos los derechos reservados. {currentTenant.address}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('legal')} className="hover:text-slate-300 transition">
              Aviso Legal
            </button>
            <span>·</span>
            <button onClick={() => handleNav('legal')} className="hover:text-slate-300 transition">
              Privacidad & Cookies
            </button>
            <span>·</span>
            <button onClick={() => setCurrentView('admin')} className="hover:text-emerald-400 transition">
              Acceso Gestión
            </button>
          </div>
        </div>

        {/* Small subtle white label badge */}
        <div className="mt-4 text-center text-[10px] text-slate-400">
          Tecnología SaaS impulsada por <span className="font-semibold text-slate-400">Setmio Padel Pro</span> · Software de Marca Blanca para Pádel
        </div>
      </div>
    </footer>
  );
};
