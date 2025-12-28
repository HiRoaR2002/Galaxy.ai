'use client';
import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  Node,
  useReactFlow,
  ConnectionLineType,
} from 'reactflow';
import { Maximize, Plus, Minus, Undo, Redo, ZoomIn, ZoomOut } from 'lucide-react';
import useStore from '@/store/useStore';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TextNode from '@/components/nodes/TextNode';
import ImageNode from '@/components/nodes/ImageNode';
import LLMNode from '@/components/nodes/LLMNode';
import { defaultNodes, defaultEdges } from '@/lib/defaultWorkflow';

import 'reactflow/dist/style.css';

const nodeTypes = {
  textNode: TextNode,
  imageNode: ImageNode,
  llmNode: LLMNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { 
    stroke: '#7c3aed', 
    strokeWidth: 2 
  },
};

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setNodes, setEdges, undo, redo } = useStore();
  const { screenToFlowPosition, fitView, zoomIn, zoomOut, getZoom } = useReactFlow();

  useEffect(() => {
     if (nodes.length === 0) {
         setNodes(defaultNodes);
         setEdges(defaultEdges);
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode: Node = {
        id: crypto.randomUUID(),
        type,
        position,
        data: {}, 
      };

      if (type === 'llmNode') newNode.data = { label: 'New Model', model: 'gemini-1.5-flash' };
      if (type === 'textNode') newNode.data = { label: 'Prompt', text: '' };
      if (type === 'imageNode') newNode.data = { label: 'Image', imageData: null };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );
  
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-[#1a1a1e]">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Canvas */}
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType={ConnectionLineType.SmoothStep}
            connectionLineStyle={{ stroke: '#7c3aed', strokeWidth: 2 }}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            className="bg-[#1a1a1e]"
            minZoom={0.1}
            maxZoom={4}
            proOptions={{ hideAttribution: true }}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={24} 
              size={1} 
              color="#3a3a3e"
            />
            <Controls 
              className="!bg-[#2a2a2e] !border-[#3a3a3e] !rounded-lg !shadow-lg"
              showInteractive={false}
            />
          </ReactFlow>
          
          {/* Bottom Toolbar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-[#2a2a2e] border border-[#3a3a3e] rounded-lg shadow-lg">
            <button 
              onClick={() => fitView()}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"
              title="Fit View"
            >
              <Maximize size={16} />
            </button>
            <button 
              onClick={() => zoomIn()}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#3a3a3e] transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button 
              onClick={() => zoomOut()}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#3a3a3e] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <div className="w-px h-5 bg-[#3a3a3e]" />
            <button 
              onClick={undo}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#3a3a3e] transition-colors"
              title="Undo"
            >
              <Undo size={16} />
            </button>
            <button 
              onClick={redo}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-200 hover:bg-[#3a3a3e] transition-colors"
              title="Redo"
            >
              <Redo size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
