import React from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
export function FlowEditor() {
  const { id } = useParams();
  return (
    <AppLayout className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center bg-accent/5">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Flow Editor</h2>
          <p className="text-muted-foreground">
            Loading flow configuration for: <code className="bg-muted px-2 py-1 rounded">{id}</code>
          </p>
          <div className="pt-4">
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}