"use client";

import { useStream } from "@/hooks/useStream";
import SymptomsForm from "./SymptomsForm";
import StreamingText from "@/components/ui/StreamingText";
import LoadingDots from "@/components/ui/LoadingDots";
import ErrorBanner from "@/components/ui/ErrorBanner";

export default function DiagnoseTab() {
  const { content, isStreaming, error, stream, reset } = useStream();

  async function handleSubmit(symptoms: string) {
    reset();
    await stream("/api/diagnose", { symptoms });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Disease Diagnosis</h2>
        <p className="text-sm text-gray-500">
          Describe your shrimp&apos;s symptoms and get an AI-powered diagnosis with treatment recommendations.
        </p>
      </div>

      <SymptomsForm onSubmit={handleSubmit} disabled={isStreaming} />

      <ErrorBanner error={error} />

      {(isStreaming || content) && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-teal-700">Diagnosis & Recommendations</h3>
          {isStreaming && content === "" ? (
            <LoadingDots />
          ) : (
            <StreamingText content={content} isStreaming={isStreaming} />
          )}
          {!isStreaming && content && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              ⚠️ This is an AI-generated diagnosis. For severe outbreaks, consult your local aquaculture officer or veterinarian.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
