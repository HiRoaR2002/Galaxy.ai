'use client';
import { useCallback, useEffect } from 'react';
import ReactFlow, {
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

import CustomEdge from '@/components/edges/CustomEdge';

const nodeTypes = {
  textNode: TextNode,
  imageNode: ImageNode,
  llmNode: LLMNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
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
    <div className="flex w-full h-screen overflow-hidden bg-[#1a1a1e]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content - Canvas Area */}
      <div className="flex-1 h-full relative">
        {/* Floating Header Controls */}
        <Header />
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
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

          </ReactFlow>
          
          {/* Bottom Toolbar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-2 bg-[#1a1a1e]/90 backdrop-blur-md border border-[#2a2a2e] rounded-2xl shadow-2xl z-50">
            <button 
              onClick={() => fitView()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 transition-all active:scale-95"
              title="Fit View"
            >
              <Maximize size={18} />
            </button>
            <div className="w-px h-6 bg-[#2a2a2e] mx-1" />
            <button 
              onClick={() => zoomIn()}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-[#3a3a3e] transition-all active:scale-95"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <button 
              onClick={() => zoomOut()}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-[#3a3a3e] transition-all active:scale-95"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <div className="w-px h-6 bg-[#2a2a2e] mx-1" />
            <button 
              onClick={undo}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-[#3a3a3e] transition-all active:scale-95"
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button 
              onClick={redo}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-[#3a3a3e] transition-all active:scale-95"
              title="Redo"
            >
              <Redo size={18} />
            </button>
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
