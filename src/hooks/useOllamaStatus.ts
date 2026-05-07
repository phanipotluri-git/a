"use client";

import { useCallback, useEffect, useState } from "react";

type Status = "checking" | "online" | "offline";

export function useOllamaStatus() {
  const [status, setStatus] = useState<Status>("checking");

  const recheck = useCallback(async () => {
    setStatus("checking");
    try {
      const res = await fetch("/api/health");
      setStatus(res.ok ? "online" : "offline");
    } catch {
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    recheck();
    const interval = setInterval(recheck, 30_000);
    return () => clearInterval(interval);
  }, [recheck]);

  return { status, recheck };
}
