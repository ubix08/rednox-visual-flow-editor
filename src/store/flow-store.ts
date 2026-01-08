import { create } from "zustand";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection
} from "@xyflow/react";
import { NodeDef, DebugLog } from "@/types/rednox";
interface FlowState {
  nodes: Node[];
  edges: Edge[];
  nodeDefs: Record<string, NodeDef>;
  selectedNodeId: string | null;
  logs: DebugLog[];
  isDeploying: boolean;
  isExecuting: boolean;
  hasUnsavedChanges: boolean;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setNodeDefs: (defs: NodeDef[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  getNodeDef: (type: string) => NodeDef | undefined;
  updateNodeData: (id: string, data: any) => void;
  addLog: (log: DebugLog) => void;
  clearLogs: () => void;
  setIsDeploying: (val: boolean) => void;
  setIsExecuting: (val: boolean) => void;
  setHasUnsavedChanges: (val: boolean) => void;
}
export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeDefs: {},
  selectedNodeId: null,
  logs: [],
  isDeploying: false,
  isExecuting: false,
  hasUnsavedChanges: false,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setNodeDefs: (defs) => {
    const defMap = defs.reduce((acc, def) => {
      acc[def.type] = def;
      return acc;
    }, {} as Record<string, NodeDef>);
    set({ nodeDefs: defMap });
  },
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      hasUnsavedChanges: true
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
      hasUnsavedChanges: true
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
      hasUnsavedChanges: true
    });
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
      hasUnsavedChanges: true
    });
  },
  getNodeDef: (type) => {
    return get().nodeDefs[type];
  },
  updateNodeData: (id, newData) => {
    set({
      hasUnsavedChanges: true,
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
              label: newData.name ?? newData.label ?? node.data.label,
              config: {
                ...(node.data.config as object),
                ...(newData.config || newData),
              }
            },
          };
        }
        return node;
      }),
    });
  },
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 100) })),
  clearLogs: () => set({ logs: [] }),
  setIsDeploying: (val) => set({ isDeploying: val }),
  setIsExecuting: (val) => set({ isExecuting: val }),
  setHasUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),
}));