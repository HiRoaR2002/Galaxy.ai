'use client';
import React, { useState } from 'react';
import { Save, FolderOpen, Undo, Redo } from 'lucide-react';
import useStore from '@/store/useStore';

interface HeaderProps {
  title?: string;
}

const Header = ({ title = 'untitled' }: HeaderProps) => {
  const [workflowTitle, setWorkflowTitle] = useState(title);
  const { nodes, edges, loadWorkflow, undo, redo } = useStore();

  const handleSave = () => {
    const flow = { nodes, edges };
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowTitle || 'workflow'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const flow = JSON.parse(evt.target?.result as string);
        if (flow.nodes && flow.edges) {
            loadWorkflow(flow);
        } else {
            alert('Invalid workflow file format');
        }
      } catch (err) {
        console.error("Failed to parse workflow", err);
        alert("Invalid workflow file");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-14 bg-[#1a1a1e] border-b border-[#2a2a2e] flex items-center justify-between px-4 z-20">
      {/* Left Section - Logo & Title */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">W</span>
        </div>
        
        {/* Workflow Title */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2e] rounded-lg">
          <input
            type="text"
            value={workflowTitle}
            onChange={(e) => setWorkflowTitle(e.target.value)}
            className="bg-transparent text-sm text-gray-300 outline-none w-32 min-w-0"
            placeholder="untitled"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center bg-[#2a2a2e] rounded-lg p-0.5 mr-2">
          <button 
            onClick={undo}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#3a3a3e] rounded-md transition-colors"
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button 
            onClick={redo}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#3a3a3e] rounded-md transition-colors"
            title="Redo"
          >
            <Redo size={16} />
          </button>
        </div>

        {/* Load Button */}
        <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors cursor-pointer hover:bg-[#2a2a2e] rounded-lg">
          <FolderOpen size={16} />
          <span className="hidden sm:inline">Load</span>
          <input 
            type="file" 
            className="hidden" 
            accept=".json" 
            onChange={handleLoad} 
          />
        </label>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors hover:bg-[#2a2a2e] rounded-lg"
        >
          <Save size={16} />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
