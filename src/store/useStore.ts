import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance,
} from 'reactflow';
import { TextNodeData, ImageNodeData, LLMNodeData } from '@/types/workflow';

type NodeData = TextNodeData | ImageNodeData | LLMNodeData;

export type AppNode = Node<NodeData>;

interface WorkflowState {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: AppNode) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  duplicateNode: (id: string) => void;
  deleteNode: (id: string) => void;
  
  // Undo/Redo - Simple implementation
  history: {
    past: { nodes: AppNode[]; edges: Edge[] }[];
    future: { nodes: AppNode[]; edges: Edge[] }[];
  };
  takeSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  
  // Storage
  saveWorkflow: () => void;
  loadWorkflow: (workflow: { nodes: AppNode[]; edges: Edge[] }) => void;
}

const useStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  history: { past: [], future: [] },

  onNodesChange: (changes: NodeChange[]) => {
    // Basic snapshot on meaningful changes (drag end, selection change etc might be too frequent, 
    // but for now we snapshot on every change for simplicity or filter types)
    // Real implementation would debounce or filter 'position' changes on dragEnd.
    set({
      nodes: applyNodeChanges(changes, get().nodes) as AppNode[],
    });
  },
  
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    get().takeSnapshot();
    set({
      edges: addEdge({ ...connection, animated: true, type: 'smoothstep', style: { stroke: '#7c3aed', strokeWidth: 2 } }, get().edges),
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => {
    get().takeSnapshot();
    set({ nodes: [...get().nodes, node] });
  },

  updateNodeData: (id, data) => {
    // Don't snapshot on every text keystroke, parent component should handle debounce/snapshot call if needed.
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  duplicateNode: (id: string) => {
    get().takeSnapshot();
    const { nodes } = get();
    const nodeToDuplicate = nodes.find((n) => n.id === id);
    if (!nodeToDuplicate) return;

    const newNode = {
      ...nodeToDuplicate,
      id: crypto.randomUUID(),
      position: {
        x: nodeToDuplicate.position.x + 20,
        y: nodeToDuplicate.position.y + 20,
      },
      data: { ...nodeToDuplicate.data },
      selected: false,
    };

    set({ nodes: [...nodes, newNode] });
  },

  deleteNode: (id: string) => {
    get().takeSnapshot();
    const { nodes, edges } = get();
    set({
      nodes: nodes.filter((n) => n.id !== id),
      edges: edges.filter((e) => e.source !== id && e.target !== id),
    });
  },

  takeSnapshot: () => {
    const { nodes, edges, history } = get();
    // Limit history size to 50
    const newPast = [...history.past, { nodes, edges }].slice(-50);
    set({
      history: {
        past: newPast,
        future: [],
      },
    });
  },

  undo: () => {
    const { history, nodes, edges } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: {
        past: newPast,
        future: [{ nodes, edges }, ...history.future],
      },
    });
  },

  redo: () => {
    const { history, nodes, edges } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      history: {
        past: [...history.past, { nodes, edges }],
        future: newFuture,
      },
    });
  },
  
  saveWorkflow: () => {
      const { nodes, edges } = get();
      const workflow = { nodes, edges };
      localStorage.setItem('galaxy-workflow', JSON.stringify(workflow));
      // In a real app, this would POST to DB
      console.log('Saved to local storage');
  },
  
  loadWorkflow: (workflow) => {
      set({ nodes: workflow.nodes, edges: workflow.edges, history: { past: [], future: [] } });
  },
}));

export default useStore;
