import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../types';
import { Zap, AlertCircle, CheckCircle2, Trash2, Droplets, Users, Play, Pause } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useGameStore } from '../store';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CustomNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const { label, type, isActive, hasPower, inventory, capacity, color, isResourceNode, inputRequirements, outputRate, isManuallyPaused } = data;
  const removeNode = useGameStore((state) => state.removeNode);
  const toggleNodePause = useGameStore((state) => state.toggleNodePause);

  const getStatusIcon = () => {
    if (isManuallyPaused) return <Pause className="w-4 h-4 text-yellow-500" title="Paused" />;
    if (!hasPower && data.powerRequired > 0) return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" title="No Power" />;
    if (!data.hasLabor && data.laborRequired > 0) return <Users className="w-4 h-4 text-blue-400 animate-pulse" title="No Labor" />;
    if (!data.hasWater && (data.inputRequirements?.['Water'] || 0) > 0) return <Droplets className="w-4 h-4 text-cyan-400 animate-pulse" title="No Water" />;
    if (!isActive) return <AlertCircle className="w-4 h-4 text-red-500" title="Inactive" />;
    return <CheckCircle2 className="w-4 h-4 text-green-500" title="Active" />;
  };

  const getTargetTooltip = () => {
    if (!inputRequirements || Object.keys(inputRequirements).length === 0) return "No inputs required";
    return `Accepts: ${Object.keys(inputRequirements).join(', ')}`;
  };

  const getSourceTooltip = () => {
    if (!outputRate || Object.keys(outputRate).length === 0) return "No outputs";
    return `Produces: ${Object.keys(outputRate).join(', ')}`;
  };

  return (
    <div className={cn(
      "min-w-[200px] bg-slate-900 rounded-2xl shadow-2xl border-2 transition-all duration-200",
      selected ? "border-blue-500 scale-105" : "border-slate-800",
      !isActive && "opacity-80"
    )}>
      <div className={cn("px-4 py-2 rounded-t-2xl flex items-center justify-between text-white font-bold text-sm", color)}>
        <span className="truncate">{label}</span>
        <div className="flex items-center gap-2">
          {!isResourceNode && type !== 'city-hall' && (
            <>
              {type === 'residential' ? (
                // Housing: Start button only (shows when paused)
                isManuallyPaused && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNodePause(id);
                    }}
                    className="p-1 bg-green-600/50 hover:bg-green-600 rounded-md transition-colors text-white"
                    title="Start Node"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                )
              ) : (
                // Others: Pause/Start toggle
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNodePause(id);
                  }}
                  className={cn(
                    "p-1 rounded-md transition-colors text-white",
                    isManuallyPaused ? "bg-green-600/50 hover:bg-green-600" : "bg-yellow-600/50 hover:bg-yellow-600"
                  )}
                  title={isManuallyPaused ? "Start Node" : "Pause Node"}
                >
                  {isManuallyPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
                </button>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(id);
                }}
                className="p-1 hover:bg-black/20 rounded-md transition-colors text-white/50 hover:text-white"
                title="Remove Node"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Status</span>
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span className={cn(
              isActive ? "text-green-400" : "text-red-400"
            )}>
              {isActive ? "Active" : "Inactive"}
            </span>
            {isActive && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
          </div>
        </div>

        {data.statusMessage && (
          <div className="text-[10px] text-red-400 font-bold bg-red-900/20 p-2 rounded-lg border border-red-900/30">
            {data.statusMessage}
          </div>
        )}

        {type === 'residential' && (
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/50">
            <span className="text-slate-500 uppercase tracking-tighter">City Hall Link</span>
            <span className={cn(
              "font-bold",
              isActive ? "text-blue-400" : "text-red-400"
            )}>
              {isActive ? "Connected" : "Disconnected"}
            </span>
          </div>
        )}

        {Object.entries(data.inputRequirements || {}).length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Requirements</span>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(data.inputRequirements || {}).map(([res, amount]) => {
                if (res === 'Power' || res === 'Water' || res === 'Labor') return null;
                return (
                  <div key={res} className="flex items-center justify-between text-[11px] bg-slate-800/30 px-2 py-1 rounded-lg">
                    <span className="text-slate-500">{res}</span>
                    <span className="font-mono text-slate-400">Req: {amount}/s</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {Object.entries(inventory).length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Inventory</span>
              <span className="text-[9px] text-slate-500 italic">Rate: {data.transferRate || 10}/s</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(inventory).map(([res, amount]) => (
                <div key={res} className="flex items-center justify-between text-[11px] bg-slate-800/50 px-2 py-1 rounded-lg">
                  <span className="text-slate-400">{res}</span>
                  <div className="flex flex-col items-end">
                    <span className="font-mono font-bold text-slate-200">
                      {Math.floor(amount || 0)}
                      <span className="text-slate-600 ml-1">/ {capacity[res as any] || 100}</span>
                    </span>
                    {data.inputRequirements?.[res as any] && (
                      <span className="text-[8px] text-red-400/70 font-bold">Req: {data.inputRequirements[res as any]}/sec</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.powerRequired > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Power Required</span>
            <span className="font-mono font-bold text-slate-300">{data.powerRequired} MW</span>
          </div>
        )}

        {(data.inputRequirements?.['Water'] || 0) > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Water Required</span>
            <span className="font-mono font-bold text-cyan-400">{data.inputRequirements?.['Water']} units</span>
          </div>
        )}

        {(data.resourceDraw || 0) > 0 && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
            <span className="text-slate-500">Resource Flow</span>
            <span className="font-mono font-bold text-blue-400">
              {Math.round(data.resourceDraw || 0)} units/sec
            </span>
          </div>
        )}
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-6 h-6 bg-blue-500 border-2 border-slate-900 hover:scale-125 transition-transform"
        title={getTargetTooltip()}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-6 h-6 bg-blue-600 border-2 border-slate-900 hover:scale-125 transition-transform"
        title={getSourceTooltip()}
      />
    </div>
  );
};

export default memo(CustomNode);
