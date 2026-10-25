import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TenantDomain } from '../../types/database';
import {
  Globe,
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Eye,
  ArrowRight,
} from 'lucide-react';

export const AdminDomains: React.FC = () => {
  const { currentTenant, updateCurrentTenant, triggerDemoToast, setCurrentView } = useApp();

  const [newHostname, setNewHostname] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    triggerDemoToast('Enlace Copiado', `"${text}" copiado al portapapeles.`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddCustomDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newHostname.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!clean || !clean.includes('.')) {
      triggerDemoToast('Dominio no válido', 'Introduce un dominio válido como padelsanmateo.es', 'warning');
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
        name: '@',
        value: 'cname.vercel-dns.com',
        ttl: 3600,
      },
      sslActive: false,
    };

    updateCurrentTenant({
      domains: [...currentTenant.domains, newDomain],
    });

    setNewHostname('');
    triggerDemoToast(
      'Dominio Registrado',
      `Se ha añadido "${clean}". Configura el registro CNAME en tu proveedor de DNS para completar la verificación.`,
      'success'
    );
  };

  const handleVerifyDomain = (domainId: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
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
        '¡DNS y SSL Verificados con Éxito!',
        'El dominio propio está activo y protegido con certificado SSL automático de Vercel.',
        'success'
      );
    }, 1500);
  };

  const handleSetPrimary = (domainId: string) => {
    const updated = currentTenant.domains.map((d) => ({
      ...d,
      isPrimary: d.id === domainId,
    }));
    updateCurrentTenant({ domains: updated });
    triggerDemoToast('Dominio Principal Asignado', 'Las peticiones se redirigirán a este dominio.', 'success');
  };

  const primaryDomain = currentTenant.domains.find((d) => d.isPrimary) || currentTenant.domains[0];
  const baseUrl = `https://${primaryDomain?.hostname || 'sanmateo.setmio.com'}`;

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100 max-w-5xl pb-16 transition-colors duration-200">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Mi Web y Mi App · Dominios & Enlaces Públicos
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Enlaces de Publicación y Dominios Propios
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Consulta y comparte las direcciones web oficiales de tu club o conecta tu propio dominio con enrutamiento inteligente gestionado en la nube.
        </p>
      </div>

      {/* Primary Links Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Public Web Link */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Web Pública del Club</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
              Activo
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
            {baseUrl}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => copyToClipboard(baseUrl, 'web')}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'web' ? 'Copiado' : 'Copiar URL'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('public')}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs cursor-pointer active:scale-95"
              title="Abrir Web Pública"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Player PWA Mobile App Link */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>App Móvil Jugador</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 font-bold">
              PWA
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
            {baseUrl}/app
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => copyToClipboard(`${baseUrl}/app`, 'app')}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'app' ? 'Copiado' : 'Copiar URL'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('player')}
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow-xs cursor-pointer active:scale-95"
              title="Abrir Área Jugador"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Private Management Link */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Acceso Gestión Privada</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-bold">
              Privado
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
            {baseUrl}/gestion
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => copyToClipboard(`${baseUrl}/gestion`, 'gestion')}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'gestion' ? 'Copiado' : 'Copiar URL'}</span>
            </button>
            <button
              type="button"
              onClick={() => triggerDemoToast('Ya estás en Gestión', 'Te encuentras dentro del panel administrativo.', 'info')}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-xs cursor-pointer active:scale-95"
              title="Ver Gestión"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Domains Table List */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Dominios Registrados para este Tenant</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cada dominio verificado enruta directamente a la base de datos de {currentTenant.name}.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {currentTenant.domains.map((dom) => (
            <div
              key={dom.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">{dom.hostname}</span>
                  {dom.isPrimary && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white font-sans">
                      Principal
                    </span>
                  )}
                  {dom.isCustom ? (
                    <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 px-2 py-0.5 rounded-full font-bold">
                      Dominio Propio
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-full">
                      Subdominio Setmio
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {dom.status === 'active' ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conectado y SSL activo · {dom.dnsVerifiedAt ? 'Verificado' : 'Activo'}</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pendiente de propagación DNS CNAME</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {dom.status !== 'active' && (
                  <button
                    type="button"
                    onClick={() => handleVerifyDomain(dom.id)}
                    disabled={isVerifying}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? 'Verificando DNS...' : 'Verificar DNS Ahora'}</span>
                  </button>
                )}

                {!dom.isPrimary && dom.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(dom.id)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
                  >
                    Hacer Principal
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Custom Domain Wizard Assistant */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Asistente para Conectar Dominio Propio</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Usa tu propio dominio (ej: <code className="text-cyan-700 dark:text-cyan-300 font-mono font-bold">padelsanmateo.es</code> o <code className="text-cyan-700 dark:text-cyan-300 font-mono font-bold">reservas.miclub.com</code>) para una experiencia 100% de marca blanca.
          </p>
        </div>

        <form onSubmit={handleAddCustomDomain} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newHostname}
            onChange={(e) => setNewHostname(e.target.value)}
            placeholder="ejemplo: padelsanmateo.es"
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <span>Añadir Dominio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DNS Instructions Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-3">
          <div className="font-bold text-slate-900 dark:text-slate-200">
            Instrucciones de Configuración DNS en tu Registrador (GoDaddy, Nominalia, Cloudflare, DonDominio):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-sans font-semibold">Tipo de Registro:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">CNAME</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-sans font-semibold">Nombre / Host:</span>
              <span className="text-slate-900 dark:text-white font-bold">@ o www</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-sans font-semibold">Valor Destino (Vercel):</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">cname.vercel-dns.com</span>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
            Una vez creado el registro DNS, haz clic en "Verificar DNS Ahora". Vercel y Setmio aprovisionarán automáticamente el certificado SSL Let's Encrypt en cuestión de minutos.
          </p>
        </div>
      </div>
    </div>
  );
};
