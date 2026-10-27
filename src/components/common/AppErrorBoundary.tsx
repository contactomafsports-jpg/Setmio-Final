import React from 'react';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[v0] Application surface error:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-white px-6 py-16 text-[#0B1A2D] dark:bg-[#0B1A2D] dark:text-white">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-[#1A314D] dark:bg-[#0E2239]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Setmio HQ</p>
          <h1 className="mt-3 text-2xl font-black">No hemos podido cargar este panel</h1>
          <p className="mt-3 text-sm leading-6 text-[#64748B] dark:text-slate-300">Recarga la vista para reintentar. Si el problema continúa, vuelve al espacio anterior.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-[#0B1A2D] px-4 py-3 text-sm font-bold text-white hover:bg-[#162c47]">Reintentar</button>
        </div>
      </main>
    );
  }
}
