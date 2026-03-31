import { NodeData, ResourceType } from './types';

export const INITIAL_MONEY = 10000000;
export const LOAN_AMOUNT = 2000000;
export const LOAN_INTEREST_RATE = 0.01; // 1% per tick

export interface NodeTemplate {
  type: string;
  label: string;
  cost: number;
  upkeepCost: number;
  pollution: number;
  powerRequired: number;
  capacity?: Partial<Record<ResourceType, number>>;
  outputRate?: Partial<Record<ResourceType, number>>;
  inputRequirements?: Partial<Record<ResourceType, number>>;
  color: string;
  category: 'Power' | 'Factories' | 'Logistics' | 'Population' | 'Facilities' | 'Resource';
  resourceDraw?: number;
}

export const NODE_TEMPLATES: Record<string, NodeTemplate> = {
  // Power
  'coal-power': {
    type: 'coal-power',
    label: 'Coal Power Plant',
    cost: 500000,
    upkeepCost: 5000,
    pollution: 20,
    powerRequired: 0,
    inputRequirements: { 'Coal': 2 },
    outputRate: { 'Power': 100 },
    color: 'bg-yellow-500',
    category: 'Power',
    resourceDraw: 0,
  },
  'oil-power': {
    type: 'oil-power',
    label: 'Oil Power Plant',
    cost: 1200000,
    upkeepCost: 12000,
    pollution: 15,
    powerRequired: 0,
    inputRequirements: { 'Oil': 3 },
    outputRate: { 'Power': 250 },
    color: 'bg-yellow-600',
    category: 'Power',
    resourceDraw: 0,
  },
  'solar-farm': {
    type: 'solar-farm',
    label: 'Solar Farm',
    cost: 3000000,
    upkeepCost: 2000,
    pollution: 0,
    powerRequired: 0,
    outputRate: { 'Power': 50 },
    color: 'bg-yellow-400',
    category: 'Power',
    resourceDraw: 0,
  },
  'substation': {
    type: 'substation',
    label: 'Substation',
    cost: 100000,
    upkeepCost: 500,
    pollution: 0,
    powerRequired: 5,
    color: 'bg-yellow-700',
    category: 'Power',
    resourceDraw: 0,
  },
  
  // Factories
  'farm': {
    type: 'farm',
    label: 'Farm',
    cost: 800000,
    upkeepCost: 3000,
    pollution: 2,
    powerRequired: 10,
    outputRate: { 'Food': 5 },
    color: 'bg-orange-400',
    category: 'Factories',
  },
  'processing-plant': {
    type: 'processing-plant',
    label: 'Processing Plant',
    cost: 1500000,
    upkeepCost: 10000,
    pollution: 25,
    powerRequired: 50,
    inputRequirements: { 'Minerals': 2, 'Wood': 2 },
    outputRate: { 'Processed Goods': 5 },
    color: 'bg-orange-600',
    category: 'Factories',
  },
  'waste-treatment': {
    type: 'waste-treatment',
    label: 'Waste Treatment',
    cost: 2000000,
    upkeepCost: 15000,
    pollution: -50, // Reduces global pollution
    powerRequired: 80,
    inputRequirements: { 'Waste': 10 },
    color: 'bg-orange-800',
    category: 'Factories',
  },
  
  // Logistics
  'warehouse': {
    type: 'warehouse',
    label: 'Warehouse',
    cost: 400000,
    upkeepCost: 2000,
    pollution: 1,
    powerRequired: 10,
    capacity: { 'Processed Goods': 500, 'Food': 500, 'Wood': 500, 'Minerals': 500, 'Coal': 500, 'Oil': 500 },
    color: 'bg-blue-500',
    category: 'Logistics',
  },
  'store': {
    type: 'store',
    label: 'Store',
    cost: 600000,
    upkeepCost: 4000,
    pollution: 2,
    powerRequired: 20,
    inputRequirements: { 'Processed Goods': 2, 'Food': 2 },
    color: 'bg-blue-600',
    category: 'Logistics',
  },
  
  // Population
  'residential': {
    type: 'residential',
    label: 'Residential Zone',
    cost: 1000000,
    upkeepCost: 1000,
    pollution: 5,
    powerRequired: 30,
    inputRequirements: { 'Processed Goods': 1, 'Food': 1, 'Water': 1 },
    outputRate: { 'Waste': 1 },
    color: 'bg-purple-500',
    category: 'Population',
  },
  
  // Facilities
  'city-hall': {
    type: 'city-hall',
    label: 'City Hall',
    cost: 0,
    upkeepCost: 5000,
    pollution: 0,
    powerRequired: 50,
    color: 'bg-slate-800',
    category: 'Facilities',
  },
  'airport': {
    type: 'airport',
    label: 'Airport',
    cost: 5000000,
    upkeepCost: 50000,
    pollution: 30,
    powerRequired: 150,
    color: 'bg-slate-600',
    category: 'Facilities',
  },
  'hospital': {
    type: 'hospital',
    label: 'Hospital',
    cost: 4000000,
    upkeepCost: 30000,
    pollution: 0,
    powerRequired: 100,
    color: 'bg-red-500',
    category: 'Facilities',
  },
  
  // Resources (Not buildable)
  'forest': {
    type: 'forest',
    label: 'Forest',
    cost: 0,
    upkeepCost: 0,
    pollution: -10,
    powerRequired: 0,
    outputRate: { 'Wood': 2 },
    color: 'bg-green-600',
    category: 'Resource',
  },
  'quarry': {
    type: 'quarry',
    label: 'Quarry',
    cost: 0,
    upkeepCost: 0,
    pollution: 10,
    powerRequired: 0,
    outputRate: { 'Minerals': 2 },
    color: 'bg-stone-600',
    category: 'Resource',
  },
  'water-source': {
    type: 'water-source',
    label: 'Water Source',
    cost: 0,
    upkeepCost: 0,
    pollution: 0,
    powerRequired: 0,
    outputRate: { 'Water': 5 },
    color: 'bg-cyan-500',
    category: 'Resource',
  },
  'coal-deposit': {
    type: 'coal-deposit',
    label: 'Coal Deposit',
    cost: 0,
    upkeepCost: 0,
    pollution: 15,
    powerRequired: 0,
    outputRate: { 'Coal': 3 },
    color: 'bg-gray-800',
    category: 'Resource',
  },
  'oil-reserve': {
    type: 'oil-reserve',
    label: 'Oil Reserve',
    cost: 0,
    upkeepCost: 0,
    pollution: 20,
    powerRequired: 0,
    outputRate: { 'Oil': 3 },
    color: 'bg-black',
    category: 'Resource',
  },
};
