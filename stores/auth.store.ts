import { create } from "zustand";
import Cookies from "js-cookie";
import { MyJwtPayload, User } from "@/types/auth.type";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user: User | null;
  token: string | null;
  role: "PATIENT" | "DOCTOR" | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRole: (role: "PATIENT" | "DOCTOR") => void;
  clearAuth: () => void;
  hydrateUserFromToken: (token?: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  role: null, // initially no role

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setRole: (role) => set({ role }),
  clearAuth: () => set({ user: null, token: null, role: null }),

  hydrateUserFromToken: (tokenFromParam) => {
    try {
      const token = tokenFromParam || Cookies.get("token");
      if (!token) return;

      const decoded: MyJwtPayload = jwtDecode(token);
      set({
        token,
        role: decoded.role,
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        },
      });
    } catch (err) {
      console.error("Invalid token", err);
      set({ user: null, token: null, role: null });
    }
  },
}));
