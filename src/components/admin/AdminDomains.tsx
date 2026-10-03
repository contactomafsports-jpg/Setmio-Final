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
    <div className="space-y-8 text-slate-100 max-w-5xl">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          Mi Web y Mi App · Dominios & Enlaces Públicos
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Enlaces de Publicación y Dominios Propios
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Consulta y comparte las direcciones web oficiales de tu club o conecta tu propio dominio con enrutamiento inteligente gestionado en la nube.
        </p>
      </div>

      {/* Primary Links Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Public Web Link */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Web Pública del Club</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Activo
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 truncate">
            {baseUrl}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => copyToClipboard(baseUrl, 'web')}
              className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'web' ? 'Copiado' : 'Copiar URL'}</span>
            </button>
            <button
              onClick={() => setCurrentView('public')}
              className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
              title="Abrir Web Pública"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Player PWA Mobile App Link */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>App Móvil Jugador</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              PWA
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 truncate">
            {baseUrl}/app
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => copyToClipboard(`${baseUrl}/app`, 'app')}
              className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'app' ? 'Copiado' : 'Copiar URL'}</span>
            </button>
            <button
              onClick={() => setCurrentView('player')}
              className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
              title="Abrir Área Jugador"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Private Management Link */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Acceso Gestión Privada</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
              Privado
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 truncate">
            {baseUrl}/gestion
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => copyToClipboard(`${baseUrl}/gestion`, 'gestion')}
              className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'gestion' ? 'Copiado' : 'Copiar URL'}</span>
            </button>
            <button
              onClick={() => triggerDemoToast('Ya estás en Gestión', 'Te encuentras dentro del panel administrativo.', 'info')}
              className="p-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition"
              title="Ver Gestión"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Domains Table List */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Dominios Registrados para este Tenant</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cada dominio verificado enruta directamente a la base de datos de {currentTenant.name}.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {currentTenant.domains.map((dom) => (
            <div
              key={dom.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm font-mono">{dom.hostname}</span>
                  {dom.isPrimary && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-sans">
                      Principal
                    </span>
                  )}
                  {dom.isCustom ? (
                    <span className="text-[10px] font-mono text-cyan-400 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                      Dominio Propio
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">
                      Subdominio Setmio
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  {dom.status === 'active' ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conectado y SSL activo · {dom.dnsVerifiedAt ? 'Verificado' : 'Activo'}</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pendiente de propagación DNS CNAME</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {dom.status !== 'active' && (
                  <button
                    onClick={() => handleVerifyDomain(dom.id)}
                    disabled={isVerifying}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white text-xs flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? 'Verificando DNS...' : 'Verificar DNS Ahora'}</span>
                  </button>
                )}

                {!dom.isPrimary && dom.status === 'active' && (
                  <button
                    onClick={() => handleSetPrimary(dom.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition"
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
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Asistente para Conectar Dominio Propio</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Usa tu propio dominio (ej: <code className="text-cyan-300">padelsanmateo.es</code> o <code className="text-cyan-300">reservas.miclub.com</code>) para una experiencia 100% de marca blanca.
          </p>
        </div>

        <form onSubmit={handleAddCustomDomain} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newHostname}
            onChange={(e) => setNewHostname(e.target.value)}
            placeholder="ejemplo: padelsanmateo.es"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition flex items-center justify-center gap-2 shrink-0"
          >
            <span>Añadir Dominio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DNS Instructions Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
          <div className="font-semibold text-slate-200">
            Instrucciones de Configuración DNS en tu Registrador (GoDaddy, Nominalia, Cloudflare, DonDominio):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-sans">Tipo de Registro:</span>
              <span className="text-emerald-400 font-bold">CNAME</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-sans">Nombre / Host:</span>
              <span className="text-white font-bold">@ o www</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-sans">Valor Destino (Vercel):</span>
              <span className="text-cyan-400 font-bold">cname.vercel-dns.com</span>
            </div>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Una vez creado el registro DNS, haz clic en "Verificar DNS Ahora". Vercel y Setmio aprovisionarán automáticamente el certificado SSL Let's Encrypt en cuestión de minutos.
          </p>
        </div>
      </div>
    </div>
  );
};
