'use client';
import React from 'react';
import { FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: 'textNode', icon: FileText, label: 'Text' },
    { type: 'imageNode', icon: ImageIcon, label: 'Image' },
    { type: 'llmNode', icon: Sparkles, label: 'LLM' },
  ];

  return (
    <aside className="w-16 h-screen bg-[#1a1a1e] border-r border-[#2a2a2e] flex flex-col items-center py-6 z-20">
      {/* Draggable Node Types */}
      <div className="flex flex-col items-center gap-4">
        {nodeTypes.map((node, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2a2a2e] text-gray-400 hover:text-[#7c3aed] hover:bg-[#3a3a3e] hover:scale-105 transition-all cursor-grab active:cursor-grabbing border border-[#3a3a3e] shadow-lg group"
            title={`Drag to add ${node.label} Node`}
          >
            <node.icon size={20} className="group-hover:text-[#7c3aed] transition-colors" />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
