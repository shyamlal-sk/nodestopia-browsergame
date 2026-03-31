import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge, Connection, EdgeChange, NodeChange, reconnectEdge } from 'reactflow';
import dagre from 'dagre';
import { GameState, GameNode, GameEdge, ResourceType } from './types';
import { INITIAL_MONEY, LOAN_AMOUNT, LOAN_INTEREST_RATE, NODE_TEMPLATES } from './constants';

const applyDagreLayout = (nodes: GameNode[], edges: GameEdge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 200 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 150 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 100,
        y: nodeWithPosition.y - 75,
      },
    };
  });
};

const createInitialLayout = () => {
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
        hasLabor: true,
        hasWater: true,
      },
    },
    {
      id: 'init-coal-deposit',
      type: 'coal-deposit',
      position: { x: -400, y: -200 },
      data: {
        ...NODE_TEMPLATES['coal-deposit'],
        isActive: true,
        inventory: {},
        capacity: {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
        isResourceNode: true,
      },
    },
    {
      id: 'init-coal-power',
      type: 'coal-power',
      position: { x: -200, y: -200 },
      data: {
        ...NODE_TEMPLATES['coal-power'],
        isActive: true,
        inventory: { 'Coal': 30 },
        capacity: { 'Coal': 100 },
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
      },
    },
    {
      id: 'init-forest',
      type: 'forest',
      position: { x: -400, y: 200 },
      data: {
        ...NODE_TEMPLATES['forest'],
        isActive: true,
        inventory: {},
        capacity: {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
        isResourceNode: true,
      },
    },
    {
      id: 'init-processing',
      type: 'processing-plant',
      position: { x: -200, y: 200 },
      data: {
        ...NODE_TEMPLATES['processing-plant'],
        isActive: true,
        inventory: { 'Wood': 20, 'Minerals': 20 },
        capacity: { 'Wood': 100, 'Minerals': 100, 'Processed Goods': 100 },
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
      },
    },
    {
      id: 'init-warehouse',
      type: 'warehouse',
      position: { x: 100, y: 0 },
      data: {
        ...NODE_TEMPLATES['warehouse'],
        isActive: true,
        inventory: {},
        capacity: NODE_TEMPLATES['warehouse'].capacity || {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
      },
    },
    {
      id: 'init-shop',
      type: 'shop',
      position: { x: 300, y: 0 },
      data: {
        ...NODE_TEMPLATES['shop'],
        isActive: true,
        inventory: { 'Food': 50, 'Processed Goods': 50 },
        capacity: NODE_TEMPLATES['shop'].capacity || {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
      },
    },
    {
      id: 'init-residential',
      type: 'residential',
      position: { x: 500, y: 0 },
      data: {
        ...NODE_TEMPLATES['residential'],
        isActive: true,
        inventory: { 'Food': 50, 'Processed Goods': 50, 'Water': 50 },
        capacity: {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
      },
    },
    {
      id: 'init-quarry',
      type: 'quarry',
      position: { x: -400, y: 400 },
      data: {
        ...NODE_TEMPLATES['quarry'],
        isActive: true,
        inventory: {},
        capacity: {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
        isResourceNode: true,
      },
    },
    {
      id: 'init-water',
      type: 'water-source',
      position: { x: 700, y: 0 },
      data: {
        ...NODE_TEMPLATES['water-source'],
        isActive: true,
        inventory: {},
        capacity: {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
        isResourceNode: true,
      },
    },
    {
      id: 'init-farm',
      type: 'farm',
      position: { x: -200, y: 400 },
      data: {
        ...NODE_TEMPLATES['farm'],
        isActive: true,
        inventory: {},
        capacity: {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
      },
    },
    {
      id: 'init-coal-deposit-2',
      type: 'coal-deposit',
      position: { x: -400, y: -400 },
      data: {
        ...NODE_TEMPLATES['coal-deposit'],
        isActive: true,
        inventory: {},
        capacity: {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
        isResourceNode: true,
      },
    },
    {
      id: 'init-coal-power-2',
      type: 'coal-power',
      position: { x: -200, y: -400 },
      data: {
        ...NODE_TEMPLATES['coal-power'],
        isActive: true,
        inventory: { 'Coal': 10 },
        capacity: {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
      },
    },
  ];

  const edges: GameEdge[] = [
    { id: 'e-coal-to-power', source: 'init-coal-deposit', target: 'init-coal-power', animated: true, style: { stroke: '#71717a', strokeWidth: 3 } },
    { id: 'e-coal-to-power-2', source: 'init-coal-deposit-2', target: 'init-coal-power-2', animated: true, style: { stroke: '#71717a', strokeWidth: 3 } },
    { id: 'e-power-to-hall', source: 'init-coal-power', target: 'city-hall', animated: true, style: { stroke: '#eab308', strokeWidth: 3 } },
    { id: 'e-power-to-processing', source: 'init-coal-power', target: 'init-processing', animated: true, style: { stroke: '#eab308', strokeWidth: 3 } },
    { id: 'e-power-to-warehouse', source: 'init-coal-power', target: 'init-warehouse', animated: true, style: { stroke: '#eab308', strokeWidth: 3 } },
    { id: 'e-power-to-shop', source: 'init-coal-power-2', target: 'init-shop', animated: true, style: { stroke: '#eab308', strokeWidth: 3 } },
    { id: 'e-power-to-residential', source: 'init-coal-power-2', target: 'init-residential', animated: true, style: { stroke: '#eab308', strokeWidth: 3 } },
    { id: 'e-power-to-farm', source: 'init-coal-power-2', target: 'init-farm', animated: true, style: { stroke: '#eab308', strokeWidth: 3 } },
    { id: 'e-forest-to-processing', source: 'init-forest', target: 'init-processing', animated: true, style: { stroke: '#71717a', strokeWidth: 3 } },
    { id: 'e-quarry-to-processing', source: 'init-quarry', target: 'init-processing', animated: true, style: { stroke: '#71717a', strokeWidth: 3 } },
    { id: 'e-processing-to-warehouse', source: 'init-processing', target: 'init-warehouse', animated: true, style: { stroke: '#f97316', strokeWidth: 3 } },
    { id: 'e-farm-to-warehouse', source: 'init-farm', target: 'init-warehouse', animated: true, style: { stroke: '#f97316', strokeWidth: 3 } },
    { id: 'e-warehouse-to-shop', source: 'init-warehouse', target: 'init-shop', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    { id: 'e-shop-to-residential', source: 'init-shop', target: 'init-residential', animated: true, style: { stroke: '#f97316', strokeWidth: 3 } },
    { id: 'e-water-to-residential', source: 'init-water', target: 'init-residential', animated: true, style: { stroke: '#06b6d4', strokeWidth: 3 } },
  ];

  // Randomly scatter resource nodes further out
  const resourceTypes = ['forest', 'quarry', 'water-source', 'coal-deposit', 'oil-reserve'];
  for (let i = 0; i < 12; i++) {
    const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    const template = NODE_TEMPLATES[type];
    nodes.push({
      id: `resource-scatter-${i}`,
      type,
      position: {
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
      },
      data: {
        ...template,
        isActive: true,
        inventory: {},
        capacity: {},
        efficiency: 1,
        hasPower: true,
        hasLabor: true,
        hasWater: true,
        isResourceNode: true,
      },
    });
  }

  return {
    nodes: applyDagreLayout(nodes, edges),
    edges,
  };
};

const initialLayout = createInitialLayout();

export const useGameStore = create<GameState>((set, get) => ({
  money: INITIAL_MONEY,
  comfort: 100,
  powerProduced: 200,
  powerConsumed: 170,
  waterProduced: 5,
  waterConsumed: 1,
  laborProduced: 200,
  laborRequired: 170,
  netIncome: 8500,
  loansTaken: 0,
  isPaused: true,
  tick: 0,
  nodes: initialLayout.nodes,
  edges: initialLayout.edges,

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

    const snappedPosition = {
      x: Math.round(position.x / 20) * 20,
      y: Math.round(position.y / 20) * 20,
    };

    const newNode: GameNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: snappedPosition,
      data: {
        ...template,
        isActive: true,
        inventory: {},
        capacity: template.capacity || {},
        transferRate: template.transferRate || 10,
        efficiency: 1,
        hasPower: false,
        hasLabor: false,
        hasWater: false,
      },
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

  layoutNodes: () => {
    const { nodes, edges } = get();
    set({ nodes: applyDagreLayout(nodes, edges) });
  },

  toggleNodePause: (id: string) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                isManuallyPaused: !node.data.isManuallyPaused,
              },
            }
          : node
      ),
    }));
  },

  resetGame: () => {
    const layout = createInitialLayout();
    set({
      money: INITIAL_MONEY,
      comfort: 100,
      powerProduced: 0,
      powerConsumed: 0,
      waterProduced: 0,
      waterConsumed: 0,
      laborProduced: 0,
      laborRequired: 0,
      netIncome: 0,
      loansTaken: 0,
      isPaused: true,
      tick: 0,
      nodes: layout.nodes,
      edges: layout.edges,
    });
  },

  runTick: () => {
    const state = get();
    if (state.isPaused) return;

    // Deep-ish copy nodes to ensure React Flow detects changes in data
    const newNodes = state.nodes.map(node => ({
      ...node,
      data: { 
        ...node.data,
        inventory: { ...node.data.inventory },
        capacity: { ...node.data.capacity }
      }
    }));

    let totalPowerProduced = 0;
    let totalPowerConsumed = 0;
    let totalWaterProduced = 0;
    let totalWaterConsumed = 0;
    let totalUpkeep = 0;
    let totalPollution = 0;
    let revenue = 0;

    // 1. Global Totals & Reset
    newNodes.forEach((node) => {
      const data = node.data;
      data.resourceDraw = 0; // Reset draw
      totalUpkeep += data.upkeepCost;
      totalPollution += data.pollution;
      
      totalPowerConsumed += data.powerRequired;
      totalWaterConsumed += (data.inputRequirements?.['Water'] || 0);
    });

    // 2. Physical Resource Logistics (Edge-based)
    // Move resources regardless of isActive status to prevent deadlocks
    state.edges.forEach((edge) => {
      const sourceNode = newNodes.find((n) => n.id === edge.source);
      const targetNode = newNodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode) {
        Object.entries(sourceNode.data.inventory).forEach(([res, amount]) => {
          const resource = res as ResourceType;
          if (resource === 'Power' || resource === 'Water' || resource === 'Labor') return;

          if (amount > 0) {
            // Smart Logistics: Only send if it's an output, or if we are a logistics node
            const isOutput = sourceNode.data.outputRate?.[resource] !== undefined;
            const isLogistics = sourceNode.type === 'warehouse' || sourceNode.type === 'city-hall' || sourceNode.type === 'shop';
            const isResourceNode = sourceNode.data.isResourceNode;
            const isInput = sourceNode.data.inputRequirements?.[resource] !== undefined;

            // Logistics nodes and resource nodes send everything. 
            // Factories only send outputs, NOT inputs.
            const shouldSend = isResourceNode || isLogistics || (isOutput && !isInput) || (isOutput && isInput && amount > (sourceNode.data.inputRequirements?.[resource] || 0) * 2);

            if (shouldSend) {
              const targetCapacity = targetNode.data.capacity?.[resource] || 100;
              const targetCurrent = targetNode.data.inventory[resource] || 0;
              
              const spaceAvailable = targetCapacity - targetCurrent;
              if (spaceAvailable > 0) {
                const transferRate = sourceNode.data.transferRate || 10;
                const move = Math.min(amount, spaceAvailable, transferRate);
                sourceNode.data.inventory[resource]! -= move;
                targetNode.data.inventory[resource] = (targetNode.data.inventory[resource] || 0) + move;
                sourceNode.data.resourceDraw = (sourceNode.data.resourceDraw || 0) + move;
              }
            }
          }
        });
      }
    });

    // 3. Preliminary Activation (Physical Inputs only)
    newNodes.forEach(node => {
      let inputsOk = true;
      if (node.data.inputRequirements) {
        Object.entries(node.data.inputRequirements).forEach(([res, amount]) => {
          if (res !== 'Labor' && res !== 'Power' && res !== 'Water' && (node.data.inventory[res as ResourceType] || 0) < amount) {
            inputsOk = false;
          }
        });
      }
      node.data.isActive = inputsOk && state.money > 0;
    });

    // 4. Utility Connectivity (BFS)
    const getConnectedIds = (sources: GameNode[]) => {
      const connected = new Set<string>();
      const queue = sources.map(s => s.id);
      queue.forEach(id => connected.add(id));

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        state.edges.forEach(edge => {
          let nextId = null;
          if (edge.source === currentId) nextId = edge.target;
          else if (edge.target === currentId) nextId = edge.source;

          if (nextId && !connected.has(nextId)) {
            connected.add(nextId);
            queue.push(nextId);
          }
        });
      }
      return connected;
    };

    const powerSources = newNodes.filter(n => n.data.outputRate?.['Power'] && n.data.isActive);
    const waterSources = newNodes.filter(n => n.data.outputRate?.['Water'] && n.data.isActive);
    const townHall = newNodes.find(n => n.type === 'city-hall');

    const poweredNodeIds = getConnectedIds(powerSources);
    const wateredNodeIds = getConnectedIds(waterSources);
    const townHallConnectedIds = townHall ? getConnectedIds([townHall]) : new Set<string>();

    // 5. Global Labor Calculation
    let totalLaborProduced = 0;
    let totalLaborRequired = 0;
    newNodes.forEach(node => {
      if (node.type === 'residential') {
        const food = node.data.inventory['Food'] || 0;
        const goods = node.data.inventory['Processed Goods'] || 0;
        const water = node.data.inventory['Water'] || 0;
        
        // Base satisfaction from basic needs
        const satisfaction = (
          (food >= 1 ? 1 : 0) +
          (goods >= 1 ? 1 : 0) +
          (water >= 1 ? 1 : 0)
        ) / 3;
        
        // Provide at least 85% labor even if unsatisfied to ensure starting city stability
        totalLaborProduced += (node.data.laborProduced || 0) * (0.85 + satisfaction * 0.15);
      }
      totalLaborRequired += node.data.laborRequired || 0;
    });

    // 6. Utility Distribution & Final Activation
    let remainingPower = 0;
    // Calculate actual power from active sources
    powerSources.forEach(n => {
      remainingPower += n.data.outputRate!['Power']!;
    });
    totalPowerProduced = remainingPower;

    let remainingWater = 0;
    waterSources.forEach(n => {
      remainingWater += n.data.outputRate!['Water']!;
    });
    totalWaterProduced = remainingWater;

    let remainingLabor = totalLaborProduced;

    const sortedNodes = [...newNodes].sort((a, b) => a.id.localeCompare(b.id));

    sortedNodes.forEach(node => {
      const data = node.data;
      const isConnectedToPower = poweredNodeIds.has(node.id);
      const isConnectedToWater = wateredNodeIds.has(node.id);
      const isConnectedToTownHall = townHallConnectedIds.has(node.id);

      // Power Check
      const powerReq = data.powerRequired;
      const hasPower = isConnectedToPower && remainingPower >= powerReq;
      if (hasPower) {
        remainingPower -= powerReq;
        data.hasPower = true;
      } else {
        data.hasPower = false;
      }

      // Water Check
      const waterReq = data.inputRequirements?.['Water'] || 0;
      const hasWater = isConnectedToWater && remainingWater >= waterReq;
      if (hasWater) {
        remainingWater -= waterReq;
        data.hasWater = true;
      } else {
        data.hasWater = false;
      }

      // Labor Check
      const laborReq = data.laborRequired;
      const hasLabor = remainingLabor >= laborReq;
      if (hasLabor) {
        remainingLabor -= laborReq;
        data.hasLabor = true;
      } else {
        data.hasLabor = false;
      }

      const needsTownHall = node.type === 'residential';
      const townHallOk = !needsTownHall || isConnectedToTownHall;

      const needsPower = powerReq > 0;
      const needsLabor = laborReq > 0;
      const needsWater = waterReq > 0;

      const powerOk = !needsPower || data.hasPower;
      const laborOk = !needsLabor || data.hasLabor;
      const waterOk = !needsWater || data.hasWater;

      // Re-verify inputs for final activation with Hysteresis
      let inputsOk = true;
      const missingInputs: string[] = [];
      if (data.inputRequirements) {
        Object.entries(data.inputRequirements).forEach(([res, amount]) => {
          if (res !== 'Labor' && res !== 'Power' && res !== 'Water') {
            const current = data.inventory[res as ResourceType] || 0;
            // Hysteresis: If was active last second, need 1x. If was inactive, need 2x to start.
            // This prevents rapid on/off cycling when resources are tight.
            const wasActive = state.nodes.find(n => n.id === node.id)?.data.isActive;
            const threshold = wasActive ? amount : amount * 2;
            
            if (current < threshold) {
              inputsOk = false;
              missingInputs.push(res);
            }
          }
        });
      }

      data.isActive = powerOk && laborOk && waterOk && townHallOk && inputsOk && state.money > 0 && !data.isManuallyPaused;

      if (!data.isActive) {
        const reasons = [];
        if (data.isManuallyPaused) reasons.push("Paused");
        if (!powerOk) reasons.push("No Power");
        if (!laborOk) reasons.push("No Labor");
        if (!waterOk) reasons.push("No Water");
        if (!townHallOk) reasons.push("No City Hall Link");
        if (!inputsOk) reasons.push(`Missing: ${missingInputs.join(", ")}`);
        if (state.money <= 0) reasons.push("City Bankrupt");
        data.statusMessage = reasons.join(", ");
      } else {
        data.statusMessage = undefined;
      }
    });

    // 6. Consumption, Production & Revenue
    newNodes.forEach((node) => {
      const data = node.data;
      if (data.isActive) {
        // Consume inputs
        if (data.inputRequirements) {
          Object.entries(data.inputRequirements).forEach(([res, amount]) => {
            if (res !== 'Labor' && res !== 'Power' && res !== 'Water') {
              data.inventory[res as ResourceType] = (data.inventory[res as ResourceType] || 0) - amount;
            }
          });
        }

        // Resource Production
        if (data.outputRate) {
          Object.entries(data.outputRate).forEach(([res, rate]) => {
            if (res === 'Power' || res === 'Water' || res === 'Labor') return;
            const resource = res as ResourceType;
            const capacity = data.capacity[resource] || 1000;
            data.inventory[resource] = Math.min(capacity, (data.inventory[resource] || 0) + rate);
          });
        }

        // Revenue from Shops
        if (data.type === 'shop') {
          const goods = data.inventory['Processed Goods'] || 0;
          const food = data.inventory['Food'] || 0;
          if (goods >= 1 && food >= 1) {
            data.inventory['Processed Goods']! -= 1;
            data.inventory['Food']! -= 1;
            revenue += 10000;
          }
        }
        
        // Revenue from Residential (Taxes)
        if (data.type === 'residential') {
          const food = data.inventory['Food'] || 0;
          const goods = data.inventory['Processed Goods'] || 0;
          const water = data.inventory['Water'] || 0;
          
          if (food >= 1 && goods >= 1 && water >= 1) {
            data.inventory['Food']! -= 1;
            data.inventory['Processed Goods']! -= 1;
            data.inventory['Water']! -= 1;
            revenue += 4000 * (state.comfort / 100);
          }
        }
      }
    });

    // 6. Global Stats Update
    const loanInterest = state.loansTaken * LOAN_AMOUNT * LOAN_INTEREST_RATE;
    const netMoney = revenue - totalUpkeep - loanInterest;
    
    const powerRatio = totalPowerProduced >= totalPowerConsumed ? 1 : totalPowerProduced / totalPowerConsumed;
    
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
      waterProduced: totalWaterProduced,
      waterConsumed: totalWaterConsumed,
      laborProduced: totalLaborProduced,
      laborRequired: totalLaborRequired,
      netIncome: netMoney,
      nodes: newNodes,
    });

    // Loss condition
    if (state.money < 0 && state.loansTaken >= 3) {
      set({ isPaused: true });
      alert('GAME OVER: Your city has gone bankrupt!');
    }
  },
}));
