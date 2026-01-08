import { ApiResponse, FlowConfig, NodeDef, SystemStats, DebugLog, ExecutionResponse } from "@/types/rednox";
const BASE_URL = "/api";
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }
  const result: ApiResponse<T> = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Unknown API Error");
  }
  return result.data;
}
export const api = {
  getStats: () => request<SystemStats>("/admin/stats"),
  getNodes: () => request<NodeDef[]>("/admin/nodes"),
  getFlows: () => request<FlowConfig[]>("/admin/flows"),
  getFlow: (id: string) => request<FlowConfig>(`/admin/flows/${id}`),
  createFlow: (data: Partial<FlowConfig>) =>
    request<FlowConfig>("/admin/flows", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateFlow: (id: string, data: Partial<FlowConfig>) =>
    request<FlowConfig>(`/admin/flows/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteFlow: (id: string) =>
    request<void>(`/admin/flows/${id}`, {
      method: "DELETE",
    }),
  initSystem: () =>
    request<{ message: string }>("/admin/init", {
      method: "POST",
    }),
  executeFlow: (id: string, payload: any) =>
    request<ExecutionResponse>(`/admin/flows/${id}/execute`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getLogs: (id: string) => request<DebugLog[]>(`/admin/flows/${id}/logs`),
};