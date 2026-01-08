export type NodeId = string;
export type FlowId = string;
export interface Wire {
  [index: number]: NodeId;
}
export interface RedNoxNode {
  id: NodeId;
  type: string;
  z: FlowId;
  name?: string;
  x: number;
  y: number;
  wires: NodeId[][];
  [key: string]: any;
}
export interface FlowConfig {
  id: FlowId;
  label: string;
  nodes: RedNoxNode[];
  enabled: boolean;
  updated_at?: string;
  description?: string;
}
export interface NodeDef {
  type: string;
  category: string;
  color: string;
  defaults: Record<string, any>;
  inputs: number;
  outputs: number;
  icon: string;
  label: string;
  paletteLabel?: string;
}
export interface SystemStats {
  flowCount: number;
  activeFlows: number;
  nodeCount: number;
  uptime: number;
  isInitialized: boolean;
}
export interface DebugLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  nodeId?: string;
  topic?: string;
  payload: any;
}
export interface ExecutionResponse {
  success: boolean;
  executionId: string;
  startTime: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}