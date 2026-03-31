import React, { useCallback, useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel, 
  ReactFlowProvider,
  useReactFlow,
  XYPosition
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useGameStore } from './store';
import CustomNode from './components/CustomNode';
import Sidebar from './components/Sidebar';
import HUD from './components/HUD';
import StartModal from './components/StartModal';

const nodeTypes = {
  'city-hall': CustomNode,
  'coal-power': CustomNode,
  'oil-power': CustomNode,
  'solar-farm': CustomNode,
  'farm': CustomNode,
  'processing-plant': CustomNode,
  'waste-treatment': CustomNode,
  'warehouse': CustomNode,
  'store': CustomNode,
  'residential': CustomNode,
  'airport': CustomNode,
  'hospital': CustomNode,
  'forest': CustomNode,
  'quarry': CustomNode,
  'water-source': CustomNode,
  'coal-deposit': CustomNode,
  'oil-reserve': CustomNode,
  'substation': CustomNode,
};

const GameCanvas = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    onReconnect: onReconnectStore,
    deleteEdge,
    addNode,
    runTick,
    isPaused
  } = useGameStore();
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();

  // Tick Engine
  useEffect(() => {
    const interval = setInterval(() => {
      runTick();
    }, 3000); // 3 seconds per tick
    return () => clearInterval(interval);
  }, [runTick]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(type, position);
    },
    [project, addNode]
  );

  const edgeUpdateSuccessful = useRef(true);

  const onReconnectStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge: any, newConnection: any) => {
    edgeUpdateSuccessful.current = true;
    onReconnectStore(oldEdge, newConnection);
  }, [onReconnectStore]);

  const onReconnectEnd = useCallback((_: any, edge: any) => {
    if (!edgeUpdateSuccessful.current) {
      deleteEdge(edge.id);
    }
    edgeUpdateSuccessful.current = true;
  }, [deleteEdge]);

  const isValidConnection = useCallback((connection: any) => {
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) return false;

    // Power and Grid connections
    const isResourceSource = !!sourceNode.data.isResourceNode;
    const isResourceTarget = !!targetNode.data.isResourceNode;
    
    // Allow any connection between non-resource nodes (Power Grid)
    if (!isResourceSource && !isResourceTarget) return true;

    // Resource connections (from resource nodes to factories/warehouses)
    const sourceOutputs = Object.keys(sourceNode.data.outputRate || {}).filter(r => r !== 'Power');
    const targetInputs = Object.keys(targetNode.data.inputRequirements || {});
    const targetCapacities = Object.keys(targetNode.data.capacity || {});

    // Logistics nodes (warehouses) can accept anything from resource nodes
    if (targetNode.data.category === 'Logistics' && isResourceSource) {
      return true;
    }

    // A connection is valid if the source produces something the target needs or can store
    const canAcceptSomething = sourceOutputs.some(res => 
      targetInputs.includes(res) || targetCapacities.includes(res)
    );

    return canAcceptSomething;
  }, [nodes]);

  return (
    <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        isValidConnection={isValidConnection}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        defaultEdgeOptions={{
          style: { strokeWidth: 3, stroke: '#3b82f6' },
          animated: true,
          reconnectable: true,
        }}
      >
        <Background color="#1e293b" gap={40} size={1} />
        <Controls className="bg-slate-900 border-slate-800 fill-white" />
      </ReactFlow>
      
      <HUD />
      <StartModal />
    </div>
  );
};

export default function App() {
  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans selection:bg-blue-900 selection:text-blue-100 text-slate-200">
      <ReactFlowProvider>
        <Sidebar />
        <GameCanvas />
      </ReactFlowProvider>
    </div>
  );
}
