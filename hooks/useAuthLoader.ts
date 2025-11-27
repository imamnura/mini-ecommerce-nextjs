"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function useAuthLoader() {
  const setUser = useUserStore((s) => s.setUser);
  const setLoading = useUserStore((s) => s.setLoading);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [setUser, setLoading]);
}
