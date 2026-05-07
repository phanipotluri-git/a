"use client";

import { useState } from "react";
import type { FeedingInputs } from "@/lib/types";
import { getSuggestedRate } from "./FeedingCalculator";

interface Props {
  onSubmit: (inputs: FeedingInputs) => void;
  disabled?: boolean;
}

const DEFAULT: FeedingInputs = {
  shrimpCount:        100000,
  avgWeightG:         5,
  growthStage:        "intermediate",
  feedingRatePercent: 6,
};

export default function FeedingForm({ onSubmit, disabled }: Props) {
  const [values, setValues] = useState<FeedingInputs>(DEFAULT);

  function set<K extends keyof FeedingInputs>(key: K, val: FeedingInputs[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function useSuggestedRate() {
    set("feedingRatePercent", getSuggestedRate(values.growthStage));
  }

  function handleStageChange(stage: FeedingInputs["growthStage"]) {
    setValues((prev) => ({
      ...prev,
      growthStage: stage,
      feedingRatePercent: getSuggestedRate(stage),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Total Shrimp Count</label>
          <input
            type="number"
            value={values.shrimpCount}
            onChange={(e) => set("shrimpCount", parseInt(e.target.value) || 0)}
            min={1}
            step={1000}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Average Weight (g)</label>
          <input
            type="number"
            value={values.avgWeightG}
            onChange={(e) => set("avgWeightG", parseFloat(e.target.value) || 0)}
            min={0.1}
            step={0.1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Growth Stage</label>
          <select
            value={values.growthStage}
            onChange={(e) => handleStageChange(e.target.value as FeedingInputs["growthStage"])}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300"
          >
            <option value="juvenile">Juvenile (&lt;2g)</option>
            <option value="intermediate">Intermediate (2–10g)</option>
            <option value="adult">Adult (&gt;10g)</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Feeding Rate (% body weight/day)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={values.feedingRatePercent}
              onChange={(e) => set("feedingRatePercent", parseFloat(e.target.value) || 0)}
              min={0.1}
              max={20}
              step={0.5}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300"
            />
            <button
              type="button"
              onClick={useSuggestedRate}
              className="shrink-0 rounded-lg border border-teal-300 px-2 py-1 text-xs text-teal-700 hover:bg-teal-50"
              title="Use industry suggested rate"
            >
              Suggested ({getSuggestedRate(values.growthStage)}%)
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled || values.shrimpCount <= 0}
        className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
      >
        {disabled ? "Getting AI Advice..." : "Calculate & Get Advice"}
      </button>
    </form>
  );
}
