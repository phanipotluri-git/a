"use client";

import StatusIndicator from "@/components/ui/StatusIndicator";
import { useOllamaStatus } from "@/hooks/useOllamaStatus";

export default function Header() {
  const { status, recheck } = useOllamaStatus();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🦐</span>
        <div>
          <h1 className="text-lg font-bold leading-tight text-teal-700">Shrimp Farming GPT</h1>
          <p className="text-xs text-gray-500">AI-powered aquaculture assistant</p>
        </div>
      </div>
      <StatusIndicator status={status} onRecheck={recheck} />
    </header>
  );
}
