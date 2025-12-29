'use client';
import React, { useState } from 'react';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import useStore from '@/store/useStore';

interface HeaderProps {
  title?: string;
}

const Header = ({ title = 'untitled' }: HeaderProps) => {
  const [workflowTitle, setWorkflowTitle] = useState(title);
  const { nodes, edges, loadWorkflow, clearCanvas } = useStore();

  const handleSave = () => {
    const flow = { nodes, edges };
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowTitle || 'workflow'}.json`;
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
    <header className="absolute top-0 inset-x-0 w-full z-50 pointer-events-none">
      <div className="flex items-start justify-between p-2 ">
        {/* Left Section - Floating Rename Input */}
        <div className="pointer-events-auto">
          <div className="bg-[#2a2a2e] backdrop-blur-xl rounded-2xl p-1 border border-white/5 shadow-lg shadow-black/20">
            <input
              type="text"
              value={workflowTitle}
              onChange={(e) => setWorkflowTitle(e.target.value)}
              className="text-white font-medium text-sm 
                w-48 px-4 py-2 
                rounded-xl
                bg-transparent
                hover:bg-white/5 
                focus:bg-[#3a3a3e] focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/50
                transition-all duration-200
                placeholder:text-gray-500 placeholder:font-normal
              "
              placeholder="Workflow Name"
            />
          </div>
        </div>

        {/* Right Section - Floating Control Icons */}
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2 bg-[#2a2a2e] backdrop-blur-xl rounded-2xl p-2 border border-white/5 shadow-lg shadow-black/20">
            {/* Clear Canvas Button */}
            <button
               onClick={clearCanvas}
               className="flex items-center justify-center p-2.5 bg-[#1a1a1e]/80 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer active:scale-95 group"
               title="Clear Canvas"
            >
               <Trash2 size={18} />
            </button>

            {/* Load Button */}
            <label className="flex items-center justify-center p-2.5 bg-[#1a1a1e]/80 rounded-xl text-white hover:bg-white/10 transition-all cursor-pointer hover:text-gray-200">
              <FolderOpen size={18} />
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
              className="flex items-center justify-center p-2.5 bg-[#1a1a1e]/80 rounded-xl text-white hover:bg-white/10 transition-all cursor-pointer active:scale-95 hover:text-gray-200"
              title="Save Workflow"
            >
              <Save size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
