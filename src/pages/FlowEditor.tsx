import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { useFlowStore } from "@/store/flow-store";
import { toReactFlow, fromReactFlow } from "@/lib/flow-adapters";
import { NodePalette } from "@/components/editor/NodePalette";
import { FlowCanvas } from "@/components/editor/FlowCanvas";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
export function FlowEditor() {
  const { id } = useParams<{ id: string }>();
  const setNodes = useFlowStore((s) => s.setNodes);
  const setEdges = useFlowStore((s) => s.setEdges);
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const { data: flow, isLoading, error } = useQuery({
    queryKey: ["flow", id],
    queryFn: () => api.getFlow(id!),
    enabled: !!id,
  });
  useEffect(() => {
    if (flow) {
      const { nodes: rfNodes, edges: rfEdges } = toReactFlow(flow);
      setNodes(rfNodes);
      setEdges(rfEdges);
    }
  }, [flow, setNodes, setEdges]);
  const handleSave = async () => {
    if (!id || !flow) return;
    try {
      const updatedFlow = fromReactFlow(id, flow.label, nodes, edges, flow);
      await api.updateFlow(id, updatedFlow);
      toast.success("Flow saved and deployed");
    } catch (err) {
      toast.error("Failed to save flow");
    }
  };
  if (isLoading) {
    return (
      <AppLayout className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout className="h-screen flex flex-col overflow-hidden">
      <Header />
      {/* Editor Toolbar */}
      <div className="h-12 border-b bg-background flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <h2 className="text-sm font-semibold">{flow?.label}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button className="btn-gradient" size="sm" onClick={handleSave}>
            <Play className="h-4 w-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <NodePalette />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <FlowCanvas />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
            <div className="h-full border-l bg-background flex flex-col p-4">
              <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4">Properties</h3>
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <p className="text-sm">Select a node to edit its configuration</p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AppLayout>
  );
}