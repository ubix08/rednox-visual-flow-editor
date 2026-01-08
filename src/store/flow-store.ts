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
import { NodeDef } from "@/types/rednox";
interface FlowState {
  nodes: Node[];
  edges: Edge[];
  nodeDefs: Record<string, NodeDef>;
  selectedNodeId: string | null;
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
}
export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeDefs: {},
  selectedNodeId: null,
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
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  getNodeDef: (type) => {
    return get().nodeDefs[type];
  },
  updateNodeData: (id, newData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
              // If the name is changed in newData, we update the top-level label for visual sync
              label: newData.name ?? newData.label ?? node.data.label,
              // Deep merge the config object if present
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
}));