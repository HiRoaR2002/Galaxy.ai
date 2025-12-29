'use client';
import React from 'react';
import { Type, Image as ImageIcon, BrainCircuit, GripVertical } from 'lucide-react';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: 'textNode', icon: Type, label: 'Text Input', color: 'text-blue-400' },
    { type: 'imageNode', icon: ImageIcon, label: 'Image Gen', color: 'text-pink-400' },
    { type: 'llmNode', icon: BrainCircuit, label: 'LLM Model', color: 'text-violet-400' },
  ];

  return (
    <aside className="w-20 h-screen bg-[#212126] border-r border-[#2a2a2e] flex flex-col items-center py-6 z-20 shadow-xl px-2">
      {/* Draggable Node Types */}
      <div className="flex flex-col gap-6 w-full">
        
        
        {nodeTypes.map((node, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className="group flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
            title={`Drag to add ${node.label}`}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#2a2a2e] text-gray-400 hover:text-white hover:bg-[#3a3a3e] hover:scale-105 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 border border-[#3a3a3e] group-hover:border-violet-500/30 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                <node.icon size={24} className={`${node.color} group-hover:scale-110 transition-transform duration-300`} />
            </div>
            <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-300 transition-colors">
              {node.label.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
