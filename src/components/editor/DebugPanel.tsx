import React, { useState, useEffect, useRef } from "react";
import { useFlowStore } from "@/store/flow-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Terminal, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
export function DebugPanel() {
  const logs = useFlowStore((s) => s.logs);
  const clearLogs = useFlowStore((s) => s.clearLogs);
  const [filter, setFilter] = useState<'all' | 'info' | 'error'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === filter;
  });
  return (
    <div className="h-full flex flex-col bg-background border-t">
      <div className="flex items-center justify-between px-4 h-10 border-b bg-muted/30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Terminal className="h-3.5 w-3.5" />
            Debug Console
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1">
            <Button 
              variant={filter === 'all' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-7 text-[10px] px-2"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'info' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-7 text-[10px] px-2"
              onClick={() => setFilter('info')}
            >
              Info
            </Button>
            <Button 
              variant={filter === 'error' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-7 text-[10px] px-2 text-destructive hover:text-destructive"
              onClick={() => setFilter('error')}
            >
              Errors
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearLogs}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 font-mono text-xs">
        <div className="p-2 space-y-1">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground opacity-50">
              <Terminal className="h-8 w-8 mb-2" />
              <p>No execution traces found</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className={cn(
                  "p-2 rounded border-l-2 flex flex-col gap-1 hover:bg-muted/50 transition-colors",
                  log.level === 'error' ? "border-l-destructive bg-destructive/5" : "border-l-primary bg-muted/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      [{format(new Date(log.timestamp), 'HH:mm:ss.SSS')}]
                    </span>
                    <Badge variant={log.level === 'error' ? 'destructive' : 'outline'} className="text-[9px] h-4 px-1 uppercase">
                      {log.level}
                    </Badge>
                    {log.nodeId && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                        node:{log.nodeId.split('-')[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground italic">{log.topic || 'system'}</span>
                </div>
                <div className="whitespace-pre-wrap break-all text-foreground/90">
                  {typeof log.payload === 'object' ? JSON.stringify(log.payload, null, 2) : String(log.payload)}
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
    </div>
  );
}