"use client";

import { useCallback, useState } from "react";
import type { ApiError } from "@/lib/types";

interface StreamState {
  content: string;
  isStreaming: boolean;
  error: ApiError | null;
}

export function useStream() {
  const [state, setState] = useState<StreamState>({
    content: "",
    isStreaming: false,
    error: null,
  });

  const stream = useCallback(
    async (url: string, body: unknown, onDone?: (full: string) => void) => {
      setState({ content: "", isStreaming: true, error: null });

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err: ApiError = await res.json();
          setState({ content: "", isStreaming: false, error: err });
          return;
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          setState((prev) => ({ ...prev, content: full }));
        }

        setState({ content: full, isStreaming: false, error: null });
        onDone?.(full);
      } catch {
        setState({
          content: "",
          isStreaming: false,
          error: { error: "Request failed. Please try again.", code: "STREAM_ERROR" },
        });
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ content: "", isStreaming: false, error: null });
  }, []);

  return { ...state, stream, reset };
}
