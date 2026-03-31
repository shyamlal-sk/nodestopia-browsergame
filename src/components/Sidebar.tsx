import React, { useState } from 'react';
import { useGameStore } from '../store';
import { NODE_TEMPLATES } from '../constants';
import { 
  Zap, 
  Factory, 
  Truck, 
  Users, 
  Building2, 
  DollarSign, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORY_ICONS = {
  Power: Zap,
  Factories: Factory,
  Logistics: Truck,
  Population: Users,
  Facilities: Building2,
};

const Sidebar = () => {
  const { money, addNode } = useGameStore();
  const [openCategory, setOpenCategory] = useState<string | null>('Power');

  const categories = ['Power', 'Factories', 'Logistics', 'Population', 'Facilities'];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 h-full bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col shadow-2xl z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">N</div>
          NODESTOPIA
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">City Simulation Engine</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
          const isOpen = openCategory === category;
          const items = Object.values(NODE_TEMPLATES).filter(t => t.category === category);

          return (
            <div key={category} className="border border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-slate-900">
              <button
                onClick={() => setOpenCategory(isOpen ? null : category)}
                className={cn(
                  "w-full px-4 py-3 flex items-center justify-between transition-colors",
                  isOpen ? "bg-slate-800" : "hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isOpen ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-200">{category}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {isOpen && (
                <div className="p-3 grid grid-cols-1 gap-2 bg-slate-900/50">
                  {items.map((item) => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.type)}
                      className={cn(
                        "group p-3 rounded-xl border border-slate-800 bg-slate-900 cursor-grab active:cursor-grabbing hover:border-blue-500 hover:bg-slate-800 transition-all",
                        money < item.cost && "opacity-50 grayscale cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-200">{item.label}</span>
                        <div className={cn("w-2 h-2 rounded-full", item.color)} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-green-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {item.cost.toLocaleString()}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {item.powerRequired} MW
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
