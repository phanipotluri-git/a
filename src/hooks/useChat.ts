"use client";

import { useCallback, useRef, useState } from "react";
import type { ApiError, Message } from "@/lib/types";

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  error: ApiError | null;
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your shrimp farming expert. Ask me anything about pond management, water quality, feeding, disease prevention, or harvest planning.",
      },
    ],
    isStreaming: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (text: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();
    const placeholder: Message = { id: assistantId, role: "assistant", content: "" };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg, placeholder],
      isStreaming: true,
      error: null,
    }));

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const history = [...state.messages, userMsg].map(({ role, content }) => ({
        role,
        content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err: ApiError = await res.json();
        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: err,
          messages: prev.messages.filter((m) => m.id !== assistantId),
        }));
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const captured = full;
        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((m) =>
            m.id === assistantId ? { ...m, content: captured } : m
          ),
        }));
      }

      setState((prev) => ({ ...prev, isStreaming: false }));
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        error: { error: "Request failed. Please try again.", code: "STREAM_ERROR" },
        messages: prev.messages.filter((m) => m.id !== assistantId),
      }));
    }
  }, [state.messages]);

  return { ...state, send };
}
