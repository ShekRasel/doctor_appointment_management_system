import { create } from "zustand";

interface AuthState {
  role: "patient" | "doctor";
  setRole: (role: "patient" | "doctor") => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: "patient",
  setRole: (role) => set({ role }),
}));
