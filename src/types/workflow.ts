export type GeminiModel = "gemini-2.5-flash";

export interface TextNodeData {
  label?: string;
  text: string;
}

export interface ImageNodeData {
  label?: string;
  imageData?: string; // base64
  fileName?: string;
}

export interface LLMNodeData {
  label?: string;
  model: GeminiModel;
  inputSystem?: string; // Derived from connections
  inputUser?: string;   // Derived from connections
  inputImages?: string[]; // Derived from connections
  output?: string;
  isLoading?: boolean;
  error?: string;
  runNode?: () => void;
}
