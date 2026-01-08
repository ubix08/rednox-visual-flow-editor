import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { FlowCard } from '@/components/dashboard/FlowCard';
import { CreateFlowDialog } from '@/components/dashboard/CreateFlowDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export function Dashboard() {
  const queryClient = useQueryClient();
  const { data: flows, isLoading, error } = useQuery({
    queryKey: ['flows'],
    queryFn: api.getFlows,
  });
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    retry: 1,
  });
  const initMutation = useMutation({
    mutationFn: api.initSystem,
    onSuccess: () => {
      toast.success('System initialized successfully');
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      toast.error('Initialization failed: ' + err.message);
    }
  });
  const needsInit = !stats?.isInitialized && stats !== undefined;
  return (
    <AppLayout className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Flow Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your RedNox automation flows.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries()} className="hidden sm:flex">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <CreateFlowDialog />
          </div>
        </div>
        {needsInit && (
          <Alert variant="destructive" className="mb-8 border-orange-500 text-orange-600 dark:text-orange-400">
            <Database className="h-4 w-4" />
            <AlertTitle>Database Not Initialized</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
              The RedNox storage backend hasn't been set up yet. Initialize it now to start creating flows.
              <Button size="sm" variant="outline" onClick={() => initMutation.mutate()} disabled={initMutation.isPending}>
                {initMutation.isPending ? "Initializing..." : "Initialize System"}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Could not fetch flows from the server. Please check your network or API status.
            </AlertDescription>
          </Alert>
        ) : flows?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <RefreshCw className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No flows found</h3>
            <p className="text-muted-foreground mt-1 mb-6">Get started by creating your first automation flow.</p>
            <CreateFlowDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows?.map((flow) => (
              <FlowCard key={flow.id} flow={flow} />
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}