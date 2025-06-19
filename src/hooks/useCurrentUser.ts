"use client";

import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/api/currentUserApi";

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const user = await fetchCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  return { user, loading };
}
