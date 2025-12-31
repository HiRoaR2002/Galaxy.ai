'use client';
import { memo, useCallback, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MoreHorizontal, Copy, Trash2 } from 'lucide-react';
import useStore from '@/store/useStore';
import { TextNodeData } from '@/types/workflow';

const TextNode = ({ id, data, selected }: NodeProps<TextNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const duplicateNode = useStore((state) => state.duplicateNode);
  const deleteNode = useStore((state) => state.deleteNode);
  
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { text: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { label: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <div
      className={`
        relative group
        min-w-[320px] max-w-[400px] 
        bg-[#1e1e24] 
        rounded-2xl shadow-2xl
        border transition-all duration-200
        ${selected 
          ? 'border-[#c084fc] shadow-[#c084fc]/20' 
          : 'border-[#2a2a2e] hover:border-[#c084fc]/50'
        }
      `}
    >
      {/* Header - Label */}
      <div className="flex items-center justify-between pt-5 px-6 pb-3">
        <input
          type="text"
          value={data.label || 'Prompt'}
          onChange={handleLabelChange}
          className="text-base font-semibold bg-transparent border-none outline-none text-white placeholder-gray-500 w-[85%]"
          placeholder="Prompt"
        />
        
        {/* Menu Button */}
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div 
          ref={menuRef}
          className="absolute right-0 top-10 -mr-2 w-56 bg-[#1e1e24] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-[#2a2a2e] z-50 overflow-hidden p-2"
        >
          <button
            onClick={() => {
              duplicateNode(id);
              setShowMenu(false);
            }}
            className="w-full px-3 py-2.5 text-sm text-left text-white hover:bg-[#2a2a2e] rounded-md flex items-center justify-between transition-colors group"
          >
            <span>Duplicate</span>
            <span className="text-gray-500 text-xs italic group-hover:text-gray-400">ctrl+d</span>
          </button>

          <button className="w-full px-3 py-2.5 text-sm text-left text-white hover:bg-[#2a2a2e] rounded-md flex items-center justify-between transition-colors">
            <span>Rename</span>
          </button>
          
          <button className="w-full px-3 py-2.5 text-sm text-left text-white hover:bg-[#2a2a2e] rounded-md flex items-center justify-between transition-colors">
            <span>Lock</span>
          </button>

          <div className="h-px bg-[#2a2a2e] my-2" />

          <button
            onClick={() => {
              deleteNode(id);
              setShowMenu(false);
            }}
            className="w-full px-3 py-2.5 text-sm text-left text-white hover:bg-[#2a2a2e] rounded-md flex items-center justify-between transition-colors group"
          >
            <span>Delete</span>
            <span className="text-gray-500 text-xs italic group-hover:text-gray-400">delete / backspace</span>
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-5">
        <div className="bg-[#2b2b30] rounded-xl p-4 border border-[#3a3a3e]">
          <textarea
            value={data.text || ''}
            onChange={handleTextChange}
            placeholder="Enter your prompt here..."
            className="
              w-full min-h-[120px] max-h-[300px]
              p-0 text-sm
              bg-transparent
              border-none
              focus:outline-none focus:ring-0
              text-gray-100
              placeholder-gray-500
              resize-none
              leading-relaxed
            "
          />
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-4 !h-4 !bg-[#1e1e24] !border-[4px] !border-[#e879f9] !rounded-full !-right-2.5 ring-2 ring-[#1e1e24]"
        isValidConnection={(connection) => connection.targetHandle !== 'images'}
      >
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 text-[10px] text-gray-400 font-medium whitespace-nowrap pointer-events-none">
          Text Output
        </div>
      </Handle>
    </div>
  );
};

export default memo(TextNode);
