import { Edge } from 'reactflow';

export const hasCycle = (sourceId: string, targetId: string, edges: Edge[]): boolean => {
  // Check if source and target are the same (self-loop)
  if (sourceId === targetId) return true;

  // We want to check if there is a path from target to source.
  // If such a path exists, adding an edge from source to target will extend that path to a cycle.
  
  const stack = [targetId];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const currentId = stack.pop();

    if (!currentId) continue;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    if (currentId === sourceId) return true;

    // Find all nodes that the current node connects to (is a source for)
    const outgoers = edges
      .filter((edge) => edge.source === currentId)
      .map((edge) => edge.target);
    
    stack.push(...outgoers);
  }

  return false;
};
