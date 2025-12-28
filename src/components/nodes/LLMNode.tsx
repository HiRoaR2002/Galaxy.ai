'use client';
import { memo, useCallback, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { MoreHorizontal, Play, Loader2, AlertCircle, Sparkles, ChevronDown, Copy, Trash2 } from 'lucide-react';
import useStore from '@/store/useStore';
import { LLMNodeData, GeminiModel, TextNodeData, ImageNodeData } from '@/types/workflow';

const LLMNode = ({ id, data, selected }: NodeProps<LLMNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const duplicateNode = useStore((state) => state.duplicateNode);
  const deleteNode = useStore((state) => state.deleteNode);

  const { getEdges, getNode } = useReactFlow();
  const [isRunning, setIsRunning] = useState(false);
  const [showModelSelect, setShowModelSelect] = useState(false);
  
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

  const handleModelChange = useCallback(
    (model: GeminiModel) => {
      updateNodeData(id, { model });
      setShowModelSelect(false);
    },
    [id, updateNodeData]
  );

  const runLLM = useCallback(async () => {
    setIsRunning(true);
    updateNodeData(id, { isLoading: true, error: undefined });

    try {
      const edges = getEdges();
      const incomingEdges = edges.filter((edge) => edge.target === id);

      let systemPrompt = '';
      let userPrompt = '';
      const images: string[] = [];

      for (const edge of incomingEdges) {
        const sourceNode = getNode(edge.source);
        if (!sourceNode) continue;

        const targetHandle = edge.targetHandle;

        if (sourceNode.type === 'textNode') {
          const nodeData = sourceNode.data as TextNodeData;
          const text = nodeData.text || '';
          if (targetHandle === 'system') {
            systemPrompt += text + '\n';
          } else if (targetHandle === 'user') {
            userPrompt += text + '\n';
          }
        } else if (sourceNode.type === 'imageNode') {
          const nodeData = sourceNode.data as ImageNodeData;
          const imageData = nodeData.imageData;
          if (imageData && targetHandle === 'images') {
            images.push(imageData);
          }
        } else if (sourceNode.type === 'llmNode') {
          const nodeData = sourceNode.data as LLMNodeData;
          const output = nodeData.output;
          if (output && targetHandle === 'user') {
            userPrompt += output + '\n';
          }
        }
      }

      updateNodeData(id, {
        inputSystem: systemPrompt.trim(),
        inputUser: userPrompt.trim(),
        inputImages: images,
      });

      const response = await fetch('/api/run-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: data.model,
          systemPrompt: systemPrompt.trim(),
          userMessage: userPrompt.trim(),
          images: images,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run LLM');
      }

      const result = await response.json();
      updateNodeData(id, {
        output: result.text,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('LLM Error:', error);
      updateNodeData(id, {
        error: error.message || 'An error occurred',
        isLoading: false,
      });
    } finally {
      setIsRunning(false);
    }
  }, [id, data.model, updateNodeData, getEdges, getNode]);

  const models: { value: GeminiModel; label: string }[] = [
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  ];

  return (
    <div
      className={`
        min-w-[280px] max-w-[340px] 
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
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#e8e0d0] relative">
        <input
          type="text"
          value={data.label || 'LLM Node'}
          onChange={handleLabelChange}
          className="text-sm font-medium bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 flex-1"
          placeholder="LLM Node"
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
      <div className="p-4 space-y-3">
        {/* Model Selection */}
        <div className="relative">
          <button
            onClick={() => setShowModelSelect(!showModelSelect)}
            className="w-full px-3 py-2 text-sm bg-white/60 border border-[#e8e0d0] rounded-lg flex items-center justify-between text-gray-700 hover:bg-white/80 transition-colors"
          >
            <span>{models.find(m => m.value === data.model)?.label || 'Select Model'}</span>
            <ChevronDown size={14} className={`transition-transform ${showModelSelect ? 'rotate-180' : ''}`} />
          </button>
          
          {showModelSelect && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#e8e0d0] shadow-lg z-10 overflow-hidden">
              {models.map((model) => (
                <button
                  key={model.value}
                  onClick={() => handleModelChange(model.value)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                    data.model === model.value ? 'bg-[#7c3aed]/10 text-[#7c3aed]' : 'text-gray-700'
                  }`}
                >
                  {model.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Run Button */}
        <button
          onClick={runLLM}
          disabled={isRunning}
          className="
            w-full px-4 py-2.5
            bg-[#7c3aed]
            hover:bg-[#6d28d9]
            text-white font-medium text-sm
            rounded-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            flex items-center justify-center gap-2
            shadow-md hover:shadow-lg
          "
        >
          {isRunning ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play size={16} />
              Run Model
            </>
          )}
        </button>

        {/* Error */}
        {data.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-700">{data.error}</div>
            </div>
          </div>
        )}

        {/* Output */}
        {data.output && (
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-[#fdfbf7] p-4 shadow-sm ring-1 ring-[#e8e0d0] transition-all duration-300 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between border-b border-[#f0ebe0] pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#7c3aed]/10 text-[#7c3aed]">
                  <Sparkles size={14} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">
                  Generated Response
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="light-scrollbar max-h-[200px] overflow-y-auto pr-2 text-[13px] leading-relaxed text-slate-700">
                {data.output}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="system"
        style={{ top: '30%' }}
        className="!w-3 !h-3 !bg-[#7c3aed] !border-2 !border-[#1a1a1e]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="user"
        style={{ top: '50%' }}
        className="!w-3 !h-3 !bg-[#7c3aed] !border-2 !border-[#1a1a1e]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="images"
        style={{ top: '70%' }}
        className="!w-3 !h-3 !bg-[#7c3aed] !border-2 !border-[#1a1a1e]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-3 !h-3 !bg-[#7c3aed] !border-2 !border-[#1a1a1e]"
      />
    </div>
  );
};

export default memo(LLMNode);
