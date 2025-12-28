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
        min-w-[280px] max-w-[320px] 
        bg-[#f5f0e6] 
        rounded-xl shadow-lg
        border transition-all duration-200
        ${selected 
          ? 'border-[#7c3aed] shadow-[#7c3aed]/20 shadow-xl' 
          : 'border-[#e8e0d0] hover:border-[#7c3aed]/50'
        }
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between relative">
        <input
          type="text"
          value={data.label || 'Prompt'}
          onChange={handleLabelChange}
          className="text-sm font-medium bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
          placeholder="Prompt"
        />
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-black/5 rounded transition-colors"
        >
          <MoreHorizontal size={16} className="text-gray-500" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div 
            ref={menuRef}
            className="absolute top-8 right-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden"
          >
            <button
              onClick={() => {
                duplicateNode(id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Copy size={14} />
              Duplicate
            </button>
            <div className="h-px bg-gray-100" />
            <button
              onClick={() => {
                deleteNode(id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <textarea
          value={data.text || ''}
          onChange={handleTextChange}
          placeholder="Enter text content..."
          className="
            w-full min-h-[100px] max-h-[200px]
            p-0 text-sm
            bg-transparent
            border-none
            focus:outline-none focus:ring-0
            text-gray-700
            placeholder-gray-400
            resize-none
            leading-relaxed
          "
        />
      </div>

      {/* Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-3 !h-3 !bg-[#7c3aed] !border-2 !border-[#1a1a1e]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!w-3 !h-3 !bg-[#7c3aed] !border-2 !border-[#1a1a1e]"
      />
    </div>
  );
};

export default memo(TextNode);
