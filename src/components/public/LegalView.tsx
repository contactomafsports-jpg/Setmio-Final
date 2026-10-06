import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, FileText, Lock } from 'lucide-react';
import { SubpageHeaderNav } from './SubpageHeaderNav';

export const LegalView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { currentTenant } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="flex items-center justify-start">
        <SubpageHeaderNav onBack={onBack} />
      </div>

      <div className="text-left space-y-2">
        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Transparencia & Cumplimiento Legal
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Información Legal y Condiciones de Servicio
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {currentTenant.name} · Polígono Industrial Río do Pozo, Narón (Galicia)
        </p>
      </div>

      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>1. Aviso Legal e Identificación de la Empresa</span>
          </div>
          <p>
            En cumplimiento del artículo 10 de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este espacio web y aplicación deportiva son operados por <strong>{currentTenant.name}</strong>, con domicilio en {currentTenant.address} y correo de contacto {currentTenant.contactEmail}.
          </p>
          <p>
            La plataforma tecnológica está provista bajo modelo SaaS de marca blanca por <strong>Setmio Padel Pro</strong> con infraestructura cloud de alta disponibilidad y aislamiento seguro de datos.
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Lock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
            <span>2. Política de Privacidad y Protección de Datos (RGPD)</span>
          </div>
          <p>
            De conformidad con el Reglamento General de Protección de Datos (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), los datos personales facilitados para la reserva de pistas, torneos o escuela son tratados con la exclusiva finalidad de gestionar los servicios deportivos solicitados.
          </p>
          <p>
            Los datos son custodiados en servidores seguros de la Unión Europea (Frankfurt / Madrid) con cifrado en tránsito (TLS 1.3) y en reposo (AES-256). Ningún dato es transferido ni cedido a terceros con fines publicitarios.
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>3. Condiciones de Reserva, Cancelación y Pagos</span>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-500 dark:text-slate-400">
            <li>Las reservas pueden anularse con reembolso íntegro hasta con {currentTenant.settings.cancellationWindowHours} horas de antelación.</li>
            <li>El uso de calzado específico de pádel (suela espiga o all-court) es obligatorio en todas las pistas para garantizar la durabilidad del césped Mondo Supercourt.</li>
            <li>Los códigos PIN de acceso son personales e intransferibles y se desactivan al finalizar el horario reservado.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
