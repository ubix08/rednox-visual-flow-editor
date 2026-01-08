import { create } from 'zustand';
interface AppState {
  isInitialized: boolean;
  activeFlowId: string | null;
  setIsInitialized: (val: boolean) => void;
  setActiveFlowId: (id: string | null) => void;
}
export const useAppStore = create<AppState>((set) => ({
  isInitialized: true,
  activeFlowId: null,
  setIsInitialized: (val) => set({ isInitialized: val }),
  setActiveFlowId: (id) => set({ activeFlowId: id }),
}));