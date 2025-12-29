'use client';
import { memo, useCallback, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { MoreHorizontal, Play, Loader2, AlertCircle, Sparkles, ChevronDown, Copy, Trash2, BrainCircuit } from 'lucide-react';
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
        relative
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
        <div className="flex items-center gap-2 w-[85%]">
            <input
            type="text"
            value={data.label || 'LLM Node'}
            onChange={handleLabelChange}
            className="text-base font-semibold bg-transparent border-none outline-none text-white placeholder-gray-500 flex-1"
            placeholder="LLM Node"
            />
        </div>
        
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
          
           <div className="h-px bg-[#2a2a2e] my-2" />

          <button
            onClick={() => {
              deleteNode(id);
              setShowMenu(false);
            }}
            className="w-full px-3 py-2.5 text-sm text-left text-white hover:bg-[#2a2a2e] rounded-md flex items-center justify-between transition-colors group"
          >
            <span>Delete</span>
            <span className="text-gray-500 text-xs italic group-hover:text-gray-400">del</span>
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-5">
         <div className="space-y-4">
            {/* Model Selection */}
            <div className="relative">
            <button
                onClick={() => setShowModelSelect(!showModelSelect)}
                className="w-full px-3 py-2.5 text-sm rounded-lg flex items-center justify-between transition-colors bg-[#2b2b30] border border-[#3a3a3e] text-white hover:bg-[#3a3a3e]"
            >
                <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#c084fc]" />
                    <span>{models.find(m => m.value === data.model)?.label || 'Select Model'}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform text-gray-400 ${showModelSelect ? 'rotate-180' : ''}`} />
            </button>
            
            {showModelSelect && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-20 overflow-hidden bg-[#1e1e24] border border-[#2a2a2e]"
                >
                {models.map((model) => (
                    <button
                    key={model.value}
                    onClick={() => handleModelChange(model.value)}
                    className={`
                      w-full px-3 py-2.5 text-sm text-left transition-colors flex items-center gap-2
                      ${data.model === model.value ? 'bg-[#2a2a2e] text-[#c084fc]' : 'text-gray-300 hover:bg-[#2a2a2e]'}
                    `}
                    >
                     {data.model === model.value && <div className="w-1 h-4 bg-[#c084fc] rounded-full mr-1"></div>}
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
              w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200
              bg-[#7c3aed] text-white hover:bg-[#6d28d9]
              disabled:opacity-70 disabled:cursor-not-allowed
              shadow-lg shadow-[#7c3aed]/20
            "
            >
            {isRunning ? (
                <>
                <Loader2 size={16} className="animate-spin" />
                Running...
                </>
            ) : (
                <>
                <Play size={16} fill="white" />
                Run Model
                </>
            )}
            </button>

             {/* Error Display */}
            {data.error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-200">{data.error}</div>
                </div>
            </div>
            )}

            {/* Output Display */}
            {data.output && (
            <div 
                className="rounded-xl p-4 transition-all duration-300 relative group bg-[#2b2b30] border border-[#3a3a3e]"
            >
                <div className="mb-2 flex items-center justify-between border-b border-[#3a3a3e] pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c084fc]">
                    Generated Response
                </span>
                </div>
                
                <div className="light-scrollbar max-h-[250px] overflow-y-auto pr-2 text-sm leading-relaxed text-gray-200">
                    {data.output}
                </div>
            </div>
            )}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="system"
        style={{ top: '30%' }}
        className="!w-4 !h-4 !bg-[#1e1e24] !border-[4px] !border-[#e879f9] !rounded-full !-left-2.5 ring-2 ring-[#1e1e24]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="user"
        style={{ top: '50%' }}
        className="!w-4 !h-4 !bg-[#1e1e24] !border-[4px] !border-[#e879f9] !rounded-full !-left-2.5 ring-2 ring-[#1e1e24]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="images"
        style={{ top: '70%' }}
        className="!w-4 !h-4 !bg-[#1e1e24] !border-[4px] !border-[#e879f9] !rounded-full !-left-2.5 ring-2 ring-[#1e1e24]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-4 !h-4 !bg-[#1e1e24] !border-[4px] !border-[#e879f9] !rounded-full !-right-2.5 ring-2 ring-[#1e1e24]"
      />
    </div>
  );
};

export default memo(LLMNode);
