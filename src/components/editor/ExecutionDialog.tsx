import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFlowStore } from "@/store/flow-store";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Zap, Loader2, AlertCircle } from "lucide-react";
import { CodeField } from "./fields/CodeField";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
export function ExecutionDialog() {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState('{\n  "payload": "Hello RedNox",\n  "topic": "test"\n}');
  const isExecuting = useFlowStore((s) => s.isExecuting);
  const setIsExecuting = useFlowStore((s) => s.setIsExecuting);
  const addLog = useFlowStore((s) => s.addLog);
  const handleExecute = async () => {
    if (!id) return;
    try {
      const parsed = JSON.parse(payload);
      setIsExecuting(true);
      addLog({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        level: 'info',
        topic: 'execution',
        payload: "Triggering manual execution..."
      });
      const response = await api.executeFlow(id, parsed);
      addLog({
        id: uuidv4(),
        timestamp: response.startTime,
        level: 'info',
        topic: 'execution',
        payload: { message: "Flow execution started", executionId: response.executionId }
      });
      toast.success("Execution triggered");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof SyntaxError ? "Invalid JSON payload" : "Execution failed");
    } finally {
      setIsExecuting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Zap className="h-4 w-4 mr-2 text-orange-500" />
          Test Flow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Manual Execution
          </DialogTitle>
          <DialogDescription>
            Send a custom JSON payload to the flow's entry point to test your logic.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CodeField
            label="Input Payload (JSON)"
            value={payload}
            onChange={setPayload}
            language="json"
            height="250px"
          />
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
          <div className="flex items-center text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3 mr-1" />
            Results will appear in the Debug Console
          </div>
          <Button onClick={handleExecute} disabled={isExecuting}>
            {isExecuting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Run Execution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}