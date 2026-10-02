import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, Zap, Shield, ArrowRight } from 'lucide-react';

interface SetmioCorporateLoaderProps {
  onComplete: () => void;
}

export const SetmioCorporateLoader: React.FC<SetmioCorporateLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingPhrase, setLoadingPhrase] = useState('Iniciando infraestructura de pádel en la nube...');

  useEffect(() => {
    const phrases = [
      'Preparando tu espacio de pádel...',
      'Conectando reservas, escuela y comunidad...',
      'Activando tu experiencia Setmio...',
      'Todo listo para jugar mejor...',
    ];

    let currentPhraseIdx = 0;
    const phraseInterval = setInterval(() => {
      currentPhraseIdx = (currentPhraseIdx + 1) % phrases.length;
      setLoadingPhrase(phrases[currentPhraseIdx]);
    }, 450);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 6;
      });
    }, 60);

    const finishTimeout = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(progressInterval);
      clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-slate-950 text-white select-none transition-opacity duration-300"
        aria-label="Cargando Setmio"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.25),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(6,182,212,0.18),transparent_50%)] pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        {/* Animated Setmio Sport Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-900 p-0.5 shadow-2xl shadow-emerald-500/30 flex items-center justify-center animate-bounce duration-1000">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <span className="text-3xl font-black tracking-tighter text-emerald-400 font-mono">S</span>
            </div>
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-lime-400 ring-4 ring-slate-950 animate-ping" />
        </div>

        {/* Setmio Brand Typography */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase border border-emerald-500/30">
            <Sparkles className="w-3 h-3" />
            <span>La nueva experiencia del pádel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            SETMIO <span className="text-emerald-400">PADEL</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Web, gestión y comunidad para profesionales del pádel
          </p>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full space-y-2 pt-2">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 transition-all duration-150 ease-out shadow-sm shadow-emerald-400/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="truncate pr-2">{loadingPhrase}</span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>
        </div>

        {/* Skip button for instant entrance */}
        <button
          onClick={onComplete}
          className="text-xs text-slate-500 hover:text-white transition flex items-center gap-1 pt-2"
        >
          <span>Acceso inmediato</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
