import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFlowStore } from "@/store/flow-store";
export function NodePalette() {
  const [search, setSearch] = useState("");
  const setNodeDefs = useFlowStore((s) => s.setNodeDefs);
  const { data: nodes, isLoading } = useQuery({
    queryKey: ["nodes"],
    queryFn: async () => {
      const defs = await api.getNodes();
      setNodeDefs(defs);
      return defs;
    },
  });
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const filteredNodes = nodes?.filter((n) =>
    n.label.toLowerCase().includes(search.toLowerCase()) ||
    n.type.toLowerCase().includes(search.toLowerCase())
  );
  const categories = Array.from(new Set(filteredNodes?.map((n) => n.category) || []));
  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Package className="h-4 w-4" />
          Node Palette
        </h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Loading nodes...</div>
          ) : categories.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">No nodes found</div>
          ) : (
            categories.map((cat) => (
              <div key={cat} className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {cat}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {filteredNodes
                    ?.filter((n) => n.category === cat)
                    .map((node) => (
                      <div
                        key={node.type}
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type)}
                        className="group flex items-center justify-between p-2 rounded-md border bg-card hover:border-primary/50 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div
                            className="w-1 h-6 rounded-full"
                            style={{ backgroundColor: node.color }}
                          />
                          <span className="text-sm font-medium truncate">{node.label}</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] h-4 px-1 opacity-50 group-hover:opacity-100">
                          {node.type}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}