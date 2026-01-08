import { create } from "zustand";
import { Node, Edge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, addEdge, Connection } from "@xyflow/react";
import { NodeDef } from "@/types/rednox";
interface FlowState {
  nodes: Node[];
  edges: Edge[];
  nodeDefs: Record<string, NodeDef>;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setNodeDefs: (defs: NodeDef[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  getNodeDef: (type: string) => NodeDef | undefined;
}
export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeDefs: {},
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setNodeDefs: (defs) => {
    const defMap = defs.reduce((acc, def) => {
      acc[def.type] = def;
      return acc;
    }, {} as Record<string, NodeDef>);
    set({ nodeDefs: defMap });
  },
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
}));