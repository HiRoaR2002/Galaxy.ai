'use client';
import { memo, useCallback, useRef, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Upload, MoreVertical, Copy, Trash2, MoreHorizontal } from 'lucide-react';
import useStore from '@/store/useStore';
import { ImageNodeData } from '@/types/workflow';

const ImageNode = ({ id, data, selected }: NodeProps<ImageNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const duplicateNode = useStore((state) => state.duplicateNode);
  const deleteNode = useStore((state) => state.deleteNode);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { label: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const imageData = evt.target?.result as string;
        updateNodeData(id, { 
          imageData, 
          fileName: file.name 
        });
      };
      reader.readAsDataURL(file);
    },
    [id, updateNodeData]
  );

  const handleRemoveImage = useCallback(() => {
    updateNodeData(id, { imageData: undefined, fileName: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [id, updateNodeData]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`
        min-w-[200px] max-w-[240px] 
        bg-[#2a2a2e]
        rounded-xl shadow-lg
        border transition-all duration-200
        ${selected 
          ? 'border-[#7c3aed] shadow-[#7c3aed]/20 shadow-xl' 
          : 'border-white/10 hover:border-[#7c3aed]/50'
        }
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10 relative">
        <input
          type="text"
          value={data.label || 'Image'}
          onChange={handleLabelChange}
          className="text-sm font-bold bg-transparent border-none outline-none text-white placeholder-gray-400 flex-1 min-w-0"
          placeholder="Image"
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
      <div className="p-4">
        {data.imageData ? (
          <div className="relative group">
            <img
              src={data.imageData}
              alt={data.fileName || 'Uploaded image'}
              className="w-full h-auto max-h-[160px] object-contain rounded-lg ring-1 ring-[#e8e0d0] shadow-sm bg-white transition-shadow hover:shadow-md"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              title="Remove image"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            onClick={handleUploadClick}
            className="
              w-full py-6 px-4
              border-2 border-dashed border-[#dcd6c8]
              rounded-lg
              hover:border-[#7c3aed] hover:bg-[#7c3aed]/5
              transition-all duration-200
              flex flex-col items-center justify-center gap-2
              group
            "
          >
            <div className="w-10 h-10 rounded-full bg-[#e8e0d0] flex items-center justify-center text-gray-500 group-hover:text-[#7c3aed] transition-colors">
              <Upload size={20} />
            </div>
            <span className="text-xs font-medium text-gray-500 group-hover:text-[#7c3aed]">Upload Image</span>
          </button>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
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

export default memo(ImageNode);
