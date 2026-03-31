import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge, Connection, EdgeChange, NodeChange, reconnectEdge } from 'reactflow';
import { GameState, GameNode, GameEdge, ResourceType } from './types';
import { INITIAL_MONEY, LOAN_AMOUNT, LOAN_INTEREST_RATE, NODE_TEMPLATES } from './constants';

const createInitialNodes = (): GameNode[] => {
  const nodes: GameNode[] = [
    {
      id: 'city-hall',
      type: 'city-hall',
      position: { x: 0, y: 0 },
      data: {
        ...NODE_TEMPLATES['city-hall'],
        isActive: true,
        inventory: {},
        capacity: {},
        efficiency: 1,
        hasPower: true,
      },
      dragHandle: '.drag-handle',
    },
  ];

  // Randomly scatter resource nodes
  const resourceTypes = ['forest', 'quarry', 'water-source', 'coal-deposit', 'oil-reserve'];
  for (let i = 0; i < 15; i++) {
    const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    const template = NODE_TEMPLATES[type];
    nodes.push({
      id: `resource-${i}`,
      type,
      position: {
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
      },
      data: {
        ...template,
        isActive: true,
        inventory: {},
        capacity: {},
        efficiency: 1,
        hasPower: true,
        isResourceNode: true,
      },
    });
  }

  return nodes;
};

