"use client";

import { useAuthLoader } from "@/hooks/useAuthLoader";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthLoader();
  return <>{children}</>;
}
