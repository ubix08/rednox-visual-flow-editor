import React from "react";
import { Link, useParams } from "react-router-dom";
import { useFlowStore } from "@/store/flow-store";
import { api } from "@/lib/api";
import { fromReactFlow } from "@/lib/flow-adapters";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Loader2, 
  Zap, 
  CloudUpload,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { ExecutionDialog } from "./ExecutionDialog";
import { FlowConfig } from "@/types/rednox";
interface EditorToolbarProps {
  flow: FlowConfig | undefined;
}
export function EditorToolbar({ flow }: EditorToolbarProps) {
  const { id } = useParams<{ id: string }>();
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const hasUnsavedChanges = useFlowStore((s) => s.hasUnsavedChanges);
  const isDeploying = useFlowStore((s) => s.isDeploying);
  const setHasUnsavedChanges = useFlowStore((s) => s.setHasUnsavedChanges);
  const setIsDeploying = useFlowStore((s) => s.setIsDeploying);
  const handleDeploy = async () => {
    if (!id || !flow) return;
    setIsDeploying(true);
    try {
      const updatedFlow = fromReactFlow(id, flow.label, nodes, edges, flow);
      await api.updateFlow(id, updatedFlow);
      setHasUnsavedChanges(false);
      toast.success("Flow deployed successfully", {
        description: "Your changes are now live on the RedNox runtime."
      });
    } catch (err) {
      toast.error("Deployment failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsDeploying(false);
    }
  };
  const handleSave = async () => {
    if (!id || !flow) return;
    try {
      const updatedFlow = fromReactFlow(id, flow.label, nodes, edges, flow);
      await api.updateFlow(id, updatedFlow);
      setHasUnsavedChanges(false);
      toast.success("Flow saved");
    } catch (err) {
      toast.error("Failed to save: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };
  return (
    <div className="h-14 border-b bg-background flex items-center justify-between px-4 shrink-0 shadow-sm z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        <div className="h-4 w-px bg-border" />
        <div className="flex flex-col">
          <h2 className="text-sm font-bold leading-tight">{flow?.label}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            {hasUnsavedChanges ? (
              <div className="flex items-center text-[10px] text-orange-500 font-medium animate-pulse">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved changes
              </div>
            ) : (
              <div className="flex items-center text-[10px] text-emerald-500 font-medium">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Synced to cloud
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ExecutionDialog />
        <Button variant="outline" size="sm" onClick={handleSave} disabled={isDeploying || !hasUnsavedChanges}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button className="btn-gradient min-w-[100px]" size="sm" onClick={handleDeploy} disabled={isDeploying}>
          {isDeploying ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CloudUpload className="h-4 w-4 mr-2" />
          )}
          {isDeploying ? "Deploying..." : "Deploy"}
        </Button>
      </div>
    </div>
  );
}