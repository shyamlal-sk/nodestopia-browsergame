import { Node, Edge } from 'reactflow';

export type ResourceType = 'Wood' | 'Minerals' | 'Water' | 'Coal' | 'Oil' | 'Food' | 'Processed Goods' | 'Power' | 'Waste';

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
  hasPower: boolean;
  color: string;
  outputRate?: Partial<Record<ResourceType, number>>;
  inputRequirements?: Partial<Record<ResourceType, number>>;
  isResourceNode?: boolean;
}

export type GameNode = Node<NodeData>;
export type GameEdge = Edge;

export interface GameState {
  money: number;
  comfort: number;
  powerProduced: number;
  powerConsumed: number;
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
  
  addNode: (type: string, position: { x: number; y: number }) => void;
  takeLoan: () => void;
  togglePause: () => void;
  resetGame: () => void;
  runTick: () => void;
}
