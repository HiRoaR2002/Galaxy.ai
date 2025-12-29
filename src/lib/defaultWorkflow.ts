import { AppNode } from "@/store/useStore";
import { Edge } from "reactflow";

const edgeStyle = { stroke: '#7c3aed', strokeWidth: 2 };

export const defaultNodes: AppNode[] = [
  // Inputs
  { id: 'img1', type: 'imageNode', position: { x: 50, y: 50 }, data: { label: 'Product Photo 1' } },
  { id: 'img2', type: 'imageNode', position: { x: 50, y: 350 }, data: { label: 'Product Photo 2' } },
  { id: 'img3', type: 'imageNode', position: { x: 50, y: 650 }, data: { label: 'Product Photo 3' } },
  
  // Prompts
  { id: 'sys', type: 'textNode', position: { x: 400, y: 50 }, data: { label: 'System Prompt', text: 'You are an expert e-commerce copywriter. Analyze the product images and details provided.' } },
  { id: 'prod', type: 'textNode', position: { x: 400, y: 350 }, data: { label: 'Product Details', text: 'Product: Noise Cancelling Headphones. Features: 30h battery, active noise cancellation, deep bass.' } },
  
  // Analyzer LLM
  { id: 'analyze', type: 'llmNode', position: { x: 800, y: 200 }, data: { label: 'Analyze Product', model: 'gemini-1.5-flash' } },
  
  // Instructions for Branches
  { id: 'inst1', type: 'textNode', position: { x: 900, y: -100 }, data: { label: 'Amazon Prompt', text: 'Write a professional Amazon listing based on the product analysis.' } },
  { id: 'inst2', type: 'textNode', position: { x: 900, y: 250 }, data: { label: 'Instagram Prompt', text: 'Write a fun Instagram caption with hashtags based on the analysis.' } },
  { id: 'inst3', type: 'textNode', position: { x: 900, y: 550 }, data: { label: 'SEO Prompt', text: 'Write a concise SEO meta description.' } },
  
  // Output Generators
  { id: 'amazon', type: 'llmNode', position: { x: 1200, y: 0 }, data: { label: 'Write Amazon Listing', model: 'gemini-1.5-flash' } },
  { id: 'insta', type: 'llmNode', position: { x: 1200, y: 300 }, data: { label: 'Write Instagram Caption', model: 'gemini-1.5-flash' } },
  { id: 'seo', type: 'llmNode', position: { x: 1200, y: 600 }, data: { label: 'Write SEO Description', model: 'gemini-1.5-flash' } },
  
  // Final Outputs
  { id: 'out1', type: 'textNode', position: { x: 1600, y: 0 }, data: { label: 'Amazon Output', text: '' } },
  { id: 'out2', type: 'textNode', position: { x: 1600, y: 300 }, data: { label: 'Insta Output', text: '' } },
  { id: 'out3', type: 'textNode', position: { x: 1600, y: 600 }, data: { label: 'SEO Output', text: '' } },
];

export const defaultEdges: Edge[] = [
  { id: 'e1', source: 'img1', target: 'analyze', targetHandle: 'images', animated: true, type: 'customEdge', style: edgeStyle },
  { id: 'e2', source: 'img2', target: 'analyze', targetHandle: 'images', animated: true, type: 'customEdge', style: edgeStyle },
  { id: 'e3', source: 'img3', target: 'analyze', targetHandle: 'images', animated: true, type: 'customEdge', style: edgeStyle },
  
  { id: 'e4', source: 'sys', target: 'analyze', targetHandle: 'system', animated: true, type: 'customEdge', style: edgeStyle },
  { id: 'e5', source: 'prod', target: 'analyze', targetHandle: 'user', animated: true, type: 'customEdge', style: edgeStyle },
  
  { id: 'e_inst1', source: 'inst1', target: 'amazon', targetHandle: 'system', animated: true, type: 'customEdge', style: edgeStyle },
  { id: 'e_inst2', source: 'inst2', target: 'insta', targetHandle: 'system', animated: true, type: 'customEdge', style: edgeStyle },
  { id: 'e_inst3', source: 'inst3', target: 'seo', targetHandle: 'system', animated: true, type: 'customEdge', style: edgeStyle },
  
  { id: 'e6', source: 'analyze', target: 'amazon', targetHandle: 'user', animated: true, type: 'customEdge', style: edgeStyle },
  { id: 'e7', source: 'analyze', target: 'insta', targetHandle: 'user', animated: true, type: 'customEdge', style: edgeStyle },
  { id: 'e8', source: 'analyze', target: 'seo', targetHandle: 'user', animated: true, type: 'customEdge', style: edgeStyle },
  
  { id: 'e9', source: 'amazon', target: 'out1', targetHandle: 'target', animated: true, type: 'customEdge', style: edgeStyle },
  { id: 'e10', source: 'insta', target: 'out2', targetHandle: 'target', animated: true, type: 'customEdge', style: edgeStyle },
  { id: 'e11', source: 'seo', target: 'out3', targetHandle: 'target', animated: true, type: 'customEdge', style: edgeStyle },
];
