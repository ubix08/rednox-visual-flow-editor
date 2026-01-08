import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { useFlowStore } from "@/store/flow-store";
import { cn } from "@/lib/utils";
import { Settings2 } from "lucide-react";
export const CustomNode = memo(({ data, selected, id }: NodeProps) => {
  const nodeDefs = useFlowStore((s) => s.nodeDefs);
  const type = data.type as string;
  const def = nodeDefs[type];
  const inputs = def?.inputs ?? 0;
  const outputs = def?.outputs ?? 0;
  const color = def?.color ?? "#94a3b8";
  return (
    <div
      className={cn(
        "group relative min-w-[140px] rounded-md border bg-card text-card-foreground shadow-sm transition-all",
        selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:border-primary/50"
      )}
    >
      {/* Node Header/Body */}
      <div className="flex flex-col">
        <div 
          className="h-1.5 w-full rounded-t-md" 
          style={{ backgroundColor: color }}
        />
        <div className="flex items-center gap-2 p-3">
          <div className="flex-1 overflow-hidden">
            <div className="text-[10px] font-medium uppercase text-muted-foreground truncate">
              {type}
            </div>
            <div className="text-sm font-semibold truncate">
              {data.label as string}
            </div>
          </div>
          <Settings2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      {/* Input Handles */}
      {Array.from({ length: inputs }).map((_, i) => (
        <Handle
          key={`in-${i}`}
          type="target"
          position={Position.Left}
          id={`in-${i}`}
          className="!w-3 !h-3 !bg-background !border-2 !border-primary"
          style={{ top: `${((i + 1) * 100) / (inputs + 1)}%` }}
        />
      ))}
      {/* Output Handles */}
      {Array.from({ length: outputs }).map((_, i) => (
        <Handle
          key={`out-${i}`}
          type="source"
          position={Position.Right}
          id={`out-${i}`}
          className="!w-3 !h-3 !bg-background !border-2 !border-primary"
          style={{ top: `${((i + 1) * 100) / (outputs + 1)}%` }}
        />
      ))}
    </div>
  );
});
CustomNode.displayName = "CustomNode";