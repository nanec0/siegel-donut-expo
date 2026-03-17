import { create } from "zustand";

export const useExpoStore = create((set) => ({
  selectedOrderId: null,
  setSelectedOrder: (id) => set({ selectedOrderId: id }),
  clearSelection:   ()   => set({ selectedOrderId: null }),
}));
