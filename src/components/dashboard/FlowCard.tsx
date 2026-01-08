import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Play, Square, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { FlowConfig } from '@/types/rednox';
import { api } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
interface FlowCardProps {
  flow: FlowConfig;
}
export function FlowCard({ flow }: FlowCardProps) {
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this flow?')) return;
    try {
      await api.deleteFlow(flow.id);
      toast.success('Flow deleted');
      queryClient.invalidateQueries({ queryKey: ['flows'] });
    } catch (error) {
      toast.error('Failed to delete flow');
    }
  };
  const toggleStatus = async () => {
    try {
      await api.updateFlow(flow.id, { enabled: !flow.enabled });
      toast.success(`Flow ${!flow.enabled ? 'enabled' : 'disabled'}`);
      queryClient.invalidateQueries({ queryKey: ['flows'] });
    } catch (error) {
      toast.error('Failed to update flow status');
    }
  };
  return (
    <Card className="group hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={flow.enabled ? "default" : "secondary"} className="mb-2">
            {flow.enabled ? "Active" : "Inactive"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/flow/${flow.id}`} className="flex items-center">
                  <Edit3 className="h-4 w-4 mr-2" /> Edit Flow
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleStatus}>
                {flow.enabled ? (
                  <><Square className="h-4 w-4 mr-2" /> Disable</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" /> Enable</>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="line-clamp-1">{flow.label}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {flow.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-xs text-muted-foreground">
          {flow.updated_at ? (
            <>Updated {formatDistanceToNow(new Date(flow.updated_at))} ago</>
          ) : (
            "Never updated"
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button asChild variant="secondary" size="sm" className="w-full">
          <Link to={`/flow/${flow.id}`}>
            <ExternalLink className="h-3 w-3 mr-2" />
            Open Editor
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}