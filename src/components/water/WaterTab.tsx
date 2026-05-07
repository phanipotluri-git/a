"use client";

import { useStream } from "@/hooks/useStream";
import type { WaterParams } from "@/lib/types";
import WaterForm from "./WaterForm";
import StreamingText from "@/components/ui/StreamingText";
import LoadingDots from "@/components/ui/LoadingDots";
import ErrorBanner from "@/components/ui/ErrorBanner";

export default function WaterTab() {
  const { content, isStreaming, error, stream, reset } = useStream();

  async function handleSubmit(params: WaterParams) {
    reset();
    await stream("/api/water-quality", { params });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Water Quality Advisor</h2>
        <p className="text-sm text-gray-500">Enter your pond&apos;s current water parameters to get AI-powered recommendations.</p>
      </div>

      <WaterForm onSubmit={handleSubmit} disabled={isStreaming} />

      <ErrorBanner error={error} />

      {(isStreaming || content) && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-teal-700">AI Recommendations</h3>
          {isStreaming && content === "" ? (
            <LoadingDots />
          ) : (
            <StreamingText content={content} isStreaming={isStreaming} />
          )}
        </div>
      )}
    </div>
  );
}
