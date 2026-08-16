import React from 'react';
import { CloudSun, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  unit: 'C' | 'F';
  onToggleUnit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ unit, onToggleUnit }) => {
  return (
    <header id="app-header" className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl shadow-inner flex items-center justify-center backdrop-blur-md">
          <CloudSun className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              Weather<span className="text-blue-500">Intelligence</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">
            Precision Forecasting • Open-Meteo System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white/5 border border-white/10 p-1 rounded-full backdrop-blur-md flex items-center text-xs font-medium text-slate-300">
          <button
            id="unit-toggle-c"
            type="button"
            onClick={() => unit !== 'C' && onToggleUnit()}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              unit === 'C'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            id="unit-toggle-f"
            type="button"
            onClick={() => unit !== 'F' && onToggleUnit()}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              unit === 'F'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
};

