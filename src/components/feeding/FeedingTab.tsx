"use client";

import { useState } from "react";
import { useStream } from "@/hooks/useStream";
import type { FeedingInputs, FeedingResult as FR } from "@/lib/types";
import { calculate } from "./FeedingCalculator";
import FeedingForm from "./FeedingForm";
import FeedingResultCard from "./FeedingResult";
import StreamingText from "@/components/ui/StreamingText";
import LoadingDots from "@/components/ui/LoadingDots";
import ErrorBanner from "@/components/ui/ErrorBanner";

export default function FeedingTab() {
  const [calcResult, setCalcResult] = useState<FR | null>(null);
  const { content, isStreaming, error, stream, reset } = useStream();

  async function handleSubmit(inputs: FeedingInputs) {
    const result = calculate(inputs);
    setCalcResult(result);
    reset();
    await stream("/api/feeding", { inputs, calculated: result });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Feeding Calculator</h2>
        <p className="text-sm text-gray-500">
          Calculate daily feed requirements and get expert feeding advice for your shrimp pond.
        </p>
      </div>

      <FeedingForm onSubmit={handleSubmit} disabled={isStreaming} />

      {calcResult && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Calculated Results</h3>
          <FeedingResultCard result={calcResult} />
        </div>
      )}

      <ErrorBanner error={error} />

      {(isStreaming || content) && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-teal-700">AI Feeding Advice</h3>
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
