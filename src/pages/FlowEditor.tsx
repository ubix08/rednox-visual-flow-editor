import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { useFlowStore } from "@/store/flow-store";
import { toReactFlow } from "@/lib/flow-adapters";
import { NodePalette } from "@/components/editor/NodePalette";
import { FlowCanvas } from "@/components/editor/FlowCanvas";
import { PropertyEditor } from "@/components/editor/PropertyEditor";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { DebugPanel } from "@/components/editor/DebugPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Loader2 } from "lucide-react";
export function FlowEditor() {
  const { id } = useParams<{ id: string }>();
  const setNodes = useFlowStore((s) => s.setNodes);
  const setEdges = useFlowStore((s) => s.setEdges);
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const setHasUnsavedChanges = useFlowStore((s) => s.setHasUnsavedChanges);
  const { data: flow, isLoading } = useQuery({
    queryKey: ["flow", id],
    queryFn: () => api.getFlow(id!),
    enabled: !!id,
    staleTime: 0, // Always get fresh data on editor entry
  });
  useEffect(() => {
    if (flow) {
      const { nodes: rfNodes, edges: rfEdges } = toReactFlow(flow);
      setNodes(rfNodes);
      setEdges(rfEdges);
      setHasUnsavedChanges(false);
    }
  }, [flow, setNodes, setEdges, setHasUnsavedChanges]);
  if (isLoading) {
    return (
      <AppLayout className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">Initializing Canvas...</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout className="h-screen flex flex-col overflow-hidden">
      <Header />
      <EditorToolbar flow={flow} />
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75} minSize={50}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={18} minSize={15} maxSize={30}>
                <NodePalette />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={62}>
                <FlowCanvas />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
                <PropertyEditor />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={10} collapsible>
            <DebugPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AppLayout>
  );
}