import React from 'react';
import { useGameStore } from '../store';
import { Zap, Heart, Play, Pause, RotateCcw, DollarSign } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HUD = () => {
  const { 
    money, 
    comfort, 
    powerProduced, 
    powerConsumed, 
    isPaused, 
    togglePause, 
    resetGame,
    tick,
    loansTaken,
    takeLoan
  } = useGameStore();

  const powerRatio = powerProduced >= powerConsumed ? 1 : powerProduced / powerConsumed;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Money Display */}
        <div className="flex-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 shadow-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-900/30 rounded-2xl flex items-center justify-center text-green-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Global Money</span>
            <div className={cn(
              "text-2xl font-black tracking-tighter",
              money >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {money.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Comfort Display */}
        <div className="flex-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 shadow-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-red-900/30 rounded-2xl flex items-center justify-center text-red-400">
            <Heart className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Comfort</span>
              <span className="text-xs font-black text-red-400">{Math.round(comfort)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  comfort > 70 ? "bg-green-500" : comfort > 40 ? "bg-yellow-500" : "bg-red-500"
                )}
                style={{ width: `${comfort}%` }}
              />
            </div>
          </div>
        </div>

        {/* Power Display */}
        <div className="flex-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 shadow-2xl flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center",
            powerRatio >= 1 ? "bg-yellow-900/30 text-yellow-400" : "bg-red-900/30 text-red-400"
          )}>
            <Zap className={cn("w-6 h-6", powerRatio < 1 && "animate-pulse")} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Power Grid</span>
              <span className="text-xs font-black text-yellow-400">{Math.round(powerRatio * 100)}%</span>
            </div>
            <div className="text-xs font-bold text-slate-400">
              {powerConsumed} / {powerProduced} MW
            </div>
          </div>
        </div>

        {/* Loan Button */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-2 shadow-2xl flex items-center gap-2">
          <button
            disabled={loansTaken >= 3}
            onClick={takeLoan}
            className={cn(
              "px-4 py-3 rounded-2xl font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 min-w-[100px]",
              loansTaken < 3 
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20" 
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
          >
            <span className="uppercase tracking-tighter">Take Loan</span>
            <span className="text-[10px] opacity-70">{loansTaken}/3 Used</span>
          </button>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 shadow-2xl flex items-center gap-2">
          <button
            onClick={togglePause}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              isPaused ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            )}
          >
            {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
          </button>
          <button
            onClick={resetGame}
            className="w-12 h-12 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Tick Counter */}
      <div className="mt-4 flex justify-center">
        <div className="bg-slate-900/80 backdrop-blur-sm text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-slate-700">
          Simulation Tick: {tick}
        </div>
      </div>
    </div>
  );
};

export default HUD;
