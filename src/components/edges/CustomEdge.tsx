import React from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from 'reactflow';
import { X } from 'lucide-react';
import useStore from '@/store/useStore';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const deleteEdge = useStore((state) => state.deleteEdge);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            className="w-6 h-6 bg-[#2a2a2e] border border-[#3a3a3e] cursor-pointer rounded-full flex items-center justify-center hover:bg-red-900/20 hover:border-red-500/50 transition-all shadow-md group"
            onClick={() => deleteEdge(id)}
            aria-label="Delete edge"
          >
            <X size={12} className="text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
