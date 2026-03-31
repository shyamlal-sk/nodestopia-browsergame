import React from 'react';
import { useGameStore } from '../store';
import { Play, Zap, DollarSign, Heart, Info } from 'lucide-react';
import { motion } from 'motion/react';

const StartModal = () => {
  const { isPaused, togglePause, tick } = useGameStore();

  if (tick > 0 || !isPaused) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-800"
      >
        <div className="p-12 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-6xl font-black tracking-tighter text-white">
              NODESTOPIA
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">
              The Node-Based City Simulation
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-3xl space-y-3 border border-slate-800">
              <div className="w-10 h-10 bg-green-900/30 rounded-2xl flex items-center justify-center text-green-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-200">Economy</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Manage your city's budget. Upkeep costs and loans can drain your funds quickly.
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-3xl space-y-3 border border-slate-800">
              <div className="w-10 h-10 bg-yellow-900/30 rounded-2xl flex items-center justify-center text-yellow-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-200">Power</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Connect power plants to your grid. Without power, your city will grind to a halt.
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-3xl space-y-3 border border-slate-800">
              <div className="w-10 h-10 bg-red-900/30 rounded-2xl flex items-center justify-center text-red-400">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-200">Comfort</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Keep your citizens happy. Pollution and outages reduce comfort and tax revenue.
              </p>
            </div>
          </div>

          <div className="bg-blue-900/20 p-6 rounded-3xl flex items-start gap-4 border border-blue-900/30">
            <div className="w-10 h-10 bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-sm text-blue-200">How to Play</h4>
              <p className="text-xs text-blue-400/80 leading-relaxed font-medium">
                Drag nodes from the sidebar onto the canvas. Connect them using edges to transfer resources. 
                Follow the logic: <span className="font-black text-blue-200">Resource → Factory → Warehouse → Store → Home</span>.
              </p>
            </div>
          </div>

          <button
            onClick={togglePause}
            className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black text-xl shadow-2xl shadow-blue-900/30 transition-all flex items-center justify-center gap-4 group"
          >
            START SIMULATION
            <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StartModal;
