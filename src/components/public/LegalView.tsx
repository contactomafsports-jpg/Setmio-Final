import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, FileText, Lock } from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';

export const LegalView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { currentTenant, isCorporateLanding } = useApp();

  return (
    <div className="bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mb-8 flex items-center justify-start">
          <SubpageHeaderNav onBack={onBack} className="mb-0" />
        </div>

        <div className="space-y-10">
          <div className="text-left space-y-3">
            <div className="text-xs font-semibold text-[#8B5CF6] dark:text-[#a78bfa] tracking-wide">
              Transparencia & Cumplimiento Legal
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1A2D] dark:text-white tracking-tight text-balance">
              Información Legal y Condiciones de Servicio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isCorporateLanding ? 'Setmio Padel Pro SaaS' : currentTenant.name} · {currentTenant.address}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] divide-y divide-slate-200/80 dark:divide-[#1A314D] text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <section className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-base font-bold text-[#0B1A2D] dark:text-white">
                <FileText className="w-4 h-4 text-[#8B5CF6] dark:text-[#B7F229] shrink-0" />
                <span>1. Aviso Legal e Identificación de la Empresa</span>
              </div>
              <p>
                En cumplimiento del artículo 10 de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este espacio web y aplicación deportiva son operados por{' '}
                <strong className="text-[#0B1A2D] dark:text-white">{currentTenant.name}</strong>, con domicilio en{' '}
                {currentTenant.address} y correo de contacto{' '}
                <span className="font-mono text-[#0B1A2D] dark:text-slate-200">{currentTenant.contactEmail}</span>.
              </p>
              <p>
                La plataforma tecnológica está provista bajo modelo SaaS de marca blanca por{' '}
                <strong className="text-[#0B1A2D] dark:text-white">Setmio Padel Pro</strong> con infraestructura cloud de alta disponibilidad y aislamiento seguro de datos.
              </p>
            </section>

            <section className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-base font-bold text-[#0B1A2D] dark:text-white">
                <Lock className="w-4 h-4 text-[#8B5CF6] dark:text-[#a78bfa] shrink-0" />
                <span>2. Política de Privacidad y Protección de Datos (RGPD)</span>
              </div>
              <p>
                De conformidad con el Reglamento General de Protección de Datos (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), los datos personales facilitados para la reserva de pistas, torneos o escuela son tratados con la exclusiva finalidad de gestionar los servicios deportivos solicitados.
              </p>
              <p>
                Los datos son custodiados en servidores seguros de la Unión Europea (Frankfurt / Madrid) con cifrado en tránsito (TLS 1.3) y en reposo (AES-256). Ningún dato es transferido ni cedido a terceros con fines publicitarios.
              </p>
            </section>

            <section className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-base font-bold text-[#0B1A2D] dark:text-white">
                <Shield className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                <span>3. Condiciones de Reserva, Cancelación y Pagos</span>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                <li>
                  Las reservas pueden anularse con reembolso íntegro hasta con{' '}
                  <span className="font-mono tabular-nums font-semibold text-[#0B1A2D] dark:text-white">
                    {currentTenant.settings.cancellationWindowHours}
                  </span>{' '}
                  horas de antelación.
                </li>
                <li>
                  El uso de calzado específico de pádel (suela espiga o all-court) es obligatorio en todas las pistas para garantizar la durabilidad del césped Mondo Supercourt.
                </li>
                <li>
                  Los códigos PIN de acceso son personales e intransferibles y se desactivan al finalizar el horario reservado.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalView;
