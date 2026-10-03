import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Trophy, Zap, ArrowRight } from 'lucide-react';

interface BrandSplashScreenProps {
  onComplete: () => void;
}

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({ onComplete }) => {
  const { currentTenant, currentUser, setCurrentView } = useApp();
  const [progress, setProgress] = useState(0);
  const [animationStep, setAnimationStep] = useState<'intro' | 'court' | 'bounce' | 'ready'>('intro');

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep('court'), 400);
    const timer2 = setTimeout(() => setAnimationStep('bounce'), 900);
    const timer3 = setTimeout(() => setAnimationStep('ready'), 1700);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 70);

    const finishTimer = setTimeout(() => {
      handleFinish();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(finishTimer);
      clearInterval(interval);
    };
  }, []);

  const handleFinish = () => {
    // If the user has an active session (not anonymous guest), route directly to their private role view!
    if (currentUser) {
      if (currentUser.role === 'PLAYER') {
        setCurrentView('player');
      } else if (currentUser.role === 'SUPERADMIN') {
        setCurrentView('hq');
      } else if (currentUser.role === 'COACH') {
        setCurrentView('coach');
      } else {
        setCurrentView('admin');
      }
    } else {
      setCurrentView('public');
    }
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none transition-opacity duration-500"
      aria-label="Animación de bienvenida Setmio Pádel"
    >
      {/* Background court lights ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.22),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.15),transparent_40%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Brand Logo & Name */}
        <div className="mb-6 transform transition-all duration-700">
          {currentTenant.branding.logoUrl ? (
            <img
              src={currentTenant.branding.logoUrl}
              alt={currentTenant.name}
              className="w-20 h-20 rounded-3xl object-contain bg-white/10 p-2 border border-emerald-500/30 shadow-2xl shadow-emerald-950/80 mb-3 mx-auto"
            />
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-emerald-500/30 mb-3 mx-auto border border-emerald-400/40 animate-pulse">
              SM
            </div>
          )}
          <h1 className="text-2xl font-black tracking-tight text-white">{currentTenant.name}</h1>
          <p className="text-xs font-semibold text-emerald-400 mt-1 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Setmio Pádel Pro Platform</span>
          </p>
        </div>

        {/* Dynamic Animated Padel Court & Ball */}
        <div className="relative w-64 h-36 my-4 bg-emerald-950/50 rounded-2xl border-2 border-emerald-500/50 overflow-hidden shadow-2xl shadow-emerald-950/80">
          {/* Glass Wall Indicators */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <div className="absolute inset-y-0 left-0 w-1.5 bg-cyan-400/60" />
          <div className="absolute inset-y-0 right-0 w-1.5 bg-cyan-400/60" />

          {/* Service Boxes & Lines */}
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/70 -translate-x-1/2 flex items-center justify-center">
            {/* Center Net */}
            <div className="w-1 h-full bg-white shadow-[0_0_6px_#fff]" />
          </div>
          <div className="absolute inset-x-8 top-1/2 h-0.5 bg-white/40 -translate-y-1/2" />
          <div className="absolute top-4 bottom-4 left-14 w-0.5 bg-white/40" />
          <div className="absolute top-4 bottom-4 right-14 w-0.5 bg-white/40" />

          {/* Animated Padel Ball with motion glow */}
          <div
            className={`absolute w-4 h-4 rounded-full bg-lime-400 shadow-[0_0_15px_#a3e635,0_0_30px_#65a30d] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              animationStep === 'intro'
                ? 'top-8 left-8 scale-75 opacity-0'
                : animationStep === 'court'
                ? 'top-10 left-16 scale-100 opacity-100'
                : animationStep === 'bounce'
                ? 'top-24 left-44 scale-125 opacity-100'
                : 'top-16 left-32 scale-110 opacity-100'
            }`}
          >
            {/* Ball Seam curve */}
            <div className="absolute inset-0.5 rounded-full border border-lime-700/60" />
          </div>

          {/* Shockwave ripple on impact */}
          {animationStep === 'bounce' && (
            <div className="absolute top-24 left-44 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime-400/80 animate-ping pointer-events-none" />
          )}

          {/* Racket Motion Silhouette */}
          <div className="absolute bottom-2 right-4 text-emerald-400/40 text-[10px] font-mono tracking-wider font-bold">
            PRO COURT #1
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full mt-4 space-y-2">
          <div className="w-full bg-slate-900 border border-slate-800 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <Zap className="w-3 h-3 text-lime-400" />
              <span>Conectando con el club...</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={handleFinish}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md transition border border-white/10"
        >
          <span>Acceder ahora</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
