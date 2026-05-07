"use client";

import { useState } from "react";
import type { ApiError } from "@/lib/types";

interface Props {
  error: ApiError | null;
}

export default function ErrorBanner({ error }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (!error || dismissed) return null;

  const isOffline = error.code === "OLLAMA_UNAVAILABLE";

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span className="mt-0.5 text-base">⚠️</span>
      <div className="flex-1">
        {isOffline ? (
          <>
            <p className="font-semibold">AI model is offline.</p>
            <p className="mt-1">
              Make sure Ollama is running:{" "}
              <code className="rounded bg-amber-100 px-1 font-mono">ollama serve</code>
            </p>
            <p className="mt-0.5">
              Load the model:{" "}
              <code className="rounded bg-amber-100 px-1 font-mono">ollama pull llama3.2</code>
            </p>
          </>
        ) : (
          <p>{error.error}</p>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-600 hover:text-amber-900"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
