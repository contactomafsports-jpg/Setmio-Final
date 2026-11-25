import React, { useState } from 'react';
import { FileText, Lock, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SubpageHeaderNav } from './SubpageHeaderNav';
import {
  CorporateBreadcrumb,
  CorporateContainer,
  CorporateEyebrow,
  navigateCorporateRoute,
} from './corporate/CorporatePrimitives';

type LegalSection = 'all' | 'notice' | 'privacy' | 'terms';

export const LegalView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { currentTenant, isCorporateLanding, setPublicPage } = useApp();
  const [activeTab, setActiveTab] = useState<LegalSection>('all');

  const entityName = isCorporateLanding ? 'Setmio Pádel Pro SaaS' : currentTenant.name;
  const entityEmail = isCorporateLanding ? 'contacto@setmio.com' : currentTenant.contactEmail;
  const entityAddress = isCorporateLanding
    ? 'España · Unión Europea'
    : currentTenant.address;

  const tabs: { id: LegalSection; label: string }[] = [
    { id: 'all', label: 'Documento completo' },
    { id: 'notice', label: 'Aviso legal' },
    { id: 'privacy', label: 'Privacidad y RGPD' },
    { id: 'terms', label: 'Condiciones de servicio' },
  ];

  const showSection = (id: Exclude<LegalSection, 'all'>) =>
    activeTab === 'all' || activeTab === id;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1A2D] text-[#0B1A2D] dark:text-white py-12 sm:py-16 transition-colors duration-200">
      <CorporateContainer narrow className="space-y-10">
        {isCorporateLanding ? (
          <CorporateBreadcrumb
            items={[
              { label: 'Inicio', onClick: () => navigateCorporateRoute('/', 'home', setPublicPage) },
              { label: 'Información Legal' },
            ]}
            onBack={onBack}
            backLabel="Volver al inicio"
          />
        ) : (
          <SubpageHeaderNav onBack={onBack} />
        )}

        <header className="space-y-3">
          <CorporateEyebrow>Transparencia y Cumplimiento</CorporateEyebrow>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1A2D] dark:text-white tracking-tight font-display">
            Información Legal y Protección de Datos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {entityName} · {entityAddress}
          </p>
        </header>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-slate-200/80 dark:border-[#1A314D]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0B1A2D] text-[#B7F229] dark:bg-[#B7F229] dark:text-[#0B1A2D]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0E2239]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-[#F7F9FC] dark:bg-[#0E2239] border border-slate-200/90 dark:border-[#1A314D] divide-y divide-slate-200/80 dark:divide-[#1A314D] text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {showSection('notice') && (
            <section className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-base font-bold text-[#0B1A2D] dark:text-white">
                <FileText className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                <span>1. Aviso Legal e Identificación</span>
              </div>
              <p>
                En cumplimiento del artículo 10 de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este portal está operado por{' '}
                <strong className="text-[#0B1A2D] dark:text-white">{entityName}</strong>, con ámbito en{' '}
                {entityAddress} y correo de contacto{' '}
                <span className="font-mono text-[#0B1A2D] dark:text-slate-200">{entityEmail}</span>.
              </p>
              <p>
                La infraestructura tecnológica de marca blanca está provista bajo modelo SaaS por{' '}
                <strong className="text-[#0B1A2D] dark:text-white">Setmio Pádel Pro</strong> con aislamiento de datos por organización.
              </p>
            </section>
          )}

          {showSection('privacy') && (
            <section className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-base font-bold text-[#0B1A2D] dark:text-white">
                <Lock className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                <span>2. Privacidad y Protección de Datos (RGPD)</span>
              </div>
              <p>
                De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), los datos personales facilitados mediante formularios o reservas se tratan exclusivamente para prestar los servicios solicitados y atender consultas técnicas o comerciales.
              </p>
              <p>
                Los registros se alojan en infraestructura ubicada dentro de la Unión Europea con cifrado en tránsito y en reposo. Puedes ejercer tus derechos de acceso, rectificación o supresión escribiendo a{' '}
                <span className="font-mono text-[#0B1A2D] dark:text-slate-200">{entityEmail}</span>.
              </p>
            </section>
          )}

          {showSection('terms') && (
            <section className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-base font-bold text-[#0B1A2D] dark:text-white">
                <Shield className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                <span>3. Condiciones de Servicio y Uso</span>
              </div>
              {isCorporateLanding ? (
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Las suscripciones Setmio Pro se contratan sin comisiones sobre reservas y con alta guiada por nuestro equipo.
                  </li>
                  <li>
                    Cada cliente conserva en todo momento la titularidad íntegra de su base de socios, datos contables y dominio corporativo.
                  </li>
                  <li>
                    Las pasarelas bancarias conectadas liquidan directamente en la cuenta designada por cada organización titular.
                  </li>
                </ul>
              ) : (
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Las reservas pueden anularse hasta{' '}
                    <span className="font-mono tabular-nums font-semibold text-[#0B1A2D] dark:text-white">
                      {currentTenant.settings.cancellationWindowHours}
                    </span>{' '}
                    horas antes del inicio según normativa del centro.
                  </li>
                  <li>
                    Es obligatorio el uso de calzado deportivo adecuado en pista.
                  </li>
                  <li>
                    Los códigos PIN de acceso son personales y válidos únicamente durante el horario reservado.
                  </li>
                </ul>
              )}
            </section>
          )}
        </div>
      </CorporateContainer>
    </main>
  );
};

export default LegalView;
