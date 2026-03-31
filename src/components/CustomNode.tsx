import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../types';
import { Zap, AlertCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CustomNode = ({ data, selected }: NodeProps<NodeData>) => {
  const { label, type, isActive, hasPower, inventory, capacity, color, isResourceNode, inputRequirements, outputRate } = data;

  const getStatusIcon = () => {
    if (!hasPower && data.powerRequired > 0) return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />;
    if (!isActive) return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
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
        <div className="drag-handle cursor-grab active:cursor-grabbing">
          <MoreHorizontal className="w-4 h-4 opacity-50" />
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
          </div>
        </div>

        {Object.entries(inventory).length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Inventory</span>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(inventory).map(([res, amount]) => (
                <div key={res} className="flex items-center justify-between text-[11px] bg-slate-800/50 px-2 py-1 rounded-lg">
                  <span className="text-slate-400">{res}</span>
                  <span className="font-mono font-bold text-slate-200">
                    {Math.floor(amount || 0)}
                    <span className="text-slate-600 ml-1">/ {capacity[res as any] || 100}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.powerRequired > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Power</span>
            <span className="font-mono font-bold text-slate-300">{data.powerRequired} MW</span>
          </div>
        )}
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 bg-blue-500 border-2 border-slate-900 hover:scale-125 transition-transform"
        title={getTargetTooltip()}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 bg-blue-600 border-2 border-slate-900 hover:scale-125 transition-transform"
        title={getSourceTooltip()}
      />
    </div>
  );
};

export default memo(CustomNode);