export const useGameStore = create<GameState>((set, get) => ({
  money: INITIAL_MONEY,
  comfort: 100,
  powerProduced: 0,
  powerConsumed: 0,
  loansTaken: 0,
  isPaused: true,
  tick: 0,
  nodes: createInitialNodes(),
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as GameNode[],
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as GameEdge[],
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges) as GameEdge[],
    });
  },

  onReconnect: (oldEdge: GameEdge, newConnection: Connection) => {
    set({
      edges: reconnectEdge(oldEdge, newConnection, get().edges) as GameEdge[],
    });
  },

  deleteEdge: (id: string) => {
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
    }));
  },

  addNode: (type, position) => {
    const template = NODE_TEMPLATES[type];
    if (!template) return;

    if (get().money < template.cost) return;

    const newNode: GameNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        ...template,
        isActive: true,
        inventory: {},
        capacity: template.capacity || {},
        efficiency: 1,
        hasPower: false,
      },
      dragHandle: '.drag-handle',
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      money: state.money - template.cost,
    }));
  },

  removeNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node || node.data.isResourceNode || node.type === 'city-hall') return;

    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    }));
  },

  takeLoan: () => {
    const { loansTaken, money } = get();
    if (loansTaken >= 3) return;

    set({
      loansTaken: loansTaken + 1,
      money: money + LOAN_AMOUNT,
    });
  },

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  resetGame: () => {
    set({
      money: INITIAL_MONEY,
      comfort: 100,
      powerProduced: 0,
      powerConsumed: 0,
      loansTaken: 0,
      isPaused: true,
      tick: 0,
      nodes: createInitialNodes(),
      edges: [],
    });
  },

  runTick: () => {
    const state = get();
    if (state.isPaused) return;

    const newNodes = [...state.nodes];
    let totalPowerProduced = 0;
    let totalPowerConsumed = 0;
    let totalUpkeep = 0;
    let totalPollution = 0;
    let revenue = 0;

    // 1. Calculate Power and Upkeep
    newNodes.forEach((node) => {
      const data = node.data;
      data.resourceDraw = 0; // Reset draw
      totalUpkeep += data.upkeepCost;
      totalPollution += data.pollution;

      if (data.outputRate?.['Power']) {
        let hasInputs = true;
        if (data.inputRequirements) {
          Object.entries(data.inputRequirements).forEach(([res, amount]) => {
            if ((data.inventory[res as ResourceType] || 0) < amount) {
              hasInputs = false;
            }
          });
        }

        if (hasInputs) {
          totalPowerProduced += data.outputRate['Power']!;
          if (data.inputRequirements) {
            Object.entries(data.inputRequirements).forEach(([res, amount]) => {
              data.inventory[res as ResourceType] = (data.inventory[res as ResourceType] || 0) - amount;
            });
          }
        }
      }
      totalPowerConsumed += data.powerRequired;
    });

    // 2. Distribute Power (Connection-based BFS)
    const poweredNodeIds = new Set<string>();
    const powerSources = newNodes.filter(n => n.data.outputRate?.['Power']);
    
    powerSources.forEach(source => {
      const queue = [source.id];
      const visited = new Set([source.id]);
      poweredNodeIds.add(source.id);

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        state.edges.forEach(edge => {
          let nextId = null;
          if (edge.source === currentId) nextId = edge.target;
          else if (edge.target === currentId) nextId = edge.source;

          if (nextId && !visited.has(nextId)) {
            visited.add(nextId);
            poweredNodeIds.add(nextId);
            queue.push(nextId);
          }
        });
      }
    });

    const powerRatio = totalPowerProduced >= totalPowerConsumed ? 1 : totalPowerProduced / totalPowerConsumed;
    newNodes.forEach((node) => {
      const isConnectedToPower = poweredNodeIds.has(node.id);
      node.data.hasPower = isConnectedToPower && (powerRatio >= 1 || Math.random() < powerRatio);
      node.data.isActive = (node.data.powerRequired === 0 || node.data.hasPower) && state.money > 0;
      
      if (node.data.outputRate?.['Power'] && node.data.isActive) {
        node.data.resourceDraw = node.data.outputRate['Power'];
      }
    });

    // 3. Process Resources & Logistics
    state.edges.forEach((edge) => {
      const sourceNode = newNodes.find((n) => n.id === edge.source);
      const targetNode = newNodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode && sourceNode.data.isActive) {
        const outputResources = Object.keys(sourceNode.data.outputRate || {}) as ResourceType[];
        
        outputResources.forEach((res) => {
          if (res === 'Power') return;

          const amountToMove = Math.min(
            sourceNode.data.outputRate![res] || 0,
            sourceNode.data.inventory[res] || 0,
            10
          );

          if (amountToMove > 0) {
            const targetNeeds = targetNode.data.inputRequirements?.[res] || 0;
            const targetCapacity = targetNode.data.capacity?.[res] || 100;
            const targetCurrent = targetNode.data.inventory[res] || 0;

            if (targetCurrent < targetCapacity || targetNeeds > 0) {
              sourceNode.data.inventory[res] = (sourceNode.data.inventory[res] || 0) - amountToMove;
              targetNode.data.inventory[res] = (targetNode.data.inventory[res] || 0) + amountToMove;
              sourceNode.data.resourceDraw = (sourceNode.data.resourceDraw || 0) + amountToMove;
            }
          }
        });
        
        Object.entries(sourceNode.data.inventory).forEach(([res, amount]) => {
          const resource = res as ResourceType;
          if (amount > 0) {
            const targetCapacity = targetNode.data.capacity?.[resource] || 0;
            const targetCurrent = targetNode.data.inventory[resource] || 0;
            const spaceAvailable = targetCapacity - targetCurrent;
            
            if (spaceAvailable > 0) {
              const move = Math.min(amount, spaceAvailable, 5);
              sourceNode.data.inventory[resource]! -= move;
              targetNode.data.inventory[resource] = (targetNode.data.inventory[resource] || 0) + move;
              sourceNode.data.resourceDraw = (sourceNode.data.resourceDraw || 0) + move;
            }
          }
        });
      }
    });

    // 4. Node Internal Logic (Production)
    newNodes.forEach((node) => {
      const data = node.data;
      if (data.isActive && data.outputRate) {
        Object.entries(data.outputRate).forEach(([res, rate]) => {
          if (res === 'Power') return;
          const resource = res as ResourceType;
          const capacity = data.capacity[resource] || 1000;
          data.inventory[resource] = Math.min(capacity, (data.inventory[resource] || 0) + rate);
        });
      }

      // Revenue from Stores and Residential
      if (data.type === 'store' && data.isActive) {
        const goods = data.inventory['Processed Goods'] || 0;
        const food = data.inventory['Food'] || 0;
        if (goods >= 1 && food >= 1) {
          data.inventory['Processed Goods']! -= 1;
          data.inventory['Food']! -= 1;
          revenue += 5000;
        }
      }
      
      if (data.type === 'residential' && data.isActive) {
        revenue += 2000 * (state.comfort / 100);
      }
      
      if (data.type === 'airport' && data.isActive) {
        // Export logic
        // In a real game, we'd check connected warehouses
      }
    });

    // 5. Global Stats Update
    const loanInterest = state.loansTaken * LOAN_AMOUNT * LOAN_INTEREST_RATE;
    const netMoney = revenue - totalUpkeep - loanInterest;
    
    // Comfort calculation
    let newComfort = 100;
    newComfort -= totalPollution / 10;
    if (powerRatio < 1) newComfort -= (1 - powerRatio) * 50;
    newComfort = Math.max(0, Math.min(100, newComfort));

    set({
      tick: state.tick + 1,
      money: state.money + netMoney,
      comfort: newComfort,
      powerProduced: totalPowerProduced,
      powerConsumed: totalPowerConsumed,
      nodes: newNodes,
    });

    // Loss condition
    if (state.money < 0 && state.loansTaken >= 3) {
      set({ isPaused: true });
      alert('GAME OVER: Your city has gone bankrupt!');
    }
  },
}));
