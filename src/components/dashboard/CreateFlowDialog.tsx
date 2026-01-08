import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
const flowSchema = z.object({
  label: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
});
type FlowFormValues = z.infer<typeof flowSchema>;
export function CreateFlowDialog() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const form = useForm<FlowFormValues>({
    resolver: zodResolver(flowSchema),
    defaultValues: { label: '', description: '' },
  });
  const onSubmit = useCallback(async (values: FlowFormValues) => {
    try {
      const newFlow = await api.createFlow({
        label: values.label,
        description: values.description,
        nodes: [],
        enabled: false,
      });
      toast.success('Flow created successfully');
      setOpen(false);
      // Brief delay to allow dialog closure before navigation
      setTimeout(() => {
        navigate(`/flow/${newFlow.id}`);
      }, 100);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create flow');
    }
  }, [navigate]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gradient">
          <Plus className="h-4 w-4 mr-2" />
          New Flow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Flow</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flow Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Workflow" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain what this flow does..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {form.formState.isSubmitting ? "Creating..." : "Create Flow"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}