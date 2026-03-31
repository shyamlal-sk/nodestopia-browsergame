import { Node, Edge } from 'reactflow';

export type ResourceType = 'Wood' | 'Minerals' | 'Water' | 'Coal' | 'Oil' | 'Food' | 'Processed Goods' | 'Power' | 'Waste' | 'Labor';

export interface NodeData {
  label: string;
  type: string;
  isActive: boolean;
  upkeepCost: number;
  pollution: number;
  inventory: Partial<Record<ResourceType, number>>;
  capacity: Partial<Record<ResourceType, number>>;
  efficiency: number;
  powerRequired: number;
  laborRequired: number;
  laborProduced: number;
  hasPower: boolean;
  hasLabor: boolean;
  hasWater: boolean;
  statusMessage?: string;
  transferRate?: number;
  color: string;
  category: 'Power' | 'Factories' | 'Logistics' | 'Population' | 'Facilities' | 'Resource';
  outputRate?: Partial<Record<ResourceType, number>>;
  inputRequirements?: Partial<Record<ResourceType, number>>;
  isResourceNode?: boolean;
  isSubstation?: boolean;
  resourceDraw?: number;
  isManuallyPaused?: boolean;
}

export type GameNode = Node<NodeData>;
export type GameEdge = Edge;

export interface GameState {
  money: number;
  comfort: number;
  powerProduced: number;
  powerConsumed: number;
  waterProduced: number;
  waterConsumed: number;
  laborProduced: number;
  laborRequired: number;
  netIncome: number;
  loansTaken: number;
  isPaused: boolean;
  tick: number;
  nodes: GameNode[];
  edges: GameEdge[];
  
  // Actions
  setNodes: (nodes: GameNode[]) => void;
  setEdges: (edges: GameEdge[]) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onReconnect: (oldEdge: any, newConnection: any) => void;
  deleteEdge: (id: string) => void;
  
  addNode: (type: string, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  takeLoan: () => void;
  togglePause: () => void;
  resetGame: () => void;
  runTick: () => void;
  layoutNodes: () => void;
  toggleNodePause: (id: string) => void;
}
