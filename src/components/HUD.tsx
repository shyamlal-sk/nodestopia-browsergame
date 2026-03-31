import React from 'react';
import { useGameStore } from '../store';
import { Zap, Heart, Play, Pause, RotateCcw, DollarSign, Clock, LayoutGrid, Droplets, Users, TrendingUp, TrendingDown, ShieldCheck, ShieldAlert } from 'lucide-react';
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
    waterProduced,
    waterConsumed,
    laborProduced,
    laborRequired,
    isPaused, 
    togglePause, 
    resetGame,
    tick,
    loansTaken,
    takeLoan,
    layoutNodes,
    netIncome
  } = useGameStore();

  const powerRatio = powerProduced >= powerConsumed ? 1 : powerProduced / powerConsumed;
  const waterRatio = waterProduced >= waterConsumed ? 1 : waterProduced / waterConsumed;
  const laborRatio = laborProduced >= laborRequired ? 1 : laborProduced / laborRequired;
  
  const isStable = powerRatio >= 1 && waterRatio >= 1 && laborRatio >= 1 && netIncome > 0;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[98%] max-w-[1400px] z-50 pointer-events-none">
      <div className="flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
        {/* Stability Indicator */}
        <div className={cn(
          "bg-slate-900/90 backdrop-blur-md border rounded-2xl p-2 shadow-2xl flex items-center gap-2 min-w-[120px] transition-all duration-500",
          isStable ? "border-green-500/50" : "border-red-500/50"
        )}>
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center",
            isStable ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
          )}>
            {isStable ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5 animate-pulse" />}
          </div>
          <div className="space-y-0">
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Stability</span>
            <div className={cn(
              "text-[10px] font-black uppercase tracking-tighter",
              isStable ? "text-green-400" : "text-red-400"
            )}>
              {isStable ? "Stable" : "Unstable"}
            </div>
          </div>
        </div>

        {/* Money Display */}
        <div className="flex-1 min-w-[180px] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-green-900/30 rounded-xl flex items-center justify-center text-green-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="space-y-0 flex-1">
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Global Money</span>
            <div className="flex items-center justify-between">
              <div className={cn(
                "text-lg font-black tracking-tighter",
                money >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {money.toLocaleString()}
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                netIncome >= 0 ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
              )}>
                {netIncome >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {Math.abs(netIncome).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Comfort Display */}
        <div className="flex-1 min-w-[140px] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-red-900/30 rounded-xl flex items-center justify-center text-red-400">
            <Heart className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Comfort</span>
              <span className="text-[10px] font-black text-red-400">{Math.round(comfort)}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
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
        <div className="flex-1 min-w-[120px] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-2xl flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            powerRatio >= 1 ? "bg-yellow-900/30 text-yellow-400" : "bg-red-900/30 text-red-400"
          )}>
            <Zap className={cn("w-5 h-5", powerRatio < 1 && "animate-pulse")} />
          </div>
          <div className="flex-1 space-y-0">
            <div className="flex items-center justify-between">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Power</span>
              <span className="text-[10px] font-black text-yellow-400">{Math.round(powerRatio * 100)}%</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400">
              {powerConsumed}/{powerProduced}
            </div>
          </div>
        </div>

        {/* Water Display */}
        <div className="flex-1 min-w-[120px] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-2xl flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            waterRatio >= 1 ? "bg-cyan-900/30 text-cyan-400" : "bg-red-900/30 text-red-400"
          )}>
            <Droplets className={cn("w-5 h-5", waterRatio < 1 && "animate-pulse")} />
          </div>
          <div className="flex-1 space-y-0">
            <div className="flex items-center justify-between">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Water</span>
              <span className="text-[10px] font-black text-cyan-400">{Math.round(waterRatio * 100)}%</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400">
              {waterConsumed}/{waterProduced}
            </div>
          </div>
        </div>

        {/* Labor Display */}
        <div className="flex-1 min-w-[120px] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-2xl flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            laborRatio >= 1 ? "bg-blue-900/30 text-blue-400" : "bg-red-900/30 text-red-400"
          )}>
            <Users className={cn("w-5 h-5", laborRatio < 1 && "animate-pulse")} />
          </div>
          <div className="flex-1 space-y-0">
            <div className="flex items-center justify-between">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Labor</span>
              <span className="text-[10px] font-black text-blue-400">{Math.round(laborRatio * 100)}%</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400">
              {laborRequired}/{Math.round(laborProduced)}
            </div>
          </div>
        </div>

        {/* Time Display */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-2xl flex items-center gap-3 min-w-[110px]">
          <div className="w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-0">
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black">Time</span>
            <div className="text-lg font-black text-blue-400 flex items-center gap-1.5">
              {String(Math.floor(tick % 24)).padStart(2, '0')}:00
              {!isPaused && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
            </div>
          </div>
        </div>

        {/* Loan Button */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 shadow-2xl flex items-center gap-2">
          <button
            disabled={loansTaken >= 3}
            onClick={takeLoan}
            className={cn(
              "px-3 py-2 rounded-xl font-bold text-[10px] transition-all flex flex-col items-center justify-center gap-0.5 min-w-[80px]",
              loansTaken < 3 
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20" 
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
          >
            <span className="uppercase tracking-tighter">Take Loan</span>
            <span className="text-[8px] opacity-70">{loansTaken}/3</span>
          </button>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1.5">
          <button
            onClick={layoutNodes}
            className="w-10 h-10 bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
            title="Tidy Up Layout"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={togglePause}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              isPaused ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            )}
          >
            {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
          </button>
          <button
            onClick={resetGame}
            className="w-10 h-10 bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HUD;
