import React from "react";
import { useFlowStore } from "@/store/flow-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CodeField } from "./fields/CodeField";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Info } from "lucide-react";
export function PropertyEditor() {
  const nodes = useFlowStore((s) => s.nodes);
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const nodeDefs = useFlowStore((s) => s.nodeDefs);
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Settings className="h-8 w-8 opacity-20" />
        </div>
        <h3 className="text-sm font-semibold mb-1">No Node Selected</h3>
        <p className="text-xs max-w-[200px]">
          Select a node on the canvas to configure its properties and logic.
        </p>
      </div>
    );
  }
  const type = selectedNode.data.type as string;
  const def = nodeDefs[type];
  const config = (selectedNode.data.config as any) || {};
  const handleFieldChange = (key: string, value: any) => {
    updateNodeData(selectedNode.id, { [key]: value });
  };
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: def?.color || "#ccc" }} 
          />
          <h2 className="text-sm font-bold truncate">Edit {def?.label || type}</h2>
        </div>
        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">
          {selectedNode.id.split('-')[0]}
        </span>
      </div>
      <ScrollArea className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="p-4 space-y-6"
          >
            {/* Common Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="node-name" className="text-xs font-semibold uppercase text-muted-foreground">
                  Node Name
                </Label>
                <Input
                  id="node-name"
                  value={selectedNode.data.label as string}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder={def?.label || "Node name"}
                  className="h-9"
                />
              </div>
            </div>
            <Separator />
            {/* Dynamic Fields based on NodeDef */}
            <div className="space-y-4">
              {Object.keys(def?.defaults || {}).map((key) => {
                const defaultValue = def?.defaults[key].value;
                const currentValue = config[key] ?? defaultValue;
                // Simple heuristic for field types
                if (key === "func" || key === "template") {
                  return (
                    <CodeField
                      key={key}
                      label={key}
                      value={currentValue as string}
                      onChange={(val) => handleFieldChange(key, val)}
                    />
                  );
                }
                return (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`field-${key}`} className="text-xs font-semibold uppercase text-muted-foreground">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Input
                      id={`field-${key}`}
                      value={currentValue as string}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="h-9"
                    />
                  </div>
                );
              })}
            </div>
            {def && (
              <div className="bg-muted/30 rounded-lg p-3 border border-dashed mt-8">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Info className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Technical Info</span>
                </div>
                <div className="text-[10px] text-muted-foreground grid grid-cols-2 gap-y-1">
                  <span>Inputs:</span> <span className="text-right">{def.inputs}</span>
                  <span>Outputs:</span> <span className="text-right">{def.outputs}</span>
                  <span>Category:</span> <span className="text-right capitalize">{def.category}</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}