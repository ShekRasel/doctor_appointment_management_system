import { create } from "zustand";

interface SearchStore {
  query: string;
  specialization: string;
  setQuery: (q: string) => void;
  setSpecialization: (s: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  specialization: "",
  setQuery: (q) => set({ query: q }),
  setSpecialization: (s) => set({ specialization: s }),
}));