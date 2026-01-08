import React, { useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowStore } from "@/store/flow-store";
import { CustomNode } from "./CustomNode";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Maximize, Save } from "lucide-react";
const nodeTypes = {
  rednoxNode: CustomNode,
};
function FlowCanvasInner() {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const addNode = useFlowStore((s) => s.addNode);
  const getNodeDef = useFlowStore((s) => s.getNodeDef);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const def = getNodeDef(type);
      const newNode = {
        id: uuidv4(),
        type: "rednoxNode",
        position,
        data: { 
          label: def?.label || type,
          type: type,
          config: { type, wires: [] } 
        },
      };
      addNode(newNode);
    },
    [screenToFlowPosition, addNode, getNodeDef]
  );
  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap zoomable pannable />
        <Panel position="top-right" className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => fitView()}>
            <Maximize className="h-4 w-4 mr-2" />
            Fit View
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}