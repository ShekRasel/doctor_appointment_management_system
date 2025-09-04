"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/auth.store";

export const AuthHydrator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hydrateUserFromToken = useAuthStore((state) => state.hydrateUserFromToken);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      hydrateUserFromToken(token);
    }
  }, [hydrateUserFromToken]);

  return <>{children}</>;
};
