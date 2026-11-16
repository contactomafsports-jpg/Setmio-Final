import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TenantDomain } from '../../types/database';
import {
  Globe,
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Settings2,
  Trash2,
  Check,
  X,
  Star,
} from 'lucide-react';

export const AdminDomains: React.FC = () => {
  const { currentTenant, updateCurrentTenant, triggerDemoToast, setCurrentView } = useApp();

  const [newHostname, setNewHostname] = useState('');
  const [isAddDomainModalOpen, setIsAddDomainModalOpen] = useState(false);
  const [configuringDomainId, setConfiguringDomainId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    triggerDemoToast('Copiado', `"${text}" copiado al portapapeles.`, 'info');
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleAddCustomDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newHostname.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!clean || !clean.includes('.')) {
      triggerDemoToast('Dominio no válido', 'Introduce un dominio válido como padelsanmateo.es', 'warning');
      return;
    }

    if (currentTenant.domains.some((d) => d.hostname.toLowerCase() === clean)) {
      triggerDemoToast('Dominio duplicado', `"${clean}" ya está registrado en este club.`, 'warning');
      return;
    }

    const newDomain: TenantDomain = {
      id: `dom-${Date.now()}`,
      tenantId: currentTenant.id,
      hostname: clean,
      isPrimary: false,
      isCustom: true,
      status: 'pending_verification',
      dnsExpected: {
        type: 'CNAME',
        name: clean.startsWith('www.') ? 'www' : '@',
        value: 'cname.vercel-dns.com',
        ttl: 3600,
      },
      sslActive: false,
    };

    updateCurrentTenant({
      domains: [...currentTenant.domains, newDomain],
    });

    setNewHostname('');
    setIsAddDomainModalOpen(false);
    setConfiguringDomainId(newDomain.id);
    triggerDemoToast(
      'Dominio añadido',
      `Configura el registro CNAME para "${clean}" y pulsa Verificar.`,
      'success'
    );
  };

  const handleVerifyDomain = (domainId: string) => {
    setVerifyingId(domainId);
    setTimeout(() => {
      setVerifyingId(null);
      const updated = currentTenant.domains.map((d) =>
        d.id === domainId
          ? {
              ...d,
              status: 'active' as const,
              sslActive: true,
              dnsVerifiedAt: new Date().toISOString(),
            }
          : d
      );
      updateCurrentTenant({ domains: updated });
      triggerDemoToast(
        'DNS y SSL verificados',
        'El dominio está conectado y protegido con certificado SSL automático.',
        'success'
      );
    }, 1000);
  };

  const handleSetPrimary = (domainId: string) => {
    const updated = currentTenant.domains.map((d) => ({
      ...d,
      isPrimary: d.id === domainId,
    }));
    updateCurrentTenant({ domains: updated });
    triggerDemoToast('Dominio principal actualizado', 'Las peticiones se dirigirán a este dominio.', 'success');
  };

  const handleDeleteDomain = (dom: TenantDomain) => {
    if (dom.isPrimary || !dom.isCustom) {
      triggerDemoToast(
        'Acción no permitida',
        'No puedes eliminar el dominio principal o el subdominio base de Setmio.',
        'warning'
      );
      return;
    }
    const updated = currentTenant.domains.filter((d) => d.id !== dom.id);
    updateCurrentTenant({ domains: updated });
    if (configuringDomainId === dom.id) {
      setConfiguringDomainId(null);
    }
    triggerDemoToast('Dominio eliminado', `Se ha desconectado "${dom.hostname}".`, 'info');
  };

  const primaryDomain = currentTenant.domains.find((d) => d.isPrimary) || currentTenant.domains[0];
  const baseUrl = `https://${primaryDomain?.hostname || 'sanmateo.setmio.com'}`;
  const selectedDnsDomain =
    currentTenant.domains.find((d) => d.id === configuringDomainId) ||
    currentTenant.domains.find((d) => d.isCustom) ||
    primaryDomain;

  const dnsRecords = [
    {
      id: 'cname-root',
      type: selectedDnsDomain?.dnsExpected?.type || 'CNAME',
      host: selectedDnsDomain?.dnsExpected?.name || '@',
      value: selectedDnsDomain?.dnsExpected?.value || 'cname.vercel-dns.com',
      ttl: String(selectedDnsDomain?.dnsExpected?.ttl || 3600),
      status: selectedDnsDomain?.status === 'active' ? 'Verificado' : 'Pendiente',
    },
    {
      id: 'cname-www',
      type: 'CNAME',
      host: 'www',
      value: 'cname.vercel-dns.com',
      ttl: '3600',
      status: selectedDnsDomain?.status === 'active' ? 'Verificado' : 'Opcional',
    },
  ];

  const accessEndpoints = [
    {
      id: 'web',
      label: 'Web Pública',
      url: baseUrl,
      icon: Globe,
      onOpen: () => setCurrentView('public'),
      openTitle: 'Abrir Web Pública',
    },
    {
      id: 'app',
      label: 'App Jugador (PWA)',
      url: `${baseUrl}/app`,
      icon: Smartphone,
      onOpen: () => setCurrentView('player'),
      openTitle: 'Abrir App Jugador',
    },
    {
      id: 'gestion',
      label: 'Gestión Privada',
      url: `${baseUrl}/gestion`,
      icon: ShieldCheck,
      onOpen: () => triggerDemoToast('Panel activo', 'Ya estás dentro del entorno de gestión.', 'info'),
      openTitle: 'Entorno de Gestión',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pt-3 pb-24 sm:pb-16 space-y-6 sm:space-y-8 font-sans text-[#0B1A2D] dark:text-slate-100 antialiased animate-in fade-in duration-150">
      {/* =====================================================================
          1. CABECERA LIMPIA + ICONO "+" PARA AÑADIR DOMINIO
          ===================================================================== */}
      <section className="pt-2 pb-1 flex items-center justify-between gap-3">
        <div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide block mb-1">
            {currentTenant?.name || 'Centro de Pádel San Mateo'}
          </span>
          <h1 className="text-[26px] sm:text-3xl font-bold text-[#0B1A2D] dark:text-white tracking-tight leading-tight">
            Dominios y DNS
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddDomainModalOpen(true)}
          className="p-2 text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] transition-colors cursor-pointer active:scale-95 shrink-0"
          title="Añadir dominio personalizado"
          aria-label="Añadir dominio personalizado"
        >
          <Plus className="w-6 h-6 stroke-[2.2]" />
        </button>
      </section>

      {/* =====================================================================
          2. LISTADO DE DOMINIOS ACTIVOS Y SSL (SIN CONTENEDORES DOBLES)
          ===================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1A314D] flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
              Dominios Conectados
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Estado de verificación DNS y certificado SSL automático.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
            {currentTenant.domains.length} {currentTenant.domains.length === 1 ? 'dominio' : 'dominios'}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#1A314D]">
          {currentTenant.domains.map((dom) => {
            const isVerified = dom.status === 'active';
            const isChecking = verifyingId === dom.id;
            const isSelectedForDns = configuringDomainId === dom.id;

            return (
              <div
                key={dom.id}
                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:bg-slate-50/70 dark:hover:bg-[#132A45]/40 transition"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                    <span className="font-mono font-bold text-sm text-[#0B1A2D] dark:text-white truncate">
                      {dom.hostname}
                    </span>

                    {dom.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full bg-[#0B1A2D] text-white dark:bg-white dark:text-[#0B1A2D] text-[10px] font-bold">
                        Principal
                      </span>
                    )}

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isVerified
                          ? 'bg-[#B7F229]/25 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229]'
                          : 'bg-slate-100 dark:bg-[#071220] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1A314D]'
                      }`}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verificado · SSL</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Pendiente DNS</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                    {dom.isCustom ? 'Dominio propio' : 'Subdominio incluido'} · Enrutamiento TLS activo
                  </div>
                </div>

                {/* Acciones discretas, táctiles y alineadas */}
                <div className="flex items-center gap-1.5 sm:gap-2 pl-6 sm:pl-0 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfiguringDomainId(isSelectedForDns ? null : dom.id)}
                    className={`h-9 px-3 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition cursor-pointer active:scale-95 ${
                      isSelectedForDns
                        ? 'bg-[#0B1A2D] text-[#B7F229] border-[#0B1A2D] dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:border-[#B7F229]'
                        : 'bg-slate-50 dark:bg-[#071220] border-slate-200 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-white'
                    }`}
                    title="Configurar registros DNS"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Configurar</span>
                  </button>

                  {!isVerified && (
                    <button
                      type="button"
                      onClick={() => handleVerifyDomain(dom.id)}
                      disabled={isChecking}
                      className="h-9 px-3 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#c8fa48] dark:text-[#0B1A2D] text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer active:scale-95 disabled:opacity-60"
                      title="Verificar DNS y emitir SSL"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                      <span>{isChecking ? 'Verificando...' : 'Verificar'}</span>
                    </button>
                  )}

                  {!dom.isPrimary && isVerified && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(dom.id)}
                      className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-slate-700 dark:text-slate-300 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                      title="Marcar como dominio principal"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Principal</span>
                    </button>
                  )}

                  {dom.isCustom && !dom.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleDeleteDomain(dom)}
                      className="h-9 w-9 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 inline-flex items-center justify-center transition cursor-pointer active:scale-95"
                      title="Eliminar dominio"
                      aria-label={`Eliminar ${dom.hostname}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          3. REGISTROS DNS EN TABLA HORIZONTAL SIMPLIFICADA
          ===================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1A314D] flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
              Registros DNS
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Apunta estos registros en tu proveedor para{' '}
              <span className="font-mono font-semibold text-[#0B1A2D] dark:text-[#B7F229]">
                {selectedDnsDomain?.hostname}
              </span>
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Propagación habitual 5–15 min
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[540px]">
            <thead className="bg-slate-50/70 dark:bg-[#071220] border-b border-slate-100 dark:border-[#1A314D] text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-5">Tipo</th>
                <th className="py-3 px-4">Nombre / Host</th>
                <th className="py-3 px-4">Valor Destino</th>
                <th className="py-3 px-4">TTL</th>
                <th className="py-3 px-5 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1A314D] font-mono">
              {dnsRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-[#132A45]/30 transition">
                  <td className="py-3.5 px-5 font-extrabold text-[#0B1A2D] dark:text-[#B7F229]">
                    {rec.type}
                  </td>
                  <td className="py-3.5 px-4 text-[#0B1A2D] dark:text-slate-200 font-semibold">
                    {rec.host}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-slate-700 dark:text-slate-300">{rec.value}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(rec.value, rec.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-[#B7F229] hover:bg-slate-100 dark:hover:bg-[#071220] transition cursor-pointer"
                        title="Copiar valor DNS"
                        aria-label="Copiar valor DNS"
                      >
                        {copiedKey === rec.id ? (
                          <Check className="w-3.5 h-3.5 text-[#6e9e02] dark:text-[#B7F229]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{rec.ttl}</td>
                  <td className="py-3.5 px-5 text-right font-sans">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'Verificado'
                          ? 'bg-[#B7F229]/25 dark:bg-[#B7F229]/15 text-[#0B1A2D] dark:text-[#B7F229]'
                          : 'bg-slate-100 dark:bg-[#071220] text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================================
          4. ENLACES DIRECTOS DEL CLUB (LISTA ÚNICA SIN CAJAS ANIDADAS)
          ===================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#0E2239] border border-slate-200/80 dark:border-[#1A314D] shadow-2xs overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1A314D]">
          <h2 className="text-sm font-bold text-[#0B1A2D] dark:text-white">
            Direcciones Activas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Accesos públicos y privados vinculados al dominio principal.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#1A314D]">
          {accessEndpoints.map((ep) => {
            const Icon = ep.icon;
            return (
              <div
                key={ep.id}
                className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-[#132A45]/40 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 text-[#0B1A2D] dark:text-[#B7F229] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0B1A2D] dark:text-white">
                      {ep.label}
                    </div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                      {ep.url}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ep.url, ep.id)}
                    className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-xs font-bold text-[#0B1A2D] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#132A45] inline-flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    {copiedKey === ep.id ? (
                      <Check className="w-3.5 h-3.5 text-[#6e9e02] dark:text-[#B7F229]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">
                      {copiedKey === ep.id ? 'Copiado' : 'Copiar'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={ep.onOpen}
                    className="h-9 w-9 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:hover:bg-[#c8fa48] dark:text-[#0B1A2D] inline-flex items-center justify-center transition cursor-pointer active:scale-95"
                    title={ep.openTitle}
                    aria-label={ep.openTitle}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          MODAL: AÑADIR DOMINIO PERSONALIZADO
          ===================================================================== */}
      {isAddDomainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071220]/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E2239] border border-slate-200 dark:border-[#1A314D] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A314D] pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#0B1A2D] dark:text-[#B7F229]" />
                <h3 className="text-base font-bold text-[#0B1A2D] dark:text-white">
                  Añadir Dominio Personalizado
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDomainModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0B1A2D] dark:hover:text-white cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomDomain} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Dominio o subdominio *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newHostname}
                  onChange={(e) => setNewHostname(e.target.value)}
                  placeholder="padelsanmateo.es"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#071220] border border-slate-200 dark:border-[#1A314D] text-[#0B1A2D] dark:text-white font-mono text-xs placeholder-slate-400 focus:outline-none focus:border-[#0B1A2D] dark:focus:border-[#B7F229]"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Ejemplo: <code className="font-mono">padelsanmateo.es</code> o{' '}
                  <code className="font-mono">reservas.miclub.com</code>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#1A314D] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDomainModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071220] text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1A2D] hover:bg-[#132A45] text-white dark:bg-[#B7F229] dark:text-[#0B1A2D] dark:hover:bg-[#c8fa48] font-bold transition shadow-2xs cursor-pointer"
                >
                  Añadir Dominio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDomains;
